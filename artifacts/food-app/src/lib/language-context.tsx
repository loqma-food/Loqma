import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

export type Language = 'en' | 'ar';
export type Direction = 'ltr' | 'rtl';

const STORAGE_KEY = 'loqma-language';

const copy = {
  en: {
    home: 'Home', cook: 'Cook', eatOut: 'Eat out', favorites: 'Favorites', profile: 'Profile',
    miniChef: 'Mini Chef', miniChefSubtitle: 'Your tiny taste-maker', miniChefBody: 'Not sure what sounds good? I can narrow the delicious part down.',
    findAPlace: 'Find a place', everyBite: 'Every Bite Has a Story', allRecipes: 'All recipes',
    searchRecipes: 'Search a recipe, ingredient, or cuisine', filters: 'Filters', clear: 'Clear', done: 'Done',
    vegetarian: 'vegetarian', optional: 'optional', essential: 'essential', servings: 'servings', prep: 'prep min', cookMinutes: 'cook min', total: 'total min',
    startCooking: 'Start cooking', openCookingMode: 'Open cooking mode', gatherIngredients: 'Gather your ingredients',
    setUpCounter: 'Set up your counter.', ingredientHint: 'Tap YES when it is in the kitchen. Quantities adjust for your servings.',
    makeItHappen: 'Make it happen', calmPath: 'A calm path to done.', needSwap: 'Need a swap?', hideSwaps: 'Hide swaps',
    noSubstitute: 'No suitable substitute — this ingredient is essential.', step: 'Step', previous: 'Previous', next: 'Next',
    finished: 'Finished', exit: 'Exit', pause: 'Pause', resume: 'Resume', resetTimer: 'Reset timer', cookingMode: 'Cooking mode', readStep: 'Read this step', stopReading: 'Stop reading', voiceUnavailable: 'Voice is not available here',
    nearMe: 'Near Me', chooseLocation: 'Choose Location', useCurrentLocation: 'Use my current location', locating: 'Locating…',
    showMePlaces: 'Show me places', adjustSearch: 'Adjust your search', liveListings: 'Live local listings',
    informationUnavailable: 'Information unavailable', saveRecipe: 'Save recipe', removeRecipe: 'Remove recipe from favorites',
    saveRestaurant: 'Save restaurant', removeRestaurant: 'Remove restaurant from favorites', browseRecipes: 'Browse recipes',
    yourShortlist: 'Your shortlist', keepGoodOnes: 'Keep the good ones.', quietShortlist: 'Your shortlist is quiet.',
    profileWelcome: 'Welcome to Loqma', yourFoodStory: 'Your food story.', language: 'Language', english: 'English', arabic: 'العربية',
    settings: 'Settings', preferences: 'Preferences', saved: 'saved', recipes: 'recipes', place: 'place', places: 'places',
    noRecipes: 'Nothing on the menu yet.', clearFilters: 'Show every recipe', tryAgain: 'Try again',
    liveNow: 'Nearby, right now', goodPlaces: 'Good places this way.', backToPlaces: 'Back to nearby places',
    source: 'Source', address: 'Address', phone: 'Phone', openingHours: 'Opening hours', menu: 'View menu', website: 'Website',
    directions: 'Directions', menuUnavailable: 'Menu unavailable', reviews: 'Reviews', recommendedDish: 'Recommended dish',
    openNow: 'Open now', closedNow: 'Closed now', anyHours: 'Any hours', anyMenu: 'Any menu',
    browseNearby: 'Browse nearby places', placeNotFound: 'This place is not in your current shortlist.',
  },
  ar: {
    home: 'الرئيسية', cook: 'اطبخ', eatOut: 'أكل خارج البيت', favorites: 'المفضلة', profile: 'حسابي',
    miniChef: 'الشيف الصغير', miniChefSubtitle: 'رفيقك الصغير في المطبخ', miniChefBody: 'مش عارف نفسك في إيه؟ أساعدك تختار حاجة حلوة.',
    findAPlace: 'اختار مكان', everyBite: 'كل لقمة لها حكاية', allRecipes: 'كل الوصفات',
    searchRecipes: 'ابحث عن وصفة أو مكوّن أو مطبخ', filters: 'الفلاتر', clear: 'مسح', done: 'تم',
    vegetarian: 'نباتي', optional: 'اختياري', essential: 'أساسي', servings: 'حصص', prep: 'تحضير بالدقائق', cookMinutes: 'تسوية بالدقائق', total: 'الإجمالي بالدقائق',
    startCooking: 'ابدأ الطبخ', openCookingMode: 'افتح وضع الطبخ', gatherIngredients: 'حضّر المكونات',
    setUpCounter: 'جهّز رخامة المطبخ.', ingredientHint: 'اضغط نعم لما يكون المكوّن عندك. الكميات بتتظبط حسب عدد الحصص.',
    makeItHappen: 'يلا نطبخ', calmPath: 'خطوات بسيطة لحد ما تخلص.', needSwap: 'عايز بديل؟', hideSwaps: 'اخفِ البدائل',
    noSubstitute: 'مفيش بديل مناسب — المكوّن ده أساسي.', step: 'الخطوة', previous: 'السابق', next: 'التالي',
    finished: 'خلصت', exit: 'خروج', pause: 'إيقاف مؤقت', resume: 'استكمال', resetTimer: 'إعادة المؤقت', cookingMode: 'وضع الطبخ', readStep: 'اقرأ الخطوة', stopReading: 'أوقف القراءة', voiceUnavailable: 'الصوت غير متاح هنا',
    nearMe: 'بالقرب مني', chooseLocation: 'اختار المكان', useCurrentLocation: 'استخدم موقعي الحالي', locating: 'بنحدد موقعك…',
    showMePlaces: 'ورّيني أماكن', adjustSearch: 'عدّل بحثك', liveListings: 'أماكن حقيقية قريبة',
    informationUnavailable: 'المعلومة غير متاحة', saveRecipe: 'احفظ الوصفة', removeRecipe: 'احذف الوصفة من المفضلة',
    saveRestaurant: 'احفظ المكان', removeRestaurant: 'احذف المكان من المفضلة', browseRecipes: 'تصفّح الوصفات',
    yourShortlist: 'اختياراتك', keepGoodOnes: 'خلي الحلو قريب.', quietShortlist: 'لسه مفيش اختيارات.',
    profileWelcome: 'أهلاً بيك في لقمة', yourFoodStory: 'حكايتك مع الأكل.', language: 'اللغة', english: 'English', arabic: 'العربية',
    settings: 'الإعدادات', preferences: 'التفضيلات', saved: 'محفوظ', recipes: 'وصفات', place: 'مكان', places: 'أماكن',
    noRecipes: 'مفيش وصفات في القائمة دلوقتي.', clearFilters: 'اعرض كل الوصفات', tryAgain: 'حاول تاني',
    liveNow: 'قريب منك دلوقتي', goodPlaces: 'أماكن حلوة هنا.', backToPlaces: 'ارجع للأماكن القريبة',
    source: 'المصدر', address: 'العنوان', phone: 'التليفون', openingHours: 'مواعيد العمل', menu: 'شوف المنيو', website: 'الموقع',
    directions: 'الاتجاهات', menuUnavailable: 'المنيو غير متاحة', reviews: 'التقييمات', recommendedDish: 'طبق مقترح',
    openNow: 'مفتوح دلوقتي', closedNow: 'مغلق دلوقتي', anyHours: 'أي مواعيد', anyMenu: 'أي قائمة',
    browseNearby: 'تصفّح الأماكن القريبة', placeNotFound: 'المكان ده مش موجود في اختياراتك الحالية.',
  },
} as const;

