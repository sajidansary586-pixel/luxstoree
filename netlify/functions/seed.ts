import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { products } from "../../db/schema.js";

export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const count = await db.select().from(products);
  if (count.length > 0) return Response.json({ message: "Already seeded" });

  await db.insert(products).values([
    {
      name: "Luxury Timepiece",
      description: "A premium timepiece crafted with precision engineering and elegant design. Features sapphire crystal glass, Swiss movement, and water resistance up to 100m. The perfect blend of style and functionality for the modern professional.",
      shortDescription: "Swiss movement luxury watch with sapphire crystal glass.",
      price: 15000,
      image: "/placeholder.png",
      category: "Accessories",
      inStock: true,
      featured: true,
    },
    {
      name: "Premium Leather Bag",
      description: "Handcrafted from full-grain Italian leather, this bag combines timeless elegance with modern functionality. Multiple compartments, reinforced stitching, and brass hardware make it a durable companion for daily use.",
      shortDescription: "Full-grain Italian leather bag with brass hardware.",
      price: 8500,
      image: "/placeholder.png",
      category: "Bags",
      inStock: true,
      featured: true,
    },
    {
      name: "Wireless Earbuds Pro",
      description: "Experience crystal-clear audio with active noise cancellation technology. These earbuds deliver 30 hours of battery life, premium sound drivers, and seamless Bluetooth 5.3 connectivity. Perfect for music lovers and professionals.",
      shortDescription: "ANC wireless earbuds with 30hr battery life.",
      price: 4999,
      image: "/placeholder.png",
      category: "Electronics",
      inStock: true,
      featured: false,
    },
    {
      name: "Silk Evening Scarf",
      description: "Pure mulberry silk scarf with hand-rolled edges and exclusive print design. Versatile enough for formal occasions or as a luxurious everyday accessory. Comes in an elegant gift box.",
      shortDescription: "Pure mulberry silk scarf with exclusive design.",
      price: 2200,
      image: "/placeholder.png",
      category: "Accessories",
      inStock: true,
      featured: false,
    },
  ]);

  return Response.json({ message: "Seeded successfully" });
};

export const config: Config = { path: "/api/seed" };
