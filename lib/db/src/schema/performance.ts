import { pgTable, text, serial, timestamp, integer, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const performanceEntriesTable = pgTable("performance_entries", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").notNull(),
  weight: real("weight").notNull(),
  bmi: real("bmi"),
  bodyFat: real("body_fat"),
  muscleMass: real("muscle_mass"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPerformanceEntrySchema = createInsertSchema(performanceEntriesTable).omit({ id: true, createdAt: true });
export type InsertPerformanceEntry = z.infer<typeof insertPerformanceEntrySchema>;
export type PerformanceEntry = typeof performanceEntriesTable.$inferSelect;
