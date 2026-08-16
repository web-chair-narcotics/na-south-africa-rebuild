import fs from "node:fs";
import path from "node:path";

const uploadOutput = fs.readFileSync("/tmp/literature-upload-output.txt", "utf8");
const rows = [...uploadOutput.matchAll(/\[SUCCESS\] (\/home\/ubuntu\/upload\/([^ ]+\.pdf)) -> (\/manus-storage\/[^\s]+)/g)]
  .map(([, sourcePath, fileName, storageUrl]) => ({ sourcePath, fileName, storageUrl }))
  .filter(row => !row.fileName.startsWith("4.25x11_day-region-grouped"));

const titleOverrides = {
  "2306_PRMAT_2023.pdf": "NA & Persons Receiving Medication-Assisted Treatment",
  "3116_For-Newcomer-IP-16-English.pdf": "IP #16 — For the Newcomer",
  "3122_Welcome-IP-22-English.pdf": "IP #22 — Welcome to Narcotics Anonymous",
  "3130_MHR-IP-30-English.pdf": "IP #30 — Mental Health in Recovery",
  "A-Guide-to-Local-Service-in-Narcotics-Anonymous.pdf": "A Guide to Local Service in Narcotics Anonymous",
  "A-Resource-In-Your-Community.pdf": "A Resource in Your Community",
  "Area-Planning-Tool.pdf": "Area Planning Tool",
  "Behind-the-Walls.pdf": "Behind the Walls",
  "Bulletin-29-Regarding-Methadone-and-other-Drug-Replacement-Programs.pdf": "Bulletin 29 — Regarding Methadone and Other Drug Replacement Programs",
  "Disruptive-Violent-Behavior.pdf": "Disruptive and Violent Behavior",
  "EN2205-NA-Groups-and-MEdication-English.pdf": "NA Groups and Medication",
  "EN3101-IP-1-English.pdf": "IP #1 — Who, What, How, and Why",
  "EN3107-IP-7-English.pdf": "IP #7 — Am I an Addict?",
  "For-those-in-treatment.pdf": "For Those in Treatment",
  "Generic-Online-Meeting-Preamble-202001-1.pdf": "Generic Online Meeting Preamble",
  "Group-Booklet.pdf": "The Group Booklet",
  "Group-Treasurers-Workbook.pdf": "Group Treasurer’s Workbook",
  "Group-Trusted-Servants.pdf": "Group Trusted Servants",
  "HI-Basics.pdf": "H&I Basics",
  "HI-Handbook.pdf": "H&I Handbook",
  "In-Times-of-Illness-English.pdf": "In Times of Illness",
  "In-Times-of-Illness.pdf": "In Times of Illness",
  "Intro-Guide-to-NA.pdf": "An Introductory Guide to Narcotics Anonymous",
  "Inventory-Form-Group.pdf": "Group Inventory Form",
  "JASC-Policy.pdf": "JASC Policy",
  "NA-CHAIR-PREAMBLE-ONLINE.pdf": "NA Chair Preamble — Online Meetings",
  "NA-Groups-Medication.pdf": "NA Groups and Medication",
  "NA-SA-REGION-POLICY-Adopted-July-2023-updated-Oct-2024-49.pdf": "NA South Africa Region Policy Document",
  "NA-White-Booklet.pdf": "The NA White Booklet",
  "Predatory-Behaviour.pdf": "Predatory Behaviour",
  "Principles-and-Leadership-in-NA-Service.pdf": "Principles and Leadership in NA Service",
  "Social-Media-Our-Guiding-Principles.pdf": "Social Media and Our Guiding Principles",
  "Treasurers-Handbook.pdf": "Treasurer’s Handbook",
  "Twelve-Concepts.pdf": "Twelve Concepts for NA Service",
  "WCASC-Policy-Document-current-version.pdf": "WCASC Policy Document",
  "Working-Step-Four-in-Narcotics-Anonymous.pdf": "Working Step Four in Narcotics Anonymous",
  "kzn_chairs_preamble_template.pdf": "KZN Chairs Preamble Template",
};

const category = fileName => {
  if (/IP-|EN310|3116|3122|3130/.test(fileName)) return "Information pamphlets";
  if (/^(NA-White|In-Times|Intro-Guide|Behind|A-Resource|2306|Working-Step|Bulletin|For-those)/.test(fileName)) return "Recovery booklets";
  if (/Group|Inventory|Disruptive|NA-Groups|Social-Media|Principles/.test(fileName)) return "Group and service resources";
  if (/Guide|Area-Planning|Treasurers|HI-|JASC|Preamble/.test(fileName)) return "Service and meeting resources";
  if (/Policy|Predatory/.test(fileName)) return "Policies and local resources";
  return "Additional NA resources";
};

const description = (title, group) => {
  if (group === "Information pamphlets") return `${title} is an official NA information pamphlet offering focused, plain-language recovery information for members, newcomers, families, or people supporting NA services.`;
  if (group === "Recovery booklets") return `${title} is an NA recovery resource that introduces practical information, shared experience, or guidance relevant to recovery and staying connected to the fellowship.`;
  if (group === "Policies and local resources") return `${title} is a locally supplied NA policy or safeguarding resource. Read the document for the current adopted wording and local service context.`;
  if (group === "Group and service resources") return `${title} is a practical NA group or service resource intended to support trusted servants, group meetings, communication, or local fellowship work.`;
  if (group === "Service and meeting resources") return `${title} is a practical NA service or meeting resource for groups, areas, trusted servants, or people helping meetings operate effectively.`;
  return `${title} is a supplied NA resource available for reading or download from the South Africa literature library.`;
};

const usedSlugs = new Map();
const manifest = rows.map(({ fileName, storageUrl }) => {
  const title = titleOverrides[fileName] ?? fileName.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ");
  const group = category(fileName);
  const baseSlug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const occurrence = usedSlugs.get(baseSlug) ?? 0;
  usedSlugs.set(baseSlug, occurrence + 1);
  const fileSlug = fileName.toLowerCase().replace(/\.pdf$/i, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  const slug = occurrence === 0 ? baseSlug : `${baseSlug}-${fileSlug}`;
  return { slug, title, category: group, description: description(title, group), fileName, downloadUrl: storageUrl, format: "PDF" };
}).sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title) || a.slug.localeCompare(b.slug));

fs.mkdirSync("client/src/data", { recursive: true });
fs.writeFileSync("client/src/data/literatureManifest.ts", `export const literatureManifest = ${JSON.stringify(manifest, null, 2)} as const;\n\nexport type LiteratureManifestItem = (typeof literatureManifest)[number];\n`);
fs.writeFileSync("LITERATURE_UPLOAD_MANIFEST.json", JSON.stringify(manifest, null, 2) + "\n");
console.log(`Wrote ${manifest.length} literature items.`);
console.log(manifest.map(item => `${item.category}\t${item.title}\t${item.downloadUrl}`).join("\n"));
