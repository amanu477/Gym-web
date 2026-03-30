import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { pricingPlansTable } from "@workspace/db/schema";

const router: IRouter = Router();

router.get("/", async (req, res) => {
  try {
    const plans = await db.select().from(pricingPlansTable).orderBy(pricingPlansTable.price);
    res.json(plans);
  } catch (err) {
    req.log.error({ err }, "Get pricing plans error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
