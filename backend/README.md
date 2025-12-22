# NestQuarter Backend API

Backend API for NestQuarter - Global student housing platform

## Tech Stack

- **Runtime:** Node.js v18+
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Cache:** Redis
- **Payments:** Stripe

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL 15+ installed and running
- Redis installed and running (optional for development)
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your local configuration
```

3. Set up the database:
```bash
# Create PostgreSQL database
createdb nestquarter_dev

# Run migrations (after Prisma schema is created)
npm run prisma:migrate

# Generate Prisma Client
npm run prisma:generate
```

### Development

Start the development server:
```bash
npm run dev
```

The API will be available at `http://localhost:5000`

Health check: `http://localhost:5000/health`

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio (database GUI)
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
backend/
├── src/
│   ├── config/           # Configuration files
│   ├── controllers/      # Request handlers
│   ├── middleware/       # Express middleware
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── validators/      # Request validation schemas
│   ├── utils/           # Utility functions
│   ├── types/           # TypeScript types
│   ├── prisma/          # Prisma schema & migrations
│   ├── jobs/            # Background jobs
│   ├── websocket/       # WebSocket handlers
│   ├── app.ts           # Express app setup
│   └── server.ts        # Server entry point
├── .env                 # Environment variables (local)
├── .env.example         # Environment variables template
├── tsconfig.json        # TypeScript configuration
├── package.json         # Dependencies & scripts
└── README.md
```

## API Documentation

API endpoints will be documented using Swagger/OpenAPI (coming soon).

Base URL: `/api`

### Health Check
- `GET /health` - Check server status

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/refresh-token` - Refresh access token

(More endpoints will be added as development progresses)

## Database Schema

The database schema is defined in `src/prisma/schema.prisma` following the exact specifications from the NestQuarter platform design proposal.

## Contributing

This is a private project. Please follow the established code style and conventions.

## License

MIT
