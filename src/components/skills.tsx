"use client";

import { resume } from "@/data/resume";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Badge } from "./ui/badge";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, scale: 0.8 },
    show: { opacity: 1, scale: 1 }
};


export function Skills() {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-100px" });

    return (
        <section id="skills" className="py-20">
            <div className="container px-6">
                <h2 className="text-3xl md:text-5xl font-bold font-heading mb-12 text-center">Tech <span className="text-primary">Stack</span></h2>

                <div ref={ref} className="max-w-6xl mx-auto space-y-10">
                    {Object.entries(resume.skills).map(([category, skillList], categoryIndex) => (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 20 }}
                            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                            transition={{ delay: categoryIndex * 0.1 }}
                            className="space-y-4"
                        >
                            <h3 className="text-xl md:text-2xl font-semibold text-primary/90">
                                {category}
                            </h3>
                            <motion.div
                                variants={container}
                                initial="hidden"
                                animate={isInView ? "show" : "hidden"}
                                className="flex flex-wrap gap-3"
                            >
                                {skillList.map((skill) => (
                                    <motion.div key={skill} variants={item}>
                                        <Badge
                                            variant="outline"
                                            className="px-4 py-2 text-base border-primary/20 hover:border-primary hover:bg-primary/10 transition-colors cursor-default hover:scale-110"
                                        >
                                            {skill}
                                        </Badge>
                                    </motion.div>
                                ))}
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
