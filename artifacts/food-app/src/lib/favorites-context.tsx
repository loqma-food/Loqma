import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { RecipeSummary, Restaurant } from '@workspace/api-client-react';

const STORAGE_KEY = 'loqma-favorites-v1';

type FavoriteState = {
  recipes: RecipeSummary[];
  restaurants: Restaurant[];
};

type FavoritesContextValue = FavoriteState & {
  isRecipeFavorite: (recipeId: string) => boolean;
  isRestaurantFavorite: (restaurantId: string) => boolean;
  toggleRecipe: (recipe: RecipeSummary) => void;
  toggleRestaurant: (restaurant: Restaurant) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

function readFavorites(): FavoriteState {
  if (typeof window === 'undefined') return { recipes: [], restaurants: [] };
  try {
    const parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? '{}') as Partial<FavoriteState>;
    return {
      recipes: Array.isArray(parsed.recipes) ? parsed.recipes : [],
      restaurants: Array.isArray(parsed.restaurants) ? parsed.restaurants : [],
    };
  } catch {
    return { recipes: [], restaurants: [] };
  }
}

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<FavoriteState>(readFavorites);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    } catch {
      // Storage may be unavailable in private browsing or an embedded webview.
    }
  }, [favorites]);

  const value = useMemo<FavoritesContextValue>(() => ({
    ...favorites,
    isRecipeFavorite: (recipeId) => favorites.recipes.some((recipe) => recipe.recipeId === recipeId),
    isRestaurantFavorite: (restaurantId) => favorites.restaurants.some((restaurant) => restaurant.id === restaurantId),
    toggleRecipe: (recipe) => setFavorites((current) => ({
      ...current,
      recipes: current.recipes.some((item) => item.recipeId === recipe.recipeId)
        ? current.recipes.filter((item) => item.recipeId !== recipe.recipeId)
        : [...current.recipes, recipe],
    })),
    toggleRestaurant: (restaurant) => setFavorites((current) => ({
      ...current,
      restaurants: current.restaurants.some((item) => item.id === restaurant.id)
        ? current.restaurants.filter((item) => item.id !== restaurant.id)
        : [...current.restaurants, restaurant],
    })),
  }), [favorites]);

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within FavoritesProvider');
  return context;
}