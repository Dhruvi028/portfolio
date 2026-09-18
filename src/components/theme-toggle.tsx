"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  if (!mounted) {
    return <div className="w-[100px] h-[28px]"></div>;
  }

  return (
    <button onClick={toggleTheme} className="hover:text-primary transition-colors hover:bg-primary/10 px-2 py-1">
      [{theme === "dark" ? "LIGHT_MODE" : "DARK_MODE"}]
    </button>
  );
}
