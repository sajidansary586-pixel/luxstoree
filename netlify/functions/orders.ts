import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { orders } from "../../db/schema.js";
import { desc } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method === "GET") {
    const all = await db.select().from(orders).orderBy(desc(orders.createdAt));
    return Response.json(all);
  }

  if (req.method === "POST") {
    const body = await req.json();
    const { customerName, phone, address, pincode, email, items, total, paymentRef } = body;
    if (!customerName || !phone || !address || !pincode || !email || !items || !total) {
      return Response.json({ error: "All fields are required" }, { status: 400 });
    }

    const [order] = await db
      .insert(orders)
      .values({ customerName, phone, address, pincode, email, items, total: Number(total), paymentRef })
      .returning();

    // Send email notification via Netlify Forms (hidden form submission)
    const adminEmail = process.env.ADMIN_EMAIL || "";
    const itemsText = Array.isArray(items)
      ? items.map((i: { name: string; price: number; qty: number }) => `${i.name} x${i.qty} = ₹${i.price * i.qty}`).join(", ")
      : JSON.stringify(items);

    // Submit to Netlify Forms for email notification
    try {
      await fetch(`${new URL(req.url).origin}/__forms.html`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          "form-name": "order-notification",
          "order-id": String(order.id),
          "customer-name": customerName,
          phone,
          email,
          address: `${address}, ${pincode}`,
          items: itemsText,
          total: `₹${total}`,
          "payment-ref": paymentRef || "N/A",
        }).toString(),
      });
    } catch (_) {
      // Email notification failure should not fail the order
    }

    return Response.json({ success: true, orderId: order.id }, { status: 201 });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/orders" };
