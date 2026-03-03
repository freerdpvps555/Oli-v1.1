# Oil Price Monitor - Specification Document

## 1. Project Overview

**Project Name:** Global Oil Price Monitor  
**Type:** Real-time Web Application  
**Core Functionality:** A live dashboard displaying oil prices from major markets around the world with automatic price updates every few seconds  
**Target Users:** Anyone interested in tracking global oil prices (traders, analysts, general public)

---

## 2. UI/UX Specification

### Layout Structure

**Page Sections:**
1. **Header** - App title, last update timestamp, refresh indicator
2. **Price Ticker** - Scrolling marquee of major oil prices
3. **Main Grid** - Price cards for different countries/markets
4. **Price Chart** - Simple visual representation of price trends (last 24h simulation)
5. **Footer** - Data attribution, disclaimer

**Responsive Breakpoints:**
- Mobile: < 640px (1 column grid)
- Tablet: 640px - 1024px (2 column grid)
- Desktop: > 1024px (3-4 column grid)

### Visual Design

**Color Palette:**
- Background: `#0a0f1a` (deep navy black)
- Card Background: `#111827` (dark slate)
- Card Border: `#1e293b` (slate border)
- Primary Accent: `#f59e0b` (amber/gold - oil color)
- Price Up: `#10b981` (emerald green)
- Price Down: `#ef4444` (red)
- Price Neutral: `#6b7280` (gray)
- Text Primary: `#f8fafc` (near white)
- Text Secondary: `#94a3b8` (slate gray)

**Typography:**
- Font Family: `"JetBrains Mono", "Fira Code", monospace` for prices
- Font Family: `"Outfit", sans-serif` for headings
- Heading (H1): 2.5rem, weight 700
- Card Title: 1.1rem, weight 600
- Price Display: 2rem, weight 700
- Small Text: 0.875rem, weight 400

**Spacing System:**
- Base unit: 4px
- Card padding: 24px
- Grid gap: 20px
- Section margin: 40px

**Visual Effects:**
- Card hover: subtle scale(1.02) + glow effect
- Price change: pulse animation on update
- Smooth color transitions (0.3s ease)
- Subtle gradient overlays on cards

### Components

**1. Header Component**
- App logo/icon (oil drop)
- Title: "Global Oil Price Monitor"
- Live indicator (pulsing dot)
- Last updated timestamp
- Auto-refresh status

**2. Price Card Component**
- Country flag emoji
- Country/Market name
- Current price (per barrel in USD)
- Price change (amount and percentage)
- Direction indicator (↑/↓/→)
- Mini sparkline (7-day trend)
- Timestamp of last update

**3. Ticker Component**
- Horizontal scrolling marquee
- Shows all prices in sequence
- Continuous animation

**4. Statistics Summary**
- Highest price
- Lowest price
- Average price
- Most changed

---

## 3. Functionality Specification

### Core Features

**Real-time Price Updates:**
- Simulated real-time updates every 3 seconds
- Random price fluctuation: ±0.1% to ±2% per update
- Visual indicator when price updates
- Smooth number transitions

**Supported Markets:**
1. 🇺🇸 United States (WTI Crude)
2. 🇬🇧 United Kingdom (Brent Crude)
3. 🇸🇦 Saudi Arabia (Arab Light)
4. 🇷🇺 Russia (Urals)
5. 🇦🇪 UAE (Dubai Crude)
6. 🇰🇷 South Korea (Dubai Reference)
7. 🇸🇬 Singapore (Singapore Reference)
8. 🇳🇬 Nigeria (Bonke Light)
9. 🇧🇷 Brazil (Brazilian Crude)
10. 🇨🇦 Canada (Western Canadian Select)

**Initial Price Ranges (USD per barrel):**
- WTI: $72-$78
- Brent: $75-$82
- Other crudes: $65-$90 (varied)

**Data Display:**
- Price in USD per barrel
- Daily change (USD and %)
- Color coding: green (up), red (down), gray (unchanged)
- 24-hour high/low

### User Interactions
- Hover on card: shows detailed info tooltip
- Auto-refresh toggle (pause/resume updates)
- Click on card: expands for more details (optional)

### Edge Cases
- Handle negative price changes
- Handle extreme price movements (circuit breaker visual)
- Graceful loading states
- Error state if data unavailable

---

## 4. Acceptance Criteria

1. ✅ Page loads without errors
2. ✅ All 10 oil prices displayed with country flags
3. ✅ Prices update automatically every 3 seconds
4. ✅ Price changes show correct color coding (green/red/gray)
5. ✅ Responsive layout works on mobile/tablet/desktop
6. ✅ Ticker scrolls smoothly across screen
7. ✅ Visual feedback on price updates (pulse animation)
8. ✅ Last updated timestamp displays correctly
9. ✅ Dark theme applied consistently
10. ✅ No console errors during operation

---

## 5. Technical Implementation

**Framework:** Next.js 16 (App Router)  
**Styling:** Tailwind CSS 4  
**Fonts:** Google Fonts (Outfit, JetBrains Mono)  
**State Management:** React useState/useEffect  
**Data:** Simulated real-time with realistic price movements  
