import { ChefHat, X } from 'lucide-react';
import type { ReactNode } from 'react';
import { useLanguage } from '@/lib/language-context';

type MiniChefPanelProps = {
  cue?: string;
  recipeName?: string;
  cooking?: boolean;
  onClose?: () => void;
  footer?: ReactNode;
  className?: string;
  mobileOverlay?: boolean;
};

export function MiniChefPanel({ cue, recipeName, cooking = false, onClose, footer, className = '', mobileOverlay = false }: MiniChefPanelProps) {
  const { language, t } = useLanguage();
  const fallback = cooking
    ? language === 'ar' ? 'خد وقتك، وبص على القوام واللون قبل ما تنقل للخطوة اللي بعدها.' : 'Take your time, then check the colour and texture before moving on.'
    : t('miniChefBody');

  return (
    <aside className={`${className} relative rounded-[1.25rem] border border-accent/25 bg-accent/10 p-4 text-accent-foreground`} aria-label={t('miniChef')} data-testid="panel-mini-chef" data-mobile-overlay={mobileOverlay ? 'true' : undefined}>
      {onClose && <button type="button" onClick={onClose} className="touch-target absolute right-1 top-1 rounded-full p-1 text-accent-foreground/60 transition hover:bg-accent/20 hover:text-accent-foreground" aria-label={language === 'ar' ? 'إغلاق الشيف الصغير' : 'Close Mini Chef'} data-mobile-overlay-close={mobileOverlay ? true : undefined} data-testid="button-close-mini-chef"><X className="h-4 w-4" /></button>}
      <div className="flex items-start gap-3 pr-6">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent text-accent-foreground"><ChefHat className="h-5 w-5" /></div>
        <div className="min-w-0">
          <p className="font-bold">{t('miniChef')}</p>
          {recipeName && <p className="mt-0.5 truncate text-xs text-accent-foreground/65">{recipeName}</p>}
        </div>
      </div>
      <p className="mt-3 text-sm leading-6 text-accent-foreground/85" data-testid="text-mini-chef-cue">{cue || fallback}</p>
      {footer && <div className="mt-3">{footer}</div>}
    </aside>
  );
}
