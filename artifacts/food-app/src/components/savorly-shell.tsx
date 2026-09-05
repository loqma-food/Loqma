import { Compass, Home, MapPin, Utensils, X } from 'lucide-react';
import { Link, useLocation } from 'wouter';
import { useState, type ReactNode } from 'react';

type SavorlyShellProps = { children: ReactNode; showChef?: boolean };

export function BrandMark() {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="Savorly home">
      <span className="relative flex h-9 w-9 items-center justify-center rounded-[13px] bg-primary text-primary-foreground shadow-sm">
        <span className="absolute h-5 w-5 rounded-full border-2 border-current" />
        <span className="absolute h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      <span className="font-display text-[1.6rem] font-bold tracking-[-0.04em]">savorly</span>
    </span>
  );
}

function ChefNudge({ onDismiss }: { onDismiss: () => void }) {
  return (
    <aside className="animate-rise-in fixed bottom-20 right-4 z-40 w-[min(19rem,calc(100vw-2rem))] rounded-[1.4rem] border border-secondary-border bg-sidebar p-4 text-sidebar-foreground shadow-[0_18px_40px_hsl(164_35%_12%/.22)] md:bottom-6 md:right-6" data-testid="card-mini-chef">
      <button onClick={onDismiss} className="absolute right-3 top-3 rounded-full p-1.5 text-sidebar-foreground/60 transition hover:bg-sidebar-accent hover:text-sidebar-foreground" aria-label="Dismiss Mini Chef" data-testid="button-dismiss-mini-chef">
        <X className="h-4 w-4" />
      </button>
      <div className="mb-3 flex items-center gap-3">
        <div className="animate-float-soft flex h-11 w-11 items-center justify-center rounded-2xl bg-accent text-accent-foreground">
          <Utensils className="h-5 w-5" />
        </div>
        <div>
          <p className="text-sm font-bold">Mini Chef</p>
          <p className="text-xs text-sidebar-foreground/65">Your tiny taste-maker</p>
        </div>
      </div>
      <p className="pr-3 text-sm leading-5 text-sidebar-foreground/85">Not sure what sounds good? I can narrow the delicious part down.</p>
      <Link href="/eat-out" className="mt-3 inline-flex min-h-10 items-center rounded-full bg-primary px-4 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5" data-testid="link-mini-chef-ideas">
        Find a place
      </Link>
    </aside>
  );
}

export function SavorlyShell({ children, showChef = false }: SavorlyShellProps) {
  const [location] = useLocation();
  const [chefOpen, setChefOpen] = useState(showChef);
  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/cook', label: 'Cook', icon: Utensils },
    { href: '/eat-out', label: 'Eat out', icon: Compass },
  ];
  return (
    <div className="grain min-h-[100dvh] bg-background">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5 md:px-8 md:py-7">
        <Link href="/" className="transition hover:opacity-80" data-testid="link-brand-home"><BrandMark /></Link>
        <div className="flex items-center gap-2">
          <span className="hidden rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-secondary-foreground sm:inline-flex">Good food, close by</span>
          <button onClick={() => setChefOpen((value) => !value)} className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:-translate-y-0.5 hover:border-primary" aria-label="Toggle Mini Chef" data-testid="button-toggle-mini-chef">
            <Utensils className="h-4 w-4" />
          </button>
        </div>
      </header>
      <main>{children}</main>
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-border/80 bg-background/90 px-5 py-2 backdrop-blur-xl md:hidden" aria-label="Primary navigation">
        <div className="mx-auto flex max-w-md items-center justify-around">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = location === href || (href === '/cook' && location.startsWith('/recipes'));
            return <Link key={href} href={href} className={`flex min-w-20 flex-col items-center gap-1 rounded-xl py-2 text-[11px] font-bold transition ${active ? 'text-primary' : 'text-muted-foreground'}`} data-testid={`link-nav-${label.toLowerCase().replace(' ', '-')}`}>
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