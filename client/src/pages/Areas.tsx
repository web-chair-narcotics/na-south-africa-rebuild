import { ArrowRight, MapPinned } from "lucide-react";
import { Link } from "wouter";
import PublicLayout from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";

const areas = ["Johannesburg", "KwaZulu-Natal", "Pretoria", "Western Cape"];

export default function Areas() {
  return (
    <PublicLayout>
      <section className="border-b border-[#172329]/10 bg-[#e6eee3] py-16 sm:py-24">
        <div className="site-container max-w-5xl">
          <p className="eyebrow">Areas</p>
          <h1 className="mt-4 font-serif text-5xl leading-[1.02] tracking-[-0.05em] text-[#142d2a] sm:text-6xl">Local meetings, connected nationally.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#405057]">NA South Africa is organised through local areas that maintain their own meeting information. The national directory brings verified local details together in one place.</p>
        </div>
      </section>
      <section className="site-container py-14 sm:py-20">
        <div className="grid gap-4 sm:grid-cols-2">
          {areas.map(area => (
            <Link key={area} href={`/meetings?area=${encodeURIComponent(area)}`} className="group flex min-h-32 items-center justify-between rounded-3xl border border-[#d7dfd5] bg-white p-6 shadow-[0_8px_24px_rgba(20,45,42,0.04)] transition-transform hover:-translate-y-0.5">
              <div><MapPinned className="h-5 w-5 text-[#2e6756]" aria-hidden="true" /><h2 className="mt-5 font-serif text-2xl text-[#142d2a]">{area}</h2></div>
              <ArrowRight className="h-5 w-5 text-[#2e6756] transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          ))}
        </div>
        <div className="mt-12 rounded-3xl bg-[#142d2a] p-7 text-white sm:p-10">
          <p className="eyebrow text-[#c7d9ae]">Looking for a specific meeting?</p>
          <div className="mt-4 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"><p className="max-w-2xl font-serif text-3xl leading-9">Use the meeting finder to search beyond area boundaries by day, time and meeting type.</p><Button asChild className="min-h-12 shrink-0 rounded-xl bg-[#c7d9ae] font-bold text-[#142d2a] hover:bg-[#d9e7c6]"><Link href="/meetings">Find a meeting</Link></Button></div>
        </div>
      </section>
    </PublicLayout>
  );
}
