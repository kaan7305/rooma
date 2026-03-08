import Stripe from 'stripe';
import config from './env';

// Initialize Stripe only if API key is provided
let stripe: Stripe | null = null;

if (config.stripe.secretKey) {
  stripe = new Stripe(config.stripe.secretKey, {
    apiVersion: '2025-10-29.clover',
    typescript: true,
  });
} else {
  console.warn('⚠️  Stripe API key not configured. Payment features disabled.');
}

export default stripe;
