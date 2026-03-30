import { pgTable, text, serial, timestamp, real, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const pricingPlansTable = pgTable("pricing_plans", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  price: real("price").notNull(),
  period: text("period").notNull().default("month"),
  description: text("description"),
  features: text("features").array(),
  highlighted: boolean("highlighted").default(false),
  color: text("color"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPricingPlanSchema = createInsertSchema(pricingPlansTable).omit({ id: true, createdAt: true });
export type InsertPricingPlan = z.infer<typeof insertPricingPlanSchema>;
export type PricingPlan = typeof pricingPlansTable.$inferSelect;
