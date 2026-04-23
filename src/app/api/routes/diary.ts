import { Router, type IRouter } from "express";
import { eq, and, gte, lte } from "drizzle-orm";
import { db, diaryTable } from "@workspace/db";
import {
  CreateDiaryEntryBody,
  GetDiaryEntriesParams,
  GetDiaryEntriesQueryParams,
  GetDiaryEntriesResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapDiary(d: typeof diaryTable.$inferSelect) {
  return {
    id: d.id,
    caseCode: d.caseCode,
    entryDate: d.entryDate,
    careHours: d.careHours ?? null,
    careActivities: d.careActivities ?? null,
    notes: d.notes ?? null,
    mobility: d.mobility as "independent" | "assisted" | "dependent" | null,
    mood: d.mood as "good" | "moderate" | "poor" | null,
    createdAt: d.createdAt.toISOString(),
  };
}

router.post("/diary", async (req, res): Promise<void> => {
  const body = CreateDiaryEntryBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid diary entry data" });
    return;
  }

  const [inserted] = await db
    .insert(diaryTable)
    .values({
      caseCode: body.data.caseCode,
      entryDate: body.data.entryDate,
      careHours: body.data.careHours ?? null,
      careActivities: body.data.careActivities ?? null,
      notes: body.data.notes ?? null,
      mobility: body.data.mobility ?? null,
      mood: body.data.mood ?? null,
    })
    .returning();

  res.status(201).json(mapDiary(inserted));
});

router.get("/diary/:caseCode", async (req, res): Promise<void> => {
  const params = GetDiaryEntriesParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid case code" });
    return;
  }

  const query = GetDiaryEntriesQueryParams.safeParse(req.query);

  const conditions = [eq(diaryTable.caseCode, params.data.caseCode)];

  if (query.success) {
    if (query.data.date_from) {
      conditions.push(gte(diaryTable.entryDate, query.data.date_from));
    }
    if (query.data.date_to) {
      conditions.push(lte(diaryTable.entryDate, query.data.date_to));
    }
  }

  const results = await db
    .select()
    .from(diaryTable)
    .where(and(...conditions))
    .orderBy(diaryTable.entryDate);

  res.json(GetDiaryEntriesResponse.parse(results.map(mapDiary)));
});

export default router;
