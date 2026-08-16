import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const root = process.cwd();
const csvPath = resolve(root, "meeting_qa_register.csv");

function parseCsv(text) {
  const rows = [];
  let row = [];
  let cell = "";
  let quoted = false;
  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    const next = text[index + 1];
    if (character === '"' && quoted && next === '"') {
      cell += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(cell);
      cell = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && next === "\n") index += 1;
      row.push(cell);
      if (row.some(value => value.length > 0)) rows.push(row);
      row = [];
      cell = "";
    } else {
      cell += character;
    }
  }
  row.push(cell);
  if (row.some(value => value.length > 0)) rows.push(row);
  return rows;
}

const rows = parseCsv(readFileSync(csvPath, "utf8"));
const headers = rows.shift();
const records = rows.map(row => Object.fromEntries(headers.map((header, index) => [header, row[index] ?? ""])));

const byArea = new Map();
for (const record of records) {
  const area = record.area === "Kwazulu-Natal" ? "KwaZulu-Natal" : (record.area || "Unassigned");
  const bucket = byArea.get(area) ?? { area, total: 0, notStarted: 0, pendingHigh: 0, inactive: 0, online: 0, inPerson: 0 };
  bucket.total += 1;
  if (record.qa_status === "Not started") bucket.notStarted += 1;
  if (record.priority === "High") bucket.pendingHigh += 1;
  if (record.format === "inactive") bucket.inactive += 1;
  if (record.format === "online") bucket.online += 1;
  if (record.format === "in_person") bucket.inPerson += 1;
  byArea.set(area, bucket);
}

const summaryRows = [...byArea.values()].sort((left, right) => left.area.localeCompare(right.area));
const csvOutput = [
  "area,total_staged,qa_not_started,high_priority,inactive,online,in_person",
  ...summaryRows.map(row => [row.area, row.total, row.notStarted, row.pendingHigh, row.inactive, row.online, row.inPerson].join(",")),
].join("\n") + "\n";
writeFileSync(resolve(root, "meeting_qa_summary_by_area.csv"), csvOutput);

const pageRows = [
  ["National / unassigned", 52],
  ["Johannesburg", 16],
  ["KwaZulu-Natal", 6],
  ["Pretoria", 7],
];
const pageTotal = pageRows.reduce((total, [, count]) => total + count, 0);
const inactiveTotal = summaryRows.reduce((total, row) => total + row.inactive, 0);
const onlineTotal = summaryRows.reduce((total, row) => total + row.online, 0);
const inPersonTotal = summaryRows.reduce((total, row) => total + row.inPerson, 0);
const highPriorityTotal = summaryRows.reduce((total, row) => total + row.pendingHigh, 0);

const markdown = `# Publication Readiness Register

**Generated from:** \`contentPages\` and \`meetings\` database status summaries collected on 16 August 2026, plus \`meeting_qa_register.csv\`. This register does not approve or publish content. It separates technically complete migration work from decisions that require authorised NA South Africa review.

## Regional page publication queue

| Area association in the content model | Draft-staged pages | Required authorised decision |
|---|---:|---|
${pageRows.map(([area, count]) => `| ${area} | ${count} | Review source fidelity, current contact details, links, and publication suitability; then submit or publish through the national workflow. |`).join("\n")}
| **Total** | **${pageTotal}** | **No bulk publication has been performed.** |

The \`National / unassigned\` label is a content-model association, not a claim of geographic ownership. These pages must be assigned or explicitly retained as national content during review.

## Legacy meeting review register

The historical QA register contains **${records.length} staged meeting records**. It records source evidence and the required national review items; it does not override the live meeting table. The live application currently contains **307 published** meetings and **21 archived** records, while the register preserves the remaining individual confirmation workflow.

| Area | Staged records | QA not started | High priority | Inactive | Online | In person |
|---|---:|---:|---:|---:|---:|---:|
${summaryRows.map(row => `| ${row.area} | ${row.total} | ${row.notStarted} | ${row.pendingHigh} | ${row.inactive} | ${row.online} | ${row.inPerson} |`).join("\n")}
| **Total** | **${records.length}** | **${records.filter(record => record.qa_status === "Not started").length}** | **${highPriorityTotal}** | **${inactiveTotal}** | **${onlineTotal}** | **${inPersonTotal}** |

Every record requires an authorised reviewer to complete the visible quality gate: **address verified**, **map pin confirmed**, **spelling checked**, and **contact confirmed**. For online meetings, a physical map pin may be marked *not applicable* only when the meeting is not represented as an exact in-person venue. Inactive records remain archived until an authorised reactivation decision.

## Approval boundary

| Work item | Technical state | Required next owner |
|---|---|---|
| Draft regional pages | Imported and staged; no automatic publication | National content reviewer with area confirmation |
| Meeting review register | Source evidence and per-record QA columns are prepared | National reviewer and relevant area administrator |
| Public legacy URLs | Destination decisions and fallback routing are in place | Content reviewer before changing any draft destination to public content |
| Managed media | Canonical attachment linkage and managed URLs verified | Content reviewer when inserting media into approved pages |
| Email workflow | In-app notifications available; external provider intentionally unconfigured | Organisation owner after selecting an approved transactional email provider |
| Native mobile keyboard pass | Desktop harness and mobile captures completed; native interactive pass remains open | Organisation reviewer on a real mobile browser or responsive device lab |

## Supporting files

The detailed meeting breakdown is stored in \`meeting_qa_summary_by_area.csv\`. Per-record source evidence is retained in \`meeting_qa_register.csv\`, while URL decisions and media linkage remain in the migration and media manifests.
`;
writeFileSync(resolve(root, "PUBLICATION_READINESS_REGISTER.md"), markdown);

console.log(JSON.stringify({
  stagedMeetingRecords: records.length,
  pageDraftTotal: pageTotal,
  meetingSummaryRows: summaryRows.length,
  outputFiles: ["meeting_qa_summary_by_area.csv", "PUBLICATION_READINESS_REGISTER.md"],
}, null, 2));
