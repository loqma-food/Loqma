import { BookOpen, ChevronRight, CircleUserRound, Heart, MapPin, Settings2 } from 'lucide-react';
import { Link } from 'wouter';
import { SectionEyebrow, SavorlyShell } from '@/components/savorly-shell';
import { useFavorites } from '@/lib/favorites-context';

export default function Profile() {
  const { recipes, restaurants } = useFavorites();
  return <SavorlyShell>
    <div className="mobile-page mx-auto max-w-3xl px-5 pb-32 md:px-8 md:pb-16">
      <section className="rounded-[1.75rem] bg-sidebar px-6 py-9 text-sidebar-foreground sm:px-10 sm:py-12">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><CircleUserRound className="h-7 w-7" /></div>
        <SectionEyebrow>Welcome to Loqma</SectionEyebrow>
        <h1 className="font-display text-[clamp(2.8rem,11vw,5.6rem)] font-bold leading-[.9] tracking-[-.06em]">Your food <span className="text-primary">story.</span></h1>
        <p className="mt-5 max-w-lg text-base leading-7 text-sidebar-foreground/75">A simple guest profile for keeping your cooking ideas and nearby places close at hand.</p>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3">
        <StatCard icon={Heart} value={recipes.length + restaurants.length} label="saved" />
        <StatCard icon={BookOpen} value={recipes.length} label="recipes" />
      </section>

      <section className="mt-8 overflow-hidden rounded-[1.5rem] border border-border bg-card">
        <ProfileLink icon={Heart} title="Your favorites" detail={`${recipes.length + restaurants.length} saved ${recipes.length + restaurants.length === 1 ? 'item' : 'items'}`} href="/favorites" />
        <ProfileLink icon={MapPin} title="Find somewhere new" detail="Browse live local listings" href="/eat-out" />
        <ProfileLink icon={Settings2} title="Preferences" detail="Personalize Loqma as you go" href="/cook" />
      </section>

      <p className="mt-6 text-center text-xs leading-5 text-muted-foreground">Your guest favorites are stored only on this device. Account syncing can be added without changing this experience.</p>
    </div>
  </SavorlyShell>;
}

function StatCard({ icon: Icon, value, label }: { icon: typeof Heart; value: number; label: string }) {
  return <div className="rounded-[1.25rem] border border-border bg-card p-5"><Icon className="h-5 w-5 text-primary" /><p className="mt-4 font-display text-3xl font-bold">{value}</p><p className="text-sm text-muted-foreground">{label}</p></div>;
}

function ProfileLink({ icon: Icon, title, detail, href }: { icon: typeof Heart; title: string; detail: string; href: string }) {
  return <Link href={href} className="flex min-h-[4.6rem] items-center gap-4 border-b border-border/70 px-5 py-4 transition last:border-0 hover:bg-muted/50">
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-secondary-foreground"><Icon className="h-5 w-5" /></span>
    <span className="min-w-0 flex-1"><span className="block text-sm font-bold">{title}</span><span className="mt-0.5 block truncate text-xs text-muted-foreground">{detail}</span></span>
    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
  </Link>;
}