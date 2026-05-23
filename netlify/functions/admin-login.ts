import type { Config } from "@netlify/functions";

export default async (req: Request) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const body = await req.json();
  const { password } = body;
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";

  if (password !== adminPassword) {
    return Response.json({ error: "Invalid password" }, { status: 401 });
  }

  const token = Buffer.from(`admin:${Date.now()}:${adminPassword}`).toString("base64");
  return Response.json({ token });
};

export const config: Config = { path: "/api/admin/login" };
