import fs from 'node:fs/promises';
import mysql from 'mysql2/promise';

const source = JSON.parse(await fs.readFile('/home/ubuntu/na-source-extract/uploaded-regional/regional_pages.json', 'utf8'));
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not available');
const db = await mysql.createPool({ uri: process.env.DATABASE_URL, connectionLimit: 4 });
const [areas] = await db.query('SELECT id, slug, name FROM areas');
const areaMap = new Map(areas.map((area) => [area.name.toLowerCase().replace('kwazulu', 'kwazulu'), area.id]));
const areaForExport = (file) => {
  if (file.includes('johannesburg')) return areaMap.get('johannesburg') ?? null;
  if (file.includes('kwazulu')) return areaMap.get('kwazulu-natal') ?? null;
  if (file.includes('pretoria')) return areaMap.get('pretoria') ?? null;
  if (file.includes('westerncape')) return areaMap.get('western-cape') ?? null;
  return null;
};
const slugFromUrl = (url, postId) => {
  const clean = String(url || '').replace(/\/$/, '');
  const candidate = clean.split('/').pop();
  return candidate && candidate !== 'na.org.za' ? candidate.slice(0, 180) : `source-page-${postId}`;
};
let staged = 0;
for (const page of source) {
  if (!page.title || !page.link) continue;
  const areaId = areaForExport(page.source_export);
  const slug = slugFromUrl(page.link, page.post_id);
  const sourceNote = `Staged from ${page.source_export}; legacy URL: ${page.link}`;
  await db.query(
    `INSERT INTO contentPages (areaId, slug, title, excerpt, body, status, createdAt, updatedAt)
     VALUES (?, ?, ?, ?, ?, 'draft', NOW(), NOW())
     ON DUPLICATE KEY UPDATE title = VALUES(title), excerpt = VALUES(excerpt), body = VALUES(body), updatedAt = NOW()`,
    [areaId, slug, page.title, sourceNote, page.content || `<p>${page.title}</p>`],
  );
  staged += 1;
}
await db.end();
const report = `# Regional WordPress Page Staging\n\nStaged **${staged}** public regional WordPress page records into the rebuilt content model as **drafts**. No page was published automatically. Each draft retains its source export and legacy URL in the excerpt metadata for national review and redirect assignment.\n`;
await fs.writeFile('/home/ubuntu/na-south-africa-rebuild/regional_page_staging_report.md', report);
console.log(report);
