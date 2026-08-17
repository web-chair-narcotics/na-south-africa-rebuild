import { Link } from "wouter";
import PublicLayout from "@/components/PublicLayout";

const terms = [
  {
    title: "Using this website",
    text: "This website provides information about Narcotics Anonymous South Africa, public meeting details, recovery information and literature links. Information is provided to help visitors take a practical next step and is not a promise that every meeting, venue, joining link or service will remain available without change.",
  },
  {
    title: "Meeting information",
    text: "Visitors should check the meeting details before travelling or joining online. In-person and online meetings are intentionally presented separately. Do not publish another person's private information through this site, and do not rely on a public directory entry as an emergency service.",
  },
  {
    title: "External services and links",
    text: "Map providers, WhatsApp, email, telephone networks and external literature sites operate under their own terms. Opening an external service may take you away from this website. The organisation should approve the final list of providers, disclaimers and any service-specific conditions before this page is adopted as a final legal document.",
  },
  {
    title: "Content and availability",
    text: "The organisation may update, correct, suspend or remove public content when information changes or requires review. Website availability, meeting attendance, emergency response and recovery outcomes cannot be guaranteed by this information service.",
  },
  {
    title: "Final approval required",
    text: "This is a placeholder implementation, not the organisation's final Terms and Conditions. The South Africa Region should approve the responsible legal entity, governing law, liability wording, intellectual-property permissions, complaint route, accessibility commitment, administrator rules and effective date with qualified legal advice before relying on it.",
  },
];

export default function TermsPage() {
  return (
    <PublicLayout>
      <section className="border-b border-[#085C84]/10 bg-[#EAF3F7] py-16 sm:py-24">
        <div className="site-container">
          <p className="eyebrow">Terms and Conditions</p>
          <h1 className="mt-4 max-w-4xl font-serif text-4xl leading-[1.04] tracking-[-0.045em] text-[#54595F] sm:text-6xl">A clear framework for using this website.</h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-[#54595F] sm:text-xl">This placeholder explains the intended scope of the website. It must be approved and completed by the organisation before it is treated as a final legal document.</p>
        </div>
      </section>
      <section className="site-container py-14 sm:py-20">
        <div className="mx-auto max-w-3xl space-y-10 text-lg leading-8 text-[#54595F]">
          {terms.map(term => (
            <section key={term.title}>
              <h2 className="font-serif text-3xl leading-tight tracking-[-0.035em] text-[#54595F]">{term.title}</h2>
              <p className="mt-3">{term.text}</p>
            </section>
          ))}
          <div className="rounded-2xl border border-[#DDE6EB] bg-[#F8F8F8] p-6 text-base leading-7">
            Read the current <Link className="font-bold text-[#085C84] underline decoration-[#2F9B3E] underline-offset-4" href="/privacy">Privacy and POPIA readiness notice</Link> or <Link className="font-bold text-[#085C84] underline decoration-[#2F9B3E] underline-offset-4" href="/contact">contact NA South Africa</Link>.
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
