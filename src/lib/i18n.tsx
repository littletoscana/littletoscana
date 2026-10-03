import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type Locale = "ro" | "ru";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  pick: (ro: string, ru: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ro");

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      pick: (ro, ru) => (locale === "ro" ? ro : ru),
    }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) throw new Error("useLocale must be used inside LocaleProvider");
  return context;
}