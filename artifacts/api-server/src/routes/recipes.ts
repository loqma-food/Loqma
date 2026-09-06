import { and, asc, eq, ilike, lte, or, sql } from "drizzle-orm";
import { Router, type IRouter } from "express";
import {
  GetRecipeParams,
  GetRecipeResponse,
  ListRecipesQueryParams,
  ListRecipesResponse,
} from "@workspace/api-zod";
import { db, recipesTable, type Recipe } from "@workspace/db";
import { ensureRecipeSeeded } from "../lib/recipe-seed";

const router: IRouter = Router();

function toRecipeResponse(recipe: Recipe) {
  return {
    recipeId: recipe.recipeId,
    name: recipe.name,
    nameArabic: recipe.nameArabic,
    description: recipe.description,
    descriptionArabic: recipe.descriptionArabic,
    cuisine: recipe.cuisine,
    category: recipe.category,
    dishType: recipe.dishType,
    mainIngredient: recipe.mainIngredient,
    cookingTimeMinutes: recipe.cookingTimeMinutes,
    difficulty: recipe.difficulty,
    vegetarian: recipe.vegetarian,
    spicy: recipe.spicy,
    mealType: recipe.mealType,
    prepTimeMinutes: recipe.prepTimeMinutes,
    cookTimeMinutes: recipe.cookTimeMinutes,
    totalTimeMinutes: recipe.totalTimeMinutes,
    servings: recipe.servings,
    imageUrl: recipe.imageUrl,
    tags: recipe.tags,
    ingredients: recipe.ingredients,
    steps: recipe.steps,
  };
}

router.get("/recipes", async (req, res): Promise<void> => {
  const parsed = ListRecipesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    req.log.warn({ errors: parsed.error.message }, "Invalid recipe search");
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    await ensureRecipeSeeded();
    const filters = parsed.data;
    const conditions = [];
    const searchQuery = filters.query?.trim();

    if (searchQuery) {
      const pattern = `%${searchQuery}%`;
      conditions.push(or(
        ilike(recipesTable.name, pattern),
        ilike(recipesTable.nameArabic, pattern),
        ilike(recipesTable.description, pattern),
        ilike(recipesTable.descriptionArabic, pattern),
        ilike(recipesTable.cuisine, pattern),
        ilike(recipesTable.category, pattern),
        ilike(recipesTable.mainIngredient, pattern),
        sql`${recipesTable.ingredients}::text ILIKE ${pattern}`,
      ));
    }
    if (filters.cuisine) conditions.push(ilike(recipesTable.cuisine, `%${filters.cuisine}%`));
    if (filters.category) conditions.push(ilike(recipesTable.category, `%${filters.category}%`));
    if (filters.dishType) conditions.push(ilike(recipesTable.dishType, `%${filters.dishType}%`));
    if (filters.mainIngredient) conditions.push(ilike(recipesTable.mainIngredient, `%${filters.mainIngredient}%`));
    if (filters.maxCookingTime !== undefined) conditions.push(lte(recipesTable.cookingTimeMinutes, filters.maxCookingTime));
    if (filters.difficulty) conditions.push(eq(recipesTable.difficulty, filters.difficulty));
    if (filters.vegetarian !== undefined) conditions.push(eq(recipesTable.vegetarian, filters.vegetarian));
    if (filters.spicy !== undefined) conditions.push(eq(recipesTable.spicy, filters.spicy));
    if (filters.mealType) conditions.push(ilike(recipesTable.mealType, `%${filters.mealType}%`));

    const recipes = await db
      .select()
      .from(recipesTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .orderBy(sql`CASE WHEN ${recipesTable.cuisine} = 'Egyptian' THEN 0 ELSE 1 END`, asc(recipesTable.name));
    const results = recipes.map((recipe) => {
      const { prepTimeMinutes, cookTimeMinutes, totalTimeMinutes, ingredients, steps, ...summary } = toRecipeResponse(recipe);
      void prepTimeMinutes;
      void cookTimeMinutes;
      void totalTimeMinutes;
      void ingredients;
      void steps;
      return summary;
    });
    res.json(ListRecipesResponse.parse({ results, total: results.length }));
  } catch (error) {
    req.log.error({ err: error }, "Recipe discovery failed");
    res.status(500).json({ error: "Recipe discovery is temporarily unavailable. Please try again." });
  }
});

router.get("/recipes/:recipeId", async (req, res): Promise<void> => {
  const parsed = GetRecipeParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  try {
    await ensureRecipeSeeded();
    const [recipe] = await db
      .select()
      .from(recipesTable)
      .where(eq(recipesTable.recipeId, parsed.data.recipeId))
      .limit(1);
    if (!recipe) {
      res.status(404).json({ error: "Recipe not found." });
      return;
    }
    res.json(GetRecipeResponse.parse(toRecipeResponse(recipe)));
  } catch (error) {
    req.log.error({ err: error, recipeId: parsed.data.recipeId }, "Recipe detail failed");
    res.status(500).json({ error: "Recipe details are temporarily unavailable. Please try again." });
  }
});

export default router;