import { eq } from "drizzle-orm";
import { db, recipesTable, type InsertRecipe } from "@workspace/db";
import { egyptianRecipeSeed } from "./egyptian-recipe-seed";

const legacyRecipeSeed: InsertRecipe[] = [
  {
    recipeId: "shakshuka-classic",
    name: "Classic Shakshuka",
    description: "Eggs gently poached in a spiced tomato and pepper sauce, finished with herbs and warm bread.",
    cuisine: "Middle Eastern",
    category: "Breakfast",
    dishType: "One-pan",
    mainIngredient: "Eggs",
    cookingTimeMinutes: 35,
    difficulty: "easy",
    vegetarian: true,
    spicy: true,
    mealType: "Breakfast",
    prepTimeMinutes: 10,
    cookTimeMinutes: 25,
    totalTimeMinutes: 35,
    servings: 2,
    imageUrl: "https://images.unsplash.com/photo-1590412200988-a436970781fa?auto=format&fit=crop&w=1600&q=85",
    tags: ["vegetarian", "high-protein", "one-pan"],
    ingredients: [
      { ingredientId: "onion", name: "Yellow onion", quantity: 1, unit: "medium", optional: false, group: "Sauce", notes: "finely diced", substitutions: [{ ingredient: "Shallot", quantity: 2, unit: "small", effect: "Makes the sauce slightly sweeter." }] },
      { ingredientId: "pepper", name: "Red bell pepper", quantity: 1, unit: "large", optional: false, group: "Sauce", notes: "thinly sliced", substitutions: [{ ingredient: "Green bell pepper", quantity: 1, unit: "large", effect: "Adds a more vegetal, less sweet flavor." }] },
      { ingredientId: "garlic", name: "Garlic", quantity: 3, unit: "cloves", optional: false, group: "Sauce", notes: "minced", substitutions: [] },
      { ingredientId: "tomato", name: "Crushed tomatoes", quantity: 400, unit: "g", optional: false, group: "Sauce", notes: null, substitutions: [{ ingredient: "Canned diced tomatoes", quantity: 400, unit: "g", effect: "The sauce will be more textured; crush a few pieces with your spoon." }] },
      { ingredientId: "spice", name: "Smoked paprika", quantity: 1, unit: "teaspoon", optional: false, group: "Seasoning", notes: null, substitutions: [{ ingredient: "Sweet paprika", quantity: 1, unit: "teaspoon", effect: "Keeps the color and warmth but removes the smoky note." }] },
      { ingredientId: "eggs", name: "Eggs", quantity: 4, unit: "large", optional: false, group: "Main", notes: "cold eggs are fine", substitutions: [] },
      { ingredientId: "herbs", name: "Fresh parsley", quantity: 2, unit: "tablespoons", optional: true, group: "Garnish", notes: "chopped", substitutions: [{ ingredient: "Fresh cilantro", quantity: 2, unit: "tablespoons", effect: "Adds a brighter, more citrusy finish." }] },
      { ingredientId: "oil", name: "Olive oil", quantity: 2, unit: "tablespoons", optional: false, group: "Oil", notes: null, substitutions: [{ ingredient: "Neutral oil", quantity: 2, unit: "tablespoons", effect: "The sauce will have less fruity flavor." }] },
    ],
    steps: [
      { stepNumber: 1, title: "Soften the aromatics", instruction: "Warm the olive oil in a wide skillet over medium heat. Add the onion and bell pepper with a pinch of salt. Cook for 7–8 minutes, stirring every minute, until the onion is translucent and the pepper bends easily.", durationMinutes: 8, heatLevel: "Medium", cookingCue: "The vegetables should look glossy and soft, not browned." },
      { stepNumber: 2, title: "Build the sauce", instruction: "Stir in the garlic and smoked paprika for 30 seconds. Add the crushed tomatoes, bring the sauce to a gentle bubble, then reduce to medium-low and simmer for 10 minutes. Taste and adjust salt.", durationMinutes: 10, heatLevel: "Medium-low", cookingCue: "A spoon dragged through the sauce should leave a trail for one second." },
      { stepNumber: 3, title: "Poach the eggs", instruction: "Make four wells in the sauce and crack an egg into each. Cover the skillet and cook for 5–7 minutes, until the whites are set and the yolks still wobble when the pan is nudged.", durationMinutes: 7, heatLevel: "Low", cookingCue: "The whites should be opaque from edge to center; stop before the yolks become firm." },
      { stepNumber: 4, title: "Finish and serve", instruction: "Turn off the heat and rest the pan uncovered for 2 minutes. Scatter over the parsley and serve immediately with bread for scooping the sauce.", durationMinutes: 2, heatLevel: "Off heat", cookingCue: "The residual heat finishes the whites without overcooking the yolks." },
    ],
  },
  {
    recipeId: "chicken-shawarma-bowl",
    name: "Weeknight Chicken Shawarma Bowl",
    description: "Juicy spiced chicken with lemony rice, crunchy cucumber, and a cool yogurt sauce.",
    cuisine: "Middle Eastern",
    category: "Dinner",
    dishType: "Bowl",
    mainIngredient: "Chicken",
    cookingTimeMinutes: 45,
    difficulty: "medium",
    vegetarian: false,
    spicy: false,
    mealType: "Dinner",
    prepTimeMinutes: 20,
    cookTimeMinutes: 25,
    totalTimeMinutes: 45,
    servings: 4,
    imageUrl: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=1600&q=85",
    tags: ["high-protein", "meal-prep", "family-friendly"],
    ingredients: [
      { ingredientId: "chicken", name: "Boneless chicken thighs", quantity: 700, unit: "g", optional: false, group: "Main", notes: "trimmed", substitutions: [{ ingredient: "Boneless chicken breast", quantity: 700, unit: "g", effect: "Cook 2–3 minutes less and watch for dryness." }] },
      { ingredientId: "lemon", name: "Lemon juice", quantity: 3, unit: "tablespoons", optional: false, group: "Marinade", notes: null, substitutions: [{ ingredient: "Apple cider vinegar", quantity: 2, unit: "tablespoons", effect: "Sharper acidity; add one extra tablespoon of water." }] },
      { ingredientId: "yogurt", name: "Plain Greek yogurt", quantity: 180, unit: "g", optional: false, group: "Sauce", notes: null, substitutions: [{ ingredient: "Plain unsweetened yogurt", quantity: 180, unit: "g", effect: "The sauce will be thinner." }] },
      { ingredientId: "shawarma-spice", name: "Shawarma spice blend", quantity: 2, unit: "tablespoons", optional: false, group: "Seasoning", notes: null, substitutions: [{ ingredient: "Ground cumin", quantity: 1, unit: "tablespoon", effect: "Less complex; add a pinch each of paprika and cinnamon if available." }] },
      { ingredientId: "rice", name: "Basmati rice", quantity: 250, unit: "g", optional: false, group: "Base", notes: "rinsed", substitutions: [{ ingredient: "Long-grain white rice", quantity: 250, unit: "g", effect: "Use the package's water ratio; texture will be a little less fragrant." }] },
      { ingredientId: "cucumber", name: "Cucumber", quantity: 1, unit: "large", optional: false, group: "Garnish", notes: "diced", substitutions: [] },
      { ingredientId: "garlic", name: "Garlic", quantity: 1, unit: "clove", optional: true, group: "Sauce", notes: "finely grated", substitutions: [] },
      { ingredientId: "oil", name: "Olive oil", quantity: 2, unit: "tablespoons", optional: false, group: "Marinade", notes: null, substitutions: [{ ingredient: "Neutral oil", quantity: 2, unit: "tablespoons", effect: "The marinade will have a milder flavor." }] },
    ],
    steps: [
      { stepNumber: 1, title: "Season the chicken", instruction: "Combine lemon juice, olive oil, shawarma spice, 1 teaspoon salt, and the grated garlic. Coat the chicken and rest for at least 15 minutes while you start the rice.", durationMinutes: 15, heatLevel: "No heat", cookingCue: "Every piece should be glossy and evenly coated." },
      { stepNumber: 2, title: "Cook the rice", instruction: "Place the rinsed rice in a saucepan with 375 ml water and a pinch of salt. Bring to a boil, cover, reduce to low, and cook for 15 minutes. Turn off the heat and leave covered for 5 minutes.", durationMinutes: 20, heatLevel: "Low", cookingCue: "The grains should be tender with no water visible at the bottom." },
      { stepNumber: 3, title: "Sear the chicken", instruction: "Heat a large skillet over medium-high. Add the chicken in one layer and cook for 5–6 minutes per side. The thickest piece should reach 74°C and show browned edges.", durationMinutes: 12, heatLevel: "Medium-high", cookingCue: "The surface should have dark golden patches and the center should be opaque." },
      { stepNumber: 4, title: "Mix the sauce and assemble", instruction: "Stir the yogurt with 1 tablespoon lemon juice and a pinch of salt. Fluff the rice, slice the chicken, and serve with cucumber and the yogurt sauce.", durationMinutes: 5, heatLevel: "Off heat", cookingCue: "Resting the chicken for 5 minutes keeps the slices juicy." },
    ],
  },
  {
    recipeId: "spaghetti-carbonara",
    name: "Spaghetti Carbonara",
    description: "Silky egg-and-cheese pasta with crisp pancetta and plenty of black pepper.",
    cuisine: "Italian",
    category: "Dinner",
    dishType: "Pasta",
    mainIngredient: "Pasta",
    cookingTimeMinutes: 30,
    difficulty: "medium",
    vegetarian: false,
    spicy: false,
    mealType: "Dinner",
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    totalTimeMinutes: 30,
    servings: 2,
    imageUrl: "https://images.unsplash.com/photo-1473093295043-cdd812d0e601?auto=format&fit=crop&w=1600&q=85",
    tags: ["quick", "classic", "comfort-food"],
    ingredients: [
      { ingredientId: "spaghetti", name: "Spaghetti", quantity: 200, unit: "g", optional: false, group: "Main", notes: null, substitutions: [{ ingredient: "Linguine", quantity: 200, unit: "g", effect: "Similar result with a slightly flatter bite." }] },
      { ingredientId: "pancetta", name: "Pancetta", quantity: 100, unit: "g", optional: false, group: "Main", notes: "diced", substitutions: [{ ingredient: "Bacon", quantity: 100, unit: "g", effect: "Smokier and saltier; use less added salt." }] },
      { ingredientId: "eggs", name: "Egg yolks", quantity: 3, unit: "large", optional: false, group: "Sauce", notes: null, substitutions: [{ ingredient: "Whole eggs", quantity: 2, unit: "large", effect: "The sauce will be lighter and less rich." }] },
      { ingredientId: "pecorino", name: "Pecorino Romano", quantity: 60, unit: "g", optional: false, group: "Sauce", notes: "finely grated", substitutions: [{ ingredient: "Parmesan", quantity: 60, unit: "g", effect: "Less salty and more nutty." }] },
      { ingredientId: "pepper", name: "Black pepper", quantity: 1, unit: "teaspoon", optional: false, group: "Seasoning", notes: "freshly ground", substitutions: [] },
      { ingredientId: "salt", name: "Fine salt", quantity: 1, unit: "teaspoon", optional: false, group: "Seasoning", notes: "for pasta water", substitutions: [] },
    ],
    steps: [
      { stepNumber: 1, title: "Start the pasta water", instruction: "Bring a large pot of water to a rolling boil. Salt it until it tastes pleasantly seasoned, then add the spaghetti and cook for 1 minute less than the package time.", durationMinutes: 10, heatLevel: "High", cookingCue: "The pasta should be flexible but still firm in the center." },
      { stepNumber: 2, title: "Render the pancetta", instruction: "While the pasta cooks, place the pancetta in a cold skillet over medium heat. Cook for 7–8 minutes, turning occasionally, until the fat is rendered and the pieces are crisp. Turn off the heat.", durationMinutes: 8, heatLevel: "Medium", cookingCue: "The pancetta should be browned at the edges, with a few tablespoons of clear fat in the pan." },
      { stepNumber: 3, title: "Make the egg mixture", instruction: "Whisk the egg yolks, grated Pecorino, and black pepper in a bowl until a thick paste forms. Scoop out 180 ml pasta water before draining.", durationMinutes: 3, heatLevel: "No heat", cookingCue: "The cheese should be fully dispersed with no dry pockets." },
      { stepNumber: 4, title: "Emulsify and serve", instruction: "Add the hot pasta to the pancetta pan and toss. Wait 30 seconds, then add the egg mixture while tossing constantly. Add pasta water 1 tablespoon at a time until glossy and creamy. Serve immediately with extra pepper.", durationMinutes: 4, heatLevel: "Off heat", cookingCue: "The sauce should cling to each strand and never look like scrambled egg." },
    ],
  },
  {
    recipeId: "pad-thai",
    name: "Balanced Pad Thai",
    description: "Tamarind-bright rice noodles tossed with shrimp, egg, bean sprouts, and roasted peanuts.",
    cuisine: "Thai",
    category: "Dinner",
    dishType: "Noodles",
    mainIngredient: "Shrimp",
    cookingTimeMinutes: 35,
    difficulty: "medium",
    vegetarian: false,
    spicy: true,
    mealType: "Dinner",
    prepTimeMinutes: 20,
    cookTimeMinutes: 15,
    totalTimeMinutes: 35,
    servings: 2,
    imageUrl: "https://images.unsplash.com/photo-1559314809-0d155014e29e?auto=format&fit=crop&w=1600&q=85",
    tags: ["street-food", "quick", "spicy"],
    ingredients: [
      { ingredientId: "noodles", name: "Thai rice noodles", quantity: 180, unit: "g", optional: false, group: "Main", notes: "3–5 mm wide", substitutions: [{ ingredient: "Flat rice noodles", quantity: 180, unit: "g", effect: "Use the same soaking method; wider noodles need a little longer." }] },
      { ingredientId: "shrimp", name: "Raw shrimp", quantity: 250, unit: "g", optional: false, group: "Main", notes: "peeled and deveined", substitutions: [{ ingredient: "Firm tofu", quantity: 250, unit: "g", effect: "Use vegetarian fish sauce or soy sauce and brown the tofu before the egg." }] },
      { ingredientId: "tamarind", name: "Tamarind concentrate", quantity: 2, unit: "tablespoons", optional: false, group: "Sauce", notes: null, substitutions: [{ ingredient: "Lime juice", quantity: 1, unit: "tablespoon", effect: "Brighter and less rounded; add 1 extra teaspoon brown sugar." }] },
      { ingredientId: "fish-sauce", name: "Fish sauce", quantity: 2, unit: "tablespoons", optional: false, group: "Sauce", notes: null, substitutions: [{ ingredient: "Soy sauce", quantity: 2, unit: "tablespoons", effect: "A vegetarian swap that is less funky and slightly darker." }] },
      { ingredientId: "egg", name: "Egg", quantity: 1, unit: "large", optional: false, group: "Main", notes: null, substitutions: [] },
      { ingredientId: "sprouts", name: "Bean sprouts", quantity: 120, unit: "g", optional: false, group: "Garnish", notes: null, substitutions: [{ ingredient: "Thinly sliced cabbage", quantity: 120, unit: "g", effect: "Adds crunch but needs 1 extra minute in the wok." }] },
      { ingredientId: "peanuts", name: "Roasted peanuts", quantity: 40, unit: "g", optional: true, group: "Garnish", notes: "crushed", substitutions: [{ ingredient: "Roasted cashews", quantity: 40, unit: "g", effect: "A softer, sweeter crunch." }] },
      { ingredientId: "oil", name: "Neutral oil", quantity: 2, unit: "tablespoons", optional: false, group: "Oil", notes: null, substitutions: [] },
    ],
    steps: [
      { stepNumber: 1, title: "Soak and mix", instruction: "Cover the rice noodles with warm water and soak for 20 minutes, until bendable but still firm. Stir together tamarind, fish sauce, brown sugar, and 2 tablespoons water.", durationMinutes: 20, heatLevel: "Warm water", cookingCue: "A noodle should bend around your finger without snapping, but not feel soft." },
      { stepNumber: 2, title: "Cook the shrimp", instruction: "Heat a wok or wide skillet over high heat. Add 1 tablespoon oil and the shrimp. Stir-fry for 2–3 minutes, until pink and just opaque. Transfer to a plate.", durationMinutes: 3, heatLevel: "High", cookingCue: "The shrimp should curl into a loose C, not a tight O." },
      { stepNumber: 3, title: "Set the egg", instruction: "Add the remaining oil. Crack in the egg, let it set for 20 seconds, then scramble into large soft curds. Add the drained noodles and sauce.", durationMinutes: 2, heatLevel: "High", cookingCue: "Keep the egg in soft pieces; it will finish cooking with the noodles." },
      { stepNumber: 4, title: "Toss and finish", instruction: "Toss constantly for 3–4 minutes, lifting the noodles so they hydrate in the sauce. Return the shrimp, fold in half the bean sprouts, and serve with the remaining sprouts, peanuts, and lime.", durationMinutes: 4, heatLevel: "High", cookingCue: "The noodles should be tender with a slight spring, and the sauce should coat rather than pool." },
    ],
  },
  {
    recipeId: "red-lentil-soup",
    name: "Red Lentil Soup with Lemon",
    description: "A silky, cumin-scented lentil soup with carrots and lemon that comes together in one pot.",
    cuisine: "Middle Eastern",
    category: "Soup",
    dishType: "One-pot",
    mainIngredient: "Lentils",
    cookingTimeMinutes: 40,
    difficulty: "easy",
    vegetarian: true,
    spicy: false,
    mealType: "Lunch",
    prepTimeMinutes: 10,
    cookTimeMinutes: 30,
    totalTimeMinutes: 40,
    servings: 4,
    imageUrl: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=1600&q=85",
    tags: ["vegetarian", "budget-friendly", "freezer-friendly"],
    ingredients: [
      { ingredientId: "lentils", name: "Red lentils", quantity: 250, unit: "g", optional: false, group: "Main", notes: "rinsed", substitutions: [{ ingredient: "Yellow split lentils", quantity: 250, unit: "g", effect: "Simmer 10–15 minutes longer and add water as needed." }] },
      { ingredientId: "carrot", name: "Carrots", quantity: 2, unit: "medium", optional: false, group: "Vegetables", notes: "diced", substitutions: [{ ingredient: "Sweet potato", quantity: 250, unit: "g", effect: "Makes the soup sweeter and thicker." }] },
      { ingredientId: "onion", name: "Yellow onion", quantity: 1, unit: "medium", optional: false, group: "Vegetables", notes: "diced", substitutions: [{ ingredient: "Leek", quantity: 1, unit: "large", effect: "A gentler allium flavor." }] },
      { ingredientId: "cumin", name: "Ground cumin", quantity: 2, unit: "teaspoons", optional: false, group: "Seasoning", notes: null, substitutions: [] },
      { ingredientId: "stock", name: "Vegetable stock", quantity: 1, unit: "liter", optional: false, group: "Liquid", notes: "low-sodium", substitutions: [{ ingredient: "Water", quantity: 1, unit: "liter", effect: "Season more carefully and add a bay leaf if available." }] },
      { ingredientId: "lemon", name: "Lemon juice", quantity: 2, unit: "tablespoons", optional: false, group: "Finish", notes: null, substitutions: [{ ingredient: "Red wine vinegar", quantity: 1, unit: "tablespoon", effect: "More assertive acidity; add gradually." }] },
      { ingredientId: "oil", name: "Olive oil", quantity: 2, unit: "tablespoons", optional: false, group: "Oil", notes: null, substitutions: [] },
      { ingredientId: "chili", name: "Aleppo pepper", quantity: 1, unit: "teaspoon", optional: true, group: "Garnish", notes: null, substitutions: [{ ingredient: "Sweet paprika", quantity: 1, unit: "teaspoon", effect: "Adds color without heat." }] },
    ],
    steps: [
      { stepNumber: 1, title: "Sweat the vegetables", instruction: "Warm the olive oil in a heavy pot over medium heat. Add onion and carrot with a pinch of salt. Cook for 6–7 minutes, stirring, until the onion softens and the carrot edges lose their raw white color.", durationMinutes: 7, heatLevel: "Medium", cookingCue: "The vegetables should be soft enough to dent with the back of a spoon." },
      { stepNumber: 2, title: "Toast the cumin", instruction: "Add the cumin and stir for 30 seconds until fragrant. Add the rinsed lentils and stock, then bring to a boil.", durationMinutes: 4, heatLevel: "Medium-high", cookingCue: "The cumin should smell warm and nutty, never burnt." },
      { stepNumber: 3, title: "Simmer until silky", instruction: "Reduce to low, partially cover, and simmer for 20 minutes. Stir twice so the lentils do not settle. The soup is ready when the lentils have collapsed and the carrots mash easily.", durationMinutes: 20, heatLevel: "Low", cookingCue: "The surface should barely bubble and the soup should coat a spoon lightly." },
      { stepNumber: 4, title: "Brighten and serve", instruction: "Blend half the soup for a creamy texture or leave it chunky. Stir in the lemon juice, taste for salt, and finish with Aleppo pepper and a drizzle of olive oil.", durationMinutes: 4, heatLevel: "Off heat", cookingCue: "Lemon should lift the soup without making it taste sour." },
    ],
  },
  {
    recipeId: "salmon-teriyaki",
    name: "Glossy Salmon Teriyaki",
    description: "Pan-seared salmon lacquered with a quick soy-ginger glaze, served with rice and greens.",
    cuisine: "Japanese",
    category: "Dinner",
    dishType: "Seafood",
    mainIngredient: "Salmon",
    cookingTimeMinutes: 30,
    difficulty: "easy",
    vegetarian: false,
    spicy: false,
    mealType: "Dinner",
    prepTimeMinutes: 10,
    cookTimeMinutes: 20,
    totalTimeMinutes: 30,
    servings: 2,
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=1600&q=85",
    tags: ["quick", "high-protein", "weeknight"],
    ingredients: [
      { ingredientId: "salmon", name: "Salmon fillets", quantity: 2, unit: "fillets", optional: false, group: "Main", notes: "about 170 g each", substitutions: [{ ingredient: "Firm white fish", quantity: 340, unit: "g", effect: "Cook 2–3 minutes less per side because it is leaner." }] },
      { ingredientId: "soy", name: "Soy sauce", quantity: 3, unit: "tablespoons", optional: false, group: "Glaze", notes: null, substitutions: [{ ingredient: "Tamari", quantity: 3, unit: "tablespoons", effect: "A similar glaze with a slightly deeper flavor." }] },
      { ingredientId: "mirin", name: "Mirin", quantity: 2, unit: "tablespoons", optional: false, group: "Glaze", notes: null, substitutions: [{ ingredient: "Rice vinegar", quantity: 1, unit: "tablespoon", effect: "Add 1 extra teaspoon sugar to replace the sweetness." }] },
      { ingredientId: "ginger", name: "Fresh ginger", quantity: 1, unit: "tablespoon", optional: false, group: "Glaze", notes: "grated", substitutions: [{ ingredient: "Ground ginger", quantity: 0.25, unit: "teaspoon", effect: "Less fresh and aromatic; add it to the glaze." }] },
      { ingredientId: "sugar", name: "Brown sugar", quantity: 1, unit: "tablespoon", optional: false, group: "Glaze", notes: null, substitutions: [{ ingredient: "Honey", quantity: 2, unit: "teaspoons", effect: "A rounder, floral sweetness." }] },
      { ingredientId: "rice", name: "Cooked rice", quantity: 300, unit: "g", optional: false, group: "Base", notes: "warm", substitutions: [{ ingredient: "Cooked quinoa", quantity: 300, unit: "g", effect: "Adds a nuttier flavor and more texture." }] },
      { ingredientId: "oil", name: "Neutral oil", quantity: 1, unit: "tablespoon", optional: false, group: "Oil", notes: null, substitutions: [] },
      { ingredientId: "sesame", name: "Sesame seeds", quantity: 1, unit: "teaspoon", optional: true, group: "Garnish", notes: null, substitutions: [] },
    ],
    steps: [
      { stepNumber: 1, title: "Mix the glaze", instruction: "Whisk soy sauce, mirin, grated ginger, and brown sugar in a small bowl. Pat the salmon dry and season its flesh lightly; the glaze is already salty.", durationMinutes: 3, heatLevel: "No heat", cookingCue: "The sugar should dissolve enough that no dry crystals sit at the bottom." },
      { stepNumber: 2, title: "Sear the salmon", instruction: "Heat the oil in a nonstick skillet over medium-high. Place the salmon skin-side down and press gently for 20 seconds. Cook for 4–5 minutes until the skin is crisp and the fish is opaque halfway up the sides.", durationMinutes: 5, heatLevel: "Medium-high", cookingCue: "The fillet should release from the pan when the skin is crisp; do not force it." },
      { stepNumber: 3, title: "Glaze gently", instruction: "Flip the salmon and lower the heat to medium-low. Pour in the glaze and spoon it over the fish for 3–4 minutes. The center should reach 63°C or flake easily while remaining moist.", durationMinutes: 4, heatLevel: "Medium-low", cookingCue: "The glaze should thicken to a shiny coating, not boil hard or burn." },
      { stepNumber: 4, title: "Rest and plate", instruction: "Turn off the heat and rest the salmon in the pan for 2 minutes. Spoon the glaze over rice, add the salmon, and finish with sesame seeds and any steamed greens.", durationMinutes: 2, heatLevel: "Off heat", cookingCue: "Resting lets the glaze cling and the center finish gently." },
    ],
  },
];

