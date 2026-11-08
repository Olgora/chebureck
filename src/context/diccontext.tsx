"use client";

import { createContext, useContext } from "react";
import { getDictionary } from "@/lib/dictionaries";


type Language = "en" | "pt" ;

type Dictionary = Awaited<ReturnType<typeof getDictionary>>;
type I18nContextType = {
  language: Language;
  dictionary: Dictionary
};

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({
  children,
  lang,
  dictionary,
}: {
  children: React.ReactNode;
  lang: Language;
  dictionary: Dictionary;
}) {
  return (
    <I18nContext.Provider
      value={{
        language: lang,
        dictionary,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);

  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }

  return context;
}