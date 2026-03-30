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
import crypto from "crypto";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "elite-salt").digest("hex");
}

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

router.post("/trainers/setup", requireAdmin as any, async (req: AuthRequest, res) => {
  try {
    const { name, specialty, bio, imageUrl, email, phone, experience, certifications, rating, password } = req.body;
    if (!name || !specialty || !bio || !email || !password) {
      res.status(400).json({ error: "name, specialty, bio, email, and password are required" });
      return;
    }

    // Check if email already in use
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing.length > 0) {
      res.status(400).json({ error: "Email already in use" });
      return;
    }

    // Create user account with trainer role
    const nameParts = name.trim().split(" ");
    const firstName = nameParts[0] || name;
    const lastName = nameParts.slice(1).join(" ") || "Trainer";
    const hashedPassword = hashPassword(password);
    const [trainerUser] = await db.insert(usersTable).values({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      role: "trainer",
    }).returning();

    // Create trainer profile linked to user
    const [trainer] = await db.insert(trainersTable).values({
      userId: trainerUser.id,
      name,
      specialty,
      bio,
      imageUrl: imageUrl || null,
      email,
      phone: phone || null,
      experience: experience || null,
      certifications: certifications || [],
      rating: rating || null,
    }).returning();

    res.status(201).json({
      trainer,
      loginEmail: email,
      message: `Trainer account created. Login: ${email} / Password: ${password}`,
    });
  } catch (err) {
    req.log.error({ err }, "Setup trainer error");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.patch("/users/:id/assign-trainer", requireAdmin as any, async (req: AuthRequest, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { trainerId } = req.body;
    if (!trainerId) {
      res.status(400).json({ error: "trainerId is required" });
      return;
    }
    await db.update(usersTable)
      .set({ assignedTrainerId: trainerId })
      .where(eq(usersTable.id, userId));
    res.json({ success: true, message: "Trainer assigned successfully" });
  } catch (err) {
    req.log.error({ err }, "Assign trainer error");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
