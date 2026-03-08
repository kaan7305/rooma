import { type Property } from '@/data/properties';

// --- Natural Language Parser ---

export interface ParsedSearch {
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  beds?: number;
  baths?: number;
  propertyType?: string;
  amenities: string[];
  duration?: string;
  keywords: string[];
  petFriendly?: boolean;
  furnished?: boolean;
  nearUniversity?: string;
}

const CITIES = [
  'new york', 'manhattan', 'brooklyn', 'queens', 'bronx',
  'boston', 'cambridge', 'somerville',
  'san francisco', 'oakland', 'berkeley',
  'los angeles', 'santa monica', 'hollywood',
  'chicago', 'seattle', 'austin', 'miami',
  'philadelphia', 'washington dc', 'denver',
  'portland', 'atlanta', 'dallas', 'houston',
  'san diego', 'minneapolis', 'nashville',
];

const UNIVERSITIES = [
  'nyu', 'columbia', 'harvard', 'mit', 'stanford',
  'berkeley', 'ucla', 'usc', 'boston university', 'bu',
  'northeastern', 'uchicago', 'uw', 'ut austin',
  'georgia tech', 'umich', 'penn', 'upenn',
  'johns hopkins', 'duke', 'yale', 'princeton',
  'cornell', 'brown', 'dartmouth',
];

const PROPERTY_TYPES: Record<string, string> = {
  'apartment': 'Entire place',
  'apt': 'Entire place',
  'studio': 'Entire place',
  'house': 'Entire place',
  'entire': 'Entire place',
  'entire place': 'Entire place',
  'private room': 'Private room',
  'private': 'Private room',
  'room': 'Private room',
  'shared': 'Shared room',
  'shared room': 'Shared room',
};

const AMENITY_KEYWORDS: Record<string, string> = {
  'wifi': 'WiFi',
  'internet': 'WiFi',
  'kitchen': 'Kitchen',
  'washer': 'Washer',
  'laundry': 'Washer',
  'dryer': 'Dryer',
  'ac': 'AC',
  'air conditioning': 'AC',
  'parking': 'Parking',
  'gym': 'Gym',
  'fitness': 'Gym',
  'pool': 'Pool',
  'swimming': 'Pool',
  'pets': 'Pets OK',
  'pet friendly': 'Pets OK',
  'dog': 'Pets OK',
  'cat': 'Pets OK',
  'backyard': 'Backyard',
  'yard': 'Backyard',
  'garden': 'Backyard',
};

