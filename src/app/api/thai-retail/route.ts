import { NextResponse } from "next/server";

type ThaiRetailPriceItem = {
  id: string;
  name: string;
  price: number;
  unitLabel: string;
  currencySymbol: "฿";
  brand: string;
};

type ThaiRetailResponse = {
  asOf: string;
  brands: Array<{
    brand: string;
    items: ThaiRetailPriceItem[];
    note?: string;
    sourceUrl: string;
  }>;
};

const THB: ThaiRetailPriceItem["currencySymbol"] = "฿";

function toNumber(value: unknown): number | null {
  const n = typeof value === "number" ? value : Number(String(value).trim());
  if (!Number.isFinite(n)) return null;
  return Math.round(n * 100) / 100;
}

function normalizeThaiId(name: string): string {
  const n = name.toLowerCase();
  if (/(premium).*diesel|hi\s*premium\s*diesel|ไฮพรีเมียมดีเซล|ดีเซลพรีเมียม/.test(n)) return "diesel-premium";
  if (/diesel|ดีเซล/.test(n)) return "diesel";
  if (/gasohol\s*e85|\be85\b|แก๊สโซฮอล์\s*e85/.test(n)) return "gasohol-e85";
  if (/gasohol\s*e20|\be20\b|แก๊สโซฮอล์\s*e20/.test(n)) return "gasohol-e20";
  if (/gasohol\s*91|แก๊สโซฮอล์\s*91/.test(n)) return "gasohol-91";
  if (/gasohol\s*95|แก๊สโซฮอล์\s*95/.test(n)) return "gasohol-95";
  if (/gasoline\s*95|เบนซิน\s*95|gasoline/.test(n)) return "gasoline-95";

  return `other-${n
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40)}`;
}

async function fetchBangchak(): Promise<ThaiRetailResponse["brands"][number] | null> {
  const sourceUrl = "https://oil-price.bangchak.co.th/ApiOilPrice2/th";
  const res = await fetch(sourceUrl, {
    cache: "no-store",
    headers: {
      accept: "application/json",
      "user-agent": "GlobalOilPriceMonitor/1.0",
    },
  });
  if (!res.ok) return null;

  const json = (await res.json()) as Array<{
    OilRemark?: string;
    OilRemark2?: string;
    OilPriceDate?: string;
    OilPriceTime?: string;
    OilList?: string;
  }>;

  const root = Array.isArray(json) && json.length > 0 ? json[0] : null;
  if (!root?.OilList) return null;

  let list: Array<{ OilName?: string; PriceToday?: unknown }> = [];
  try {
    const parsed = JSON.parse(root.OilList);
    if (Array.isArray(parsed)) list = parsed;
  } catch {
    // ignore
  }

  const items: ThaiRetailPriceItem[] = list
    .map((row) => {
      const name = String(row.OilName ?? "").trim();
      const price = toNumber(row.PriceToday);
      if (!name || price == null) return null;

      return {
        id: normalizeThaiId(name),
        name,
        price,
        currencySymbol: THB,
        unitLabel: "บาท/ลิตร",
        brand: "Bangchak",
      };
    })
    .filter((x): x is ThaiRetailPriceItem => Boolean(x));

  const noteParts = [root.OilRemark, root.OilRemark2].filter(Boolean);

  return {
    brand: "Bangchak",
    items,
    note: noteParts.length > 0 ? noteParts.join(" ") : undefined,
    sourceUrl,
  };
}

async function fetchPttStation(): Promise<ThaiRetailResponse["brands"][number] | null> {
  const sourceUrl = "https://www.pttor.com/oilprice-board-aspx";
  const res = await fetch(sourceUrl, {
    cache: "no-store",
    headers: {
      accept: "text/html",
      "user-agent": "GlobalOilPriceMonitor/1.0",
    },
  });
  if (!res.ok) return null;

  const html = await res.text();

  // The page includes repeated blocks like:
  // <img ... alt="Diesel" ...>
  // ... <div class="oil-price"> 29.94 </div>
  const blocks = html.split('class="oil-board"');
  if (blocks.length <= 1) return null;

  const items: ThaiRetailPriceItem[] = [];

  for (const block of blocks.slice(1, 30)) {
    const altMatch = block.match(/alt="([^"]+)"/i);
    const priceMatch = block.match(
      /class="oil-price"[^>]*>\s*([0-9]+(?:\.[0-9]{1,2})?)\s*</i
    );

    const name = altMatch?.[1]?.trim();
    const price = priceMatch?.[1] ? toNumber(priceMatch[1]) : null;
    if (!name || price == null) continue;

    items.push({
      id: normalizeThaiId(name),
      name,
      price,
      currencySymbol: THB,
      unitLabel: "บาท/ลิตร",
      brand: "PTT Station",
    });
  }

  if (items.length === 0) return null;

  const noteMatch = html.match(/<div class="oil-desc">\s*([^<]+)\s*<\/div>/i);
  const note = noteMatch?.[1]?.trim();

  return {
    brand: "PTT Station",
    items,
    note,
    sourceUrl,
  };
}

export async function GET() {
  try {
    const [ptt, bangchak] = await Promise.all([fetchPttStation(), fetchBangchak()]);
    const brands = [ptt, bangchak].filter(Boolean) as ThaiRetailResponse["brands"];

    const payload: ThaiRetailResponse = {
      asOf: new Date().toISOString(),
      brands,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Thai retail fetch error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}

