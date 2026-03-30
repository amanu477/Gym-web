import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { contactMessagesTable } from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin, AuthRequest } from "../lib/auth-middleware.js";

const router: IRouter = Router();

router.post("/", async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    await db.insert(contactMessagesTable).values({ name, email, phone, subject, message });
    res.json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    req.log.error({ err }, "Send contact message error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/trainer/:trainerId", async (req, res) => {
  try {
    const trainerId = parseInt(req.params.trainerId);
    const { name, email, phone, subject, message } = req.body;
    if (!name || !email || !message) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }
    await db.insert(contactMessagesTable).values({ name, email, phone, subject, message, trainerId });
    res.json({ success: true, message: "Message sent to trainer successfully" });
  } catch (err) {
    req.log.error({ err }, "Contact trainer error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/messages", requireAdmin as any, async (req: AuthRequest, res) => {
  try {
    const messages = await db.select().from(contactMessagesTable).orderBy(desc(contactMessagesTable.createdAt));
    res.json(messages);
  } catch (err) {
    req.log.error({ err }, "Get contact messages error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
