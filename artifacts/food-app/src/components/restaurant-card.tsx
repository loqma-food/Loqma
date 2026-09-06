import { ArrowUpRight, Clock3, Heart, MapPin, Star } from 'lucide-react';
import type { Restaurant } from '@workspace/api-client-react';
import { Link } from 'wouter';
import { useFavorites } from '@/lib/favorites-context';
import { useLanguage } from '@/lib/language-context';

function unavailable(value: unknown): value is null | undefined {
  return value === null || value === undefined || value === '';
}

export function RestaurantCard({ restaurant, index = 0 }: { restaurant: Restaurant; index?: number }) {
  const { isRestaurantFavorite, toggleRestaurant } = useFavorites();
  const { t, language } = useLanguage();
  const saved = isRestaurantFavorite(restaurant.id);
  const distance = unavailable(restaurant.distanceMeters) ? null : restaurant.distanceMeters < 1000 ? `${Math.round(restaurant.distanceMeters)} m` : `${(restaurant.distanceMeters / 1000).toFixed(1)} km`;
  const hasImage = !unavailable(restaurant.imageUrl);
  return (
    <article className="group animate-rise-in overflow-hidden rounded-[1.45rem] border border-card-border bg-card shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-md" style={{ animationDelay: `${Math.min(index * 70, 350)}ms` }} data-testid={`card-restaurant-${restaurant.id}`}>
      <div className="relative aspect-[1.55/1] overflow-hidden bg-secondary">
         {hasImage ? <img src={restaurant.imageUrl!} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="relative flex h-full items-center justify-center bg-[radial-gradient(circle_at_25%_25%,hsl(var(--accent))_0_12%,transparent_13%),linear-gradient(135deg,hsl(var(--secondary)),hsl(var(--muted)))]"><UtensilArt /><span className="absolute bottom-3 rounded-full bg-card/80 px-2.5 py-1 text-[11px] font-bold text-muted-foreground">{t('informationUnavailable')}</span></div>}
        <div className="absolute left-3 top-3 flex gap-2">
          {restaurant.isOpenNow === true && <span className="rounded-full bg-card/95 px-2.5 py-1 text-[11px] font-bold text-secondary-foreground backdrop-blur">{t('openNow')}</span>}
          {restaurant.isOpenNow === false && <span className="rounded-full bg-foreground/80 px-2.5 py-1 text-[11px] font-bold text-background backdrop-blur">{t('closedNow')}</span>}
        </div>
         <button type="button" onClick={() => toggleRestaurant(restaurant)} className="touch-target absolute right-2 top-2 flex items-center justify-center rounded-full bg-card/95 text-foreground shadow-sm backdrop-blur transition hover:scale-105 hover:text-primary" aria-label={saved ? t('removeRestaurant') : t('saveRestaurant')} data-testid={`button-save-restaurant-${restaurant.id}`}>
           <Heart className={`h-4 w-4 ${saved ? 'fill-primary text-primary' : ''}`} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-display text-[1.35rem] font-bold leading-tight" data-testid={`text-restaurant-name-${restaurant.id}`}>{restaurant.name}</h3>
             <p className="mt-1 truncate text-sm text-muted-foreground">{unavailable(restaurant.cuisine) ? t('informationUnavailable') : restaurant.cuisine}</p>
          </div>
          <Link href={`/restaurants/${encodeURIComponent(restaurant.id)}`} onClick={() => { try { sessionStorage.setItem(`savorly-restaurant-${restaurant.id}`, JSON.stringify(restaurant)); } catch { /* storage can be unavailable in private browsing */ } }} className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition hover:bg-primary hover:text-primary-foreground" aria-label={`View ${restaurant.name}`} data-testid={`link-restaurant-${restaurant.id}`}>
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs font-semibold">
          {!unavailable(restaurant.rating) ? <span className="inline-flex items-center gap-1 text-foreground"><Star className="h-3.5 w-3.5 fill-accent text-accent-foreground" />{restaurant.rating.toFixed(1)}{restaurant.reviewCount ? <span className="font-normal text-muted-foreground">({restaurant.reviewCount})</span> : null}</span> : <span className="text-muted-foreground">{t('informationUnavailable')}</span>}
          {!unavailable(restaurant.priceLevel) && <span className="text-muted-foreground">{restaurant.priceLevel}</span>}
          {distance && <span className="inline-flex items-center gap-1 text-muted-foreground"><MapPin className="h-3 w-3" />{distance}</span>}
        </div>
        <div className="mt-4 flex items-center gap-1.5 border-t border-border/70 pt-3 text-xs text-muted-foreground">
          <Clock3 className="h-3.5 w-3.5" />
           {restaurant.isOpenNow === true ? (language === 'ar' ? 'مفتوح اليوم' : 'Open today') : restaurant.isOpenNow === false ? (language === 'ar' ? 'راجع المواعيد' : 'Check hours') : t('informationUnavailable')}
        </div>
      </div>
    </article>
  );
}

function UtensilArt() {
  return <div className="relative h-20 w-24 opacity-50"><div className="absolute left-3 top-9 h-7 w-16 rounded-[50%] border-4 border-secondary-foreground/35" /><div className="absolute left-9 top-2 h-12 w-1 rounded-full bg-secondary-foreground/35" /><div className="absolute left-7 top-2 h-5 w-5 rounded-full border-4 border-secondary-foreground/35" /></div>;
}