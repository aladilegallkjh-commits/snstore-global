import { eq } from "drizzle-orm";
import { categories, orderItems, orders, productVariants, products, storeSettings } from "../drizzle/schema";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.providerId) {
    throw new Error("User providerId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      providerId: user.providerId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.providerId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByProviderId(providerId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.providerId, providerId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getPublishedProducts() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(products).where(eq(products.published, true));
}

export async function getPublishedProductsWithVariants() {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(products).leftJoin(productVariants, eq(products.id, productVariants.productId)).where(eq(products.published, true));
  return rows;
}

export async function createProductVariant(input: typeof productVariants.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  return db.insert(productVariants).values(input);
}

export async function updateProductVariant(id: number, input: Partial<typeof productVariants.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;
  return db.update(productVariants).set(input).where(eq(productVariants.id, id));
}

export async function getStoreSettings() {
  const db = await getDb();
  if (!db) return undefined;
  const rows = await db.select().from(storeSettings).limit(1);
  return rows[0];
}

export async function saveStoreSettings(values: typeof storeSettings.$inferInsert) {
  const db = await getDb();
  if (!db) return undefined;
  const existing = await getStoreSettings();
  if (existing) {
    await db.update(storeSettings).set(values).where(eq(storeSettings.id, existing.id));
    return { ...existing, ...values };
  }
  const result = await db.insert(storeSettings).values({ storeName: values.storeName || "SN Store Global", logoUrl: values.logoUrl, whatsapp: values.whatsapp, instagram: values.instagram, email: values.email, description: values.description, defaultWhatsappMessage: values.defaultWhatsappMessage, defaultWarranty: values.defaultWarranty, stockNotice: values.stockNotice, cpoExplanation: values.cpoExplanation });
  return result;
}

export async function createOrder(input: { customerName?: string; city?: string; state?: string; subtotal: string; items: Array<{ productName: string; variantLabel?: string; quantity: number; unitPrice: string; productId?: number; variantId?: number }> }) {
  const db = await getDb();
  if (!db) return undefined;
  const countRows = await db.select({ id: orders.id }).from(orders);
  const orderNumber = `SN-${String(countRows.length + 1).padStart(6, "0")}`;
  const inserted = await db.insert(orders).values({ orderNumber, customerName: input.customerName, city: input.city, state: input.state, origin: "site", subtotal: input.subtotal, status: "Carrinho" });
  const orderId = Number(inserted[0]?.insertId || 0);
  if (orderId) await db.insert(orderItems).values(input.items.map((item) => ({ orderId, productName: item.productName, variantLabel: item.variantLabel, quantity: item.quantity, unitPrice: item.unitPrice, productId: item.productId, variantId: item.variantId })));
  return { orderNumber, orderId };
}

// TODO: add additional feature queries here as your catalog evolves.
