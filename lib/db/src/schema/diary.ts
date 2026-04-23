import { pgTable, serial, text, timestamp, real, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const diaryTable = pgTable("diary_entries", {
  id: serial("id").primaryKey(),
  caseCode: text("case_code").notNull(),
  entryDate: date("entry_date").notNull(),
  careHours: real("care_hours"),
  careActivities: text("care_activities").array(),
  notes: text("notes"),
  mobility: text("mobility"),
  mood: text("mood"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertDiarySchema = createInsertSchema(diaryTable).omit({ id: true, createdAt: true });
export type InsertDiary = z.infer<typeof insertDiarySchema>;
export type DiaryEntry = typeof diaryTable.$inferSelect;
