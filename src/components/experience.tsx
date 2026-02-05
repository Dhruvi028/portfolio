"use client";

import { useResumeConfig } from "@/context/resume-config";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Badge } from "./ui/badge";

interface ExperienceItem {
    company: string;
    role: string;
    duration: string;
    description: string[];
    isVisible?: boolean;
}

export function Experience() {
    const { resumeData: resume } = useResumeConfig();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="experience" className="py-20 bg-muted/20">
            <div className="container px-6">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-16 text-center">Work <span className="text-secondary">Experience</span></h2>

                    <div className="relative border-l-2 border-primary/30 ml-4 md:ml-12 space-y-12">
                        {(resume.experience as ExperienceItem[]).filter(exp => exp.isVisible !== false).map((exp, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                                className="relative pl-8 md:pl-12"
                            >
                                {/* Dot */}
                                <div className="absolute top-0 left-[-9px] w-4 h-4 rounded-full bg-background border-4 border-primary shadow-[0_0_10px_theme('colors.primary.DEFAULT')]" />

                                <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all">
                                    <CardHeader>
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                            <div className="space-y-1">
                                                <CardTitle className="text-xl font-bold">{exp.role}</CardTitle>
                                                <CardDescription className="text-primary text-base font-semibold">{exp.company}</CardDescription>
                                            </div>
                                            <Badge variant="secondary" className="w-fit">{exp.duration}</Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                            {exp.description.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
