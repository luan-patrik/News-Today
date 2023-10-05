"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import {
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "./ui/dropdown-menu";

const Themes = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const currentTheme = theme;

  return (
    <div className="py-1 max-w-[160px] mx-auto bg-inherit border-none rounded-md">
      <div className="p-0 h-7 text-xs">
        <DropdownMenuRadioGroup
          value={currentTheme}
          onValueChange={setTheme}
          className="flex justify-between items-center h-7 py-0 px-2 w-full text-xs"
        >
          <DropdownMenuRadioItem
            title="Tema escuro"
            aria-label="Tema escuro"
            value="dark"
            className="relative flex-grow p-1 w-full h-full items-center flex justify-center rounded"
          >
            <span className="items-center flex h-full justify-center">
              <Moon className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            title="Tema do sistema"
            aria-label="Tema do sistema"
            value="system"
            className="relative flex-grow p-1 w-full h-full items-center flex justify-center rounded mx-2"
          >
            <span className="text-blue-700 font-semibold">Auto</span>
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            title="Tema claro"
            aria-label="Tema claro"
            value="light"
            className="relative flex-grow p-1 w-full h-full items-center flex justify-center rounded"
          >
            <span>
              <Sun className="w-4 h-4 text-neutral-600 dark:text-neutral-400" />
            </span>
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </div>
    </div>
  );
};

export default Themes;
