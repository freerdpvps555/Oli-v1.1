"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import Link from "next/link";
import { useApp } from "@/lib/app-context";
import { SettingsPanel } from "@/components/LanguageCurrencySelector";
import { AdBanner, AdSlot } from "@/components/Advertisement";

interface OilPrice {
  id: string;
  country: string;
  flag: string;
  name: string;
  type: string;
  brand?: string;
  currencySymbol?: string;
  unitLabel?: string;
  price: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  high52w: number;
  low52w: number;
  volume: string;
  openInterest: string;
  history: number[];
  lastUpdate: Date;
}

interface OilNews {
  id: number;
  title: string;
  source: string;
  time: string;
  tag: string;
  sentiment: "positive" | "negative" | "neutral";
  url?: string;
}

const initialOilData: OilPrice[] = [
  { id: "wti", country: "US", flag: "🇺🇸", name: "WTI Crude", type: "Crude Oil", price: 75.42, previousPrice: 75.42, change: 0, changePercent: 0, high24h: 76.80, low24h: 74.20, high52w: 95.00, low52w: 62.00, volume: "892K", openInterest: "1.2M", history: [74.50, 75.10, 74.80, 75.30, 75.60, 75.20, 75.42], lastUpdate: new Date() },
  { id: "brent", country: "UK", flag: "🇬🇧", name: "Brent Crude", type: "Crude Oil", price: 79.18, previousPrice: 79.18, change: 0, changePercent: 0, high24h: 80.50, low24h: 78.10, high52w: 100.00, low52w: 65.00, volume: "756K", openInterest: "980K", history: [78.20, 78.90, 79.00, 78.70, 79.20, 79.50, 79.18], lastUpdate: new Date() },
  { id: "saudi", country: "SA", flag: "🇸🇦", name: "Arab Light", type: "Crude Oil", price: 82.35, previousPrice: 82.35, change: 0, changePercent: 0, high24h: 83.20, low24h: 81.50, high52w: 98.00, low52w: 70.00, volume: "450K", openInterest: "620K", history: [81.80, 82.00, 82.50, 82.20, 82.80, 82.60, 82.35], lastUpdate: new Date() },
  { id: "russia", country: "RU", flag: "🇷🇺", name: "Urals", type: "Crude Oil", price: 68.90, previousPrice: 68.90, change: 0, changePercent: 0, high24h: 70.10, low24h: 67.80, high52w: 85.00, low52w: 55.00, volume: "380K", openInterest: "450K", history: [68.00, 68.50, 69.20, 68.80, 69.00, 68.70, 68.90], lastUpdate: new Date() },
  { id: "dubai", country: "AE", flag: "🇦🇪", name: "Dubai Crude", type: "Crude Oil", price: 76.55, previousPrice: 76.55, change: 0, changePercent: 0, high24h: 77.80, low24h: 75.90, high52w: 92.00, low52w: 62.00, volume: "520K", openInterest: "680K", history: [76.00, 76.30, 76.80, 76.40, 76.90, 76.70, 76.55], lastUpdate: new Date() },
  { id: "korea", country: "KR", flag: "🇰🇷", name: "Korea Import", type: "Crude Oil", price: 74.20, previousPrice: 74.20, change: 0, changePercent: 0, high24h: 75.50, low24h: 73.80, high52w: 88.00, low52w: 60.00, volume: "280K", openInterest: "340K", history: [73.90, 74.10, 74.50, 74.30, 74.60, 74.40, 74.20], lastUpdate: new Date() },
  { id: "singapore", country: "SG", flag: "🇸🇬", name: "Singapore MOPS", type: "Crude Oil", price: 75.80, previousPrice: 75.80, change: 0, changePercent: 0, high24h: 77.00, low24h: 75.20, high52w: 90.00, low52w: 62.00, volume: "310K", openInterest: "420K", history: [75.40, 75.70, 76.10, 75.90, 76.20, 76.00, 75.80], lastUpdate: new Date() },
  { id: "nigeria", country: "NG", flag: "🇳🇬", name: "Bonke Light", type: "Crude Oil", price: 83.45, previousPrice: 83.45, change: 0, changePercent: 0, high24h: 84.80, low24h: 82.50, high52w: 96.00, low52w: 68.00, volume: "180K", openInterest: "220K", history: [82.80, 83.20, 83.60, 83.30, 83.80, 83.60, 83.45], lastUpdate: new Date() },
  { id: "brazil", country: "BR", flag: "🇧🇷", name: "Brazilian Crude", type: "Crude Oil", price: 71.25, previousPrice: 71.25, change: 0, changePercent: 0, high24h: 72.50, low24h: 70.80, high52w: 82.00, low52w: 55.00, volume: "240K", openInterest: "310K", history: [70.90, 71.20, 71.50, 71.30, 71.70, 71.50, 71.25], lastUpdate: new Date() },
  { id: "canada", country: "CA", flag: "🇨🇦", name: "Western Canadian", type: "Crude Oil", price: 64.80, previousPrice: 64.80, change: 0, changePercent: 0, high24h: 66.00, low24h: 64.20, high52w: 78.00, low52w: 52.00, volume: "420K", openInterest: "560K", history: [64.30, 64.60, 65.00, 64.70, 65.10, 64.90, 64.80], lastUpdate: new Date() },
  { id: "thailand", country: "TH", flag: "🇹🇭", name: "Thai Crude Oil", type: "Crude Oil", price: 72.50, previousPrice: 72.50, change: 0, changePercent: 0, high24h: 73.80, low24h: 71.20, high52w: 85.00, low52w: 58.00, volume: "95K", openInterest: "120K", history: [71.80, 72.10, 72.40, 72.20, 72.60, 72.40, 72.50], lastUpdate: new Date() },
];

