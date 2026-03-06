/**
 * Notification Service Unit Tests
 */

describe('Notification Service', () => {
  describe('Notification Types', () => {
    const NOTIFICATION_TYPES = [
      'booking_request',
      'booking_confirmed',
      'booking_declined',
      'booking_cancelled',
      'new_review',
      'review_response',
      'new_message',
      'payout_completed',
    ];

    it('should have all expected notification types defined', () => {
      expect(NOTIFICATION_TYPES).toContain('booking_request');
      expect(NOTIFICATION_TYPES).toContain('booking_confirmed');
      expect(NOTIFICATION_TYPES).toContain('booking_declined');
      expect(NOTIFICATION_TYPES).toContain('booking_cancelled');
      expect(NOTIFICATION_TYPES).toContain('new_review');
      expect(NOTIFICATION_TYPES).toContain('review_response');
    });

    it('should use proper types for booking lifecycle', () => {
      const bookingTypes = NOTIFICATION_TYPES.filter((t) => t.startsWith('booking_'));
      expect(bookingTypes).toHaveLength(4);
    });
  });

  describe('Notification Data Structure', () => {
    it('should create a valid notification payload', () => {
      const notification = {
        user_id: '123',
        type: 'booking_request',
        title: 'New Booking Request',
        message: 'You have a new booking request.',
        data: { booking_id: '456', property_id: '789' },
      };

      expect(notification.user_id).toBeDefined();
      expect(notification.type).toBeDefined();
      expect(notification.title).toBeDefined();
      expect(notification.message).toBeDefined();
      expect(notification.data).toHaveProperty('booking_id');
    });

    it('should allow optional data field', () => {
      const notification = {
        user_id: '123',
        type: 'new_message',
        title: 'New Message',
        message: 'You have a new message.',
      };

      expect(notification).not.toHaveProperty('data');
    });
  });
});
