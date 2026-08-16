import MeetingFinder from "@/components/MeetingFinder";
import PublicLayout from "@/components/PublicLayout";

export default function Meetings() {
  return (
    <PublicLayout>
      <section className="border-b border-[#172329]/10 bg-[#e6eee3] py-14 sm:py-20">
        <div className="site-container max-w-5xl"><p className="eyebrow">Meeting finder</p><h1 className="mt-4 font-serif text-5xl leading-[1.02] tracking-[-0.05em] text-[#142d2a] sm:text-6xl">Find an NA meeting.</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[#405057]">Search verified meeting information by area, day, time or type. Open the map, check the venue details, and get precise directions in one tap.</p></div>
      </section>
      <MeetingFinder />
    </PublicLayout>
  );
}
