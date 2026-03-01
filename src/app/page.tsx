"use client";

import { useResumeConfig } from "@/context/resume-config";
import { StandardPortfolio } from "@/components/portfolio-templates/StandardPortfolio";
import { MiloPortfolio } from "@/components/portfolio-templates/MiloPortfolio";
import { CreativePortfolio } from "@/components/portfolio-templates/CreativePortfolio";

export default function Home() {
  const { sectionOrder, portfolioTemplate } = useResumeConfig();

  if (portfolioTemplate === "creative") {
    return <MiloPortfolio />;
  }

  // Fallback/Legacy reference just in case
  if (portfolioTemplate === "creative_v1") {
    return <CreativePortfolio />;
  }

  return <StandardPortfolio customSectionOrder={sectionOrder} />;
}
