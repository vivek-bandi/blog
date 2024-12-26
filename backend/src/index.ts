import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "hono/adapter";
import { verify, sign } from "hono/jwt";
import { use } from "hono/jsx";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

app.use("api/v1/blog/*", async (c, next) => {
  //get the header
  //verify the header
  //if header is correct we can proceed
  //if not return 403
  const header = c.req.header("Authorization") || "";
  const token = header.split(" ")[1];
  if (!token) {
    c.status(403);
    return c.json({ error: "Token missing" });
  }
  try {
    const decoded = await verify(token, c.env.JWT_SECRET);
    //@ts-ignore
    c.set("userId", decoded.id);
    await next();
  } catch (error) {
    c.status(403);
    return c.json({ error: "Unauthorized" });
  }
});

app.post("/api/v1/user/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env?.DATABASE_URL,
  }).$extends(withAccelerate());
  const body = await c.req.json();
  try {
    const user = await prisma.user.create({
      data: {
        email: body.email,
        password: body.password,
      },
    });
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
      jwt: token,
    });
  } catch {
    return c.status(403);
  }
});
app.post("/api/v1/user/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password,
      },
    });
    if (!user) {
      c.status(403);
      return c.json({ error: "User not found" });
    }
    const token = await sign({ id: user.id }, c.env.JWT_SECRET);
    return c.json({
      jwt: token,
    });
  } catch {
    return c.status(403);
  }
});
app.post("/api/v1/blog", (c) => {
  return c.text("blog");
});
app.put("/api/v1/blog", (c) => {
  return c.text("p blog");
});

app.get("/api/v1/blog/:id", (c) => {
  return c.text("id");
});
app.get("/api/v1/blog/bulk", (c) => {
  return c.text("bulk");
});

export default app;
