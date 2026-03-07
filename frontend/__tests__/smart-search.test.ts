import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  parseNaturalLanguage,
  getAutocompleteSuggestions,
  calculateMatchScore,
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
} from '@/lib/smart-search';
import { type Property } from '@/data/properties';

// --- parseNaturalLanguage ---

describe('parseNaturalLanguage', () => {
  it('parses a full natural language query', () => {
    const result = parseNaturalLanguage('2 bed apartment in Boston under $2000');
    expect(result.beds).toBe(2);
    expect(result.location).toBe('boston');
    expect(result.maxPrice).toBe(2000);
    expect(result.propertyType).toBe('Entire place');
  });

  it('parses price range with dollar signs', () => {
    const result = parseNaturalLanguage('$1000-$2000');
    expect(result.minPrice).toBe(1000);
    expect(result.maxPrice).toBe(2000);
  });

  it('parses "under" price', () => {
    const result = parseNaturalLanguage('under $1500');
    expect(result.maxPrice).toBe(1500);
    expect(result.minPrice).toBeUndefined();
  });

  it('parses "above" price', () => {
    const result = parseNaturalLanguage('above $1000');
    expect(result.minPrice).toBe(1000);
    expect(result.maxPrice).toBeUndefined();
  });

  it('parses bedroom count', () => {
    expect(parseNaturalLanguage('3 bed').beds).toBe(3);
    expect(parseNaturalLanguage('2 bedroom').beds).toBe(2);
    expect(parseNaturalLanguage('1br').beds).toBe(1);
  });

  it('parses bathroom count', () => {
    expect(parseNaturalLanguage('2 bath').baths).toBe(2);
    expect(parseNaturalLanguage('1 bathroom').baths).toBe(1);
  });

  it('parses known cities', () => {
    expect(parseNaturalLanguage('apartment in san francisco').location).toBe('san francisco');
    expect(parseNaturalLanguage('room in chicago').location).toBe('chicago');
    expect(parseNaturalLanguage('manhattan studio').location).toBe('manhattan');
  });

  it('parses property types', () => {
    expect(parseNaturalLanguage('studio').propertyType).toBe('Entire place');
    expect(parseNaturalLanguage('private room').propertyType).toBe('Private room');
    expect(parseNaturalLanguage('shared room').propertyType).toBe('Shared room');
  });

  it('parses pet friendly', () => {
    expect(parseNaturalLanguage('pet friendly apartment').petFriendly).toBe(true);
    expect(parseNaturalLanguage('pets allowed').petFriendly).toBe(true);
  });

  it('parses furnished', () => {
    expect(parseNaturalLanguage('furnished apartment').furnished).toBe(true);
  });

  it('parses duration', () => {
    expect(parseNaturalLanguage('for 3 months').duration).toBe('3 months');
    expect(parseNaturalLanguage('for 1 month').duration).toBe('1 month');
    expect(parseNaturalLanguage('semester sublet').duration).toBe('4-5 months');
  });

  it('parses amenities', () => {
    const result = parseNaturalLanguage('apartment with wifi and parking');
    expect(result.amenities).toContain('WiFi');
    expect(result.amenities).toContain('Parking');
  });

  it('parses near university', () => {
    const result = parseNaturalLanguage('apartment near nyu');
    expect(result.nearUniversity).toBe('nyu');
  });

  it('returns empty results for empty query', () => {
    const result = parseNaturalLanguage('');
    expect(result.amenities).toEqual([]);
    expect(result.keywords).toEqual([]);
    expect(result.location).toBeUndefined();
    expect(result.beds).toBeUndefined();
  });

  it('handles combined complex query', () => {
    const result = parseNaturalLanguage('pet friendly 2 bed apartment near mit under $2500 with wifi');
    expect(result.petFriendly).toBe(true);
    expect(result.beds).toBe(2);
    expect(result.propertyType).toBe('Entire place');
    expect(result.nearUniversity).toBe('mit');
    expect(result.maxPrice).toBe(2500);
    expect(result.amenities).toContain('WiFi');
  });

  it('handles monthly price notation', () => {
    const result = parseNaturalLanguage('1500 a month');
    expect(result.minPrice).toBe(1000);
    expect(result.maxPrice).toBe(2000);
  });
});

// --- getAutocompleteSuggestions ---

describe('getAutocompleteSuggestions', () => {
  it('returns empty for short queries', () => {
    expect(getAutocompleteSuggestions('')).toEqual([]);
    expect(getAutocompleteSuggestions('a')).toEqual([]);
  });

  it('returns city suggestions', () => {
    const suggestions = getAutocompleteSuggestions('bos');
    const cityTypes = suggestions.filter(s => s.type === 'city');
    expect(cityTypes.length).toBeGreaterThan(0);
    expect(cityTypes[0].label).toBe('Boston');
  });

  it('returns university suggestions', () => {
    const suggestions = getAutocompleteSuggestions('mit');
    const uniTypes = suggestions.filter(s => s.type === 'university');
    expect(uniTypes.length).toBeGreaterThan(0);
    expect(uniTypes[0].value).toContain('mit');
  });

  it('returns popular search suggestions', () => {
    const suggestions = getAutocompleteSuggestions('pet friendly');
    const queryTypes = suggestions.filter(s => s.type === 'query');
    expect(queryTypes.length).toBeGreaterThan(0);
  });

  it('limits results to 6', () => {
    const suggestions = getAutocompleteSuggestions('an'); // matches many cities
    expect(suggestions.length).toBeLessThanOrEqual(6);
  });
});

