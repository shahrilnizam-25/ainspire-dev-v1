import { Router, type IRouter } from "express";
import healthRouter from "./health";
import classifyRouter from "./classify";
import actionPlanRouter from "./actionPlan";
import youtubeRouter from "./youtube";

const router: IRouter = Router();

router.use(healthRouter);
router.use(classifyRouter);
router.use(actionPlanRouter);
router.use(youtubeRouter);

export default router;
