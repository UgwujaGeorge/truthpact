import { CtaSection } from "@/components/landing/cta-section";
import { FeatureGridSection } from "@/components/landing/feature-grid-section";
import { HeroSection } from "@/components/landing/hero-section";
import { PactPreviewSection } from "@/components/landing/pact-preview-section";
import { TimelineMockupSection } from "@/components/landing/timeline-mockup-section";
import { WorkflowSection } from "@/components/landing/workflow-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <WorkflowSection />
      <PactPreviewSection />
      <TimelineMockupSection />
      <FeatureGridSection />
      <CtaSection />
    </>
  );
}

