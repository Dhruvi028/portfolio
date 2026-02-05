"use client";

import { useResumeConfig, ResumeData } from "@/context/resume-config";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, RotateCcw, Plus, Trash2, CheckCircle2, Circle, GripVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Reorder } from "framer-motion";
import { ModernTemplate } from "@/components/resume-templates/ModernTemplate";
import { ClassicTemplate } from "@/components/resume-templates/ClassicTemplate";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  { ssr: false, loading: () => <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 border rounded-lg">Loading Preview...</div> }
);

export default function ResumeBuilderPage() {
  const { 
    isAdmin, 
    resumeData, setResumeData, 
    themeColor, setThemeColor,
    selectedTemplate, setSelectedTemplate,
    showSections, setShowSections,
    customRole, setCustomRole,
    sectionOrder, setSectionOrder
  } = useResumeConfig();
  const router = useRouter();
  
  // Local state for the editor to avoid lagging the preview on every keystroke
  const [localData, setLocalData] = useState<ResumeData>(resumeData);
  const [localTemplate, setLocalTemplate] = useState(selectedTemplate);
  const [localThemeColor, setLocalThemeColor] = useState(themeColor);
  const [localShowSections, setLocalShowSections] = useState(showSections);
  const [localSectionOrder, setLocalSectionOrder] = useState(sectionOrder);
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("");

  // Sync initial data
  useEffect(() => {
    if (resumeData) setLocalData(resumeData);
    if (selectedTemplate) setLocalTemplate(selectedTemplate);
    if (themeColor) setLocalThemeColor(themeColor);
    if (showSections) setLocalShowSections(showSections);
  }, [resumeData, selectedTemplate, themeColor, showSections]);

  // PROTECTION: Redirect if not admin
  useEffect(() => {
    if (!isAdmin) {
      if (typeof window !== "undefined") {
        const isAuth = localStorage.getItem("admin_authenticated") === "true";
        if (!isAuth) {
          router.push("/");
        }
      }
    }
  }, [isAdmin, router]);

  const handleSave = () => {
    setResumeData(localData);
    setSelectedTemplate(localTemplate);
    setThemeColor(localThemeColor);
    setShowSections(localShowSections);
    const uniqueOrder = Array.from(new Set(localSectionOrder));
    setSectionOrder(uniqueOrder);
    alert("Resume changes saved successfully!");
  };

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all changes to default? This will clear your custom edits.")) {
        localStorage.removeItem("resume-data");
        window.location.reload();
    }
  };

  // Helper to update deeply nested personal info
  const updatePersonalInfo = (field: string, value: string) => {
    setLocalData({
      ...localData,
      personalInfo: {
        ...localData.personalInfo,
        [field]: value
      }
    });
  };

  const handleAddSkill = () => {
    if (!newSkillName.trim() || !newSkillCategory.trim()) return;

    const skills = { ...localData.skills };
    const category = newSkillCategory.trim();
    const skill = newSkillName.trim();

    if (!skills[category]) {
      skills[category] = [];
    }

    if (!skills[category].includes(skill)) {
      skills[category] = [...skills[category], skill];
    }

    setLocalData({
      ...localData,
      skills,
      highlightedSkills: [...(localData.highlightedSkills || []), skill]
    });

    setNewSkillName("");
    setNewSkillCategory("");
  };

  const handleRemoveSkill = (category: string, skill: string) => {
     const skills = { ...localData.skills };
     skills[category] = (skills[category] || []).filter((s: string) => s !== skill);
     
     // Remove category if empty? Maybe optional, but let's keep it for now.
     if (skills[category].length === 0) {
        delete skills[category];
     }

     setLocalData({
       ...localData,
       skills,
       highlightedSkills: (localData.highlightedSkills || []).filter((s: string) => s !== skill)
     });
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold tracking-tight">Resume Builder <span className="text-xs font-normal text-muted-foreground ml-2">Admin Edition</span></h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={handleReset} className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8 flex flex-col lg:row lg:flex-row gap-8">
        {/* Left Column: Editor */}
        <div className="flex-1 w-full lg:max-w-xl space-y-6">
          <Tabs defaultValue="basics" className="w-full">
            <TabsList className="grid grid-cols-5 w-full h-12">
              <TabsTrigger value="basics">Basics</TabsTrigger>
              <TabsTrigger value="experience">Experience</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
            </TabsList>

            {/* BASICS TAB */}
            <TabsContent value="basics" className="space-y-6 pt-4">
               <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input 
                      id="name" 
                      value={localData.personalInfo.name} 
                      onChange={(e) => updatePersonalInfo('name', e.target.value)} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="role">Default Role</Label>
                    <Input 
                      id="role" 
                      value={localData.personalInfo.role} 
                      onChange={(e) => updatePersonalInfo('role', e.target.value)} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      value={localData.personalInfo.contact.location} 
                      onChange={(e) => setLocalData({
                        ...localData,
                        personalInfo: {
                          ...localData.personalInfo,
                          contact: { ...localData.personalInfo.contact, location: e.target.value }
                        }
                      })} 
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="about">About/Summary</Label>
                    <Textarea 
                      id="about" 
                      rows={5}
                      value={localData.personalInfo.about} 
                      onChange={(e) => updatePersonalInfo('about', e.target.value)} 
                    />
                  </div>
               </div>
            </TabsContent>

            {/* EXPERIENCE TAB */}
            <TabsContent value="experience" className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Work History</h3>
                    <Button variant="outline" size="sm" onClick={() => {
                        const newExp = { company: "New Company", role: "Role", duration: "Jan 2024 - Present", description: [], isVisible: true };
                        setLocalData({ ...localData, experience: [newExp, ...localData.experience] });
                    }}>
                        <Plus className="w-4 h-4 mr-2" /> Add 
                    </Button>
                </div>
                <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-6">
                        {localData.experience.map((exp, idx: number) => (
                            <div key={idx} className="p-4 border rounded-lg space-y-3 relative group transition-all hover:border-primary/30">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Company Details</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor={`exp-vis-${idx}`} className="text-xs cursor-pointer">Visible</Label>
                                            <Switch 
                                                id={`exp-vis-${idx}`} 
                                                checked={exp.isVisible !== false}
                                                onCheckedChange={(checked) => {
                                                    const newExpList = [...localData.experience];
                                                    newExpList[idx] = { ...exp, isVisible: checked };
                                                    setLocalData({ ...localData, experience: newExpList });
                                                }}
                                            />
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                                            onClick={() => {
                                                const newExp = [...localData.experience];
                                                newExp.splice(idx, 1);
                                                setLocalData({ ...localData, experience: newExp });
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <Input 
                                    className={`font-bold border-none p-0 h-auto focus-visible:ring-0 text-lg ${exp.isVisible === false ? 'opacity-50' : ''}`} 
                                    value={exp.company}
                                    onChange={(e) => {
                                        const newExpList = [...localData.experience];
                                        newExpList[idx] = { ...exp, company: e.target.value };
                                        setLocalData({ ...localData, experience: newExpList });
                                    }}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                    <Input 
                                        placeholder="Role" 
                                        value={exp.role}
                                        onChange={(e) => {
                                            const newExpList = [...localData.experience];
                                            newExpList[idx] = { ...exp, role: e.target.value };
                                            setLocalData({ ...localData, experience: newExpList });
                                        }}
                                    />
                                    <Input 
                                        placeholder="Duration" 
                                        value={exp.duration}
                                        onChange={(e) => {
                                            const newExpList = [...localData.experience];
                                            newExpList[idx] = { ...exp, duration: e.target.value };
                                            setLocalData({ ...localData, experience: newExpList });
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs uppercase text-muted-foreground font-bold">Bullets</Label>
                                    <Textarea 
                                        placeholder="One point per line"
                                        value={exp.description.join('\n')}
                                        onChange={(e) => {
                                            const newExpList = [...localData.experience];
                                            newExpList[idx] = { ...exp, description: e.target.value.split('\n') };
                                            setLocalData({ ...localData, experience: newExpList });
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </TabsContent>

            {/* PROJECTS TAB */}
            <TabsContent value="projects" className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Projects</h3>
                    <Button variant="outline" size="sm" onClick={() => {
                        const newProj = { title: "New Project", category: "", tech: [], description: "", link: "#", isVisible: true };
                        setLocalData({ ...localData, projects: [newProj, ...localData.projects] });
                    }}>
                        <Plus className="w-4 h-4 mr-2" /> Add
                    </Button>
                </div>
                 <ScrollArea className="h-[60vh] pr-4">
                    <div className="space-y-6">
                        {localData.projects.map((proj, idx: number) => (
                             <div key={idx} className="p-4 border rounded-lg space-y-3 relative group transition-all hover:border-primary/30">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">Project Details</h4>
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center gap-2">
                                            <Label htmlFor={`proj-vis-${idx}`} className="text-xs cursor-pointer">Visible</Label>
                                            <Switch 
                                                id={`proj-vis-${idx}`} 
                                                checked={proj.isVisible !== false}
                                                onCheckedChange={(checked) => {
                                                    const newProjList = [...localData.projects];
                                                    newProjList[idx] = { ...proj, isVisible: checked };
                                                    setLocalData({ ...localData, projects: newProjList });
                                                }}
                                            />
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all"
                                            onClick={() => {
                                                const newProjList = [...localData.projects];
                                                newProjList.splice(idx, 1);
                                                setLocalData({ ...localData, projects: newProjList });
                                            }}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                                <Input 
                                    className={`font-bold border-none p-0 h-auto focus-visible:ring-0 text-lg ${proj.isVisible === false ? 'opacity-50' : ''}`} 
                                    value={proj.title}
                                    onChange={(e) => {
                                        const newProjList = [...localData.projects];
                                        newProjList[idx] = { ...proj, title: e.target.value };
                                        setLocalData({ ...localData, projects: newProjList });
                                    }}
                                />
                                <div className="grid grid-cols-2 gap-4">
                                     <Input 
                                        placeholder="Tech (comma separated)" 
                                        value={Array.isArray(proj.tech) ? proj.tech.join(', ') : proj.tech}
                                        onChange={(e) => {
                                            const newProjList = [...localData.projects];
                                            newProjList[idx] = { ...proj, tech: e.target.value.split(',').map(s => s.trim()) };
                                            setLocalData({ ...localData, projects: newProjList });
                                        }}
                                    />
                                    <Input 
                                        placeholder="Link" 
                                        value={proj.link}
                                        onChange={(e) => {
                                            const newProjList = [...localData.projects];
                                            newProjList[idx] = { ...proj, link: e.target.value };
                                            setLocalData({ ...localData, projects: newProjList });
                                        }}
                                    />
                                </div>
                                <Textarea 
                                    placeholder="Project description"
                                    value={proj.description}
                                    onChange={(e) => {
                                        const newProjList = [...localData.projects];
                                        newProjList[idx] = { ...proj, description: e.target.value };
                                        setLocalData({ ...localData, projects: newProjList });
                                    }}
                                />
                             </div>
                        ))}
                    </div>
                 </ScrollArea>
            </TabsContent>

            {/* SKILLS TAB */}
            <TabsContent value="skills" className="space-y-6 pt-4">
                <div className="p-4 border rounded-lg bg-zinc-50 dark:bg-zinc-900/50 space-y-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider">Add New Skill</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="new-skill-name" className="text-xs">Skill Name</Label>
                            <Input 
                                id="new-skill-name"
                                placeholder="e.g. Docker" 
                                value={newSkillName}
                                onChange={(e) => setNewSkillName(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="new-skill-cat" className="text-xs">Category</Label>
                            <Input 
                                id="new-skill-cat"
                                list="existing-categories"
                                placeholder="e.g. DevOps" 
                                value={newSkillCategory}
                                onChange={(e) => setNewSkillCategory(e.target.value)}
                            />
                            <datalist id="existing-categories">
                                {Object.keys(localData.skills || {}).map(cat => (
                                    <option key={cat} value={cat} />
                                ))}
                            </datalist>
                        </div>
                    </div>
                    <Button className="w-full" onClick={handleAddSkill} disabled={!newSkillName.trim() || !newSkillCategory.trim()}>
                        <Plus className="w-4 h-4 mr-2" /> Add Skill
                    </Button>
                </div>

                <ScrollArea className="h-[50vh] pr-4">
                    <div className="space-y-8">
                        {Object.entries(localData.skills || {}).map(([category, skills]: [string, any]) => (
                            <div key={category} className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{category}</h3>
                                    <Button 
                                        variant="ghost" 
                                        size="sm" 
                                        className="h-6 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors"
                                        onClick={() => {
                                            if (confirm(`Delete entire category "${category}"?`)) {
                                                const newSkills = { ...localData.skills };
                                                delete newSkills[category];
                                                setLocalData({ ...localData, skills: newSkills });
                                            }
                                        }}
                                    >
                                        Delete Category
                                    </Button>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {skills.map((skill: string) => {
                                        const isSelected = localData.highlightedSkills?.includes(skill);
                                        return (
                                            <div 
                                                key={skill} 
                                                className={`flex items-center justify-between p-3 border rounded-lg group transition-all ${isSelected ? 'border-primary bg-primary/5' : 'hover:bg-zinc-50 dark:hover:bg-zinc-900'}`}
                                            >
                                                <div 
                                                    className="flex-1 cursor-pointer flex items-center justify-between"
                                                    onClick={() => {
                                                        const current = localData.highlightedSkills || [];
                                                        const next = current.includes(skill) 
                                                            ? current.filter((s: string) => s !== skill)
                                                            : [...current, skill];
                                                        setLocalData({ ...localData, highlightedSkills: next });
                                                    }}
                                                >
                                                    <span className="text-sm font-medium">{skill}</span>
                                                    {isSelected ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Circle className="w-4 h-4 text-muted-foreground/30" />}
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6 ml-2 opacity-0 group-hover:opacity-100 text-red-500 transition-opacity"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemoveSkill(category, skill);
                                                    }}
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                </Button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
                <div className="p-4 bg-muted/30 rounded-lg border border-dashed">
                    <p className="text-xs text-muted-foreground text-center">Click a skill to toggle its visibility in the resume preview.</p>
                </div>
            </TabsContent>

            {/* DESIGN TAB */}
            <TabsContent value="design" className="space-y-6 pt-4">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <Label className="text-base">Template Style</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <Button 
                                variant={localTemplate === 'modern' ? 'default' : 'outline'}
                                className="h-20 flex flex-col gap-1"
                                onClick={() => setLocalTemplate('modern')}
                            >
                                <span className="font-bold">Modern</span>
                                <span className="text-[10px] opacity-70 italic">Sans-serif • Compact</span>
                            </Button>
                            <Button 
                                variant={localTemplate === 'classic' ? 'default' : 'outline'}
                                className="h-20 flex flex-col gap-1"
                                onClick={() => setLocalTemplate('classic')}
                            >
                                <span className="font-bold">Classic</span>
                                <span className="text-[10px] opacity-70 italic">Serif • Traditional</span>
                            </Button>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <Label className="text-base">Accent Color</Label>
                        <div className="flex items-center gap-4">
                            <Input 
                                type="color" 
                                value={localThemeColor} 
                                onChange={(e) => setLocalThemeColor(e.target.value)}
                                className="w-16 h-10 p-1 cursor-pointer"
                            />
                            <Input 
                                type="text" 
                                value={localThemeColor} 
                                onChange={(e) => setLocalThemeColor(e.target.value)}
                                className="font-mono uppercase"
                                placeholder="#000000"
                            />
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-3">
                        <Label className="text-base">Section Visibility & Order</Label>
                        <p className="text-xs text-muted-foreground italic">Drag handles to reorder. Toggle buttons to show/hide.</p>
                        <Reorder.Group 
                            axis="y" 
                            values={localSectionOrder} 
                            onReorder={(newOrder) => setLocalSectionOrder(Array.from(new Set(newOrder)))} 
                            className="space-y-2"
                        >
                            {localSectionOrder.map((key) => (
                                <Reorder.Item 
                                    key={key} 
                                    value={key}
                                    className="flex items-center justify-between p-3 border rounded-lg bg-card hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors cursor-default"
                                >
                                    <div className="flex items-center gap-3">
                                        <GripVertical className="w-4 h-4 text-muted-foreground cursor-grab active:cursor-grabbing" />
                                        <Label className="capitalize cursor-pointer">{key}</Label>
                                    </div>
                                    <Button 
                                        variant={localShowSections[key as keyof typeof localShowSections] ? "default" : "outline"} 
                                        size="sm"
                                        onClick={() => setLocalShowSections({ ...localShowSections, [key]: !localShowSections[key as keyof typeof localShowSections] })}
                                    >
                                        {localShowSections[key as keyof typeof localShowSections] ? "Visible" : "Hidden"}
                                    </Button>
                                </Reorder.Item>
                            ))}
                        </Reorder.Group>
                        <div className="mt-4 p-2 bg-muted rounded flex flex-wrap gap-1">
                            <span className="text-[10px] font-mono text-muted-foreground mr-1">Current Order:</span>
                            {localSectionOrder.map(k => (
                                <span key={k} className="text-[10px] bg-background border px-1 rounded">{k}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column: Sticky Preview */}
        <div className="flex-1 lg:sticky lg:top-24 h-[70vh] lg:h-[calc(100vh-120px)] rounded-xl overflow-hidden border shadow-2xl bg-zinc-950/5 p-2">
            <div className="absolute top-6 left-6 z-10 bg-background/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-mono border">
                Live Rendering
            </div>
            <PDFViewer width="100%" height="100%" showToolbar={false} className="border-none rounded-lg">
                {localTemplate === 'modern' 
                    ? <ModernTemplate key={`modern-${localSectionOrder.join('-')}`} themeColor={localThemeColor} showSections={localShowSections} customRole={customRole} resumeData={localData} sectionOrder={localSectionOrder} /> 
                    : <ClassicTemplate key={`classic-${localSectionOrder.join('-')}`} themeColor={localThemeColor} showSections={localShowSections} customRole={customRole} resumeData={localData} sectionOrder={localSectionOrder} />}
            </PDFViewer>
        </div>
      </main>
    </div>
  );
}
