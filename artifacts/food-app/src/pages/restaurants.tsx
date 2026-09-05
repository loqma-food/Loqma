import { ArrowLeft, Filter, LocateFixed, RefreshCw, SlidersHorizontal, Utensils } from 'lucide-react';
import { useMemo, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { getListRestaurantsQueryKey, useListRestaurants } from '@workspace/api-client-react';
import { RestaurantCard } from '@/components/restaurant-card';
import { SavorlyShell } from '@/components/savorly-shell';

const cuisines = ['Any cuisine', 'Italian', 'Japanese', 'Mexican', 'Indian', 'Thai'];

export default function Restaurants() {
  const [location] = useLocation();
  const search = useMemo(() => new URLSearchParams(location.split('?')[1] ?? ''), [location]);
  const [query, setQuery] = useState(search.get('query') ?? '');
  const [cuisine, setCuisine] = useState('');
  const [openNow, setOpenNow] = useState(false);
  const [vegetarian, setVegetarian] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const params = useMemo(() => ({
    lat: Number(search.get('lat') ?? 37.7879),
    lon: Number(search.get('lon') ?? -122.4074),
    radius: 5000,
    budget: (search.get('budget') ?? 'any') as 'budget' | 'moderate' | 'premium' | 'luxury' | 'any',
    ...(query.trim() ? { query: query.trim() } : {}),
    ...(cuisine ? { cuisine } : {}),
    ...(openNow ? { openNow: true } : {}),
    ...(vegetarian ? { vegetarian: true } : {}),
  }), [search, query, cuisine, openNow, vegetarian]);
  const { data, isLoading, isError, refetch } = useListRestaurants(params, { query: { queryKey: getListRestaurantsQueryKey(params) } });
  const results = data?.results ?? [];
  return <SavorlyShell>
    <div className="mx-auto max-w-6xl px-5 pb-28 md:px-8 md:pb-16">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <Link href="/eat-out" className="mb-7 inline-flex items-center gap-2 text-sm font-bold text-muted-foreground transition hover:text-foreground" data-testid="link-back-to-eat-out"><ArrowLeft className="h-4 w-4" /> Adjust your search</Link>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-primary">Nearby, right now</p>
          <h1 className="mt-3 font-display text-5xl font-bold leading-[.9] tracking-[-.05em] sm:text-7xl">Good places<br /><span className="text-primary">this way.</span></h1>
        </div>
        <button onClick={() => setFiltersOpen((value) => !value)} className="inline-flex min-h-12 items-center gap-2 rounded-full border border-border bg-card px-5 text-sm font-bold transition hover:border-primary hover:text-primary" data-testid="button-toggle-filters"><Filter className="h-4 w-4" /> Filters {results.length ? <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{results.length}</span> : null}</button>
      </div>
      <div className={`mt-8 overflow-hidden rounded-[1.4rem] border border-border bg-card transition-all ${filtersOpen ? 'max-h-96 p-4 opacity-100 sm:p-5' : 'max-h-0 border-transparent p-0 opacity-0'}`}>
        <div className="grid gap-4 sm:grid-cols-[1.5fr_1fr_auto_auto] sm:items-end">
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Search<input value={query} onChange={(event) => setQuery(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-primary" placeholder="Cuisine or mood" data-testid="input-filter-search" /></label>
          <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Cuisine<select value={cuisine} onChange={(event) => setCuisine(event.target.value === 'Any cuisine' ? '' : event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-normal normal-case tracking-normal outline-none focus:border-primary" data-testid="select-cuisine">{cuisines.map((item) => <option key={item}>{item}</option>)}</select></label>
          <button onClick={() => setOpenNow((value) => !value)} className={`min-h-11 rounded-xl border px-3 text-sm font-bold transition ${openNow ? 'border-primary bg-primary/10 text-primary' : 'border-input'}`} data-testid="button-filter-open">{openNow ? 'Open now' : 'Any hours'}</button>
          <button onClick={() => setVegetarian((value) => !value)} className={`min-h-11 rounded-xl border px-3 text-sm font-bold transition ${vegetarian ? 'border-primary bg-primary/10 text-primary' : 'border-input'}`} data-testid="button-filter-vegetarian">{vegetarian ? 'Vegetarian' : 'Any menu'}</button>
        </div>
      </div>
      <div className="mt-8 flex items-center justify-between gap-4 text-sm text-muted-foreground">
        <p data-testid="text-results-summary">{isLoading ? 'Looking around…' : isError ? 'We hit a small snag.' : `${results.length} ${results.length === 1 ? 'place' : 'places'} to consider`}</p>
        <p className="hidden items-center gap-1.5 sm:flex"><LocateFixed className="h-4 w-4" /> Live local listings</p>
      </div>
      {isLoading && <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{[1, 2, 3, 4, 5, 6].map((item) => <SkeletonCard key={item} />)}</div>}
      {isError && <StatePanel title="The neighborhood map is taking a breather." body="We could not load live places just now. Try once more in a moment." action={<button onClick={() => refetch()} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground" data-testid="button-retry-restaurants"><RefreshCw className="h-4 w-4" /> Try again</button>} />}
      {!isLoading && !isError && results.length === 0 && <StatePanel title="Nothing quite matched." body="Try a wider radius, another cuisine, or let the filters go for a minute." action={<button onClick={() => { setCuisine(''); setOpenNow(false); setVegetarian(false); setQuery(''); }} className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground" data-testid="button-clear-filters"><SlidersHorizontal className="h-4 w-4" /> Clear filters</button>} />}
      {!isLoading && !isError && results.length > 0 && <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{results.map((restaurant, index) => <RestaurantCard key={restaurant.id} restaurant={restaurant} index={index} />)}</div>}
      {data?.searchedAt && <p className="mt-8 text-xs text-muted-foreground">Updated {new Date(data.searchedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })} · {data.source}</p>}
    </div>
  </SavorlyShell>;
}

function SkeletonCard() {
  return <div className="overflow-hidden rounded-[1.45rem] border border-border bg-card"><div className="skeleton-shimmer aspect-[1.55/1]" /><div className="space-y-3 p-4"><div className="skeleton-shimmer h-6 w-3/4 rounded" /><div className="skeleton-shimmer h-4 w-1/3 rounded" /><div className="skeleton-shimmer h-4 w-1/2 rounded" /></div></div>;
}
function StatePanel({ title, body, action }: { title: string; body: string; action: ReactNode }) {
  return <div className="mt-6 flex min-h-80 flex-col items-center justify-center rounded-[1.7rem] border border-dashed border-border bg-card px-6 text-center"><div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary text-secondary-foreground"><Utensils className="h-7 w-7" /></div><h2 className="mt-5 font-display text-2xl font-bold">{title}</h2><p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{body}</p><div className="mt-5">{action}</div></div>;
}