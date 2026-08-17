import { ChevronLeft, ChevronRight, Clock3, ExternalLink, MapPinned, Phone, Search, SlidersHorizontal, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { MeetingMap, type MeetingMapPoint } from "@/components/Map";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const types = ["Open", "Closed", "Speaker", "Step", "Topic", "Women", "Men"];

type FilterState = { query: string; areaSlug: string; day: string; timeOfDay: string; meetingType: string; meetingFormat: string; page: number };
const defaultFilters: FilterState = { query: "", areaSlug: "", day: "", timeOfDay: "", meetingType: "", meetingFormat: "in_person", page: 1 };

const areaAliases: Record<string, string> = {
  johannesburg: "johannesburg",
  "kwazulu-natal": "kwazulu-natal",
  pretoria: "pretoria",
  "western cape": "western-cape",
  "cape town": "western-cape",
  "western-cape": "western-cape",
};

export function filtersFromSearch(search: string): FilterState {
  const params = new URLSearchParams(search);
  const format = params.get("meetingFormat");
  const requestedArea = (params.get("areaSlug") ?? params.get("area") ?? "").trim().toLowerCase();
  const areaSlug = areaAliases[requestedArea] ?? (requestedArea || "");
  return {
    ...defaultFilters,
    areaSlug,
    meetingFormat: format === "online" || format === "in_person" || format === "hybrid" ? format : defaultFilters.meetingFormat,
  };
}

function filtersFromLocation(): FilterState {
  return filtersFromSearch(window.location.search);
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

function addressOf(meeting: { venueName: string | null; streetAddress: string | null; suburb: string | null; city: string | null; province: string | null }) {
  return decodeHtmlEntities([meeting.venueName, meeting.streetAddress, meeting.suburb, meeting.city, meeting.province, "South Africa"].filter(Boolean).join(", "));
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

function directionsUrl(meeting: { latitude: string | number | null; longitude: string | number | null; venueName: string | null; streetAddress: string | null; suburb: string | null; city: string | null; province: string | null }) {
  const lat = Number(meeting.latitude); const lng = Number(meeting.longitude);
  const destination = Number.isFinite(lat) && Number.isFinite(lng) ? `${lat},${lng}` : addressOf(meeting);
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
}

export default function MeetingFinder() {
  const [filters, setFilters] = useState<FilterState>(() => filtersFromLocation());
  const [selectedId, setSelectedId] = useState<number | undefined>();
  const queryInput = useMemo(() => ({
    query: filters.query || undefined, areaSlug: filters.areaSlug || undefined, day: (filters.day || undefined) as (typeof days)[number] | undefined,
    timeOfDay: (filters.timeOfDay || undefined) as "morning" | "afternoon" | "evening" | undefined,
    meetingType: filters.meetingType || undefined, meetingFormat: (filters.meetingFormat || undefined) as "in_person" | "online" | "hybrid" | undefined,
    page: filters.page, pageSize: 10,
  }), [filters]);
  const areas = trpc.finder.areas.useQuery();
  const results = trpc.finder.search.useQuery(queryInput, { placeholderData: previous => previous });
  const payload = results.data;
  const pages = Math.max(1, Math.ceil((payload?.total ?? 0) / 10));
  const selected = payload?.items.find(item => item.id === selectedId);
  const mapPoints = (payload?.mapPoints ?? []) as MeetingMapPoint[];
  const onlineOnly = filters.meetingFormat === "online";
  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) => setFilters(current => ({ ...current, [key]: value, page: key === "page" ? Number(value) : 1 }));

  return (
    <div className="site-container py-8 sm:py-12">
      <section className="rounded-3xl border border-[#EEEEEE] bg-white p-5 shadow-[0_12px_32px_rgba(20,45,42,0.05)] sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="block flex-1"><label htmlFor="meeting-search" className="mb-2 block text-sm font-bold text-[#54595F]">Search meetings</label><div className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#085C84]" /><input id="meeting-search" value={filters.query} onChange={event => update("query", event.target.value)} placeholder={onlineOnly ? "Meeting name or online group" : "Area, suburb, meeting or venue"} className="h-12 w-full rounded-xl border border-[#AAAAAA] bg-white pl-11 pr-4 text-base outline-none placeholder:text-[#7A7A7A] focus:border-[#2F9B3E] focus:ring-2 focus:ring-[#2F9B3E]/20" /></div></div>
          <Button type="button" variant="outline" className="h-12 rounded-xl border-[#AAAAAA] bg-white px-5 text-[#2F9B3E] hover:bg-[#F8F8F8] hover:text-[#2F9B3E]" onClick={() => { setFilters(defaultFilters); setSelectedId(undefined); }}><SlidersHorizontal className="mr-2 h-4 w-4" />Clear filters</Button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <select aria-label="Filter by area" value={filters.areaSlug} onChange={event => update("areaSlug", event.target.value)} className="finder-select"><option value="">All areas</option>{areas.data?.map(area => <option key={area.id} value={area.slug}>{area.name}</option>)}</select>
          <select aria-label="Filter by day" value={filters.day} onChange={event => update("day", event.target.value)} className="finder-select"><option value="">Any day</option>{days.map(day => <option key={day} value={day}>{day[0].toUpperCase() + day.slice(1)}</option>)}</select>
          <select aria-label="Filter by time" value={filters.timeOfDay} onChange={event => update("timeOfDay", event.target.value)} className="finder-select"><option value="">Any time</option><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option></select>
          <select aria-label="Filter by meeting type" value={filters.meetingType} onChange={event => update("meetingType", event.target.value)} className="finder-select"><option value="">Any type</option>{types.map(type => <option key={type} value={type}>{type}</option>)}</select>
          <select aria-label="Filter by meeting format" value={filters.meetingFormat} onChange={event => update("meetingFormat", event.target.value)} className="finder-select"><option value="">In person, online or hybrid</option><option value="in_person">In person</option><option value="online">Online</option><option value="hybrid">Hybrid</option></select>
        </div>
      </section>

      <div className={`mt-8 grid gap-8 ${onlineOnly ? "" : "xl:grid-cols-[minmax(0,0.9fr)_minmax(450px,1.1fr)]"}`}>
        <section aria-live="polite">
          <div className="mb-4 flex items-center justify-between gap-4"><p className="text-sm text-[#7A7A7A]">{results.isLoading ? "Searching published meetings…" : `${payload?.total ?? 0} published ${payload?.total === 1 ? "meeting" : "meetings"} found`}</p>{!onlineOnly && <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#085C84]"><MapPinned className="h-4 w-4" />Map linked</span>}</div>
          {results.isError ? <div className="rounded-2xl border border-[#AAAAAA] bg-[#FFFFFF4f] p-5 text-[#54595F]">The meeting directory is temporarily unavailable. Please call <a className="font-bold underline" href="tel:+27861006962">0861 00 6962</a> for help.</div> : null}
          {!results.isLoading && !results.isError && payload?.items.length === 0 ? <div className="rounded-3xl border border-dashed border-[#AAAAAA] bg-white p-8 text-center"><Users className="mx-auto h-8 w-8 text-[#085C84]" /><h2 className="mt-4 font-serif text-2xl text-[#54595F]">No published meetings match these filters yet.</h2><p className="mx-auto mt-3 max-w-md leading-7 text-[#7A7A7A]">Try broadening your search, choose another area, or call the national phoneline for assistance.</p><a className="mt-5 inline-flex font-bold text-[#2F9B3E] underline underline-offset-4" href="tel:+27861006962">Call 0861 00 6962</a></div> : null}
          <div className="grid gap-3">{payload?.items.map(meeting => <article key={meeting.id} className={`rounded-2xl border bg-white p-5 transition-shadow ${meeting.id === selectedId ? "border-[#085C84] shadow-[0_10px_24px_rgba(20,45,42,0.12)]" : "border-[#EEEEEE]"}`}><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap gap-2">{meeting.meetingFormat !== "online" ? <span className="rounded-full bg-[#F8F8F8] px-2.5 py-1 text-xs font-bold text-[#2F9B3E]">{meeting.areaName}</span> : null}<span className="rounded-full bg-[#F8F8F8] px-2.5 py-1 text-xs font-bold text-[#7A7A7A]">{meeting.meetingType}</span></div><h2 className="mt-3 font-serif text-2xl leading-7 text-[#54595F]"><Link href={`/meetings/${meeting.id}`} className="underline decoration-transparent underline-offset-4 transition hover:decoration-[#085C84] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2F9B3E]">{meeting.meetingName}</Link></h2></div>{meeting.meetingFormat !== "online" && <button className="min-h-10 rounded-lg border border-[#EEEEEE] px-3 text-sm font-bold text-[#2F9B3E] hover:bg-[#F8F8F8]" onClick={() => setSelectedId(meeting.id)}>Show on map</button>}</div><div className="mt-4 grid gap-2 text-sm leading-6 text-[#7A7A7A]"><p className="flex items-start gap-2"><Clock3 className="mt-1 h-4 w-4 shrink-0 text-[#085C84]" /><span className="min-w-0">{JSON.parse(meeting.daysOfWeek) as string[] ? (JSON.parse(meeting.daysOfWeek) as string[]).map(day => day[0].toUpperCase() + day.slice(1)).join(", ") : "Day to be confirmed"} · {meeting.startTime}</span></p>{meeting.meetingFormat !== "online" ? <p className="flex items-start gap-2"><MapPinned className="mt-1 h-4 w-4 shrink-0 text-[#085C84]" /><span className="min-w-0 break-words">{addressOf(meeting) || "Location details available from the area"}</span></p> : <p className="flex items-start gap-2"><ExternalLink className="mt-1 h-4 w-4 shrink-0 text-[#085C84]" /><span className="min-w-0">Online meeting — use the join link below.</span></p>}{publicNotesOf(meeting.specialNotes, meeting.meetingFormat) ? <p className="break-words">{publicNotesOf(meeting.specialNotes, meeting.meetingFormat)}</p> : null}</div><div className="mt-5 flex flex-wrap gap-3">{meeting.meetingFormat !== "in_person" && meeting.onlineUrl ? <a className="inline-flex min-h-10 items-center rounded-lg bg-[#F8F8F8] px-3 text-sm font-bold text-[#2F9B3E] hover:bg-[#EEEEEE]" href={meeting.onlineUrl} target="_blank" rel="noreferrer">Join online <ExternalLink className="ml-2 h-4 w-4" /></a> : null}{meeting.meetingFormat !== "online" && (meeting.latitude || meeting.streetAddress) ? <a className="inline-flex min-h-10 items-center rounded-lg bg-[#2F9B3E] px-3 text-sm font-bold text-white hover:bg-[#20752C]" href={directionsUrl(meeting)} target="_blank" rel="noreferrer">Get directions <ExternalLink className="ml-2 h-4 w-4" /></a> : null}{isUsablePhone(meeting.phone) ? <a className="inline-flex min-h-10 items-center rounded-lg border border-[#EEEEEE] px-3 text-sm font-bold text-[#2F9B3E] hover:bg-[#F8F8F8]" href={`tel:${meeting.phone!.replace(/\s/g, "")}`}><Phone className="mr-2 h-4 w-4" />Call contact</a> : null}</div></article>)}</div>
          {pages > 1 && <nav className="mt-6 flex items-center justify-between" aria-label="Meeting result pagination"><Button variant="outline" className="min-h-10 rounded-lg" disabled={filters.page === 1} onClick={() => update("page", filters.page - 1)}><ChevronLeft className="mr-1 h-4 w-4" />Previous</Button><span className="text-sm text-[#7A7A7A]">Page {filters.page} of {pages}</span><Button variant="outline" className="min-h-10 rounded-lg" disabled={filters.page >= pages} onClick={() => update("page", filters.page + 1)}>Next<ChevronRight className="ml-1 h-4 w-4" /></Button></nav>}
        </section>
        {!onlineOnly && <aside className="h-fit xl:sticky xl:top-28"><div className="overflow-hidden rounded-3xl border border-[#EEEEEE] bg-white shadow-[0_12px_32px_rgba(20,45,42,0.05)]"><div className="flex items-center justify-between border-b border-[#EEEEEE] px-5 py-4"><div><h2 className="font-serif text-xl text-[#54595F]">Meeting map</h2><p className="mt-1 text-xs text-[#7A7A7A]">Markers cluster in dense areas.</p></div>{selected ? <span className="max-w-[170px] truncate text-right text-xs font-bold text-[#085C84]">{selected.meetingName}</span> : null}</div><MeetingMap points={mapPoints} selectedId={selectedId} onSelect={setSelectedId} /></div></aside>}
      </div>
    </div>
  );
}
