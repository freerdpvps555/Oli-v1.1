"use client";

import { useState, useEffect } from "react";

interface NaturalGasData {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  flag: string;
  price: number;
  previousPrice: number;
  change: number;
  changePercent: number;
  unit: string;
  source: string;
  lastUpdate: string;
}

interface ThaiEnergyData {
  id: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  source: string;
  lastUpdate: string;
}

const initialNaturalGasData: NaturalGasData[] = [
  { id: "henry-hub", name: "Henry Hub", nameEn: "Henry Hub", country: "US", flag: "🇺🇸", price: 2.85, previousPrice: 2.82, change: 0.03, changePercent: 1.06, unit: "USD/MMBtu", source: "EIA", lastUpdate: "2026-03-04" },
  { id: "ttf", name: "TTF", nameEn: "Title Transfer Facility", country: "NL", flag: "🇳🇱", price: 9.45, previousPrice: 9.52, change: -0.07, changePercent: -0.74, unit: "USD/MMBtu", source: "EEX", lastUpdate: "2026-03-04" },
  { id: "jkm", name: "JKM", nameEn: "Japan/Korea Marker", country: "JP", flag: "🇯🇵", price: 10.20, previousPrice: 10.15, change: 0.05, changePercent: 0.49, unit: "USD/MMBtu", source: "Platts", lastUpdate: "2026-03-04" },
];

const initialThaiEnergyData: ThaiEnergyData[] = [
  { id: "lpg-household", name: "LPG (ครัวเรือน)", category: "LPG", price: 385.62, unit: "บาท/ถัง 15 กก.", source: "EPPO", lastUpdate: "2026-03-04" },
  { id: "lpg-vehicle", name: "LPG (ยานพาหนะ)", category: "LPG", price: 21.68, unit: "บาท/กก.", source: "EPPO", lastUpdate: "2026-03-04" },
  { id: "ngv", name: "NGV", category: "ก๊าซธรรมชาติ", price: 15.59, unit: "บาท/กก.", source: "EPPO", lastUpdate: "2026-03-04" },
  { id: "cng", name: "CNG", category: "ก๊าซธรรมชาติ", price: 18.00, unit: "บาท/กก.", source: "EPPO", lastUpdate: "2026-03-04" },
];

