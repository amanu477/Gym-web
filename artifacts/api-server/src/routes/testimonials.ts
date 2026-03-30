import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { testimonialsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const testimonials = await db.select().from(testimonialsTable)
      .where(eq(testimonialsTable.approved, true))
      .orderBy(desc(testimonialsTable.createdAt));
    res.json(testimonials);
  } catch (err) {
    req.log.error({ err }, "Get testimonials error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const [testimonial] = await db.insert(testimonialsTable).values(req.body).returning();
    res.status(201).json(testimonial);
  } catch (err) {
    req.log.error({ err }, "Create testimonial error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
