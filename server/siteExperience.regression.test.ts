import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd());
const read = (relativePath: string) => readFileSync(resolve(root, relativePath), "utf8");

describe("five-site experience safeguards", () => {
  it("resets the destination scroll position after every internal route change", () => {
    const app = read("client/src/App.tsx");
    expect(app).toContain("function ScrollToTop()");
    expect(app).toContain("useLocation()");
    expect(app).toContain("window.scrollTo({ top: 0, left: 0, behavior: \"auto\" })");
    expect(app).toContain("<ScrollToTop />");
  });

  it("keeps a regional route alongside all four area routes", () => {
    const app = read("client/src/App.tsx");
    expect(app).toContain('/areas/south-africa-region');
    for (const slug of ["johannesburg", "cape-town", "pretoria", "kwazulu-natal"]) expect(app).toContain(`/areas/${slug}`);
  });

  it("keeps the homepage connected to its managed hero asset", () => {
    const home = read("client/src/pages/Home.tsx");
    expect(home).toContain("na-homepage-south-africa-region-hero-20260816_0f8b8fc2.jpg");
    expect(home).toContain('alt="South African coastal promenade and harbour at sunrise"');
    expect(home).toContain('loading="eager"');
    expect(home).toContain('fetchPriority="high"');
    expect(home).toContain("rgba(8,92,132,.84)");
  });

  it("keeps homepage shortcuts actionable and separates physical from online meeting paths", () => {
    const home = read("client/src/pages/Home.tsx");
    expect(home).toContain('href: "/meetings?meetingFormat=in_person"');
    expect(home).toContain('href: "/meetings?meetingFormat=online"');
    expect(home).toContain('href: "tel:+27861006962"');
    expect(home).toContain("Find an in-person meeting");
    expect(home).toContain("Find an online meeting");
    expect(home).toContain("never a physical address");
    expect(home).toContain("Take this step");
  });

  it("keeps the three homepage meeting-path cards equal height with aligned actions", () => {
    const home = read("client/src/pages/Home.tsx");
    expect(home).toContain("sm:auto-rows-fr sm:grid-cols-3");
    expect(home).toContain("min-h-[276px] h-full flex-col");
    expect(home).toContain("mt-auto pt-5 inline-flex");
  });

  it("uses the supplied managed NA South Africa mark with a readable header lockup", () => {
    const layout = read("client/src/components/PublicLayout.tsx");
    expect(layout).toContain('/manus-storage/na-south-africa-logo_601526a4.png');
    expect(layout).toContain('aria-label="Narcotics Anonymous South Africa home"');
    expect(layout).toContain('Narcotics Anonymous</span>');
    expect(layout).toContain('South Africa Region</span>');
    expect(layout).toContain('max-w-none');
  });

  it("uses format-specific copy for the online-only finder journey", () => {
    const meetings = read("client/src/pages/Meetings.tsx");
    const finder = read("client/src/components/MeetingFinder.tsx");
    expect(meetings).toContain("Join an NA meeting online.");
    expect(meetings).toContain("online meetings do not show a venue, map, or directions.");
    expect(finder).toContain('placeholder={onlineOnly ? "Meeting name or online group"');
    expect(finder).toContain('{meeting.meetingFormat !== "online" && <button');
    expect(finder).toContain('{!onlineOnly && <aside');
  });

  it("defaults the finder to in-person and keeps online cards area-neutral and mobile-readable", () => {
    const finder = read("client/src/components/MeetingFinder.tsx");
    expect(finder).toContain('meetingFormat: "in_person"');
    expect(finder).toContain('meeting.meetingFormat !== "online" ? <span');
    expect(finder).toContain('function decodeHtmlEntities');
    expect(finder).toContain('.replace(/&amp;/g, "&")');
    expect(finder).toContain('className="min-w-0 break-words"');
  });

  it("keeps online meeting details area-neutral and map-free", () => {
    const detail = read("client/src/pages/MeetingDetail.tsx");
    expect(detail).toContain('<p className="eyebrow mt-10">Online meeting</p>');
    expect(detail).toContain('meeting.meetingFormat === "online" ? <ExternalLink');
    expect(detail).toContain('meeting.meetingFormat !== "online" ? <p className="eyebrow mt-10">');
  });

  it("keeps meeting-detail notes readable and removes repeated address parts", () => {
    const detail = read("client/src/pages/MeetingDetail.tsx");
    expect(detail).toContain("function decodeHtmlEntities");
    expect(detail).toContain('.replace(/&amp;/g, "&")');
    expect(detail).toContain("parts.filter((part, index) => parts.indexOf(part) === index)");
    expect(detail).toContain("decodeHtmlEntities(meeting.specialNotes)");
  });

  it("keeps emergency notices independent of meeting status", () => {
    const schema = read("drizzle/schema.ts");
    const admin = read("server/routers/admin.ts");
    const layout = read("client/src/components/PublicLayout.tsx");
    const adminUi = read("client/src/pages/AdminPortal.tsx");
    expect(schema).toContain('mysqlTable("emergencyNotices"');
    expect(admin).toContain("emergency: router");
    expect(layout).toContain('trpc.emergency.active.useQuery()');
    expect(layout).toContain('role="alert"');
    expect(adminUi).toContain("It does not publish, reactivate, or change any meeting record.");
  });

  it("keeps the five image filenames and acceptance contract traceable", () => {
    const prompts = read("AREA_SITE_IMAGE_PROMPTS.md");
    for (const filename of [
      "na-region-south-africa-hero.webp",
      "na-area-johannesburg-hero.webp",
      "na-area-cape-town-hero.webp",
      "na-area-pretoria-hero.webp",
      "na-area-kwazulu-natal-hero.webp",
    ]) expect(prompts).toContain(filename);
    expect(prompts).toContain("2400 × 1350 px");
    expect(prompts).toContain("left third");
  });
});
