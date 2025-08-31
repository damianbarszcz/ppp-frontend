
import { loadStripe, Stripe } from '@stripe/stripe-js';

export const STRIPE_CONFIG = {
    publishableKey: 'pk_test_51RooZiPbZF3zRCERE0iaAyAcnh27AOQuYv2mgNGUhgTsFpIWCsO15zj5FiaSTtL9gIeWMSSOr4TgpZachLFmamqD00mCK4ZNtJ',
} as const;

let stripePromise: Promise<Stripe | null>;

export const getStripe = (): Promise<Stripe | null> => {
    if (!stripePromise) {
        stripePromise = loadStripe(STRIPE_CONFIG.publishableKey);
    }
    return stripePromise;
};
