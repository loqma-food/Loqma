import { Compass, Heart, Home, MapPin, UserRound, Utensils } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useState, type ReactNode } from 'react';
import { useLanguage } from '@/lib/language-context';
import { MiniChefPanel } from '@/components/mini-chef';

type SavorlyShellProps = { children: ReactNode; showChef?: boolean };

export function BrandMark() {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="Loqma home">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-[13px] bg-primary text-primary-foreground shadow-sm">
        <span className="absolute h-5 w-5 rounded-full border-2 border-current" />
        <span className="absolute h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.35rem] font-bold tracking-[-0.04em]" dir="rtl">لقمة</span>
        <span className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.12em] text-muted-foreground">Loqma</span>
      </span>
    </span>
  );
}

function ChefNudge({ onDismiss }: { onDismiss: () => void }) {
  const { language, t } = useLanguage();
  return (
    <MiniChefPanel mobileOverlay className="animate-rise-in fixed bottom-[calc(4.9rem+env(safe-area-inset-bottom))] right-4 z-40 w-[min(19rem,calc(100vw-2rem))] bg-sidebar text-sidebar-foreground shadow-[0_18px_40px_hsl(164_35%_12%/.22)] md:bottom-6 md:right-6" onClose={onDismiss} cue={language === 'ar' ? 'اختار وصفة من المطبخ أو دور على مكان حقيقي قريب منك.' : 'Pick a recipe to cook at home, or find a real place nearby.'} footer={<div className="flex flex-wrap gap-2"><Link href="/cook" className="inline-flex min-h-10 items-center rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5" data-testid="link-mini-chef-recipes">{t('cook')}</Link><Link href="/eat-out" className="inline-flex min-h-10 items-center rounded-full border border-sidebar-foreground/20 px-4 text-sm font-bold text-sidebar-foreground transition hover:border-primary" data-testid="link-mini-chef-ideas">{t('findAPlace')}</Link></div>} />
  );
}

export function SavorlyShell({ children, showChef = false }: SavorlyShellProps) {
  const [location] = useLocation();
  const [chefOpen, setChefOpen] = useState(false);
  const { t } = useLanguage();
  const navItems = [
    { href: '/', label: t('home'), icon: Home },
    { href: '/cook', label: t('cook'), icon: Utensils },
    { href: '/eat-out', label: t('eatOut'), icon: Compass },
    { href: '/favorites', label: t('favorites'), icon: Heart },
    { href: '/profile', label: t('profile'), icon: UserRound },
  ];
  return (
    <div className="grain min-h-[100dvh] overflow-x-hidden bg-background">
      <header className="safe-top mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-4 md:px-8 md:py-7">
        <Link href="/" className="transition hover:opacity-80" data-testid="link-brand-home"><BrandMark /></Link>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground sm:inline-flex">{t('everyBite')}</span>
          <button onClick={() => setChefOpen((value) => !value)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:-translate-y-0.5 hover:border-primary" aria-label={t('miniChef')} data-testid="button-toggle-mini-chef">
            <Utensils className="h-4 w-4" />
          </button>
        </div>
      </header>
      <main>{children}</main>
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-background/95 px-2 pt-1.5 backdrop-blur-xl md:hidden" aria-label="Primary navigation">
        <div className="mx-auto flex max-w-md items-stretch justify-around gap-0.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = location === href || (href === '/cook' && location.startsWith('/recipes')) || (href === '/eat-out' && location.startsWith('/restaurants'));
            return <Link key={href} href={href} className={`flex min-h-14 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-0.5 py-1.5 text-[10px] font-bold transition ${active ? 'text-primary' : 'text-muted-foreground'}`} data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}>
              <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 1.8} />
              {label}
            </Link>;
          })}
        </div>
      </nav>
      {chefOpen && showChef && <ChefNudge onDismiss={() => setChefOpen(false)} />}
    </div>
  );
}

export function SectionEyebrow({ children }: { children: ReactNode }) {
  return <p className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary"><span className="h-1.5 w-1.5 rounded-full bg-primary" />{children}</p>;
}

export function LocationPill({ children }: { children: ReactNode }) {
  return <span className="inline-flex items-center gap-1.5 rounded-full bg-accent/35 px-3 py-1.5 text-xs font-bold text-accent-foreground"><MapPin className="h-3.5 w-3.5" />{children}</span>;
}

export function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();
  return <div className="inline-flex items-center rounded-full border border-border bg-card p-1" aria-label={t('language')} data-testid="language-selector">
    <button type="button" onClick={() => setLanguage('en')} className={`min-h-10 rounded-full px-3 text-xs font-bold transition ${language === 'en' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`} aria-pressed={language === 'en'}>{t('english')}</button>
    <button type="button" onClick={() => setLanguage('ar')} className={`min-h-10 rounded-full px-3 text-xs font-bold transition ${language === 'ar' ? 'bg-primary text-primary-foreground' : 'text-muted-foreground'}`} aria-pressed={language === 'ar'}>{t('arabic')}</button>
  </div>;
}