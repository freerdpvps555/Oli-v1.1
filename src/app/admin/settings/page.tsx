"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [updateInterval, setUpdateInterval] = useState(3);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    localStorage.setItem("oilPriceUpdateInterval", updateInterval.toString());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">ตั้งค่าระบบ</h1>
      
      {/* Update Interval Settings */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">การตั้งค่าอัปเดตราคา</h2>
        
        <div className="mb-4">
          <label className="block text-slate-400 text-sm mb-2">ช่วงเวลาอัปเดต (วินาที)</label>
          <select
            value={updateInterval}
            onChange={(e) => setUpdateInterval(Number(e.target.value))}
            className="w-full md:w-64 px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-amber-500"
          >
            <option value={1}>1 วินาที</option>
            <option value={2}>2 วินาที</option>
            <option value={3}>3 วินาที</option>
            <option value={5}>5 วินาที</option>
            <option value={10}>10 วินาที</option>
            <option value={30}>30 วินาที</option>
            <option value={60}>1 นาที</option>
          </select>
        </div>
        
        <button
          onClick={handleSave}
          className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold py-2 px-6 rounded transition-colors"
        >
          {saved ? "บันทึกแล้ว ✓" : "บันทึก"}
        </button>
      </div>

      {/* Profile Settings */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">ข้อมูลโปรไฟล์</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">ชื่อผู้ใช้</label>
            <div className="text-white font-medium">admin</div>
          </div>
          
          <div>
            <label className="block text-slate-400 text-sm mb-2">สิทธิ์</label>
            <div className="text-amber-500 font-medium">ผู้ดูแลระบบ</div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">ข้อมูลระบบ</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">เวอร์ชันแอปพลิเคชัน</label>
            <div className="text-white">1.0.0</div>
          </div>
          
          <div>
            <label className="block text-slate-400 text-sm mb-2">สถานะ</label>
            <div className="text-emerald-400 font-medium">ปกติ</div>
          </div>
          
          <div>
            <label className="block text-slate-400 text-sm mb-2">จำนวนตลาด</label>
            <div className="text-white">11</div>
          </div>
          
          <div>
            <label className="block text-slate-400 text-sm mb-2">ประเทศไทย</label>
            <div className="text-white">🇹🇭 รวมอยู่ในราคาน้ำมัน</div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">ความช่วยเหลือ</h2>
        
        <div className="text-slate-400 text-sm space-y-2">
          <p>• กดปุ่ม &quot;ออกจากระบบ&quot; เพื่อออกจากระบบ</p>
          <p>• ข้อมูลราคาน้ำมันจะอัปเดตอัตโนมัติตามช่วงเวลาที่ตั้งไว้</p>
          <p>• ติดต่อผู้ดูแลระบบหากต้องการความช่วยเหลือ</p>
        </div>
      </div>
    </div>
  );
}
