import { Router, type IRouter } from "express";
import { eq, and } from "drizzle-orm";
import { db, answersTable, casesTable } from "@workspace/db";
import {
  SaveAnswerParams,
  SaveAnswerBody,
  SaveAnswerResponse,
  GetAnswersParams,
  GetAnswersQueryParams,
  GetAnswersResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapAnswer(a: typeof answersTable.$inferSelect) {
  return {
    id: a.id,
    caseCode: a.caseCode,
    module: a.module,
    questionKey: a.questionKey,
    answerValue: a.answerValue,
    answerJson: a.answerJson ?? null,
    createdAt: a.createdAt.toISOString(),
    updatedAt: a.updatedAt.toISOString(),
  };
}

router.post("/cases/:caseCode/answers", async (req, res): Promise<void> => {
  const params = SaveAnswerParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid case code" });
    return;
  }

  const body = SaveAnswerBody.safeParse(req.body);
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
    .from(answersTable)
    .where(
      and(
        eq(answersTable.caseCode, params.data.caseCode),
        eq(answersTable.module, body.data.module),
        eq(answersTable.questionKey, body.data.questionKey)
      )
    );

  let result: typeof answersTable.$inferSelect;

  if (existing.length > 0) {
    const [updated] = await db
      .update(answersTable)
      .set({
        answerValue: body.data.answerValue,
        answerJson: body.data.answerJson ?? null,
        updatedAt: new Date(),
      })
      .where(eq(answersTable.id, existing[0].id))
      .returning();
    result = updated;
  } else {
    const [inserted] = await db
      .insert(answersTable)
      .values({
        caseCode: params.data.caseCode,
        module: body.data.module,
        questionKey: body.data.questionKey,
        answerValue: body.data.answerValue,
        answerJson: body.data.answerJson ?? null,
      })
      .returning();
    result = inserted;
  }

  res.json(SaveAnswerResponse.parse(mapAnswer(result)));
});

router.get("/cases/:caseCode/answers", async (req, res): Promise<void> => {
  const params = GetAnswersParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid case code" });
    return;
  }

  const query = GetAnswersQueryParams.safeParse(req.query);

  let dbQuery = db.select().from(answersTable).where(eq(answersTable.caseCode, params.data.caseCode));

  const results = await dbQuery;
  const filtered = query.success && query.data.module
    ? results.filter(a => a.module === query.data.module)
    : results;

  res.json(GetAnswersResponse.parse(filtered.map(mapAnswer)));
});

export default router;
