import { SlidersHorizontal, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useLocation } from 'wouter';
import { getListRecipesQueryKey, useListRecipes, type ListRecipesParams, type RecipeSearchResponse } from '@workspace/api-client-react';
import { SectionEyebrow, SavorlyShell } from '@/components/savorly-shell';
import { ErrorState, RecipeCard, RecipeSkeleton, SearchBox } from '@/components/recipe-ui';
import { localizeCategory, localizeCuisine, useLanguage } from '@/lib/language-context';

const baseParams: ListRecipesParams = {};
type SelectFilter = { key: keyof ListRecipesParams; label: string; options: string[] };
const filters: SelectFilter[] = [
  { key: 'cuisine', label: 'Cuisine', options: [] },
  { key: 'category', label: 'Category', options: [] },
  { key: 'dishType', label: 'Dish type', options: [] },
  { key: 'mainIngredient', label: 'Main ingredient', options: [] },
  { key: 'mealType', label: 'Meal', options: [] },
  { key: 'difficulty', label: 'Difficulty', options: [] },
];

export default function Recipes() {
  const [location] = useLocation();
  const { language, t } = useLanguage();
  const initialQuery = useMemo(() => new URLSearchParams(location.split('?')[1] ?? ''), [location]);
  const [search, setSearch] = useState(() => initialQuery.get('query') ?? '');
  const [params, setParams] = useState<ListRecipesParams>(baseParams);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const queryParams = useMemo(() => ({ ...params, query: search.trim() || undefined }), [params, search]);
  const query = useListRecipes<RecipeSearchResponse>(queryParams, { query: { queryKey: getListRecipesQueryKey(queryParams) } });
  const results = query.data?.results ?? [];
  const availableOptions = useMemo(() => Object.fromEntries(filters.map(({ key }) => [key, Array.from(new Set(results.map((recipe) => String(recipe[key as keyof typeof recipe] ?? '')))).filter(Boolean).sort()])) as Record<string, string[]>, [results]);
  const activeCount = Object.values(params).filter(Boolean).length;
  const updateParam = (key: keyof ListRecipesParams, value: string | number | boolean | undefined) => setParams((current) => ({ ...current, [key]: value || undefined }));
  const reset = () => { setParams({}); setSearch(''); };

  return <SavorlyShell showChef>
    <div className="mobile-page mx-auto max-w-6xl px-5 pb-32 md:px-8 md:pb-16">
      <section className="relative overflow-hidden rounded-[2rem] bg-sidebar px-6 py-10 text-sidebar-foreground sm:px-10 sm:py-14 md:px-14">
        <div className="absolute -right-24 -top-28 h-72 w-72 rounded-full border-[26px] border-primary/20" /><div className="absolute -bottom-28 right-20 h-48 w-48 rounded-full bg-accent/15 blur-3xl" />
         <div className="relative max-w-2xl"><SectionEyebrow>{language === 'ar' ? 'اطبخ حاجة حلوة' : 'Cook something good'}</SectionEyebrow><h1 className="max-w-xl font-display text-[clamp(3rem,9vw,6.4rem)] font-bold leading-[.88] tracking-[-.065em]">{language === 'ar' ? 'العشا ' : 'Dinner, '}<span className="text-primary">{language === 'ar' ? 'اتظبط.' : 'sorted.'}</span></h1><p className="mt-5 max-w-lg text-base leading-7 text-sidebar-foreground/75">{language === 'ar' ? 'وصفات بإرشادات كفاية تاخدك من «ممكن» لـ «بص عملت إيه».' : 'Recipes with enough guidance to get you from “maybe” to “look what I made.”'}</p></div>
      </section>
      <section className="relative z-10 -mt-6 space-y-3 px-1">
        <SearchBox value={search} onChange={setSearch} />
         <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide"><button type="button" onClick={() => setFiltersOpen((open) => !open)} className="touch-target inline-flex shrink-0 items-center gap-2 rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground shadow-sm transition hover:-translate-y-0.5" data-testid="button-toggle-recipe-filters"><SlidersHorizontal className="h-4 w-4" />{t('filters')} {activeCount > 0 && <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-foreground px-1 text-xs text-primary">{activeCount}</span>}</button>{activeCount > 0 && <button type="button" onClick={reset} className="touch-target inline-flex shrink-0 items-center gap-1 rounded-full border border-border bg-card px-4 text-sm font-bold text-muted-foreground" data-testid="button-clear-recipe-filters">{t('clear')} <X className="h-3.5 w-3.5" /></button>}<span className="ml-auto hidden shrink-0 text-xs font-bold uppercase tracking-[.12em] text-muted-foreground sm:block">{query.data?.total ?? 0} {t('recipes')}</span></div>
         {filtersOpen && <div className="animate-rise-in grid gap-3 rounded-[1.5rem] border border-border bg-card p-4 shadow-md sm:grid-cols-2 md:grid-cols-3" data-mobile-overlay="true" data-testid="panel-recipe-filters">
           {filters.map((filter) => <label key={filter.key} className="space-y-1.5 text-xs font-bold text-muted-foreground"><span>{filter.label}</span><select value={String(params[filter.key] ?? '')} onChange={(event) => updateParam(filter.key, event.target.value)} className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground outline-none focus:border-primary" data-testid={`select-filter-${filter.key}`}><option value="">Any {filter.label.toLowerCase()}</option>{(availableOptions[filter.key] ?? filter.options).map((option) => <option key={option} value={option}>{filter.key === 'cuisine' ? localizeCuisine(language, option) : filter.key === 'category' ? localizeCategory(language, option) : option}</option>)}</select></label>)}
           <label className="space-y-1.5 text-xs font-bold text-muted-foreground"><span>{language === 'ar' ? 'وقت الطبخ' : 'Cooking time'}</span><select value={params.maxCookingTime ?? ''} onChange={(event) => updateParam('maxCookingTime', event.target.value ? Number(event.target.value) : undefined)} className="min-h-11 w-full rounded-xl border border-border bg-background px-3 text-sm font-semibold text-foreground outline-none focus:border-primary" data-testid="select-filter-cooking-time"><option value="">{language === 'ar' ? 'أي مدة' : 'Any duration'}</option><option value="20">20 {language === 'ar' ? 'دقيقة أو أقل' : 'minutes or less'}</option><option value="30">30 {language === 'ar' ? 'دقيقة أو أقل' : 'minutes or less'}</option><option value="45">45 {language === 'ar' ? 'دقيقة أو أقل' : 'minutes or less'}</option><option value="60">1 {language === 'ar' ? 'ساعة أو أقل' : 'hour or less'}</option></select></label>
           <label className="flex min-h-11 items-center gap-3 self-end rounded-xl border border-border bg-background px-3 text-sm font-semibold"><input type="checkbox" checked={params.vegetarian === true} onChange={(event) => updateParam('vegetarian', event.target.checked ? true : undefined)} className="h-5 w-5 accent-[hsl(var(--primary))]" data-testid="checkbox-filter-vegetarian" />{t('vegetarian')}</label>
           <label className="flex min-h-11 items-center gap-3 self-end rounded-xl border border-border bg-background px-3 text-sm font-semibold"><input type="checkbox" checked={params.spicy === true} onChange={(event) => updateParam('spicy', event.target.checked ? true : undefined)} className="h-5 w-5 accent-[hsl(var(--primary))]" data-testid="checkbox-filter-spicy" />{language === 'ar' ? 'حار' : 'Spicy'}</label>
            <button type="button" onClick={() => setFiltersOpen(false)} className="min-h-11 rounded-xl border border-border bg-background px-4 text-sm font-bold sm:col-span-2 md:col-span-3 md:hidden" data-mobile-overlay-close>{t('done')}</button>
        </div>}
      </section>
       <div className="mt-10">{query.isLoading ? <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3"><RecipeSkeleton /><RecipeSkeleton /><RecipeSkeleton /></div> : query.isError ? <ErrorState onRetry={() => query.refetch()} /> : results.length === 0 ? <div className="rounded-[1.5rem] border border-dashed border-primary/40 bg-accent/20 px-6 py-16 text-center" data-testid="status-recipes-empty"><h2 className="font-display text-3xl font-bold">{t('noRecipes')}</h2><p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">{language === 'ar' ? 'جرّب بحث أوسع أو امسح فلتر. أكيد فيه عشا حلو مستنيك.' : 'Try a broader search or clear a filter. There is a good dinner hiding in here.'}</p><button type="button" onClick={reset} className="mt-6 min-h-11 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground" data-testid="button-empty-clear-filters">{t('clearFilters')}</button></div> : <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{results.map((recipe) => <RecipeCard key={recipe.recipeId} recipe={recipe} />)}</div>}</div>
    </div>
  </SavorlyShell>;
}