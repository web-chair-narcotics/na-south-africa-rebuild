import { ArrowRight, BookOpen, CheckCircle2, ExternalLink, HeartHandshake, Phone, UsersRound } from "lucide-react";
import { Link } from "wouter";
import PublicLayout from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";

type PageKey = "about" | "recovery" | "information" | "start" | "literature" | "news" | "contact";
type ContentItem = {
  eyebrow: string;
  title: string;
  lead: string;
  body: string[];
  principles: { title: string; text: string }[];
  cta?: { label: string; href: string };
  icon: typeof HeartHandshake;
  source?: { label: string; href: string };
};

const content: Record<PageKey, ContentItem> = {
  about: {
    eyebrow: "About Narcotics Anonymous",
    title: "Recovery begins with one addict helping another.",
    lead: "Narcotics Anonymous is a free, non-profit fellowship for people for whom drugs have become a major problem. Members meet regularly to support one another in recovery.",
    body: [
      "NA focuses on the disease of addiction rather than any particular drug. The only requirement for membership is a desire to stop using. There are no fees or dues, no forms to sign, and no requirement to disclose your history before you are ready.",
      "Meetings are run by and for recovering addicts. People share their own experience, strength, and hope so that another person can hear that recovery is possible and find a practical next step.",
      "NA is independent of outside organisations and does not promote a particular religion, treatment provider, political view, or belief system. People from different backgrounds can take part in the programme in a way that makes sense to them.",
      "The South Africa Region connects local areas and meetings to help people find clear, current support close to home or online. The most useful place to begin is usually a meeting." 
    ],
    principles: [
      { title: "One requirement", text: "A desire to stop using is the only requirement for membership." },
      { title: "Free and independent", text: "NA has no fees or dues and is not affiliated with outside organisations." },
      { title: "A shared message", text: "Members meet regularly and share their experience of recovery with one another." }
    ],
    cta: { label: "Find an NA meeting", href: "/meetings" },
    icon: HeartHandshake,
    source: { label: "Read the official NA introduction", href: "https://na.org/e-lit/ip-1-who-what-how-and-why/" },
  },
  recovery: {
    eyebrow: "Recovery in NA",
    title: "You do not have to work through addiction alone.",
    lead: "NA meetings are places where recovering addicts share experience, strength, and hope. You can start by finding a meeting and taking one step at a time.",
    body: [
      "A Narcotics Anonymous group is a regular meeting of recovering addicts with one primary purpose: to carry the message of recovery to the addict who still suffers. Every group has its own format, but the centre of a meeting is recovering people sharing what has helped them stay clean.",
      "Many people arrive at a first meeting unsure of what to say or do. It is fine to come in, listen, and learn how the meeting works. Members understand that a first visit can feel unfamiliar and aim to create an atmosphere where newcomers can feel welcome.",
      "In-person and online meetings are kept clearly separate on this site so that you can choose the practical option that works for you. Physical meetings show a venue, map and directions; online meetings show verified joining or contact information instead.",
      "As people continue attending, some choose a regular home group: a meeting where they feel comfortable, get to know others, and find a consistent point of connection each week. Recovery is personal, but it does not have to be isolated." 
    ],
    principles: [
      { title: "Choose a meeting", text: "Search by area, day, time, and meeting format to find a practical starting point." },
      { title: "Come as you are", text: "You can listen first and decide for yourself whether NA is right for you." },
      { title: "Keep coming back", text: "Regular connection gives people time to hear recovery and build a support network." }
    ],
    cta: { label: "Find support near you", href: "/meetings" },
    icon: UsersRound,
    source: { label: "Read the official NA Group booklet", href: "https://na.org/e-lit/ip-2-the-group/" },
  },
  literature: {
    eyebrow: "Literature",
    title: "Resources for learning about NA and recovery.",
    lead: "NA literature helps members and professionals understand the programme and the principles that guide the fellowship.",
    body: ["The current national site introduces the Basic Text, Step Working Guide, How It Works and Why, Sponsorship Guide, Living Clean, Just for Today and Guiding Principles. Each provides a different way to explore NA’s spiritual principles and programme of recovery.", "The literature library on this site identifies official material clearly and links to current NA World Services resources rather than re-hosting copyrighted editions."],
    principles: [{ title: "Official sources", text: "Resource links open current NA World Services pages." }, { title: "Clear categories", text: "Books, booklets, pamphlets and group readings are separated for easier browsing." }, { title: "Current editions", text: "External official links help readers reach authorised material." }],
    cta: { label: "Open the literature library", href: "/literature" },
    icon: BookOpen,
  },
  news: {
    eyebrow: "Notices",
    title: "National and area notices in one trusted place.",
    lead: "Verified announcements will be published here as the legacy national and area content is reviewed and moved to the new platform.",
    body: ["The publishing workflow gives national administrators visibility over public notices while allowing each area to prepare and maintain its own approved content.", "Visitors see only reviewed, current notices with clear dates and area context. No unverified legacy notice is carried forward automatically."],
    principles: [{ title: "Reviewed", text: "Only approved information is intended for public display." }, { title: "Current", text: "Notices carry clear context and ownership." }, { title: "Area aware", text: "Local content is managed by the relevant area." }],
    cta: { label: "Contact the national office", href: "/contact" },
    icon: BookOpen,
  },
  contact: {
    eyebrow: "Contact NA South Africa",
    title: "A clear next step is available now.",
    lead: "If you need support now, call the National NA South Africa phoneline or use the meeting finder to locate a meeting that suits you.",
    body: ["The national phoneline is 0861 00 6962. For public-relations enquiries, email pr-chair@na.org.za. For an immediate emergency or immediate risk of harm, contact local emergency services.", "The meeting finder brings together current public meeting information, including area, day, time, meeting format and—in the case of physical meetings—venue, map and directions. Online meetings show only joining or contact information.", "Regional contact channels are maintained as area-owned information so the people responsible for an area can review and update their public details before they are shown here."],
    principles: [{ title: "Phone support", text: "Call 0861 00 6962 when a conversation is the best next step." }, { title: "Find a meeting", text: "Search the current directory for in-person and online meetings." }, { title: "Clear boundaries", text: "NA support does not replace emergency services or professional care." }],
    cta: { label: "Call 0861 00 6962", href: "tel:+27861006962" },
    icon: Phone,
  },
  information: {
    eyebrow: "Information about NA",
    title: "A free, independent fellowship.",
    lead: "Narcotics Anonymous makes no distinction between drugs, including alcohol, and has no affiliation with governments, religions, law-enforcement groups, or medical and psychiatric associations.",
    body: ["Membership is free. NA’s service efforts and cooperation with others aim to give every addict an opportunity to experience recovery in their own language and culture.", "The South African fellowship operates service committees for literature, public relations, the phoneline, hospitals and institutions, events, fellowship development, and the website. These services support meetings without replacing professional medical, legal, financial or psychiatric support."],
    principles: [{ title: "Free", text: "There are no fees or dues for membership." }, { title: "Independent", text: "NA is separate from outside organisations." }, { title: "Accessible", text: "The only requirement is a desire to stop using." }],
    cta: { label: "Find an NA meeting", href: "/meetings" },
    icon: HeartHandshake,
  },
  start: {
    eyebrow: "For members",
    title: "How to start an NA meeting.",
    lead: "The group is the primary vehicle by which the NA message is carried.",
    body: ["A group provides a setting in which a newcomer can identify with recovering addicts and find an atmosphere of recovery. NA groups are formed and facilitated by NA members.", "Meetings vary in structure and format, but they are started to carry the NA message of recovery as effectively as possible—addict to addict. If you are not an addict, contact the local NA community through the national phoneline for guidance."],
    principles: [{ title: "A regular place", text: "A group meets consistently to carry the NA message." }, { title: "Shared responsibility", text: "Members work together to make recovery available." }, { title: "One purpose", text: "The aim is to reach the addict who still suffers." }],
    cta: { label: "Call 0861 00 6962", href: "tel:+27861006962" },
    icon: HeartHandshake,
  },
};

