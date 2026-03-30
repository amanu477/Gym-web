import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db/schema";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import jwt from "jsonwebtoken";

const router: IRouter = Router();

const JWT_SECRET = process.env.SESSION_SECRET || "elite-fitness-secret-key";

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "elite-salt").digest("hex");
}

function generateToken(userId: number, role: string): string {
  return jwt.sign({ userId, role }, JWT_SECRET, { expiresIn: "7d" });
}

router.post("/register", async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone } = req.body;
    if (!email || !password || !firstName || !lastName) {
      res.status(400).json({ error: "Missing required fields", message: "email, password, firstName, lastName are required" });
      return;
    }

    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (existing.length > 0) {
      res.status(400).json({ error: "Email already in use", message: "An account with this email already exists" });
      return;
    }

    const hashedPassword = hashPassword(password);
    const [user] = await db.insert(usersTable).values({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: phone || null,
      role: "member",
    }).returning();

    const token = generateToken(user.id, user.role);
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (err) {
    req.log.error({ err }, "Register error");
    res.status(500).json({ error: "Internal server error", message: "Failed to register" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Missing credentials", message: "email and password are required" });
      return;
    }

    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));
    if (!user) {
      res.status(401).json({ error: "Invalid credentials", message: "Invalid email or password" });
      return;
    }

    const hashedPassword = hashPassword(password);
    if (user.password !== hashedPassword) {
      res.status(401).json({ error: "Invalid credentials", message: "Invalid email or password" });
      return;
    }

    const token = generateToken(user.id, user.role);
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (err) {
    req.log.error({ err }, "Login error");
    res.status(500).json({ error: "Internal server error", message: "Failed to login" });
  }
});

router.post("/logout", (_req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
});

router.get("/me", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ error: "Unauthorized", message: "No token provided" });
      return;
    }

    const token = authHeader.substring(7);
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role: string };

    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, decoded.userId));
    if (!user) {
      res.status(401).json({ error: "Unauthorized", message: "User not found" });
      return;
    }

    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (err) {
    res.status(401).json({ error: "Unauthorized", message: "Invalid token" });
  }
});

export { generateToken, hashPassword };
export default router;
