import Stripe from 'stripe';
import config from './env';

// Initialize Stripe with API key
const stripe = new Stripe(config.stripe.secretKey, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

export default stripe;
