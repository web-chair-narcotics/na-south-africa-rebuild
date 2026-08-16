import { LockKeyhole, ShieldCheck } from "lucide-react";
import PublicLayout from "@/components/PublicLayout";
import { Button } from "@/components/ui/button";
import { startLogin } from "@/const";

export default function AdminLanding() {
  return (
    <PublicLayout>
      <section className="site-container flex min-h-[calc(100vh-280px)] items-center py-14 sm:py-20">
        <div className="grid w-full max-w-4xl gap-8 rounded-[2rem] border border-[#EEEEEE] bg-white p-7 shadow-[0_20px_60px_rgba(20,45,42,0.08)] sm:p-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-14">
          <div><p className="eyebrow">Secure area administration</p><h1 className="mt-4 font-serif text-4xl leading-[1.04] tracking-[-0.04em] text-[#54595F] sm:text-5xl">Manage the meetings and content entrusted to your area.</h1><p className="mt-6 leading-7 text-[#7A7A7A]">Area administrators can only work with their assigned areas. National super-administrators retain oversight of all records and publication review.</p></div>
          <div className="rounded-3xl bg-[#F8F8F8] p-6 sm:p-7"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#2F9B3E] text-white"><LockKeyhole className="h-5 w-5" /></div><h2 className="mt-6 font-serif text-2xl text-[#54595F]">Sign in to continue</h2><p className="mt-3 text-sm leading-6 text-[#7A7A7A]">Use the administrator account that has been assigned to you by the national team.</p><Button className="mt-7 min-h-12 w-full rounded-xl bg-[#2F9B3E] text-white hover:bg-[#20752C]" onClick={() => startLogin()}>Secure sign in</Button><div className="mt-5 flex gap-2 text-xs leading-5 text-[#7A7A7A]"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#085C84]" />Access is checked on every request. Meeting data is never shared across areas.</div></div>
        </div>
      </section>
    </PublicLayout>
  );
}
