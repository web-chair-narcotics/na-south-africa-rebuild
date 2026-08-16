import { useEffect } from "react";
import { useLocation } from "wouter";
import { legacyRouteMap } from "@/legacyRouteMap";

export function getLegacyDestination(pathname: string) {
  const legacyPath = pathname.replace(/\/+$/, "") || "/";
  return legacyPath.endsWith("/online-meetings") ? "/meetings?meetingFormat=online" : legacyPath.endsWith("/in-person-meetings") ? "/meetings?meetingFormat=in_person" : legacyRouteMap[pathname] ?? "/404";
}

export default function LegacyRouteRedirect() {
  const [, navigate] = useLocation();
  const destination = getLegacyDestination(window.location.pathname);

  useEffect(() => {
    navigate(destination, { replace: true });
  }, [destination, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F8F8F8] px-6 text-center text-[#54595F]">
      <p className="text-sm font-semibold uppercase tracking-[0.16em]">Taking you to the rebuilt NA South Africa site…</p>
    </main>
  );
}
