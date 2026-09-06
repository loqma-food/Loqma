import { ArrowLeft, Clock3, ExternalLink, Globe2, Heart, MapPin, Phone, Star } from 'lucide-react';
import { Link, useParams } from 'wouter';
import type { ReactNode } from 'react';
import type { Restaurant } from '@workspace/api-client-react';
import { SavorlyShell } from '@/components/savorly-shell';
import { useFavorites } from '@/lib/favorites-context';
import { useLanguage } from '@/lib/language-context';

function unavailable(value: unknown): value is null | undefined {
  return value === null || value === undefined || value === '';
}

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const restaurant = readRestaurant(id);
  const { isRestaurantFavorite, toggleRestaurant } = useFavorites();
  const { t, language } = useLanguage();
  if (!restaurant) return <SavorlyShell><div className="mx-auto max-w-xl px-5 py-20 text-center"><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">{language === 'ar' ? 'تفاصيل المكان' : 'Restaurant details'}</p><h1 className="mt-4 font-display text-4xl font-bold">{t('placeNotFound')}</h1><p className="mt-4 text-muted-foreground">{language === 'ar' ? 'ارجع للأماكن القريبة واختار مكان من القوائم الحقيقية.' : 'Go back to your nearby results to choose a live restaurant.'}</p><Link href="/restaurants" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 font-bold text-primary-foreground" data-testid="link-back-to-results"><ArrowLeft className="h-4 w-4" /> {t('backToPlaces')}</Link></div></SavorlyShell>;
   return <SavorlyShell>
     <div className="mobile-page mx-auto max-w-4xl px-5 pb-32 md:px-8 md:pb-16">
      <Link href="/restaurants" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-foreground" data-testid="link-back-to-results"><ArrowLeft className="h-4 w-4" /> {t('backToPlaces')}</Link>
      <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-md">
        <div className="relative aspect-[1.8/1] max-h-[28rem] overflow-hidden bg-secondary">
          {restaurant.imageUrl ? <img src={restaurant.imageUrl} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_25%_25%,hsl(var(--accent))_0_13%,transparent_14%),linear-gradient(135deg,hsl(var(--secondary)),hsl(var(--muted)))]"><div className="h-32 w-32 rounded-full border-[18px] border-secondary-foreground/25" /></div>}
          <span className="absolute left-5 top-5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-bold backdrop-blur">{restaurant.isOpenNow === true ? t('openNow') : restaurant.isOpenNow === false ? t('closedNow') : t('informationUnavailable')}</span>
        </div>
        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">{restaurant.cuisine ?? t('informationUnavailable')}</p><h1 className="mt-2 font-display text-5xl font-bold leading-[.9] tracking-[-.05em] sm:text-7xl" data-testid="text-detail-name">{restaurant.name}</h1><p className="mt-4 max-w-xl leading-7 text-muted-foreground">{restaurant.description ?? t('informationUnavailable')}</p></div>
             <button type="button" onClick={() => toggleRestaurant(restaurant)} className="touch-target flex items-center justify-center rounded-full border border-border transition hover:border-primary hover:text-primary" aria-label={isRestaurantFavorite(restaurant.id) ? t('removeRestaurant') : t('saveRestaurant')} data-testid="button-save-detail"><Heart className={`h-5 w-5 ${isRestaurantFavorite(restaurant.id) ? 'fill-primary text-primary' : ''}`} /></button>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            {!unavailable(restaurant.rating) ? <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/35 px-3 py-2 text-sm font-bold"><Star className="h-4 w-4 fill-accent text-accent-foreground" /> {restaurant.rating.toFixed(1)}{restaurant.reviewCount ? ` · ${restaurant.reviewCount} ${t('reviews')}` : ''}</span> : <Pill>{t('informationUnavailable')}</Pill>}
            <Pill>{restaurant.priceLevel ?? t('informationUnavailable')}</Pill>
            {restaurant.vegetarianAvailable === true && <Pill>{language === 'ar' ? 'اختيارات نباتية' : 'Vegetarian options'}</Pill>}
          </div>
          <div className="mt-9 grid gap-4 border-t border-border pt-7 sm:grid-cols-2">
            <DetailLine icon={MapPin} label={t('address')} value={restaurant.address} unavailableLabel={t('informationUnavailable')} />
            <DetailLine icon={Phone} label={t('phone')} value={restaurant.phone} unavailableLabel={t('informationUnavailable')} />
            <DetailLine icon={Clock3} label={t('openingHours')} value={restaurant.openingHours} unavailableLabel={t('informationUnavailable')} />
            <DetailLine icon={Globe2} label={t('source')} value={restaurant.source} unavailableLabel={t('informationUnavailable')} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`https://www.google.com/maps/search/?api=1&query=${restaurant.coordinates.lat},${restaurant.coordinates.lon}`} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5" data-testid="link-restaurant-directions">{t('directions')} <MapPin className="h-4 w-4" /></a>
            {restaurant.websiteUrl && <a href={restaurant.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border px-5 text-sm font-bold transition hover:border-primary hover:text-primary" data-testid="link-restaurant-website">{t('website')} <ExternalLink className="h-4 w-4" /></a>}
            {restaurant.menuUrl ? <a href={restaurant.menuUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border px-5 text-sm font-bold transition hover:border-primary hover:text-primary" data-testid="link-restaurant-menu">{t('menu')} <ExternalLink className="h-4 w-4" /></a> : <span className="inline-flex min-h-12 items-center rounded-full border border-dashed border-border px-5 text-sm font-bold text-muted-foreground">{t('menuUnavailable')}</span>}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-secondary p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-secondary-foreground/65">{t('reviews')}</p><p className="mt-2 font-display text-2xl font-bold text-secondary-foreground">{restaurant.reviewCount != null ? `${restaurant.reviewCount} ${language === 'ar' ? 'تقييم موثّق' : 'verified reviews'}` : t('informationUnavailable')}</p></div>
            <div className="rounded-2xl bg-secondary p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-secondary-foreground/65">{t('recommendedDish')}</p><p className="mt-2 font-display text-2xl font-bold text-secondary-foreground">{restaurant.recommendedDish ?? t('informationUnavailable')}</p></div>
          </div>
          {restaurant.disclaimer && <p className="mt-7 text-xs leading-5 text-muted-foreground">Data note: {restaurant.disclaimer}</p>}
        </div>
      </div>
    </div>
  </SavorlyShell>;
}

function Pill({ children }: { children: ReactNode }) { return <span className="inline-flex items-center rounded-full bg-muted px-3 py-2 text-sm font-bold text-muted-foreground">{children}</span>; }
function DetailLine({ icon: Icon, label, value, unavailableLabel }: { icon: typeof MapPin; label: string; value?: string | null; unavailableLabel: string }) {
  return <div className="flex gap-3"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 text-sm">{value ?? unavailableLabel}</p></div></div>;
}
function readRestaurant(id?: string): Restaurant | null {
  if (!id) return null;
  try {
    const value = sessionStorage.getItem(`savorly-restaurant-${id}`);
    return value ? JSON.parse(value) as Restaurant : null;
  } catch { return null; }
}