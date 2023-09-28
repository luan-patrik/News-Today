"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const NoUserThemes = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme;

  return (
    <button
      title={currentTheme === "dark" ? "Tema claro" : "Tema escuro"}
      aria-label={currentTheme === "dark" ? "Tema claro" : "Tema escuro"}
      onClick={() =>
        currentTheme === "dark" ? setTheme("light") : setTheme("dark")
      }
    >
      {currentTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
};

export default NoUserThemes;
