import { db } from "@/db";
import { oilPrices, priceHistory } from "@/db/schema";
import { desc, gt, and, gte, sql } from "drizzle-orm";

export default async function PricesPage() {
  // Get all prices
  const allPrices = await db.query.oilPrices.findMany({
    orderBy: [desc(oilPrices.recordedAt)],
    limit: 100,
  });

  // Get today's prices
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayPrices = await db.query.oilPrices.findMany({
    where: and(
      gt(oilPrices.recordedAt, today)
    ),
    orderBy: [desc(oilPrices.recordedAt)],
  });

  // Calculate stats
  const markets = [...new Set(allPrices.map(p => p.market))];
  
  const marketStats = markets.map(market => {
    const prices = allPrices.filter(p => p.market === market);
    const latest = prices[0];
    const high24h = Math.max(...prices.slice(0, 24).map(p => p.price));
    const low24h = Math.min(...prices.slice(0, 24).map(p => p.price));
    
    return {
      market,
      latestPrice: latest?.price || 0,
      change: latest?.change || 0,
      changePercent: latest?.changePercent || 0,
      high24h,
      low24h,
      recordCount: prices.length,
    };
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">จัดการราคาน้ำมัน</h1>
        <div className="text-gray-400 text-sm">
          บันทึกวันนี้: {todayPrices.length} รายการ
        </div>
      </div>

      {/* Market Overview */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">ภาพรวมตลาด</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ตลาด</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ราคาล่าสุด</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">เปลี่ยนแปลง</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">สูงสุด 24ชม.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ต่ำสุด 24ชม.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">จำนวนบันทึก</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {marketStats.map((stat) => (
                <tr key={stat.market} className="hover:bg-gray-750">
                  <td className="px-6 py-4 whitespace-nowrap text-white font-medium">{stat.market}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-white font-bold">${stat.latestPrice.toFixed(2)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${stat.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {stat.change >= 0 ? '+' : ''}{stat.change.toFixed(2)} ({stat.changePercent.toFixed(2)}%)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-green-500">${stat.high24h.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-500">${stat.low24h.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-400">{stat.recordCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Records */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-700">
          <h2 className="text-lg font-semibold text-white">ประวัติราคาล่าสุด</h2>
        </div>
        <div className="overflow-x-auto max-h-96">
          <table className="w-full">
            <thead className="bg-gray-700 sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ตลาด</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ราคา</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">เปลี่ยนแปลง</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">สูง/ต่ำ 24ชม.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">ปริมาณการซื้อขาย</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">เวลา</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {allPrices.length > 0 ? allPrices.slice(0, 50).map((price) => (
                <tr key={price.id} className="hover:bg-gray-750">
                  <td className="px-6 py-3 whitespace-nowrap text-white font-medium">{price.market}</td>
                  <td className="px-6 py-3 whitespace-nowrap text-white">${price.price.toFixed(2)}</td>
                  <td className={`px-6 py-3 whitespace-nowrap ${price.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {price.change >= 0 ? '+' : ''}{price.change.toFixed(2)} ({price.changePercent.toFixed(2)}%)
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-400">
                    ${price.high24h.toFixed(2)} / ${price.low24h.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-400">
                    {price.volume ? price.volume.toLocaleString() : '-'}
                  </td>
                  <td className="px-6 py-3 whitespace-nowrap text-gray-400 text-sm">
                    {price.recordedAt ? new Date(price.recordedAt).toLocaleString('th-TH') : '-'}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    ยังไม่มีข้อมูลราคา
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
