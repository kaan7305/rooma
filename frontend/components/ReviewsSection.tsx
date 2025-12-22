'use client';

import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { useReviewsStore, type Review } from '@/lib/reviews-store';

interface ReviewsSectionProps {
  propertyId: number;
}

export default function ReviewsSection({ propertyId }: ReviewsSectionProps) {
  const { user, isAuthenticated } = useAuthStore();
  const { reviews, loadReviews, addReview, getPropertyReviews, getAverageRating } = useReviewsStore();

  const [propertyReviews, setPropertyReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  useEffect(() => {
    const propReviews = getPropertyReviews(propertyId);
    setPropertyReviews(propReviews);
    setAverageRating(getAverageRating(propertyId));
  }, [propertyId, reviews, getPropertyReviews, getAverageRating]);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      alert('Please log in to leave a review');
      return;
    }

    if (!comment.trim()) {
      alert('Please write a comment');
      return;
    }

    addReview({
      propertyId,
      userId: user.id,
      userName: `${user.first_name} ${user.last_name}`,
      userInitials: `${user.first_name[0]}${user.last_name[0]}`,
      rating,
      comment: comment.trim(),
    });

    setComment('');
    setRating(5);
    setShowReviewForm(false);
    alert('Review submitted successfully!');
  };

  const renderStars = (rating: number, interactive: boolean = false, onRate?: (rating: number) => void) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type={interactive ? 'button' : undefined}
            onClick={() => interactive && onRate && onRate(star)}
            className={interactive ? 'cursor-pointer hover:scale-110 transition' : ''}
            disabled={!interactive}
          >
            <Star
              className={`w-5 h-5 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Reviews</h2>
          {propertyReviews.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-bold text-gray-900">{averageRating}</span>
              </div>
              <span className="text-gray-600">· {propertyReviews.length} review{propertyReviews.length !== 1 ? 's' : ''}</span>
            </div>
          )}
        </div>

        {isAuthenticated && !showReviewForm && (
          <button
            onClick={() => setShowReviewForm(true)}
            className="px-6 py-2 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showReviewForm && (
        <form onSubmit={handleSubmitReview} className="mb-8 p-6 bg-gradient-to-br from-rose-50 to-pink-50 rounded-xl border border-rose-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Share Your Experience</h3>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Rating
            </label>
            {renderStars(rating, true, setRating)}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              placeholder="Tell others about your experience with this property..."
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              required
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              Submit Review
            </button>
            <button
              type="button"
              onClick={() => {
                setShowReviewForm(false);
                setComment('');
                setRating(5);
              }}
              className="px-6 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Reviews List */}
      {propertyReviews.length === 0 ? (
        <div className="text-center py-12">
          <Star className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-600">No reviews yet. Be the first to review this property!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {propertyReviews.map((review) => (
            <div key={review.id} className="pb-6 border-b border-gray-200 last:border-0">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                  {review.userInitials}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                      <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                    </div>
                    {renderStars(review.rating)}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
