import { ArrowRight, LocateFixed, MapPin, SlidersHorizontal } from 'lucide-react';
import { useState } from 'react';
import { useLocation } from 'wouter';
import { LocationPill, SectionEyebrow, SavorlyShell } from '@/components/savorly-shell';
import { useLanguage } from '@/lib/language-context';

const locations = [
  { label: 'Cairo, Egypt', detail: 'Start with live listings in Cairo', lat: 30.0444, lon: 31.2357 },
  { label: 'Giza, Egypt', detail: 'Explore restaurants around Giza', lat: 30.0131, lon: 31.2089 },
  { label: 'Alexandria, Egypt', detail: 'Sea breeze and local favorites', lat: 31.2001, lon: 29.9187 },
  { label: 'Mansoura, Egypt', detail: 'Local listings in Mansoura', lat: 31.0409, lon: 31.3785 },
  { label: 'Tanta, Egypt', detail: 'Browse places around Tanta', lat: 30.7865, lon: 31.0004 },
  { label: 'Zagazig, Egypt', detail: 'Search live listings in Zagazig', lat: 30.5877, lon: 31.502 },
  { label: 'Ismailia, Egypt', detail: 'Restaurants around Ismailia', lat: 30.5965, lon: 32.2715 },
  { label: 'Suez, Egypt', detail: 'Live places around Suez', lat: 29.9668, lon: 32.5498 },
  { label: 'Port Said, Egypt', detail: 'Explore Port Said listings', lat: 31.2653, lon: 32.3019 },
  { label: 'Hurghada, Egypt', detail: 'Browse places by the Red Sea', lat: 27.2579, lon: 33.8116 },
  { label: 'Sharm El Sheikh, Egypt', detail: 'Explore Sharm listings', lat: 27.9158, lon: 34.3299 },
  { label: 'Luxor, Egypt', detail: 'Find live places in Luxor', lat: 25.6872, lon: 32.6396 },
  { label: 'Aswan, Egypt', detail: 'Browse restaurants in Aswan', lat: 24.0889, lon: 32.8998 },
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
  const { language, t } = useLanguage();
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
     <div className="mobile-page mx-auto max-w-3xl px-5 pb-32 md:px-8 md:pb-16">
      <div className="mb-10">
        <SectionEyebrow>{t('eatOut')}</SectionEyebrow>
        <h1 className="max-w-2xl font-display text-5xl font-bold leading-[.92] tracking-[-0.05em] sm:text-7xl">{language === 'ar' ? 'نلاقي لك ' : 'Let’s find your '}<span className="text-primary">{language === 'ar' ? 'سهرة حلوة' : 'kind'}</span>{language === 'ar' ? '.' : ' of night.'}</h1>
        <p className="mt-5 max-w-lg leading-7 text-muted-foreground">{language === 'ar' ? 'اختار المكان والميزانية وسيب الباقي على قوائم حقيقية قريبة منك.' : 'Choose a place and budget, then browse real nearby listings.'}</p>
      </div>
      <div className="space-y-8">
        <section className="rounded-[1.7rem] border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="flex items-start justify-between gap-4">
            <div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">01 / {language === 'ar' ? 'المكان' : 'Where'}</p><h2 className="mt-2 font-display text-2xl font-bold">{language === 'ar' ? 'اختار مدينة' : 'Pick a city'}</h2></div>
            <MapPin className="h-6 w-6 text-primary" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-2 rounded-2xl bg-secondary p-1">
            <button onClick={useMyLocation} className={`min-h-11 rounded-xl px-3 text-sm font-bold transition ${locationMode === 'near' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`} data-testid="button-location-near-me">{t('nearMe')}</button>
            <button onClick={() => setLocationMode('choose')} className={`min-h-11 rounded-xl px-3 text-sm font-bold transition ${locationMode === 'choose' ? 'bg-card text-foreground shadow-sm' : 'text-muted-foreground'}`} data-testid="button-location-choose">{t('chooseLocation')}</button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {locations.map((item) => <button key={item.label} onClick={() => { setLocationMode('choose'); setSelectedLocation(item); }} className={`rounded-2xl border p-4 text-left transition ${selectedLocation.label === item.label && locationMode === 'choose' ? 'border-primary bg-primary/8 ring-2 ring-primary/15' : 'border-border hover:border-primary/50'}`} data-testid={`button-location-${item.label.toLowerCase().replaceAll(' ', '-')}`}>
              <span className="block text-sm font-bold">{item.label}</span><span className="mt-1 block text-xs leading-4 text-muted-foreground">{item.detail}</span>
            </button>)}
          </div>
           <button onClick={useMyLocation} disabled={locating} className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-full border border-border px-4 text-sm font-bold transition hover:border-primary hover:text-primary disabled:opacity-60" data-testid="button-use-current-location"><LocateFixed className="h-4 w-4" />{locating ? t('locating') : t('useCurrentLocation')}</button>
        </section>

        <section className="rounded-[1.7rem] border border-border bg-card p-5 shadow-sm sm:p-7">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">02 / {language === 'ar' ? 'الميزانية' : 'Budget'}</p><h2 className="mt-2 font-display text-2xl font-bold">{language === 'ar' ? 'عايز تصرف كام؟' : 'What’s the spend?'}</h2></div><SlidersHorizontal className="h-6 w-6 text-primary" /></div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {budgets.map((item) => <button key={item.value} onClick={() => setBudget(item.value)} className={`flex items-center gap-4 rounded-2xl border p-4 text-left transition ${budget === item.value ? 'border-primary bg-primary/8 ring-2 ring-primary/15' : 'border-border hover:border-primary/50'}`} data-testid={`button-budget-${item.value}`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-secondary text-sm font-bold text-secondary-foreground">{item.price}</span><span><span className="block text-sm font-bold">{item.label}</span><span className="mt-0.5 block text-xs text-muted-foreground">{item.detail}</span></span>
            </button>)}
          </div>
        </section>

        <section className="rounded-[1.7rem] border border-border bg-card p-5 shadow-sm sm:p-7">
          <div><p className="text-xs font-bold uppercase tracking-[.14em] text-primary">03 / {language === 'ar' ? 'اختياري' : 'Optional'}</p><h2 className="mt-2 font-display text-2xl font-bold">{language === 'ar' ? 'في بالك حاجة معينة؟' : 'Any words in mind?'}</h2></div>
           <input value={query} onChange={(event) => setQuery(event.target.value)} enterKeyHint="search" placeholder={language === 'ar' ? 'جرّب «مكرونة» أو «خروجة» أو «تراس»' : 'Try “noodles”, “date night”, or “patio”'} className="mt-5 min-h-14 w-full rounded-2xl border border-input bg-background px-4 text-sm outline-none transition placeholder:text-muted-foreground/65 focus:border-primary focus:ring-4 focus:ring-primary/10" data-testid="input-search-preference" />
        </section>
      </div>
       <div className="safe-bottom sticky bottom-16 mt-8 flex items-center justify-between gap-4 rounded-[1.4rem] border border-border bg-background/90 p-3 backdrop-blur-xl md:bottom-5">
        <div className="hidden pl-3 sm:block"><LocationPill>{selectedLocation.label}</LocationPill></div>
         <button onClick={findPlaces} className="ml-auto inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary px-7 text-base font-bold text-primary-foreground shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" data-testid="button-find-places">{t('showMePlaces')} <ArrowRight className="h-5 w-5" /></button>
      </div>
    </div>
  </SavorlyShell>;
}