import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { products } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method === "GET") {
    const all = await db.select().from(products).orderBy(products.createdAt);
    return Response.json(all);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { name, description, shortDescription, price, image, category, inStock, featured } = body;
    if (!name || !price) {
      return Response.json({ error: "name and price are required" }, { status: 400 });
    }
    const [product] = await db
      .insert(products)
      .values({ name, description, shortDescription, price: Number(price), image, category, inStock: inStock ?? true, featured: featured ?? false })
      .returning();
    return Response.json(product, { status: 201 });
  }

  if (req.method === "DELETE") {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return Response.json({ error: "id required" }, { status: 400 });
    await db.delete(products).where(eq(products.id, Number(id)));
    return Response.json({ success: true });
  }

  if (req.method === "PATCH") {
    const url = new URL(req.url);
    const id = url.searchParams.get("id");
    if (!id) return Response.json({ error: "id required" }, { status: 400 });
    const body = await req.json();
    const { name, description, shortDescription, price, image, category, inStock, featured } = body;
    const [updated] = await db
      .update(products)
      .set({ name, description, shortDescription, price: price ? Number(price) : undefined, image, category, inStock, featured })
      .where(eq(products.id, Number(id)))
      .returning();
    return Response.json(updated);
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/products" };
