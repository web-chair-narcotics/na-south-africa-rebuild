import { useEffect } from "react";
import { useLocation } from "wouter";
import { legacyRouteMap } from "@/legacyRouteMap";

export default function LegacyRouteRedirect() {
  const [, navigate] = useLocation();
  const destination = legacyRouteMap[window.location.pathname] ?? "/404";

  useEffect(() => {
    navigate(destination, { replace: true });
  }, [destination, navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f6f0] px-6 text-center text-[#142d2a]">
      <p className="text-sm font-semibold uppercase tracking-[0.16em]">Taking you to the rebuilt NA South Africa site…</p>
    </main>
  );
}
