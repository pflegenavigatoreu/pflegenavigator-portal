import { pgTable, serial, text, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const answersTable = pgTable("answers", {
  id: serial("id").primaryKey(),
  caseCode: text("case_code").notNull(),
  module: text("module").notNull(),
  questionKey: text("question_key").notNull(),
  answerValue: text("answer_value").notNull(),
  answerJson: jsonb("answer_json"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAnswerSchema = createInsertSchema(answersTable).omit({ id: true, createdAt: true, updatedAt: true });
export type InsertAnswer = z.infer<typeof insertAnswerSchema>;
export type Answer = typeof answersTable.$inferSelect;
