import { ChevronLeft, ChevronRight, Clock3, ExternalLink, MapPinned, Phone, Search, SlidersHorizontal, Users } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "wouter";
import { MeetingMap, type MeetingMapPoint } from "@/components/Map";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
const types = ["Open", "Closed", "Speaker", "Step", "Topic", "Women", "Men"];

type FilterState = { query: string; areaSlug: string; day: string; timeOfDay: string; meetingType: string; meetingFormat: string; page: number };
const defaultFilters: FilterState = { query: "", areaSlug: "", day: "", timeOfDay: "", meetingType: "", meetingFormat: "", page: 1 };

function addressOf(meeting: { venueName: string | null; streetAddress: string | null; suburb: string | null; city: string | null; province: string | null }) {
  return [meeting.venueName, meeting.streetAddress, meeting.suburb, meeting.city, meeting.province, "South Africa"].filter(Boolean).join(", ");
}

function directionsUrl(meeting: { latitude: string | number | null; longitude: string | number | null; venueName: string | null; streetAddress: string | null; suburb: string | null; city: string | null; province: string | null }) {
  const lat = Number(meeting.latitude); const lng = Number(meeting.longitude);
  const destination = Number.isFinite(lat) && Number.isFinite(lng) ? `${lat},${lng}` : addressOf(meeting);
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}&travelmode=driving`;
}

export default function MeetingFinder() {
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
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
  const update = <K extends keyof FilterState>(key: K, value: FilterState[K]) => setFilters(current => ({ ...current, [key]: value, page: key === "page" ? Number(value) : 1 }));

  return (
    <div className="site-container py-8 sm:py-12">
      <section className="rounded-3xl border border-[#d7dfd5] bg-white p-5 shadow-[0_12px_32px_rgba(20,45,42,0.05)] sm:p-7">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end">
          <div className="block flex-1"><label htmlFor="meeting-search" className="mb-2 block text-sm font-bold text-[#28383d]">Search meetings</label><div className="relative"><Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#2e6756]" /><input id="meeting-search" value={filters.query} onChange={event => update("query", event.target.value)} placeholder="Area, suburb, meeting or venue" className="h-12 w-full rounded-xl border border-[#bfcac0] bg-white pl-11 pr-4 text-base outline-none placeholder:text-[#77867d] focus:border-[#145044] focus:ring-2 focus:ring-[#145044]/20" /></div></div>
          <Button type="button" variant="outline" className="h-12 rounded-xl border-[#bfcac0] bg-white px-5 text-[#145044] hover:bg-[#e6eee3] hover:text-[#145044]" onClick={() => { setFilters(defaultFilters); setSelectedId(undefined); }}><SlidersHorizontal className="mr-2 h-4 w-4" />Clear filters</Button>
        </div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <select aria-label="Filter by area" value={filters.areaSlug} onChange={event => update("areaSlug", event.target.value)} className="finder-select"><option value="">All areas</option>{areas.data?.map(area => <option key={area.id} value={area.slug}>{area.name}</option>)}</select>
          <select aria-label="Filter by day" value={filters.day} onChange={event => update("day", event.target.value)} className="finder-select"><option value="">Any day</option>{days.map(day => <option key={day} value={day}>{day[0].toUpperCase() + day.slice(1)}</option>)}</select>
          <select aria-label="Filter by time" value={filters.timeOfDay} onChange={event => update("timeOfDay", event.target.value)} className="finder-select"><option value="">Any time</option><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option></select>
          <select aria-label="Filter by meeting type" value={filters.meetingType} onChange={event => update("meetingType", event.target.value)} className="finder-select"><option value="">Any type</option>{types.map(type => <option key={type} value={type}>{type}</option>)}</select>
          <select aria-label="Filter by meeting format" value={filters.meetingFormat} onChange={event => update("meetingFormat", event.target.value)} className="finder-select"><option value="">In person, online or hybrid</option><option value="in_person">In person</option><option value="online">Online</option><option value="hybrid">Hybrid</option></select>
        </div>
      </section>

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,0.9fr)_minmax(450px,1.1fr)]">
        <section aria-live="polite">
          <div className="mb-4 flex items-center justify-between gap-4"><p className="text-sm text-[#536167]">{results.isLoading ? "Searching verified meetings…" : `${payload?.total ?? 0} verified ${payload?.total === 1 ? "meeting" : "meetings"} found`}</p><span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-[#2e6756]"><MapPinned className="h-4 w-4" />Map linked</span></div>
          {results.isError ? <div className="rounded-2xl border border-[#d8a29b] bg-[#fff4f1] p-5 text-[#7a2f20]">The meeting directory is temporarily unavailable. Please call <a className="font-bold underline" href="tel:+27861006962">0861 00 6962</a> for help.</div> : null}
          {!results.isLoading && !results.isError && payload?.items.length === 0 ? <div className="rounded-3xl border border-dashed border-[#bfcac0] bg-white p-8 text-center"><Users className="mx-auto h-8 w-8 text-[#2e6756]" /><h2 className="mt-4 font-serif text-2xl text-[#142d2a]">No verified meetings match these filters yet.</h2><p className="mx-auto mt-3 max-w-md leading-7 text-[#536167]">Try broadening your search, choose another area, or call the national phoneline for assistance.</p><a className="mt-5 inline-flex font-bold text-[#145044] underline underline-offset-4" href="tel:+27861006962">Call 0861 00 6962</a></div> : null}
          <div className="grid gap-3">{payload?.items.map(meeting => <article key={meeting.id} className={`rounded-2xl border bg-white p-5 transition-shadow ${meeting.id === selectedId ? "border-[#2e6756] shadow-[0_10px_24px_rgba(20,45,42,0.12)]" : "border-[#d7dfd5]"}`}><div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap gap-2"><span className="rounded-full bg-[#e6eee3] px-2.5 py-1 text-xs font-bold text-[#145044]">{meeting.areaName}</span><span className="rounded-full bg-[#f3f5f0] px-2.5 py-1 text-xs font-bold text-[#536167]">{meeting.meetingType}</span></div><h2 className="mt-3 font-serif text-2xl leading-7 text-[#142d2a]"><Link href={`/meetings/${meeting.id}`} className="underline decoration-transparent underline-offset-4 transition hover:decoration-[#2e6756] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#145044]">{meeting.meetingName}</Link></h2></div><button className="min-h-10 rounded-lg border border-[#d7dfd5] px-3 text-sm font-bold text-[#145044] hover:bg-[#e6eee3]" onClick={() => setSelectedId(meeting.id)}>Show on map</button></div><div className="mt-4 grid gap-2 text-sm leading-6 text-[#536167]"><p className="flex gap-2"><Clock3 className="mt-1 h-4 w-4 shrink-0 text-[#2e6756]" />{JSON.parse(meeting.daysOfWeek) as string[] ? (JSON.parse(meeting.daysOfWeek) as string[]).map(day => day[0].toUpperCase() + day.slice(1)).join(", ") : "Day to be confirmed"} · {meeting.startTime}</p><p className="flex gap-2"><MapPinned className="mt-1 h-4 w-4 shrink-0 text-[#2e6756]" />{addressOf(meeting) || "Location details available from the area"}</p>{meeting.specialNotes ? <p>{meeting.specialNotes}</p> : null}</div><div className="mt-5 flex flex-wrap gap-3">{meeting.meetingFormat === "online" && meeting.onlineUrl ? <a className="inline-flex min-h-10 items-center rounded-lg bg-[#e6eee3] px-3 text-sm font-bold text-[#145044] hover:bg-[#d4e2d2]" href={meeting.onlineUrl} target="_blank" rel="noreferrer">Join online <ExternalLink className="ml-2 h-4 w-4" /></a> : <a className="inline-flex min-h-10 items-center rounded-lg bg-[#145044] px-3 text-sm font-bold text-white hover:bg-[#0f3e35]" href={directionsUrl(meeting)} target="_blank" rel="noreferrer">Get directions <ExternalLink className="ml-2 h-4 w-4" /></a>}{meeting.phone ? <a className="inline-flex min-h-10 items-center rounded-lg border border-[#d7dfd5] px-3 text-sm font-bold text-[#145044] hover:bg-[#e6eee3]" href={`tel:${meeting.phone.replace(/\s/g, "")}`}><Phone className="mr-2 h-4 w-4" />Call contact</a> : null}</div></article>)}</div>
          {pages > 1 && <nav className="mt-6 flex items-center justify-between" aria-label="Meeting result pagination"><Button variant="outline" className="min-h-10 rounded-lg" disabled={filters.page === 1} onClick={() => update("page", filters.page - 1)}><ChevronLeft className="mr-1 h-4 w-4" />Previous</Button><span className="text-sm text-[#536167]">Page {filters.page} of {pages}</span><Button variant="outline" className="min-h-10 rounded-lg" disabled={filters.page >= pages} onClick={() => update("page", filters.page + 1)}>Next<ChevronRight className="ml-1 h-4 w-4" /></Button></nav>}
        </section>
        <aside className="h-fit xl:sticky xl:top-28"><div className="overflow-hidden rounded-3xl border border-[#d7dfd5] bg-white shadow-[0_12px_32px_rgba(20,45,42,0.05)]"><div className="flex items-center justify-between border-b border-[#d7dfd5] px-5 py-4"><div><h2 className="font-serif text-xl text-[#142d2a]">Meeting map</h2><p className="mt-1 text-xs text-[#536167]">Markers cluster in dense areas.</p></div>{selected ? <span className="max-w-[170px] truncate text-right text-xs font-bold text-[#2e6756]">{selected.meetingName}</span> : null}</div><MeetingMap points={mapPoints} selectedId={selectedId} onSelect={setSelectedId} /></div></aside>
      </div>
    </div>
  );
}
