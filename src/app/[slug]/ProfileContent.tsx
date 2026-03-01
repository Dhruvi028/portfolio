"use client";

import { useMemo } from "react";
import { UserProfile } from "@/services/profile-service";
import { ResumeConfigContext } from "@/context/resume-config";
import { StandardPortfolio } from "@/components/portfolio-templates/StandardPortfolio";
import { MiloPortfolio } from "@/components/portfolio-templates/MiloPortfolio";

export function ProfileContent({ profile }: { profile: UserProfile }) {
  const contextOverrideValue = useMemo(() => {
    return {
      isAdmin: false,
      resumeData: profile.resumeData,
      setResumeData: () => {},
      themeColor: profile.design.themeColor,
      setThemeColor: () => {},
      selectedTemplate: profile.design.template,
      setSelectedTemplate: () => {},
      showSections: profile.design.showSections || {
        summary: true,
        experience: true,
        projects: true,
        skills: true,
        education: true,
      },
      setShowSections: () => {},
      sectionOrder: profile.design.sectionOrder,
      setSectionOrder: () => {},
      portfolioTemplate: profile.design.portfolioTemplate || "standard",
      setPortfolioTemplate: () => {},
      fontSize: profile.design.fontSize,
      setFontSize: () => {},
      profiles: [],
      activeProfileId: profile.id,
      setActiveProfileId: () => {},
      loadProfiles: async () => {},
      createProfile: async () => {},
      deleteProfile: async () => {},
      setPrimaryProfile: async () => {},
      isLoading: false,
      saveCurrentProfile: async () => {},
    };
  }, [profile]);

  const { design } = profile;
  const { sectionOrder, portfolioTemplate } = design;

  return (
    <ResumeConfigContext.Provider value={contextOverrideValue as any}>
      {portfolioTemplate === "creative" ? (
        <div className="relative w-full h-[100dvh]">
          <MiloPortfolio />
        </div>
      ) : (
        <StandardPortfolio customSectionOrder={sectionOrder} />
      )}
    </ResumeConfigContext.Provider>
  );
}
