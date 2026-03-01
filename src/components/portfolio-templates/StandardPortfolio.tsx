"use client";

import { Hero } from "@/components/hero";
import { About } from "@/components/about";
import { Experience } from "@/components/experience";
import { Skills } from "@/components/skills";
import { Projects } from "@/components/projects";
import { Education } from "@/components/education";
import { Contact } from "@/components/contact";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { ScrollProgress } from "@/components/scroll-progress";
import { useResumeConfig, ResumeData } from "@/context/resume-config";

export function StandardPortfolio({ 
    customData, 
    customThemeColor, 
    customSectionOrder, 
    customAvatarType 
}: { 
    customData?: ResumeData, 
    customThemeColor?: string, 
    customSectionOrder?: string[], 
    customAvatarType?: string 
} = {}) {
    const context = useResumeConfig();
    
    // Use props if provided (for live preview in editor), otherwise use context
    const resumeData = customData || context.resumeData;
    const themeColor = customThemeColor || context.themeColor;
    const sectionOrder = customSectionOrder || context.sectionOrder || [];
    const avatarType = customAvatarType || context.avatarType;

    const renderSection = (key: string) => {
        switch (key) {
            case 'summary':
                return <About key="about" />;
            case 'experience':
                return <Experience key="experience" />;
            case 'skills':
                return <Skills key="skills" />;
            case 'projects':
                return <Projects key="projects" />;
            case 'education':
                return <Education key="education" />;
            default:
                return null;
        }
    };

    return (
        <main className="min-h-screen bg-background text-foreground relative overflow-hidden">
            <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opactiy='0.5'/%3E%3C/svg%3E")`
                }}
            />
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-[20%] left-[-10%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[20%] right-[-10%] w-[30vw] h-[30vw] bg-secondary/5 rounded-full blur-[100px]" />
            </div>

            <ScrollProgress />
            <Navbar />
            <Hero />
            
            {sectionOrder.map(key => renderSection(key))}

            <Contact />
            <Footer />
        </main>
    );
}
