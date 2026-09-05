import { ArrowLeft, ArrowRight, Check, ChevronDown, Flame, Heart, Share2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useLocation, useRoute } from 'wouter';
import { getGetRecipeQueryKey, useGetRecipe } from '@workspace/api-client-react';
import { SectionEyebrow, SavorlyShell } from '@/components/savorly-shell';
import { ErrorState, IngredientRow, RecipeImage, RecipeMeta, RecipeSkeleton, ServingControl, StepPreview, SubstituteList } from '@/components/recipe-ui';

export default function RecipeDetail() {
  const [, params] = useRoute('/recipes/:recipeId');
  const [, setLocation] = useLocation();
  const recipeId = params?.recipeId ?? '';
  const query = useGetRecipe(recipeId, { query: { enabled: Boolean(recipeId), queryKey: getGetRecipeQueryKey(recipeId) } });
  const recipe = query.data;
  const [servings, setServings] = useState<number | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [openSubstitutions, setOpenSubstitutions] = useState<string | null>(null);
  const actualServings = servings ?? recipe?.servings ?? 1;
  const groups = useMemo(() => {
    if (!recipe) return [];
    return Array.from(new Set(recipe.ingredients.map((ingredient) => ingredient.group || 'Ingredients')));
  }, [recipe]);
  if (query.isLoading) return <SavorlyShell><div className="mx-auto max-w-6xl px-5 pb-32 pt-8 md:px-8"><RecipeSkeleton /></div></SavorlyShell>;
  if (query.isError || !recipe) return <SavorlyShell><div className="mx-auto max-w-2xl px-5 pb-32 pt-12"><ErrorState onRetry={() => query.refetch()} detail="We couldn't bring this recipe to the counter." /></div></SavorlyShell>;

  const toggle = (id: string) => {
    const nextIncluded = checked[id] === false;
    setChecked((current) => ({ ...current, [id]: nextIncluded }));
    setOpenSubstitutions(nextIncluded ? null : id);
  };
  const startCooking = () => setLocation(`/recipes/${recipe.recipeId}/cook`);
  return <SavorlyShell showChef>
    <div className="mx-auto max-w-6xl px-5 pb-32 md:px-8 md:pb-16">
      <Link href="/cook" className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-primary" data-testid="link-back-to-recipes"><ArrowLeft className="h-4 w-4" />All recipes</Link>
      <section className="grid overflow-hidden rounded-[2rem] border border-border bg-card shadow-sm md:grid-cols-[.95fr_1.05fr]">
        <div className="relative min-h-[18rem] md:min-h-[34rem]"><RecipeImage recipe={recipe} className="absolute inset-0 h-full w-full" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-sidebar/80 to-transparent p-6 pt-24 text-sidebar-foreground md:hidden"><span className="text-xs font-bold uppercase tracking-[.15em]">{recipe.cuisine}</span></div></div>
        <div className="flex flex-col justify-center p-6 sm:p-10 md:p-14"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-primary"><span>{recipe.cuisine}</span><span className="h-1 w-1 rounded-full bg-primary" /><span>{recipe.dishType}</span></div><div className="flex gap-2"><button type="button" className="touch-target flex items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary" aria-label="Save recipe" data-testid="button-save-recipe"><Heart className="h-4 w-4" /></button><button type="button" onClick={() => navigator.clipboard?.writeText(window.location.href)} className="touch-target flex items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary hover:text-primary" aria-label="Share recipe" data-testid="button-share-recipe"><Share2 className="h-4 w-4" /></button></div></div><h1 className="mt-5 max-w-xl font-display text-[clamp(2.8rem,7vw,5.8rem)] font-bold leading-[.88] tracking-[-.06em]" data-testid="text-recipe-name">{recipe.name}</h1><p className="mt-5 max-w-lg leading-7 text-muted-foreground">{recipe.description}</p><div className="mt-6"><RecipeMeta recipe={recipe} /></div><div className="mt-8 grid grid-cols-3 gap-2 border-y border-border py-4 text-center"><div><p className="font-display text-2xl font-bold">{recipe.prepTimeMinutes}</p><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">prep min</p></div><div className="border-x border-border"><p className="font-display text-2xl font-bold">{recipe.cookTimeMinutes}</p><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">cook min</p></div><div><p className="font-display text-2xl font-bold">{recipe.totalTimeMinutes}</p><p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">total min</p></div></div><button type="button" onClick={startCooking} className="mt-8 flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary px-6 text-base font-bold text-primary-foreground shadow-sm transition hover:-translate-y-1 hover:shadow-lg" data-testid="button-start-cooking">Start cooking <ArrowRight className="h-5 w-5" /></button></div>
      </section>
      <section className="mt-12 grid gap-10 lg:grid-cols-[.92fr_1.08fr]">
         <div><div className="flex items-end justify-between gap-4"><div><SectionEyebrow>Gather your ingredients</SectionEyebrow><h2 className="font-display text-4xl font-bold tracking-[-.045em]">Set up your counter.</h2></div><ServingControl servings={actualServings} onChange={setServings} /></div><p className="mt-4 text-sm leading-6 text-muted-foreground">Tap YES when it is in the kitchen. Quantities adjust for your {actualServings} servings.</p><div className="mt-6 space-y-8">{groups.map((group) => <div key={group}><h3 className="mb-3 text-xs font-bold uppercase tracking-[.16em] text-primary">{group}</h3><div className="space-y-2">{recipe.ingredients.filter((ingredient) => (ingredient.group || 'Ingredients') === group).map((ingredient) => <div key={ingredient.ingredientId}><IngredientRow ingredient={ingredient} servings={actualServings} originalServings={recipe.servings} included={checked[ingredient.ingredientId] !== false} onToggle={() => toggle(ingredient.ingredientId)} />{<button type="button" onClick={() => setOpenSubstitutions(openSubstitutions === ingredient.ingredientId ? null : ingredient.ingredientId)} className="ml-16 mt-1 inline-flex min-h-9 items-center gap-1 text-xs font-bold text-primary" data-testid={`button-substitutions-${ingredient.ingredientId}`}>{openSubstitutions === ingredient.ingredientId ? 'Hide swaps' : 'Need a swap?'}<ChevronDown className={`h-3.5 w-3.5 transition ${openSubstitutions === ingredient.ingredientId ? 'rotate-180' : ''}`} /></button>}{openSubstitutions === ingredient.ingredientId && <SubstituteList ingredient={ingredient} />}</div>)}</div></div>)}</div></div>
        <div><SectionEyebrow>Make it happen</SectionEyebrow><div className="flex items-end justify-between gap-4"><h2 className="font-display text-4xl font-bold tracking-[-.045em]">A calm path to done.</h2><span className="hidden rounded-full bg-secondary px-3 py-1.5 text-xs font-bold text-secondary-foreground sm:inline-flex"><Check className="mr-1.5 h-3.5 w-3.5" />{recipe.steps.length} steps</span></div><div className="mt-6 space-y-3">{recipe.steps.map((step) => <StepPreview key={step.stepNumber} step={step} />)}</div><Link href={`/recipes/${recipe.recipeId}/cook`} className="mt-6 flex min-h-14 items-center justify-center gap-2 rounded-full border-2 border-primary bg-transparent text-sm font-bold text-primary transition hover:bg-primary hover:text-primary-foreground" data-testid="link-open-cooking-mode">Open cooking mode <Flame className="h-4 w-4" /></Link></div>
      </section>
    </div>
  </SavorlyShell>;
}