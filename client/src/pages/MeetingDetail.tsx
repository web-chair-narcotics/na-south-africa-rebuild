import { ArrowLeft, Clock3, ExternalLink, MapPinned, Phone, ShieldCheck, Users } from "lucide-react";
import { Link } from "wouter";
import PublicLayout from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

function readDays(value: string | null | undefined) {
  if (!value) return "Day to be confirmed";
  try {
    const days = JSON.parse(value) as string[];
    return days.length ? days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(", ") : "Day to be confirmed";
  } catch { return "Day to be confirmed"; }
}

function addressOf(meeting: { venueName?: string | null; streetAddress?: string | null; suburb?: string | null; city?: string | null; province?: string | null }) {
  return [meeting.venueName, meeting.streetAddress, meeting.suburb, meeting.city, meeting.province, "South Africa"].filter(Boolean).join(", ");
}

function directionsUrl(meeting: { latitude?: string | number | null; longitude?: string | number | null; venueName?: string | null; streetAddress?: string | null; suburb?: string | null; city?: string | null; province?: string | null }) {
  const lat = Number(meeting.latitude); const lng = Number(meeting.longitude);
  const destination = Number.isFinite(lat) && Number.isFinite(lng) ? `${lat},${lng}` : addressOf(meeting);
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
}

export default function MeetingDetail({ id }: { id: string }) {
  const meetingId = Number(id);
  const detail = trpc.finder.detail.useQuery({ id: meetingId }, { enabled: Number.isInteger(meetingId) && meetingId > 0 });
  const meeting = detail.data;

  return <PublicLayout>
    <main className="bg-[#f8f8f6]">
      <section className="border-b border-[#172329]/10 bg-[#e6eee3] py-12 sm:py-20"><div className="site-container max-w-4xl"><Link href="/meetings" className="inline-flex min-h-11 items-center gap-2 font-bold text-[#145044] underline underline-offset-4"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to meeting finder</Link>{detail.isLoading ? <div className="mt-10 h-20 animate-pulse rounded-2xl bg-white/60" aria-label="Loading meeting details" /> : meeting ? <><p className="eyebrow mt-10">{meeting.areaName} area</p><h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.02] tracking-[-0.05em] text-[#142d2a] sm:text-7xl">{meeting.meetingName}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[#405057]">Verified meeting information from the national directory. Check the current details before travelling.</p></> : <><p className="eyebrow mt-10">Meeting unavailable</p><h1 className="mt-4 font-serif text-5xl text-[#142d2a]">We could not find that meeting.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-[#405057]">The meeting may have been archived or the link may be out of date. Return to the finder to search current published meetings.</p><Button asChild className="mt-7 min-h-12 rounded-xl bg-[#145044] text-white"><Link href="/meetings">Open meeting finder</Link></Button></>}</div></section>
      {meeting ? <section className="site-container grid gap-8 py-12 sm:py-16 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-[2rem] border border-[#d7dfd5] bg-white p-7 shadow-[0_8px_24px_rgba(20,45,42,0.04)] sm:p-10"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-[#e6eee3] px-3 py-1 text-sm font-bold text-[#145044]">{meeting.meetingType}</span><span className="rounded-full bg-[#f3f5f0] px-3 py-1 text-sm font-bold text-[#536167]">{meeting.meetingFormat.replace("_", " ")}</span></div><div className="mt-8 grid gap-6"><div className="flex gap-4"><Clock3 className="mt-1 h-5 w-5 shrink-0 text-[#2e6756]" aria-hidden="true" /><div><h2 className="font-bold text-[#142d2a]">When</h2><p className="mt-1 leading-7 text-[#536167]">{readDays(meeting.daysOfWeek)} · {meeting.startTime}</p></div></div><div className="flex gap-4"><MapPinned className="mt-1 h-5 w-5 shrink-0 text-[#2e6756]" aria-hidden="true" /><div><h2 className="font-bold text-[#142d2a]">Where</h2><p className="mt-1 leading-7 text-[#536167]">{addressOf(meeting) || "Location details available from the area."}</p></div></div>{meeting.contactPerson || meeting.phone ? <div className="flex gap-4"><Phone className="mt-1 h-5 w-5 shrink-0 text-[#2e6756]" aria-hidden="true" /><div><h2 className="font-bold text-[#142d2a]">Contact</h2>{meeting.contactPerson ? <p className="mt-1 leading-7 text-[#536167]">{meeting.contactPerson}</p> : null}{meeting.phone ? <a className="mt-1 inline-flex font-bold text-[#145044] underline underline-offset-4" href={`tel:${meeting.phone.replace(/\s/g, "")}`}>{meeting.phone}</a> : null}</div></div> : null}{meeting.specialNotes ? <div className="rounded-2xl bg-[#f3f5f0] p-5 leading-7 text-[#536167]"><h2 className="font-bold text-[#142d2a]">Meeting notes</h2><p className="mt-2 whitespace-pre-line">{meeting.specialNotes}</p></div> : null}</div></div>
        <aside className="rounded-[2rem] bg-[#142d2a] p-7 text-white sm:p-10"><ShieldCheck className="h-7 w-7 text-[#c7d9ae]" aria-hidden="true" /><h2 className="mt-6 font-serif text-3xl">Plan your visit</h2><p className="mt-4 leading-7 text-[#e5ede8]">Confirm the meeting details and open the exact route before you leave. If you need another option, return to the finder to search by day, area, or format.</p><div className="mt-8 grid gap-3">{meeting.meetingFormat === "online" && meeting.onlineUrl ? <a className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#c7d9ae] px-4 font-bold text-[#142d2a] hover:bg-[#dce9c8]" href={meeting.onlineUrl} target="_blank" rel="noreferrer">Join online <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" /></a> : meeting.meetingFormat !== "online" && (meeting.latitude || meeting.streetAddress) ? <a className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#c7d9ae] px-4 font-bold text-[#142d2a] hover:bg-[#dce9c8]" href={directionsUrl(meeting)} target="_blank" rel="noreferrer">Get exact Google Maps directions <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" /></a> : null}<Link className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-4 font-bold text-white hover:bg-white/10" href="/meetings"><Users className="mr-2 h-4 w-4" aria-hidden="true" />Find another meeting</Link></div></aside>
      </section> : null}
    </main>
  </PublicLayout>;
}
