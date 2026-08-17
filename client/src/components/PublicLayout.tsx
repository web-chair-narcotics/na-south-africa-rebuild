import { Link, useLocation } from "wouter";
import { AlertTriangle, Mail, Menu, MessageCircle, Phone, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";

const publicAssetVersion = "asset-relay-20260816-1015";
const logoUrl = `/manus-storage/na-south-africa-logo_601526a4.png?v=${publicAssetVersion}`;
const contactEmail = "pr-chair@na.org.za";
const whatsappUrl = "https://wa.me/27861006962?text=Hello%20NA%20South%20Africa%2C%20I%20need%20help%20finding%20support.";
const cookieConsentKey = "na-cookie-consent";

const links = [
  { href: "/about", label: "About NA" },
  { href: "/recovery", label: "Recovery" },
  { href: "/literature", label: "Literature" },
  { href: "/areas", label: "Areas" },
  { href: "/contact", label: "Contact" },
];

function isSelected(currentPath: string, href: string) {
  return currentPath === href;
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [cookieAcknowledged, setCookieAcknowledged] = useState(false);
  const { data: emergencyNotice } = trpc.emergency.active.useQuery();

  useEffect(() => setMenuOpen(false), [location]);
  useEffect(() => {
    try {
      setCookieAcknowledged(window.localStorage.getItem(cookieConsentKey) === "essential");
    } catch {
      setCookieAcknowledged(false);
    }
  }, []);

  const acknowledgeCookies = () => {
    try {
      window.localStorage.setItem(cookieConsentKey, "essential");
    } catch {
      // The banner remains dismissible even when storage is unavailable.
    }
    setCookieAcknowledged(true);
  };

  return (
    <div className="min-h-screen bg-[#F8F8F8] pb-24 text-[#54595F] lg:pb-0">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      {emergencyNotice && (
        <div className={emergencyNotice.severity === "urgent" ? "border-b border-[#7A1F24] bg-[#7A1F24] text-white" : "border-b border-[#085C84]/20 bg-[#DDEFF8] text-[#085C84]"} role="alert">
          <div className="site-container flex items-start gap-3 py-3 text-sm">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            <div><p className="font-bold">{emergencyNotice.title}</p><p className="mt-0.5 leading-6">{emergencyNotice.message}</p></div>
          </div>
        </div>
      )}
      <div className="helpline-bar">
        <div className="site-container flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center sm:justify-between">
          <span className="font-semibold">Need support now? You are not alone.</span>
          <a className="font-bold underline underline-offset-4" href="tel:+27861006962">National phoneline: 0861 00 6962</a>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[#085C84]/10 bg-[#F8F8F8]/95 shadow-[0_10px_28px_rgba(8,92,132,0.05)] backdrop-blur">
        <div className="site-container flex h-[82px] items-center justify-between gap-4">
          <Link href="/" className="inline-flex min-w-0 items-center gap-3 rounded-lg focus-visible:ring-offset-2" aria-label="Narcotics Anonymous South Africa home">
            <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full bg-white ring-1 ring-[#085C84]/20">
              <img className="absolute left-0 top-0 h-11 w-[176px] max-w-none object-contain object-left" src={logoUrl} alt="" aria-hidden="true" />
            </span>
            <span className="hidden leading-[1.05] sm:block"><span className="block text-[0.78rem] font-bold tracking-[-0.02em] text-[#085C84]">Narcotics Anonymous</span><span className="mt-1 block text-[0.68rem] font-semibold uppercase tracking-[0.08em] text-[#387CBB]">South Africa Region</span></span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-[#EEEEEE] ${isSelected(location, link.href) ? "bg-[#EEEEEE] text-[#085C84]" : "text-[#085C84]"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button asChild className="rounded-full bg-[#2F9B3E] px-5 text-white shadow-none hover:bg-[#20752C]">
              <Link href="/meetings"><Search className="mr-2 h-4 w-4" aria-hidden="true" /> Find a meeting</Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-[#085C84] lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen(open => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {menuOpen && (
          <nav id="mobile-navigation" className="border-t border-[#54595F]/10 bg-[#F8F8F8] px-4 pb-5 pt-3 lg:hidden" aria-label="Mobile navigation">
            <div className="site-container grid gap-1 px-0">
              {links.map(link => (
                <Link key={link.href} href={link.href} className="rounded-xl px-4 py-3 text-base font-medium text-[#54595F] hover:bg-[#EEEEEE]">
                  {link.label}
                </Link>
              ))}
              <Button asChild className="mt-2 min-h-12 rounded-xl bg-[#2F9B3E] text-white hover:bg-[#20752C]">
                <Link href="/meetings"><Search className="mr-2 h-4 w-4" aria-hidden="true" /> Find a meeting</Link>
              </Button>
            </div>
          </nav>
        )}
      </header>

      <main id="main-content" tabIndex={-1}>{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#085C84]/15 bg-[#F8F8F8]/95 p-3 shadow-[0_-12px_28px_rgba(8,92,132,0.14)] backdrop-blur lg:hidden" aria-label="Mobile contact actions">
        <div className="mx-auto grid max-w-lg grid-cols-[1.35fr_1fr_1fr] gap-2">
          <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-[#2F9B3E] px-3 text-sm font-bold text-white shadow-sm hover:bg-[#20752C]" href={whatsappUrl} target="_blank" rel="noreferrer">
            <MessageCircle className="h-5 w-5" aria-hidden="true" /> WhatsApp
          </a>
          <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#085C84]/20 bg-white px-2 text-xs font-bold text-[#085C84] hover:bg-[#EAF3F7]" href={`mailto:${contactEmail}`}>
            <Mail className="h-4 w-4" aria-hidden="true" /> Email
          </a>
          <a className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-[#085C84]/20 bg-white px-2 text-xs font-bold text-[#085C84] hover:bg-[#EAF3F7]" href="tel:+27861006962">
            <Phone className="h-4 w-4" aria-hidden="true" /> Call
          </a>
        </div>
      </nav>

      <footer className="border-t border-white/10 bg-[#085C84] text-[#F8F8F8]">
        <div className="site-container grid gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
          <div>
            <img className="h-auto w-[230px] max-w-full" src={logoUrl} alt="Narcotics Anonymous South Africa Region" />
            <p className="mt-5 max-w-md text-sm leading-6 text-[#EEEEEE]">Narcotics Anonymous is a non-profit fellowship for people for whom drugs have become a major problem. The only requirement for membership is a desire to stop using.</p>
          </div>
          <div>
            <h2 className="font-serif text-lg">Find support</h2>
            <ul className="mt-4 grid gap-3 text-sm text-[#EEEEEE]">
              <li><Link className="hover:text-white hover:underline" href="/meetings">Find a meeting</Link></li>
              <li><a className="hover:text-white hover:underline" href="tel:+27861006962">Call 0861 00 6962</a></li>
              <li><Link className="hover:text-white hover:underline" href="/contact">Contact NA South Africa</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-lg">For members</h2>
            <ul className="mt-4 grid gap-3 text-sm text-[#EEEEEE]">
              <li><Link className="hover:text-white hover:underline" href="/literature">Literature</Link></li>
              <li><Link className="hover:text-white hover:underline" href="/about">About NA</Link></li>
              <li><Link className="hover:text-white hover:underline" href="/areas">Local areas</Link></li>
              <li><Link className="hover:text-white hover:underline" href="/privacy">Privacy and POPIA</Link></li>
              <li><Link className="hover:text-white hover:underline" href="/terms">Terms and Conditions</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="site-container flex flex-col gap-2 py-5 text-xs text-[#EEEEEE] sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Narcotics Anonymous South Africa Region.</span>
            <span>Recovery is possible. Help is available.</span>
          </div>
        </div>
      </footer>

      {!cookieAcknowledged && (
        <aside className="fixed inset-x-3 bottom-24 z-[60] rounded-2xl border border-[#085C84]/20 bg-white p-4 shadow-[0_16px_42px_rgba(8,92,132,0.2)] lg:inset-x-auto lg:bottom-5 lg:right-5 lg:max-w-md" role="region" aria-label="Cookie information">
          <p className="text-sm font-bold text-[#54595F]">Privacy choices</p>
          <p className="mt-1 text-xs leading-5 text-[#54595F]">This site uses essential cookies and browser storage for sign-in, security and preferences. No optional marketing cookies are enabled by this notice. Read the <Link className="font-bold text-[#085C84] underline underline-offset-2" href="/privacy">Privacy and POPIA notice</Link> before continuing.</p>
          <button className="mt-3 inline-flex min-h-10 w-full items-center justify-center rounded-xl bg-[#085C84] px-4 text-sm font-bold text-white hover:bg-[#06496A]" type="button" onClick={acknowledgeCookies}>Continue with essential cookies</button>
        </aside>
      )}
    </div>
  );
}
