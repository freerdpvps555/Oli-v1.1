# Active Context: Global Oil Price Monitor

## Current State

**Project Status**: ✅ Live - Real-time oil price monitoring application with admin panel

## Recently Completed

- [x] Create SPEC.md with detailed requirements
- [x] Implement Global Oil Price Monitor application
- [x] Add real-time price simulation (updates every 3 seconds)
- [x] Style with dark theme using Tailwind CSS 4
- [x] Pass typecheck and lint validation
- [x] Add database support with Drizzle ORM (SQLite)
- [x] Create authentication system (login/logout)
- [x] Create admin dashboard with 3 pages (Dashboard, Prices, Settings)
- [x] Add Thai language support throughout the application
- [x] Fix admin login (use hardcoded credentials instead of database)
- [x] Add Thai oil prices (Thailand) to the market list
- [x] Add ability to change update interval in admin settings
- [x] Add oil news section (mock feed) on main page
- [x] Add refined product prices tab (Gasoline, Diesel, Heating Oil, Jet Fuel, Propane)
- [x] Add clickable detail modal for each crude market (chart + extended stats)
- [x] Improve main page UI (tabs, cards, modal) and fix header login link to use Next.js `Link`
- [x] Add Thailand retail fuel types to refined products (Gasohol 91/95, Benzine 95, Diesel, E20, E85, LPG, NGV)
- [x] Expand Thailand retail fuel list and show Thai retail prices in THB (add Diesel 95, B10, Premium, Premium 95 variants)
- [x] Add real oil news feed via API (`/api/news` using GDELT) and make news cards link to source
- [x] Add optional real WTI/Brent price fetch via API (`/api/prices`, requires `ALPHAVANTAGE_API_KEY`)
- [x] Encrypt admin session cookie payload (AES-256-GCM; uses `SESSION_SECRET`)
- [x] Add multi-language support (Thai, English, Chinese, Arabic, Japanese, Korean, Spanish, French)
- [x] Add multi-currency support (USD, THB, EUR, GBP, JPY, CNY, KRW, INR, SGD, MYR, PHP, IDR)
- [x] Add currency converter component with dropdown selector
- [x] Add language selector dropdown in header
- [x] Add price trend state for UI theme changes
- [x] Add advertisement slots to main page
- [x] Create public About page
- [x] Create public Contact page with form
- [x] Create public FAQ page with accordion
- [x] Enhance admin settings page with language/currency settings, notifications, and data export/import
- [x] Add Thai/International news filter to API and UI with filter buttons
- [x] Add natural gas prices feature with global (Henry Hub, TTF, JKM) and Thai (LPG, NGV, CNG) prices
- [x] Create /api/natural-gas endpoint with EIA data for global natural gas prices
- [x] Create /api/thai-energy endpoint with EPPO data for Thai energy prices
- [x] Add Natural Gas tab to main page with green/emerald theme

## Current Structure

| File/Directory | Purpose | Status |
|----------------|---------|--------|
| `src/app/page.tsx` | Main oil price monitor UI (Thai) | ✅ Complete |
| `src/app/layout.tsx` | Root layout with fonts | ✅ Complete |
| `src/app/globals.css` | Global styles + animations | ✅ Complete |
| `src/app/login/page.tsx` | Admin login page (Thai) | ✅ Complete |
| `src/app/admin/layout.tsx` | Admin layout with navigation | ✅ Complete |
| `src/app/admin/dashboard/page.tsx` | Dashboard overview (Thai) | ✅ Complete |
| `src/app/admin/prices/page.tsx` | Oil prices management (Thai) | ✅ Complete |
| `src/app/admin/settings/page.tsx` | System settings (Thai) | ✅ Complete |
| `src/app/about/page.tsx` | Public about page | ✅ Complete |
| `src/app/contact/page.tsx` | Public contact page | ✅ Complete |
| `src/app/faq/page.tsx` | Public FAQ page | ✅ Complete |
| `src/app/auth/login/page.tsx` | Public login page | ✅ Complete |
| `src/app/auth/register/page.tsx` | Public register page | ✅ Complete |
| `src/app/auth/forgot-password/page.tsx` | Public forgot password page | ✅ Complete |
| `src/app/admin/users/page.tsx` | Admin user management | ✅ Complete |
| `src/app/api/news/route.ts` | News API with real sources | ✅ Complete |
| `src/app/api/prices/route.ts` | Prices API with EIA support | ✅ Complete |
| `src/app/api/natural-gas/route.ts` | Natural Gas API with EIA data | ✅ Complete |
| `src/app/api/thai-energy/route.ts` | Thai Energy API with EPPO data | ✅ Complete |
| `src/lib/auth.ts` | Authentication utilities | ✅ Complete |
| `src/lib/translations.ts` | Multi-language translations | ✅ Complete |
| `src/lib/app-context.tsx` | App context provider | ✅ Complete |
| `src/components/LanguageCurrencySelector.tsx` | Language & currency selectors | ✅ Complete |
| `src/components/Advertisement.tsx` | Advertisement components | ✅ Complete |
| `src/db/schema.ts` | Database schema | ✅ Complete |
| `src/db/seed.ts` | Admin user seed script | ✅ Complete |
| `SPEC.md` | Project specification | ✅ Complete |

