import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const adminProfiles = sqliteTable("admin_profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("user_id").notNull().references(() => users.id),
  fullName: text("full_name").notNull(),
  email: text("email"),
  avatar: text("avatar"),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const oilPrices = sqliteTable("oil_prices", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  market: text("market").notNull(),
  price: real("price").notNull(),
  change: real("change").notNull(),
  changePercent: real("change_percent").notNull(),
  high24h: real("high_24h").notNull(),
  low24h: real("low_24h").notNull(),
  volume: real("volume"),
  recordedAt: integer("recorded_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

export const priceHistory = sqliteTable("price_history", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  market: text("market").notNull(),
  price: real("price").notNull(),
  timestamp: integer("timestamp", { mode: "timestamp" }).$defaultFn(() => new Date()),
});