export default function ContentPage({ page }: { page: PageKey }) {
  const item = content[page];
  const Icon = item.icon;
  const external = item.cta?.href.startsWith("http");

  return (
    <PublicLayout>
      <section className="relative isolate overflow-hidden border-b border-[#085C84]/10 bg-[#EAF3F7] py-16 sm:py-24">
        <div className="pointer-events-none absolute -right-16 -top-24 h-80 w-80 rounded-full bg-[#387CBB]/15 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute bottom-0 right-[18%] h-40 w-40 rounded-full border-[24px] border-[#2F9B3E]/10" aria-hidden="true" />
        <div className="site-container relative">
          <div className="max-w-4xl">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#085C84] text-white shadow-[0_12px_28px_rgba(8,92,132,0.18)]"><Icon className="h-6 w-6" aria-hidden="true" /></div>
            <p className="eyebrow mt-7">{item.eyebrow}</p>
            <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.04] tracking-[-0.045em] text-[#54595F] sm:text-6xl">{item.title}</h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-[#54595F] sm:text-xl">{item.lead}</p>
          </div>
        </div>
      </section>
      <section className="site-container py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-20">
          <article className="max-w-3xl space-y-6 text-lg leading-8 text-[#54595F]">
            {item.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            {item.source && <a href={item.source.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 pt-2 text-base font-bold text-[#085C84] underline decoration-[#2F9B3E] decoration-2 underline-offset-4">{item.source.label} <ExternalLink className="h-4 w-4" aria-hidden="true" /></a>}
          </article>
          <aside className="h-fit rounded-3xl bg-[#085C84] p-7 text-white shadow-[0_18px_45px_rgba(8,92,132,0.22)]">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/90">Need support now?</p>
            <p className="mt-3 font-serif text-2xl leading-8">A meeting can be a practical first step.</p>
            {item.cta && (external ? (
              <Button asChild className="mt-6 min-h-12 w-full rounded-xl bg-[#2F9B3E] font-semibold text-white hover:bg-[#20752C]"><a href={item.cta.href} target="_blank" rel="noreferrer">{item.cta.label}<ExternalLink className="ml-2 h-4 w-4" /></a></Button>
            ) : (
              <Button asChild className="mt-6 min-h-12 w-full rounded-xl bg-[#2F9B3E] font-semibold text-white hover:bg-[#20752C]"><Link href={item.cta.href}>{item.cta.label}<ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            ))}
          </aside>
        </div>
        <section className="mt-16 border-t border-[#085C84]/10 pt-14 sm:mt-20 sm:pt-20">
          <p className="eyebrow">A clearer introduction</p>
          <h2 className="mt-3 max-w-2xl font-serif text-3xl leading-tight tracking-[-0.035em] text-[#54595F] sm:text-4xl">Practical information, at a pace you can take in.</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {item.principles.map((principle, index) => <div key={principle.title} className="rounded-2xl border border-[#DDE6EB] bg-white p-6 shadow-[0_8px_24px_rgba(20,45,42,0.04)]"><span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#EAF3F7] text-sm font-bold text-[#085C84]">0{index + 1}</span><h3 className="mt-6 text-lg font-bold text-[#54595F]">{principle.title}</h3><p className="mt-2 text-sm leading-6 text-[#7A7A7A]">{principle.text}</p></div>)}
          </div>
        </section>
      </section>
    </PublicLayout>
  );
}
