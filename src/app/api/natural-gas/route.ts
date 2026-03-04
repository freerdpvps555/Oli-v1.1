import { NextResponse } from "next/server";

// EIA Natural Gas response types
type EiaNaturalGasResponse = {
  response: {
    data: Array<{
      period?: string;
      value?: number;
      "series-description"?: string;
      "process-name"?: string;
    }>;
  };
};

// Fetch Henry Hub natural gas price from EIA
async function fetchHenryHubPrice(apiKey: string): Promise<{ price: number; previousPrice: number; date: string } | null> {
  try {
    // EIA API v2 - Natural Gas
    // Using the working natural gas endpoint
    const url = `https://api.eia.gov/v2/natural-gas/pri/sum/data/?api_key=${encodeURIComponent(apiKey)}&frequency=daily&data[0]=value&facets[process][]=AWB&facets[series][]=PRFW&sort[0][column]=period&sort[0][direction]=desc&length=2`;
    
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) {
      console.log("EIA Natural Gas API response:", res.status, res.statusText);
      return null;
    }
    
    const json = (await res.json()) as EiaNaturalGasResponse;
    const data = json.response?.data;
    
    if (!data || data.length < 2) return null;
    
    const latest = data[0];
    const previous = data[1];
    
    return {
      price: latest.value || 0,
      previousPrice: previous.value || 0,
      date: latest.period || "",
    };
  } catch (error) {
    console.error("EIA Natural Gas fetch error:", error);
    return null;
  }
}

// Fetch European natural gas (TTF - Title Transfer Facility)
async function fetchTTFPrice(): Promise<{ price: number; previousPrice: number } | null> {
  try {
    // TTF is a European benchmark - we'll simulate based on Henry Hub + transportation costs
    // In production, you'd use Bloomberg, ICE, or other data providers
    // For now, use a reasonable estimate
    const henryHub = await fetchHenryHubPrice(process.env.EIA_API_KEY || "");
    if (henryHub) {
      // TTF typically trades at $2-4 premium over Henry Hub plus transportation
      const premium = 3.0;
      return {
        price: henryHub.price + premium,
        previousPrice: henryHub.previousPrice + premium,
      };
    }
    return null;
  } catch (error) {
    console.error("TTF fetch error:", error);
    return null;
  }
}

// Fetch Asian natural gas (LNG Japan/Korea)
async function fetchAsianLNGPrice(): Promise<{ price: number; previousPrice: number } | null> {
  try {
    // Asian LNG benchmark (JKM - Japan/Korea Marker)
    // In production, use S&P Global Platts, Argus, or similar
    const henryHub = await fetchHenryHubPrice(process.env.EIA_API_KEY || "");
    if (henryHub) {
      // JKM typically trades at higher premium than TTF
      const premium = 5.0;
      return {
        price: henryHub.price + premium,
        previousPrice: henryHub.previousPrice + premium,
      };
    }
    return null;
  } catch (error) {
    console.error("Asian LNG fetch error:", error);
    return null;
  }
}

// Fetch all natural gas prices
async function fetchAllNaturalGasPrices(): Promise<any[]> {
  const apiKey = process.env.EIA_API_KEY;
  const items: any[] = [];
  
  // If we have EIA API key, use it
  if (apiKey) {
    const henryHub = await fetchHenryHubPrice(apiKey);
    const ttf = await fetchTTFPrice();
    const asianLNG = await fetchAsianLNGPrice();
    
    if (henryHub) {
      items.push({
        id: "henry-hub",
        name: "Henry Hub",
        country: "US",
        flag: "🇺🇸",
        type: "Natural Gas",
        price: henryHub.price,
        previousPrice: henryHub.previousPrice,
        unit: "USD/MMBtu",
        source: "EIA",
        credit: "U.S. Energy Information Administration (eia.gov)",
      });
    }
    
    if (ttf) {
      items.push({
        id: "ttf",
        name: "TTF (Netherlands)",
        country: "NL",
        flag: "🇳🇱",
        type: "Natural Gas",
        price: ttf.price,
        previousPrice: ttf.previousPrice,
        unit: "USD/MMBtu",
        source: "Estimated from EIA",
        credit: "Based on EIA Henry Hub data",
      });
    }
    
    if (asianLNG) {
      items.push({
        id: "jkm",
        name: "JKM (Japan/Korea)",
        country: "JP",
        flag: "🇯🇵",
        type: "Natural Gas",
        price: asianLNG.price,
        previousPrice: asianLNG.previousPrice,
        unit: "USD/MMBtu",
        source: "Estimated from EIA",
        credit: "Based on EIA Henry Hub data",
      });
    }
  }
  
  return items;
}

export async function GET() {
  try {
    const items = await fetchAllNaturalGasPrices();
    
    return NextResponse.json({
      items,
      lastUpdate: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Natural Gas API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch natural gas prices" },
      { status: 500 }
    );
  }
}
