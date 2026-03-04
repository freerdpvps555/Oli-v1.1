"use client";

import { useState } from "react";
import { useApp } from "@/lib/app-context";
import Link from "next/link";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between text-left"
      >
        <span className="font-medium text-slate-200">{question}</span>
        <svg
          className={`w-5 h-5 text-amber-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 pb-4">
          <p className="text-slate-400">{answer}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQPage() {
  const { t } = useApp();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    { question: t.question1, answer: t.answer1 },
    { question: t.question2, answer: t.answer2 },
    { question: t.question3, answer: t.answer3 },
    { question: "มีตลาดน้ำมันบ้างไหม?", answer: "มี 11 ตลาดจากทั่วโลก รวมถึง WTI, Brent, Saudi Arabia, Russia, UAE, Korea, Singapore, Nigeria, Brazil, Canada และ Thailand" },
    { question: "ข้อมูลราคาน้ำมันอัปเดล่าสุดเมื่อไหร่?", answer: "ข้อมูลจะอัปเดตอัตโนมัติตามช่วงเวลาที่คุณตั้งไว้ ตั้งแต่ 1 วินาทีไปจนถึง 1 นาที" },
    { question: "สามารถเปลี่ยนภาษาและสกุลเงินได้ไหม?", answer: "ได้ คุณสามารถเปลี่ยนภาษาและสกุลเงินได้จากเมนูในส่วนหัวของเว็บไซต์" },
  ];

  return (
    <main className="min-h-screen bg-[#0a0f1a] text-slate-100">
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
              <Link href="/about" className="text-slate-300 hover:text-amber-400 transition-colors">{t.about}</Link>
              <Link href="/contact" className="text-slate-300 hover:text-amber-400 transition-colors">{t.contact}</Link>
              <Link href="/faq" className="text-amber-400 font-medium">{t.faq}</Link>
              <Link href="/login" className="px-4 py-2 rounded-lg text-sm font-medium bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-all">
                {t.login}
              </Link>
            </nav>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-slate-100 mb-4">{t.faqTitle}</h1>
        <p className="text-lg text-slate-300 mb-8">{t.faqDescription}</p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={openIndex === index}
              onToggle={() => setOpenIndex(openIndex === index ? null : index)}
            />
          ))}
        </div>

        <div className="mt-12 bg-slate-800/50 border border-slate-700/50 rounded-xl p-6 text-center">
          <h2 className="text-xl font-semibold text-slate-200 mb-2">ยังมีคำถามเพิ่มเติม?</h2>
          <p className="text-slate-400 mb-4">หากคุณมีคำถามเพิ่มเติม สามารถติดต่อเราได้</p>
          <Link
            href="/contact"
            className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 font-semibold rounded-lg transition-colors"
          >
            {t.contact}
          </Link>
        </div>
      </div>

      <footer className="mt-12 py-6 border-t border-slate-700/50 text-center">
        <p className="text-xs text-slate-500">{t.copyright}</p>
      </footer>
    </main>
  );
}