## Features Implemented

### Main Page
1. **Real-time Price Updates**: Simulated prices update every 3 seconds (configurable)
2. **11 Oil Markets**: WTI, Brent, Saudi Arabia, Russia, UAE, Korea, Singapore, Nigeria, Brazil, Canada, Thailand
3. **Price Cards**: Show price, change %, 24h range, mini sparkline chart
4. **Ticker**: Scrolling marquee of all prices
5. **Statistics Summary**: Average, highest, lowest, most volatile
6. **Pause/Resume**: Toggle for auto-updates
7. **Login Button**: Link to admin login
8. **Configurable Update Interval**: Change update frequency in admin settings
9. **Oil News**: Real news feed (GDELT) via `/api/news` with clickable source links
10. **Oil Types**: Tabbed view between crude markets and refined products
11. **Market Details**: Click a crude market card to open a detail modal (bigger chart + extra stats)
12. **Thailand Retail Fuels**: Added Thai fuel types to refined products tab (placeholder prices until a provider is wired)
14. **Thailand Retail Pricing (THB)**: Thai retail items display in Thai Baht (฿) with unit labels
13. **Update Interval Selector**: Update interval can be changed from the header (persists to `localStorage`)

### Admin Panel
1. **Login System**: Username/password authentication (hardcoded: admin/admin123)
2. **Dashboard**: Overview statistics, quick action links
3. **Prices**: Market overview with 11 markets including Thailand
4. **Settings**: Profile info, system info, update interval configuration
5. **Protected Routes**: Only logged-in admins can access

### Database Schema
- `users`: Admin users (id, username, password, role)
- `adminProfiles`: User profiles (fullName, email, avatar)
- `oilPrices`: Price records (market, price, change, etc.)
- `priceHistory`: Historical price data

## Design

- Dark theme with amber/gold accent (oil color)
- JetBrains Mono for prices, Outfit for headings
- Responsive grid layout (1-4 columns)
- Smooth animations and hover effects
- Thai language UI throughout

## Default Admin Account

- Username: `admin`
- Password: `admin123`

## Session History

| Date | Changes |
|------|---------|
| 2026-03-03 | Created Global Oil Price Monitor app |
| 2026-03-03 | Added login system and admin dashboard with Thai language |
| 2026-03-03 | Fixed admin login, added Thai oil prices, added update interval settings |
| 2026-03-03 | Added market detail modal, oil news section, refined product prices tab, and improved main UI |
| 2026-03-03 | Added real news API, optional real WTI/Brent API, Thai retail fuel types, and encrypted session cookie |
| 2026-03-03 | Expanded Thai retail fuel list (incl. Diesel 95/B10/Premium) and grouped THB vs USD refined products |
| 2026-03-04 | Added multi-language support (8 languages), multi-currency support, language/currency selectors, advertisement slots, public pages (About, Contact, FAQ), and enhanced admin settings |
| 2026-03-04 | Added real news sources (GDELT, Reuters RSS, EIA), public auth pages (login, register, forgot-password), and admin user management page |
| 2026-03-04 | Added Thai/International news filter to API and UI with filter buttons |
| 2026-03-04 | Added natural gas prices feature with global (Henry Hub, TTF, JKM) and Thai (LPG, NGV, CNG, Electricity) prices |
