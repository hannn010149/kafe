"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Language } from "@/types";
import { translations } from "@/lib/translations";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations.id) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("id");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Read saved preference or default to 'id'
    const saved = localStorage.getItem("komorebi_lang") as Language;
    if (saved && (saved === "id" || saved === "en")) {
      setLanguageState(saved);
      document.documentElement.lang = saved;
    } else {
      document.documentElement.lang = "id";
    }
    setMounted(true);
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("komorebi_lang", lang);
    document.documentElement.lang = lang;
  };

  const t = (key: keyof typeof translations.id): string => {
    const dict = translations[language] || translations.id;
    return (dict as Record<string, string>)[key] || (translations.id as Record<string, string>)[key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

