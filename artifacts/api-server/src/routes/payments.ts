import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { paymentsTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAuth, AuthRequest } from "../lib/auth-middleware.js";

const router: IRouter = Router();

router.get("/", requireAuth as any, async (req: AuthRequest, res) => {
  try {
    const payments = await db.select().from(paymentsTable)
      .where(eq(paymentsTable.userId, req.userId!))
      .orderBy(desc(paymentsTable.dueDate));
    res.json(payments);
  } catch (err) {
    req.log.error({ err }, "Get payments error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
