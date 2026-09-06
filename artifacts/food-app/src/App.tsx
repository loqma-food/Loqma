import { type ReactNode } from 'react';
import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { FavoritesProvider } from '@/lib/favorites-context';
import { LanguageProvider, useLanguage } from '@/lib/language-context';
import NotFound from '@/pages/not-found';
import Home from '@/pages/home';
import EatOut from '@/pages/eat-out';
import Restaurants from '@/pages/restaurants';
import RestaurantDetail from '@/pages/restaurant-detail';
import Recipes from '@/pages/recipes';
import RecipeDetail from '@/pages/recipe-detail';
import CookMode from '@/pages/cook-mode';
import Favorites from '@/pages/favorites';
import Profile from '@/pages/profile';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/eat-out" component={EatOut} />
         <Route path="/cook" component={Recipes} />
         <Route path="/recipes/:recipeId/cook" component={CookMode} />
         <Route path="/recipes/:recipeId" component={RecipeDetail} />
        <Route path="/restaurants" component={Restaurants} />
        <Route path="/restaurants/:id" component={RestaurantDetail} />
        <Route path="/favorites" component={Favorites} />
        <Route path="/profile" component={Profile} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  useEffect(() => {
    if (!Capacitor.isNativePlatform()) return;
    let disposed = false;
    let listener: { remove: () => Promise<void> } | undefined;
    void CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      const closeButton = document.querySelector<HTMLElement>('[data-mobile-overlay="true"] [data-mobile-overlay-close]');
      if (closeButton) {
        closeButton.click();
        return;
      }
      if (canGoBack && window.history.length > 1) {
        window.history.back();
      } else {
        void CapacitorApp.exitApp();
      }
    }).then((handle) => {
      if (disposed) void handle.remove();
      else listener = handle;
    });
    return () => {
      disposed = true;
      void listener?.remove();
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <FavoritesProvider>
          <LocalizedApp />
        </FavoritesProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

function LocalizedApp() {
  const { direction, language } = useLanguage();
  return <div dir={direction} lang={language} className="min-h-[100dvh]">
    <TooltipProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
        <Router />
      </WouterRouter>
      <Toaster />
    </TooltipProvider>
  </div>;
}

export default App;
