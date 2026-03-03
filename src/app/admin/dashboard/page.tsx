import { db } from "@/db";
import { oilPrices, priceHistory, users } from "@/db/schema";
import { desc, count, avg, max, min, sql } from "drizzle-orm";

export default async function DashboardPage() {
  // Get oil price statistics
  const priceStats = await db.select({
    count: count(),
    avgPrice: avg(oilPrices.price),
    maxPrice: max(oilPrices.price),
    minPrice: min(oilPrices.price),
    avgChange: avg(oilPrices.changePercent),
  }).from(oilPrices);

  // Get recent prices
  const recentPrices = await db.query.oilPrices.findMany({
    orderBy: [desc(oilPrices.recordedAt)],
    limit: 10,
  });

  // Get total records
  const totalPrices = await db.select({ count: count() }).from(oilPrices);
  const totalHistory = await db.select({ count: count() }).from(priceHistory);
  const totalUsers = await db.select({ count: count() }).from(users);

  const stats = priceStats[0] || { count: 0, avgPrice: 0, maxPrice: 0, minPrice: 0, avgChange: 0 };

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-8">ภาพรวมระบบ</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-gray-400 text-sm mb-2">จำนวนตลาด</div>
          <div className="text-3xl font-bold text-amber-500">{stats.count || 10}</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-gray-400 text-sm mb-2">ราคาเฉลี่ย</div>
          <div className="text-3xl font-bold text-white">
            ${Number(stats.avgPrice || 0).toFixed(2)}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-gray-400 text-sm mb-2">ราคาสูงสุด</div>
          <div className="text-3xl font-bold text-green-500">
            ${Number(stats.maxPrice || 0).toFixed(2)}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-gray-400 text-sm mb-2">ราคาต่ำสุด</div>
          <div className="text-3xl font-bold text-red-500">
            ${Number(stats.minPrice || 0).toFixed(2)}
          </div>
        </div>
      </div>

      {/* Second Row Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-gray-400 text-sm mb-2">บันทึกราคาทั้งหมด</div>
          <div className="text-2xl font-bold text-white">{totalPrices[0]?.count || 0}</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-gray-400 text-sm mb-2">ประวัติราคา</div>
          <div className="text-2xl font-bold text-white">{totalHistory[0]?.count || 0}</div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="text-gray-400 text-sm mb-2">ผู้ใช้งาน</div>
          <div className="text-2xl font-bold text-white">{totalUsers[0]?.count || 0}</div>
        </div>
      </div>

      {/* Recent Prices Table */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">ราคาน้ำมันล่าสุด</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ตลาด</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ราคา</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">เปลี่ยนแปลง</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">สูง/ต่ำ 24ชม.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">เวลา</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {recentPrices.length > 0 ? recentPrices.map((price) => (
                <tr key={price.id} className="hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{price.market}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-white">${price.price.toFixed(2)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${price.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {price.change >= 0 ? '+' : ''}{price.change.toFixed(2)} ({price.changePercent.toFixed(2)}%)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400">
                    ${price.high24h.toFixed(2)} / ${price.low24h.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400 text-sm">
                    {price.recordedAt ? new Date(price.recordedAt).toLocaleString('th-TH') : '-'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                    ยังไม่มีข้อมูลราคา กรุณาเพิ่มข้อมูลราคาน้ำมัน
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
