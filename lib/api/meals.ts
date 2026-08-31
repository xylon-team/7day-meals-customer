import { MealPlan } from '@/lib/data/meal-plans';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8007';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiFoodItem {
  food_item_id: number;
  item_name: string;
  ingredient_list: string;
  image_path?: string | null;
  price: number | string;
  is_available: boolean;
}

export interface ApiMealPlanFoodItem {
  meal_id: number;
  food_item_id: number;
  day: string;
  meal_type: string;
  food_item: ApiFoodItem;
}

export interface ApiMealPlan {
  meal_id: number;
  item_name: string;
  category: string;
  description: string;
  dietary_preference: string;
  price: number | string;
  image_path?: string | null;
  is_available: boolean;
  meal_plan_food_item?: ApiMealPlanFoodItem[];
}

export interface QueryMealParams {
  search?: string;
  category?: string;
  dietary_preference?: string;
  min_price?: number;
  max_price?: number;
}

// Fallback high quality food imagery
const FALLBACK_IMAGES: Record<string, string> = {
  vegetarian: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
  'non-veg': 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80',
  vegan: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
  'gluten-free': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
  keto: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
  'high protein': 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  balanced: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';

// ─── Internal helper ──────────────────────────────────────────────────────────

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  });

  const data = await res.json();

  if (!res.ok) {
    const message = Array.isArray(data?.message)
      ? data.message.join(', ')
      : data?.message ?? 'An unexpected error occurred';
    throw new Error(message);
  }

  return data as T;
}

// ─── API Functions ────────────────────────────────────────────────────────────

/** GET /meals with search, category, dietary_preference, min_price, max_price */
export async function fetchMealPlans(params?: QueryMealParams): Promise<ApiMealPlan[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.category) query.set('category', params.category);
  if (params?.dietary_preference) query.set('dietary_preference', params.dietary_preference);
  if (params?.min_price !== undefined) query.set('min_price', String(params.min_price));
  if (params?.max_price !== undefined) query.set('max_price', String(params.max_price));

  const queryString = query.toString();
  const path = `/meals${queryString ? `?${queryString}` : ''}`;
  return request<ApiMealPlan[]>(path);
}

/** GET /meals/:mealId - Get detailed meal plan including food items */
export async function fetchMealPlanById(mealId: string | number): Promise<ApiMealPlan> {
  return request<ApiMealPlan>(`/meals/${mealId}`);
}

// ─── Data Transformer ─────────────────────────────────────────────────────────

export function mapApiMealToMealPlan(apiMeal: ApiMealPlan): MealPlan {
  // Extract food item names if present
  let items: string[] = [];
  if (apiMeal.meal_plan_food_item && apiMeal.meal_plan_food_item.length > 0) {
    items = apiMeal.meal_plan_food_item
      .map((mfi) => mfi.food_item?.item_name)
      .filter((name): name is string => Boolean(name));
    // Deduplicate items
    items = Array.from(new Set(items));
  }

  if (items.length === 0) {
    // Extract key words from item_name or description if food items are not explicitly configured
    items = apiMeal.description
      ? apiMeal.description.split(',').map((s) => s.trim()).slice(0, 4)
      : [apiMeal.category, apiMeal.dietary_preference];
  }

  // Determine category badge text
  let categoryStr: 'Vegetarian' | 'Non-Veg' | 'Vegan' | 'Gluten-Free' = 'Non-Veg';
  const pref = (apiMeal.dietary_preference || apiMeal.category || '').toLowerCase();

  if (pref.includes('veg') && !pref.includes('non') && !pref.includes('vegan')) {
    categoryStr = 'Vegetarian';
  } else if (pref.includes('vegan')) {
    categoryStr = 'Vegan';
  } else if (pref.includes('gluten')) {
    categoryStr = 'Gluten-Free';
  } else if (pref.includes('non')) {
    categoryStr = 'Non-Veg';
  } else if (apiMeal.category) {
    // Map category string as is
    categoryStr = apiMeal.category as any;
  }

  // Determine image
  let image = apiMeal.image_path?.trim() || '';
  if (!image) {
    const key = (apiMeal.dietary_preference || apiMeal.category || '').toLowerCase();
    image = FALLBACK_IMAGES[key] || DEFAULT_IMAGE;
  }

  return {
    id: String(apiMeal.meal_id),
    title: apiMeal.item_name,
    category: categoryStr,
    price: Number(apiMeal.price) || 0,
    image,
    items,
    status: apiMeal.is_available ? 'Available' : 'Sold Out',
    popularity: 90 + (apiMeal.meal_id % 10),
    description: apiMeal.description,
    apiData: apiMeal,
  };
}
