/**
 * Supabase Connection Tests
 * Tests for Supabase database operations
 */

import supabase from '../config/supabase';

describe('Supabase Connection', () => {
  it('should connect to Supabase', async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it('should read from users table', async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, email')
      .limit(5);

    expect(error).toBeNull();
    expect(Array.isArray(data)).toBe(true);
  });

  it('should handle invalid table gracefully', async () => {
    const { data, error } = await supabase
      .from('non_existent_table')
      .select('*')
      .limit(1);

    expect(error).toBeDefined();
    expect(data).toBeNull();
  });
});

describe('Supabase CRUD Operations', () => {
  let testUserId: string | null = null;

  afterAll(async () => {
    // Cleanup: Delete test user if created
    if (testUserId) {
      await supabase.from('users').delete().eq('id', testUserId);
    }
  });

  it('should create a test user', async () => {
    const testEmail = `test_${Date.now()}@test.com`;
    const { data, error } = await supabase
      .from('users')
      .insert({
        email: testEmail,
        password_hash: 'test_hash',
        first_name: 'Test',
        last_name: 'User',
        user_type: 'guest',
      } as any)
      .select('id, email')
      .single() as { data: { id: string; email: string } | null; error: any };

    expect(error).toBeNull();
    expect(data).toBeDefined();
    if (data) {
      expect(data.email).toBe(testEmail);
      testUserId = data.id;
    }
  });

  it('should read user by id', async () => {
    if (!testUserId) {
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .select('id, email, first_name')
      .eq('id', testUserId)
      .single() as { data: { id: string; email: string; first_name: string } | null; error: any };

    expect(error).toBeNull();
    expect(data).toBeDefined();
    if (data) {
      expect(data.id).toBe(testUserId);
    }
  });

  it('should update user', async () => {
    if (!testUserId) {
      return;
    }

    const { data, error } = await supabase
      .from('users')
      // @ts-expect-error - Supabase type inference issue with update()
      .update({ first_name: 'Updated' } as any)
      .eq('id', testUserId)
      .select('first_name')
      .single() as { data: { first_name: string } | null; error: any };

    expect(error).toBeNull();
    if (data) {
      expect(data.first_name).toBe('Updated');
    }
  });
});

