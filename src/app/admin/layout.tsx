import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import Link from "next/link";

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
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/admin/dashboard" className="text-xl font-bold text-amber-500">
                แดชบอร์ดแอดมิน
              </Link>
              <nav className="flex space-x-4">
                <Link
                  href="/admin/dashboard"
                  className="text-gray-300 hover:text-amber-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  ภาพรวม
                </Link>
                <Link
                  href="/admin/prices"
                  className="text-gray-300 hover:text-amber-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  ราคาน้ำมัน
                </Link>
                <Link
                  href="/admin/settings"
                  className="text-gray-300 hover:text-amber-500 px-3 py-2 rounded-md text-sm font-medium"
                >
                  ตั้งค่า
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-300 text-sm">สวัสดี, {session.username}</span>
              <Link
                href="/"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm"
              >
                หน้าหลัก
              </Link>
              <form action="/api/auth/logout" method="POST">
                <button
                  type="submit"
                  className="text-gray-300 hover:text-red-400 px-3 py-2 rounded-md text-sm"
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
