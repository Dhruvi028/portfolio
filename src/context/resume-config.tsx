"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { resume as staticResume } from "@/data/resume";
import { profileService, UserProfile } from "@/services/profile-service";

export type TemplateType = "modern" | "international";

export interface ExperienceItem {
  company: string;
  role: string;
  duration: string;
  description: string[];
  isVisible?: boolean;
}

export interface ProjectItem {
  title: string;
  category: string;
  tech: string[] | string;
  description: string;
  link: string;
  isVisible?: boolean;
}

export interface EducationItem {
  degree: string;
  institution: string;
  duration: string;
}

export interface ResumeData {
  personalInfo: {
    name: string;
    role: string;
    about: string;
    contact: {
      phone: string;
      email: string;
      location: string;
    };
  };
  highlightedSkills?: string[];
  skills: Record<string, string[]>;
  experience: ExperienceItem[];
  projects: ProjectItem[];
  education: EducationItem[];
}

interface SectionVisibility {
  summary: boolean;
  experience: boolean;
  projects: boolean;
  skills: boolean;
  education: boolean;
}

interface ResumeConfigContextType {
  selectedTemplate: TemplateType;
  setSelectedTemplate: (template: TemplateType) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  showSections: SectionVisibility;
  setShowSections: (sections: SectionVisibility) => void;
  portfolioTemplate: string;
  setPortfolioTemplate: (template: string) => void;
  avatarType: string;
  setAvatarType: (avatar: string) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  sectionOrder: string[];
  setSectionOrder: (order: string[]) => void;
  fontSize: number;
  setFontSize: (size: number) => void;
  // Multi-profile extensions
  profiles: UserProfile[];
  activeProfileId: string | null;
  setActiveProfileId: (id: string | null) => void;
  loadProfiles: () => Promise<void>;
  createProfile: (
    title: string,
    slug: string,
    baseData?: ResumeData,
    baseDesign?: UserProfile["design"],
  ) => Promise<void>;
  deleteProfile: (id: string) => Promise<void>;
  setPrimaryProfile: (id: string) => Promise<void>;
  isLoading: boolean;
  saveCurrentProfile: (
    data?: ResumeData,
    design?: Partial<UserProfile["design"]>,
  ) => Promise<void>;
}

const defaultSections: SectionVisibility = {
  summary: true,
  experience: true,
  projects: true,
  skills: true,
  education: true,
};

const ResumeConfigContext = createContext<ResumeConfigContextType | undefined>(
  undefined,
);

