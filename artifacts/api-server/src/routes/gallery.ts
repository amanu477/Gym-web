import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { galleryImagesTable } from "@workspace/db/schema";
import { desc } from "drizzle-orm";
import { requireAdmin } from "../lib/auth-middleware.js";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const images = await db.select().from(galleryImagesTable).orderBy(desc(galleryImagesTable.createdAt));
    res.json(images);
  } catch (err) {
    req.log.error({ err }, "Get gallery images error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", requireAdmin as any, async (req, res) => {
  try {
    const [image] = await db.insert(galleryImagesTable).values(req.body).returning();
    res.status(201).json(image);
  } catch (err) {
    req.log.error({ err }, "Create gallery image error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
