"use client";

import { useState, useEffect, useCallback } from "react";

interface OilPrice {
  id: string;
  country: string;
  flag: string;
  name: string;
  price: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  high24h: number;
  low24h: number;
  history: number[];
  lastUpdate: Date;
}

const initialOilData: OilPrice[] = [
  { id: "wti", country: "US", flag: "🇺🇸", name: "WTI Crude", price: 75.42, previousPrice: 75.42, change: 0, changePercent: 0, high24h: 76.80, low24h: 74.20, history: [74.50, 75.10, 74.80, 75.30, 75.60, 75.20, 75.42], lastUpdate: new Date() },
  { id: "brent", country: "UK", flag: "🇬🇧", name: "Brent Crude", price: 79.18, previousPrice: 79.18, change: 0, changePercent: 0, high24h: 80.50, low24h: 78.10, history: [78.20, 78.90, 79.00, 78.70, 79.20, 79.50, 79.18], lastUpdate: new Date() },
  { id: "saudi", country: "SA", flag: "🇸🇦", name: "Arab Light", price: 82.35, previousPrice: 82.35, change: 0, changePercent: 0, high24h: 83.20, low24h: 81.50, history: [81.80, 82.00, 82.50, 82.20, 82.80, 82.60, 82.35], lastUpdate: new Date() },
  { id: "russia", country: "RU", flag: "🇷🇺", name: "Urals", price: 68.90, previousPrice: 68.90, change: 0, changePercent: 0, high24h: 70.10, low24h: 67.80, history: [68.00, 68.50, 69.20, 68.80, 69.00, 68.70, 68.90], lastUpdate: new Date() },
  { id: "dubai", country: "AE", flag: "🇦🇪", name: "Dubai Crude", price: 76.55, previousPrice: 76.55, change: 0, changePercent: 0, high24h: 77.80, low24h: 75.90, history: [76.00, 76.30, 76.80, 76.40, 76.90, 76.70, 76.55], lastUpdate: new Date() },
  { id: "korea", country: "KR", flag: "🇰🇷", name: "Korea Import", price: 74.20, previousPrice: 74.20, change: 0, changePercent: 0, high24h: 75.50, low24h: 73.80, history: [73.90, 74.10, 74.50, 74.30, 74.60, 74.40, 74.20], lastUpdate: new Date() },
  { id: "singapore", country: "SG", flag: "🇸🇬", name: "Singapore MOPS", price: 75.80, previousPrice: 75.80, change: 0, changePercent: 0, high24h: 77.00, low24h: 75.20, history: [75.40, 75.70, 76.10, 75.90, 76.20, 76.00, 75.80], lastUpdate: new Date() },
  { id: "nigeria", country: "NG", flag: "🇳🇬", name: "Bonke Light", price: 83.45, previousPrice: 83.45, change: 0, changePercent: 0, high24h: 84.80, low24h: 82.50, history: [82.80, 83.20, 83.60, 83.30, 83.80, 83.60, 83.45], lastUpdate: new Date() },
  { id: "brazil", country: "BR", flag: "🇧🇷", name: "Brazilian Crude", price: 71.25, previousPrice: 71.25, change: 0, changePercent: 0, high24h: 72.50, low24h: 70.80, history: [70.90, 71.20, 71.50, 71.30, 71.70, 71.50, 71.25], lastUpdate: new Date() },
  { id: "canada", country: "CA", flag: "🇨🇦", name: "Western Canadian", price: 64.80, previousPrice: 64.80, change: 0, changePercent: 0, high24h: 66.00, low24h: 64.20, history: [64.30, 64.60, 65.00, 64.70, 65.10, 64.90, 64.80], lastUpdate: new Date() },
];

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

