import { Link, useLocation } from "wouter";
import { Menu, Phone, Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

const logoUrl = "/manus-storage/na-south-africa-logo_66b38f97.png";

const links = [
  { href: "/about", label: "About NA" },
  { href: "/recovery", label: "Recovery" },
  { href: "/literature", label: "Literature" },
  { href: "/news", label: "News" },
  { href: "/areas", label: "Areas" },
  { href: "/contact", label: "Contact" },
];

function isSelected(currentPath: string, href: string) {
  return currentPath === href;
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [location]);

  return (
    <div className="min-h-screen bg-[#f7f7f2] text-[#172329]">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <div className="helpline-bar">
        <div className="site-container flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-center sm:justify-between">
          <span className="font-semibold">Need support now? You are not alone.</span>
          <a className="inline-flex items-center gap-2 font-bold underline underline-offset-4" href="tel:+27861006962">
            <Phone className="h-3.5 w-3.5" aria-hidden="true" /> National phoneline: 0861 00 6962
          </a>
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-[#172329]/10 bg-[#f7f7f2]/95 backdrop-blur">
        <div className="site-container flex h-[78px] items-center justify-between gap-4">
          <Link href="/" className="inline-flex min-w-0 items-center" aria-label="Narcotics Anonymous South Africa home">
            <span className="relative h-10 w-10 shrink-0 overflow-hidden sm:h-11 sm:w-11"><img className="absolute left-0 top-0 h-10 max-w-none sm:h-11" src={logoUrl} alt="" /></span>
            <span className="ml-2 hidden leading-tight text-[#145044] sm:block"><span className="block text-[11px] font-bold tracking-[0.02em]">Narcotics Anonymous</span><span className="block text-[10px] font-medium">South Africa Region</span></span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary navigation">
            {links.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-2 text-sm font-medium transition-colors hover:bg-[#dfe7df] ${isSelected(location, link.href) ? "bg-[#dfe7df] text-[#145044]" : "text-[#405057]"}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button asChild variant="ghost" className="rounded-full text-[#145044] hover:bg-[#dfe7df] hover:text-[#145044]">
              <Link href="/admin">Area admin</Link>
            </Button>
            <Button asChild className="rounded-full bg-[#145044] px-5 text-white shadow-none hover:bg-[#0f3e35]">
              <Link href="/meetings"><Search className="mr-2 h-4 w-4" aria-hidden="true" /> Find a meeting</Link>
            </Button>
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-[#145044] lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMenuOpen(open => !open)}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {menuOpen && (
          <nav id="mobile-navigation" className="border-t border-[#172329]/10 bg-[#f7f7f2] px-4 pb-5 pt-3 lg:hidden" aria-label="Mobile navigation">
            <div className="site-container grid gap-1 px-0">
              {links.map(link => (
                <Link key={link.href} href={link.href} className="rounded-xl px-4 py-3 text-base font-medium text-[#28383d] hover:bg-[#dfe7df]">
                  {link.label}
                </Link>
              ))}
              <Link href="/admin" className="rounded-xl px-4 py-3 text-base font-medium text-[#28383d] hover:bg-[#dfe7df]">Area admin</Link>
              <Button asChild className="mt-2 min-h-12 rounded-xl bg-[#145044] text-white hover:bg-[#0f3e35]">
                <Link href="/meetings"><Search className="mr-2 h-4 w-4" aria-hidden="true" /> Find a meeting</Link>
              </Button>
            </div>
          </nav>
        )}
      </header>

      <main id="main-content">{children}</main>

      <footer className="border-t border-white/10 bg-[#142d2a] text-[#eef4ed]">
        <div className="site-container grid gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr_0.85fr]">
          <div>
            <div className="flex items-center"><span className="relative h-10 w-10 shrink-0 overflow-hidden"><img className="absolute left-0 top-0 h-10 max-w-none brightness-0 invert" src={logoUrl} alt="" /></span><span className="ml-2 leading-tight text-white"><span className="block text-[11px] font-bold">Narcotics Anonymous</span><span className="block text-[10px] text-[#c6d5cc]">South Africa Region</span></span></div>
            <p className="mt-5 max-w-md text-sm leading-6 text-[#c6d5cc]">Narcotics Anonymous is a non-profit fellowship for people for whom drugs have become a major problem. The only requirement for membership is a desire to stop using.</p>
          </div>
          <div>
            <h2 className="font-serif text-lg">Find support</h2>
            <ul className="mt-4 grid gap-3 text-sm text-[#c6d5cc]">
              <li><Link className="hover:text-white hover:underline" href="/meetings">Find a meeting</Link></li>
              <li><a className="hover:text-white hover:underline" href="tel:+27861006962">Call 0861 00 6962</a></li>
              <li><Link className="hover:text-white hover:underline" href="/contact">Contact NA South Africa</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="font-serif text-lg">For members</h2>
            <ul className="mt-4 grid gap-3 text-sm text-[#c6d5cc]">
              <li><Link className="hover:text-white hover:underline" href="/literature">Literature</Link></li>
              <li><Link className="hover:text-white hover:underline" href="/news">News & updates</Link></li>
              <li><Link className="hover:text-white hover:underline" href="/admin">Area administration</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="site-container flex flex-col gap-2 py-5 text-xs text-[#afc2b6] sm:flex-row sm:items-center sm:justify-between">
            <span>© {new Date().getFullYear()} Narcotics Anonymous South Africa Region.</span>
            <span>Recovery is possible. Help is available.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
