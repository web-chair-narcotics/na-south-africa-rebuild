import MeetingFinder from "@/components/MeetingFinder";
import PublicLayout from "@/components/PublicLayout";

export default function Meetings() {
  const meetingFormat = new URLSearchParams(window.location.search).get("meetingFormat");
  const onlineOnly = meetingFormat === "online";
  return (
    <PublicLayout>
      <section className="border-b border-[#54595F]/10 bg-[#F8F8F8] py-14 sm:py-20">
        <div className="site-container max-w-5xl"><p className="eyebrow">{onlineOnly ? "Online meetings" : "Meeting finder"}</p><h1 className="mt-4 font-serif text-5xl leading-[1.02] tracking-[-0.05em] text-[#54595F] sm:text-6xl">{onlineOnly ? "Join an NA meeting online." : "Find an NA meeting."}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[#54595F]">{onlineOnly ? "Browse verified online meetings by day, time, or type. Use the meeting’s join link or contact details; online meetings do not show a venue, map, or directions." : "Search verified meeting information by area, day, time or type. Open the map, check the venue details, and get precise directions in one tap."}</p></div>
      </section>
      <MeetingFinder />
    </PublicLayout>
  );
}
