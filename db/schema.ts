import { pgTable, serial, text, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: serial().primaryKey(),
  name: text().notNull(),
  description: text().notNull().default(""),
  shortDescription: text("short_description").notNull().default(""),
  price: integer().notNull(),
  image: text().notNull().default("/placeholder.png"),
  category: text().notNull().default("General"),
  inStock: boolean("in_stock").notNull().default(true),
  featured: boolean().notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const orders = pgTable("orders", {
  id: serial().primaryKey(),
  customerName: text("customer_name").notNull(),
  phone: text().notNull(),
  address: text().notNull(),
  pincode: text().notNull(),
  email: text().notNull(),
  items: jsonb().notNull(),
  total: integer().notNull(),
  status: text().notNull().default("pending"),
  paymentRef: text("payment_ref"),
  createdAt: timestamp("created_at").defaultNow(),
});

export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type Order = typeof orders.$inferSelect;
export type NewOrder = typeof orders.$inferInsert;
