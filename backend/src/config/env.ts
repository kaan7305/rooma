import dotenv from 'dotenv';

dotenv.config();

interface Config {
  nodeEnv: string;
  port: number;
  corsOrigin: string;
  databaseUrl: string;
  redis: {
    host: string;
    port: number;
    password: string;
  };
  jwt: {
    secret: string;
    refreshSecret: string;
  };
  stripe: {
    secretKey: string;
    publishableKey: string;
    webhookSecret: string;
    connectClientId: string;
  };
  aws: {
    accessKeyId: string;
    secretAccessKey: string;
    region: string;
    s3Bucket: string;
  };
  sendgrid: {
    apiKey: string;
    fromEmail: string;
    fromName: string;
  };
  twilio: {
    accountSid: string;
    authToken: string;
    phoneNumber: string;
  };
  frontendUrl: string;
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  maxFileSizeMb: number;
  features: {
    websocket: boolean;
    backgroundJobs: boolean;
  };
  logLevel: string;
  supabase: {
    url: string;
    serviceRoleKey: string;
  };
}

const config: Config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000', 10),
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  databaseUrl: process.env.DATABASE_URL || '',
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
    password: process.env.REDIS_PASSWORD || '',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'dev-secret',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret',
  },
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY || '',
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '',
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
    connectClientId: process.env.STRIPE_CONNECT_CLIENT_ID || '',
  },
  aws: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    region: process.env.AWS_REGION || 'us-east-1',
    s3Bucket: process.env.AWS_S3_BUCKET || '',
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY || '',
    fromEmail: process.env.FROM_EMAIL || 'noreply@nestquarter.com',
    fromName: process.env.FROM_NAME || 'NestQuarter',
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || '',
    authToken: process.env.TWILIO_AUTH_TOKEN || '',
    phoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  },
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000', 10),
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10),
  },
  maxFileSizeMb: parseInt(process.env.MAX_FILE_SIZE_MB || '10', 10),
  features: {
    websocket: process.env.ENABLE_WEBSOCKET === 'true',
    backgroundJobs: process.env.ENABLE_BACKGROUND_JOBS === 'true',
  },
  logLevel: process.env.LOG_LEVEL || 'info',
  supabase: {
    url: process.env.SUPABASE_URL || 'https://hfygradcovgih.supabase.co',
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_NwetXHqIUvb-qDw5BlxNMA_yDX0feyR',
  },
};

export default config;
