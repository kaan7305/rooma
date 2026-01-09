import { Router, Request, Response } from 'express';
import supabase from '../config/supabase';
import type { Database } from '../types/database.types';

const router = Router();

/**
 * GET /api/test/supabase
 * Test Supabase connection and basic operations
 */
router.get('/supabase', async (_req: Request, res: Response) => {
  try {
    const results: any = {
      connection: false,
      read: false,
      write: false,
      tables: [],
      errors: [],
      config: {
        url: process.env.SUPABASE_URL || 'not set',
        keyLength: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
        keyPrefix: process.env.SUPABASE_SERVICE_ROLE_KEY?.substring(0, 20) || 'not set',
        keyFormat: process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('eyJ') ? 'JWT (correct)' : 'Non-JWT (may be wrong)',
      },
    };

    // Test 1: Connection - Try to list tables (via a simple query)
    try {
      const { data: _users, error: usersError } = await supabase
        .from('users')
        .select('id')
        .limit(1);

      if (!usersError) {
        results.connection = true;
        results.read = true;
      } else {
        results.errors.push(`Connection test failed: ${usersError.message}`);
        results.errors.push(`Error code: ${usersError.code || 'unknown'}`);
        results.errors.push(`Error hint: ${usersError.hint || 'none'}`);
        if (usersError.details) {
          results.errors.push(`Error details: ${usersError.details}`);
        }
      }
    } catch (error: any) {
      results.errors.push(`Connection error: ${error.message}`);
      if (error.stack) {
        results.errors.push(`Stack: ${error.stack.split('\n')[0]}`);
      }
    }

    // Test 2: Read operation - Get count of users
    try {
      const { count, error: countError } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      if (!countError) {
        results.userCount = count || 0;
      } else {
        results.errors.push(`Read test failed: ${countError.message}`);
      }
    } catch (error: any) {
      results.errors.push(`Read error: ${error.message}`);
    }

    // Test 3: Check available tables (try common ones)
    const commonTables = [
      'users',
      'properties',
      'bookings',
      'reviews',
      'universities',
      'wishlists',
      'conversations',
      'messages',
    ];

    const tableChecks: any[] = [];
    for (const table of commonTables) {
      try {
        const { count, error } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });

        if (!error) {
          tableChecks.push({
            name: table,
            exists: true,
            recordCount: count || 0,
          });
        } else {
          tableChecks.push({
            name: table,
            exists: false,
            error: error.message,
          });
        }
      } catch (error: any) {
        tableChecks.push({
          name: table,
          exists: false,
          error: error.message,
        });
      }
    }

    results.tables = tableChecks;

    // Test 4: Write operation (optional - just test, don't actually write)
    // We'll skip actual write to avoid creating test data
    results.write = 'skipped'; // Can be tested separately

    const status = results.connection && results.read ? 200 : 500;

    res.status(status).json({
      success: results.connection && results.read,
      message: results.connection
        ? 'Supabase connection successful!'
        : 'Supabase connection failed',
      results,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: 'Supabase test failed',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

/**
 * GET /api/test/supabase/query
 * Test a specific Supabase query
 * Query params: table, limit
 */
router.get('/supabase/query', async (req: Request, res: Response) => {
  try {
    const { table = 'users', limit = '5' } = req.query;

    if (!table || typeof table !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Table name is required',
      });
    }

    const limitNum = parseInt(limit as string, 10) || 5;

    const { data, error, count } = await supabase
      .from(table as keyof Database['public']['Tables'])
      .select('*', { count: 'exact' })
      .limit(limitNum);

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Query failed',
        error: error.message,
        table,
      });
    }

    return res.json({
      success: true,
      message: `Successfully queried ${table}`,
      table,
      recordCount: data?.length || 0,
      totalCount: count || 0,
      limit: limitNum,
      data: data || [],
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Query test failed',
      error: error.message,
    });
  }
});

/**
 * POST /api/test/supabase/write
 * Test write operation (creates a test record, then deletes it)
 * Body: { table, testData }
 */
router.post('/supabase/write', async (req: Request, res: Response) => {
  try {
    const { table = 'users', testData } = req.body;

    if (!table || typeof table !== 'string') {
      return res.status(400).json({
        success: false,
        message: 'Table name is required',
      });
    }

    // For safety, only allow write tests on certain tables
    const allowedTables = ['users']; // Add more if needed
    if (!allowedTables.includes(table)) {
      return res.status(403).json({
        success: false,
        message: `Write test not allowed for table: ${table}`,
        allowedTables,
      });
    }

    // Insert test data
    const { data: inserted, error: insertError } = await supabase
      .from(table as keyof Database['public']['Tables'])
      .insert((testData || { email: `test_${Date.now()}@test.com` }) as any)
      .select()
      .single() as { data: any; error: any };

    if (insertError) {
      return res.status(400).json({
        success: false,
        message: 'Insert failed',
        error: insertError.message,
      });
    }

    // Delete test data
    if (inserted && typeof inserted === 'object' && inserted !== null && 'id' in inserted && inserted.id) {
      await supabase.from(table).delete().eq('id', inserted.id as string);
    }

    return res.json({
      success: true,
      message: 'Write test successful (test record created and deleted)',
      table,
      insertedId: inserted && typeof inserted === 'object' && inserted !== null && 'id' in inserted ? inserted.id : null,
      note: 'Test record was automatically deleted',
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: 'Write test failed',
      error: error.message,
    });
  }
});

export default router;

