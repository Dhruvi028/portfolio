"use client";

import { useEffect, useState } from "react";
import { motion, useSpring } from "framer-motion";

export function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isPointer, setIsPointer] = useState(false);

    const mouseX = useSpring(0, { stiffness: 500, damping: 28 });
    const mouseY = useSpring(0, { stiffness: 500, damping: 28 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
            mouseX.set(e.clientX - 16);
            mouseY.set(e.clientY - 16);

            const target = e.target as HTMLElement;
            setIsPointer(window.getComputedStyle(target).cursor === "pointer");
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-primary pointer-events-none z-[9999] hidden md:block"
                style={{
                    x: mouseX,
                    y: mouseY,
                    scale: isPointer ? 1.5 : 1,
                    backgroundColor: isPointer ? "rgba(var(--primary), 0.1)" : "transparent",
                }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
            />
            <motion.div
                className="fixed top-0 left-0 w-1.5 h-1.5 bg-primary rounded-full pointer-events-none z-[9999] hidden md:block"
                style={{
                    x: position.x - 3,
                    y: position.y - 3,
                }}
            />
        </>
    );
}
