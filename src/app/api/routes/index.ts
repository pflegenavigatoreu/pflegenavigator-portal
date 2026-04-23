import { Router, type IRouter } from "express";
import healthRouter from "./health";
import casesRouter from "./cases";
import answersRouter from "./answers";
import scoresRouter from "./scores";
import feedbackRouter from "./feedback";
import diaryRouter from "./diary";

const router: IRouter = Router();

router.use(healthRouter);
router.use(casesRouter);
router.use(answersRouter);
router.use(scoresRouter);
router.use(feedbackRouter);
router.use(diaryRouter);

export default router;
