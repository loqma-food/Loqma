import { ArrowRight, LocateFixed, MapPin, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { LocationPill, SectionEyebrow, SavorlyShell } from '@/components/savorly-shell';

const locations = [
  { label: 'Downtown San Francisco', detail: 'A lively starting point', lat: 37.7879, lon: -122.4074 },
  { label: 'Mission District', detail: 'Colorful, late-night energy', lat: 37.7599, lon: -122.4148 },
  { label: 'North Beach', detail: 'Old-school favorites', lat: 37.806, lon: -122.4103 },
];
const budgets = [
  { value: 'budget', label: 'Budget', price: '$', detail: 'Simple and satisfying' },
  { value: 'moderate', label: 'Moderate', price: '$$', detail: 'The sweet spot' },
  { value: 'premium', label: 'Premium', price: '$$$', detail: 'Make it a night' },
  { value: 'luxury', label: 'Luxury', price: '$$$$', detail: 'A special occasion' },
  { value: 'any', label: 'Any Budget', price: '•••', detail: 'Follow the good stuff' },
];

export default function EatOut() {
  const [, setLocation] = useLocation();
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [locationMode, setLocationMode] = useState<'near' | 'choose'>('choose');
  const [budget, setBudget] = useState('moderate');
  const [query, setQuery] = useState('');
  const [locating, setLocating] = useState(false);
  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setLocationMode('near');
    setLocating(true);
    navigator.geolocation.getCurrentPosition((position) => {
      setSelectedLocation({ label: 'Your current location', detail: 'Using your device location', lat: position.coords.latitude, lon: position.coords.longitude });
      setLocating(false);
    }, () => setLocating(false));
  };
  const findPlaces = () => {
    const params = new URLSearchParams({ lat: String(selectedLocation.lat), lon: String(selectedLocation.lon), budget });
    if (query.trim()) params.set('query', query.trim());
    setLocation(`/restaurants?${params.toString()}`);
  };
  return <SavorlyShell>
    <div className="mx-auto max-w-3xl px-5 pb-28 md:px-8 md:pb-16">
      <div className="mb-10">
        <SectionEyebrow>Eat out</SectionEyebrow>
        <h1 className="max-w-2xl font-display text-5xl font-bold leading-[.92] tracking-[-0.05em] sm:text-7xl">Let’s find your <span className="text-primary">kind</span> of night.</h1>
        <p className="mt-5 max-w-lg leading-7 text-muted-foreground">A few gentle signals are all we need. You can change everything on the results page.</p>
      </div>
      <div className="space-y-8">
        <section className="rounded-[1.7rem] border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">01 / Where</p><h2 className="mt-2 font-display text-2xl font-bold">Pick a neighborhood</h2></div>
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-secondary p-1">
            <button onClick={useMyLocation} className={`min-h-11 rounded-xl px-3 text-sm font-bold transition ${locationMode === 'near' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`} data-testid="button-location-near-me">Near Me</button>
            <button onClick={() => setLocationMode('choose')} className={`min-h-11 rounded-xl px-3 text-sm font-bold transition ${locationMode === 'choose' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`} data-testid="button-location-choose">Choose Location</button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {locations.map((item) => <button key={item.label} onClick={() => { setLocationMode('choose'); setSelectedLocation(item); }} className={`rounded-2xl border p-4 text-left transition ${selectedLocation.label === item.label && locationMode === 'choose' ? 'border-primary bg-primary/8 ring-2 ring-primary/15' : 'border-border hover:border-primary/50'}`} data-testid={`button-location-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
              <span className="block text-sm font-bold">{item.label}</span><span className="mt-1 block text-xs leading-4 text-muted-foreground">{item.detail}</span>
            </button>)}
          </div>
           <button onClick={useMyLocation} disabled={locating} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-bold transition hover:border-primary hover:text-primary disabled:opacity-60" data-testid="button-use-current-location"><LocateFixed className="h-4 w-4" />{locating ? 'Locating…' : 'Use my current location'}</button>
        </section>

        <section className="rounded-[1.7rem] border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">02 / Feeling</p><h2 className="mt-2 font-display text-2xl font-bold">What’s the spend?</h2></div><SlidersHorizontal className="h-6 w-6 text-primary" /></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {budgets.map((item) => <button key={item.value} onClick={() => setBudget(item.value)} className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${budget === item.value ? 'border-primary bg-primary/8 ring-2 ring-primary/15' : 'border-border hover:border-primary/50'}`} data-testid={`button-budget-${item.value}`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-secondary-foreground">{item.price}</span><span><span className="block text-sm font-bold">{item.label}</span><span className="mt-0.5 block text-xs text-muted-foreground">{item.detail}</span></span>
            </button>)}
          </div>
        </section>

        <section className="rounded-[1.7rem] border border-border bg-card p-5 shadow-sm sm:p-7">
          <div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">03 / Optional</p><h2 className="mt-2 font-display text-2xl font-bold">Any words in mind?</h2></div>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try “noodles”, “date night”, or “patio”" className="mt-5 min-h-14 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground/65 focus:border-primary focus:ring-4 focus:ring-primary/10" data-testid="input-search-preference" />
        </section>
      </div>
      <div className="sticky bottom-16 mt-8 flex items-center justify-between gap-4 rounded-[1.4rem] border border-border bg-background/90 p-3 backdrop-blur-xl md:bottom-5">
        <div className="hidden pl-3 sm:block"><LocationPill>{selectedLocation.label}</LocationPill></div>
        <button onClick={findPlaces} className="ml-auto inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary px-7 text-base font-bold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" data-testid="button-find-places">Show me places <ArrowRight className="h-5 w-5" /></button>
      </div>
    </div>
  </SavorlyShell>;
}