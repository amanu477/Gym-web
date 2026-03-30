import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import {
  usersTable,
  trainersTable,
  blogPostsTable,
  paymentsTable,
  contactMessagesTable,
} from "@workspace/db/schema";
import { eq, desc } from "drizzle-orm";
import { requireAdmin, AuthRequest } from "../lib/auth-middleware.js";

const router: IRouter = Router();

router.get("/stats", requireAdmin as any, async (req: AuthRequest, res) => {
  try {
    const users = await db.select().from(usersTable);
    const trainers = await db.select().from(trainersTable);
    const blogPosts = await db.select().from(blogPostsTable);
    const payments = await db.select().from(paymentsTable);
    const messages = await db.select().from(contactMessagesTable);

    const now = new Date();
    const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const newMembersThisMonth = users.filter(
      (u) => u.createdAt && new Date(u.createdAt) >= firstOfMonth
    ).length;

    const totalRevenue = payments
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + (p.amount || 0), 0);

    const pendingPayments = payments.filter((p) => p.status === "pending" || p.status === "overdue").length;
    const unreadMessages = messages.filter((m) => !m.read).length;

    res.json({
      totalMembers: users.length,
      activeMembers: users.filter((u) => u.role === "member").length,
      totalRevenue,
      pendingPayments,
      totalTrainers: trainers.length,
      totalBlogPosts: blogPosts.filter((p) => p.published).length,
      unreadMessages,
      newMembersThisMonth,
    });
  } catch (err) {
    req.log.error({ err }, "Get admin stats error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/users", requireAdmin as any, async (req: AuthRequest, res) => {
  try {
    const users = await db.select().from(usersTable).orderBy(desc(usersTable.createdAt));
    const sanitized = users.map(({ password, ...u }) => u);
    res.json(sanitized);
  } catch (err) {
    req.log.error({ err }, "Get admin users error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/contact-messages", requireAdmin as any, async (req: AuthRequest, res) => {
  try {
    const messages = await db.select().from(contactMessagesTable).orderBy(desc(contactMessagesTable.createdAt));
    res.json(messages);
  } catch (err) {
    req.log.error({ err }, "Get contact messages error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
