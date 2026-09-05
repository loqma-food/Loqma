import { ArrowRight, ChefHat, Compass, Leaf, Sparkles, Utensils } from 'lucide-react';
import { Link } from 'wouter';
import { getHealthCheckQueryKey, useHealthCheck } from '@workspace/api-client-react';
import { LocationPill, SectionEyebrow, SavorlyShell } from '@/components/savorly-shell';

export default function Home() {
  const { data: health } = useHealthCheck({ query: { queryKey: getHealthCheckQueryKey() } });
  return <SavorlyShell showChef>
    <div className="mx-auto max-w-6xl px-5 pb-28 md:px-8 md:pb-16">
      <section className="relative overflow-hidden rounded-[2rem] bg-sidebar px-6 py-12 text-sidebar-foreground shadow-md sm:px-10 sm:py-16 md:px-16 md:py-20">
        <div className="absolute -right-16 -top-20 h-64 w-64 rounded-full bg-primary/25 blur-3xl" />
        <div className="absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative max-w-2xl">
          <LocationPill>Where appetite meets place</LocationPill>
          <h1 className="mt-6 max-w-xl font-display text-[clamp(3.2rem,11vw,7.5rem)] font-bold leading-[.86] tracking-[-0.065em] text-balance">Make room for <span className="text-primary">good</span> decisions.</h1>
          <p className="mt-7 max-w-md text-base leading-7 text-sidebar-foreground/72 sm:text-lg">Savorly turns the “where should we eat?” spiral into a short list you can actually feel excited about.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link href="/eat-out" className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full bg-primary px-6 text-base font-bold text-primary-foreground transition hover:-translate-y-1 hover:shadow-lg" data-testid="link-start-eat-out">
              Take me to dinner <ArrowRight className="h-5 w-5" />
            </Link>
            <a href="#how-it-works" className="inline-flex min-h-14 items-center justify-center rounded-full border border-sidebar-foreground/20 px-6 text-base font-bold text-sidebar-foreground transition hover:bg-sidebar-accent" data-testid="link-how-it-works">How it works</a>
          </div>
        </div>
        <div className="pointer-events-none absolute bottom-[-1.5rem] right-[-2rem] hidden h-72 w-72 rounded-[45%] border-[22px] border-accent/25 md:block md:rotate-[24deg]" />
        <div className="pointer-events-none absolute bottom-12 right-20 hidden h-28 w-28 rounded-full border-[14px] border-primary/60 md:block" />
      </section>

      <section id="how-it-works" className="grid gap-8 py-20 md:grid-cols-[.8fr_1.2fr] md:items-end md:py-28">
        <div>
          <SectionEyebrow>A better way to choose</SectionEyebrow>
          <h2 className="max-w-sm font-display text-4xl font-bold leading-[.95] tracking-[-0.045em] sm:text-5xl">Less scrolling. More savoring.</h2>
          <p className="mt-5 max-w-sm leading-7 text-muted-foreground">Live local data, a human-feeling shortlist, and just enough guidance to get you out the door.</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-bold text-muted-foreground" data-testid="status-savorly-service"><span className={`h-2 w-2 rounded-full ${health?.status === 'ok' ? 'bg-secondary-foreground' : 'bg-primary'}`} />{health?.status === 'ok' ? 'Local listings are live' : 'Connecting to local listings'}</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <FeatureCard number="01" icon={Compass} title="Set the scene" body="Tell us your budget, mood, and where you are." />
          <FeatureCard number="02" icon={Sparkles} title="See what is real" body="Browse nearby places from live local listings." />
          <FeatureCard number="03" icon={Leaf} title="Follow your appetite" body="Save the one that makes you hungry." />
        </div>
      </section>

      <section className="grid overflow-hidden rounded-[2rem] bg-accent px-6 py-10 sm:px-10 md:grid-cols-[1.1fr_.9fr] md:px-14 md:py-14">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-accent-foreground/65">Tonight's gentle nudge</p>
          <h2 className="mt-4 max-w-lg font-display text-4xl font-bold leading-[.95] tracking-[-.045em] text-accent-foreground sm:text-5xl">You do not need a perfect plan. Just a promising first bite.</h2>
          <Link href="/eat-out" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-accent-foreground underline decoration-accent-foreground/30 underline-offset-4 transition hover:decoration-accent-foreground" data-testid="link-browse-tonight">Browse nearby places <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="relative mt-10 flex min-h-44 items-center justify-center md:mt-0">
          <div className="absolute h-40 w-40 rounded-full border-[18px] border-accent-foreground/15" />
          <div className="absolute h-24 w-24 rounded-full border-[11px] border-accent-foreground/20" />
          <ChefHat className="relative h-16 w-16 text-accent-foreground/65" strokeWidth={1.2} />
        </div>
      </section>
    </div>
  </SavorlyShell>;
}

function FeatureCard({ number, icon: Icon, title, body }: { number: string; icon: typeof Compass; title: string; body: string }) {
  return <div className="rounded-[1.35rem] border border-border bg-card p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
    <div className="flex items-center justify-between"><span className="text-xs font-bold text-primary">{number}</span><Icon className="h-5 w-5 text-primary" /></div>
    <h3 className="mt-8 font-display text-xl font-bold">{title}</h3>
    <p className="mt-2 text-sm leading-5 text-muted-foreground">{body}</p>
  </div>;
}