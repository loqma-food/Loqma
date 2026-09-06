import { Heart, Utensils } from 'lucide-react';
import { Link } from 'wouter';
import { SectionEyebrow, SavorlyShell } from '@/components/savorly-shell';
import { RecipeCard } from '@/components/recipe-ui';
import { RestaurantCard } from '@/components/restaurant-card';
import { useFavorites } from '@/lib/favorites-context';
import { useLanguage } from '@/lib/language-context';

export default function Favorites() {
  const { recipes, restaurants } = useFavorites();
  const { t, language } = useLanguage();
  const hasFavorites = recipes.length > 0 || restaurants.length > 0;

  return <SavorlyShell>
    <div className="mobile-page mx-auto max-w-6xl px-5 pb-32 md:px-8 md:pb-16">
      <section className="rounded-[1.75rem] bg-sidebar px-6 py-9 text-sidebar-foreground sm:px-10 sm:py-12">
        <SectionEyebrow>{t('yourShortlist')}</SectionEyebrow>
        <h1 className="max-w-xl font-display text-[clamp(2.7rem,11vw,5.8rem)] font-bold leading-[.9] tracking-[-.06em]">{language === 'ar' ? 'خلي الحلو ' : 'Keep the good '}<span className="text-primary">{language === 'ar' ? 'قريب.' : 'ones.'}</span></h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-sidebar-foreground/75">{language === 'ar' ? 'الوصفات والأماكن اللي بتحفظها بتفضل على جهازك لحد اللحظة الجاية.' : 'Recipes and places you save stay on this device, ready for the next hungry moment.'}</p>
      </section>

      {!hasFavorites && <div className="mt-6 rounded-[1.5rem] border border-dashed border-primary/40 bg-accent/20 px-6 py-14 text-center">
        <Heart className="mx-auto h-8 w-8 text-primary" />
        <h2 className="mt-4 font-display text-3xl font-bold">{t('quietShortlist')}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{language === 'ar' ? 'اضغط على القلب في أي وصفة أو مكان عشان يفضل قريب منك.' : 'Tap the heart on a recipe or restaurant to keep it close.'}</p>
        <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/cook" className="inline-flex min-h-12 items-center justify-center rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground">{t('browseRecipes')}</Link>
          <Link href="/eat-out" className="inline-flex min-h-12 items-center justify-center rounded-full border border-border bg-card px-5 text-sm font-bold">{t('findAPlace')}</Link>
        </div>
      </div>}

      {recipes.length > 0 && <section className="mt-10">
        <div className="mb-4 flex items-end justify-between gap-4"><div><SectionEyebrow>{language === 'ar' ? 'محفوظة للطبخ' : 'Saved to cook'}</SectionEyebrow><h2 className="font-display text-3xl font-bold">{language === 'ar' ? 'وصفات بتحبها.' : 'Recipes you love.'}</h2></div><Utensils className="h-6 w-6 text-primary" /></div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{recipes.map((recipe) => <RecipeCard key={recipe.recipeId} recipe={recipe} />)}</div>
      </section>}

      {restaurants.length > 0 && <section className="mt-10">
        <SectionEyebrow>{language === 'ar' ? 'محفوظة لبعدين' : 'Saved for later'}</SectionEyebrow>
        <h2 className="mb-4 font-display text-3xl font-bold">{language === 'ar' ? 'أماكن تستاهل الزيارة.' : 'Places worth a visit.'}</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{restaurants.map((restaurant) => <RestaurantCard key={restaurant.id} restaurant={restaurant} />)}</div>
      </section>}
    </div>
  </SavorlyShell>;
}