type CopyKey = keyof typeof copy.en;
type LanguageContextValue = {
  language: Language;
  direction: Direction;
  setLanguage: (language: Language) => void;
  t: (key: CopyKey) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window === 'undefined') return 'en';
    if (new URLSearchParams(window.location.search).get('lang') === 'ar') return 'ar';
    if (new URLSearchParams(window.location.search).get('lang') === 'en') return 'en';
    return window.localStorage.getItem(STORAGE_KEY) === 'ar' ? 'ar' : 'en';
  });

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    try {
      window.localStorage.setItem(STORAGE_KEY, language);
    } catch {
      // Language remains available for this session if storage is unavailable.
    }
  }, [language]);

  const value = useMemo<LanguageContextValue>(() => ({
    language,
    direction: language === 'ar' ? 'rtl' : 'ltr',
    setLanguage,
    t: (key) => copy[language][key],
  }), [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}

export function localizedText(language: Language, english: string, arabic?: string | null) {
  return language === 'ar' && arabic ? arabic : english;
}

const cuisineArabic: Record<string, string> = {
  Egyptian: 'مصري', 'Middle Eastern': 'شرق أوسطي', Italian: 'إيطالي', Japanese: 'ياباني', Thai: 'تايلاندي',
  Indian: 'هندي', Chinese: 'صيني', Korean: 'كوري', Turkish: 'تركي', Lebanese: 'لبناني', Mexican: 'مكسيكي',
};
const categoryArabic: Record<string, string> = {
  Breakfast: 'فطار', Lunch: 'غدا', Dinner: 'عشا', Soup: 'شوربة', Rice: 'أرز', Pasta: 'مكرونة',
  Chicken: 'فراخ', Beef: 'لحوم', Seafood: 'مأكولات بحرية', Vegetables: 'خضار', Dessert: 'حلويات',
  Snack: 'سناكس', 'Street food': 'أكل الشارع',
};

export function localizeCuisine(language: Language, value: string) {
  return language === 'ar' ? cuisineArabic[value] ?? value : value;
}

export function localizeCategory(language: Language, value: string) {
  return language === 'ar' ? categoryArabic[value] ?? value : value;
}