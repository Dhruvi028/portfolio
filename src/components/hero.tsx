"use client";

import { resume } from "@/data/resume";
import { motion } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import ResumeButton from "./dynamic-resume-button";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
            {/* Background Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000" />
            </div>

            <div className="container relative z-10 px-6 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 space-y-6">
                    {/* <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4"
                    >
                        Available for Freelance/Contract Work
                    </motion.div> */}
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-5xl md:text-7xl font-bold font-heading tracking-tight"
                    >
                        Hi, I'm <br />
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            {resume.personalInfo.name}
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto md:mx-0"
                    >
                        {resume.personalInfo.role} based in {resume.personalInfo.contact.location}.
                        Crafting premium web experiences with modern technologies.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="flex flex-col sm:flex-row items-center gap-4 mt-8 justify-center md:justify-start"
                    >
                        <Button size="lg" className="w-full sm:w-auto text-lg h-12 px-8 bg-primary hover:bg-primary/90 text-primary-foreground font-bold" asChild>
                            <Link href="#projects">
                                View Work <ArrowRight className="ml-2 w-5 h-5" />
                            </Link>
                        </Button>
                        <ResumeButton 
                            variant="outline" 
                            size="lg" 
                            className="w-full sm:w-auto text-lg h-12 px-8 border-primary/50 text-foreground hover:bg-primary/10"
                        >
                            Download CV <Download className="ml-2 w-5 h-5" />
                        </ResumeButton>
                    </motion.div>
                </div>

                {/* Hero Visual */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.7, delay: 0.2 }}
                    className="flex-1 relative w-full max-w-[500px] aspect-square flex items-center justify-center hidden md:flex"
                >
                    <div className="relative w-[80%] h-[80%] flex items-center justify-center">
                        {/* Glowing background */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary to-secondary rounded-full opacity-20 blur-3xl animate-pulse" />
                        
                        {/* Rotating borders */}
                        <div className="absolute -inset-4 border border-primary/30 rounded-full animate-[spin_8s_linear_infinite]" />
                        <div className="absolute -inset-8 border border-dashed border-secondary/30 rounded-full animate-[spin_12s_linear_infinite_reverse]" />
                        
                        {/* Avatar Image */}
                        <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background/50 backdrop-blur-sm shadow-2xl">
                             <img 
                                src="/hero-avatar.png" 
                                alt="Tech Girl Avatar" 
                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