const legacyArabic: Record<string, { name: string; description: string }> = {
  "shakshuka-classic": { name: "شكشوكة كلاسيكية", description: "بيض مطهو بهدوء في صلصة طماطم وفلفل متبلة، مع أعشاب وخبز دافي." },
  "chicken-shawarma-bowl": { name: "طبق شاورما فراخ سريع", description: "فراخ متبلة طرية مع أرز بالليمون وخيار مقرمش وصلصة زبادي باردة." },
  "spaghetti-carbonara": { name: "سباجيتي كاربونارا", description: "مكرونة بصوص البيض والجبنة مع بانشيتا مقرمشة وفلفل أسود." },
  "pad-thai": { name: "باد تاي متوازن", description: "نودلز أرز بصوص تمر هندي مع جمبري وبيض وفول سوداني محمص." },
  "red-lentil-soup": { name: "شوربة عدس أحمر بالليمون", description: "شوربة عدس ناعمة بالكمون والجزر والليمون، بتتعمل في حلة واحدة." },
  "salmon-teriyaki": { name: "سلمون ترياكي لامع", description: "سلمون متحمر ومغطى بصوص الصويا والزنجبيل، مع أرز وخضار." },
};

const ingredientArabic: Record<string, string> = {
  "Yellow onion": "بصل", "Red bell pepper": "فلفل رومي أحمر", Garlic: "ثوم", "Crushed tomatoes": "طماطم مطحونة",
  "Smoked paprika": "بابريكا مدخنة", Eggs: "بيض", "Fresh parsley": "بقدونس", "Olive oil": "زيت زيتون",
  "Boneless chicken thighs": "وراك فراخ مخلية", "Lemon juice": "عصير ليمون", "Plain Greek yogurt": "زبادي يوناني",
  "Shawarma spice blend": "خلطة بهارات شاورما", "Basmati rice": "أرز بسمتي", Cucumber: "خيار",
  "Spaghetti": "سباجيتي", Pancetta: "بانشيتا", "Egg yolks": "صفار بيض", "Pecorino Romano": "جبنة بيكورينو رومانو",
  "Black pepper": "فلفل أسود", "Thai rice noodles": "نودلز أرز تايلاندي", "Raw shrimp": "جمبري ني",
  "Tamarind concentrate": "مركز تمر هندي", "Fish sauce": "صوص سمك", Egg: "بيضة", "Bean sprouts": "براعم فاصوليا",
  "Roasted peanuts": "فول سوداني محمص", "Red lentils": "عدس أحمر", Carrots: "جزر", "Vegetable stock": "شوربة خضار",
  "Aleppo pepper": "فلفل حلبي", "Salmon fillets": "فيليه سلمون", "Soy sauce": "صوص صويا", Mirin: "ميرين",
  "Fresh ginger": "زنجبيل طازج", "Brown sugar": "سكر بني", "Cooked rice": "أرز مطبوخ", "Sesame seeds": "سمسم",
  "Fine salt": "ملح ناعم", "Neutral oil": "زيت نباتي", "Canned diced tomatoes": "طماطم مكعبات معلبة",
};

