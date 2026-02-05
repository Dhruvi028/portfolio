"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { resume as staticResume } from "@/data/resume";

type TemplateType = "modern" | "classic";

interface SectionVisibility {
    summary: boolean;
    experience: boolean;
    projects: boolean;
    skills: boolean;
    education: boolean;
}

interface ExperienceItem {
    company: string;
    role: string;
    duration: string;
    description: string[];
    isVisible?: boolean;
}

interface ProjectItem {
    title: string;
    category: string;
    tech: string[] | string;
    description: string;
    link: string;
    isVisible?: boolean;
}

interface EducationItem {
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

interface ResumeConfigContextType {
  selectedTemplate: TemplateType;
  setSelectedTemplate: (template: TemplateType) => void;
  themeColor: string;
  setThemeColor: (color: string) => void;
  showSections: SectionVisibility;
  setShowSections: (sections: SectionVisibility) => void;
  customRole: string;
  setCustomRole: (role: string) => void;
  isAdmin: boolean;
  setIsAdmin: (isAdmin: boolean) => void;
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  sectionOrder: string[];
  setSectionOrder: (order: string[]) => void;
}

const defaultSections: SectionVisibility = {
    summary: true,
    experience: true,
    projects: true,
    skills: true,
    education: true,
};

const ResumeConfigContext = createContext<ResumeConfigContextType | undefined>(undefined);

export function ResumeConfigProvider({ children }: { children: React.ReactNode }) {
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateType>("modern");
  const [themeColor, setThemeColor] = useState<string>("#112e42");
  const [showSections, setShowSections] = useState<SectionVisibility>(defaultSections);
  const [customRole, setCustomRole] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [resumeData, setResumeData] = useState<ResumeData>(staticResume);
  const [sectionOrder, setSectionOrder] = useState<string[]>(['summary', 'experience', 'projects', 'skills', 'education']);

  useEffect(() => {
    const savedTemplate = localStorage.getItem("resume-template") as TemplateType;
    if (savedTemplate) setSelectedTemplate(savedTemplate);

    const savedColor = localStorage.getItem("resume-themeColor");
    if (savedColor) setThemeColor(savedColor);

    const savedSections = localStorage.getItem("resume-showSections");
    if (savedSections) setShowSections(JSON.parse(savedSections));

    const savedRole = localStorage.getItem("resume-customRole");
    if (savedRole) setCustomRole(savedRole);

    const savedResumeData = localStorage.getItem("resume-data");
    if (savedResumeData) setResumeData(JSON.parse(savedResumeData));

    const savedOrder = localStorage.getItem("resume-sectionOrder");
    if (savedOrder) setSectionOrder(JSON.parse(savedOrder));

    const isAuth = localStorage.getItem("admin_authenticated") === "true";
    if (isAuth) setIsAdmin(true);
  }, []);

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

  const updateCustomRole = (role: string) => {
      setCustomRole(role);
      localStorage.setItem("resume-customRole", role);
  };

  const updateResumeData = (data: ResumeData) => {
      setResumeData(data);
      localStorage.setItem("resume-data", JSON.stringify(data));
  };

  return (
    <ResumeConfigContext.Provider value={{
        selectedTemplate,
        setSelectedTemplate: updateTemplate,
        themeColor,
        setThemeColor: updateThemeColor,
        showSections,
        setShowSections: updateShowSections,
        customRole,
        setCustomRole: updateCustomRole,
        isAdmin,
        setIsAdmin,
        resumeData,
        setResumeData: updateResumeData,
        sectionOrder,
        setSectionOrder: (order: string[]) => {
            const uniqueOrder = Array.from(new Set(order));
            setSectionOrder(uniqueOrder);
            localStorage.setItem("resume-sectionOrder", JSON.stringify(uniqueOrder));
        }
    }}>
      {children}
    </ResumeConfigContext.Provider>
  );
}

export function useResumeConfig() {
  const context = useContext(ResumeConfigContext);
  if (context === undefined) {
    throw new Error("useResumeConfig must be used within a ResumeConfigProvider");
  }
  return context;
}
