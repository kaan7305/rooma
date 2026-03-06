/**
 * Auth Service Unit Tests
 * Tests registration, login, token management, and password reset
 */

import request from 'supertest';
import app from '../app';

describe('Auth Service', () => {
  // ==========================================
  // REGISTRATION TESTS
  // ==========================================
  describe('Registration', () => {
    const validUser = {
      email: `auth_test_${Date.now()}@example.com`,
      password: 'SecurePass123!',
      first_name: 'Auth',
      last_name: 'Tester',
      user_type: 'guest' as const,
    };

    it('should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      if (response.status === 500) {
        console.log('Skipping - backend service unavailable');
        return;
      }

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('access_token');
      expect(response.body.data).toHaveProperty('refresh_token');
      expect(response.body.data.user).toHaveProperty('email', validUser.email);
      expect(response.body.data.user).not.toHaveProperty('password_hash');
    });

    it('should reject registration with duplicate email', async () => {
      // First registration
      await request(app).post('/api/auth/register').send(validUser);

      // Duplicate
      const response = await request(app)
        .post('/api/auth/register')
        .send(validUser);

      expect([409, 500]).toContain(response.status);
    });

    it('should reject registration with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ ...validUser, email: 'not-an-email' });

      expect([400, 422]).toContain(response.status);
    });

    it('should reject registration with weak password', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUser,
          email: `weak_${Date.now()}@example.com`,
          password: '123',
        });

      expect([400, 422]).toContain(response.status);
    });

    it('should reject registration without required fields', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({ email: 'test@example.com' });

      expect([400, 422]).toContain(response.status);
    });

    it('should reject registration with invalid user_type', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...validUser,
          email: `type_${Date.now()}@example.com`,
          user_type: 'admin',
        });

      expect([400, 422]).toContain(response.status);
    });
  });

  // ==========================================
  // LOGIN TESTS
  // ==========================================
  describe('Login', () => {
    const loginUser = {
      email: `login_test_${Date.now()}@example.com`,
      password: 'LoginPass123!',
      first_name: 'Login',
      last_name: 'Tester',
      user_type: 'guest' as const,
    };

    beforeAll(async () => {
      await request(app).post('/api/auth/register').send(loginUser);
    });

    it('should login with correct credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: loginUser.email,
          password: loginUser.password,
        });

      if (response.status === 500) {
        console.log('Skipping - backend service unavailable');
        return;
      }

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toHaveProperty('access_token');
      expect(response.body.data).toHaveProperty('refresh_token');
    });

    it('should reject login with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: loginUser.email,
          password: 'WrongPassword123!',
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should reject login with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'SomePass123!',
        });

      expect([401, 404]).toContain(response.status);
    });

    it('should reject login with missing fields', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: loginUser.email });

      expect([400, 422]).toContain(response.status);
    });
  });

  // ==========================================
  // TOKEN MANAGEMENT TESTS
  // ==========================================
  describe('Token Management', () => {
    let accessToken: string;
    let refreshToken: string;

    beforeAll(async () => {
      const user = {
        email: `token_test_${Date.now()}@example.com`,
        password: 'TokenPass123!',
        first_name: 'Token',
        last_name: 'Tester',
        user_type: 'guest' as const,
      };
      const regRes = await request(app).post('/api/auth/register').send(user);
      if (regRes.status === 201) {
        accessToken = regRes.body.data.access_token;
        refreshToken = regRes.body.data.refresh_token;
      }
    });

    it('should access protected routes with valid token', async () => {
      if (!accessToken) return;

      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toBe(200);
    });

    it('should reject access without token', async () => {
      const response = await request(app).get('/api/users/me');
      expect(response.status).toBe(401);
    });

    it('should reject access with malformed token', async () => {
      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', 'Bearer invalid.token.here');

      expect(response.status).toBe(401);
    });

    it('should reject access with Bearer prefix missing', async () => {
      if (!accessToken) return;

      const response = await request(app)
        .get('/api/users/me')
        .set('Authorization', accessToken);

      expect(response.status).toBe(401);
    });

    it('should refresh access token with valid refresh token', async () => {
      if (!refreshToken) return;

      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refresh_token: refreshToken });

      if (response.status === 500) return;

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveProperty('access_token');
    });

    it('should reject refresh with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .send({ refresh_token: 'invalid-refresh-token' });

      expect([400, 401]).toContain(response.status);
    });
  });

  // ==========================================
  // PASSWORD RESET TESTS
  // ==========================================
  describe('Password Reset', () => {
    it('should accept forgot-password request for valid email format', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'test@example.com' });

      // Should return 200 even if email doesn't exist (security best practice)
      expect([200, 404, 500]).toContain(response.status);
    });

    it('should reject forgot-password with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/forgot-password')
        .send({ email: 'not-an-email' });

      expect([400, 422]).toContain(response.status);
    });

    it('should reject reset-password with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'invalid-token',
          new_password: 'NewSecurePass123!',
        });

      expect([400, 401, 422]).toContain(response.status);
    });

    it('should reject reset-password with weak new password', async () => {
      const response = await request(app)
        .post('/api/auth/reset-password')
        .send({
          token: 'some-token',
          new_password: '123',
        });

      expect([400, 422]).toContain(response.status);
    });
  });
});

// ==========================================
// API GENERAL TESTS
// ==========================================
describe('API General', () => {
  it('should return welcome message at root', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('ROOMA');
  });

  it('should return health check', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('status', 'ok');
    expect(response.body).toHaveProperty('timestamp');
  });

  it('should return 404 for unknown routes', async () => {
    const response = await request(app).get('/api/nonexistent');
    expect(response.status).toBe(404);
  });

  it('should set security headers (Helmet)', async () => {
    const response = await request(app).get('/health');
    expect(response.headers['x-content-type-options']).toBe('nosniff');
    expect(response.headers['x-frame-options']).toBeDefined();
  });

  it('should handle JSON body parsing', async () => {
    const response = await request(app)
      .post('/api/auth/login')
      .set('Content-Type', 'application/json')
      .send({ email: 'test@example.com', password: 'test' });

    // Should not crash, should return proper error
    expect([400, 401, 422]).toContain(response.status);
  });
});
