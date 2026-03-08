'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, BadgeCheck, MessageSquare, Image as ImageIcon, X } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { useReviewsStore, type Review } from '@/lib/reviews-store';
import { useToast } from '@/lib/toast-context';
import ImageUpload from './ImageUpload';

interface ReviewsSectionProps {
  propertyId: number;
  isHost?: boolean; // Whether current user is the host of this property
}

export default function ReviewsSection({ propertyId, isHost = false }: ReviewsSectionProps) {
  const toast = useToast();
  const { user, isAuthenticated } = useAuthStore();
  const { reviews, loadReviews, addReview, addHostResponse, toggleHelpful, getPropertyReviews, getAverageRating } = useReviewsStore();

  const [propertyReviews, setPropertyReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewPhotos, setReviewPhotos] = useState<string[]>([]);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [hostResponseText, setHostResponseText] = useState('');

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
      toast.warning('Please log in to leave a review');
      return;
    }

    if (!comment.trim()) {
      toast.warning('Please write a comment');
      return;
    }

    addReview({
      propertyId,
      userId: user.id,
      userName: `${user.firstName} ${user.lastName}`,
      userInitials: `${user.firstName[0]}${user.lastName[0]}`,
      rating,
      comment: comment.trim(),
      photos: reviewPhotos.length > 0 ? reviewPhotos : undefined,
      verifiedBooking: user.studentVerified, // Using studentVerified as proxy for verified booking
    });

    setComment('');
    setRating(5);
    setReviewPhotos([]);
    setShowReviewForm(false);
    toast.success('Review submitted successfully!');
  };

  const handleHostResponse = (reviewId: string) => {
    if (!hostResponseText.trim()) {
      toast.warning('Please write a response');
      return;
    }

    addHostResponse(reviewId, hostResponseText.trim());
    setHostResponseText('');
    setRespondingTo(null);
    toast.success('Response added successfully!');
  };

  const handleToggleHelpful = (reviewId: string) => {
    if (!isAuthenticated || !user) {
      toast.warning('Please log in to vote');
      return;
    }

    toggleHelpful(reviewId, user.id);
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

          {/* Photo Upload */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Add Photos (Optional)
            </label>
            <ImageUpload
              maxFiles={5}
              folder="reviews"
              existingImages={reviewPhotos}
              onUploadComplete={(urls) => setReviewPhotos([...reviewPhotos, ...urls])}
              onRemoveExisting={(url) => setReviewPhotos(reviewPhotos.filter(p => p !== url))}
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
                setReviewPhotos([]);
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
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{review.userName}</h4>
                        {review.verifiedBooking && (
                          <div className="flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full">
                            <BadgeCheck className="w-4 h-4 text-blue-600" />
                            <span className="text-xs font-medium text-blue-600">Verified Booking</span>
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">{formatDate(review.createdAt)}</p>
                    </div>
                    {renderStars(review.rating)}
                  </div>

                  <p className="text-gray-700 leading-relaxed mb-3">{review.comment}</p>

                  {/* Review Photos */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mb-3">
                      {review.photos.map((photo, index) => (
                        <div key={index} className="aspect-square rounded-lg overflow-hidden">
                          <img
                            src={photo}
                            alt={`Review photo ${index + 1}`}
                            className="w-full h-full object-cover hover:scale-110 transition-transform cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Helpful Button */}
                  <div className="flex items-center gap-4 mt-3">
                    <button
                      onClick={() => handleToggleHelpful(review.id)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg transition ${
                        review.helpfulVotes?.includes(user?.id || '')
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Helpful {review.helpfulCount ? `(${review.helpfulCount})` : ''}
                      </span>
                    </button>

                    {/* Host Response Button */}
                    {isHost && !review.hostResponse && (
                      <button
                        onClick={() => setRespondingTo(review.id)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm font-medium">Respond</span>
                      </button>
                    )}
                  </div>

                  {/* Host Response Form */}
                  {respondingTo === review.id && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Response
                      </label>
                      <textarea
                        value={hostResponseText}
                        onChange={(e) => setHostResponseText(e.target.value)}
                        rows={3}
                        placeholder="Write your response to this review..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent mb-2"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleHostResponse(review.id)}
                          className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg transition font-semibold text-sm"
                        >
                          Post Response
                        </button>
                        <button
                          onClick={() => {
                            setRespondingTo(null);
                            setHostResponseText('');
                          }}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Host Response Display */}
                  {review.hostResponse && (
                    <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          H
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-900">Host Response</span>
                            <span className="text-xs text-gray-500">
                              {formatDate(review.hostResponse.createdAt)}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed">
                            {review.hostResponse.comment}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
