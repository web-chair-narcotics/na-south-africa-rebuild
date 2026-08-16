import { BookOpen, Download, ExternalLink, FileText, Library } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";

type LiteratureItem = { title: string; href: string; code?: string };

const officialCatalogue = "https://na.org/literature/recovery-literature-in-english-usa/";
const purchaseCatalogue = "https://na.org/purchase-na-literature/";

const southAfricaTitles = [
  "Basic Text",
  "Step Working Guide",
  "How It Works and Why",
  "Sponsorship Guide",
  "Living Clean",
  "Just for Today",
  "Guiding Principles",
];

const booklets: LiteratureItem[] = [
  { title: "NA White Booklet: Narcotics Anonymous", href: "https://na.org/e-lit/white-booklet/" },
  { title: "The Group Booklet", href: "https://na.org/e-lit/the-group-booklet/" },
  { title: "Twelve Concepts for NA Service", href: "https://na.org/e-lit/twelve-concepts-for-na-service/" },
  { title: "An Introductory Guide to Narcotics Anonymous", href: "https://na.org/e-lit/an-introductory-guide-to-na/" },
  { title: "Behind the Walls", href: "https://na.org/e-lit/behind-the-walls/" },
  { title: "In Times of Illness", href: "https://na.org/e-lit/in-times-of-illness/" },
  { title: "Working Step Four in Narcotics Anonymous", href: "https://na.org/e-lit/working-step-four-in-na/" },
  { title: "Narcotics Anonymous: A Resource in Your Community", href: "https://na.org/e-lit/na-a-resource-in-your-community/" },
];

const informationPamphlets: LiteratureItem[] = [
  ["1", "Who, What, How, and Why", "ip-1-who-what-how-and-why"], ["2", "The Group", "ip-2-the-group"], ["5", "Another Look", "ip-5-another-look"], ["6", "Recovery & Relapse", "ip-6-recovery-relapse"], ["7", "Am I an Addict?", "ip-7-am-i-an-addict"], ["8", "Just for Today", "ip-8-just-for-today"], ["9", "Living the Program", "ip-9-living-the-program"], ["11", "Sponsorship", "ip-11-sponsorship"], ["12", "The Triangle of Self-Obsession", "ip-12-the-triangle-of-self-obsession"], ["13", "By Young Addicts…", "ip-13-by-young-addicts"], ["14", "One Addict’s Experience…", "ip-14-one-addicts-experience"], ["15", "PI and the NA Member", "ip-15-pi-and-the-na-member"], ["16", "For the Newcomer", "ip-16-for-the-newcomer"], ["17", "For Those in Treatment", "ip-17-for-those-in-treatment"], ["19", "Self-Acceptance", "ip-19-self-acceptance"], ["20", "Hospitals & Institutions Service and the NA Member", "ip-20-hi-service-and-the-na-member"], ["21", "Staying Clean in Isolation", "ip-21-staying-clean-in-isolation"], ["22", "Welcome to Narcotics Anonymous", "ip-22-welcome-to-na"], ["23", "Staying Clean on the Outside", "ip-23-staying-clean-on-the-outside"], ["24", "Money Matters, Self-Support in NA", "ip-24-money-matters-self-support-in-na"], ["26", "Accessibility for Those with Additional Needs", "ip-26-accessibility"], ["27", "For the Parents…", "ip-27-for-the-parents"], ["28", "Funding NA Services", "ip-28-funding-na-services"], ["29", "An Introduction to NA Meetings", "ip-29-introduction-to-na-meetings"], ["30", "Mental Health in Recovery", "ip-30-mental-health-in-recovery"],
].map(([code, title, slug]) => ({ code: `IP #${code}`, title, href: `https://na.org/e-lit/${slug}/` }));

const groupReadings: LiteratureItem[] = [
  { title: "How It Works", href: "https://na.org/e-lit/how-it-works-group-reading/" },
  { title: "Just for Today", href: "https://na.org/e-lit/just-for-today-group-reading/" },
  { title: "The Twelve Traditions of NA", href: "https://na.org/e-lit/the-twelve-traditions-of-na-group-reading/" },
  { title: "We Do Recover", href: "https://na.org/e-lit/we-do-recover-group-reading/" },
  { title: "What Is the Narcotics Anonymous Program?", href: "https://na.org/e-lit/what-is-the-na-program-group-reading/" },
  { title: "Who Is an Addict?", href: "https://na.org/e-lit/who-is-an-addict/" },
  { title: "Why Are We Here?", href: "https://na.org/e-lit/why-are-we-here-group-reading/" },
];

