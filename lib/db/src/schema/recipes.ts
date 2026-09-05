import { createInsertSchema } from "drizzle-zod";
import { boolean, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export type RecipeSubstitutionRecord = {
  ingredient: string;
  quantity: number;
  unit: string;
  effect: string;
};

export type RecipeIngredientRecord = {
  ingredientId: string;
  name: string;
  quantity: number;
  unit: string;
  optional: boolean;
  group: string;
  notes: string | null;
  substitutions: RecipeSubstitutionRecord[];
};

export type RecipeStepRecord = {
  stepNumber: number;
  title: string;
  instruction: string;
  durationMinutes: number | null;
  heatLevel: string | null;
  cookingCue: string;
};

export const recipesTable = pgTable("recipes", {
  recipeId: text("recipe_id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  cuisine: text("cuisine").notNull(),
  category: text("category").notNull(),
  dishType: text("dish_type").notNull(),
  mainIngredient: text("main_ingredient").notNull(),
  cookingTimeMinutes: integer("cooking_time_minutes").notNull(),
  difficulty: text("difficulty").notNull(),
  vegetarian: boolean("vegetarian").notNull().default(false),
  spicy: boolean("spicy").notNull().default(false),
  mealType: text("meal_type").notNull(),
  prepTimeMinutes: integer("prep_time_minutes").notNull(),
  cookTimeMinutes: integer("cook_time_minutes").notNull(),
  totalTimeMinutes: integer("total_time_minutes").notNull(),
  servings: integer("servings").notNull(),
  imageUrl: text("image_url"),
  tags: text("tags").array().notNull().default([]),
  ingredients: jsonb("ingredients").$type<RecipeIngredientRecord[]>().notNull(),
  steps: jsonb("steps").$type<RecipeStepRecord[]>().notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertRecipeSchema = createInsertSchema(recipesTable).omit({ createdAt: true, updatedAt: true });
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;
export type Recipe = typeof recipesTable.$inferSelect;