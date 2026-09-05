import { ArrowRight, Clock3, Flame, Leaf, Minus, Plus, RotateCcw, Search, Sparkles, Utensils } from 'lucide-react';
import { Link } from 'wouter';
import { useState } from 'react';
import type { Recipe, RecipeIngredient, RecipeSummary, RecipeStep } from '@workspace/api-client-react';

export function RecipeImage({ recipe, className = '' }: { recipe: RecipeSummary; className?: string }) {
  const [imageFailed, setImageFailed] = useState(false);
  if (!recipe.imageUrl || imageFailed) {
    return <div className={`recipe-image relative flex items-center justify-center overflow-hidden ${className}`} data-testid={`img-recipe-placeholder-${recipe.recipeId}`}>
      <Utensils className="h-10 w-10 text-sidebar/35" strokeWidth={1.2} />
      <span className="absolute bottom-3 left-3 rounded-full bg-card/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[.14em] text-muted-foreground">Savorly recipe</span>
    </div>;
  }
  return <img src={recipe.imageUrl} alt="" onError={() => setImageFailed(true)} className={`object-cover ${className}`} data-testid={`img-recipe-${recipe.recipeId}`} />;
}

export function RecipeMeta({ recipe, compact = false }: { recipe: RecipeSummary; compact?: boolean }) {
  return <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-semibold text-muted-foreground ${compact ? '' : 'text-sm'}`}>
    <span className="inline-flex items-center gap-1" data-testid={`text-time-${recipe.recipeId}`}><Clock3 className="h-3.5 w-3.5 text-primary" />{recipe.cookingTimeMinutes} min</span>
    <span className="inline-flex items-center gap-1 capitalize"><Sparkles className="h-3.5 w-3.5 text-primary" />{recipe.difficulty}</span>
    <span className="inline-flex items-center gap-1"><Utensils className="h-3.5 w-3.5 text-primary" />{recipe.servings} servings</span>
    {recipe.vegetarian && <span className="inline-flex items-center gap-1 text-secondary-foreground"><Leaf className="h-3.5 w-3.5" />vegetarian</span>}
  </div>;
}

export function RecipeCard({ recipe }: { recipe: RecipeSummary }) {
  return <Link href={`/recipes/${recipe.recipeId}`} className="group block overflow-hidden rounded-[1.35rem] border border-border bg-card shadow-sm transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-[var(--shadow-md)]" data-testid={`card-recipe-${recipe.recipeId}`}>
    <div className="relative h-48 overflow-hidden">
      <RecipeImage recipe={recipe} className="h-full w-full transition duration-500 group-hover:scale-105" />
      <span className="absolute left-3 top-3 rounded-full bg-card/90 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[.13em] text-foreground backdrop-blur-sm">{recipe.mealType}</span>
      {recipe.spicy && <span className="absolute right-3 top-3 rounded-full bg-primary px-2.5 py-1.5 text-[10px] font-bold uppercase tracking-[.13em] text-primary-foreground">spicy</span>}
    </div>
    <div className="p-5">
      <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[.13em] text-primary"><span>{recipe.cuisine}</span><span className="h-1 w-1 rounded-full bg-primary/50" /><span>{recipe.category}</span></div>
      <h3 className="mt-2 font-display text-2xl font-bold leading-[.98] tracking-[-.035em]">{recipe.name}</h3>
      <p className="mt-2 line-clamp-2 text-sm leading-5 text-muted-foreground">{recipe.description}</p>
      <div className="mt-4 flex items-center justify-between gap-3"><RecipeMeta recipe={recipe} compact /><ArrowRight className="h-4 w-4 text-primary transition group-hover:translate-x-1" /></div>
    </div>
  </Link>;
}

export function RecipeSkeleton() {
  return <div className="overflow-hidden rounded-[1.35rem] border border-border bg-card" aria-label="Loading recipe">
    <div className="skeleton-shimmer h-48" /><div className="space-y-3 p-5"><div className="skeleton-shimmer h-3 w-1/3 rounded-full" /><div className="skeleton-shimmer h-7 w-3/4 rounded-full" /><div className="skeleton-shimmer h-10 w-full rounded-xl" /><div className="skeleton-shimmer h-4 w-1/2 rounded-full" /></div>
  </div>;
}

export function IngredientRow({ ingredient, servings, originalServings, included, onToggle }: { ingredient: RecipeIngredient; servings: number; originalServings: number; included: boolean; onToggle: () => void }) {
  const quantity = ingredient.quantity * servings / originalServings;
  return <div className={`flex items-center gap-3 rounded-2xl border p-3 transition ${included ? 'border-border bg-card' : 'border-primary/30 bg-primary/5'}`} data-testid={`ingredient-row-${ingredient.ingredientId}`}>
    <button type="button" onClick={onToggle} className={`touch-target flex shrink-0 items-center justify-center rounded-xl border-2 text-xs font-black transition ${included ? 'border-secondary-foreground bg-secondary text-secondary-foreground' : 'border-primary bg-primary text-primary-foreground'}`} aria-label={`${included ? 'Mark' : 'Unmark'} ${ingredient.name}`} data-testid={`button-toggle-ingredient-${ingredient.ingredientId}`}>{included ? 'YES' : 'NO'}</button>
     <div className="min-w-0 flex-1"><p className={`font-semibold ${included ? '' : 'text-muted-foreground line-through'}`}>{quantity % 1 === 0 ? quantity : quantity.toFixed(1)} {ingredient.unit} {ingredient.name}</p>{ingredient.notes && <p className="mt-0.5 text-xs text-muted-foreground">{ingredient.notes}</p>}</div>
     <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${ingredient.optional ? 'bg-muted text-muted-foreground' : 'bg-secondary text-secondary-foreground'}`}>{ingredient.optional ? 'optional' : 'essential'}</span>
  </div>;
}

