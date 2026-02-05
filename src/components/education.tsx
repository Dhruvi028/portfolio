"use client";

"use client";

import { useResumeConfig } from "@/context/resume-config";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { GraduationCap } from "lucide-react";

export function Education() {
    const { resumeData: resume } = useResumeConfig();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="education" className="py-20 bg-muted/20">
            <div className="container px-6">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-16 text-center">My <span className="text-secondary">Education</span></h2>

                    <div className="max-w-3xl mx-auto">
                        {resume.education.map((edu, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={isInView ? { opacity: 1, x: 0 } : {}}
                                transition={{ delay: index * 0.1, duration: 0.5 }}
                            >
                                <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all">
                                    <CardHeader className="flex flex-row items-center gap-4">
                                        <div className="p-3 rounded-full bg-primary/10 text-primary">
                                            <GraduationCap className="w-8 h-8" />
                                        </div>
                                        <div className="space-y-1">
                                            <CardTitle className="text-xl font-bold">{edu.degree}</CardTitle>
                                            <CardDescription className="text-primary text-base font-semibold">{edu.institution}</CardDescription>
                                        </div>
                                    </CardHeader>
                                    <CardContent className="flex justify-between items-center text-muted-foreground ml-16">
                                        <span>{edu.duration}</span>
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
