import { Router, type IRouter } from "express";
import {
  ListRestaurantsQueryParams,
  ListRestaurantsResponse,
} from "@workspace/api-zod";
import { searchRestaurants } from "../lib/restaurant-source";

const router: IRouter = Router();

router.get("/restaurants", async (req, res): Promise<void> => {
  const parsed = ListRestaurantsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid restaurant search");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    const results = await searchRestaurants(parsed.data);
    const payload = {
      source: "OpenStreetMap",
      results,
      searchedAt: new Date(),
    };
    res.json(ListRestaurantsResponse.parse(payload));
  } catch (error) {
    req.log.error({ err: error }, "Restaurant source unavailable");
    res.status(502).json({
      error:
        "Live restaurant data is temporarily unavailable. Please try again.",
    });
  }
});

export default router;