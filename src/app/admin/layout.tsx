import { getSession } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-[#0a0f1a]">
      {/* Header */}
      <header className="bg-slate-900/80 backdrop-blur-sm border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin/dashboard" className="text-xl font-bold text-amber-500">
                แดชบอร์ดแอดมิน
              </Link>
              <nav className="flex space-x-4">
                <Link
                  href="/admin/dashboard"
                  className="text-slate-300 hover:text-amber-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  ภาพรวม
                </Link>
                <Link
                  href="/admin/prices"
                  className="text-slate-300 hover:text-amber-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  ราคาน้ำมัน
                </Link>
                <Link
                  href="/admin/natural-gas"
                  className="text-slate-300 hover:text-emerald-400 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  ก๊าซธรรมชาติ
                </Link>
                <Link
                  href="/admin/users"
                  className="text-slate-300 hover:text-amber-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  ผู้ใช้งาน
                </Link>
                <Link
                  href="/admin/settings"
                  className="text-slate-300 hover:text-amber-500 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  ตั้งค่า
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300 text-sm">สวัสดี, {session.username}</span>
              <Link
                href="/"
                className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm transition-colors"
              >
                หน้าหลัก
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-slate-300 hover:text-red-400 px-3 py-2 rounded-md text-sm transition-colors"
                >
                  ออกจากระบบ
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
