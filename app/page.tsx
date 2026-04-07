import dynamic from 'next/dynamic';
import { DeferredBackgroundField } from '@/components/DeferredBackgroundField';
import { HeroScrollSequence } from '@/components/hero-scroll-sequence';
import { Navbar } from '@/components/navbar';
import { StatsSection } from '@/components/stats-section';
import { OpportunitiesSection } from '@/components/opportunities-section';
import { WhyFunternSection } from '@/components/why-funtern-section';
import { HowItWorksSection } from '@/components/how-it-works-section';
import { Footer } from '@/components/footer';

export const revalidate = 300;

const TestimonialsSection = dynamic(
  () => import('@/components/testimonials-section').then((mod) => mod.TestimonialsSection),
  {
    loading: () => <div className="relative z-10 min-h-[520px]" />,
  },
);

const AccessSection = dynamic(() => import('@/components/access-section').then((mod) => mod.AccessSection), {
  loading: () => <div className="relative z-10 min-h-[760px]" />,
});

const UpskillSection = dynamic(() => import('@/components/upskill-section').then((mod) => mod.UpskillSection), {
  loading: () => <div className="relative z-10 min-h-[520px]" />,
});

const ApplySection = dynamic(() => import('@/components/apply-section').then((mod) => mod.ApplySection), {
  loading: () => <div className="relative z-10 min-h-[560px]" />,
});

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <Navbar />
      <DeferredBackgroundField />
      <HeroScrollSequence />
      <div className="relative z-10">
        <StatsSection />
        <OpportunitiesSection />
        <WhyFunternSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <AccessSection />
        <UpskillSection />
        <ApplySection />
        <Footer />
      </div>
    </main>
  );
}
