import { pgTable, serial, text, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const scoresTable = pgTable("scores", {
  id: serial("id").primaryKey(),
  caseCode: text("case_code").notNull(),
  module: text("module").notNull(),
  trafficLight: text("traffic_light").notNull(),
  scoreValue: real("score_value"),
  resultText: text("result_text"),
  recommendedActions: text("recommended_actions").array(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertScoreSchema = createInsertSchema(scoresTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertScore = z.infer<typeof insertScoreSchema>;
export type Score = typeof scoresTable.$inferSelect;
