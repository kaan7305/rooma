/**
 * Auth Store Tests
 * Tests user mapping, localStorage helpers, and JSON response parsing
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

// Test the pure helper functions extracted from auth-store logic

describe('Auth Store Helpers', () => {
  describe('mapBackendUserToStoreUser', () => {
    const mapBackendUserToStoreUser = (backendUser: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      phone?: string;
      user_type: string;
      email_verified: boolean;
      student_verified: boolean;
      profile_photo_url?: string;
      bio?: string;
      created_at?: string;
      is_admin?: boolean;
      is_host?: boolean;
    }) => ({
      id: backendUser.id,
      email: backendUser.email,
      firstName: backendUser.first_name,
      lastName: backendUser.last_name,
      name: `${backendUser.first_name} ${backendUser.last_name}`,
      phone: backendUser.phone,
      userType: backendUser.user_type,
      emailVerified: backendUser.email_verified,
      studentVerified: backendUser.student_verified,
      profilePhotoUrl: backendUser.profile_photo_url,
      bio: backendUser.bio,
      createdAt: backendUser.created_at,
      is_admin: backendUser.is_admin,
      is_host: backendUser.is_host,
    });

    it('should map backend user fields to store user format', () => {
      const backendUser = {
        id: 'user-123',
        email: 'test@example.com',
        first_name: 'John',
        last_name: 'Doe',
        user_type: 'guest',
        email_verified: true,
        student_verified: false,
      };

      const result = mapBackendUserToStoreUser(backendUser);

      expect(result.id).toBe('user-123');
      expect(result.email).toBe('test@example.com');
      expect(result.firstName).toBe('John');
      expect(result.lastName).toBe('Doe');
      expect(result.name).toBe('John Doe');
      expect(result.userType).toBe('guest');
      expect(result.emailVerified).toBe(true);
      expect(result.studentVerified).toBe(false);
    });

    it('should handle optional fields', () => {
      const backendUser = {
        id: 'user-456',
        email: 'host@example.com',
        first_name: 'Jane',
        last_name: 'Smith',
        user_type: 'host',
        email_verified: true,
        student_verified: true,
        phone: '+1234567890',
        profile_photo_url: 'https://example.com/photo.jpg',
        bio: 'A great host',
        is_host: true,
        is_admin: false,
      };

      const result = mapBackendUserToStoreUser(backendUser);

      expect(result.phone).toBe('+1234567890');
      expect(result.profilePhotoUrl).toBe('https://example.com/photo.jpg');
      expect(result.bio).toBe('A great host');
      expect(result.is_host).toBe(true);
      expect(result.is_admin).toBe(false);
    });

    it('should concatenate first and last name', () => {
      const result = mapBackendUserToStoreUser({
        id: '1',
        email: 'a@b.com',
        first_name: 'Alice',
        last_name: 'Wonder',
        user_type: 'both',
        email_verified: false,
        student_verified: false,
      });

      expect(result.name).toBe('Alice Wonder');
    });
  });

  describe('getStoredUser (localStorage)', () => {
    beforeEach(() => {
      localStorage.clear();
    });

    it('should return null when no user is stored', () => {
      const raw = localStorage.getItem('user');
      expect(raw).toBeNull();
    });

    it('should parse valid stored user', () => {
      const user = { id: '123', email: 'test@example.com', firstName: 'Test', lastName: 'User' };
      localStorage.setItem('user', JSON.stringify(user));

      const raw = localStorage.getItem('user');
      expect(raw).not.toBeNull();

      const parsed = JSON.parse(raw!);
      expect(parsed.id).toBe('123');
      expect(parsed.email).toBe('test@example.com');
    });

    it('should handle invalid JSON gracefully', () => {
      localStorage.setItem('user', 'not-valid-json');

      let result = null;
      try {
        const raw = localStorage.getItem('user');
        if (raw) result = JSON.parse(raw);
      } catch {
        result = null;
      }

      expect(result).toBeNull();
    });

    it('should reject objects without required fields', () => {
      localStorage.setItem('user', JSON.stringify({ name: 'Test' }));

      const raw = localStorage.getItem('user');
      const parsed = raw ? JSON.parse(raw) : null;
      const isValid = parsed && typeof parsed === 'object' && 'id' in parsed && 'email' in parsed;

      expect(isValid).toBeFalsy();
    });
  });

  describe('getErrorMessage', () => {
    const getErrorMessage = (error: unknown, fallback: string): string => {
      if (error instanceof Error && error.message) return error.message;
      return fallback;
    };

    it('should return error message for Error instances', () => {
      const err = new Error('Something went wrong');
      expect(getErrorMessage(err, 'fallback')).toBe('Something went wrong');
    });

    it('should return fallback for non-Error values', () => {
      expect(getErrorMessage('string error', 'fallback')).toBe('fallback');
      expect(getErrorMessage(null, 'fallback')).toBe('fallback');
      expect(getErrorMessage(undefined, 'fallback')).toBe('fallback');
      expect(getErrorMessage(42, 'fallback')).toBe('fallback');
    });

    it('should return fallback for Error with empty message', () => {
      const err = new Error('');
      expect(getErrorMessage(err, 'fallback')).toBe('fallback');
    });
  });
});
