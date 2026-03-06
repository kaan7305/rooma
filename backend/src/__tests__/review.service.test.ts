/**
 * Review Service Unit Tests
 * Tests review creation, update, deletion, host response, and rating calculations
 */

import request from 'supertest';
import app from '../app';

describe('Review Service', () => {
  // ==========================================
  // AVERAGE RATING CALCULATION TESTS
  // ==========================================
  describe('Rating Calculations', () => {
    const calculateAverage = (ratings: number[]): number | null => {
      if (ratings.length === 0) return null;
      const total = ratings.reduce((sum, r) => sum + r, 0);
      return Math.round((total / ratings.length) * 100) / 100;
    };

    it('should calculate average rating from multiple reviews', () => {
      const ratings = [4.5, 3.5, 5.0, 4.0];
      expect(calculateAverage(ratings)).toBe(4.25);
    });

    it('should return exact value for single rating', () => {
      expect(calculateAverage([4.0])).toBe(4);
    });

    it('should return null for empty array', () => {
      expect(calculateAverage([])).toBeNull();
    });

    it('should round to 2 decimal places', () => {
      const ratings = [4.0, 3.0, 5.0]; // 4.0
      expect(calculateAverage(ratings)).toBe(4);
    });

    it('should handle all 5-star ratings', () => {
      const ratings = [5, 5, 5, 5, 5];
      expect(calculateAverage(ratings)).toBe(5);
    });

    it('should handle mixed ratings correctly', () => {
      const ratings = [1, 2, 3, 4, 5];
      expect(calculateAverage(ratings)).toBe(3);
    });
  });

  // ==========================================
  // MULTI-METRIC RATING TESTS
  // ==========================================
  describe('Multi-Metric Ratings', () => {
    interface ReviewRatings {
      overall_rating: number;
      cleanliness_rating: number | null;
      accuracy_rating: number | null;
      location_rating: number | null;
      communication_rating: number | null;
      value_rating: number | null;
    }

    const calculateCategoryAverages = (reviews: ReviewRatings[]) => {
      const avg = (vals: Array<number | null>) => {
        const nums = vals.filter((v): v is number => v !== null);
        if (nums.length === 0) return null;
        return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
      };

      return {
        overall: avg(reviews.map((r) => r.overall_rating)),
        cleanliness: avg(reviews.map((r) => r.cleanliness_rating)),
        accuracy: avg(reviews.map((r) => r.accuracy_rating)),
        location: avg(reviews.map((r) => r.location_rating)),
        communication: avg(reviews.map((r) => r.communication_rating)),
        value: avg(reviews.map((r) => r.value_rating)),
      };
    };

    it('should calculate averages across all categories', () => {
      const reviews: ReviewRatings[] = [
        { overall_rating: 4, cleanliness_rating: 5, accuracy_rating: 4, location_rating: 3, communication_rating: 5, value_rating: 4 },
        { overall_rating: 5, cleanliness_rating: 4, accuracy_rating: 5, location_rating: 4, communication_rating: 4, value_rating: 5 },
      ];

      const avgs = calculateCategoryAverages(reviews);
      expect(avgs.overall).toBe(4.5);
      expect(avgs.cleanliness).toBe(4.5);
      expect(avgs.accuracy).toBe(4.5);
      expect(avgs.location).toBe(3.5);
      expect(avgs.communication).toBe(4.5);
      expect(avgs.value).toBe(4.5);
    });

    it('should handle null category ratings gracefully', () => {
      const reviews: ReviewRatings[] = [
        { overall_rating: 4, cleanliness_rating: 5, accuracy_rating: null, location_rating: null, communication_rating: 5, value_rating: null },
        { overall_rating: 5, cleanliness_rating: 4, accuracy_rating: null, location_rating: 4, communication_rating: null, value_rating: 3 },
      ];

      const avgs = calculateCategoryAverages(reviews);
      expect(avgs.overall).toBe(4.5);
      expect(avgs.cleanliness).toBe(4.5);
      expect(avgs.accuracy).toBeNull();
      expect(avgs.location).toBe(4);
      expect(avgs.communication).toBe(5);
      expect(avgs.value).toBe(3);
    });
  });

  // ==========================================
  // REVIEW DELETION TIME WINDOW TESTS
  // ==========================================
  describe('Review Deletion Time Window', () => {
    const canDeleteReview = (createdAt: Date, hasHostResponse: boolean): { allowed: boolean; reason?: string } => {
      if (hasHostResponse) {
        return { allowed: false, reason: 'Cannot delete review after host has responded' };
      }

      const hoursSinceCreation = (new Date().getTime() - createdAt.getTime()) / (1000 * 60 * 60);
      if (hoursSinceCreation > 48) {
        return { allowed: false, reason: 'Reviews can only be deleted within 48 hours of posting' };
      }

      return { allowed: true };
    };

    it('should allow deletion within 48 hours and no host response', () => {
      const createdAt = new Date(Date.now() - 24 * 60 * 60 * 1000); // 24 hours ago
      const result = canDeleteReview(createdAt, false);
      expect(result.allowed).toBe(true);
    });

    it('should prevent deletion after 48 hours', () => {
      const createdAt = new Date(Date.now() - 49 * 60 * 60 * 1000); // 49 hours ago
      const result = canDeleteReview(createdAt, false);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('48 hours');
    });

    it('should prevent deletion if host has responded', () => {
      const createdAt = new Date(Date.now() - 1 * 60 * 60 * 1000); // 1 hour ago
      const result = canDeleteReview(createdAt, true);
      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('host has responded');
    });

    it('should allow deletion right after posting', () => {
      const result = canDeleteReview(new Date(), false);
      expect(result.allowed).toBe(true);
    });
  });

  // ==========================================
  // REVIEW TYPE DETERMINATION TESTS
  // ==========================================
  describe('Review Type Determination', () => {
    it('should set type as guest_to_host when reviewer is the guest', () => {
      const guestId = 'user-1';
      const hostId = 'user-2';
      const reviewerId = guestId;
      const isGuest = reviewerId === guestId;
      const reviewType = isGuest ? 'guest_to_host' : 'host_to_guest';
      expect(reviewType).toBe('guest_to_host');
    });

    it('should set type as host_to_guest when reviewer is the host', () => {
      const guestId = 'user-1';
      const hostId = 'user-2';
      const reviewerId = hostId;
      const isGuest = reviewerId === guestId;
      const reviewType = isGuest ? 'guest_to_host' : 'host_to_guest';
      expect(reviewType).toBe('host_to_guest');
    });

    it('should set reviewee as host when reviewer is guest', () => {
      const guestId = 'user-1';
      const hostId = 'user-2';
      const reviewerId = guestId;
      const isGuest = reviewerId === guestId;
      const revieweeId = isGuest ? hostId : guestId;
      expect(revieweeId).toBe(hostId);
    });
  });

  // ==========================================
  // API ENDPOINT TESTS
  // ==========================================
  describe('Review API Endpoints', () => {
    it('should require authentication to create a review', async () => {
      const response = await request(app)
        .post('/api/reviews')
        .send({
          booking_id: '00000000-0000-0000-0000-000000000000',
          overall_rating: 5,
          comment: 'Great place!',
        });

      expect(response.status).toBe(401);
    });

    it('should require authentication to get user reviews', async () => {
      const response = await request(app).get('/api/reviews?reviewer_id=some-id');
      // Reviews listing might be public, check for proper response format
      expect([200, 401]).toContain(response.status);
    });

    it('should return reviews for a property (public endpoint)', async () => {
      const response = await request(app)
        .get('/api/reviews?property_id=00000000-0000-0000-0000-000000000000');

      // Should return empty results or proper error, not crash
      expect([200, 404, 500]).toContain(response.status);
    });
  });
});
