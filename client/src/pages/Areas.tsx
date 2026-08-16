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
      <section className="border-b border-[#54595F]/10 bg-[#F8F8F8] py-16 sm:py-24">
        <div className="site-container max-w-5xl">
          <p className="eyebrow">Areas</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.02] tracking-[-0.05em] text-[#54595F] sm:text-6xl">Local meetings, connected nationally.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#54595F]">One regional home and four distinct area sites connect local meeting information with a single verified national directory. Each site has its own local voice, while inactive meetings remain inactive until an authorised area decision changes their status.</p>
        </div>
      </section>
      <section className="site-container py-14 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-2">
          {areas.map(area => (
            <Link key={area.slug} href={`/areas/${area.slug}`} className="group flex min-h-32 items-center justify-between rounded-3xl border border-[#EEEEEE] bg-white p-6 shadow-[0_8px_24px_rgba(20,45,42,0.04)] transition-transform hover:-translate-y-0.5">
              <div><MapPinned className="h-5 w-5 text-[#085C84]" aria-hidden="true" /><h2 className="mt-5 font-serif text-2xl text-[#54595F]">{area.name}</h2><span className="mt-2 block text-sm font-semibold text-[#387CBB]">View area website</span></div>
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
