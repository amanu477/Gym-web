import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { trainersTable, usersTable, blogPostsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../lib/auth-middleware.js";

const router: IRouter = Router();

function requireTrainer(req: AuthRequest, res: any, next: any) {
  requireAuth(req, res, () => {
    if (req.userRole !== "trainer" && req.userRole !== "admin") {
      res.status(403).json({ error: "Forbidden", message: "Trainer access required" });
      return;
    }
    next();
  });
}

router.get("/stats", requireTrainer as any, async (req: AuthRequest, res) => {
  try {
    const [trainer] = await db.select().from(trainersTable).where(eq(trainersTable.userId, req.userId!));
    if (!trainer) {
      res.status(404).json({ error: "Trainer profile not found" });
      return;
    }
    const assignedMembers = await db.select().from(usersTable).where(eq(usersTable.assignedTrainerId, trainer.id));
    const blogPosts = await db.select().from(blogPostsTable).where(eq(blogPostsTable.author, trainer.name));
    res.json({
      assignedMembers: assignedMembers.length,
      totalBlogPosts: blogPosts.length,
      trainerName: trainer.name,
      specialty: trainer.specialty,
    });
  } catch (err) {
    req.log.error({ err }, "Trainer stats error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/members", requireTrainer as any, async (req: AuthRequest, res) => {
  try {
    const [trainer] = await db.select().from(trainersTable).where(eq(trainersTable.userId, req.userId!));
    if (!trainer) {
      res.status(404).json({ error: "Trainer profile not found" });
      return;
    }
    const members = await db.select().from(usersTable).where(eq(usersTable.assignedTrainerId, trainer.id));
    const sanitized = members.map(({ password, ...m }) => m);
    res.json(sanitized);
  } catch (err) {
    req.log.error({ err }, "Trainer members error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/blog", requireTrainer as any, async (req: AuthRequest, res) => {
  try {
    const [trainer] = await db.select().from(trainersTable).where(eq(trainersTable.userId, req.userId!));
    if (!trainer) {
      res.status(404).json({ error: "Trainer profile not found" });
      return;
    }
    const { title, excerpt, content, imageUrl, category } = req.body;
    if (!title || !excerpt || !content) {
      res.status(400).json({ error: "title, excerpt, and content are required" });
      return;
    }
    const [post] = await db.insert(blogPostsTable).values({
      title,
      excerpt,
      content,
      imageUrl: imageUrl || null,
      category: category || "Training",
      author: trainer.name,
      published: true,
    }).returning();
    res.status(201).json(post);
  } catch (err) {
    req.log.error({ err }, "Trainer blog post error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
