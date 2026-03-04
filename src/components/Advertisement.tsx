"use client";

import { useApp } from "@/lib/app-context";

interface AdBannerProps {
  position: "top" | "middle" | "bottom" | "sidebar";
  className?: string;
}

// Mock advertisement data - in production, this would come from an ad network
const adBanners = [
  { id: 1, name: "Energy Corp", tagline: "Reliable Energy Solutions" },
  { id: 2, name: "PetroTrade", tagline: "Global Oil Trading" },
  { id: 3, name: "FuelTech", tagline: "Next-Gen Fuel Technology" },
  { id: 4, name: "OilAnalytics", tagline: "Data-Driven Market Insights" },
  { id: 5, name: "GreenEnergy", tagline: "Sustainable Energy Future" },
];

function getRandomAd() {
  return adBanners[Math.floor(Math.random() * adBanners.length)];
}

export function AdBanner({ position, className = "" }: AdBannerProps) {
  const { t } = useApp();
  const ad = getRandomAd();

  if (position === "sidebar") {
    return (
      <div className={`bg-slate-800/40 border border-slate-700/30 rounded-lg p-4 ${className}`}>
        <div className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">
          {t.sponsored}
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
            <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="text-sm font-medium text-slate-200">{ad.name}</div>
            <div className="text-xs text-slate-400">{ad.tagline}</div>
          </div>
        </div>
        <button className="mt-3 w-full py-1.5 text-xs bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded transition-colors">
          {t.partner}
        </button>
      </div>
    );
  }

  return (
    <div className={`bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-slate-700/30 rounded-xl p-4 ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
            <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <div className="text-xs text-slate-500 uppercase tracking-wider mb-1">
              {t.advertisement} • {t.sponsored}
            </div>
            <div className="text-lg font-semibold text-slate-200">{ad.name}</div>
            <div className="text-sm text-slate-400">{ad.tagline}</div>
          </div>
        </div>
        <button className="px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 rounded-lg transition-colors text-sm">
          {t.partner}
        </button>
      </div>
    </div>
  );
}

export function AdSlot({ position }: { position: "header" | "between-news" | "between-prices" | "footer" }) {
  const { t } = useApp();

  const getPositionClass = () => {
    switch (position) {
      case "header":
        return "mb-6";
      case "between-news":
        return "my-8";
      case "between-prices":
        return "my-10";
      case "footer":
        return "mt-10";
      default:
        return "";
    }
  };

  return (
    <div className={getPositionClass()}>
      <div className="text-xs text-slate-600 text-center mb-2">{t.advertisement}</div>
      <AdBanner position={position === "header" || position === "footer" ? "middle" : "middle"} />
    </div>
  );
}
