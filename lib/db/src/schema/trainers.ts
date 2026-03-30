import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const trainersTable = pgTable("trainers", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  bio: text("bio").notNull(),
  imageUrl: text("image_url"),
  email: text("email"),
  phone: text("phone"),
  experience: integer("experience"),
  certifications: text("certifications").array(),
  rating: real("rating"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTrainerSchema = createInsertSchema(trainersTable).omit({ id: true, createdAt: true });
export type InsertTrainer = z.infer<typeof insertTrainerSchema>;
export type Trainer = typeof trainersTable.$inferSelect;
