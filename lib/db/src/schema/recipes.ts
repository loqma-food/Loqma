import { createInsertSchema } from "drizzle-zod";
import { boolean, integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export type RecipeSubstitutionRecord = {
  ingredient: string;
  ingredientArabic?: string;
  quantity: number;
  unit: string;
  unitArabic?: string;
  effect: string;
  effectArabic?: string;
};

export type RecipeIngredientRecord = {
  ingredientId: string;
  name: string;
  nameArabic?: string;
  quantity: number;
  unit: string;
  unitArabic?: string;
  optional: boolean;
  group: string;
  groupArabic?: string;
  notes: string | null;
  notesArabic?: string | null;
  substitutions: RecipeSubstitutionRecord[];
};

export type RecipeStepRecord = {
  stepNumber: number;
  title: string;
  titleArabic?: string;
  instruction: string;
  instructionArabic?: string;
  durationMinutes: number | null;
  heatLevel: string | null;
  heatLevelArabic?: string | null;
  cookingCue: string;
  cookingCueArabic?: string;
};

export const recipesTable = pgTable("recipes", {
  recipeId: text("recipe_id").primaryKey(),
  name: text("name").notNull(),
  nameArabic: text("name_arabic").notNull().default(""),
  description: text("description").notNull(),
  descriptionArabic: text("description_arabic").notNull().default(""),
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