import { db } from "@/db";
import { users, adminProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getSession } from "@/lib/auth";

export default async function SettingsPage() {
  const session = await getSession();
  
  // Get user profile
  let fullName = '-';
  let email = '-';
  
  if (session) {
    const profile = await db.query.adminProfiles.findFirst({
      where: eq(adminProfiles.userId, session.id),
    });
    if (profile) {
      fullName = profile.fullName || '-';
      email = profile.email || '-';
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">ตั้งค่าระบบ</h1>
      
      {/* Profile Settings */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">ข้อมูลโปรไฟล์</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">ชื่อผู้ใช้</label>
            <div className="text-white font-medium">{session?.username || '-'}</div>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">สิทธิ์</label>
            <div className="text-amber-500 font-medium">
              {session?.role === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้งาน'}
            </div>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">ชื่อ-นามสกุล</label>
            <div className="text-white">{fullName}</div>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">อีเมล</label>
            <div className="text-white">{email}</div>
          </div>
        </div>
      </div>

      {/* System Info */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">ข้อมูลระบบ</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-400 text-sm mb-2">เวอร์ชันแอปพลิเคชัน</label>
            <div className="text-white">1.0.0</div>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">สถานะ</label>
            <div className="text-green-500 font-medium">ปกติ</div>
          </div>
          
          <div>
            <label className="block text-gray-400 text-sm mb-2">อัปเดตล่าสุด</label>
            <div className="text-white">
              {new Date().toLocaleString('th-TH')}
            </div>
          </div>
        </div>
      </div>

      {/* Help Section */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <h2 className="text-lg font-semibold text-white mb-4">ความช่วยเหลือ</h2>
        
        <div className="text-gray-400 text-sm space-y-2">
          <p>• กดปุ่ม &quot;ออกจากระบบ&quot; เพื่อออกจากระบบ</p>
          <p>• ข้อมูลราคาน้ำมันจะอัปเดตอัตโนมัติทุก 3 วินาที</p>
          <p>• ติดต่อผู้ดูแลระบบหากต้องการความช่วยเหลือ</p>
        </div>
      </div>
    </div>
  );
}
