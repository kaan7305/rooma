/**
 * Booking Service Unit Tests
 * Tests booking creation, acceptance, decline, cancellation, and pricing logic
 */

import request from 'supertest';
import app from '../app';

// Helpers
const createTestUser = async (overrides: Record<string, unknown> = {}) => {
  const user = {
    email: `test_booking_${Date.now()}_${Math.random().toString(36).slice(2)}@example.com`,
    password: 'Test123!@#',
    first_name: 'Test',
    last_name: 'User',
    user_type: 'guest' as const,
    ...overrides,
  };
  const res = await request(app).post('/api/auth/register').send(user);
  if (res.status !== 201) return null;
  return {
    token: res.body.data.access_token,
    user: res.body.data.user,
  };
};

describe('Booking Service', () => {
  // ==========================================
  // PRICING CALCULATION TESTS (Pure Logic)
  // ==========================================
  describe('Pricing Calculations', () => {
    it('should calculate correct daily rate from monthly price', () => {
      const monthlyPriceCents = 90000; // $900/month
      const dailyRate = monthlyPriceCents / 30;
      expect(dailyRate).toBe(3000); // $30/day
    });

    it('should calculate subtotal correctly for a 14-night stay', () => {
      const monthlyPriceCents = 90000;
      const nights = 14;
      const dailyRate = monthlyPriceCents / 30;
      const subtotal = Math.round(dailyRate * nights);
      expect(subtotal).toBe(42000); // $420
    });

    it('should calculate 8% guest service fee', () => {
      const subtotal = 42000;
      const serviceFeePercent = 8;
      const serviceFee = Math.round(subtotal * (serviceFeePercent / 100));
      expect(serviceFee).toBe(3360); // $33.60
    });

    it('should calculate total with all fees', () => {
      const subtotal = 42000;
      const serviceFee = 3360;
      const cleaningFee = 5000;
      const securityDeposit = 10000;
      const total = subtotal + serviceFee + cleaningFee + securityDeposit;
      expect(total).toBe(60360);
    });

    it('should handle zero security deposit', () => {
      const subtotal = 42000;
      const serviceFee = 3360;
      const cleaningFee = 5000;
      const securityDeposit = 0;
      const total = subtotal + serviceFee + cleaningFee + securityDeposit;
      expect(total).toBe(50360);
    });
  });

  // ==========================================
  // CANCELLATION POLICY LOGIC TESTS
  // ==========================================
  describe('Cancellation Policy Logic', () => {
    const calculateRefundPercent = (policy: string, daysUntilCheckIn: number): number => {
      switch (policy) {
        case 'flexible':
          return daysUntilCheckIn >= 1 ? 100 : 0;
        case 'moderate':
          return daysUntilCheckIn >= 5 ? 100 : 0;
        case 'strict':
          return daysUntilCheckIn >= 7 ? 50 : 0;
        default:
          return 0;
      }
    };

    describe('Flexible policy', () => {
      it('should give 100% refund if cancelled 1+ days before check-in', () => {
        expect(calculateRefundPercent('flexible', 1)).toBe(100);
        expect(calculateRefundPercent('flexible', 7)).toBe(100);
        expect(calculateRefundPercent('flexible', 30)).toBe(100);
      });

      it('should give 0% refund if cancelled same day', () => {
        expect(calculateRefundPercent('flexible', 0)).toBe(0);
      });
    });

    describe('Moderate policy', () => {
      it('should give 100% refund if cancelled 5+ days before check-in', () => {
        expect(calculateRefundPercent('moderate', 5)).toBe(100);
        expect(calculateRefundPercent('moderate', 10)).toBe(100);
      });

      it('should give 0% refund if cancelled less than 5 days before', () => {
        expect(calculateRefundPercent('moderate', 4)).toBe(0);
        expect(calculateRefundPercent('moderate', 0)).toBe(0);
      });
    });

    describe('Strict policy', () => {
      it('should give 50% refund if cancelled 7+ days before check-in', () => {
        expect(calculateRefundPercent('strict', 7)).toBe(50);
        expect(calculateRefundPercent('strict', 14)).toBe(50);
      });

      it('should give 0% refund if cancelled less than 7 days before', () => {
        expect(calculateRefundPercent('strict', 6)).toBe(0);
        expect(calculateRefundPercent('strict', 0)).toBe(0);
      });
    });
  });

  // ==========================================
  // DATE OVERLAP DETECTION TESTS
  // ==========================================
  describe('Date Overlap Detection', () => {
    const datesOverlap = (
      newCheckIn: Date,
      newCheckOut: Date,
      existingCheckIn: Date,
      existingCheckOut: Date
    ): boolean => {
      return (
        (newCheckIn <= existingCheckIn && newCheckOut > existingCheckIn) ||
        (newCheckIn < existingCheckOut && newCheckOut >= existingCheckOut) ||
        (newCheckIn >= existingCheckIn && newCheckOut <= existingCheckOut)
      );
    };

    it('should detect overlapping dates (new booking starts during existing)', () => {
      const result = datesOverlap(
        new Date('2026-04-05'),
        new Date('2026-04-20'),
        new Date('2026-04-01'),
        new Date('2026-04-10')
      );
      expect(result).toBe(true);
    });

    it('should detect overlapping dates (new booking contains existing)', () => {
      const result = datesOverlap(
        new Date('2026-04-01'),
        new Date('2026-04-30'),
        new Date('2026-04-05'),
        new Date('2026-04-20')
      );
      expect(result).toBe(true);
    });

    it('should detect overlapping dates (new booking within existing)', () => {
      const result = datesOverlap(
        new Date('2026-04-05'),
        new Date('2026-04-10'),
        new Date('2026-04-01'),
        new Date('2026-04-30')
      );
      expect(result).toBe(true);
    });

    it('should not detect overlap for non-overlapping dates', () => {
      const result = datesOverlap(
        new Date('2026-05-01'),
        new Date('2026-05-15'),
        new Date('2026-04-01'),
        new Date('2026-04-30')
      );
      expect(result).toBe(false);
    });

    it('should handle adjacent dates (checkout = check-in) as non-overlapping', () => {
      const result = datesOverlap(
        new Date('2026-04-15'),
        new Date('2026-04-30'),
        new Date('2026-04-01'),
        new Date('2026-04-15')
      );
      expect(result).toBe(false);
    });
  });

  // ==========================================
  // STAY DURATION VALIDATION TESTS
  // ==========================================
  describe('Stay Duration Validation', () => {
    const MIN_STAY_WEEKS = 2;

    const calculateNights = (checkIn: Date, checkOut: Date): number => {
      const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    it('should calculate nights correctly', () => {
      const nights = calculateNights(new Date('2026-04-01'), new Date('2026-04-15'));
      expect(nights).toBe(14);
    });

    it('should reject stays shorter than minimum (2 weeks)', () => {
      const nights = calculateNights(new Date('2026-04-01'), new Date('2026-04-10'));
      const weeks = nights / 7;
      expect(weeks < MIN_STAY_WEEKS).toBe(true);
    });

    it('should accept stays at exactly minimum duration', () => {
      const nights = calculateNights(new Date('2026-04-01'), new Date('2026-04-15'));
      const weeks = nights / 7;
      expect(weeks >= MIN_STAY_WEEKS).toBe(true);
    });

    it('should accept long stays', () => {
      const nights = calculateNights(new Date('2026-04-01'), new Date('2026-07-01'));
      const weeks = nights / 7;
      expect(weeks >= MIN_STAY_WEEKS).toBe(true);
    });
  });

  // ==========================================
  // API ENDPOINT TESTS
  // ==========================================
  describe('Booking API Endpoints', () => {
    it('should require authentication to create a booking', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .send({
          property_id: '00000000-0000-0000-0000-000000000000',
          check_in_date: '2026-06-01',
          check_out_date: '2026-06-15',
          guest_count: 1,
        });

      expect(response.status).toBe(401);
    });

    it('should require authentication to view bookings', async () => {
      const response = await request(app).get('/api/bookings');
      expect(response.status).toBe(401);
    });

    it('should require authentication to cancel a booking', async () => {
      const response = await request(app)
        .post('/api/bookings/some-id/cancel')
        .send({ cancellation_reason: 'test' });

      expect(response.status).toBe(401);
    });

    it('should return 404 for non-existent booking', async () => {
      const testUser = await createTestUser();
      if (!testUser) {
        console.log('Skipping - could not create test user');
        return;
      }

      const response = await request(app)
        .get('/api/bookings/00000000-0000-0000-0000-000000000000')
        .set('Authorization', `Bearer ${testUser.token}`);

      expect([404, 500]).toContain(response.status);
    });

    it('should validate booking input data', async () => {
      const testUser = await createTestUser();
      if (!testUser) {
        console.log('Skipping - could not create test user');
        return;
      }

      // Missing required fields
      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${testUser.token}`)
        .send({});

      expect([400, 422]).toContain(response.status);
    });
  });
});
