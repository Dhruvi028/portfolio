"use client";

import { resume } from "@/data/resume";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { Carousel } from "./carousel";

// Group projects into slides of 3
const groupProjects = (projects: any[], size: number) => {
    const groups = [];
    for (let i = 0; i < projects.length; i += size) {
        groups.push(projects.slice(i, i + size));
    }
    return groups;
};

// Category color mapping
const categoryColors: Record<string, string> = {
    "Automation & Analytics": "bg-purple-500/20 text-purple-300 border-purple-500/30",
    "Marine Tech": "bg-blue-500/20 text-blue-300 border-blue-500/30",
    "Automotive": "bg-red-500/20 text-red-300 border-red-500/30",
    "IoT & Monitoring": "bg-green-500/20 text-green-300 border-green-500/30",
    "Lifestyle & Wellness": "bg-pink-500/20 text-pink-300 border-pink-500/30",
    "Healthcare & Veterinary": "bg-teal-500/20 text-teal-300 border-teal-500/30",
    "Finance & Trading": "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
    "Manufacturing & CAD": "bg-orange-500/20 text-orange-300 border-orange-500/30",
    "Entertainment & Media": "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
};

export function Projects() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    // Use projects as is without reversing and group into slides of 3
    const projectSlides = groupProjects(resume.projects, 3);

    return (
        <section id="projects" className="py-20 bg-muted/20">
            <div className="container px-6">
                <h2 className="text-3xl md:text-5xl font-bold font-heading mb-16 text-center">Featured <span className="text-secondary">Projects</span></h2>

                <div ref={ref}>
                    <Carousel className="max-w-7xl mx-auto">
                        {projectSlides.map((slide, slideIndex) => (
                            <div key={slideIndex} className="flex-[0_0_100%] min-w-0 pl-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 h-full">
                                    {slide.map((project: any, projectIndex: number) => {
                                        const actualIndex = slideIndex * 3 + projectIndex;
                                        return (
                                            <motion.div
                                                key={actualIndex}
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={isInView ? { opacity: 1, y: 0 } : {}}
                                                transition={{ delay: projectIndex * 0.1, duration: 0.5 }}
                                                className="h-full"
                                            >
                                                <Card className="h-full flex flex-col bg-card/50 backdrop-blur-sm hover:shadow-2xl hover:shadow-primary/10 transition-all border-primary/20">
                                                    <CardHeader>
                                                        <div className="flex items-start justify-between gap-2 mb-2">
                                                            <CardTitle className="text-xl font-bold flex-1">{project.title}</CardTitle>
                                                            {project.category && (
                                                                <Badge 
                                                                    variant="outline" 
                                                                    className={`text-xs whitespace-nowrap ${categoryColors[project.category] || 'bg-primary/20 text-primary border-primary/30'}`}
                                                                >
                                                                    {project.category}
                                                                </Badge>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap gap-2">
                                                            {project.tech.slice(0, 3).map((t: string) => (
                                                                <Badge key={t} variant="secondary" className="text-xs bg-secondary/20 text-secondary-foreground hover:bg-secondary/30">{t}</Badge>
                                                            ))}
                                                            {project.tech.length > 3 && <Badge variant="outline" className="text-xs">+{project.tech.length - 3}</Badge>}
                                                        </div>
                                                    </CardHeader>
                                                    <CardContent className="flex-1">
                                                        <p className="text-muted-foreground text-sm line-clamp-4">
                                                            {project.description}
                                                        </p>
                                                    </CardContent>
                                                    <CardFooter>
                                                        {project.link && project.link !== "#" ? (
                                                            <Button asChild variant="outline" className="w-full border-primary/30 hover:bg-primary/10 group">
                                                                <Link href={project.link} target="_blank">
                                                                    Visit Project <ExternalLink className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                                </Link>
                                                            </Button>
                                                        ) : (
                                                            <Button disabled variant="outline" className="w-full opacity-50 cursor-not-allowed">Confidential / Internal</Button>
                                                        )}
                                                    </CardFooter>
                                                </Card>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </div>
        </section>
    );
}
