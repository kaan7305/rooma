import { create } from 'zustand';

export interface Review {
  id: string;
  propertyId: number;
  userId: number;
  userName: string;
  userInitials: string;
  rating: number;
  comment: string;
  createdAt: string;
}

interface ReviewsState {
  reviews: Review[];
  loadReviews: () => void;
  addReview: (review: Omit<Review, 'id' | 'createdAt'>) => void;
  getPropertyReviews: (propertyId: number) => Review[];
  getAverageRating: (propertyId: number) => number;
}

export const useReviewsStore = create<ReviewsState>((set, get) => ({
  reviews: [],

  loadReviews: () => {
    const reviewsJson = localStorage.getItem('nestquarter_reviews');
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
    };
    const updatedReviews = [...reviews, newReview];
    set({ reviews: updatedReviews });
    localStorage.setItem('nestquarter_reviews', JSON.stringify(updatedReviews));
  },

  getPropertyReviews: (propertyId) => {
    const { reviews } = get();
    return reviews.filter(review => review.propertyId === propertyId);
  },

  getAverageRating: (propertyId) => {
    const { reviews } = get();
    const propertyReviews = reviews.filter(review => review.propertyId === propertyId);
    if (propertyReviews.length === 0) return 0;
    const sum = propertyReviews.reduce((acc, review) => acc + review.rating, 0);
    return Math.round((sum / propertyReviews.length) * 10) / 10;
  },
}));