const legacyArabicUnits: Record<string, string> = {
  g: "جم", ml: "مل", large: "كبيرة", medium: "متوسطة", small: "صغيرة", clove: "فص", cloves: "فصوص",
  teaspoon: "ملعقة صغيرة", tablespoons: "ملاعق كبيرة", tablespoon: "ملعقة كبيرة", liter: "لتر", fillets: "فيليه",
};

function hydrateLegacyRecipe(recipe: InsertRecipe): InsertRecipe {
  const arabic = legacyArabic[recipe.recipeId] ?? { name: recipe.name, description: recipe.description };
  return {
    ...recipe,
    nameArabic: arabic.name,
    descriptionArabic: arabic.description,
    ingredients: recipe.ingredients.map((item) => ({
      ...item,
      nameArabic: ingredientArabic[item.name] ?? item.name,
      unitArabic: legacyArabicUnits[item.unit] ?? item.unit,
      groupArabic: item.group,
      notesArabic: item.notes,
      substitutions: item.substitutions.map((sub) => ({
        ...sub,
        ingredientArabic: ingredientArabic[sub.ingredient] ?? sub.ingredient,
        unitArabic: legacyArabicUnits[sub.unit] ?? sub.unit,
        effectArabic: sub.effect,
      })),
    })),
    steps: recipe.steps.map((item) => ({
      ...item,
      titleArabic: `الخطوة ${item.stepNumber}`,
      instructionArabic: item.instruction,
      heatLevelArabic: item.heatLevel,
      cookingCueArabic: item.cookingCue,
    })),
  };
}

const recipeSeed: InsertRecipe[] = [
  ...legacyRecipeSeed.map(hydrateLegacyRecipe),
  ...egyptianRecipeSeed,
];

export async function ensureRecipeSeeded() {
  const existing = await db.select({ recipeId: recipesTable.recipeId, nameArabic: recipesTable.nameArabic }).from(recipesTable);
  const existingIds = new Set(existing.map((row) => row.recipeId));
  const missing = recipeSeed.filter((recipe) => !existingIds.has(recipe.recipeId));
  if (missing.length > 0) {
    await db.insert(recipesTable).values(missing).onConflictDoNothing();
  }
  const needsArabic = existing.filter((row) => !row.nameArabic).map((row) => row.recipeId);
  for (const recipe of recipeSeed.filter((item) => needsArabic.includes(item.recipeId))) {
    const { recipeId, ...values } = recipe;
    await db.update(recipesTable).set(values).where(eq(recipesTable.recipeId, recipeId));
  }
}