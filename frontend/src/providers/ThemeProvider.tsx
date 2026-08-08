"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeName = "hunting" | "minimal" | "dark" | "light";
type LayoutMode = "sidebar" | "topbar" | "drawer";

interface ThemeContextType {
  theme: ThemeName;
  layout: LayoutMode;
  setTheme: (theme: ThemeName) => void;
  setLayout: (layout: LayoutMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({
  children,
  defaultTheme = "hunting",
  defaultLayout = "sidebar",
}: {
  children: React.ReactNode;
  defaultTheme?: ThemeName;
  defaultLayout?: LayoutMode;
}) {
  const [theme, setThemeState] = useState<ThemeName>(defaultTheme);
  const [layout, setLayout] = useState<LayoutMode>(defaultLayout);
  
  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    // Apply class to body for global CSS variables
    if (typeof document !== "undefined") {
      document.body.classList.remove(
        "theme-hunting", "theme-minimal", "theme-dark", "theme-light"
      );
      if (newTheme !== "dark" && newTheme !== "light") {
        document.body.classList.add(`theme-${newTheme}`);
      }
      
      // If it's a specific theme, we might want to also force dark/light mode base
      if (newTheme === "hunting") document.body.classList.add("dark");
      else if (newTheme === "minimal") document.body.classList.remove("dark");
    }
  };

  useEffect(() => {
    // Initial mount setup
    setTheme(defaultTheme);
  }, [defaultTheme]);

  return (
    <ThemeContext.Provider value={{ theme, layout, setTheme, setLayout }}>
      <div className={`min-h-screen bg-background text-foreground`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