function ResourceCard({ item }: { item: LiteratureItem }) {
  return <a href={item.href} target="_blank" rel="noreferrer" className="group flex min-h-[154px] flex-col rounded-2xl border border-[#DDE6EB] bg-white p-5 shadow-[0_8px_24px_rgba(20,45,42,0.04)] transition hover:-translate-y-0.5 hover:border-[#085C84]/35 hover:shadow-[0_14px_30px_rgba(8,92,132,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#387CBB]">
    <div className="flex items-start justify-between gap-3"><span className="inline-flex rounded-full bg-[#EAF5EC] px-3 py-1 text-xs font-bold text-[#20752C]">{item.code ?? "Official eLit"}</span><ExternalLink className="h-4 w-4 shrink-0 text-[#085C84]" aria-hidden="true" /></div>
    <h3 className="mt-5 text-base font-bold leading-6 text-[#54595F]">{item.title}</h3>
    <span className="mt-auto pt-5 inline-flex items-center text-sm font-bold text-[#085C84] underline decoration-[#2F9B3E] decoration-2 underline-offset-4">Open official resource <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" /></span>
  </a>;
}

function ResourceSection({ title, eyebrow, items }: { title: string; eyebrow: string; items: LiteratureItem[] }) {
  return <section className="mt-16 sm:mt-20"><p className="eyebrow text-[#085C84]">{eyebrow}</p><div className="mt-3 flex flex-wrap items-end justify-between gap-4"><h2 className="font-serif text-3xl leading-tight tracking-[-0.035em] text-[#54595F] sm:text-4xl">{title}</h2><p className="text-sm text-[#7A7A7A]">{items.length} verified official resources</p></div><div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{items.map(item => <ResourceCard key={item.href} item={item} />)}</div></section>;
}

export default function LiteraturePage() {
  return <PublicLayout><main>
    <section className="border-b border-[#DDE6EB] bg-[#F8F8F8] py-16 sm:py-24"><div className="site-container max-w-5xl"><div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F9B3E] text-white"><Library className="h-6 w-6" aria-hidden="true" /></div><p className="eyebrow mt-7 text-[#085C84]">NA Literature</p><h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.04] tracking-[-0.04em] text-[#54595F] sm:text-6xl">Official resources for learning about NA and recovery.</h1><p className="mt-6 max-w-3xl text-lg leading-8 text-[#54595F] sm:text-xl">The South African source page introduces seven core books. This library adds every verified public English booklet, informational pamphlet, and group reading from NA World Services in one clear place.</p></div></section>
    <section className="site-container py-14 sm:py-20"><div className="rounded-3xl border border-[#C7DFD1] bg-[#F2FAF4] p-6 sm:p-8"><div className="flex gap-4"><Download className="mt-1 h-6 w-6 shrink-0 text-[#20752C]" aria-hidden="true" /><div><h2 className="font-serif text-2xl text-[#54595F]">Use official literature links.</h2><p className="mt-3 max-w-4xl leading-7 text-[#54595F]">The links below open the official NA World Services eLit pages. They are kept external so readers receive the current authorised version and so this site does not copy or re-host copyrighted literature.</p><a href={officialCatalogue} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center font-bold text-[#085C84] underline decoration-[#2F9B3E] decoration-2 underline-offset-4">Open the complete official literature catalogue <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" /></a></div></div></div>
      <section className="mt-16"><p className="eyebrow text-[#085C84]">South Africa source collection</p><h2 className="mt-3 font-serif text-3xl leading-tight tracking-[-0.035em] text-[#54595F] sm:text-4xl">The seven titles introduced on the regional site.</h2><div className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{southAfricaTitles.map(title => <a key={title} href={purchaseCatalogue} target="_blank" rel="noreferrer" className="flex min-h-[146px] flex-col rounded-2xl border border-[#DDE6EB] bg-white p-5 shadow-[0_8px_24px_rgba(20,45,42,0.04)] transition hover:-translate-y-0.5 hover:border-[#085C84]/35 hover:shadow-[0_14px_30px_rgba(8,92,132,0.13)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#387CBB]"><BookOpen className="h-5 w-5 text-[#2F9B3E]" aria-hidden="true" /><h3 className="mt-5 text-base font-bold leading-6 text-[#54595F]">{title}</h3><span className="mt-auto pt-5 inline-flex items-center text-sm font-bold text-[#085C84] underline decoration-[#2F9B3E] decoration-2 underline-offset-4">Check official availability <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" /></span></a>)}</div></section>
      <ResourceSection eyebrow="Public booklets" title="Booklets and introductory resources." items={booklets} />
      <ResourceSection eyebrow="Information pamphlets" title="Information pamphlets (IPs)." items={informationPamphlets} />
      <ResourceSection eyebrow="Meeting resources" title="Group readings." items={groupReadings} />
      <section className="mt-16 rounded-3xl bg-[#085C84] p-7 text-white sm:p-10"><FileText className="h-7 w-7 text-[#2F9B3E]" aria-hidden="true" /><h2 className="mt-6 font-serif text-3xl leading-tight">Looking for a specific edition, language, or printed copy?</h2><p className="mt-4 max-w-2xl leading-7 text-white/90">Use the official NA World Services catalogue for available languages and editions, or its online store for purchase options.</p><a href={purchaseCatalogue} target="_blank" rel="noreferrer" className="mt-7 inline-flex min-h-12 items-center rounded-xl bg-[#2F9B3E] px-5 py-3 font-bold text-white hover:bg-[#20752C]">Visit official literature availability <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" /></a></section>
    </section>
  </main></PublicLayout>;
}
