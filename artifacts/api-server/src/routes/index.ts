import { Router, type IRouter } from "express";
import healthRouter from "./health";
import classifyRouter from "./classify";
import actionPlanRouter from "./actionPlan";

const router: IRouter = Router();

router.use(healthRouter);
router.use(classifyRouter);
router.use(actionPlanRouter);

export default router;
