import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const galleryImagesTable = pgTable("gallery_images", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title").notNull(),
  category: text("category"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertGalleryImageSchema = createInsertSchema(galleryImagesTable).omit({ id: true, createdAt: true });
export type InsertGalleryImage = z.infer<typeof insertGalleryImageSchema>;
export type GalleryImage = typeof galleryImagesTable.$inferSelect;
