"use client";

import { useResumeConfig, ResumeData } from "@/context/resume-config";
import { UserProfile } from "@/services/profile-service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle2,
  Circle,
  GripVertical,
  ExternalLink,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Reorder } from "framer-motion";
import { ModernTemplate } from "@/components/resume-templates/ModernTemplate";
import { InternationalTemplate } from "@/components/resume-templates/InternationalTemplate";
import dynamic from "next/dynamic";
import { StandardPortfolio } from "@/components/portfolio-templates/StandardPortfolio";
import { MiloPortfolio } from "@/components/portfolio-templates/MiloPortfolio";
import { ResumeConfigContext } from "@/context/resume-config";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full flex items-center justify-center bg-zinc-100 dark:bg-zinc-900 border rounded-lg">
        Loading Preview...
      </div>
    ),
  },
);

export default function ResumeBuilderPage() {
  const config = useResumeConfig();
  const {
    isAdmin,
    resumeData,
    setResumeData,
    themeColor,
    setThemeColor,
    selectedTemplate,
    setSelectedTemplate,
    showSections,
    setShowSections,
    portfolioTemplate,
    setPortfolioTemplate,
    sectionOrder,
    setSectionOrder,
    fontSize,
    setFontSize,
    avatarType,
    setAvatarType,
    profiles,
    activeProfileId,
    setActiveProfileId,
    createProfile,
    deleteProfile,
    setPrimaryProfile,
    isLoading,
    saveCurrentProfile,
  } = config;
  const router = useRouter();

  // Local state for the editor to avoid lagging the preview on every keystroke
  const [localData, setLocalData] = useState<ResumeData>(resumeData);
  const [localTemplate, setLocalTemplate] = useState(selectedTemplate);
  const [localThemeColor, setLocalThemeColor] = useState(themeColor);
  const [localShowSections, setLocalShowSections] = useState(showSections);
  const [localPortfolioTemplate, setLocalPortfolioTemplate] =
    useState(portfolioTemplate);
  const [localAvatarType, setLocalAvatarType] = useState(avatarType);
  const [localSectionOrder, setLocalSectionOrder] = useState(sectionOrder);
  const [localFontSize, setLocalFontSize] = useState(fontSize);
  const [activeTab, setActiveTab] = useState("basics");
  const [newSkillName, setNewSkillName] = useState("");
  const [newSkillCategory, setNewSkillCategory] = useState("");

  // Sync initial data
  useEffect(() => {
    if (resumeData) setLocalData(resumeData);
    if (selectedTemplate) setLocalTemplate(selectedTemplate);
    if (themeColor) setLocalThemeColor(themeColor);
    if (showSections) setLocalShowSections(showSections);
    if (portfolioTemplate) setLocalPortfolioTemplate(portfolioTemplate);
    if (avatarType) setLocalAvatarType(avatarType);
    if (fontSize) setLocalFontSize(fontSize);
  }, [
    resumeData,
    selectedTemplate,
    themeColor,
    showSections,
    fontSize,
    portfolioTemplate,
    avatarType,
  ]);

  // Update browser tab title based on active profile
  useEffect(() => {
    if (resumeData?.personalInfo?.name) {
      document.title = `${resumeData.personalInfo.name} | ${resumeData.personalInfo.role || "Resume Builder"}`;
    } else {
      document.title = "Resume Builder";
    }
  }, [resumeData]);

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

  const handleSave = async () => {
    // 1. Update local context state
    setResumeData(localData);
    setSelectedTemplate(localTemplate);
    setThemeColor(localThemeColor);
    setShowSections(localShowSections);
    setPortfolioTemplate(localPortfolioTemplate);
    setAvatarType(localAvatarType);
    const uniqueOrder = Array.from(new Set(localSectionOrder));
    setSectionOrder(uniqueOrder);
    setFontSize(localFontSize);

    // 2. Persist to Firebase
    try {
      const uniqueOrder = Array.from(new Set(localSectionOrder));
      await saveCurrentProfile(localData, {
        template: localTemplate,
        themeColor: localThemeColor,
        fontSize: localFontSize,
        sectionOrder: localSectionOrder,
        showSections: localShowSections,
        portfolioTemplate: localPortfolioTemplate,
        avatarType: localAvatarType,
      });
      alert("Resume saved to cloud successfully!");
    } catch (error) {
      console.error("Save failed:", error);
      alert("Failed to save to cloud. Please check your connection.");
    }
  };

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset all changes to default? This will clear your custom edits.",
      )
    ) {
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
        [field]: value,
      },
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
      highlightedSkills: [...(localData.highlightedSkills || []), skill],
    });

    setNewSkillName("");
    setNewSkillCategory("");
  };

  const handleRemoveSkill = (category: string, skill: string) => {
    const skills = { ...localData.skills };
    skills[category] = (skills[category] || []).filter(
      (s: string) => s !== skill,
    );

    // Remove category if empty? Maybe optional, but let's keep it for now.
    if (skills[category].length === 0) {
      delete skills[category];
    }

    setLocalData({
      ...localData,
      skills,
      highlightedSkills: (localData.highlightedSkills || []).filter(
        (s: string) => s !== skill,
      ),
    });
  };

  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => router.push("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-xl font-bold tracking-tight">
              Resume Builder{" "}
              <span className="text-xs font-normal text-muted-foreground ml-2">
                Admin Edition
              </span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            {isLoading && (
              <span className="text-xs text-muted-foreground animate-pulse">
                Syncing...
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <RotateCcw className="w-4 h-4 mr-2" /> Reset
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" /> Save Changes
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 md:p-8 flex flex-col lg:flex-row gap-8">
        {/* Left Column: Editor */}
        <div className="flex-1 w-full lg:max-w-xl space-y-6">
          <Tabs
            defaultValue="basics"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid grid-cols-7 w-full h-12">
              <TabsTrigger value="profiles" className="text-[10px] sm:text-xs">
                Profiles
              </TabsTrigger>
              <TabsTrigger value="basics" className="text-[10px] sm:text-xs">
                Basics
              </TabsTrigger>
              <TabsTrigger
                value="experience"
                className="text-[10px] sm:text-xs"
              >
                Exp
              </TabsTrigger>
              <TabsTrigger value="projects" className="text-[10px] sm:text-xs">
                Proj
              </TabsTrigger>
              <TabsTrigger value="skills" className="text-[10px] sm:text-xs">
                Skills
              </TabsTrigger>
              <TabsTrigger value="design" className="text-[10px] sm:text-xs">
                Design
              </TabsTrigger>
              <TabsTrigger value="portfolio" className="text-[10px] sm:text-xs">
                Portfolio
              </TabsTrigger>
            </TabsList>

            {/* PROFILES TAB */}
            <TabsContent value="profiles" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Your Profiles</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const title = prompt(
                        "Enter profile title (e.g. Full Stack Dev):",
                      );
                      if (title) {
                        const slug = title
                          .toLowerCase()
                          .replace(/ /g, "-")
                          .replace(/[^\w-]/g, "");
                        createProfile(title, slug);
                      }
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" /> New
                  </Button>
                </div>

                <div className="space-y-2">
                  {profiles.map((p) => (
                    <div
                      key={p.id}
                      className={`flex items-center justify-between p-3 border rounded-lg transition-all ${activeProfileId === p.id ? "border-primary ring-1 ring-primary/20 bg-primary/5" : "hover:bg-muted/50"}`}
                    >
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => setActiveProfileId(p.id)}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{p.title}</span>
                          {p.isPrimary && (
                            <span className="text-[10px] bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full uppercase">
                              Primary
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground font-mono">
                          /{p.slug}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                          title="Duplicate Profile"
                          onClick={() => {
                            const title = prompt(
                              `Enter title for copy of "${p.title}":`,
                              `${p.title} Copy`,
                            );
                            if (title) {
                              const slug = title
                                .toLowerCase()
                                .replace(/ /g, "-")
                                .replace(/[^\w-]/g, "");
                              createProfile(title, slug, p.resumeData);
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                          title="Open Portfolio"
                          onClick={() => window.open(`/${p.slug}`, "_blank")}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
                          title="Set as Primary"
                          onClick={() => setPrimaryProfile(p.id)}
                          disabled={p.isPrimary}
                        >
                          <CheckCircle2
                            className={`w-4 h-4 ${p.isPrimary ? "text-primary" : ""}`}
                          />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-muted-foreground hover:text-red-500 transition-colors"
                          title="Delete Profile"
                          onClick={() => {
                            if (
                              confirm(
                                `Are you sure you want to delete "${p.title}"?`,
                              )
                            ) {
                              deleteProfile(p.id);
                            }
                          }}
                          disabled={p.isPrimary && profiles.length > 1}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {profiles.length === 0 && (
                    <div className="text-center py-8 border border-dashed rounded-lg bg-muted/20">
                      <p className="text-sm text-muted-foreground italic">
                        No profiles found. Create your first one!
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* BASICS TAB */}
            <TabsContent value="basics" className="space-y-6 pt-4">
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={localData.personalInfo.name}
                    onChange={(e) => updatePersonalInfo("name", e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="role">Role</Label>
                  <Input
                    id="role"
                    value={localData.personalInfo.role}
                    onChange={(e) => updatePersonalInfo("role", e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={localData.personalInfo.contact.email}
                      onChange={(e) =>
                        setLocalData({
                          ...localData,
                          personalInfo: {
                            ...localData.personalInfo,
                            contact: {
                              ...localData.personalInfo.contact,
                              email: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={localData.personalInfo.contact.phone}
                      onChange={(e) =>
                        setLocalData({
                          ...localData,
                          personalInfo: {
                            ...localData.personalInfo,
                            contact: {
                              ...localData.personalInfo.contact,
                              phone: e.target.value,
                            },
                          },
                        })
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={localData.personalInfo.contact.location}
                    onChange={(e) =>
                      setLocalData({
                        ...localData,
                        personalInfo: {
                          ...localData.personalInfo,
                          contact: {
                            ...localData.personalInfo.contact,
                            location: e.target.value,
                          },
                        },
                      })
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="about">About/Summary</Label>
                  <Textarea
                    id="about"
                    rows={5}
                    value={localData.personalInfo.about}
                    onChange={(e) =>
                      updatePersonalInfo("about", e.target.value)
                    }
                  />
                </div>
              </div>
            </TabsContent>

            {/* EXPERIENCE TAB */}
            <TabsContent value="experience" className="space-y-6 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Work History</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newExp = {
                      company: "New Company",
                      role: "Role",
                      duration: "Jan 2024 - Present",
                      description: [],
                      isVisible: true,
                    };
                    setLocalData({
                      ...localData,
                      experience: [newExp, ...localData.experience],
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              </div>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6">
                  {localData.experience.map((exp, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 border rounded-lg space-y-3 relative group transition-all hover:border-primary/30"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                          Company Details
                        </h4>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor={`exp-vis-${idx}`}
                              className="text-xs cursor-pointer"
                            >
                              Visible
                            </Label>
                            <Switch
                              id={`exp-vis-${idx}`}
                              checked={exp.isVisible !== false}
                              onCheckedChange={(checked) => {
                                const newExpList = [...localData.experience];
                                newExpList[idx] = {
                                  ...exp,
                                  isVisible: checked,
                                };
                                setLocalData({
                                  ...localData,
                                  experience: newExpList,
                                });
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
                              setLocalData({
                                ...localData,
                                experience: newExp,
                              });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Input
                        className={`font-bold border-none p-0 h-auto focus-visible:ring-0 text-lg ${exp.isVisible === false ? "opacity-50" : ""}`}
                        value={exp.company}
                        onChange={(e) => {
                          const newExpList = [...localData.experience];
                          newExpList[idx] = { ...exp, company: e.target.value };
                          setLocalData({
                            ...localData,
                            experience: newExpList,
                          });
                        }}
                      />
                      <div className="grid grid-cols-2 gap-4">
                        <Input
                          placeholder="Role"
                          value={exp.role}
                          onChange={(e) => {
                            const newExpList = [...localData.experience];
                            newExpList[idx] = { ...exp, role: e.target.value };
                            setLocalData({
                              ...localData,
                              experience: newExpList,
                            });
                          }}
                        />
                        <Input
                          placeholder="Duration"
                          value={exp.duration}
                          onChange={(e) => {
                            const newExpList = [...localData.experience];
                            newExpList[idx] = {
                              ...exp,
                              duration: e.target.value,
                            };
                            setLocalData({
                              ...localData,
                              experience: newExpList,
                            });
                          }}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs uppercase text-muted-foreground font-bold">
                          Bullets
                        </Label>
                        <Textarea
                          placeholder="One point per line"
                          value={exp.description.join("\n")}
                          onChange={(e) => {
                            const newExpList = [...localData.experience];
                            newExpList[idx] = {
                              ...exp,
                              description: e.target.value.split("\n"),
                            };
                            setLocalData({
                              ...localData,
                              experience: newExpList,
                            });
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
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newProj = {
                      title: "New Project",
                      category: "",
                      tech: [],
                      description: "",
                      link: "#",
                      isVisible: true,
                    };
                    setLocalData({
                      ...localData,
                      projects: [newProj, ...localData.projects],
                    });
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add
                </Button>
              </div>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6">
                  {localData.projects.map((proj, idx: number) => (
                    <div
                      key={idx}
                      className="p-4 border rounded-lg space-y-3 relative group transition-all hover:border-primary/30"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-bold uppercase text-muted-foreground tracking-wider">
                          Project Details
                        </h4>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <Label
                              htmlFor={`proj-vis-${idx}`}
                              className="text-xs cursor-pointer"
                            >
                              Visible
                            </Label>
                            <Switch
                              id={`proj-vis-${idx}`}
                              checked={proj.isVisible !== false}
                              onCheckedChange={(checked) => {
                                const newProjList = [...localData.projects];
                                newProjList[idx] = {
                                  ...proj,
                                  isVisible: checked,
                                };
                                setLocalData({
                                  ...localData,
                                  projects: newProjList,
                                });
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
                              setLocalData({
                                ...localData,
                                projects: newProjList,
                              });
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <Input
                        className={`font-bold border-none p-0 h-auto focus-visible:ring-0 text-lg ${proj.isVisible === false ? "opacity-50" : ""}`}
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
                          value={
                            Array.isArray(proj.tech)
                              ? proj.tech.join(", ")
                              : proj.tech
                          }
                          onChange={(e) => {
                            const newProjList = [...localData.projects];
                            newProjList[idx] = {
                              ...proj,
                              tech: e.target.value
                                .split(",")
                                .map((s) => s.trim()),
                            };
                            setLocalData({
                              ...localData,
                              projects: newProjList,
                            });
                          }}
                        />
                        <Input
                          placeholder="Link"
                          value={proj.link}
                          onChange={(e) => {
                            const newProjList = [...localData.projects];
                            newProjList[idx] = {
                              ...proj,
                              link: e.target.value,
                            };
                            setLocalData({
                              ...localData,
                              projects: newProjList,
                            });
                          }}
                        />
                      </div>
                      <Textarea
                        placeholder="Project description"
                        value={proj.description}
                        onChange={(e) => {
                          const newProjList = [...localData.projects];
                          newProjList[idx] = {
                            ...proj,
                            description: e.target.value,
                          };
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
                <h3 className="text-sm font-bold uppercase tracking-wider">
                  Add New Skill
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="new-skill-name" className="text-xs">
                      Skill Name
                    </Label>
                    <Input
                      id="new-skill-name"
                      placeholder="e.g. Docker"
                      value={newSkillName}
                      onChange={(e) => setNewSkillName(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-skill-cat" className="text-xs">
                      Category
                    </Label>
                    <Input
                      id="new-skill-cat"
                      list="existing-categories"
                      placeholder="e.g. DevOps"
                      value={newSkillCategory}
                      onChange={(e) => setNewSkillCategory(e.target.value)}
                    />
                    <datalist id="existing-categories">
                      {Object.keys(localData.skills || {}).map((cat) => (
                        <option key={cat} value={cat} />
                      ))}
                    </datalist>
                  </div>
                </div>
                <Button
                  className="w-full"
                  onClick={handleAddSkill}
                  disabled={!newSkillName.trim() || !newSkillCategory.trim()}
                >
                  <Plus className="w-4 h-4 mr-2" /> Add Skill
                </Button>
              </div>

              <ScrollArea className="h-[50vh] pr-4">
                <div className="space-y-8">
                  {Object.entries(localData.skills || {}).map(
                    ([category, skills]: [string, any]) => (
                      <div key={category} className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                            {category}
                          </h3>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 text-[10px] text-red-500 hover:text-red-600 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-colors"
                            onClick={() => {
                              if (
                                confirm(`Delete entire category "${category}"?`)
                              ) {
                                const newSkills = { ...localData.skills };
                                delete newSkills[category];
                                setLocalData({
                                  ...localData,
                                  skills: newSkills,
                                });
                              }
                            }}
                          >
                            Delete Category
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {skills.map((skill: string) => {
                            const isSelected =
                              localData.highlightedSkills?.includes(skill);
                            return (
                              <div
                                key={skill}
                                className={`flex items-center justify-between p-3 border rounded-lg group transition-all ${isSelected ? "border-primary bg-primary/5" : "hover:bg-zinc-50 dark:hover:bg-zinc-900"}`}
                              >
                                <div
                                  className="flex-1 cursor-pointer flex items-center justify-between"
                                  onClick={() => {
                                    const current =
                                      localData.highlightedSkills || [];
                                    const next = current.includes(skill)
                                      ? current.filter(
                                          (s: string) => s !== skill,
                                        )
                                      : [...current, skill];
                                    setLocalData({
                                      ...localData,
                                      highlightedSkills: next,
                                    });
                                  }}
                                >
                                  <span className="text-sm font-medium">
                                    {skill}
                                  </span>
                                  {isSelected ? (
                                    <CheckCircle2 className="w-4 h-4 text-primary" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-muted-foreground/30" />
                                  )}
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
                    ),
                  )}
                </div>
              </ScrollArea>
              <div className="p-4 bg-muted/30 rounded-lg border border-dashed">
                <p className="text-xs text-muted-foreground text-center">
                  Click a skill to toggle its visibility in the resume preview.
                </p>
              </div>
            </TabsContent>

            {/* PORTFOLIO TAB */}
            <TabsContent value="portfolio" className="space-y-6 pt-4">
              <div className="space-y-8">
                {/* Template Selection */}
                <div className="space-y-4">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                    Choose Portfolio Style
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      {
                        id: "standard",
                        name: "Standard",
                        desc: "Classic Professional",
                      },
                      {
                        id: "creative",
                        name: "Creative V2",
                        desc: "Sticker Bomb Interactive",
                      },
                    ].map((tp) => (
                      <Button
                        key={tp.id}
                        variant={
                          localPortfolioTemplate === tp.id
                            ? "default"
                            : "outline"
                        }
                        className={`h-32 flex flex-col gap-2 relative overflow-hidden transition-all duration-300 ${localPortfolioTemplate === tp.id ? "ring-2 ring-primary ring-offset-2" : ""}`}
                        onClick={() => setLocalPortfolioTemplate(tp.id)}
                      >
                        {localPortfolioTemplate === tp.id && (
                          <div className="absolute top-2 right-2">
                            <CheckCircle2 className="w-4 h-4 text-white" />
                          </div>
                        )}
                        <span className="font-black text-xl">{tp.name}</span>
                        <span className="text-[10px] opacity-70 italic">
                          {tp.desc}
                        </span>
                        <div
                          className={`absolute bottom-0 left-0 right-0 h-1 ${localPortfolioTemplate === tp.id ? "bg-white" : "bg-transparent"}`}
                        />
                      </Button>
                    ))}
                  </div>
                </div>

                <Separator />

                {/* Avatar Selection */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
                      Select Custom Avatar
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      A curated collection of tech-themed identities for your
                      brand.
                    </p>
                  </div>

                  <div className="space-y-8">
                    {/* Custom Tech Avatars */}
                    <div className="space-y-3">
                      <Label className="text-xs uppercase font-mono text-primary flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Tech & Minimalist Collection
                      </Label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          {
                            id: "tech1",
                            img: "/avatars/avatar1.png",
                            label: "3D Character",
                          },
                          {
                            id: "tech2",
                            img: "/avatars/avatar2.jpg",
                            label: "Tech Bot 1",
                          },
                          {
                            id: "tech3",
                            img: "/avatars/avatar3.jpg",
                            label: "Tech Bot 2",
                          },
                          {
                            id: "tech4",
                            img: "/avatars/avatar4.jpg",
                            label: "Sketch 1",
                          },
                          {
                            id: "tech5",
                            img: "/avatars/avatar5.jpg",
                            label: "Sketch 2",
                          },
                          {
                            id: "tech6",
                            img: "/avatars/avatar6.jpg",
                            label: "Sketch 3",
                          },
                        ].map((av) => (
                          <button
                            key={av.id}
                            onClick={() => setLocalAvatarType(av.id)}
                            className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all p-1 ${localAvatarType === av.id ? "border-primary bg-primary/10 shadow-lg scale-105" : "border-border hover:bg-muted"}`}
                          >
                            <img
                              src={av.img}
                              alt={av.label}
                              className="w-full h-full object-cover rounded-xl"
                            />
                            {localAvatarType === av.id && (
                              <div className="absolute top-1 right-1 bg-primary text-white p-0.5 rounded-full">
                                <CheckCircle2 className="w-3 h-3" />
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10 text-center">
                  <p className="text-xs text-muted-foreground">
                    Select an avatar and template, then click{" "}
                    <b>Save Changes</b> to apply.
                  </p>
                </div>
              </div>
            </TabsContent>

            {/* DESIGN TAB (Mainly Resume/Themes) */}
            <TabsContent value="design" className="space-y-6 pt-4">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-bold text-primary">
                    Resume PDF Template
                  </Label>
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={
                        localTemplate === "modern" ? "default" : "outline"
                      }
                      className={`h-20 flex flex-col gap-1 relative overflow-hidden transition-all ${localTemplate === "modern" ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      onClick={() => setLocalTemplate("modern")}
                    >
                      <span className="font-bold">Modern</span>
                      <span className="text-[10px] opacity-70 italic">
                        Sans-serif • Compact
                      </span>
                    </Button>
                    <Button
                      variant={
                        localTemplate === "international"
                          ? "default"
                          : "outline"
                      }
                      className={`h-20 flex flex-col gap-1 relative overflow-hidden transition-all ${localTemplate === "international" ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      onClick={() => setLocalTemplate("international")}
                    >
                      <span className="font-bold">International</span>
                      <span className="text-[10px] opacity-70 italic">
                        ATS-Friendly • Minimal
                      </span>
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
                  <Label className="text-base flex items-center justify-between">
                    Font Size
                    <span className="text-sm font-mono bg-muted px-2 py-0.5 rounded">
                      {localFontSize}px
                    </span>
                  </Label>
                  <input
                    type="range"
                    min="8"
                    max="16"
                    step="0.5"
                    value={localFontSize}
                    onChange={(e) =>
                      setLocalFontSize(parseFloat(e.target.value))
                    }
                    className="w-full h-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-primary"
                  />
                  <div className="flex justify-between text-[10px] text-muted-foreground font-mono">
                    <span>8px</span>
                    <span>12px</span>
                    <span>16px</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Label className="text-base">
                    Section Visibility & Order
                  </Label>
                  <p className="text-xs text-muted-foreground italic">
                    Drag handles to reorder. Toggle buttons to show/hide.
                  </p>
                  <Reorder.Group
                    axis="y"
                    values={localSectionOrder}
                    onReorder={(newOrder) =>
                      setLocalSectionOrder(Array.from(new Set(newOrder)))
                    }
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
                          <Label className="capitalize cursor-pointer">
                            {key}
                          </Label>
                        </div>
                        <Button
                          variant={
                            localShowSections[
                              key as keyof typeof localShowSections
                            ]
                              ? "default"
                              : "outline"
                          }
                          size="sm"
                          onClick={() =>
                            setLocalShowSections({
                              ...localShowSections,
                              [key]:
                                !localShowSections[
                                  key as keyof typeof localShowSections
                                ],
                            })
                          }
                        >
                          {localShowSections[
                            key as keyof typeof localShowSections
                          ]
                            ? "Visible"
                            : "Hidden"}
                        </Button>
                      </Reorder.Item>
                    ))}
                  </Reorder.Group>
                  <div className="mt-4 p-2 bg-muted rounded flex flex-wrap gap-1">
                    <span className="text-[10px] font-mono text-muted-foreground mr-1">
                      Current Order:
                    </span>
                    {localSectionOrder.map((k) => (
                      <span
                        key={k}
                        className="text-[10px] bg-background border px-1 rounded"
                      >
                        {k}
                      </span>
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
            {activeTab === "portfolio"
              ? "Live Website Preview"
              : "Resume PDF Preview"}
          </div>

          <div className="w-full h-full overflow-hidden rounded-lg">
            {activeTab === "portfolio" ? (
              <div className="w-full h-full overflow-y-auto custom-scrollbar bg-background">
                <ResumeConfigContext.Provider
                  value={{
                    ...config,
                    resumeData: localData,
                    themeColor: localThemeColor,
                    sectionOrder: localSectionOrder,
                    fontSize: localFontSize,
                    avatarType: localAvatarType,
                    portfolioTemplate: localPortfolioTemplate,
                    showSections: localShowSections,
                  }}
                >
                  {localPortfolioTemplate === "standard" ? (
                    <StandardPortfolio />
                  ) : (
                    <MiloPortfolio />
                  )}
                </ResumeConfigContext.Provider>
              </div>
            ) : (
              <PDFViewer
                width="100%"
                height="100%"
                showToolbar={false}
                className="border-none"
              >
                {localTemplate === "modern" ? (
                  <ModernTemplate
                    key={`modern-${localSectionOrder.join("-")}-${localFontSize}`}
                    themeColor={localThemeColor}
                    showSections={localShowSections}
                    resumeData={localData}
                    sectionOrder={localSectionOrder}
                    fontSize={localFontSize}
                  />
                ) : (
                  <InternationalTemplate
                    key={`international-${localSectionOrder.join("-")}-${localFontSize}`}
                    themeColor={localThemeColor}
                    showSections={localShowSections}
                    resumeData={localData}
                    sectionOrder={localSectionOrder}
                    fontSize={localFontSize}
                  />
                )}
              </PDFViewer>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
