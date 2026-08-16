import { ArrowRight, MapPinned } from "lucide-react";
import { Link } from "wouter";
import PublicLayout from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";

const areas = [
  { name: "South Africa Region", slug: "south-africa-region", directoryName: "South Africa Region" },
  { name: "Johannesburg", slug: "johannesburg", directoryName: "Johannesburg" },
  { name: "Cape Town", slug: "cape-town", directoryName: "Western Cape" },
  { name: "Pretoria", slug: "pretoria", directoryName: "Pretoria" },
  { name: "KwaZulu-Natal", slug: "kwazulu-natal", directoryName: "KwaZulu-Natal" },
];

export default function Areas() {
  return (
    <PublicLayout>
      <section className="relative isolate overflow-hidden border-b border-[#085C84]/10 bg-[#EAF3F7] py-16 sm:py-24">
        <div className="pointer-events-none absolute -right-16 -top-20 h-72 w-72 rounded-full bg-[#387CBB]/15 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 right-[19%] h-36 w-36 rounded-full border-[22px] border-[#2F9B3E]/10" aria-hidden="true" />
        <div className="site-container relative">
          <p className="eyebrow">Areas</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.02] tracking-[-0.05em] text-[#54595F] sm:text-6xl">Local meetings, connected nationally.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#54595F]">One regional home and four distinct area sites connect local meeting information with a single verified national directory. Each site has its own local voice, while inactive meetings remain inactive until an authorised area decision changes their status.</p>
        </div>
      </section>
      <section className="site-container py-14 sm:py-20">
        <div className="mb-8 max-w-2xl"><p className="eyebrow">Choose an area</p><p className="mt-3 leading-7 text-[#7A7A7A]">Each area has a local starting point and links back to the same national meeting directory.</p></div>
        <div className="grid gap-4 sm:grid-cols-2">
          {areas.map(area => (
            <Link key={area.slug} href={`/areas/${area.slug}`} className="group relative flex min-h-36 items-center justify-between overflow-hidden rounded-3xl border border-[#DDE6EB] bg-white p-6 shadow-[0_8px_24px_rgba(20,45,42,0.04)] transition-transform hover:-translate-y-0.5">
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#EAF3F7] transition-transform group-hover:scale-125" aria-hidden="true" />
              <div className="relative"><MapPinned className="h-5 w-5 text-[#085C84]" aria-hidden="true" /><h2 className="mt-5 font-serif text-2xl text-[#54595F]">{area.name}</h2><span className="mt-2 block text-sm font-semibold text-[#387CBB]">View area website</span></div>
              <ArrowRight className="h-5 w-5 text-[#085C84] transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          ))}
        </div>
        <div className="mt-12 rounded-3xl bg-[#085C84] p-7 text-white sm:p-10">
          <p className="eyebrow text-white/90">Looking for a specific meeting?</p>
          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><p className="max-w-2xl font-serif text-3xl leading-9">Use the meeting finder to search beyond area boundaries by day, time and meeting type.</p><Button asChild className="min-h-12 shrink-0 rounded-xl bg-[#2F9B3E] font-bold text-white hover:bg-[#20752C]"><Link href="/meetings">Find a meeting</Link></Button></div>
        </div>
      </section>
    </PublicLayout>
  );
}
