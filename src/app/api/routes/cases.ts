import { Router, type IRouter } from "express";
import { eq, sql } from "drizzle-orm";
import { db, casesTable, answersTable, scoresTable, diaryTable, feedbackTable } from "@workspace/db";
import {
  CreateCaseBody,
  GetCaseParams,
  GetCaseResponse,
  GetExportDataParams,
  GetExportDataResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateCaseCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const rand = (n: number) => Array.from({ length: n }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `PF-${rand(4)}-${rand(4)}`;
}

function mapCase(c: typeof casesTable.$inferSelect) {
  return {
    id: c.id,
    caseCode: c.caseCode,
    entryModule: c.entryModule ?? null,
    status: c.status as "active" | "completed" | "archived",
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
  };
}

router.post("/cases", async (req, res): Promise<void> => {
  const parsed = CreateCaseBody.safeParse(req.body ?? {});
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request" });
    return;
  }

  let caseCode = generateCaseCode();
  let attempts = 0;
  while (attempts < 10) {
    const existing = await db.select().from(casesTable).where(eq(casesTable.caseCode, caseCode));
    if (existing.length === 0) break;
    caseCode = generateCaseCode();
    attempts++;
  }

  const [newCase] = await db.insert(casesTable).values({
    caseCode,
    entryModule: parsed.data.entryModule ?? null,
    status: "active",
  }).returning();

  res.status(201).json(mapCase(newCase));
});

router.get("/cases/:caseCode", async (req, res): Promise<void> => {
  const params = GetCaseParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid case code" });
    return;
  }

  const [found] = await db.select().from(casesTable).where(eq(casesTable.caseCode, params.data.caseCode));
  if (!found) {
    res.status(404).json({ error: "Case not found" });
    return;
  }

  res.json(GetCaseResponse.parse(mapCase(found)));
});

router.get("/cases/:caseCode/export", async (req, res): Promise<void> => {
  const params = GetExportDataParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid case code" });
    return;
  }

  const { caseCode } = params.data;

  const [found] = await db.select().from(casesTable).where(eq(casesTable.caseCode, caseCode));
  if (!found) {
    res.status(404).json({ error: "Case not found" });
    return;
  }

  const answers = await db.select().from(answersTable).where(eq(answersTable.caseCode, caseCode));
  const scores = await db.select().from(scoresTable).where(eq(scoresTable.caseCode, caseCode));
  const diaryEntries = await db.select().from(diaryTable).where(eq(diaryTable.caseCode, caseCode));

  const exportData = {
    caseCode,
    createdAt: found.createdAt.toISOString(),
    answers: answers.map(a => ({
      ...a,
      createdAt: a.createdAt.toISOString(),
      updatedAt: a.updatedAt.toISOString(),
    })),
    scores: scores.map(s => ({
      ...s,
      scoreValue: s.scoreValue ?? null,
      resultText: s.resultText ?? null,
      recommendedActions: s.recommendedActions ?? null,
      createdAt: s.createdAt.toISOString(),
      updatedAt: s.updatedAt.toISOString(),
    })),
    diaryEntries: diaryEntries.map(d => ({
      ...d,
      careHours: d.careHours ?? null,
      careActivities: d.careActivities ?? null,
      notes: d.notes ?? null,
      mobility: d.mobility as "independent" | "assisted" | "dependent" | null,
      mood: d.mood as "good" | "moderate" | "poor" | null,
      createdAt: d.createdAt.toISOString(),
    })),
  };

  res.json(GetExportDataResponse.parse(exportData));
});

router.get("/stats/overview", async (_req, res): Promise<void> => {
  const [totalResult] = await db.select({ count: sql<number>`count(*)::int` }).from(casesTable);
  const [activeResult] = await db.select({ count: sql<number>`count(*)::int` }).from(casesTable).where(eq(casesTable.status, "active"));
  const [completedResult] = await db.select({ count: sql<number>`count(*)::int` }).from(casesTable).where(eq(casesTable.status, "completed"));
  const [diaryResult] = await db.select({ count: sql<number>`count(*)::int` }).from(diaryTable);

  const moduleRows = await db
    .select({ module: answersTable.module, count: sql<number>`count(distinct case_code)::int` })
    .from(answersTable)
    .groupBy(answersTable.module);

  const moduleBreakdown: Record<string, number> = {};
  for (const row of moduleRows) {
    moduleBreakdown[row.module] = row.count;
  }

  const [totalFb] = await db.select({ count: sql<number>`count(*)::int` }).from(feedbackTable);
  const [newFb] = await db.select({ count: sql<number>`count(*)::int` }).from(feedbackTable).where(eq(feedbackTable.status, "new"));

  res.json({
    totalCases: totalResult?.count ?? 0,
    activeCases: activeResult?.count ?? 0,
    completedCases: completedResult?.count ?? 0,
    totalFeedback: totalFb?.count ?? 0,
    newFeedback: newFb?.count ?? 0,
    moduleBreakdown,
    diaryEntries: diaryResult?.count ?? 0,
  });
});

export default router;
