# Supabase Migration Guide

## Status

### ✅ Completed
1. **Supabase Client Setup**
   - Installed `@supabase/supabase-js` package
   - Created `src/config/supabase.ts` with Supabase client configuration
   - Updated `src/config/env.ts` to include Supabase credentials

2. **Core Services Migrated**
   - ✅ `auth.service.ts` - All Prisma queries converted to Supabase
   - ✅ `user.service.ts` - All Prisma queries converted to Supabase
   - ✅ `auth.ts` middleware - Prisma queries converted to Supabase
   - ✅ `upload.controller.ts` - All Prisma queries converted to Supabase

3. **Import Statements Updated**
   - All service files now import from `../config/supabase` instead of `../config/database`

### ⚠️ In Progress
The following services still have Prisma queries that need to be converted:
- `booking.service.ts` (~13 queries)
- `payment.service.ts` (~11 queries)
- `payout.service.ts` (~7 queries)
- `property.service.ts` (~22 queries)
- `review.service.ts` (~16 queries)
- `message.service.ts` (~19 queries)
- `university.service.ts` (~4 queries)
- `wishlist.service.ts` (~17 queries)

## Supabase Configuration

The Supabase client is configured with:
- **URL**: `https://hfygradcovgih.supabase.co`
- **Service Role Key**: Set via `SUPABASE_SERVICE_ROLE_KEY` environment variable

Make sure to set these in your `.env` file:
```env
SUPABASE_URL=https://hfygradcovgih.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sb_secret_NwetXHqIUvb-qDw5BlxNMA_yDX0feyR
```

## Conversion Patterns

### Basic Queries

#### Find Unique
**Prisma:**
```typescript
const user = await prisma.user.findUnique({
  where: { id: userId },
  select: { id: true, email: true }
});
```

**Supabase:**
```typescript
const { data: user, error } = await supabase
  .from('users')
  .select('id, email')
  .eq('id', userId)
  .single();
```

#### Find Many
**Prisma:**
```typescript
const users = await prisma.user.findMany({
  where: { user_type: 'host' },
  orderBy: { created_at: 'desc' },
  take: 10
});
```

**Supabase:**
```typescript
const { data: users, error } = await supabase
  .from('users')
  .select('*')
  .eq('user_type', 'host')
  .order('created_at', { ascending: false })
  .limit(10);
```

#### Create
**Prisma:**
```typescript
const user = await prisma.user.create({
  data: { email, password_hash, first_name, last_name },
  select: { id: true, email: true }
});
```

**Supabase:**
```typescript
const { data: user, error } = await supabase
  .from('users')
  .insert({ email, password_hash, first_name, last_name })
  .select('id, email')
  .single();
```

#### Update
**Prisma:**
```typescript
const user = await prisma.user.update({
  where: { id: userId },
  data: { email_verified: true },
  select: { id: true, email: true }
});
```

**Supabase:**
```typescript
const { data: user, error } = await supabase
  .from('users')
  .update({ email_verified: true })
  .eq('id', userId)
  .select('id, email')
  .single();
```

#### Delete
**Prisma:**
```typescript
await prisma.user.delete({
  where: { id: userId }
});
```

**Supabase:**
```typescript
await supabase
  .from('users')
  .delete()
  .eq('id', userId);
```

### Relations

Supabase doesn't support nested includes like Prisma. You need to make separate queries:

**Prisma:**
```typescript
const property = await prisma.property.findUnique({
  where: { id },
  include: {
    host: { select: { id: true, first_name: true } },
    photos: { take: 3 }
  }
});
```

**Supabase:**
```typescript
// Get property
const { data: property, error } = await supabase
  .from('properties')
  .select('*')
  .eq('id', id)
  .single();

// Get host
const { data: host } = await supabase
  .from('users')
  .select('id, first_name')
  .eq('id', property.host_id)
  .single();

// Get photos
const { data: photos } = await supabase
  .from('property_photos')
  .select('*')
  .eq('property_id', id)
  .order('display_order', { ascending: true })
  .limit(3);

// Combine results
const propertyWithRelations = {
  ...property,
  host,
  photos
};
```

### Error Handling

Always check for errors and handle them appropriately:

```typescript
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('id', userId)
  .single();

if (error || !data) {
  throw new NotFoundError('User not found');
}
```

### Common Supabase Query Methods

- `.eq(column, value)` - equals
- `.neq(column, value)` - not equals
- `.gt(column, value)` - greater than
- `.gte(column, value)` - greater than or equal
- `.lt(column, value)` - less than
- `.lte(column, value)` - less than or equal
- `.in(column, array)` - in array
- `.is(column, null)` - is null
- `.like(column, pattern)` - like (case sensitive)
- `.ilike(column, pattern)` - like (case insensitive)
- `.order(column, { ascending: true/false })` - order by
- `.limit(count)` - limit results
- `.range(from, to)` - pagination
- `.select(columns)` - select specific columns
- `.single()` - expect single result
- `.maybeSingle()` - maybe single result (returns null if not found)

## Next Steps

1. **Convert Remaining Services**
   - Work through each service file systematically
   - Convert Prisma queries to Supabase following the patterns above
   - Test each conversion thoroughly

2. **Handle Complex Relations**
   - For queries with multiple nested relations, break them into separate Supabase queries
   - Combine results in JavaScript/TypeScript

3. **Update Tests**
   - Update any tests that mock Prisma to mock Supabase instead
   - Test all converted endpoints

4. **Remove Prisma Dependencies** (Optional)
   - Once all queries are converted, you can remove Prisma from `package.json`
   - Remove `prisma/` directory and generated files
   - Update build scripts to remove Prisma commands

## Notes

- Supabase uses snake_case for table and column names by default
- UUIDs are handled as strings in Supabase
- Dates should be converted to ISO strings when inserting/updating
- Supabase returns `{ data, error }` objects, not direct results
- Use `.single()` when expecting one result, `.maybeSingle()` when result might not exist

