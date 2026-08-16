import { ArrowRight, MapPinned, Phone } from "lucide-react";
import { Link } from "wouter";
import PublicLayout from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";

type AreaConfig = {
  name: string;
  directoryName: string;
  eyebrow: string;
  title: string;
  summary: string;
  detail: string;
  className: string;
  accent: string;
  imagePromptFile: string;
};

const configs: Record<string, AreaConfig> = {
  johannesburg: {
    name: "Johannesburg",
    directoryName: "Johannesburg",
    eyebrow: "Johannesburg area",
    title: "Find a meeting that fits your next step.",
    summary: "Local recovery information for Johannesburg, connected to the national NA South Africa directory.",
    detail: "Search the Johannesburg meeting list by day, time, meeting type, and format. Each published result carries its verified venue details, map pin, and direct directions link.",
    className: "area-johannesburg",
    accent: "#2F9B3E",
    imagePromptFile: "area-johannesburg-hero.webp",
  },
  "cape-town": {
    name: "Cape Town",
    directoryName: "Western Cape",
    eyebrow: "Cape Town area",
    title: "A local place to begin again.",
    summary: "Explore the Cape Town area directory and connect with the wider recovery community across the Western Cape.",
    detail: "The national finder brings together the published Western Cape records in one clear, mobile-first search. Check the day, format, venue, and directions before you leave.",
    className: "area-cape-town",
    accent: "#EEEEEE",
    imagePromptFile: "area-cape-town-hero.webp",
  },
  pretoria: {
    name: "Pretoria",
    directoryName: "Pretoria",
    eyebrow: "Pretoria area",
    title: "Recovery is closer than it may feel.",
    summary: "A dedicated Pretoria starting point for finding local NA meetings and practical next steps.",
    detail: "Use the area filter to see published Pretoria records, then open a meeting result for its schedule, venue information, map pin, and one-tap Google Maps directions.",
    className: "area-pretoria",
    accent: "#EEEEEE",
    imagePromptFile: "area-pretoria-hero.webp",
  },
  "kwazulu-natal": {
    name: "KwaZulu-Natal",
    directoryName: "KwaZulu-Natal",
    eyebrow: "KwaZulu-Natal area",
    title: "Find your people. Find your meeting.",
    summary: "A welcoming route into the KwaZulu-Natal meeting directory, with local information connected nationally.",
    detail: "Search published KwaZulu-Natal meetings by day, time, type, or format. Meeting cards keep the practical details close, including venue, contact information, and directions.",
    className: "area-kwazulu-natal",
    accent: "#EEEEEE",
    imagePromptFile: "area-kwazulu-natal-hero.webp",
  },
};

export default function AreaPage({ slug }: { slug: string }) {
  const area = configs[slug] ?? configs.johannesburg;
  const finderHref = `/meetings?area=${encodeURIComponent(area.directoryName)}`;
  return (
    <PublicLayout>
      <main className={`area-page ${area.className}`}>
        <section className="relative overflow-hidden bg-[#026AB9] py-16 text-white sm:py-24">
          <div className="absolute inset-0 opacity-40" aria-hidden="true"><div className="area-pattern h-full w-full" /></div>
          <div className="site-container relative grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:items-end">
            <div>
              <p className="eyebrow text-[#EEEEEE]">{area.eyebrow}</p>
              <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.02] tracking-[-0.05em] sm:text-7xl">{area.title}</h1>
              <p className="mt-7 max-w-2xl text-lg leading-8 text-[#F8F8F8]">{area.summary}</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="min-h-12 rounded-xl bg-[#2F9B3E] px-5 font-bold text-white hover:bg-[#20752C]"><Link href={finderHref}>Find a {area.name} meeting <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link></Button>
                <Button asChild variant="outline" className="min-h-12 rounded-xl border-white/40 bg-transparent px-5 text-white hover:bg-white/10"><Link href="/contact"><Phone className="mr-2 h-4 w-4" aria-hidden="true" />Contact NA South Africa</Link></Button>
              </div>
            </div>
            <div className="area-visual min-h-64 rounded-[2rem] border border-white/20 p-6 sm:min-h-80" role="img" aria-label={`${area.name} area visual placeholder; approved generated hero artwork will be inserted as ${area.imagePromptFile}.`}>
              <div className="flex h-full flex-col justify-between"><span className="text-sm font-semibold tracking-[0.14em] text-white/70">LOCAL RECOVERY / NATIONAL CONNECTION</span><span className="max-w-xs font-serif text-4xl leading-tight" style={{ color: area.accent }}>{area.name}</span></div>
            </div>
          </div>
        </section>
        <section className="site-container grid gap-8 py-14 sm:py-20 lg:grid-cols-[1fr_.8fr]">
          <div><p className="eyebrow">The local directory</p><h2 className="mt-3 max-w-2xl font-serif text-4xl leading-tight tracking-[-0.04em] text-[#54595F]">A practical way to take the next step.</h2><p className="mt-6 max-w-2xl text-lg leading-8 text-[#54595F]">{area.detail}</p><Link href={finderHref} className="mt-8 inline-flex min-h-11 items-center gap-2 font-bold text-[#387CBB] underline decoration-[#387CBB] underline-offset-4">Open the {area.name} directory <ArrowRight className="h-4 w-4" aria-hidden="true" /></Link></div>
          <aside className="rounded-[2rem] bg-[#F8F8F8] p-7 sm:p-9"><MapPinned className="h-6 w-6 text-[#085C84]" aria-hidden="true" /><h2 className="mt-5 font-serif text-3xl text-[#54595F]">Before you go</h2><p className="mt-4 leading-7 text-[#54595F]">Meeting information can change. Check the current result, venue, time, and directions before travelling. If you need immediate help, call the national phoneline.</p><a href="tel:+27861006962" className="mt-6 inline-flex min-h-11 items-center gap-2 font-bold text-[#54595F] underline underline-offset-4">Call 0861 00 6962 <ArrowRight className="h-4 w-4" aria-hidden="true" /></a></aside>
        </section>
      </main>
    </PublicLayout>
  );
}
