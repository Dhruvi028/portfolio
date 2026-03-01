"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useResumeConfig, ResumeData } from "@/context/resume-config";
import {
  Briefcase,
  Code2,
  Terminal,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Github,
  Linkedin,
  Twitter,
  ChevronUp,
  ChevronDown,
} from "lucide-react";

// The Draggable Sticker Component to give the "Collage" look
const DraggableSticker = ({
  children,
  className = "",
  initialX = 0,
  initialY = 0,
  rotate = 0,
}: {
  children: React.ReactNode;
  className?: string;
  initialX?: number | string;
  initialY?: number | string;
  rotate?: number;
}) => {
  return (
    <motion.div
      drag
      dragMomentum={false}
      initial={{ rotate }}
      whileHover={{ scale: 1.05, zIndex: 100 }}
      whileDrag={{ scale: 1.1, zIndex: 100, rotate: rotate / 2 }}
      className={`absolute cursor-grab active:cursor-grabbing p-1.5 bg-white rounded-3xl drop-shadow-2xl z-20 ${className}`}
      style={{
        filter: "drop-shadow(0px 15px 25px rgba(0,0,0,0.6))",
      }}
    >
      <div className="rounded-2xl overflow-hidden flex items-center justify-center pointer-events-none bg-white">
        {children}
      </div>
    </motion.div>
  );
};

