import { NextResponse } from "next/server";

type GdeltArticle = {
  url?: string;
  title?: string;
  seendate?: string;
  domain?: string;
};

function parseGdeltSeenDate(value: string | undefined): string {
  if (!value) return "";
  // Example: 20260124T050000Z  ->  2026-01-24T05:00:00Z
  const m = value.match(/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z$/);
  if (!m) return value;
  const [, y, mo, d, h, mi, s] = m;
  return `${y}-${mo}-${d}T${h}:${mi}:${s}Z`;
}

export async function GET() {
  try {
    const url =
      "https://api.gdeltproject.org/api/v2/doc/doc" +
      "?query=" +
      encodeURIComponent("oil price OR crude OR diesel Thailand") +
      "&mode=artlist&format=json&maxrecords=10&sort=datedesc";

    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch news" },
        { status: 502 }
      );
    }

    const data = (await res.json()) as { articles?: GdeltArticle[] };
    const articles = (data.articles ?? []).slice(0, 10);

    const items = articles
      .filter((a) => a.title && a.url)
      .map((a, idx) => {
        const iso = parseGdeltSeenDate(a.seendate);
        const seen = iso ? new Date(iso) : null;
        const time = seen
          ? new Intl.DateTimeFormat("th-TH", {
              dateStyle: "medium",
              timeStyle: "short",
            }).format(seen)
          : "";

        const domain = a.domain ? a.domain.replace(/^www\./, "") : "GDELT";
        const tag = /thailand|ไทย/i.test(a.title ?? "") ? "ประเทศไทย" : "ตลาดโลก";

        return {
          id: idx + 1,
          title: a.title ?? "",
          source: domain,
          time,
          tag,
          sentiment: "neutral" as const,
          url: a.url ?? "",
        };
      });

    return NextResponse.json({ items });
  } catch (error) {
    console.error("News fetch error:", error);
    return NextResponse.json(
      { error: "เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์" },
      { status: 500 }
    );
  }
}

