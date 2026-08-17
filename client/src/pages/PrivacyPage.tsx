import PublicLayout from "@/components/PublicLayout";

const sections = [
  {
    title: "What this site is for",
    body: "This website helps people find Narcotics Anonymous South Africa meetings, literature and support contacts. The public meeting directory is intended to publish practical meeting information, not private member profiles or recovery histories.",
  },
  {
    title: "Meeting information",
    body: "Meeting records may include a meeting name, day, time, format, area, venue, address, map coordinates, joining link, public contact details and source or review information. Physical-meeting addresses and directions are shown only for in-person meetings. Online meetings are presented as Online and do not receive a physical address from this site.",
  },
  {
    title: "Information used for administration",
    body: "Authorised administrators use the protected area and national workflows to maintain approved meeting and content information. The platform account layer stores account identifiers and, where supplied by the authentication service, a name, email address, role and sign-in timestamps. Audit events and in-app notifications support accountability and review workflows.",
  },
  {
    title: "Cookies and browser storage",
    body: "The site uses a secure session cookie for authenticated access. In the managed preview environment, a short-lived session fallback may also use session storage when browser cookie handling is unavailable. Local browser storage may remember presentation preferences such as theme or navigation state. These mechanisms are functional authentication or usability features, not a promise that no browser storage is used.",
  },
  {
    title: "Contact actions and third parties",
    body: "The visible phone, email and WhatsApp actions open the visitor's phone, email or WhatsApp application. The site does not currently provide a public contact-form submission endpoint. Map and address features may use Google Maps or related Google services, and official literature links may open external NA World Services pages. Those services may process information according to their own terms and privacy notices.",
  },
  {
    title: "Your choices and requests",
    body: "If you believe the site or an area has published personal information incorrectly, or you want to ask about access, correction, objection, deletion or retention, contact the organisation through the public contact channel and identify the relevant page or meeting record. Requests should not include unnecessary sensitive recovery information. The organisation must confirm and publish its authorised Information Officer, request-handling process, retention periods and complaint route before this notice is treated as a final legal policy.",
  },
];

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <section className="border-b border-[#085C84]/10 bg-[#EAF3F7] py-16 sm:py-24">
        <div className="site-container">
          <p className="eyebrow">Privacy and POPIA readiness</p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.04] tracking-[-0.045em] text-[#54595F] sm:text-6xl">How this website handles information.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#54595F] sm:text-xl">This working notice describes the current implementation in plain language. It is not a substitute for the South Africa Region's approved privacy policy or legal review.</p>
        </div>
      </section>

      <section className="site-container py-14 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-20">
          <article className="max-w-3xl space-y-10 text-lg leading-8 text-[#54595F]">
            {sections.map(section => (
              <section key={section.title}>
                <h2 className="font-serif text-3xl leading-tight tracking-[-0.035em] text-[#54595F]">{section.title}</h2>
                <p className="mt-3">{section.body}</p>
              </section>
            ))}
          </article>
          <aside className="h-fit rounded-3xl bg-[#085C84] p-7 text-white shadow-[0_18px_45px_rgba(8,92,132,0.22)]">
            <p className="text-sm font-semibold uppercase tracking-[0.15em] text-white/90">Important review item</p>
            <p className="mt-3 font-serif text-2xl leading-8">The organisation must approve the final legal wording.</p>
            <p className="mt-4 text-sm leading-6 text-white/85">A qualified South African privacy attorney or the appointed Information Officer should confirm the responsible party, lawful bases, retention schedule, cross-border providers, rights process and breach-response procedure.</p>
            <a className="mt-6 inline-flex min-h-12 w-full items-center justify-center rounded-xl bg-[#2F9B3E] px-4 font-semibold text-white hover:bg-[#20752C]" href="mailto:pr-chair@na.org.za">Contact the public-relations chair</a>
          </aside>
        </div>
        <p className="mt-16 border-t border-[#085C84]/10 pt-6 text-sm leading-6 text-[#7A7A7A]">Last implementation review: 17 August 2026. This page should be updated when the organisation confirms its Information Officer, final privacy policy, retention periods, analytics decision and approved request channel.</p>
      </section>
    </PublicLayout>
  );
}