function PriceCard({ oil, isUpdating }: { oil: OilPrice; isUpdating: boolean }) {
  const trendColor = getTrendColor(oil.change);
  const trendBg = getTrendBg(oil.change);
  
  return (
    <div 
      className={`relative overflow-hidden rounded-xl border border-slate-700/50 bg-slate-800/50 backdrop-blur-sm p-5 transition-all duration-300 hover:scale-[1.02] hover:border-amber-500/30 hover:shadow-lg hover:shadow-amber-500/10 ${isUpdating ? 'ring-2 ring-amber-500/50' : ''}`}
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
            ${oil.price.toFixed(2)}
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
            <p className="text-xs text-slate-400">24h Range</p>
            <p className="text-xs font-mono text-slate-300">
              ${oil.low24h.toFixed(2)} - ${oil.high24h.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Ticker({ prices }: { prices: OilPrice[] }) {
  return (
    <div className="overflow-hidden bg-slate-900/80 border-y border-slate-700/50 py-2">
      <div className="flex animate-scroll gap-8">
        {[...prices, ...prices].map((oil, index) => (
          <div key={`${oil.id}-${index}`} className="flex items-center gap-2 whitespace-nowrap">
            <span>{oil.flag}</span>
            <span className="font-mono text-sm text-slate-300">{oil.name}</span>
            <span className={`font-mono text-sm font-semibold ${getTrendColor(oil.change)}`}>
              ${oil.price.toFixed(2)}
            </span>
            <span className={`text-xs ${getTrendColor(oil.change)}`}>
              {getTrendIcon(oil.change)} {Math.abs(oil.changePercent).toFixed(2)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsSummary({ prices }: { prices: OilPrice[] }) {
  const avgPrice = prices.reduce((sum, p) => sum + p.price, 0) / prices.length;
  const highest = prices.reduce((max, p) => p.price > max.price ? p : max, prices[0]);
  const lowest = prices.reduce((min, p) => p.price < min.price ? p : min, prices[0]);
  const mostChanged = prices.reduce((max, p) => Math.abs(p.changePercent) > Math.abs(max.changePercent) ? p : max, prices[0]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <p className="text-xs text-slate-400 mb-1">Average Price</p>
        <p className="font-jetbrains text-xl font-bold text-slate-100">${avgPrice.toFixed(2)}</p>
      </div>
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <p className="text-xs text-slate-400 mb-1">Highest</p>
        <p className="font-jetbrains text-xl font-bold text-emerald-400 flex items-center gap-2">
          {highest.flag} ${highest.price.toFixed(2)}
        </p>
      </div>
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <p className="text-xs text-slate-400 mb-1">Lowest</p>
        <p className="font-jetbrains text-xl font-bold text-red-400 flex items-center gap-2">
          {lowest.flag} ${lowest.price.toFixed(2)}
        </p>
      </div>
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
        <p className="text-xs text-slate-400 mb-1">Most Volatile</p>
        <p className="font-jetbrains text-xl font-bold text-amber-400 flex items-center gap-2">
          {mostChanged.flag} {Math.abs(mostChanged.changePercent).toFixed(2)}%
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [prices, setPrices] = useState<OilPrice[]>(initialOilData);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [isPaused, setIsPaused] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const updatePrices = useCallback(() => {
    if (isPaused) return;

    setPrices(prevPrices => {
      const updatedPrices = prevPrices.map(oil => {
        const newPrice = generatePriceMovement(oil.price);
        const change = newPrice - oil.previousPrice;
        const changePercent = (change / oil.previousPrice) * 100;
        const newHistory = [...oil.history.slice(1), newPrice];
        
        return {
          ...oil,
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
    
    setLastUpdate(new Date());
  }, [isPaused]);

  useEffect(() => {
    const interval = setInterval(() => {
      const randomId = prices[Math.floor(Math.random() * prices.length)]?.id;
      setUpdatingId(randomId);
      updatePrices();
      setTimeout(() => setUpdatingId(null), 500);
    }, 3000);

    return () => clearInterval(interval);
  }, [updatePrices, prices]);

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
                  Global Oil Price Monitor
                </h1>
                <p className="text-xs text-slate-400">Live crude oil prices from major markets</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-xs text-slate-400">Last updated</p>
                <p className="font-mono text-sm text-slate-300">
                  {lastUpdate.toLocaleTimeString()}
                </p>
              </div>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isPaused 
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" 
                    : "bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700"
                }`}
              >
                {isPaused ? "▶ Resume" : "⏸ Pause"}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Ticker */}
      <Ticker prices={prices} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Summary */}
        <StatsSummary prices={prices} />

        {/* Price Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {prices.map((oil) => (
            <PriceCard 
              key={oil.id} 
              oil={oil} 
              isUpdating={updatingId === oil.id}
            />
          ))}
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-6 border-t border-slate-700/50 text-center">
          <p className="text-xs text-slate-500">
            Prices are simulated for demonstration purposes. Data updates every 3 seconds.
          </p>
          <p className="text-xs text-slate-600 mt-2">
            © 2026 Global Oil Price Monitor
          </p>
        </footer>
      </div>

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
      `}</style>
    </main>
  );
}