export function CreativePortfolio({
  customData,
  customThemeColor,
  customSectionOrder,
  customAvatarType,
}: {
  customData?: ResumeData;
  customThemeColor?: string;
  customSectionOrder?: string[];
  customAvatarType?: string;
} = {}) {
  const context = useResumeConfig();

  // Support builder props or global context
  const resumeData = customData || context.resumeData;
  const sectionOrder = customSectionOrder || context.sectionOrder;
  const avatarType = customAvatarType || context.avatarType;

  const { personalInfo, experience, projects, skills, education } = resumeData;

  const [currentSlide, setCurrentSlide] = useState(0);

  const avatarMap: Record<string, string> = {
    tech1: "/avatars/avatar1.png",
    tech2: "/avatars/avatar2.jpg",
    tech3: "/avatars/avatar3.jpg",
    tech4: "/avatars/avatar4.jpg",
    tech5: "/avatars/avatar5.jpg",
    tech6: "/avatars/avatar6.jpg",
  };
  const avatarUrl = avatarMap[avatarType] || avatarMap["tech1"];

  // Generate Slides based on visibility and order
  const sectionsObj: Record<string, any> = {
    summary:
      context.showSections.summary && personalInfo.about
        ? {
            id: "summary",
            content: (
              <div className="flex flex-col h-full justify-center space-y-6">
                <div className="text-white/50 font-mono text-sm">
                  ~/profile/readme.md
                </div>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-tight tracking-tight">
                  Hello, I'm <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                    {personalInfo.name}
                  </span>
                  .
                </h1>
                <h2 className="text-xl sm:text-2xl text-white/70 font-light">
                  {personalInfo.role} based in {personalInfo.contact.location}
                </h2>
                <p className="text-lg leading-relaxed text-white/80 mt-6 max-w-2xl">
                  {personalInfo.about}
                </p>
                <div className="pt-8">
                  <a
                    href={`mailto:${personalInfo.contact.email}`}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-bold hover:bg-gray-200 transition-colors pointer-events-auto"
                  >
                    <Mail className="w-5 h-5" /> Let's Connect
                  </a>
                </div>
              </div>
            ),
          }
        : null,

    experience:
      context.showSections.experience && experience.length > 0
        ? {
            id: "experience",
            content: (
              <div className="space-y-8 pb-10">
                <h2 className="text-sm font-bold text-white/50 mb-8 uppercase tracking-widest flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> EXPERIENCE
                </h2>
                {experience
                  .filter((e: any) => e.isVisible !== false)
                  .map((exp: any, i: number) => (
                    <div
                      key={i}
                      className="space-y-3 relative pl-6 border-l border-white/20"
                    >
                      <div className="absolute w-3 h-3 bg-white rounded-full -left-[6.5px] top-1.5" />
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                        <h3 className="text-xl font-bold">{exp.role}</h3>
                        <span className="text-sm font-mono bg-white/10 px-3 py-1 rounded-full">
                          {exp.duration}
                        </span>
                      </div>
                      <div className="text-blue-400 font-medium">
                        {exp.company}
                      </div>
                      <ul className="mt-4 space-y-3">
                        {exp.description.map((desc: string, j: number) => (
                          <li
                            key={j}
                            className="text-sm text-white/80 flex items-start gap-3 leading-relaxed"
                          >
                            <span className="text-white/40 mt-1">&rarr;</span>{" "}
                            {desc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
              </div>
            ),
          }
        : null,

    projects:
      context.showSections.projects && projects.length > 0
        ? {
            id: "projects",
            content: (
              <div className="space-y-8 pb-10">
                <h2 className="text-sm font-bold text-white/50 mb-8 uppercase tracking-widest flex items-center gap-2">
                  <Code2 className="w-4 h-4" /> PROJECTS
                </h2>
                <div className="grid gap-6">
                  {projects
                    .filter((p: any) => p.isVisible !== false)
                    .map((proj: any, i: number) => (
                      <div
                        key={i}
                        className="bg-white/5 p-6 rounded-2xl border border-white/10 hover:border-white/30 transition-colors group"
                      >
                        <div className="flex justify-between items-center mb-3">
                          <h3 className="text-xl font-bold group-hover:text-blue-400 transition-colors">
                            {proj.title}
                          </h3>
                          {proj.link && proj.link !== "#" && (
                            <a
                              href={proj.link}
                              target="_blank"
                              rel="noopener"
                              className="text-xs px-3 py-1.5 bg-white/10 rounded-full hover:bg-white text-white hover:text-black transition-colors font-bold pointer-events-auto"
                            >
                              Visit &rarr;
                            </a>
                          )}
                        </div>
                        <p className="text-sm text-white/70 mb-6 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">
                          {proj.description}
                        </p>
                        <div className="flex flex-wrap gap-2 text-xs font-mono text-white/60">
                          {(Array.isArray(proj.tech)
                            ? proj.tech
                            : [proj.tech]
                          ).map((t: string, j: number) => (
                            <span
                              key={j}
                              className="px-2 py-1 bg-black/30 rounded-md"
                            >
                              #{(t || "").replace(/\s+/g, "")}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            ),
          }
        : null,

    skills:
      context.showSections.skills && skills
        ? {
            id: "skills",
            content: (
              <div className="space-y-10 pb-10">
                <h2 className="text-sm font-bold text-white/50 mb-8 uppercase tracking-widest flex items-center gap-2">
                  <Terminal className="w-4 h-4" /> TECHNICAL SKILLS
                </h2>
                <div className="grid gap-8">
                  {Object.entries(skills).map(
                    ([category, items]: [string, any], i: number) => (
                      <div
                        key={i}
                        className="bg-white/5 p-6 rounded-2xl border border-white/5"
                      >
                        <h3 className="text-sm uppercase tracking-widest text-blue-400/80 mb-4">
                          {category}
                        </h3>
                        <div className="flex flex-wrap gap-2.5">
                          {items.map((skill: string, j: number) => (
                            <span
                              key={j}
                              className="bg-white/10 px-4 py-2 rounded-xl text-sm border border-white/10 hover:bg-white hover:text-black transition-colors cursor-default"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            ),
          }
        : null,

    education:
      context.showSections.education && education.length > 0
        ? {
            id: "education",
            content: (
              <div className="space-y-8 pb-10">
                <h2 className="text-sm font-bold text-white/50 mb-8 uppercase tracking-widest flex items-center gap-2">
                  <GraduationCap className="w-4 h-4" /> EDUCATION
                </h2>
                {education.map((edu: any, i: number) => (
                  <div
                    key={i}
                    className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-8 bg-white/5 rounded-3xl border border-white/10"
                  >
                    <div>
                      <h3 className="text-xl font-bold mb-2">{edu.degree}</h3>
                      <div className="text-white/60 font-medium">
                        {edu.institution}
                      </div>
                    </div>
                    <div className="font-mono bg-blue-500/20 text-blue-300 px-4 py-2 rounded-full text-sm shrink-0">
                      {edu.duration}
                    </div>
                  </div>
                ))}
              </div>
            ),
          }
        : null,
  };

  const slides = sectionOrder.map((key) => sectionsObj[key]).filter(Boolean);

  const handleNext = () => {
    if (currentSlide < slides.length - 1) setCurrentSlide((prev) => prev + 1);
  };

  const handlePrev = () => {
    if (currentSlide > 0) setCurrentSlide((prev) => prev - 1);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") handleNext();
      if (e.key === "ArrowUp" || e.key === "ArrowLeft") handlePrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentSlide, slides.length]);

  if (slides.length === 0)
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        No sections selected
      </div>
    );

  return (
    <main className="fixed inset-0 bg-[#000000] text-white font-mono overflow-hidden">
      {/* BACKGROUND GRID */}
      <div
        className="absolute inset-0 opacity-[0.15] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          backgroundPosition: "center center",
        }}
      />

      {/* GLOWS */}
      <div className="absolute top-[-20vh] left-0 right-0 h-[40vh] bg-blue-500/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20vh] left-0 right-0 h-[40vh] bg-purple-500/20 blur-[150px] pointer-events-none" />

      {/* DRAGGABLE "STICKER" ELEMENTS */}
      {/* Contact / Phone */}
      <DraggableSticker
        className="top-[10%] left-[8%] md:left-[15%]"
        rotate={-15}
      >
        <div className="flex items-center gap-3 bg-orange-500 text-white px-5 py-3 rounded-xl font-black italic shadow-inner">
          <Phone className="w-5 h-5 fill-current" />{" "}
          {personalInfo.contact.phone.split(" ")[0] || "CALL ME"}
        </div>
      </DraggableSticker>

      {/* Email */}
      <DraggableSticker
        className="bottom-[15%] right-[10%] md:right-[20%]"
        rotate={12}
      >
        <a
          href={`mailto:${personalInfo.contact.email}`}
          className="flex flex-col items-center gap-1 bg-black text-white px-6 py-4 rounded-xl font-black hover:bg-zinc-900 pointer-events-auto"
        >
          <span className="text-xs text-white/50 tracking-widest uppercase">
            Email Me!
          </span>
          <span className="text-3xl">@</span>
        </a>
      </DraggableSticker>

      {/* LinkedIn Icon */}
      <DraggableSticker
        className="top-[30%] right-[8%] md:right-[15%]"
        rotate={20}
      >
        <div className="bg-[#0077b5] p-4 rounded-xl">
          <Linkedin className="w-10 h-10 text-white" fill="white" />
        </div>
      </DraggableSticker>

      {/* GitHub Icon */}
      <DraggableSticker
        className="bottom-[25%] left-[5%] md:left-[18%]"
        rotate={-25}
      >
        <div className="bg-[#181717] p-4 rounded-xl">
          <Github className="w-10 h-10 text-white" fill="white" />
        </div>
      </DraggableSticker>

      {/* Location */}
      <DraggableSticker
        className="top-[50%] left-[2%] md:left-[10%]"
        rotate={8}
      >
        <div className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2">
          <MapPin className="w-4 h-4" />{" "}
          {personalInfo.contact.location.split(",")[0]}
        </div>
      </DraggableSticker>

      {/* Avatar / Photo Sticker */}
      <DraggableSticker
        className="top-[2%] right-[2%] md:right-[40%] md:top-[8%]"
        rotate={-5}
      >
        <div className="w-32 h-32 md:w-48 md:h-48 rounded-xl overflow-hidden bg-gray-100 flex items-center justify-center p-2 relative">
          <div className="absolute inset-0 bg-white shadow-inner pointer-events-none border border-gray-200 rounded-xl" />
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover rounded-lg"
            draggable={false}
          />
        </div>
      </DraggableSticker>

      {/* CENTRAL CARD STACK */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30 p-4 sm:p-8">
        <div className="relative w-full max-w-3xl aspect-[1/1.2] sm:aspect-[4/3] pointer-events-auto">
          {/* Background stacked cards for depth effect */}
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl border border-white/20 rounded-[2rem] transform translate-y-6 scale-[0.92] z-0" />
          <div className="absolute inset-0 bg-black/95 backdrop-blur-xl border border-white/20 rounded-[2rem] transform translate-y-3 scale-[0.96] z-0" />

          {/* Main interactive card */}
          <div className="absolute inset-0 bg-black border border-white/20 rounded-[2rem] p-6 sm:p-12 shadow-2xl z-10 flex flex-col overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)]">
            {/* Pagination Header */}
            <div className="flex justify-end items-center gap-4 mb-8 shrink-0 relative z-20">
              <button
                onClick={handlePrev}
                disabled={currentSlide === 0}
                className="p-2.5 border border-white/20 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <span className="font-mono text-sm tracking-widest">
                {currentSlide + 1} / {slides.length}
              </span>
              <button
                onClick={handleNext}
                disabled={currentSlide === slides.length - 1}
                className="p-2.5 border border-white/20 rounded-full hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Slide Content wrapper */}
            <div className="flex-1 overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pb-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentSlide}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {slides[currentSlide].content}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Add these custom styles to your global css later if needed, but tailwind covers most of this inline!
// To hide standard scrollbars but allow scrolling:
// .scrollbar-none::-webkit-scrollbar { display: none; }
