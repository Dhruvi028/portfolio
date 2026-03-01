"use client";

import { useResumeConfig } from "@/context/resume-config";
import { motion } from "framer-motion";
import { ArrowRight, Download, Settings } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import ResumeButton from "./dynamic-resume-button";

export function Hero() {
  const { resumeData: resume, avatarType } = useResumeConfig();

  const avatarMap: Record<string, string> = {
    tech1: "/avatars/avatar1.png",
    tech2: "/avatars/avatar2.jpg",
    tech3: "/avatars/avatar3.jpg",
    tech4: "/avatars/avatar4.jpg",
    tech5: "/avatars/avatar5.jpg",
    tech6: "/avatars/avatar6.jpg",
  };

  const avatarUrl = avatarMap[avatarType] || avatarMap["tech1"];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-secondary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse delay-1000" />
      </div>

      <div className="container relative z-10 px-6 text-center md:text-left flex flex-col md:flex-row items-center gap-12">
        <div className="flex-1 space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold font-heading tracking-tight"
          >
            Hi, I&apos;m <br />
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
            {resume.personalInfo.role} based in{" "}
            {resume.personalInfo.contact.location}. Crafting premium web
            experiences with modern technologies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center md:justify-start gap-4"
          >
            <Button
              size="lg"
              className="rounded-full shadow-lg hover:shadow-primary/25 transition-all w-full sm:w-auto"
              asChild
            >
              <a href="#projects">View My Work</a>
            </Button>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                variant="outline"
                size="icon"
                className="h-10 w-10 relative group bg-background/50 backdrop-blur-sm border-primary/20"
                asChild
              >
                <Link href="/resume-builder">
                  <Settings className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  <span className="sr-only">Resume Builder</span>
                </Link>
              </Button>
            </div>
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
            <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-background/50 backdrop-blur-sm shadow-2xl bg-muted/20">
              <img
                src={avatarUrl}
                alt={`${resume.personalInfo.name}'s Avatar`}
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500 p-4"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
