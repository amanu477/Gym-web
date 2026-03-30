import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { trainersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import { requireAdmin } from "../lib/auth-middleware.js";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const trainers = await db.select().from(trainersTable).orderBy(trainersTable.id);
    res.json(trainers);
  } catch (err) {
    req.log.error({ err }, "Get trainers error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const [trainer] = await db.select().from(trainersTable).where(eq(trainersTable.id, id));
    if (!trainer) {
      res.status(404).json({ error: "Not found" });
      return;
    }
    res.json(trainer);
  } catch (err) {
    req.log.error({ err }, "Get trainer error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAdmin as any, async (req, res) => {
  try {
    const [trainer] = await db.insert(trainersTable).values(req.body).returning();
    res.status(201).json(trainer);
  } catch (err) {
    req.log.error({ err }, "Create trainer error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