export default function NaturalGasPage() {
  const [naturalGasData, setNaturalGasData] = useState<NaturalGasData[]>(initialNaturalGasData);
  const [thaiEnergyData, setThaiEnergyData] = useState<ThaiEnergyData[]>(initialThaiEnergyData);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"global" | "thai">("global");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingItem, setEditingItem] = useState<NaturalGasData | ThaiEnergyData | null>(null);

  // Fetch natural gas data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/natural-gas");
        if (res.ok) {
          const data = await res.json();
          if (data.prices && data.prices.length > 0) {
            setNaturalGasData(data.prices);
          }
        }
      } catch (error) {
        console.error("Failed to fetch natural gas data:", error);
      }
    }
    fetchData();
  }, []);

  // Fetch Thai energy data
  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/thai-energy");
        if (res.ok) {
          const data = await res.json();
          if (data.prices && data.prices.length > 0) {
            setThaiEnergyData(data.prices);
          }
        }
      } catch (error) {
        console.error("Failed to fetch Thai energy data:", error);
      }
    }
    fetchData();
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  const handleEdit = (item: NaturalGasData | ThaiEnergyData) => {
    setEditingItem(item);
    setShowEditModal(true);
  };

  const handleSaveEdit = () => {
    if (!editingItem) return;
    
    if (activeTab === "global") {
      setNaturalGasData(prev => prev.map(item => 
        item.id === editingItem.id ? { ...item, ...editingItem } as NaturalGasData : item
      ));
    } else {
      setThaiEnergyData(prev => prev.map(item => 
        item.id === editingItem.id ? { ...item, ...editingItem } as ThaiEnergyData : item
      ));
    }
    
    setShowEditModal(false);
    setEditingItem(null);
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? "text-emerald-400" : "text-red-400";
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">จัดการราคาก๊าซธรรมชาติและพลังงาน</h1>
          <p className="text-slate-400 text-sm mt-1">จัดการราคาก๊าซธรรมชาติและพลังงานในประเทศไทย</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold py-2 px-4 rounded-lg transition-colors disabled:opacity-50"
        >
          <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          {loading ? "กำลังโหลด..." : "อัปเดตข้อมูล"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("global")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "global"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white"
          }`}
        >
          🌍 ราคาก๊าซธรรมชาติระดับโลก
        </button>
        <button
          onClick={() => setActiveTab("thai")}
          className={`px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "thai"
              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
              : "bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:text-white"
          }`}
        >
          🇹🇭 พลังงานในประเทศไทย
        </button>
      </div>

      {/* Global Natural Gas */}
      {activeTab === "global" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">ราคาเฉลี่ย (Henry Hub)</p>
              <p className="font-jetbrains text-2xl font-bold text-emerald-400">
                ${(naturalGasData.find(d => d.id === "henry-hub")?.price || 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">TTF (ยุโรป)</p>
              <p className="font-jetbrains text-2xl font-bold text-white">
                ${(naturalGasData.find(d => d.id === "ttf")?.price || 0).toFixed(2)}
              </p>
            </div>
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
              <p className="text-xs text-slate-400 mb-1">JKM (เอเชีย)</p>
              <p className="font-jetbrains text-2xl font-bold text-white">
                ${(naturalGasData.find(d => d.id === "jkm")?.price || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Data Table */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ตลาด</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ราคาล่าสุด</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">เปลี่ยนแปลง</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">หน่วย</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">แหล่งข้อมูล</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {naturalGasData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-700/20">
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{item.flag}</span>
                          <div>
                            <p className="text-sm font-medium text-white">{item.name}</p>
                            <p className="text-xs text-slate-400">{item.nameEn}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-jetbrains font-bold text-white">${item.price.toFixed(2)}</span>
                      </td>
                      <td className={`px-4 py-4 font-jetbrains ${getChangeColor(item.change)}`}>
                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)} ({item.changePercent >= 0 ? '+' : ''}{item.changePercent.toFixed(2)}%)
                      </td>
                      <td className="px-4 py-4 text-slate-300 text-sm">{item.unit}</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300">
                          {item.source}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Thai Energy */}
      {activeTab === "thai" && (
        <div className="space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {thaiEnergyData.map((item) => (
              <div key={item.id} className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <p className="text-xs text-slate-400 mb-1">{item.name}</p>
                <p className="font-jetbrains text-2xl font-bold text-white">฿{item.price.toFixed(2)}</p>
                <p className="text-xs text-slate-500 mt-1">{item.unit}</p>
              </div>
            ))}
          </div>

          {/* Data Table */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-700/30">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ประเภทพลังงาน</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">หมวดหมู่</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">ราคา</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">หน่วย</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">แหล่งข้อมูล</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-slate-400 uppercase tracking-wider">จัดการ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/30">
                  {thaiEnergyData.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-700/20">
                      <td className="px-4 py-4">
                        <p className="text-sm font-medium text-white">{item.name}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/20 text-emerald-400">
                          {item.category}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <span className="font-jetbrains font-bold text-white">฿{item.price.toFixed(2)}</span>
                      </td>
                      <td className="px-4 py-4 text-slate-300 text-sm">{item.unit}</td>
                      <td className="px-4 py-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-slate-700/50 text-slate-300">
                          {item.source}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-slate-400 hover:text-emerald-400 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowEditModal(false)} />
          <div className="relative w-full max-w-md bg-slate-800/95 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-6">
            <h2 className="text-xl font-bold text-white mb-4">แก้ไขข้อมูล</h2>
            <form onSubmit={(e) => { e.preventDefault(); handleSaveEdit(); }} className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">ราคา</label>
                <input
                  type="number"
                  step="0.01"
                  value={editingItem.price}
                  onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-slate-700/50 border border-slate-600/50 rounded-lg text-slate-100 focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 px-4 py-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 rounded-lg transition-colors"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-slate-900 font-semibold rounded-lg transition-colors"
                >
                  บันทึก
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
