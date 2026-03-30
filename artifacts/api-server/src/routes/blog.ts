import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { blogPostsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth-middleware.js";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const posts = await db.select().from(blogPostsTable)
      .where(eq(blogPostsTable.published, true))
      .orderBy(desc(blogPostsTable.createdAt))
      .limit(limit)
      .offset(offset);

    const allPosts = await db.select().from(blogPostsTable).where(eq(blogPostsTable.published, true));
    const total = allPosts.length;

    res.json({ posts, total, page, limit });
  } catch (err) {
    req.log.error({ err }, "Get blog posts error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [post] = await db.select().from(blogPostsTable).where(eq(blogPostsTable.id, id));
    if (!post) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(post);
  } catch (err) {
    req.log.error({ err }, "Get blog post error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAdmin as any, async (req, res) => {
  try {
    const [post] = await db.insert(blogPostsTable).values(req.body).returning();
    res.status(201).json(post);
  } catch (err) {
    req.log.error({ err }, "Create blog post error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
