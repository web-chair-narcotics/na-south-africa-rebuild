import { ArrowLeft, Clock3, ExternalLink, MapPinned, Phone, ShieldCheck, Users } from "lucide-react";
import { Link } from "wouter";
import PublicLayout from "@/components/PublicLayout";
import { MeetingMap, type MeetingMapPoint } from "@/components/Map";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

function readDays(value: string | null | undefined) {
  if (!value) return "Day to be confirmed";
  try {
    const days = JSON.parse(value) as string[];
    return days.length ? days.map(day => day.charAt(0).toUpperCase() + day.slice(1)).join(", ") : "Day to be confirmed";
  } catch { return "Day to be confirmed"; }
}

function decodeHtmlEntities(value: string) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ");
}

function publicNotesOf(value: string | null, meetingFormat: string) {
  if (!value) return "";
  const decoded = decodeHtmlEntities(value);
  if (meetingFormat !== "online") return decoded;
  return decoded.split(/\r?\n/).filter(line => !/(password|passcode|pass code|meeting\s+id|room\s+id)/i.test(line)).join("\n").trim();
}

function isUsablePhone(value: string | null) {
  if (!value) return false;
  const digits = value.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 15 && !/^123456/.test(digits);
}

function addressOf(meeting: { venueName?: string | null; streetAddress?: string | null; suburb?: string | null; city?: string | null; province?: string | null }) {
  const parts = [meeting.venueName, meeting.streetAddress, meeting.suburb, meeting.city, meeting.province, "South Africa"]
    .filter(Boolean)
    .map(value => decodeHtmlEntities(String(value)).trim())
    .filter(Boolean);
  return parts.filter((part, index) => parts.indexOf(part) === index).join(", ");
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
  const detailMapPoint = meeting && meeting.meetingFormat !== "online" && meeting.latitude && meeting.longitude ? [{ id: meeting.id, meetingName: meeting.meetingName, latitude: meeting.latitude, longitude: meeting.longitude, areaName: meeting.areaName, venueName: meeting.venueName, streetAddress: meeting.streetAddress, suburb: meeting.suburb, city: meeting.city }] as MeetingMapPoint[] : [];

  return <PublicLayout>
    <main className="bg-[#F8F8F8]">
      <section className="border-b border-[#54595F]/10 bg-[#F8F8F8] py-12 sm:py-20"><div className="site-container max-w-4xl"><Link href="/meetings" className="inline-flex min-h-11 items-center gap-2 font-bold text-[#224091] underline underline-offset-4"><ArrowLeft className="h-4 w-4" aria-hidden="true" />Back to meeting finder</Link>{detail.isLoading ? <div className="mt-10 h-20 animate-pulse rounded-2xl bg-white/60" aria-label="Loading meeting details" /> : meeting ? <>{meeting.meetingFormat !== "online" ? <p className="eyebrow mt-10">{meeting.areaName} area</p> : <p className="eyebrow mt-10">Online meeting</p>}<h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.02] tracking-[-0.05em] text-[#54595F] sm:text-7xl">{meeting.meetingName}</h1><p className="mt-5 max-w-2xl text-lg leading-8 text-[#54595F]">Published meeting information from the current directory. Check the current details before travelling.</p></> : <><p className="eyebrow mt-10">Meeting unavailable</p><h1 className="mt-4 font-serif text-5xl text-[#54595F]">We could not find that meeting.</h1><p className="mt-5 max-w-xl text-lg leading-8 text-[#54595F]">The meeting may have been archived or the link may be out of date. Return to the finder to search current published meetings.</p><Button asChild className="mt-7 min-h-12 rounded-xl bg-[#224091] text-white"><Link href="/meetings">Open meeting finder</Link></Button></>}</div></section>
      {meeting ? <section className="site-container grid gap-8 py-12 sm:py-16 lg:grid-cols-[1.1fr_.9fr]">
        <div className="rounded-[2rem] border border-[#EEEEEE] bg-white p-7 shadow-[0_8px_24px_rgba(20,45,42,0.04)] sm:p-10"><div className="flex flex-wrap gap-2"><span className="rounded-full bg-[#F8F8F8] px-3 py-1 text-sm font-bold text-[#224091]">{meeting.meetingType}</span><span className="rounded-full bg-[#F8F8F8] px-3 py-1 text-sm font-bold text-[#7A7A7A]">{meeting.meetingFormat.replace("_", " ")}</span></div><div className="mt-8 grid gap-6"><div className="flex gap-4"><Clock3 className="mt-1 h-5 w-5 shrink-0 text-[#3A5CB8]" aria-hidden="true" /><div><h2 className="font-bold text-[#54595F]">When</h2><p className="mt-1 leading-7 text-[#7A7A7A]">{readDays(meeting.daysOfWeek)} · {meeting.startTime}</p></div></div><div className="flex gap-4">{meeting.meetingFormat === "online" ? <ExternalLink className="mt-1 h-5 w-5 shrink-0 text-[#3A5CB8]" aria-hidden="true" /> : <MapPinned className="mt-1 h-5 w-5 shrink-0 text-[#3A5CB8]" aria-hidden="true" />}<div><h2 className="font-bold text-[#54595F]">{meeting.meetingFormat === "online" ? "Online access" : "Where"}</h2><p className="mt-1 leading-7 text-[#7A7A7A]">{meeting.meetingFormat === "online" ? "Online meeting — use the join link in the action panel." : addressOf(meeting) || "Location details available from the area."}</p></div></div>{meeting.contactPerson || isUsablePhone(meeting.phone) ? <div className="flex gap-4"><Phone className="mt-1 h-5 w-5 shrink-0 text-[#3A5CB8]" aria-hidden="true" /><div><h2 className="font-bold text-[#54595F]">Contact</h2>{meeting.contactPerson ? <p className="mt-1 leading-7 text-[#7A7A7A]">{meeting.contactPerson}</p> : null}{isUsablePhone(meeting.phone) ? <a className="mt-1 inline-flex font-bold text-[#224091] underline underline-offset-4" href={`tel:${meeting.phone!.replace(/\s/g, "")}`}>{meeting.phone}</a> : null}</div></div> : null}{publicNotesOf(meeting.specialNotes, meeting.meetingFormat) ? <div className="rounded-2xl bg-[#F8F8F8] p-5 leading-7 text-[#7A7A7A]"><h2 className="font-bold text-[#54595F]">Meeting notes</h2><p className="mt-2 whitespace-pre-line">{publicNotesOf(meeting.specialNotes, meeting.meetingFormat)}</p></div> : null}</div></div>
        <div className="grid gap-8">
          {detailMapPoint.length ? <div className="overflow-hidden rounded-[2rem] border border-[#EEEEEE] bg-white shadow-[0_8px_24px_rgba(20,45,42,0.04)]"><div className="border-b border-[#EEEEEE] px-7 py-5"><h2 className="font-serif text-2xl text-[#54595F]">Meeting map</h2><p className="mt-1 text-sm text-[#7A7A7A]">Confirm the venue before you leave.</p></div><MeetingMap points={detailMapPoint} selectedId={meeting.id} onSelect={() => undefined} /></div> : null}
          <aside className="rounded-[2rem] bg-[#3A5CB8] p-7 text-white sm:p-10"><ShieldCheck className="h-7 w-7 text-white/90" aria-hidden="true" /><h2 className="mt-6 font-serif text-3xl">Plan your visit</h2><p className="mt-4 leading-7 text-[#F8F8F8]">Confirm the meeting details and open the exact route before you leave. If you need another option, return to the finder to search by day, area, or format.</p><div className="mt-8 grid gap-3">{meeting.meetingFormat !== "in_person" && meeting.onlineUrl ? <a className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#224091] px-4 font-bold text-white hover:bg-[#152A63]" href={meeting.onlineUrl} target="_blank" rel="noreferrer">Join online <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" /></a> : null}{meeting.meetingFormat !== "online" && (meeting.latitude || meeting.streetAddress) ? <a className="inline-flex min-h-12 items-center justify-center rounded-xl bg-[#224091] px-4 font-bold text-white hover:bg-[#152A63]" href={directionsUrl(meeting)} target="_blank" rel="noreferrer">Get exact Google Maps directions <ExternalLink className="ml-2 h-4 w-4" aria-hidden="true" /></a> : null}<Link className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/30 px-4 font-bold text-white hover:bg-white/10" href="/meetings"><Users className="mr-2 h-4 w-4" aria-hidden="true" />Find another meeting</Link></div></aside>
        </div>
      </section> : null}
    </main>
  </PublicLayout>;
}
