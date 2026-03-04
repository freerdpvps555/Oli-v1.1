"use client";

import { useApp } from "@/lib/app-context";
import Link from "next/link";

export default function AboutPage() {
  const { t } = useApp();

  return (
    <main className="min-h-screen bg-[#0a0f1a] text-slate-100">
      {/* Header */}
      <header className="border-b border-slate-700/50 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-3">
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
                </div>
              </Link>
            </div>
            <nav className="flex items-center gap-4">
              <Link href="/about" className="text-amber-400 font-medium">{t.about}</Link>
              <Link href="/contact" className="text-slate-300 hover:text-amber-400 transition-colors">{t.contact}</Link>
              <Link href="/faq" className="text-slate-300 hover:text-amber-400 transition-colors">{t.faq}</Link>
              <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-all">
                {t.login}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-slate-100 mb-6">{t.aboutTitle}</h1>
        <p className="text-lg text-slate-300 mb-8">{t.aboutDescription}</p>

        <div className="space-y-6">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-amber-400 mb-3">ราคาน้ำมันจากทั่วโลก</h2>
            <p className="text-slate-300">
              เว็บไซต์ของเรานำเสนอราคาน้ำมันดิบและผลิตภัณฑ์น้ำมันจากตลาดหลักทั่วโลก รวมถึงตลาดในเอเชีย แอฟริกา ยุโรป และอเมริกา
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-amber-400 mb-3">ข้อมูลแบบเรียลไทม์</h2>
            <p className="text-slate-300">
              ราคาน้ำมันจะอัปเดตอัตโนมัติตามช่วงเวลาที่คุณกำหนด ตั้งแต่ 1 วินาทีไปจนถึง 1 นาที
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-amber-400 mb-3">หลายภาษาและสกุลเงิน</h2>
            <p className="text-slate-300">
              รองรับการแสดงผลในหลายภาษา ได้แก่ ไทย อังกฤษ จีน อาหรับ ญี่ปุ่น เกาหลี สเปน และฝรั่งเศส พร้อมทั้งสกุลเงินที่หลากหลาย
            </p>
          </div>

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
            <h2 className="text-xl font-semibold text-amber-400 mb-3">ข้อจำกัด</h2>
            <p className="text-slate-300">
              {t.disclaimer} โปรดใช้ข้อมูลอ้างอิงเท่านั้น ไม่ควรใช้ในการซื้อขายจริง
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 py-6 border-t border-slate-700/50 text-center">
        <p className="text-xs text-slate-500">{t.copyright}</p>
      </footer>
    </main>
  );
}
