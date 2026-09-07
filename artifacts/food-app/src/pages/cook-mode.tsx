import { Check, ChefHat, ChevronLeft, ChevronRight, Clock3, Pause, Play, TimerReset, Volume2, VolumeX, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useRoute } from 'wouter';
import { getGetRecipeQueryKey, useGetRecipe } from '@workspace/api-client-react';
import { MiniChefPanel } from '@/components/mini-chef';
import { ErrorState, RecipeImage, RecipeSkeleton } from '@/components/recipe-ui';
import { localizedText, useLanguage } from '@/lib/language-context';

export default function CookMode() {
  const [, params] = useRoute('/recipes/:recipeId/cook');
  const recipeId = params?.recipeId ?? '';
  const { language, t } = useLanguage();
  const query = useGetRecipe(recipeId, { query: { enabled: Boolean(recipeId), queryKey: getGetRecipeQueryKey(recipeId) } });
  const recipe = query.data;
  const [stepIndex, setStepIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [cuesHidden, setCuesHidden] = useState(false);
  const [chefOpen, setChefOpen] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const step = recipe?.steps[stepIndex];
  const duration = (step?.durationMinutes ?? 0) * 60;

  useEffect(() => {
    setSecondsLeft(duration);
    setPaused(false);
  }, [stepIndex, duration]);

  useEffect(() => {
    if (paused || secondsLeft <= 0) return;
    const timer = window.setInterval(() => setSecondsLeft((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [paused, secondsLeft]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  const formattedTime = useMemo(() => `${Math.floor(secondsLeft / 60).toString().padStart(2, '0')}:${(secondsLeft % 60).toString().padStart(2, '0')}`, [secondsLeft]);

  if (query.isLoading) return <div className="min-h-[100dvh] bg-sidebar p-5"><div className="mx-auto max-w-3xl"><RecipeSkeleton /></div></div>;
  if (query.isError || !recipe || !step) return <div className="min-h-[100dvh] bg-sidebar p-5"><div className="mx-auto max-w-2xl pt-12"><ErrorState onRetry={() => query.refetch()} detail={language === 'ar' ? 'مش قادرين نبدأ جلسة الطبخ دي.' : 'This cooking session could not be started.'} /></div></div>;

  const isLast = stepIndex === recipe.steps.length - 1;
  const progress = ((stepIndex + 1) / recipe.steps.length) * 100;
  const localizedInstruction = localizedText(language, step.instruction, step.instructionArabic);
  const localizedCue = localizedText(language, step.cookingCue, step.cookingCueArabic);
  const speakStep = () => {
    if (!speechSupported) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(`${localizedText(language, step.title, step.titleArabic)}. ${localizedInstruction}`);
    utterance.lang = language === 'ar' ? 'ar-EG' : 'en-US';
    utterance.onstart = () => setIsReading(true);
    utterance.onend = () => setIsReading(false);
    utterance.onerror = () => setIsReading(false);
    window.speechSynthesis.speak(utterance);
  };
  const stopReading = () => {
    window.speechSynthesis?.cancel();
    setIsReading(false);
  };
  const moveToStep = (nextIndex: number) => {
    stopReading();
    setStepIndex(nextIndex);
  };

  return <div className="min-h-[100dvh] overflow-x-hidden bg-sidebar text-sidebar-foreground">
    <header className="safe-top mx-auto flex max-w-3xl items-center justify-between px-5 pb-4 pt-3 sm:px-8">
      <Link href={`/recipes/${recipe.recipeId}`} className="touch-target inline-flex items-center gap-2 rounded-full text-sm font-bold text-sidebar-foreground/75 transition hover:text-sidebar-foreground" data-testid="link-exit-cooking-mode"><X className="h-5 w-5" />{t('exit')}</Link>
      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.15em] text-sidebar-foreground/60"><span className="hidden max-w-[16rem] truncate sm:inline">{localizedText(language, recipe.name, recipe.nameArabic)}</span><span>{stepIndex + 1} / {recipe.steps.length}</span></div>
      <div className="flex items-center gap-2">
        <button type="button" onClick={() => setChefOpen((value) => !value)} className={`touch-target flex items-center justify-center rounded-full border ${chefOpen ? 'border-accent bg-accent text-accent-foreground' : 'border-sidebar-foreground/15 text-sidebar-foreground/70'} transition hover:border-accent`} aria-label={t('miniChef')} aria-expanded={chefOpen} data-testid="button-toggle-cooking-mini-chef"><ChefHat className="h-4 w-4" /></button>
        <button type="button" onClick={() => setCuesHidden((value) => !value)} className="touch-target flex items-center justify-center rounded-full border border-sidebar-foreground/15 text-sidebar-foreground/70 transition hover:border-sidebar-foreground/40" aria-label={cuesHidden ? (language === 'ar' ? 'إظهار العلامات' : 'Show cues') : (language === 'ar' ? 'إخفاء العلامات' : 'Hide cues')} aria-pressed={cuesHidden} data-testid="button-toggle-cooking-cues">{cuesHidden ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}</button>
      </div>
    </header>
    <div className="mx-auto max-w-3xl px-5 pb-24 sm:px-8">
      <div className="h-1.5 overflow-hidden rounded-full bg-sidebar-accent"><div className="step-progress h-full rounded-full bg-primary" style={{ width: `${progress}%` }} /></div>
      <div className="mt-7 flex items-center gap-3"><div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-sidebar-foreground/15"><RecipeImage recipe={recipe} className="h-full w-full" /></div><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[.15em] text-primary">{t('cookingMode')}</p><p className="mt-1 truncate text-sm font-semibold text-sidebar-foreground/70">{localizedText(language, recipe.name, recipe.nameArabic)}</p></div></div>
      {chefOpen && <div className="mt-5"><MiniChefPanel cooking recipeName={localizedText(language, recipe.name, recipe.nameArabic)} cue={localizedCue} onClose={() => setChefOpen(false)} /></div>}
      <main className="mt-10" aria-live="polite">
        <p className="text-sm font-bold uppercase tracking-[.18em] text-primary">{t('step')} {step.stepNumber}</p>
        <h1 className="mt-4 max-w-2xl break-words font-display text-[clamp(2.6rem,12vw,7.5rem)] font-bold leading-[.92] tracking-[-.07em]" data-testid={`text-cooking-step-${step.stepNumber}`}>{localizedText(language, step.title, step.titleArabic)}</h1>
        <p className="mt-7 max-w-2xl text-lg leading-8 text-sidebar-foreground/80 sm:text-2xl sm:leading-10" data-testid="text-cooking-instruction">{localizedInstruction}</p>
        <div className="mt-6 flex flex-wrap gap-2">
          {speechSupported ? <button type="button" onClick={isReading ? stopReading : speakStep} className="touch-target inline-flex items-center gap-2 rounded-full border border-sidebar-foreground/20 px-4 text-sm font-bold text-sidebar-foreground/80 transition hover:border-primary hover:text-sidebar-foreground" aria-pressed={isReading} data-testid="button-read-cooking-step"><Volume2 className="h-4 w-4" />{isReading ? t('stopReading') : t('readStep')}</button> : <span className="inline-flex min-h-11 items-center rounded-full border border-sidebar-foreground/10 px-4 text-xs text-sidebar-foreground/55">{t('voiceUnavailable')}</span>}
        </div>
        {!cuesHidden && localizedCue && <div className="mt-7 flex max-w-xl items-start gap-3 rounded-[1.25rem] border border-accent/20 bg-accent/10 p-4 text-sm font-semibold text-accent"><Check className="mt-0.5 h-5 w-5 shrink-0" />{localizedCue}</div>}
        {step.heatLevel && <div className="mt-5 inline-flex items-center rounded-full bg-sidebar-accent px-4 py-2 text-xs font-bold uppercase tracking-[.12em] text-sidebar-foreground/80">{language === 'ar' ? 'النار' : 'Heat'} · {localizedText(language, step.heatLevel, step.heatLevelArabic)}</div>}
        {duration > 0 && <div className="mt-8 flex flex-wrap items-center gap-3"><div className="flex items-center gap-3 rounded-2xl bg-sidebar-accent px-5 py-3"><Clock3 className="h-5 w-5 text-primary" /><span className="font-mono text-2xl font-bold tabular-nums" data-testid="text-cooking-timer">{formattedTime}</span></div><button type="button" onClick={() => setPaused((value) => !value)} className="touch-target inline-flex items-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5" data-testid="button-pause-resume-timer">{paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}{paused ? t('resume') : t('pause')}</button><button type="button" onClick={() => setSecondsLeft(duration)} className="touch-target inline-flex items-center justify-center rounded-full border border-sidebar-foreground/20 text-sidebar-foreground/70 transition hover:border-sidebar-foreground/50" aria-label={t('resetTimer')} data-testid="button-reset-timer"><TimerReset className="h-4 w-4" /></button></div>}
      </main>
      <footer className="mt-14 grid grid-cols-2 gap-3 border-t border-sidebar-foreground/10 pt-6"><button type="button" disabled={stepIndex === 0} onClick={() => moveToStep(Math.max(0, stepIndex - 1))} className="touch-target inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-sidebar-foreground/20 px-3 text-sm font-bold text-sidebar-foreground/75 transition hover:border-sidebar-foreground/50 disabled:cursor-not-allowed disabled:opacity-30" data-testid="button-previous-step"><ChevronLeft className="h-4 w-4" />{t('previous')}</button>{isLast ? <Link href={`/recipes/${recipe.recipeId}`} className="touch-target inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-accent px-5 text-accent-foreground transition hover:-translate-y-0.5" data-testid="link-finish-cooking"><Check className="h-4 w-4" />{t('finished')}</Link> : <button type="button" onClick={() => moveToStep(Math.min(recipe.steps.length - 1, stepIndex + 1))} className="touch-target inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-5 text-sm font-bold text-primary-foreground transition hover:-translate-y-0.5" data-testid="button-next-step">{t('next')} <ChevronRight className="h-4 w-4" /></button>}</footer>
    </div>
  </div>;
}
