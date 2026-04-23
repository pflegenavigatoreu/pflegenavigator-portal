import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, scoresTable, casesTable } from "@workspace/db";
import {
  SaveScoreParams,
  SaveScoreBody,
  SaveScoreResponse,
  GetScoresParams,
  GetScoresQueryParams,
  GetScoresResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapScore(s: typeof scoresTable.$inferSelect) {
  return {
    id: s.id,
    caseCode: s.caseCode,
    module: s.module,
    trafficLight: s.trafficLight as "green" | "yellow" | "red",
    scoreValue: s.scoreValue ?? null,
    resultText: s.resultText ?? null,
    recommendedActions: s.recommendedActions ?? null,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  };
}

router.post("/cases/:caseCode/scores", async (req, res): Promise<void> => {
  const params = SaveScoreParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid case code" });
    return;
  }

  const body = SaveScoreBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const [caseFound] = await db.select().from(casesTable).where(eq(casesTable.caseCode, params.data.caseCode));
  if (!caseFound) {
    res.status(404).json({ error: "Case not found" });
    return;
  }

  const existing = await db
    .select()
    .from(scoresTable)
    .where(
      and(
        eq(scoresTable.caseCode, params.data.caseCode),
        eq(scoresTable.module, body.data.module)
      )
    );

  let result: typeof scoresTable.$inferSelect;

  if (existing.length > 0) {
    const [updated] = await db
      .update(scoresTable)
      .set({
        trafficLight: body.data.trafficLight,
        scoreValue: body.data.scoreValue ?? null,
        resultText: body.data.resultText ?? null,
        recommendedActions: body.data.recommendedActions ?? null,
        updatedAt: new Date(),
      })
      .where(eq(scoresTable.id, existing[0].id))
      .returning();
    result = updated;
  } else {
    const [inserted] = await db
      .insert(scoresTable)
      .values({
        caseCode: params.data.caseCode,
        module: body.data.module,
        trafficLight: body.data.trafficLight,
        scoreValue: body.data.scoreValue ?? null,
        resultText: body.data.resultText ?? null,
        recommendedActions: body.data.recommendedActions ?? null,
      })
      .returning();
    result = inserted;
  }

  res.json(SaveScoreResponse.parse(mapScore(result)));
});

router.get("/cases/:caseCode/scores", async (req, res): Promise<void> => {
  const params = GetScoresParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid case code" });
    return;
  }

  const query = GetScoresQueryParams.safeParse(req.query);

  const results = await db.select().from(scoresTable).where(eq(scoresTable.caseCode, params.data.caseCode));
  const filtered = query.success && query.data.module
    ? results.filter(s => s.module === query.data.module)
    : results;

  res.json(GetScoresResponse.parse(filtered.map(mapScore)));
});

export default router;
