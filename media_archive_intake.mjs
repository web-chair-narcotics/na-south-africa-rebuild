import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createReadStream } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import crypto from 'node:crypto';

const execFileAsync = promisify(execFile);
const args = new Map();
for (let i = 2; i < process.argv.length; i += 1) {
  const [key, value] = process.argv[i].split('=', 2);
  args.set(key, value ?? true);
}
const zipPath = args.get('--zip');
const manifestPath = args.get('--manifest');
const metadataPath = args.get('--metadata');
const outputPath = args.get('--output') || '/home/ubuntu/na-south-africa-rebuild/media_intake_report.json';

const report = { mode: zipPath ? 'zip' : metadataPath ? 'metadata-only' : 'not-run', zipPath: zipPath || null, manifestPath: manifestPath || null, metadataPath: metadataPath || null, files: [], duplicateNames: [], missingManifestFiles: [], unsafePaths: [], linkedSourcePages: [], status: 'pending-input' };

if (!zipPath && !metadataPath) {
  console.log('Usage: node media_archive_intake.mjs --zip=/path/public-media.zip --manifest=/path/media_manifest.csv --output=/path/report.json');
  process.exit(0);
}

if (metadataPath) {
  const metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
  report.mode = 'metadata-only';
  report.files = metadata.map((row) => ({ filename: row.title || row.guid || row.post_id, sourceUrl: row.link || row.guid || null, sourceExport: row.source_export }));
  report.linkedSourcePages = [...new Set(metadata.map((row) => row.source_export).filter(Boolean))];
  report.status = 'metadata-inventory-only';
} else {
  const tempDir = `/tmp/na-media-${crypto.randomUUID()}`;
  await fs.mkdir(tempDir, { recursive: true });
  try {
    const { stdout } = await execFileAsync('unzip', ['-Z1', zipPath]);
    const names = stdout.split('\n').map((name) => name.trim()).filter(Boolean);
    report.unsafePaths = names.filter((name) => path.isAbsolute(name) || name.split('/').includes('..'));
    const baseNames = new Map();
    for (const name of names) {
      if (name.endsWith('/')) continue;
      const base = path.basename(name).toLowerCase();
      baseNames.set(base, [...(baseNames.get(base) || []), name]);
    }
    report.duplicateNames = [...baseNames.entries()].filter(([, values]) => values.length > 1).map(([filename, values]) => ({ filename, paths: values }));
    if (report.unsafePaths.length) throw new Error('Unsafe archive paths found');
    await execFileAsync('unzip', ['-q', '-o', zipPath, '-d', tempDir]);
    report.files = [];
    for (const name of names.filter((entry) => !entry.endsWith('/'))) {
      const filePath = path.join(tempDir, name);
      const stat = await fs.stat(filePath);
      report.files.push({ relativePath: name, size: stat.size, sha256: await new Promise((resolve, reject) => { const hash = crypto.createHash('sha256'); createReadStream(filePath).on('data', (chunk) => hash.update(chunk)).on('end', () => resolve(hash.digest('hex'))).on('error', reject); }) });
    }
    if (manifestPath) {
      const manifest = await fs.readFile(manifestPath, 'utf8');
      const lines = manifest.split(/\r?\n/).filter(Boolean);
      const header = lines.shift().split(',').map((cell) => cell.trim());
      const fileIndex = header.indexOf('relative_file_path');
      if (fileIndex >= 0) {
        const archivePaths = new Set(report.files.map((file) => file.relativePath));
        const manifestPaths = lines.map((line) => line.split(',')[fileIndex]?.trim()).filter(Boolean);
        report.missingManifestFiles = manifestPaths.filter((entry) => !archivePaths.has(entry));
      }
    }
    report.status = report.unsafePaths.length || report.missingManifestFiles.length ? 'review-required' : 'validated-for-storage-upload';
  } finally {
    await fs.rm(tempDir, { recursive: true, force: true });
  }
}
await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
console.log(JSON.stringify({ status: report.status, fileCount: report.files.length, duplicateNameCount: report.duplicateNames.length, missingManifestCount: report.missingManifestFiles.length, outputPath }, null, 2));
