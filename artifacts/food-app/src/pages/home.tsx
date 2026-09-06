import { ArrowRight, ChefHat, Compass, Leaf, Sparkles, Utensils } from 'lucide-react';
import { Link } from 'wouter';
import { useMemo, useState } from 'react';
import { getHealthCheckQueryKey, getListRecipesQueryKey, useHealthCheck, useListRecipes, type RecipeSearchResponse } from '@workspace/api-client-react';
import { LocationPill, SectionEyebrow, SavorlyShell } from '@/components/savorly-shell';
import { RecipeCard, SearchBox } from '@/components/recipe-ui';
import { useLanguage } from '@/lib/language-context';

export default function Home() {
  const { language, t } = useLanguage();
  const [search, setSearch] = useState('');
  const { data: health } = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey() } });
  const recipesQuery = useListRecipes({}, { query: { queryKey: getListRecipesQueryKey({}) } });
  const recipes = (recipesQuery.data as RecipeSearchResponse | undefined)?.results ?? [];
  const cuisines = useMemo(() => Array.from(new Set(recipes.map((recipe) => recipe.cuisine))).filter(Boolean).slice(0, 6), [recipes]);
  const quickRecipes = useMemo(() => recipes.filter((recipe) => recipe.cookingTimeMinutes <= 30).slice(0, 3), [recipes]);
  const recommendedRecipes = recipes.filter((recipe) => !quickRecipes.some((quick) => quick.recipeId === recipe.recipeId)).slice(0, 3);
  const featuredRecipe = recipes[0];

  return <SavorlyShell showChef>
    <div className="mobile-page mx-auto max-w-6xl px-5 pb-32 md:px-8 md:pb-16">
      <section className="relative overflow-hidden rounded-[2rem] bg-sidebar px-6 py-12 text-sidebar-foreground shadow-md sm:px-10 sm:py-16 md:px-16 md:py-20">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <LocationPill>{language === 'ar' ? 'لما الشهية تقابل المكان' : 'Where appetite meets place'}</LocationPill>
          <h1 className="mt-6 max-w-xl font-display text-[clamp(3.2rem,11vw,7.5rem)] font-bold leading-[.86] tracking-[-0.065em] text-balance">{language === 'ar' ? 'اختار ' : 'Make room for '}<span className="text-primary">{language === 'ar' ? 'الحلو' : 'good'}</span>{language === 'ar' ? ' كل مرة.' : ' decisions.'}</h1>
          <p className="mt-7 max-w-md text-base leading-7 text-sidebar-foreground/72 sm:text-lg">{language === 'ar' ? 'لقمة بتحوّل حيرة ناكل إيه أو نطلب منين لاختيارات قليلة تفرحك.' : 'Loqma turns the “where should we eat?” spiral into a short list you can actually feel excited about.'}</p>
          <p className="mt-4 max-w-md text-sm font-semibold leading-6 text-sidebar-foreground/65" dir="auto">{language === 'ar' ? 'لقمة — كل لقمة لها حكاية.' : 'Loqma — Every Bite Has a Story.'}</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/eat-out" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary px-6 text-base font-bold text-primary-foreground transition hover:-translate-y-1 hover:shadow-lg" data-testid="link-start-eat-out">
              {language === 'ar' ? 'ودّيني للأكل' : 'Take me to dinner'} <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="#how-it-works" className="inline-flex min-h-14 items-center justify-center rounded-full border border-sidebar-foreground/20 px-6 text-base font-bold text-sidebar-foreground transition hover:bg-sidebar-accent" data-testid="link-how-it-works">{language === 'ar' ? 'بتشتغل إزاي؟' : 'How it works'}</a>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-[-1.5rem] right-[-2rem] hidden h-72 w-72 rounded-[45%] border-[22px] border-accent/25 md:block md:rotate-[24deg]" />
        <div className="pointer-events-none absolute bottom-12 right-20 hidden h-28 w-28 rounded-full border-[14px] border-primary/60 md:block" />
      </section>

      <section className="mt-6">
        <SearchBox value={search} onChange={setSearch} />
        <div className="mt-3 flex flex-wrap gap-2">
          <Link href={search.trim() ? `/cook?query=${encodeURIComponent(search.trim())}` : '/cook'} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground"><Utensils className="h-4 w-4" /> {t('searchRecipes')}</Link>
          <Link href="/eat-out" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-bold"><Compass className="h-4 w-4" /> Find a place</Link>
        </div>
      </section>

      <section className="mt-12">
        <div className="mb-4 flex items-end justify-between gap-4"><div><SectionEyebrow>{language === 'ar' ? 'اختيارات سريعة' : 'Quick actions'}</SectionEyebrow><h2 className="font-display text-3xl font-bold">{language === 'ar' ? 'نفسك في إيه؟' : 'What sounds good?'}</h2></div><p className="hidden text-xs font-bold text-muted-foreground sm:block"><span className={`mr-2 inline-block h-2 w-2 rounded-full ${health?.status === 'ok' ? 'bg-secondary-foreground' : 'bg-primary'}`} />{health?.status === 'ok' ? (language === 'ar' ? 'القوائم الحقيقية جاهزة' : 'Live listings are ready') : (language === 'ar' ? 'بنشوف الأماكن القريبة' : 'Checking local listings')}</p></div>
        <div className="grid gap-3 sm:grid-cols-3">
          <ActionCard href="/cook" icon={Utensils} title={language === 'ar' ? 'اطبخ في البيت' : 'Cook at home'} body={language === 'ar' ? 'اختار وصفة لليلة.' : 'Find a recipe for tonight.'} />
          <ActionCard href="/eat-out" icon={Compass} title={t('eatOut')} body={language === 'ar' ? 'استكشف أماكن حقيقية قريبة.' : 'Explore real nearby places.'} />
          <ActionCard href="/favorites" icon={Leaf} title={t('favorites')} body={language === 'ar' ? 'كمّل من آخر اختياراتك.' : 'Pick up where you left off.'} />
        </div>
      </section>

      {featuredRecipe && <section className="mt-12">
        <div className="mb-4 flex items-end justify-between gap-4"><div><SectionEyebrow>{language === 'ar' ? 'وصفة مميزة' : 'Featured recipe'}</SectionEyebrow><h2 className="font-display text-3xl font-bold">{language === 'ar' ? 'أول لقمة حلوة.' : 'A good first bite.'}</h2></div><Link href="/cook" className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-primary">{language === 'ar' ? 'شوف الكل' : 'See all'} <ArrowRight className="h-4 w-4" /></Link></div>
        <div className="max-w-xl"><RecipeCard recipe={featuredRecipe} /></div>
      </section>}

      {cuisines.length > 0 && <section className="mt-12">
        <SectionEyebrow>{language === 'ar' ? 'اكتشف المطابخ' : 'Explore cuisines'}</SectionEyebrow>
        <h2 className="font-display text-3xl font-bold">{language === 'ar' ? 'اتبع الطعم.' : 'Follow the flavor.'}</h2>
        <div className="mt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">{cuisines.map((cuisine) => <Link key={cuisine} href={`/cook?cuisine=${encodeURIComponent(cuisine)}`} className="shrink-0 rounded-full border border-border bg-card px-4 py-3 text-sm font-bold transition hover:border-primary hover:text-primary">{cuisine}</Link>)}</div>
      </section>}

      {quickRecipes.length > 0 && <RecipeSection language={language} eyebrow={language === 'ar' ? 'سريع وسهل' : 'Quick & easy'} title={language === 'ar' ? 'عشا من غير حيرة.' : 'Dinner without the drama.'} recipes={quickRecipes} />}
      {recommendedRecipes.length > 0 && <RecipeSection language={language} eyebrow={language === 'ar' ? 'مقترح ليك' : 'Recommended for you'} title={language === 'ar' ? 'وصفات تستاهل التجربة.' : 'A few worth trying.'} recipes={recommendedRecipes} />}

      <section className="mt-12 grid overflow-hidden rounded-[2rem] bg-accent px-6 py-9 sm:px-10 md:grid-cols-[1.1fr_.9fr] md:px-14 md:py-14">
        <div><SectionEyebrow>{t('miniChef')}</SectionEyebrow><h2 className="mt-1 max-w-lg font-display text-4xl font-bold leading-[.95] tracking-[-.045em] text-accent-foreground sm:text-5xl">{language === 'ar' ? 'مساعدة صغيرة لما تكون محتار.' : 'A little help when your appetite is undecided.'}</h2><p className="mt-4 max-w-md text-sm leading-6 text-accent-foreground/75">{language === 'ar' ? 'افتح الشيف الصغير من الزر اللي فوق عشان تاخد اقتراح بسيط.' : 'Open Mini Chef from the top-right button whenever you want a gentle nudge.'}</p></div>
        <div className="relative mt-8 flex min-h-36 items-center justify-center md:mt-0"><div className="absolute h-32 w-32 rounded-full border-[16px] border-accent-foreground/15" /><ChefHat className="relative h-14 w-14 text-accent-foreground/65" strokeWidth={1.2} /></div>
      </section>
    </div>
  </SavorlyShell>;
}

function ActionCard({ href, icon: Icon, title, body }: { href: string; icon: typeof Compass; title: string; body: string }) {
  return <Link href={href} className="rounded-[1.35rem] border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:border-primary/50 hover:shadow-md"><Icon className="h-5 w-5 text-primary" /><h3 className="mt-7 font-display text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-5 text-muted-foreground">{body}</p></Link>;
}

function RecipeSection({ eyebrow, title, recipes, language }: { eyebrow: string; title: string; recipes: NonNullable<RecipeSearchResponse['results']>; language: 'en' | 'ar' }) {
  return <section className="mt-12"><div className="mb-4 flex items-end justify-between gap-4"><div><SectionEyebrow>{eyebrow}</SectionEyebrow><h2 className="font-display text-3xl font-bold">{title}</h2></div><Link href="/cook" className="inline-flex min-h-11 items-center gap-1 text-sm font-bold text-primary">{language === 'ar' ? 'استكشف' : 'Explore'} <ArrowRight className="h-4 w-4" /></Link></div><div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{recipes.map((recipe) => <RecipeCard key={recipe.recipeId} recipe={recipe} />)}</div></section>;
}