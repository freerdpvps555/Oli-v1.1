import { getSession } from "@/lib/auth";
import Link from "next/link";

export default async function DashboardPage() {
  const session = await getSession();

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">ภาพรวมระบบ</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-2">จำนวนตลาด</div>
          <div className="text-3xl font-bold text-amber-500">11</div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-2">ราคาเฉลี่ย</div>
          <div className="text-3xl font-bold text-white">
            $75.64
          </div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-2">ราคาสูงสุด</div>
          <div className="text-3xl font-bold text-emerald-400">
            $83.45
          </div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-2">ราคาต่ำสุด</div>
          <div className="text-3xl font-bold text-red-400">
            $64.80
          </div>
        </div>
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-2">ผู้เข้าชมวันนี้</div>
          <div className="text-2xl font-bold text-white">128</div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-2">อัปเดตล่าสุด</div>
          <div className="text-2xl font-bold text-white">3วินาที</div>
        </div>
        
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-2">สถานะ</div>
          <div className="text-2xl font-bold text-emerald-400">ออนไลน์</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">การดำเนินการด่วน</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <a
            href="/admin/prices"
            className="flex items-center justify-center gap-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-400 border border-amber-500/30 rounded-lg p-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>ดูราคาน้ำมัน</span>
          </a>
          <Link
            href="/admin/settings"
            className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600/50 rounded-lg p-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>ตั้งค่าระบบ</span>
          </Link>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 text-slate-300 border border-slate-600/50 rounded-lg p-4 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>หน้าหลัก</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
