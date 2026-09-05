type OverpassTags = Record<string, string | undefined>;

type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: OverpassTags;
};

type OverpassResponse = {
  elements?: OverpassElement[];
};

export type RestaurantSearchFilters = {
  lat: number;
  lon: number;
  radius: number;
  query?: string;
  cuisine?: string;
  budget?: "budget" | "moderate" | "premium" | "luxury" | "any";
  mealType?: string;
  vegetarian?: boolean;
  openNow?: boolean;
  minRating?: number;
};

export type Restaurant = {
  id: string;
  name: string;
  source: string;
  sourceUrl: string | null;
  imageUrl: string | null;
  cuisine: string | null;
  rating: number | null;
  reviewCount: number | null;
  priceLevel: string | null;
  address: string | null;
  phone: string | null;
  openingHours: string | null;
  menuUrl: string | null;
  websiteUrl: string | null;
  recommendedDish: string | null;
  description: string | null;
  distanceMeters: number | null;
  isOpenNow: boolean | null;
  vegetarianAvailable: boolean | null;
  coordinates: { lat: number; lon: number };
  verifiedFields: string[];
  disclaimer: string;
};

const OVERPASS_URLS = [
  "https://overpass.openstreetmap.fr/api/interpreter",
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];
const SOURCE_NAME = "OpenStreetMap";
const DISCLAIMER =
  "Details are sourced from OpenStreetMap. Missing values are intentionally shown as unavailable; verify time-sensitive information before visiting.";

const asUrl = (value: string | undefined): string | null => {
  if (!value) return null;
  try {
    return new URL(value.startsWith("www.") ? `https://${value}` : value).toString();
  } catch {
    return null;
  }
};

