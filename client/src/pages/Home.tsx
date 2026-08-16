import { ArrowRight, ChevronRight, Clock3, MapPinned, Phone, ShieldCheck, Wifi } from "lucide-react";
import { Link } from "wouter";
import PublicLayout from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";

const supportSteps = [
  { number: "01", title: "In-person meetings", text: "Browse verified venues, open the map, and get precise directions.", href: "/meetings?meetingFormat=in_person", icon: MapPinned },
  { number: "02", title: "Online meetings", text: "See online-only meetings with verified join or contact details — never a physical address.", href: "/meetings?meetingFormat=online", icon: Wifi },
  { number: "03", title: "Call for immediate help", text: "Speak to the national phoneline when you need a human next step.", href: "tel:+27861006962", icon: Phone, external: true },
];

export default function Home() {
  return (
    <PublicLayout>
      <section className="hero-grid relative overflow-hidden bg-[#026AB9] py-16 text-white sm:py-24 lg:py-28">
        <div className="hero-orb hero-orb-one" />
        <div className="hero-orb hero-orb-two" />
        <div className="site-container relative grid items-end gap-12 lg:grid-cols-[minmax(0,1.1fr)_360px] lg:gap-20">
          <div className="max-w-4xl">
            <p className="eyebrow text-white/90">Narcotics Anonymous South Africa</p>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl leading-[0.98] tracking-[-0.055em] sm:text-6xl lg:text-8xl">A new way to live can begin today.</h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-[#EEEEEE] sm:text-xl">If drugs have become a problem, Narcotics Anonymous offers a place to begin. Choose an in-person meeting near you or an online meeting you can join from wherever you are.</p>
            <div className="mt-9 grid gap-3 sm:grid-cols-2">
              <Button asChild size="lg" className="min-h-14 rounded-xl bg-[#2F9B3E] px-6 text-base font-bold text-white shadow-none hover:bg-[#20752C]">
                <Link href="/meetings?meetingFormat=in_person"><MapPinned className="mr-2 h-5 w-5" />Find an in-person meeting <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="min-h-14 rounded-xl border-white/35 bg-white/5 px-6 text-base text-white hover:bg-white/10 hover:text-white">
                <Link href="/meetings?meetingFormat=online"><Wifi className="mr-2 h-5 w-5" />Find an online meeting <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
            <a className="mt-5 inline-flex items-center text-sm font-semibold text-white underline decoration-[#2F9B3E] decoration-2 underline-offset-4 hover:text-[#EEEEEE]" href="tel:+27861006962"><Phone className="mr-2 h-4 w-4" />Need to speak to someone now? Call 0861 00 6962</a>
          </div>
          <aside className="rounded-3xl border border-white/15 bg-white/10 p-6 backdrop-blur-sm sm:p-7">
            <div className="flex items-center gap-3 text-white/90"><Clock3 className="h-5 w-5" /><span className="text-sm font-bold uppercase tracking-[0.12em]">A simple next step</span></div>
            <p className="mt-5 font-serif text-3xl leading-9">You do not have to work through this alone.</p>
            <Link href="/recovery" className="mt-7 inline-flex items-center font-semibold text-white underline decoration-[#2F9B3E] decoration-2 underline-offset-6 hover:text-[#2F9B3E]">How NA can help <ChevronRight className="ml-1 h-4 w-4" /></Link>
          </aside>
        </div>
      </section>

      <section className="site-container py-14 sm:py-20">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <div>
            <p className="eyebrow text-[#085C84]">Choose your meeting path</p>
            <h2 className="mt-4 font-serif text-4xl leading-[1.05] tracking-[-0.035em] text-[#54595F] sm:text-5xl">In person or online: the right path starts with a clear choice.</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {supportSteps.map(step => {
              const Icon = step.icon;
              const content = <><div className="flex items-center justify-between"><span className="font-mono text-sm font-bold text-[#085C84]">{step.number}</span><Icon className="h-5 w-5 text-[#2F9B3E]" aria-hidden="true" /></div><h3 className="mt-8 text-lg font-bold text-[#54595F]">{step.title}</h3><p className="mt-2 text-sm leading-6 text-[#7A7A7A]">{step.text}</p><span className="mt-5 inline-flex items-center font-bold text-[#387CBB] underline underline-offset-4">Take this step <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" /></span></>;
              return step.external ? <a key={step.number} href={step.href} className="rounded-2xl border border-[#EEEEEE] bg-white p-5 shadow-[0_8px_24px_rgba(20,45,42,0.04)] transition-shadow hover:shadow-[0_12px_30px_rgba(20,45,42,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#387CBB]">{content}</a> : <Link key={step.number} href={step.href} className="rounded-2xl border border-[#EEEEEE] bg-white p-5 shadow-[0_8px_24px_rgba(20,45,42,0.04)] transition-shadow hover:shadow-[0_12px_30px_rgba(20,45,42,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#387CBB]">{content}</Link>;
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#F8F8F8] py-14 sm:py-20">
        <div className="site-container grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-center lg:gap-20">
          <div className="rounded-[2rem] bg-[#085C84] p-7 text-white sm:p-10">
            <MapPinned className="h-8 w-8 text-[#2F9B3E]" aria-hidden="true" />
            <h2 className="mt-8 max-w-xl font-serif text-4xl leading-[1.04] tracking-[-0.04em] sm:text-5xl">In-person meetings: search by location and get directions with one tap.</h2>
            <p className="mt-5 max-w-lg leading-7 text-[#F8F8F8]">Physical meetings show verified venue details, an embedded map, and exact Google Maps directions. Online meetings are kept separate and never receive a physical address by default.</p>
            <Button asChild className="mt-8 min-h-12 rounded-xl bg-[#2F9B3E] font-bold text-white hover:bg-[#EEEEEE]"><Link href="/meetings?meetingFormat=in_person">Browse in-person meetings <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
          </div>
          <div className="space-y-7">
            <div className="flex gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#085C84]"><ShieldCheck className="h-5 w-5" /></div><div><h3 className="text-lg font-bold text-[#54595F]">Verified before publication</h3><p className="mt-1 leading-7 text-[#7A7A7A]">Address, map location, spelling and contact details are checked through national review.</p></div></div>
            <div className="flex gap-4"><div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#085C84]"><Phone className="h-5 w-5" /></div><div><h3 className="text-lg font-bold text-[#54595F]">Help is always visible</h3><p className="mt-1 leading-7 text-[#7A7A7A]">The national phoneline stays available on every page, with a mobile-ready call action.</p></div></div>
          </div>
        </div>
      </section>

      <section className="site-container py-16 sm:py-24">
        <div className="max-w-3xl">
          <p className="eyebrow text-[#085C84]">About NA</p>
          <h2 className="mt-4 font-serif text-4xl leading-[1.06] tracking-[-0.04em] text-[#54595F] sm:text-5xl">The only requirement for membership is a desire to stop using.</h2>
          <p className="mt-6 text-lg leading-8 text-[#7A7A7A]">NA is a free, non-profit fellowship of people for whom drugs have become a major problem. There is a place for you here.</p>
          <Link href="/about" className="mt-8 inline-flex items-center font-bold text-[#2F9B3E] underline decoration-[#EEEEEE] decoration-2 underline-offset-6 hover:text-[#20752C]">Learn about NA <ArrowRight className="ml-2 h-4 w-4" /></Link>
        </div>
      </section>
    </PublicLayout>
  );
}
