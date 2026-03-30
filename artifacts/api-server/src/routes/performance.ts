import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { performanceEntriesTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../lib/auth-middleware.js";

const router: IRouter = Router();

router.get("/", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const entries = await db.select().from(performanceEntriesTable)
      .where(eq(performanceEntriesTable.userId, req.userId!))
      .orderBy(desc(performanceEntriesTable.date));
    res.json(entries);
  } catch (err) {
    req.log.error({ err }, "Get performance entries error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const [entry] = await db.insert(performanceEntriesTable).values({
      ...req.body,
      userId: req.userId!,
      date: new Date(req.body.date),
    }).returning();
    res.status(201).json(entry);
  } catch (err) {
    req.log.error({ err }, "Create performance entry error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