const haversineMeters = (
  first: { lat: number; lon: number },
  second: { lat: number; lon: number },
) => {
  const earthRadius = 6_371_000;
  const latDelta = ((second.lat - first.lat) * Math.PI) / 180;
  const lonDelta = ((second.lon - first.lon) * Math.PI) / 180;
  const a =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos((first.lat * Math.PI) / 180) *
      Math.cos((second.lat * Math.PI) / 180) *
      Math.sin(lonDelta / 2) ** 2;
  return Math.round(earthRadius * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
};

const addressFromTags = (tags: OverpassTags) => {
  if (tags["addr:full"]) return tags["addr:full"];
  const parts = [
    [tags["addr:housenumber"], tags["addr:street"]].filter(Boolean).join(" "),
    tags["addr:suburb"],
    tags["addr:city"] ?? tags["addr:town"] ?? tags["addr:village"],
    tags["addr:postcode"],
  ].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
};

const priceLevelFromTags = (tags: OverpassTags) => {
  const raw = tags["price:level"]?.trim();
  if (!raw) return null;
  const numeric = Number(raw);
  if (!Number.isFinite(numeric) || numeric < 1 || numeric > 4) return null;
  return "$".repeat(numeric);
};

const priceMatchesBudget = (
  priceLevel: string | null,
  budget: RestaurantSearchFilters["budget"],
) => {
  if (!budget || budget === "any") return true;
  if (!priceLevel) return false;
  const count = priceLevel.length;
  if (budget === "budget") return count === 1;
  if (budget === "moderate") return count === 2;
  if (budget === "premium") return count === 3;
  return count >= 4;
};

const toRestaurant = (
  element: OverpassElement,
  origin: { lat: number; lon: number },
): Restaurant | null => {
  const tags = element.tags ?? {};
  const name = tags.name?.trim();
  const latitude = element.center?.lat ?? element.lat;
  const longitude = element.center?.lon ?? element.lon;
  if (!name || latitude == null || longitude == null) return null;
  const coordinates = { lat: latitude, lon: longitude };

  const cuisine = tags.cuisine?.replaceAll(";", ", ") ?? null;
  const websiteUrl = asUrl(tags["contact:website"] ?? tags.website);
  const menuUrl = asUrl(tags["menu:website"] ?? tags.menu);
  const imageUrl = asUrl(tags.image);
  const vegetarianTag = tags["diet:vegetarian"]?.toLowerCase();
  const vegetarianAvailable =
    vegetarianTag === "yes"
      ? true
      : vegetarianTag === "no"
        ? false
        : null;
  const verifiedFields: string[] = ["name", "coordinates"];
  if (cuisine) verifiedFields.push("cuisine");
  if (addressFromTags(tags)) verifiedFields.push("address");
  if (tags["contact:phone"] ?? tags.phone) verifiedFields.push("phone");
  if (tags.opening_hours) verifiedFields.push("openingHours");
  if (websiteUrl) verifiedFields.push("websiteUrl");
  if (menuUrl) verifiedFields.push("menuUrl");
  if (imageUrl) verifiedFields.push("imageUrl");
  if (vegetarianAvailable !== null) verifiedFields.push("vegetarianAvailable");

  return {
    id: `osm:${element.type}:${element.id}`,
    name,
    source: SOURCE_NAME,
    sourceUrl: `https://www.openstreetmap.org/${element.type}/${element.id}`,
    imageUrl,
    cuisine,
    rating: null,
    reviewCount: null,
    priceLevel: priceLevelFromTags(tags),
    address: addressFromTags(tags),
    phone: tags["contact:phone"] ?? tags.phone ?? null,
    openingHours: tags.opening_hours ?? null,
    menuUrl,
    websiteUrl,
    recommendedDish: null,
    description: tags.description ?? null,
    distanceMeters: haversineMeters(origin, coordinates),
    isOpenNow: null,
    vegetarianAvailable,
    coordinates,
    verifiedFields,
    disclaimer: DISCLAIMER,
  };
};

const matchesText = (restaurant: Restaurant, query: string) => {
  const haystack = [
    restaurant.name,
    restaurant.cuisine,
    restaurant.description,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
};

export async function searchRestaurants(
  filters: RestaurantSearchFilters,
): Promise<Restaurant[]> {
  const query = `
[out:json][timeout:25];
nwr["amenity"="restaurant"](around:${filters.radius},${filters.lat},${filters.lon});
out center tags;
`;
  let payload: OverpassResponse | null = null;
  let lastError: Error | null = null;
  for (const endpoint of OVERPASS_URLS) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "content-type": "application/x-www-form-urlencoded",
          "user-agent": "Loqma/1.0 (real restaurant discovery)",
        },
        body: new URLSearchParams({ data: query }),
        signal: AbortSignal.timeout(15_000),
      });
      if (!response.ok) {
        lastError = new Error(`Restaurant source returned ${response.status}`);
        continue;
      }
      payload = (await response.json()) as OverpassResponse;
      break;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
    }
  }
  if (!payload) {
    throw lastError ?? new Error("No restaurant source responded");
  }

  const origin = { lat: filters.lat, lon: filters.lon };
  return (payload.elements ?? [])
    .map((element) => toRestaurant(element, origin))
    .filter((restaurant): restaurant is Restaurant => restaurant !== null)
    .filter((restaurant) =>
      filters.query ? matchesText(restaurant, filters.query) : true,
    )
    .filter((restaurant) =>
      filters.cuisine
        ? restaurant.cuisine
          ? restaurant.cuisine
              .toLowerCase()
              .includes(filters.cuisine.toLowerCase())
          : false
        : true,
    )
    .filter((restaurant) => priceMatchesBudget(restaurant.priceLevel, filters.budget))
    .filter((restaurant) =>
      filters.mealType
        ? restaurant.description
          ? restaurant.description
              .toLowerCase()
              .includes(filters.mealType.toLowerCase())
          : false
        : true,
    )
    .filter((restaurant) =>
      filters.vegetarian === true
        ? restaurant.vegetarianAvailable === true
        : true,
    )
    .filter((restaurant) =>
      filters.openNow === true ? restaurant.isOpenNow === true : true,
    )
    .filter((restaurant) =>
      filters.minRating != null
        ? restaurant.rating != null && restaurant.rating >= filters.minRating
        : true,
    )
    .sort((first, second) => (first.distanceMeters ?? 0) - (second.distanceMeters ?? 0))
    .slice(0, 60);
}