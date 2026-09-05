import { Router, type IRouter } from "express";
import healthRouter from "./health";
import restaurantsRouter from "./restaurants";
import recipesRouter from "./recipes";

const router: IRouter = Router();

router.use(healthRouter);
router.use(restaurantsRouter);
router.use(recipesRouter);

export default router;