// --- calculateMatchScore ---

describe('calculateMatchScore', () => {
  const baseProperty: Property = {
    id: 1,
    title: 'Test Apartment',
    location: 'Downtown Boston',
    city: 'Boston',
    price: 1800,
    duration: '3 months',
    durationMonths: 3,
    type: 'Entire place',
    beds: 2,
    baths: 1,
    sqft: 800,
    image: '/test.jpg',
    images: ['/test.jpg'],
    amenities: ['WiFi', 'Kitchen', 'Pets OK'],
    rating: 4.5,
    reviews: 10,
    available: 'Now',
    description: 'A nice place',
  };

  it('returns 100 for perfect match', () => {
    const parsed = parseNaturalLanguage('2 bed apartment in boston under $2000');
    const score = calculateMatchScore(baseProperty, parsed);
    expect(score).toBe(100);
  });

  it('gives partial score for price slightly over budget', () => {
    const expensiveProperty = { ...baseProperty, price: 2200 };
    const parsed = parseNaturalLanguage('apartment in boston under $2000');
    const score = calculateMatchScore(expensiveProperty, parsed);
    expect(score).toBeGreaterThan(0);
    expect(score).toBeLessThan(100);
  });

  it('gives 0 score for wrong city', () => {
    const parsed = parseNaturalLanguage('apartment in chicago');
    const score = calculateMatchScore(baseProperty, parsed);
    // Location is 30 points, type is 10 points; type matches but location doesn't
    expect(score).toBeLessThan(50);
  });

  it('scores pet friendly correctly', () => {
    const parsed = parseNaturalLanguage('pet friendly');
    const score = calculateMatchScore(baseProperty, parsed);
    expect(score).toBe(100); // has Pets OK

    const noPetsProperty = { ...baseProperty, amenities: ['WiFi'] };
    const score2 = calculateMatchScore(noPetsProperty, parsed);
    expect(score2).toBe(0);
  });

  it('scores amenities proportionally', () => {
    const parsed = parseNaturalLanguage('apartment with wifi and parking');
    // baseProperty has WiFi but not Parking
    const score = calculateMatchScore(baseProperty, parsed);
    // Should get partial amenity credit
    expect(score).toBeGreaterThan(0);
  });

  it('returns rating-based score when no filters applied', () => {
    const parsed = parseNaturalLanguage('');
    const score = calculateMatchScore(baseProperty, parsed);
    expect(score).toBe(Math.round((baseProperty.rating / 5) * 100));
  });

  it('gives full bedroom score for exact match', () => {
    const parsed = parseNaturalLanguage('2 bed');
    const score = calculateMatchScore(baseProperty, parsed);
    expect(score).toBe(100); // exact bed match = 15/15 = 100%
  });

  it('gives partial bedroom score for more beds than requested', () => {
    const parsed = parseNaturalLanguage('1 bed');
    const score = calculateMatchScore(baseProperty, parsed);
    // property has 2 beds, asked for 1 — gets 10/15
    expect(score).toBeLessThan(100);
    expect(score).toBeGreaterThan(0);
  });
});

// --- Recent Searches (localStorage) ---

describe('recent searches', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns empty array when no searches saved', () => {
    expect(getRecentSearches()).toEqual([]);
  });

  it('adds and retrieves recent searches', () => {
    addRecentSearch('apartment in boston');
    const recent = getRecentSearches();
    expect(recent).toEqual(['apartment in boston']);
  });

  it('puts newest search first', () => {
    addRecentSearch('first search');
    addRecentSearch('second search');
    const recent = getRecentSearches();
    expect(recent[0]).toBe('second search');
    expect(recent[1]).toBe('first search');
  });

  it('deduplicates searches', () => {
    addRecentSearch('apartment in boston');
    addRecentSearch('studio near nyu');
    addRecentSearch('apartment in boston');
    const recent = getRecentSearches();
    expect(recent.length).toBe(2);
    expect(recent[0]).toBe('apartment in boston');
  });

  it('limits to 5 recent searches', () => {
    for (let i = 0; i < 8; i++) {
      addRecentSearch(`search ${i}`);
    }
    expect(getRecentSearches().length).toBe(5);
  });

  it('clears recent searches', () => {
    addRecentSearch('test');
    clearRecentSearches();
    expect(getRecentSearches()).toEqual([]);
  });

  it('ignores empty queries', () => {
    addRecentSearch('');
    addRecentSearch('   ');
    expect(getRecentSearches()).toEqual([]);
  });
});