const refinedProducts: OilPrice[] = [
  // Thailand retail (แสดงเป็นเงินบาท; จะถูกแทนที่ด้วยข้อมูลจริงจาก /api/thai-retail)
  { id: "th-placeholder", country: "TH", flag: "🇹🇭", name: "กำลังโหลดราคาน้ำมันไทย...", type: "Thailand Retail", currencySymbol: "฿", unitLabel: "บาท/ลิตร", price: 0, previousPrice: 0, change: 0, changePercent: 0, high24h: 0, low24h: 0, high52w: 0, low52w: 0, volume: "-", openInterest: "-", history: [0, 0, 0, 0, 0, 0, 0], lastUpdate: new Date() },

  // Global refined products (USD benchmarks)
  { id: "gasoline", country: "US", flag: "🇺🇸", name: "Gasoline (RBOB)", type: "Refined Product", price: 2.45, previousPrice: 2.45, change: 0, changePercent: 0, high24h: 2.52, low24h: 2.38, high52w: 3.20, low52w: 1.85, volume: "425K", openInterest: "580K", history: [2.40, 2.42, 2.44, 2.41, 2.43, 2.46, 2.45], lastUpdate: new Date() },
  { id: "diesel", country: "US", flag: "🇺🇸", name: "Diesel (ULSD)", type: "Refined Product", price: 2.78, previousPrice: 2.78, change: 0, changePercent: 0, high24h: 2.85, low24h: 2.70, high52w: 3.50, low52w: 2.20, volume: "380K", openInterest: "520K", history: [2.72, 2.75, 2.77, 2.74, 2.76, 2.79, 2.78], lastUpdate: new Date() },
  { id: "heating", country: "US", flag: "🇺🇸", name: "Heating Oil", type: "Refined Product", price: 2.52, previousPrice: 2.52, change: 0, changePercent: 0, high24h: 2.60, low24h: 2.45, high52w: 3.10, low52w: 1.95, volume: "180K", openInterest: "240K", history: [2.48, 2.50, 2.53, 2.49, 2.51, 2.54, 2.52], lastUpdate: new Date() },
  { id: "jetfuel", country: "US", flag: "🇺🇸", name: "Jet Fuel", type: "Refined Product", price: 2.85, previousPrice: 2.85, change: 0, changePercent: 0, high24h: 2.95, low24h: 2.75, high52w: 3.60, low52w: 2.30, volume: "145K", openInterest: "190K", history: [2.80, 2.82, 2.87, 2.83, 2.84, 2.86, 2.85], lastUpdate: new Date() },
  { id: "propane", country: "US", flag: "🇺🇸", name: "Propane", type: "Refined Product", price: 0.92, previousPrice: 0.92, change: 0, changePercent: 0, high24h: 0.98, low24h: 0.88, high52w: 1.20, low52w: 0.65, volume: "95K", openInterest: "130K", history: [0.90, 0.91, 0.93, 0.89, 0.92, 0.94, 0.92], lastUpdate: new Date() },
];

