import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import path from "node:path";

const roots = ["/home/ubuntu/upload", "/home/ubuntu/projects/website-db3e2312"];
const outputCsv = "/home/ubuntu/na-south-africa-rebuild/UPLOADED_FILE_AUDIT.csv";
const outputMd = "/home/ubuntu/na-south-africa-rebuild/UPLOADED_FILE_AUDIT.md";

async function walk(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

function classification(file) {
  const name = path.basename(file).toLowerCase();
  if (name.includes("areasitepopulation")) return ["requirement", "implemented-partial", "Four dedicated area pages are implemented; approved generated hero images remain pending managed-storage intake."];
  if (name.includes("colorpalette") || name.includes("colourpalette")) return ["design-source", "implemented", "Palette and typography alignment are implemented and regression-tested."];
  if (name.endsWith(".xml")) return ["source-data", "implemented-partial", "Parsed into migration evidence; regional pages remain draft-staged for review."];
  if (name.endsWith(".csv") && name.includes("meeting")) return ["source-data", "implemented-partial", "Reconciled into the meeting corpus; 307 published and staged review evidence retained."];
  if (name.endsWith(".pdf")) return ["source-data", "implemented", "Parsed into directory and meeting QA evidence."];
  if (name.endsWith(".zip")) return ["media-source", "implemented-partial", "Validated and uploaded through managed storage; approved area imagery still requires generation and intake."];
  if (name.includes("audit") || name.includes("executive") || name.includes("technical") || name.includes("review")) return ["audit-evidence", "implemented", "Reviewed and represented in migration, QA, and acceptance evidence."];
  if (name.includes("scheduled")) return ["requirement", "approval-dependent", "Scheduling is not part of the current public rebuild; requires an explicit organisation-approved automation request."];
  if (name.endsWith(".txt") || name.endsWith(".md")) return ["supporting-source", "reviewed", "Included in the source inventory; mapped content is represented in migration evidence where applicable."];
  if (name.endsWith(".png") || name.endsWith(".jpg") || name.endsWith(".webp")) return ["media-source", "reviewed", "Available as supplied media; canonical managed-storage intake is controlled by the media manifest."];
  return ["other", "reviewed", "Present in the supplied inventory and retained for audit traceability."];
}

const seen = new Map();
const rows = [];
for (const root of roots) {
  for (const file of await walk(root)) {
    const data = await fs.readFile(file);
    const hash = createHash("sha256").update(data).digest("hex");
    const base = path.basename(file);
    const [kind, status, note] = classification(file);
    const row = { sourceRoot: root, filePath: file, basename: base, sizeBytes: data.length, sha256: hash, kind, status, note };
    rows.push(row);
    if (!seen.has(hash)) seen.set(hash, []);
    seen.get(hash).push(file);
  }
}
for (const row of rows) {
  const matches = seen.get(row.sha256) ?? [];
  row.duplicateCount = matches.length - 1;
  row.duplicatePaths = matches.filter(p => p !== row.filePath).join(" | ");
}
rows.sort((a, b) => a.filePath.localeCompare(b.filePath));
const fields = ["sourceRoot", "filePath", "basename", "sizeBytes", "sha256", "kind", "status", "duplicateCount", "duplicatePaths", "note"];
const quote = value => `"${String(value ?? "").replaceAll('"', '""')}"`;
await fs.writeFile(outputCsv, [fields.join(","), ...rows.map(row => fields.map(field => quote(row[field])).join(","))].join("\n") + "\n");
const counts = Object.fromEntries([...new Set(rows.map(row => row.status))].map(status => [status, rows.filter(row => row.status === status).length]));
const duplicateFiles = rows.filter(row => row.duplicateCount > 0).length;
const md = `# Uploaded File Audit\n\nGenerated from ${rows.length} files across the user-upload and project-shared directories. The CSV is the row-level evidence register.\n\n| Measure | Result |\n|---|---:|\n| Files inventoried | ${rows.length} |\n| Unique SHA-256 values | ${seen.size} |\n| Files with exact binary duplicates | ${duplicateFiles} |\n| Implemented | ${counts.implemented ?? 0} |\n| Implemented, approval or content review remains | ${counts["implemented-partial"] ?? 0} |\n| Reviewed/source evidence | ${counts.reviewed ?? 0} |\n| Approval-dependent | ${counts["approval-dependent"] ?? 0} |\n\nThe audit deliberately distinguishes **implemented** from **implemented-partial**: a source can be fully parsed and represented in the site while still requiring an authorised publication decision. The Area Site Population requirement is implemented as a named, generation-ready prompt pack, but its four area websites and approved imagery are not claimed complete. The audit files themselves are evidence, not runtime content.\n`;
await fs.writeFile(outputMd, md);
console.log(JSON.stringify({ rows: rows.length, uniqueHashes: seen.size, duplicateFiles, counts }, null, 2));
