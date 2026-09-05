import { ArrowLeft, Clock3, ExternalLink, Globe2, Heart, MapPin, Phone, Star } from 'lucide-react';
import { Link, useParams } from 'wouter';
import type { ReactNode } from 'react';
import type { Restaurant } from '@workspace/api-client-react';
import { SavorlyShell } from '@/components/savorly-shell';

function unavailable(value: unknown): value is null | undefined {
  return value === null || value === undefined || value === '';
}

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const restaurant = readRestaurant(id);
  if (!restaurant) return <SavorlyShell><div className="mx-auto max-w-xl px-5 py-20 text-center"><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Restaurant details</p><h1 className="mt-4 font-display text-4xl font-bold">This place is not in your current shortlist.</h1><p className="mt-4 text-muted-foreground">Go back to your nearby results to choose a live restaurant.</p><Link href="/restaurants" className="mt-7 inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-6 font-bold text-primary-foreground" data-testid="link-back-to-results"><ArrowLeft className="h-4 w-4" /> Back to results</Link></div></SavorlyShell>;
  return <SavorlyShell>
    <div className="mx-auto max-w-4xl px-5 pb-28 md:px-8 md:pb-16">
      <Link href="/restaurants" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-foreground" data-testid="link-back-to-results"><ArrowLeft className="h-4 w-4" /> Back to nearby places</Link>
      <div className="overflow-hidden rounded-[2rem] border border-border bg-card shadow-md">
        <div className="relative aspect-[1.8/1] max-h-[28rem] overflow-hidden bg-secondary">
          {restaurant.imageUrl ? <img src={restaurant.imageUrl} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center bg-[radial-gradient(circle_at_25%_25%,hsl(var(--accent))_0_13%,transparent_14%),linear-gradient(135deg,hsl(var(--secondary)),hsl(var(--muted)))]"><div className="h-32 w-32 rounded-full border-[18px] border-secondary-foreground/25" /></div>}
          <span className="absolute left-5 top-5 rounded-full bg-card/90 px-3 py-1.5 text-xs font-bold backdrop-blur">{restaurant.isOpenNow === true ? 'Open now' : restaurant.isOpenNow === false ? 'Closed now' : 'Information unavailable'}</span>
        </div>
        <div className="p-6 sm:p-10">
          <div className="flex flex-wrap items-start justify-between gap-5">
            <div><p className="text-xs font-bold uppercase tracking-[.16em] text-primary">{restaurant.cuisine ?? 'Information unavailable'}</p><h1 className="mt-2 font-display text-5xl font-bold leading-[.9] tracking-[-.05em] sm:text-7xl" data-testid="text-detail-name">{restaurant.name}</h1><p className="mt-4 max-w-xl leading-7 text-muted-foreground">{restaurant.description ?? 'Information unavailable'}</p></div>
            <button className="flex h-12 w-12 items-center justify-center rounded-full border border-border transition hover:border-primary hover:text-primary" aria-label={`Save ${restaurant.name}`} data-testid="button-save-detail"><Heart className="h-5 w-5" /></button>
          </div>
          <div className="mt-7 flex flex-wrap gap-3">
            {!unavailable(restaurant.rating) ? <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/35 px-3 py-2 text-sm font-bold"><Star className="h-4 w-4 fill-accent text-accent-foreground" /> {restaurant.rating.toFixed(1)}{restaurant.reviewCount ? ` · ${restaurant.reviewCount} reviews` : ''}</span> : <Pill>Information unavailable</Pill>}
            <Pill>{restaurant.priceLevel ?? 'Information unavailable'}</Pill>
            {restaurant.vegetarianAvailable === true && <Pill>Vegetarian options</Pill>}
          </div>
          <div className="mt-9 grid gap-4 border-t border-border pt-7 sm:grid-cols-2">
            <DetailLine icon={MapPin} label="Address" value={restaurant.address} />
            <DetailLine icon={Phone} label="Phone" value={restaurant.phone} />
            <DetailLine icon={Clock3} label="Opening hours" value={restaurant.openingHours} />
            <DetailLine icon={Globe2} label="Source" value={restaurant.source} />
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={`https://www.google.com/maps/search/?api=1&query=${restaurant.coordinates.lat},${restaurant.coordinates.lon}`} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5" data-testid="link-restaurant-directions">Directions <MapPin className="h-4 w-4" /></a>
            {restaurant.websiteUrl && <a href={restaurant.websiteUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border px-5 text-sm font-bold transition hover:border-primary hover:text-primary" data-testid="link-restaurant-website">Website <ExternalLink className="h-4 w-4" /></a>}
            {restaurant.menuUrl ? <a href={restaurant.menuUrl} target="_blank" rel="noreferrer" className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border px-5 text-sm font-bold transition hover:border-primary hover:text-primary" data-testid="link-restaurant-menu">View menu <ExternalLink className="h-4 w-4" /></a> : <span className="inline-flex min-h-12 items-center rounded-full border border-dashed border-border px-5 text-sm font-bold text-muted-foreground">Menu unavailable</span>}
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-secondary p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-secondary-foreground/65">Reviews</p><p className="mt-2 font-display text-2xl font-bold text-secondary-foreground">{restaurant.reviewCount != null ? `${restaurant.reviewCount} verified reviews` : 'Information unavailable'}</p></div>
            <div className="rounded-2xl bg-secondary p-5"><p className="text-xs font-bold uppercase tracking-[.14em] text-secondary-foreground/65">Recommended dish</p><p className="mt-2 font-display text-2xl font-bold text-secondary-foreground">{restaurant.recommendedDish ?? 'Information unavailable'}</p></div>
          </div>
          {restaurant.disclaimer && <p className="mt-7 text-xs leading-5 text-muted-foreground">Data note: {restaurant.disclaimer}</p>}
        </div>
      </div>
    </div>
  </SavorlyShell>;
}

function Pill({ children }: { children: ReactNode }) { return <span className="inline-flex items-center rounded-full bg-muted px-3 py-2 text-sm font-bold text-muted-foreground">{children}</span>; }
function DetailLine({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value?: string | null }) {
  return <div className="flex gap-3"><Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" /><div><p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{label}</p><p className="mt-1 text-sm">{value ?? 'Information unavailable'}</p></div></div>;
}
function readRestaurant(id?: string): Restaurant | null {
  if (!id) return null;
  try {
    const value = sessionStorage.getItem(`savorly-restaurant-${id}`);
    return value ? JSON.parse(value) as Restaurant : null;
  } catch { return null; }
}