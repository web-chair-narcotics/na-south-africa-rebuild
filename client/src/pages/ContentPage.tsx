import { ArrowRight, BookOpen, ExternalLink, HeartHandshake, Phone } from "lucide-react";
import { Link } from "wouter";
import PublicLayout from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";

type PageKey = "about" | "recovery" | "information" | "start" | "literature" | "news" | "contact";

const content: Record<PageKey, { eyebrow: string; title: string; lead: string; body: string[]; cta?: { label: string; href: string }; icon: typeof HeartHandshake }> = {
  about: {
    eyebrow: "About Narcotics Anonymous",
    title: "Narcotics Anonymous in South Africa.",
    lead: "Narcotics Anonymous is a non-profit fellowship of people for whom drugs have become a major problem.",
    body: [
      "The first NA meetings in South Africa were held in the mid-1980s, with early meetings in Chatsworth, KwaZulu-Natal, Hillbrow in Johannesburg, and Observatory in the Western Cape. The fellowship grew through the 1990s as members created regular meetings and shared recovery with one another.",
      "NA is a global, community-based organisation with a multi-lingual and multicultural membership. Its programme does not distinguish between drugs, including alcohol, and the only requirement for membership is a desire to stop using.",
      "NA has no affiliation with outside organisations, does not employ counsellors and does not charge for its services. Members support one another by sharing their experience of recovery.",
    ],
    cta: { label: "Find an NA meeting", href: "/meetings" },
    icon: HeartHandshake,
  },
  recovery: {
    eyebrow: "What happens at an NA meeting",
    title: "A place to hear recovery and be heard.",
    lead: "NA group meetings provide an environment of recovery for anyone who wants to stop using drugs.",
    body: [
      "Groups are led by members and run according to principles common to the fellowship. Most groups rent affordable, available space in public, religious or civic buildings. Members participate by sharing their own experiences of recovering from drug addiction.",
      "Newcomers are encouraged to identify themselves so they can be welcomed and offered support. NA is spiritual, not religious: people of every religious denomination or background are welcome, and the fellowship does not advocate a specific belief system.",
      "There are no fees or dues to join. If you are an addict or think you may have a drug problem, attending meetings regularly can help you get to know other members and the programme. Open meetings welcome non-addicts.",
    ],
    cta: { label: "Find support near you", href: "/meetings" },
    icon: HeartHandshake,
  },
  literature: {
    eyebrow: "Literature",
    title: "Resources for learning about NA and recovery.",
    lead: "NA literature helps members and professionals understand the programme and the principles that guide the fellowship.",
    body: ["The current national site introduces the Basic Text, Step Working Guide, How It Works and Why, Sponsorship Guide, Living Clean, Just for Today and Guiding Principles. Each provides a different way to explore NA’s spiritual principles and programme of recovery.", "The rebuilt library will preserve these descriptions, identify official material clearly, and provide verified links for public information and member resources."],
    cta: { label: "Visit NA World Services", href: "https://na.org/" },
    icon: BookOpen,
  },
  news: {
    eyebrow: "News & updates",
    title: "National and area notices in one trusted place.",
    lead: "Verified announcements will be published here as the legacy national and area content is reviewed and moved to the new platform.",
    body: [
      "The new publishing workflow gives national administrators visibility over public notices while allowing each area to prepare and maintain its own approved content.",
      "Visitors will see only reviewed, current notices, with clear dates and area context. No unverified legacy notice will be carried forward automatically.",
    ],
    cta: { label: "Contact the national office", href: "/contact" },
    icon: BookOpen,
  },
  contact: {
    eyebrow: "Contact NA South Africa",
    title: "Reach out. We will help you find the next step.",
    lead: "If you need support now, call the National NA South Africa phoneline or use the meeting finder to locate a meeting.",
    body: ["The national phoneline is 0861 00 6962. Media enquiries can be sent to pr-chair@na.org.za. This site does not replace emergency services; in an immediate emergency or immediate risk of harm, contact local emergency services.", "Current regional contact channels include Johannesburg WhatsApp 082 899 8816; Western Cape male WhatsApp 063 744 7049 and female WhatsApp 064 081 4935; as well as listed public-relations and phoneline contacts for Johannesburg, Pretoria, KwaZulu-Natal, Mpumalanga and Western Cape.", "The area administration workflow preserves this information as area-owned content so national administrators can review it before it is made public."],
    cta: { label: "Call 0861 00 6962", href: "tel:+27861006962" },
    icon: Phone,
  },
  information: {
    eyebrow: "Information about NA",
    title: "A free, independent fellowship.",
    lead: "Narcotics Anonymous makes no distinction between drugs, including alcohol, and has no affiliation with governments, religions, law-enforcement groups, or medical and psychiatric associations.",
    body: ["Membership is free. NA’s service efforts and cooperation with others aim to give every addict an opportunity to experience recovery in their own language and culture.", "The South African fellowship operates service committees for literature, public relations, the phoneline, hospitals and institutions, events, fellowship development, and the website. These services support meetings without replacing professional medical, legal, financial or psychiatric support."],
    cta: { label: "Find an NA meeting", href: "/meetings" },
    icon: HeartHandshake,
  },
  start: {
    eyebrow: "For members",
    title: "How to start an NA meeting.",
    lead: "The group is the primary vehicle by which the NA message is carried.",
    body: ["A group provides a setting in which a newcomer can identify with recovering addicts and find an atmosphere of recovery. NA groups are formed and facilitated by NA members.", "Meetings vary in structure and format, but they are started to carry the NA message of recovery as effectively as possible — addict to addict. If you are not an addict, contact the local NA community through the national phoneline for guidance."],
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
      <section className="relative overflow-hidden border-b border-[#54595F]/10 bg-[#F8F8F8] py-16 sm:py-24">
        <div className="site-container relative max-w-5xl">
          <div className="mb-7 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[#2F9B3E] text-white"><Icon className="h-6 w-6" aria-hidden="true" /></div>
          <p className="eyebrow">{item.eyebrow}</p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.04] tracking-[-0.04em] text-[#54595F] sm:text-6xl">{item.title}</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#54595F] sm:text-xl">{item.lead}</p>
        </div>
      </section>
      <section className="site-container grid gap-10 py-14 sm:py-20 lg:grid-cols-[minmax(0,1fr)_330px] lg:gap-20">
        <article className="max-w-3xl space-y-6 text-lg leading-8 text-[#54595F]">
          {item.body.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </article>
        <aside className="h-fit rounded-3xl bg-[#54595F] p-7 text-white shadow-[0_18px_45px_rgba(20,45,42,0.14)]">
          <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#2F9B3E]">Need support now?</p>
          <p className="mt-3 font-serif text-2xl leading-8">A meeting can be a practical first step.</p>
          {item.cta && (external ? (
            <Button asChild className="mt-6 min-h-12 w-full rounded-xl bg-[#2F9B3E] font-semibold text-white hover:bg-[#EEEEEE]">
              <a href={item.cta.href} target="_blank" rel="noreferrer">{item.cta.label}<ExternalLink className="ml-2 h-4 w-4" /></a>
            </Button>
          ) : (
            <Button asChild className="mt-6 min-h-12 w-full rounded-xl bg-[#2F9B3E] font-semibold text-white hover:bg-[#EEEEEE]">
              <Link href={item.cta.href}>{item.cta.label}<ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          ))}
        </aside>
      </section>
    </PublicLayout>
  );
}
