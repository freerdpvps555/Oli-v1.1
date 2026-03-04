"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/lib/app-context";

export default function SettingsPage() {
  const router = useRouter();
  const { t, language, setLanguage, currency, setCurrency } = useApp();
  const [updateInterval, setUpdateInterval] = useState(3);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);

  const handleSave = () => {
    localStorage.setItem("oilPriceUpdateInterval", updateInterval.toString());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">{t.settings}</h1>
      
      {/* Update Interval Settings */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">{t.updateInterval}</h2>
        
        <div className="mb-4">
          <label className="block text-slate-400 text-sm mb-2">{t.updateInterval} ({t.seconds})</label>
          <select
            value={updateInterval}
            onChange={(e) => setUpdateInterval(Number(e.target.value))}
            className="w-full md:w-64 px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-amber-500"
          >
            <option value={1}>1 {t.second}</option>
            <option value={2}>2 {t.seconds}</option>
            <option value={3}>3 {t.seconds}</option>
            <option value={5}>5 {t.seconds}</option>
            <option value={10}>10 {t.seconds}</option>
            <option value={30}>30 {t.seconds}</option>
            <option value={60}>1 {t.minute}</option>
          </select>
        </div>
        
        <button
          onClick={handleSave}
          className="bg-amber-500 hover:bg-amber-600 text-gray-900 font-semibold py-2 px-6 rounded transition-colors"
        >
          {saved ? t.saved : t.save}
        </button>
      </div>

      {/* Language & Currency Settings */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">{t.language} & {t.currency}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">{t.language}</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as any)}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-amber-500"
            >
              <option value="th">ไทย</option>
              <option value="en">English</option>
              <option value="zh">中文</option>
              <option value="ar">العربية</option>
              <option value="ja">日本語</option>
              <option value="ko">한국어</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
          
          <div>
            <label className="block text-slate-400 text-sm mb-2">{t.currency}</label>
            <select
              value={currency.code}
              onChange={(e) => {
                const found = [
                  { code: 'USD', symbol: '$', name: 'US Dollar', rate: 1 },
                  { code: 'THB', symbol: '฿', name: 'Thai Baht', rate: 35.5 },
                  { code: 'EUR', symbol: '€', name: 'Euro', rate: 0.92 },
                  { code: 'GBP', symbol: '£', name: 'British Pound', rate: 0.79 },
                  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rate: 149.5 },
                  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', rate: 7.24 },
                ].find(c => c.code === e.target.value);
                if (found) setCurrency(found as any);
              }}
              className="w-full px-4 py-2 bg-slate-700 border border-slate-600 rounded text-white focus:outline-none focus:border-amber-500"
            >
              <option value="USD">USD - US Dollar</option>
              <option value="THB">THB - Thai Baht</option>
              <option value="EUR">EUR - Euro</option>
              <option value="GBP">GBP - British Pound</option>
              <option value="JPY">JPY - Japanese Yen</option>
              <option value="CNY">CNY - Chinese Yuan</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">{t.notifications}</h2>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg cursor-pointer">
            <div>
              <p className="text-white font-medium">{t.enableNotifications}</p>
              <p className="text-slate-400 text-sm">รับการแจ้งเตือนเมื่อราคาน้ำมันเปลี่ยนแปลง</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-amber-500' : 'bg-slate-600'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5 ${notifications ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'}`} />
              </div>
            </div>
          </label>

          <label className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg cursor-pointer">
            <div>
              <p className="text-white font-medium">Email Alerts</p>
              <p className="text-slate-400 text-sm">รับการแจ้งเตือนทางอีเมล</p>
            </div>
            <div className="relative">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="sr-only"
              />
              <div className={`w-12 h-6 rounded-full transition-colors ${emailAlerts ? 'bg-amber-500' : 'bg-slate-600'}`}>
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform mt-0.5 ${emailAlerts ? 'translate-x-6 ml-0.5' : 'translate-x-0.5'}`} />
              </div>
            </div>
          </label>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">จัดการข้อมูล</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 border border-slate-600/50 rounded-lg p-4 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            <span>{t.exportData}</span>
          </button>
          
          <button className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-200 border border-slate-600/50 rounded-lg p-4 transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>{t.importData}</span>
          </button>
        </div>
      </div>

      {/* Profile Settings */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">{t.profile}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">{t.username}</label>
            <div className="text-white font-medium">admin</div>
          </div>
          
          <div>
            <label className="block text-slate-400 text-sm mb-2">{t.role}</label>
            <div className="text-amber-500 font-medium">{t.administrator}</div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">{t.systemInfo}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-slate-400 text-sm mb-2">{t.version}</label>
            <div className="text-white">1.0.0</div>
          </div>
          
          <div>
            <label className="block text-slate-400 text-sm mb-2">{t.status}</label>
            <div className="text-emerald-400 font-medium">{t.normal}</div>
          </div>
          
          <div>
            <label className="block text-slate-400 text-sm mb-2">{t.markets}</label>
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
        <h2 className="text-lg font-semibold text-white mb-4">{t.help}</h2>
        
        <div className="text-slate-400 text-sm space-y-2">
          <p>• กดปุ่ม &quot;{t.logout}&quot; เพื่อออกจากระบบ</p>
          <p>• ข้อมูลราคาน้ำมันจะอัปเดตอัตโนมัติตามช่วงเวลาที่ตั้งไว้</p>
          <p>• ติดต่อผู้ดูแลระบบหากต้องการความช่วยเหลือ</p>
        </div>
      </div>
    </div>
  );
}