const initialNews: OilNews[] = [];

function generatePriceMovement(price: number): number {
  const volatility = 0.02;
  const change = (Math.random() - 0.5) * 2 * volatility * price;
  return Math.round((price + change) * 100) / 100;
}

function getTrendIcon(change: number): string {
  if (change > 0) return "↑";
  if (change < 0) return "↓";
  return "→";
}

function getTrendColor(change: number): string {
  if (change > 0) return "text-emerald-400";
  if (change < 0) return "text-red-400";
  return "text-gray-400";
}

function getTrendBg(change: number): string {
  if (change > 0) return "bg-emerald-400/10 border-emerald-400/30";
  if (change < 0) return "bg-red-400/10 border-red-400/30";
  return "bg-gray-400/10 border-gray-400/30";
}

function getSentimentColor(sentiment: string): string {
  if (sentiment === "positive") return "text-emerald-400 bg-emerald-500/10";
  if (sentiment === "negative") return "text-red-400 bg-red-500/10";
  return "text-slate-400 bg-slate-500/10";
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 80;
  const height = 24;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width={width} height={height} className="overflow-visible">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function LargeSparkline({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 400;
  const height = 120;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M0,${height} ${points.split(' ').map(p => `L${p}`).join(' ')} L${width},${height} Z`}
        fill={`url(#chartGradient)`}
      />
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PriceCard({ oil, isUpdating, onClick }: { oil: OilPrice; isUpdating: boolean; onClick: () => void }) {
  const { currency, convertPrice, t } = useApp();
  const trendColor = getTrendColor(oil.change);
  const trendBg = getTrendBg(oil.change);
  const displayPrice = useMemo(() => convertPrice(oil.price), [convertPrice, oil.price]);
  const displayHigh = useMemo(() => convertPrice(oil.high24h), [convertPrice, oil.high24h]);
  const displayLow = useMemo(() => convertPrice(oil.low24h), [convertPrice, oil.low24h]);
  
  return (
    <button 
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-5 transition-all duration-300 hover:scale-[1.02] hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 text-left w-full ${isUpdating ? 'ring-2 ring-amber-500/50' : ''}`}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-0 hover:opacity-100 transition-opacity" />
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{oil.flag}</span>
            <div>
              <h3 className="font-outfit font-semibold text-slate-100 text-sm">{oil.name}</h3>
              <p className="text-xs text-slate-400">{oil.country}</p>
            </div>
          </div>
          <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-mono ${trendBg}`}>
            <span>{getTrendIcon(oil.change)}</span>
            <span className={trendColor}>{Math.abs(oil.changePercent).toFixed(2)}%</span>
          </div>
        </div>

        <div className="mb-4">
          <p className="font-jetbrains text-3xl font-bold text-slate-50">
            {currency.symbol}{displayPrice.toFixed(2)}
          </p>
          <p className={`text-sm font-mono ${trendColor}`}>
            {oil.change >= 0 ? "+" : ""}{oil.change.toFixed(2)} ({oil.changePercent >= 0 ? "+" : ""}{oil.changePercent.toFixed(2)}%)
          </p>
        </div>

        <div className="flex items-center justify-between">
          <Sparkline 
            data={oil.history} 
            color={oil.change >= 0 ? "#10b981" : oil.change < 0 ? "#ef4444" : "#6b7280"} 
          />
          <div className="text-right">
            <p className="text-xs text-slate-400">{t.price24h}</p>
            <p className="text-xs font-mono text-slate-300">
              {currency.symbol}{displayLow.toFixed(2)} - {currency.symbol}{displayHigh.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

function RefinedProductCard({ product, isUpdating }: { product: OilPrice; isUpdating: boolean }) {
  const { currency, convertPrice, t } = useApp();
  const trendColor = getTrendColor(product.change);
  const displayPrice = useMemo(() => convertPrice(product.price), [convertPrice, product.price]);
  
  return (
    <div 
      className={`relative overflow-hidden rounded-xl border border-slate-700/50 bg-gradient-to-br from-slate-800/80 to-slate-900/50 backdrop-blur-sm p-4 transition-all duration-300 hover:scale-[1.02] hover:border-cyan-500/30 hover:shadow-lg hover:shadow-cyan-500/10 ${isUpdating ? 'ring-2 ring-cyan-500/50' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-cyan-500/20 flex items-center justify-center">
            <svg className="w-4 h-4 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <div>
            <h4 className="font-outfit font-medium text-slate-100 text-sm">{product.name}</h4>
            {product.brand ? (
              <p className="text-[10px] text-slate-400 mt-0.5">{product.brand}</p>
            ) : null}
            <p className="text-xs text-cyan-400">{product.type}</p>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-mono ${getTrendBg(product.change)}`}>
          <span className={trendColor}>{getTrendIcon(product.change)} {Math.abs(product.changePercent).toFixed(2)}%</span>
        </div>
      </div>
      <p className="font-jetbrains text-2xl font-bold text-slate-50">
        {currency.symbol}{displayPrice.toFixed(2)}
        {product.unitLabel ? <span className="ml-2 text-xs font-normal text-slate-400">{product.unitLabel}</span> : null}
      </p>
    </div>
  );
}

function NewsCard({ news }: { news: OilNews }) {
  return (
    <a
      href={news.url || "#"}
      target={news.url ? "_blank" : undefined}
      rel={news.url ? "noreferrer" : undefined}
      className="block p-4 rounded-xl bg-slate-800/30 border border-slate-700/30 hover:border-amber-500/30 transition-all cursor-pointer group"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getSentimentColor(news.sentiment)}`}>
          {news.tag}
        </span>
        <span className="text-xs text-slate-500">{news.time}</span>
      </div>
      <h4 className="font-outfit text-sm text-slate-200 group-hover:text-amber-400 transition-colors line-clamp-2">
        {news.title}
      </h4>
      <p className="text-xs text-slate-500 mt-2">{news.source}</p>
    </a>
  );
}

function DetailModal({ oil, onClose }: { oil: OilPrice; onClose: () => void }) {
  const { currency, convertPrice, t } = useApp();
  const trendColor = getTrendColor(oil.change);
  const trendIcon = getTrendIcon(oil.change);
  const displayPrice = useMemo(() => convertPrice(oil.price), [convertPrice, oil.price]);
  const displayHigh24 = useMemo(() => convertPrice(oil.high24h), [convertPrice, oil.high24h]);
  const displayLow24 = useMemo(() => convertPrice(oil.low24h), [convertPrice, oil.low24h]);
  const displayHigh52 = useMemo(() => convertPrice(oil.high52w), [convertPrice, oil.high52w]);
  const displayLow52 = useMemo(() => convertPrice(oil.low52w), [convertPrice, oil.low52w]);
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="relative p-6 bg-gradient-to-r from-slate-800 to-slate-900 border-b border-slate-700/50">
          <button onClick={onClose} className="absolute top-4 right-4 p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:text-slate-200 hover:bg-slate-700 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <div className="flex items-center gap-4">
            <span className="text-5xl">{oil.flag}</span>
            <div>
              <h2 className="font-outfit text-2xl font-bold text-slate-100">{oil.name}</h2>
              <p className="text-slate-400">{oil.country} • {oil.type}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Price Section */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-slate-400 mb-1">{t.currentPrice}</p>
              <p className="font-jetbrains text-5xl font-bold text-slate-50">
                {currency.symbol}{displayPrice.toFixed(2)}
                {oil.unitLabel ? <span className="ml-3 text-sm font-normal text-slate-400">{oil.unitLabel}</span> : null}
              </p>
              <p className={`text-lg font-mono mt-1 ${trendColor}`}>
                {oil.change >= 0 ? "+" : ""}{oil.change.toFixed(2)} ({oil.changePercent >= 0 ? "+" : ""}{oil.changePercent.toFixed(2)}%) {trendIcon}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">{t.lastUpdated}</p>
              <p className="font-mono text-slate-300">{oil.lastUpdate.toLocaleTimeString('th-TH')}</p>
            </div>
          </div>

          {/* Chart */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/30">
            <p className="text-sm text-slate-400 mb-3">{t.priceHistory}</p>
            <LargeSparkline 
              data={oil.history} 
              color={oil.change >= 0 ? "#10b981" : oil.change < 0 ? "#ef4444" : "#6b7280"} 
            />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-700/30 border border-slate-600/30">
              <p className="text-xs text-slate-400 mb-1">{t.price24h} {t.high}</p>
              <p className="font-mono text-emerald-400 font-semibold">{currency.symbol}{displayHigh24.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-700/30 border border-slate-600/30">
              <p className="text-xs text-slate-400 mb-1">{t.price24h} {t.low}</p>
              <p className="font-mono text-red-400 font-semibold">{currency.symbol}{displayLow24.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-700/30 border border-slate-600/30">
              <p className="text-xs text-slate-400 mb-1">{t.high52w}</p>
              <p className="font-mono text-amber-400 font-semibold">{currency.symbol}{displayHigh52.toFixed(2)}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-700/30 border border-slate-600/30">
              <p className="text-xs text-slate-400 mb-1">{t.low52w}</p>
              <p className="font-mono text-slate-400 font-semibold">{currency.symbol}{displayLow52.toFixed(2)}</p>
            </div>
          </div>

          {/* Additional Info */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-slate-700/30 border border-slate-600/30">
              <p className="text-xs text-slate-400 mb-1">{t.volume}</p>
              <p className="font-mono text-slate-200">{oil.volume}</p>
            </div>
            <div className="p-3 rounded-xl bg-slate-700/30 border border-slate-600/30">
              <p className="text-xs text-slate-400 mb-1">{t.openInterest}</p>
              <p className="font-mono text-slate-200">{oil.openInterest}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Ticker({ prices }: { prices: OilPrice[] }) {
  const { currency, convertPrice, t } = useApp();
  
  return (
    <div className="overflow-hidden bg-slate-900/80 border-y border-slate-700/50 py-2">
      <div className="flex animate-scroll gap-8">
        {[...prices, ...prices].map((oil, index) => {
          const displayPrice = convertPrice(oil.price);
          return (
            <div key={`${oil.id}-${index}`} className="flex items-center gap-2 whitespace-nowrap">
              <span>{oil.flag}</span>
              <span className="font-mono text-sm text-slate-300">{oil.name}</span>
              <span className={`font-mono text-sm font-semibold ${getTrendColor(oil.change)}`}>
                {currency.symbol}{displayPrice.toFixed(2)}
              </span>
              <span className={`text-xs ${getTrendColor(oil.change)}`}>
                {getTrendIcon(oil.change)} {Math.abs(oil.changePercent).toFixed(2)}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StatsSummary({ prices }: { prices: OilPrice[] }) {
  const { currency, convertPrice, t } = useApp();
  
  const avgPrice = useMemo(() => {
    const avg = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
    return convertPrice(avg);
  }, [prices, convertPrice]);
  
  const highest = useMemo(() => {
    return prices.reduce((max, p) => p.price > max.price ? p : max, prices[0]);
  }, [prices]);
  
  const lowest = useMemo(() => {
    return prices.reduce((min, p) => p.price < min.price ? p : min, prices[0]);
  }, [prices]);
  
  const mostChanged = useMemo(() => {
    return prices.reduce((max, p) => Math.abs(p.changePercent) > Math.abs(max.changePercent) ? p : max, prices[0]);
  }, [prices]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <p className="text-xs text-slate-400 mb-1">{t.averagePrice}</p>
        <p className="font-jetbrains text-xl font-bold text-slate-100">{currency.symbol}{avgPrice.toFixed(2)}</p>
      </div>
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <p className="text-xs text-slate-400 mb-1">{t.highestPrice}</p>
        <p className="font-jetbrains text-xl font-bold text-emerald-400 flex items-center gap-2">
          {highest.flag} {currency.symbol}{convertPrice(highest.price).toFixed(2)}
        </p>
      </div>
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <p className="text-xs text-slate-400 mb-1">{t.lowestPrice}</p>
        <p className="font-jetbrains text-xl font-bold text-red-400 flex items-center gap-2">
          {lowest.flag} {currency.symbol}{convertPrice(lowest.price).toFixed(2)}
        </p>
      </div>
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <p className="text-xs text-slate-400 mb-1">{t.mostVolatile}</p>
        <p className="font-jetbrains text-xl font-bold text-amber-400 flex items-center gap-2">
          {mostChanged.flag} {Math.abs(mostChanged.changePercent).toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const { currency, t, setPriceTrend } = useApp();
  const [prices, setPrices] = useState<OilPrice[]>(initialOilData);
  const [refined, setRefined] = useState<OilPrice[]>(refinedProducts);
  const [news, setNews] = useState<OilNews[]>(initialNews);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isPaused, setIsPaused] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [selectedOil, setSelectedOil] = useState<OilPrice | null>(null);
  const [activeTab, setActiveTab] = useState<"crude" | "refined">("crude");

  const thaiRefined = refined.filter((p) => p.country === "TH" || p.type === "Thailand Retail");
  const globalRefined = refined.filter((p) => !(p.country === "TH" || p.type === "Thailand Retail"));
  
  // Initialize update interval from localStorage or default to 3 seconds
  const [updateInterval, setUpdateInterval] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("oilPriceUpdateInterval");
      if (saved) {
        const interval = parseInt(saved, 10);
        if (interval > 0) return interval;
      }
    }
    return 3;
  });

  // Fetch real news (GDELT) via our API route
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/news", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { items?: OilNews[] };
        if (!cancelled && Array.isArray(data.items)) {
          setNews(data.items);
        }
      } catch {
        // Keep UI usable even when news fetch fails
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch Thailand retail prices (real data by brand).
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/thai-retail", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as {
          brands?: Array<{
            brand: string;
            items: Array<{
              id: string;
              name: string;
              price: number;
              unitLabel: string;
              currencySymbol: string;
            }>;
          }>;
        };

        if (cancelled || !Array.isArray(data.brands) || data.brands.length === 0) return;

        const now = new Date();
        const items: OilPrice[] = data.brands.flatMap((b) =>
          (b.items ?? []).map((it) => {
            const price = Number(it.price);
            return {
              id: `th-${b.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${it.id}`,
              country: "TH",
              flag: "🇹🇭",
              name: it.name,
              type: "Thailand Retail",
              brand: b.brand,
              currencySymbol: "฿",
              unitLabel: it.unitLabel || "บาท/ลิตร",
              price,
              previousPrice: price,
              change: 0,
              changePercent: 0,
              high24h: price,
              low24h: price,
              high52w: price,
              low52w: price,
              volume: "-",
              openInterest: "-",
              history: [price, price, price, price, price, price, price],
              lastUpdate: now,
            };
          })
        );

        setRefined((prev) => {
          const globalOnly = prev.filter(
            (p) => !(p.country === "TH" || p.type === "Thailand Retail")
          );
          return [...items, ...globalOnly];
        });
      } catch {
        // Keep UI usable if Thai retail fetch fails.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Fetch real commodity prices (WTI/Brent) when an API key is configured server-side.
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/prices", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as {
          items?: Array<{ id: string; price: number; previousPrice: number }>;
        };

        if (cancelled || !Array.isArray(data.items) || data.items.length === 0) return;

        setPrices((prev) =>
          prev.map((oil) => {
            const match = data.items?.find((i) => i.id === oil.id);
            if (!match) return oil;

            const change = match.price - match.previousPrice;
            const changePercent = (change / match.previousPrice) * 100;
            return {
              ...oil,
              price: match.price,
              previousPrice: match.previousPrice,
              change: Math.round(change * 100) / 100,
              changePercent: Math.round(changePercent * 100) / 100,
              high24h: Math.max(oil.high24h, match.price),
              low24h: Math.min(oil.low24h, match.price),
              history: [...oil.history.slice(1), match.price],
              lastUpdate: new Date(),
            };
          })
        );
      } catch {
        // Keep UI usable when real-price fetch fails.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleChangeInterval = (seconds: number) => {
    setUpdateInterval(seconds);
    if (typeof window !== "undefined") {
      localStorage.setItem("oilPriceUpdateInterval", seconds.toString());
    }
  };

  const updatePrices = useCallback(() => {
    if (isPaused) return;

    setPrices(prevPrices => {
      const updatedPrices = prevPrices.map(oil => {
        const newPrice = generatePriceMovement(oil.price);
        const prev = oil.price;
        const change = newPrice - prev;
        const changePercent = (change / prev) * 100;
        const newHistory = [...oil.history.slice(1), newPrice];
        
        return {
          ...oil,
          previousPrice: prev,
          price: newPrice,
          change: Math.round(change * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100,
          high24h: Math.max(oil.high24h, newPrice),
          low24h: Math.min(oil.low24h, newPrice),
          history: newHistory,
          lastUpdate: new Date(),
        };
      });

      return updatedPrices;
    });

    setRefined(prevRefined => {
      return prevRefined.map(product => {
        const newPrice = generatePriceMovement(product.price);
        const prev = product.price;
        const change = newPrice - prev;
        const changePercent = (change / prev) * 100;
        const newHistory = [...product.history.slice(1), newPrice];
        
        return {
          ...product,
          previousPrice: prev,
          price: newPrice,
          change: Math.round(change * 100) / 100,
          changePercent: Math.round(changePercent * 100) / 100,
          high24h: Math.max(product.high24h, newPrice),
          low24h: Math.min(product.low24h, newPrice),
          history: newHistory,
          lastUpdate: new Date(),
        };
      });
    });
    
    setLastUpdate(new Date());
  }, [isPaused]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomId = prices[Math.floor(Math.random() * prices.length)]?.id;
      setUpdatingId(randomId);
      updatePrices();
      setTimeout(() => setUpdatingId(null), 500);
    }, updateInterval * 1000);

    return () => clearInterval(interval);
  }, [updatePrices, prices, updateInterval]);

  return (
    <main className="min-h-screen bg-[#0a0f1a] text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <svg className="w-10 h-10 text-amber-500" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full animate-pulse" />
              </div>
              <div>
                <h1 className="font-outfit text-2xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                  {t.siteTitle}
                </h1>
                <p className="text-xs text-slate-400">{t.siteDescription}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <SettingsPanel />
              <Link
                href="/login"
                className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-all"
              >
                {t.login}
              </Link>
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-400">{t.lastUpdate}</p>
                <p className="font-mono text-sm text-slate-300">
                  {lastUpdate.toLocaleTimeString('th-TH')}
                </p>
              </div>
              <div className="text-right hidden md:block">
                <p className="text-xs text-slate-400">{t.updateEvery}</p>
                <div className="flex items-center justify-end gap-2">
                  <p className="font-mono text-sm text-amber-400">{updateInterval}{t.seconds}</p>
                  <select
                    value={updateInterval}
                    onChange={(e) => handleChangeInterval(Number(e.target.value))}
                    className="text-xs bg-slate-800/60 border border-slate-700/60 rounded px-2 py-1 text-slate-200 focus:outline-none focus:border-amber-500/60"
                    aria-label={t.updateInterval}
                  >
                    <option value={1}>1s</option>
                    <option value={2}>2s</option>
                    <option value={3}>3s</option>
                    <option value={5}>5s</option>
                    <option value={10}>10s</option>
                    <option value={30}>30s</option>
                    <option value={60}>60s</option>
                  </select>
                </div>
              </div>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isPaused 
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" 
                    : "bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700"
                }`}
              >
                {isPaused ? `▶ ${t.resume}` : `⏸ ${t.pause}`}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Ticker */}
      <Ticker prices={prices} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdSlot position="between-news" />
        
        {/* Stats Summary */}
        <StatsSummary prices={prices} />

        {/* News Section */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
            </div>
            <div>
              <h2 className="font-outfit text-xl font-bold text-slate-100">ข่าวน้ำมันล่าสุด</h2>
              <p className="text-xs text-slate-400">อัปเดตข่าวสารจากตลาดน้ำมันทั่วโลก</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {news.length > 0 ? (
              news.map((item) => <NewsCard key={item.id} news={item} />)
            ) : (
              <div className="col-span-full text-sm text-slate-500">
                กำลังโหลดข่าวจริงจากแหล่งข้อมูล...
              </div>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => setActiveTab("crude")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "crude"
                ? "bg-amber-500 text-slate-900 shadow-lg shadow-amber-500/20"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
            }`}
          >
            น้ำมันดิบ
          </button>
          <button
            onClick={() => setActiveTab("refined")}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === "refined"
                ? "bg-cyan-500 text-slate-900 shadow-lg shadow-cyan-500/20"
                : "bg-slate-800/50 text-slate-400 hover:bg-slate-700/50 hover:text-slate-300"
            }`}
          >
            ผลิตภัณฑ์น้ำมัน
          </button>
        </div>

        {/* Price Grid */}
        {activeTab === "crude" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {prices.map((oil) => (
              <PriceCard 
                key={oil.id} 
                oil={oil} 
                isUpdating={updatingId === oil.id}
                onClick={() => setSelectedOil(oil)}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            <section>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-outfit text-base font-semibold text-slate-100">ราคาน้ำมันไทย</h3>
                  <p className="text-xs text-slate-400">แสดงเป็นเงินบาท (฿)</p>
                </div>
                <span className="text-xs font-mono text-cyan-300/80">THB</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {thaiRefined.map((product) => (
                  <RefinedProductCard
                    key={product.id}
                    product={product}
                    isUpdating={updatingId === product.id}
                  />
                ))}
              </div>
            </section>

            {globalRefined.length > 0 ? (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="font-outfit text-base font-semibold text-slate-100">ราคาอ้างอิงตลาดสากล</h3>
                    <p className="text-xs text-slate-400">หน่วยเป็นดอลลาร์ (USD)</p>
                  </div>
                  <span className="text-xs font-mono text-slate-400">USD</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                  {globalRefined.map((product) => (
                    <RefinedProductCard
                      key={product.id}
                      product={product}
                      isUpdating={updatingId === product.id}
                    />
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-700/50 text-center">
          <p className="text-xs text-slate-500">
            {t.disclaimer} {updateInterval} {t.seconds}
          </p>
          <p className="text-xs text-slate-600 mt-2">
            หมายเหตุ: ราคาน้ำมันไทยในแท็บ “ผลิตภัณฑ์น้ำมัน” ดึงข้อมูลจริงจากผู้ให้บริการที่มีแหล่งข้อมูลสาธารณะรองรับ และจะแสดงเท่าที่เรียกได้
          </p>
          <p className="text-xs text-slate-600 mt-2">
            {t.copyright}
          </p>
        </footer>
      </div>

      {/* Detail Modal */}
      {selectedOil && (
        <DetailModal oil={selectedOil} onClose={() => setSelectedOil(null)} />
      )}

      <style jsx global>{`
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes zoomIn {
          from { transform: scale(0.95); }
          to { transform: scale(1); }
        }
        .animate-in {
          animation: fadeIn 0.2s ease-out, zoomIn 0.2s ease-out;
        }
      `}</style>
    </main>
  );
}
