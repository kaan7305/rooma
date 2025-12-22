# Database Setup Guide

This guide will help you set up PostgreSQL and run the initial database migration for the NestQuarter backend.

## Prerequisites

- PostgreSQL 15+ installed
- Database credentials

## Installation

### macOS (using Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Verify installation
psql --version
```

### Ubuntu/Debian

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### Windows

Download and install PostgreSQL from: https://www.postgresql.org/download/windows/

## Database Creation

### Option 1: Using psql (Command Line)

```bash
# Connect to PostgreSQL
psql postgres

# Create database
CREATE DATABASE nestquarter_dev;

# Create user (optional, if not using default postgres user)
CREATE USER nestquarter_user WITH PASSWORD 'your_secure_password';

# Grant privileges
GRANT ALL PRIVILEGES ON DATABASE nestquarter_dev TO nestquarter_user;

# Exit psql
\q
```

### Option 2: Using createdb

```bash
createdb nestquarter_dev
```

## Configure Environment Variables

Update your `.env` file with your database connection string:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/nestquarter_dev"
```

### Example connection strings:

**Default PostgreSQL user (postgres):**
```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/nestquarter_dev"
```

**Custom user:**
```
DATABASE_URL="postgresql://nestquarter_user:your_password@localhost:5432/nestquarter_dev"
```

**No password (development only):**
```
DATABASE_URL="postgresql://localhost:5432/nestquarter_dev"
```

## Run Migrations

Once PostgreSQL is set up and your `.env` is configured:

```bash
# Generate Prisma Client (if not already done)
npm run prisma:generate

# Create and run the initial migration
npm run prisma:migrate

# When prompted, enter a migration name, e.g., "init"
```

This will:
1. Create all 22 tables defined in the Prisma schema
2. Set up all relationships and constraints
3. Create indexes for performance
4. Apply the migration to your database

## Seed Database (Optional)

To populate the database with initial data (amenities, sample universities):

```bash
npm run prisma:seed
```

This will create:
- 29 common amenities (WiFi, Kitchen, etc.)
- 13 sample universities across major cities

## Verify Setup

### Check tables were created

```bash
psql nestquarter_dev

# List all tables
\dt

# You should see 22 tables:
# - users
# - student_verifications
# - identity_verifications
# - properties
# - property_photos
# - amenities
# - property_amenities
# - universities
# - property_universities
# - bookings
# - booking_calendar
# - reviews
# - review_photos
# - messages
# - conversations
# - wishlists
# - wishlist_items
# - payout_methods
# - payouts
# - guarantee_claims
# - notifications
# - user_settings
```

### Using Prisma Studio (GUI)

```bash
npm run prisma:studio
```

Opens a browser-based GUI at `http://localhost:5555` to view and edit your database.

## Common Issues

### Error: "connection refused"

**Problem:** PostgreSQL is not running

**Solution:**
```bash
# macOS
brew services start postgresql@15

# Linux
sudo systemctl start postgresql

# Check status
brew services list  # macOS
sudo systemctl status postgresql  # Linux
```

### Error: "database does not exist"

**Problem:** Database hasn't been created

**Solution:**
```bash
createdb nestquarter_dev
```

### Error: "password authentication failed"

**Problem:** Incorrect credentials in DATABASE_URL

**Solution:**
1. Check your PostgreSQL username and password
2. Update `.env` with correct credentials
3. If using default setup, username is usually `postgres`

### Error: "peer authentication failed"

**Problem:** PostgreSQL using peer authentication (Unix socket)

**Solution:**
```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/15/main/pg_hba.conf

# Change:
# local   all   all   peer
# To:
# local   all   all   md5

# Restart PostgreSQL
sudo systemctl restart postgresql
```

## Reset Database (Development)

If you need to start fresh:

```bash
# Drop database
dropdb nestquarter_dev

# Recreate
createdb nestquarter_dev

# Run migrations again
npm run prisma:migrate

# Reseed
npm run prisma:seed
```

## Production Considerations

For production deployments:

1. **Use managed PostgreSQL** (AWS RDS, Google Cloud SQL, Supabase, etc.)
2. **Enable SSL** in connection string:
   ```
   DATABASE_URL="postgresql://user:pass@host:5432/db?sslmode=require"
   ```
3. **Connection pooling** (PgBouncer, Prisma Data Proxy)
4. **Regular backups**
5. **Monitoring** (pg_stat_statements, CloudWatch, etc.)

## Next Steps

After successful database setup:

1. ✅ Verify all tables exist
2. ✅ Run seed script for initial data
3. ✅ Test server connection: `npm run dev`
4. ✅ Proceed to Step 3: Authentication implementation

## Resources

- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Database Schema Reference](./prisma/schema.prisma)
