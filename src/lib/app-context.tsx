"use client";

import { createContext, useContext, useState, useEffect, useSyncExternalStore, ReactNode } from "react";
import { translations, Translations, Language, currencies, Currency, languageNames } from "./translations";

// Helper to get initial language from localStorage safely (works during SSR)
function getInitialLanguage(): Language {
  if (typeof window === "undefined") return "th";
  const saved = localStorage.getItem("oilPriceLanguage");
  return saved && translations[saved as Language] ? saved as Language : "th";
}

// Helper to get initial currency from localStorage safely
function getInitialCurrency(): Currency {
  if (typeof window === "undefined") return currencies[0];
  const saved = localStorage.getItem("oilPriceCurrency");
  const found = currencies.find((c) => c.code === saved);
  return found || currencies[0];
}

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  t: Translations;
  priceTrend: "up" | "down" | "neutral";
  setPriceTrend: (trend: "up" | "down" | "neutral") => void;
  convertPrice: (priceInUSD: number) => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getInitialLanguage());
  const [currency, setCurrencyState] = useState<Currency>(getInitialCurrency());
  const [priceTrend, setPriceTrend] = useState<"up" | "down" | "neutral">("neutral");

  // Update language and currency when they change
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("oilPriceLanguage", lang);
    // Update document lang attribute
    document.documentElement.lang = lang;
    // Update document direction for RTL languages
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem("oilPriceCurrency", curr.code);
  };

  const convertPrice = (priceInUSD: number): number => {
    return priceInUSD * currency.rate;
  };

  const t = translations[language];

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        currency,
        setCurrency,
        t,
        priceTrend,
        setPriceTrend,
        convertPrice,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

export { languageNames, translations, currencies, type Language, type Currency, type Translations };