export function parseNaturalLanguage(query: string): ParsedSearch {
  const result: ParsedSearch = { amenities: [], keywords: [] };
  let remaining = query.toLowerCase().trim();

  // Extract price: "under $2000", "$1000-$2000", "below 1500", "max 2000", "$1500/mo"
  const pricePatterns = [
    /(?:under|below|max|up to|less than|cheaper than)\s*\$?(\d+)/i,
    /\$(\d+)\s*[-–to]+\s*\$?(\d+)/i,
    /(?:above|over|min|at least|more than)\s*\$?(\d+)/i,
    /\$(\d+)(?:\/mo(?:nth)?)?/i,
    /(\d{3,4})\s*(?:a month|per month|monthly|\/mo)/i,
  ];

  const underMatch = remaining.match(pricePatterns[0]);
  if (underMatch) {
    result.maxPrice = parseInt(underMatch[1]);
    remaining = remaining.replace(underMatch[0], ' ');
  }

  const rangeMatch = remaining.match(pricePatterns[1]);
  if (rangeMatch) {
    result.minPrice = parseInt(rangeMatch[1]);
    result.maxPrice = parseInt(rangeMatch[2]);
    remaining = remaining.replace(rangeMatch[0], ' ');
  }

  const overMatch = remaining.match(pricePatterns[2]);
  if (overMatch) {
    result.minPrice = parseInt(overMatch[1]);
    remaining = remaining.replace(overMatch[0], ' ');
  }

  if (!result.minPrice && !result.maxPrice) {
    const dollarMatch = remaining.match(pricePatterns[3]);
    if (dollarMatch) {
      const price = parseInt(dollarMatch[1]);
      result.maxPrice = price + 500;
      result.minPrice = Math.max(0, price - 500);
      remaining = remaining.replace(dollarMatch[0], ' ');
    }
  }

  const monthlyMatch = remaining.match(pricePatterns[4]);
  if (monthlyMatch && !result.minPrice && !result.maxPrice) {
    const price = parseInt(monthlyMatch[1]);
    result.maxPrice = price + 500;
    result.minPrice = Math.max(0, price - 500);
    remaining = remaining.replace(monthlyMatch[0], ' ');
  }

  // Extract bedrooms: "2 bed", "2br", "2 bedroom", "two bed"
  const bedMatch = remaining.match(/(\d+)\s*(?:bed(?:room)?s?|br)\b/i);
  if (bedMatch) {
    result.beds = parseInt(bedMatch[1]);
    remaining = remaining.replace(bedMatch[0], ' ');
  }

  // Extract bathrooms: "2 bath", "2ba", "1 bathroom"
  const bathMatch = remaining.match(/(\d+)\s*(?:bath(?:room)?s?|ba)\b/i);
  if (bathMatch) {
    result.baths = parseInt(bathMatch[1]);
    remaining = remaining.replace(bathMatch[0], ' ');
  }

  // Extract duration: "for 3 months", "semester", "6 months"
  const durationPatterns = [
    /(?:for\s+)?(\d+)\s*months?/i,
    /semester/i,
    /(?:for\s+)?(\d+)\s*weeks?/i,
    /(?:for\s+)?(\d+)\s*years?/i,
  ];

  const monthDur = remaining.match(durationPatterns[0]);
  if (monthDur) {
    result.duration = `${monthDur[1]} month${parseInt(monthDur[1]) > 1 ? 's' : ''}`;
    remaining = remaining.replace(monthDur[0], ' ');
  }
  const semesterDur = remaining.match(durationPatterns[1]);
  if (semesterDur) {
    result.duration = '4-5 months';
    remaining = remaining.replace(semesterDur[0], ' ');
  }

  // Extract "near university"
  for (const uni of UNIVERSITIES) {
    const nearPattern = new RegExp(`(?:near|by|close to|around|next to)\\s+${uni.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'i');
    if (nearPattern.test(remaining)) {
      result.nearUniversity = uni;
      remaining = remaining.replace(nearPattern, ' ');
    }
  }

  // Extract pet friendly
  if (/\bpet(?:s|\s*friendly)?\b/i.test(remaining)) {
    result.petFriendly = true;
    remaining = remaining.replace(/\bpet(?:s|\s*friendly)?\b/i, ' ');
  }

  // Extract furnished
  if (/\bfurnished\b/i.test(remaining)) {
    result.furnished = true;
    remaining = remaining.replace(/\bfurnished\b/i, ' ');
  }

  // Extract property type (check longest keywords first to avoid partial matches)
  const sortedPropertyTypes = Object.entries(PROPERTY_TYPES).sort((a, b) => b[0].length - a[0].length);
  for (const [keyword, type] of sortedPropertyTypes) {
    const typePattern = new RegExp(`\\b${keyword}\\b`, 'i');
    if (typePattern.test(remaining)) {
      result.propertyType = type;
      remaining = remaining.replace(typePattern, ' ');
      break;
    }
  }

  // Extract amenities
  for (const [keyword, amenity] of Object.entries(AMENITY_KEYWORDS)) {
    const amenityPattern = new RegExp(`\\b${keyword}\\b`, 'i');
    if (amenityPattern.test(remaining) && !result.amenities.includes(amenity)) {
      result.amenities.push(amenity);
      remaining = remaining.replace(amenityPattern, ' ');
    }
  }

  // Extract location (city) — check longest match first
  const sortedCities = [...CITIES].sort((a, b) => b.length - a.length);
  for (const city of sortedCities) {
    const cityPattern = new RegExp(`\\b${city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    if (cityPattern.test(remaining)) {
      result.location = city;
      remaining = remaining.replace(cityPattern, ' ');
      break;
    }
  }

  // Also check "in <location>" pattern
  if (!result.location) {
    const inMatch = remaining.match(/\bin\s+([a-z\s]+?)(?:\s+(?:under|below|near|for|with|$))/i);
    if (inMatch) {
      result.location = inMatch[1].trim();
      remaining = remaining.replace(inMatch[0], ' ' + (inMatch[0].replace(inMatch[1], '')));
    }
  }

  // Clean up stop words from remaining
  const stopWords = ['in', 'a', 'an', 'the', 'with', 'and', 'or', 'for', 'near', 'by', 'to', 'from', 'at', 'on'];
  const keywords = remaining
    .split(/\s+/)
    .filter(w => w.length > 1 && !stopWords.includes(w))
    .filter(Boolean);
  result.keywords = keywords;

  return result;
}

// --- Autocomplete Suggestions ---

export interface SearchSuggestion {
  type: 'city' | 'university' | 'query' | 'filter';
  label: string;
  value: string;
  icon?: string;
}

const POPULAR_SEARCHES = [
  'Studio near NYU for fall semester',
  '2 bed near UCLA under $2000',
  'Room near Harvard for summer',
  'Furnished apartment near Columbia',
  '1 bed near BU under $1800',
  'Pet friendly near UC Berkeley',
  'Private room near UChicago',
  'Apartment near UT Austin with WiFi',
];

export function getAutocompleteSuggestions(query: string): SearchSuggestion[] {
  if (!query || query.length < 2) return [];

  const q = query.toLowerCase();
  const suggestions: SearchSuggestion[] = [];

  // City matches
  for (const city of CITIES) {
    if (city.includes(q) && suggestions.length < 8) {
      const capitalized = city.split(' ').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
      suggestions.push({
        type: 'city',
        label: capitalized,
        value: capitalized,
        icon: 'map-pin',
      });
    }
  }

  // University matches
  for (const uni of UNIVERSITIES) {
    if (uni.includes(q) && suggestions.length < 8) {
      suggestions.push({
        type: 'university',
        label: `Near ${uni.toUpperCase()}`,
        value: `near ${uni}`,
        icon: 'graduation-cap',
      });
    }
  }

  // Popular search matches
  for (const search of POPULAR_SEARCHES) {
    if (search.toLowerCase().includes(q) && suggestions.length < 8) {
      suggestions.push({
        type: 'query',
        label: search,
        value: search,
        icon: 'search',
      });
    }
  }

  return suggestions.slice(0, 6);
}

// --- Match Score ---

export function calculateMatchScore(property: Property, parsed: ParsedSearch): number {
  let score = 0;
  let maxScore = 0;

  // Location match (30 points)
  if (parsed.location) {
    maxScore += 30;
    const loc = parsed.location.toLowerCase();
    if (property.city.toLowerCase().includes(loc) || property.location.toLowerCase().includes(loc)) {
      score += 30;
    }
  }

  // Price match (25 points)
  if (parsed.minPrice || parsed.maxPrice) {
    maxScore += 25;
    const min = parsed.minPrice || 0;
    const max = parsed.maxPrice || Infinity;
    if (property.price >= min && property.price <= max) {
      score += 25;
    } else if (property.price < min) {
      // Slightly below budget is still okay
      const diff = (min - property.price) / min;
      score += Math.max(0, 25 * (1 - diff * 2));
    } else if (max !== Infinity) {
      // Slightly over budget gets partial credit
      const diff = (property.price - max) / max;
      score += Math.max(0, 25 * (1 - diff * 3));
    }
  }

  // Bedrooms match (15 points)
  if (parsed.beds) {
    maxScore += 15;
    if (property.beds >= parsed.beds) {
      score += property.beds === parsed.beds ? 15 : 10;
    }
  }

  // Bathrooms match (10 points)
  if (parsed.baths) {
    maxScore += 10;
    if (property.baths >= parsed.baths) {
      score += property.baths === parsed.baths ? 10 : 7;
    }
  }

  // Property type match (10 points)
  if (parsed.propertyType) {
    maxScore += 10;
    if (property.type.toLowerCase() === parsed.propertyType.toLowerCase()) {
      score += 10;
    }
  }

  // Amenities match (10 points distributed)
  if (parsed.amenities.length > 0) {
    maxScore += 10;
    const matched = parsed.amenities.filter(a => property.amenities.includes(a)).length;
    score += (matched / parsed.amenities.length) * 10;
  }

  // Pet friendly (5 points)
  if (parsed.petFriendly) {
    maxScore += 5;
    if (property.amenities.includes('Pets OK')) {
      score += 5;
    }
  }

  // If no filters were applied, return base score from rating
  if (maxScore === 0) {
    return Math.round((property.rating / 5) * 100);
  }

  return Math.round((score / maxScore) * 100);
}

// --- Recent Searches ---

const RECENT_SEARCHES_KEY = 'rooma_recent_searches';
const MAX_RECENT = 5;

export function getRecentSearches(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  if (typeof window === 'undefined' || !query.trim()) return;
  const recent = getRecentSearches().filter(s => s !== query);
  recent.unshift(query);
  localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
}

export function clearRecentSearches(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(RECENT_SEARCHES_KEY);
}
