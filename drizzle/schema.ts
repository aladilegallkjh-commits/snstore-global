import { boolean, decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** OAuth identifier (providerId) returned from the OAuth callback. Unique per user. */
  providerId: varchar("providerId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

export const categories = mysqlTable("categories", {
  id: int("id").autoincrement().primaryKey(), name: varchar("name", { length: 120 }).notNull(), slug: varchar("slug", { length: 160 }).notNull().unique(), description: text("description"), createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Category = typeof categories.$inferSelect;

export const products = mysqlTable("products", {
  id: int("id").autoincrement().primaryKey(), categoryId: int("categoryId"), name: varchar("name", { length: 180 }).notNull(), slug: varchar("slug", { length: 200 }).notNull().unique(), description: text("description"), condition: mysqlEnum("condition", ["Novo", "Seminovo", "Acessório"]).notNull(), featured: boolean("featured").default(false).notNull(), published: boolean("published").default(false).notNull(), status: mysqlEnum("status", ["Publicado", "Rascunho", "Esgotado", "Reservado", "Vendido"]).default("Rascunho").notNull(), createdAt: timestamp("createdAt").defaultNow().notNull(), updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type Product = typeof products.$inferSelect;

export const productVariants = mysqlTable("product_variants", {
  id: int("id").autoincrement().primaryKey(), productId: int("productId").notNull(), storage: varchar("storage", { length: 40 }), ram: varchar("ram", { length: 40 }), color: varchar("color", { length: 60 }), simType: varchar("simType", { length: 60 }), price: decimal("price", { precision: 12, scale: 2 }), promotionalPrice: decimal("promotionalPrice", { precision: 12, scale: 2 }), sku: varchar("sku", { length: 100 }).notNull().unique(), stock: int("stock").default(0).notNull(), status: mysqlEnum("status", ["Disponível", "Indisponível", "Reservado", "Vendido", "Sob consulta"]).default("Disponível").notNull(), supplierLot: varchar("supplierLot", { length: 100 }),
});
export type ProductVariant = typeof productVariants.$inferSelect;

export const usedDevices = mysqlTable("used_devices", {
  id: int("id").autoincrement().primaryKey(), productId: int("productId").notNull(), storage: varchar("storage", { length: 40 }), color: varchar("color", { length: 60 }), batteryHealth: int("batteryHealth"), batteryCycles: int("batteryCycles"), price: decimal("price", { precision: 12, scale: 2 }), appleWarrantyUntil: timestamp("appleWarrantyUntil"), storeWarrantyDays: int("storeWarrantyDays").default(90), sku: varchar("sku", { length: 100 }).notNull().unique(), status: mysqlEnum("status", ["Disponível", "Reservado", "Vendido"]).default("Disponível").notNull(),
});
export type UsedDevice = typeof usedDevices.$inferSelect;

export const storeSettings = mysqlTable("store_settings", {
  id: int("id").autoincrement().primaryKey(), storeName: varchar("storeName", { length: 160 }).notNull(), logoUrl: text("logoUrl"), whatsapp: varchar("whatsapp", { length: 30 }), instagram: varchar("instagram", { length: 120 }), email: varchar("email", { length: 320 }), description: text("description"), defaultWhatsappMessage: text("defaultWhatsappMessage"), defaultWarranty: text("defaultWarranty"), stockNotice: text("stockNotice"), cpoExplanation: text("cpoExplanation"), updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type StoreSettings = typeof storeSettings.$inferSelect;

export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(), orderNumber: varchar("orderNumber", { length: 30 }).notNull().unique(), customerName: varchar("customerName", { length: 160 }), city: varchar("city", { length: 100 }), state: varchar("state", { length: 80 }), origin: varchar("origin", { length: 60 }).default("site"), subtotal: decimal("subtotal", { precision: 12, scale: 2 }).notNull(), status: mysqlEnum("status", ["Carrinho", "WhatsApp iniciado", "Em negociação", "Confirmado", "Cancelado", "Concluído"]).default("Carrinho").notNull(), createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export const orderItems = mysqlTable("order_items", {
  id: int("id").autoincrement().primaryKey(), orderId: int("orderId").notNull(), productId: int("productId"), variantId: int("variantId"), productName: varchar("productName", { length: 180 }).notNull(), variantLabel: varchar("variantLabel", { length: 200 }), quantity: int("quantity").notNull(), unitPrice: decimal("unitPrice", { precision: 12, scale: 2 }).notNull(),
});

// TODO: add additional tables as the catalog evolves