export function ResumeConfigProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedTemplate, setSelectedTemplate] =
    useState<TemplateType>("modern");
  const [themeColor, setThemeColor] = useState<string>("#112e42");
  const [showSections, setShowSections] =
    useState<SectionVisibility>(defaultSections);
  const [portfolioTemplate, setPortfolioTemplate] =
    useState<string>("standard");
  const [avatarType, setAvatarType] = useState<string>("female1");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [resumeData, setResumeData] = useState<ResumeData>(staticResume);
  const [sectionOrder, setSectionOrder] = useState<string[]>([
    "summary",
    "experience",
    "projects",
    "skills",
    "education",
  ]);
  const [fontSize, setFontSize] = useState<number>(10);

  // Multi-profile state
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const savedTemplate = localStorage.getItem(
      "resume-template",
    ) as TemplateType;
    if (savedTemplate) setSelectedTemplate(savedTemplate);

    const savedColor = localStorage.getItem("resume-themeColor");
    if (savedColor) setThemeColor(savedColor);

    const savedSections = localStorage.getItem("resume-showSections");
    if (savedSections) setShowSections(JSON.parse(savedSections));

    const savedResumeData = localStorage.getItem("resume-data");
    if (savedResumeData) setResumeData(JSON.parse(savedResumeData));

    const savedOrder = localStorage.getItem("resume-sectionOrder");
    if (savedOrder) setSectionOrder(JSON.parse(savedOrder));

    const savedFontSize = localStorage.getItem("resume-fontSize");
    if (savedFontSize) setFontSize(parseInt(savedFontSize));

    const savedActiveId = localStorage.getItem("resume-activeProfileId");
    if (savedActiveId) setActiveProfileId(savedActiveId);

    const savedPortfolioTemplate = localStorage.getItem(
      "resume-portfolioTemplate",
    );
    if (savedPortfolioTemplate) setPortfolioTemplate(savedPortfolioTemplate);

    const savedAvatarType = localStorage.getItem("resume-avatarType");
    if (savedAvatarType) setAvatarType(savedAvatarType);

    loadProfiles();

    const isAuth = localStorage.getItem("admin_authenticated") === "true";
    if (isAuth) setIsAdmin(true);
  }, []);

  const loadProfiles = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await profileService.getProfiles();
      setProfiles(data);

      // Auto-select primary or first profile if none selected
      if (!activeProfileId && data.length > 0) {
        const savedActiveId = localStorage.getItem("resume-activeProfileId");
        const profileToSelect =
          data.find((p) => p.id === savedActiveId) ||
          data.find((p) => p.isPrimary) ||
          data[0];

        setActiveProfileId(profileToSelect.id);
        applyProfile(profileToSelect);
      }
    } catch (error) {
      console.error("Failed to load profiles:", error);
    } finally {
      setIsLoading(false);
    }
  }, [activeProfileId]);

  const applyProfile = (profile: UserProfile) => {
    setResumeData(profile.resumeData);
    setSelectedTemplate(profile.design.template);
    setThemeColor(profile.design.themeColor);
    setSectionOrder(profile.design.sectionOrder);
    setFontSize(profile.design.fontSize);
    setShowSections(profile.design.showSections || defaultSections);
    setPortfolioTemplate(profile.design.portfolioTemplate || "standard");
    setAvatarType(profile.design.avatarType || "female1");
  };

  const updateTemplate = (template: TemplateType) => {
    setSelectedTemplate(template);
    localStorage.setItem("resume-template", template);
  };

  const updateThemeColor = (color: string) => {
    setThemeColor(color);
    localStorage.setItem("resume-themeColor", color);
  };

  const updateShowSections = (sections: SectionVisibility) => {
    setShowSections(sections);
    localStorage.setItem("resume-showSections", JSON.stringify(sections));
  };

  const updatePortfolioTemplate = (template: string) => {
    setPortfolioTemplate(template);
    localStorage.setItem("resume-portfolioTemplate", template);
  };

  const updateAvatarType = (avatar: string) => {
    setAvatarType(avatar);
    localStorage.setItem("resume-avatarType", avatar);
  };

  const updateResumeData = (data: ResumeData) => {
    setResumeData(data);
    localStorage.setItem("resume-data", JSON.stringify(data));
  };

  return (
    <ResumeConfigContext.Provider
      value={{
        selectedTemplate,
        setSelectedTemplate: updateTemplate,
        themeColor,
        setThemeColor: updateThemeColor,
        showSections,
        setShowSections: updateShowSections,
        portfolioTemplate,
        setPortfolioTemplate: updatePortfolioTemplate,
        avatarType,
        setAvatarType: updateAvatarType,
        isAdmin,
        setIsAdmin,
        resumeData,
        setResumeData: updateResumeData,
        sectionOrder,
        setSectionOrder: (order: string[]) => {
          const uniqueOrder = Array.from(new Set(order));
          setSectionOrder(uniqueOrder);
          localStorage.setItem(
            "resume-sectionOrder",
            JSON.stringify(uniqueOrder),
          );
        },
        fontSize,
        setFontSize: (size: number) => {
          setFontSize(size);
          localStorage.setItem("resume-fontSize", size.toString());
        },
        profiles,
        activeProfileId,
        setActiveProfileId: (id: string | null) => {
          setActiveProfileId(id);
          if (id) localStorage.setItem("resume-activeProfileId", id);
          const profile = profiles.find((p) => p.id === id);
          if (profile) applyProfile(profile);
        },
        loadProfiles,
        createProfile: async (
          title: string,
          slug: string,
          baseData?: ResumeData,
          baseDesign?: UserProfile["design"],
        ) => {
          const newProfile: Partial<UserProfile> = {
            title,
            slug,
            isPrimary: profiles.length === 0,
            resumeData: baseData || staticResume,
            design: baseDesign || {
              template: "modern",
              themeColor: "#112e42",
              fontSize: 10,
              sectionOrder: [
                "summary",
                "experience",
                "projects",
                "skills",
                "education",
              ],
              showSections: defaultSections,
              portfolioTemplate: "standard",
              avatarType: "female1",
            },
          };
          await profileService.saveProfile(newProfile);
          await loadProfiles();
        },
        deleteProfile: async (id: string) => {
          await profileService.deleteProfile(id);
          await loadProfiles();
        },
        setPrimaryProfile: async (id: string) => {
          await profileService.setPrimary(id);
          await loadProfiles();
        },
        isLoading,
        saveCurrentProfile: async (
          overrideData?: ResumeData,
          overrideDesign?: Partial<UserProfile["design"]>,
        ) => {
          if (!activeProfileId) return;

          const updatedProfile: Partial<UserProfile> = {
            id: activeProfileId,
            resumeData: overrideData || resumeData,
            design: {
              template: overrideDesign?.template || selectedTemplate,
              themeColor: overrideDesign?.themeColor || themeColor,
              fontSize: overrideDesign?.fontSize || fontSize,
              sectionOrder: overrideDesign?.sectionOrder || sectionOrder,
              showSections: overrideDesign?.showSections || showSections,
              portfolioTemplate:
                overrideDesign?.portfolioTemplate || portfolioTemplate,
              avatarType: overrideDesign?.avatarType || avatarType,
            },
          };

          await profileService.saveProfile(updatedProfile);
          await loadProfiles();
        },
      }}
    >
      {children}
    </ResumeConfigContext.Provider>
  );
}

export function useResumeConfig() {
  const context = useContext(ResumeConfigContext);
  if (context === undefined) {
    throw new Error(
      "useResumeConfig must be used within a ResumeConfigProvider",
    );
  }
  return context;
}

export { ResumeConfigContext };
