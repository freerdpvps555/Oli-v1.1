import { NextResponse } from "next/server";

type AlphaVantageCommodityResponse = {
  data?: Array<{ date?: string; value?: string }>;
  error_message?: string;
  Information?: string;
};

async function fetchAlphaVantageCommodity(
  functionName: "WTI" | "BRENT",
  apiKey: string
): Promise<{ latest: number; previous: number } | null> {
  const url = `https://www.alphavantage.co/query?function=${functionName}&interval=daily&apikey=${encodeURIComponent(apiKey)}`;
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) return null;

  const json = (await res.json()) as AlphaVantageCommodityResponse;
  const rows = Array.isArray(json.data) ? json.data : [];
  const latestRow = rows[0];
  const prevRow = rows[1];
  const latest = latestRow?.value ? Number(latestRow.value) : NaN;
  const previous = prevRow?.value ? Number(prevRow.value) : NaN;

  if (!Number.isFinite(latest) || !Number.isFinite(previous)) return null;
  return { latest, previous };
}

export async function GET() {
  try {
    const apiKey = process.env.ALPHAVANTAGE_API_KEY;

    // If no API key is configured, return an empty payload (UI will keep using simulation).
    if (!apiKey) {
      return NextResponse.json({ items: [] });
    }

    const [wti, brent] = await Promise.all([
      fetchAlphaVantageCommodity("WTI", apiKey),
      fetchAlphaVantageCommodity("BRENT", apiKey),
    ]);

    const items = [
      wti
        ? { id: "wti", price: wti.latest, previousPrice: wti.previous }
        : null,
      brent
        ? { id: "brent", price: brent.latest, previousPrice: brent.previous }
        : null,
    ].filter(Boolean);

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Prices fetch error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}