export function SubstituteList({ ingredient }: { ingredient: RecipeIngredient }) {
  if (!ingredient.substitutions?.length) return <p className="mt-2 rounded-xl bg-accent/40 px-3 py-2 text-xs font-semibold text-accent-foreground">No suitable substitute — this ingredient is essential.</p>;
  return <div className="mt-2 space-y-2">{ingredient.substitutions.map((sub) => <div key={`${sub.ingredient}-${sub.unit}`} className="rounded-xl bg-secondary/60 px-3 py-2 text-xs" data-testid={`substitution-${ingredient.ingredientId}-${sub.ingredient}`}><span className="font-bold">{sub.quantity} {sub.unit} {sub.ingredient}</span><span className="text-muted-foreground"> · {sub.effect}</span></div>)}</div>;
}

export function ServingControl({ servings, onChange }: { servings: number; onChange: (next: number) => void }) {
  return <div className="inline-flex items-center rounded-full border border-border bg-card p-1 shadow-sm" data-testid="control-servings"><button type="button" onClick={() => onChange(Math.max(1, servings - 1))} className="touch-target flex items-center justify-center rounded-full text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Decrease servings" data-testid="button-decrease-servings"><Minus className="h-4 w-4" /></button><span className="min-w-16 text-center text-sm font-bold"><span data-testid="text-serving-count">{servings}</span> <span className="font-normal text-muted-foreground">servings</span></span><button type="button" onClick={() => onChange(servings + 1)} className="touch-target flex items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:scale-105" aria-label="Increase servings" data-testid="button-increase-servings"><Plus className="h-4 w-4" /></button></div>;
}

export function StepPreview({ step }: { step: RecipeStep }) {
  return <div className="rounded-[1.25rem] border border-border bg-card p-5"><div className="flex items-center justify-between gap-3"><span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">Step {step.stepNumber}</span>{step.durationMinutes && <span className="inline-flex items-center gap-1 text-xs font-bold text-muted-foreground"><Clock3 className="h-3.5 w-3.5" />{step.durationMinutes} min</span>}</div><h3 className="mt-4 font-display text-2xl font-bold">{step.title}</h3><p className="mt-2 leading-7 text-muted-foreground">{step.instruction}</p>{step.cookingCue && <p className="mt-4 flex items-start gap-2 rounded-xl bg-accent/45 p-3 text-sm font-semibold text-accent-foreground"><Flame className="mt-0.5 h-4 w-4 shrink-0" />{step.cookingCue}</p>}</div>;
}

export function ErrorState({ onRetry, detail = 'Something got tangled in the kitchen.' }: { onRetry: () => void; detail?: string }) {
  return <div className="rounded-[1.5rem] border border-primary/25 bg-primary/5 p-8 text-center" data-testid="status-recipe-error"><RotateCcw className="mx-auto h-7 w-7 text-primary" /><h2 className="mt-4 font-display text-2xl font-bold">The recipe box is being stubborn.</h2><p className="mt-2 text-sm text-muted-foreground">{detail}</p><button type="button" onClick={onRetry} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5" data-testid="button-retry-recipes">Try again <RotateCcw className="h-4 w-4" /></button></div>;
}

export function SearchBox({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <label className="flex min-h-14 items-center gap-3 rounded-2xl border border-border bg-card px-4 shadow-sm focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15"><Search className="h-5 w-5 shrink-0 text-primary" /><span className="sr-only">Search recipes</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder="Search a recipe, ingredient, or cuisine" className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground" data-testid="input-recipe-search" /></label>;
}