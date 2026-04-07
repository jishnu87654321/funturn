import { Footer } from '@/components/footer';
import { Navbar } from '@/components/navbar';
import { ApplicationFormPanel } from '@/components/application-form-panel';
import { DeferredBackgroundField } from '@/components/DeferredBackgroundField';

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <DeferredBackgroundField />
      <div className="relative z-10">
        <section className="relative overflow-hidden px-4 py-14 sm:px-6 md:px-10 lg:px-12">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(139,92,246,0.22),transparent_28%),radial-gradient(circle_at_85%_18%,rgba(168,85,247,0.18),transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0))]" />
          <div className="pointer-events-none absolute left-[8%] top-16 h-48 w-48 rounded-full bg-violet-600/12 blur-[110px]" />
          <div className="pointer-events-none absolute right-[10%] top-28 h-56 w-56 rounded-full bg-fuchsia-600/10 blur-[130px]" />
          <div className="pointer-events-none absolute bottom-10 left-1/3 h-56 w-56 rounded-full bg-sky-500/10 blur-[140px]" />

          <div className="relative z-10 mx-auto max-w-6xl">
            <ApplicationFormPanel />
          </div>
        </section>
        <Footer />
      </div>
    </main>
  );
}
