import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = join(process.cwd(), "client/src");
const publicFiles = [
  "components/PublicLayout.tsx",
  "pages/Home.tsx",
  "pages/Areas.tsx",
  "pages/ContentPage.tsx",
  "pages/LiteraturePage.tsx",
  "pages/AreaPage.tsx",
  "pages/MeetingDetail.tsx",
  "pages/Meetings.tsx",
];
const sources = await Promise.all(publicFiles.map(async relative => [relative, await readFile(join(root, relative), "utf8")]));
const urls = new Set();
for (const [, source] of sources) {
  for (const match of source.matchAll(/(?:href|href:\s*)[=]?\s*["'`]([^"'`]+)["'`]/g)) urls.add(match[1]);
  for (const match of source.matchAll(/https?:\/\/[^"'`\s)}]+/g)) urls.add(match[0].replace(/[,;]+$/, ""));
}
const resolved = [...urls].filter(url => (url.startsWith("/") || url.startsWith("http")) && !url.includes("${")).sort();
const base = process.env.PUBLIC_BASE_URL ?? "http://127.0.0.1:3000";
const results = [];
for (const path of resolved) {
  const target = path.startsWith("http") ? path : new URL(path, base).toString();
  try {
    const response = await fetch(target, { method: "GET", redirect: "manual" });
    results.push({ path, status: response.status, ok: response.status >= 200 && response.status < 400, location: response.headers.get("location") ?? "" });
  } catch (error) {
    results.push({ path, status: 0, ok: false, error: error instanceof Error ? error.message : String(error) });
  }
}
console.log(JSON.stringify({ base, total: results.length, failed: results.filter(item => !item.ok).length, results }, null, 2));
if (results.some(item => !item.ok)) process.exitCode = 1;
