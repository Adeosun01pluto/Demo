"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "lucide-react";


const ThemeSwitcher = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();


  useEffect(() => {
    setMounted(true);
  }, []);


  if (!mounted) {
    return null;
  }


  return (
    <div className="z-[999]">

      <button
        className={`text-white z-[999]`}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
        {theme === "light" ? <MoonIcon /> : <SunIcon color="yellow" />}
      </button>
    </div>
  );
};

export default ThemeSwitcher