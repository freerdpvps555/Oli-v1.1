export default async function PricesPage() {
  // Static market data
  const markets = [
    { id: "wti", name: "WTI Crude", country: "US", flag: "🇺🇸", price: 75.42, change: 0.35, changePercent: 0.47, high24h: 76.80, low24h: 74.20 },
    { id: "brent", name: "Brent Crude", country: "UK", flag: "🇬🇧", price: 79.18, change: -0.22, changePercent: -0.28, high24h: 80.50, low24h: 78.10 },
    { id: "saudi", name: "Arab Light", country: "SA", flag: "🇸🇦", price: 82.35, change: 0.15, changePercent: 0.18, high24h: 83.20, low24h: 81.50 },
    { id: "russia", name: "Urals", country: "RU", flag: "🇷🇺", price: 68.90, change: -0.45, changePercent: -0.65, high24h: 70.10, low24h: 67.80 },
    { id: "dubai", name: "Dubai Crude", country: "AE", flag: "🇦🇪", price: 76.55, change: 0.28, changePercent: 0.37, high24h: 77.80, low24h: 75.90 },
    { id: "korea", name: "Korea Import", country: "KR", flag: "🇰🇷", price: 74.20, change: 0.12, changePercent: 0.16, high24h: 75.50, low24h: 73.80 },
    { id: "singapore", name: "Singapore MOPS", country: "SG", flag: "🇸🇬", price: 75.80, change: -0.18, changePercent: -0.24, high24h: 77.00, low24h: 75.20 },
    { id: "nigeria", name: "Bonke Light", country: "NG", flag: "🇳🇬", price: 83.45, change: 0.55, changePercent: 0.66, high24h: 84.80, low24h: 82.50 },
    { id: "brazil", name: "Brazilian Crude", country: "BR", flag: "🇧🇷", price: 71.25, change: -0.32, changePercent: -0.45, high24h: 72.50, low24h: 70.80 },
    { id: "canada", name: "Western Canadian", country: "CA", flag: "🇨🇦", price: 64.80, change: 0.22, changePercent: 0.34, high24h: 66.00, low24h: 64.20 },
    { id: "thailand", name: "Thai Crude Oil", country: "TH", flag: "🇹🇭", price: 72.50, change: 0.18, changePercent: 0.25, high24h: 73.80, low24h: 71.20 },
  ];

  const avgPrice = markets.reduce((sum, m) => sum + m.price, 0) / markets.length;
  const highest = markets.reduce((max, m) => m.price > max.price ? m : max, markets[0]);
  const lowest = markets.reduce((min, m) => m.price < min.price ? m : min, markets[0]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-white">จัดการราคาน้ำมัน</h1>
        <div className="text-slate-400 text-sm">
          ตลาดทั้งหมด: {markets.length} แห่ง
        </div>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-2">ราคาเฉลี่ย</div>
          <div className="text-3xl font-bold text-white">${avgPrice.toFixed(2)}</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-2">สูงสุด</div>
          <div className="text-3xl font-bold text-emerald-400">{highest.flag} ${highest.price.toFixed(2)}</div>
        </div>
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
          <div className="text-slate-400 text-sm mb-2">ต่ำสุด</div>
          <div className="text-3xl font-bold text-red-400">{lowest.flag} ${lowest.price.toFixed(2)}</div>
        </div>
      </div>

      {/* Market Overview */}
      <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-slate-700/50">
          <h2 className="text-lg font-semibold text-white">ภาพรวมตลาด</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">ตลาด</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">ราคาล่าสุด</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">เปลี่ยนแปลง</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">สูงสุด 24ชม.</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">ต่ำสุด 24ชม.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {markets.map((market) => (
                <tr key={market.id} className="hover:bg-slate-700/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{market.flag}</span>
                      <span className="text-white font-medium">{market.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-white font-bold">${market.price.toFixed(2)}</td>
                  <td className={`px-6 py-4 whitespace-nowrap ${market.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {market.change >= 0 ? '+' : ''}{market.change.toFixed(2)} ({market.changePercent >= 0 ? '+' : ''}{market.changePercent.toFixed(2)}%)
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-emerald-400">${market.high24h.toFixed(2)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-red-400">${market.low24h.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
