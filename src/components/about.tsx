"use client";

"use client";

import { useResumeConfig } from "@/context/resume-config";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "./ui/card";

export function About() {
    const { resumeData: resume } = useResumeConfig();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="about" className="py-20 relative">
            <div className="container px-6">
                <motion.div
                    ref={ref}
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6 }}
                    className="max-w-4xl mx-auto"
                >
                    <h2 className="text-3xl md:text-5xl font-bold font-heading mb-8 text-center">About <span className="text-primary">Me</span></h2>

                    <Card className="bg-card/50 backdrop-blur-sm border-primary/20 hover:border-primary/50 transition-colors">
                        <CardContent className="p-8">
                            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {resume.personalInfo.about}
                            </p>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </section>
    );
}
