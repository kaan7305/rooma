import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import routes from './routes';

// Import middleware
import { errorHandler, notFoundHandler } from './middleware/errorHandler';

const app: Application = express();

// Security middleware
app.use(helmet());

const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const corsOptions = {
  origin: (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) => {
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }

    // Allow non-browser clients (no Origin header)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

// CORS configuration
app.use(cors(corsOptions));

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Welcome endpoint
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    message: 'Welcome to NestQuarter API',
    version: '1.0.0',
    documentation: 'See API-TESTING-GUIDE.md for endpoint details',
    endpoints: {
      health: '/health',
      api: '/api',
    },
    availableRoutes: [
      'POST /api/auth/register',
      'POST /api/auth/login',
      'POST /api/auth/refresh',
      'GET /api/users/me',
      'GET /api/properties',
      'GET /api/universities',
      'GET /api/bookings',
      'GET /api/wishlists',
      'GET /api/conversations',
      'GET /api/reviews',
    ],
  });
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Global error handler
app.use(errorHandler);

export default app;
