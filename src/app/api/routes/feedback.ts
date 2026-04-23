import { Router, type IRouter } from "express";
import { eq, and, gte, lte, sql } from "drizzle-orm";
import { db, feedbackTable } from "@workspace/db";
import {
  SubmitFeedbackBody,
  ListFeedbackQueryParams,
  UpdateFeedbackStatusParams,
  UpdateFeedbackStatusBody,
  UpdateFeedbackStatusResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function mapFeedback(f: typeof feedbackTable.$inferSelect) {
  return {
    id: f.id,
    pagePath: f.pagePath,
    feedbackText: f.feedbackText,
    caseCode: f.caseCode ?? null,
    rating: f.rating ?? null,
    status: f.status as "new" | "reviewed" | "resolved",
    createdAt: f.createdAt.toISOString(),
  };
}

router.post("/feedback", async (req, res): Promise<void> => {
  const body = SubmitFeedbackBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid feedback data" });
    return;
  }

  const [inserted] = await db
    .insert(feedbackTable)
    .values({
      pagePath: body.data.pagePath,
      feedbackText: body.data.feedbackText,
      caseCode: body.data.caseCode ?? null,
      rating: body.data.rating ?? null,
      status: "new",
    })
    .returning();

  res.status(201).json(mapFeedback(inserted));
});

router.get("/feedback", async (req, res): Promise<void> => {
  const query = ListFeedbackQueryParams.safeParse(req.query);
  const page = query.success ? (query.data.page ?? 1) : 1;
  const limit = query.success ? (query.data.limit ?? 20) : 20;
  const offset = (page - 1) * limit;

  const conditions = [];
  if (query.success) {
    if (query.data.page_path) {
      conditions.push(eq(feedbackTable.pagePath, query.data.page_path));
    }
    if (query.data.status) {
      conditions.push(eq(feedbackTable.status, query.data.status));
    }
    if (query.data.date_from) {
      conditions.push(gte(feedbackTable.createdAt, new Date(query.data.date_from)));
    }
    if (query.data.date_to) {
      conditions.push(lte(feedbackTable.createdAt, new Date(query.data.date_to)));
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(feedbackTable)
    .where(whereClause);

  const items = await db
    .select()
    .from(feedbackTable)
    .where(whereClause)
    .orderBy(feedbackTable.createdAt)
    .limit(limit)
    .offset(offset);

  res.json({
    items: items.map(mapFeedback),
    total: count ?? 0,
    page,
    limit,
  });
});

router.patch("/feedback/:id", async (req, res): Promise<void> => {
  const params = UpdateFeedbackStatusParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: "Invalid feedback ID" });
    return;
  }

  const body = UpdateFeedbackStatusBody.safeParse(req.body);
  if (!body.success) {
    res.status(400).json({ error: "Invalid status" });
    return;
  }

  const [updated] = await db
    .update(feedbackTable)
    .set({ status: body.data.status })
    .where(eq(feedbackTable.id, params.data.id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Feedback not found" });
    return;
  }

  res.json(UpdateFeedbackStatusResponse.parse(mapFeedback(updated)));
});

export default router;
