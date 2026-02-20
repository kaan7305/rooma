import { create } from 'zustand';

export interface Review {
  id: string;
  propertyId: number;
  userId: string;
  userName: string;
  userInitials: string;
  rating: number;
  comment: string;
  createdAt: string;
  photos?: string[]; // Review photos
  verifiedBooking?: boolean; // User had a verified booking
  hostResponse?: {
    comment: string;
    createdAt: string;
  };
  helpfulCount?: number;
  helpfulVotes?: string[]; // Array of user IDs who found this helpful
}

interface ReviewsState {
  reviews: Review[];
  loadReviews: () => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'helpfulCount' | 'helpfulVotes'>) => void;
  addHostResponse: (reviewId: string, comment: string) => void;
  toggleHelpful: (reviewId: string, userId: string) => void;
  getPropertyReviews: (propertyId: number) => Review[];
  getAverageRating: (propertyId: number) => number;
}

export const useReviewsStore = create<ReviewsState>((set, get) => ({
  reviews: [],

  loadReviews: () => {
    const reviewsJson = localStorage.getItem('rooma_reviews');
    if (reviewsJson) {
      try {
        const reviews = JSON.parse(reviewsJson);
        set({ reviews });
      } catch (error) {
        console.error('Failed to load reviews', error);
        set({ reviews: [] });
      }
    }
  },

  addReview: (reviewData) => {
    const { reviews } = get();
    const newReview: Review = {
      ...reviewData,
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      helpfulCount: 0,
      helpfulVotes: [],
    };
    const updatedReviews = [...reviews, newReview];
    set({ reviews: updatedReviews });
    localStorage.setItem('rooma_reviews', JSON.stringify(updatedReviews));
  },

  addHostResponse: (reviewId, comment) => {
    const { reviews } = get();
    const updatedReviews = reviews.map(review =>
      review.id === reviewId
        ? {
            ...review,
            hostResponse: {
              comment,
              createdAt: new Date().toISOString(),
            },
          }
        : review
    );
    set({ reviews: updatedReviews });
    localStorage.setItem('rooma_reviews', JSON.stringify(updatedReviews));
  },

  toggleHelpful: (reviewId, userId) => {
    const { reviews } = get();
    const updatedReviews = reviews.map(review => {
      if (review.id === reviewId) {
        const helpfulVotes = review.helpfulVotes || [];
        const hasVoted = helpfulVotes.includes(userId);

        return {
          ...review,
          helpfulVotes: hasVoted
            ? helpfulVotes.filter(id => id !== userId)
            : [...helpfulVotes, userId],
          helpfulCount: hasVoted
            ? (review.helpfulCount || 0) - 1
            : (review.helpfulCount || 0) + 1,
        };
      }
      return review;
    });
    set({ reviews: updatedReviews });
    localStorage.setItem('rooma_reviews', JSON.stringify(updatedReviews));
  },

  getPropertyReviews: (propertyId) => {
    const { reviews } = get();
    return reviews
      .filter(review => review.propertyId === propertyId)
      .sort((a, b) => {
        // Sort by helpful count first, then by date
        const helpfulDiff = (b.helpfulCount || 0) - (a.helpfulCount || 0);
        if (helpfulDiff !== 0) return helpfulDiff;
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  },

  getAverageRating: (propertyId) => {
    const { reviews } = get();
    const propertyReviews = reviews.filter(review => review.propertyId === propertyId);
    if (propertyReviews.length === 0) return 0;
    const sum = propertyReviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / propertyReviews.length) * 10) / 10;
  },
}));
