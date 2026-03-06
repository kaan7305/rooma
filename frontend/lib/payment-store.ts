import { create } from 'zustand';
import apiClient from '@/lib/api-client';

export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank' | 'paypal';
  last4?: string;
  brand?: string; // Visa, Mastercard, etc.
  expiryMonth?: number;
  expiryYear?: number;
  bankName?: string;
  email?: string; // for PayPal
  isDefault: boolean;
  nickname?: string;
}

export interface Transaction {
  id: string;
  bookingId: string;
  propertyTitle: string;
  propertyImage: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded' | 'partially_refunded';
  paymentMethod: PaymentMethod;
  date: string;
  description: string;
  refundAmount?: number;
  refundDate?: string;
  splitWith?: string[]; // User IDs if split payment
}

export interface SplitPayment {
  id: string;
  bookingId: string;
  totalAmount: number;
  splits: {
    userId: string;
    userName: string;
    userEmail: string;
    amount: number;
    status: 'pending' | 'paid' | 'failed';
    paidAt?: string;
  }[];
  createdAt: string;
}

interface PaymentState {
  paymentMethods: PaymentMethod[];
  transactions: Transaction[];
  splitPayments: SplitPayment[];
  loadPaymentData: () => Promise<void>;
  addPaymentMethod: (method: Omit<PaymentMethod, 'id'>) => void;
  updatePaymentMethod: (id: string, updates: Partial<PaymentMethod>) => void;
  deletePaymentMethod: (id: string) => void;
  setDefaultPaymentMethod: (id: string) => void;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void;
  requestRefund: (transactionId: string, amount: number) => void;
  createSplitPayment: (split: Omit<SplitPayment, 'id'>) => void;
  updateSplitPaymentStatus: (splitId: string, userId: string, status: 'paid' | 'failed') => void;
}

export const usePaymentStore = create<PaymentState>((set, get) => ({
  paymentMethods: [],
  transactions: [],
  splitPayments: [],

  loadPaymentData: async () => {
    try {
      const [methodsRes, transactionsRes] = await Promise.all([
        apiClient.get('/payments/methods').catch(() => null),
        apiClient.get('/payments/transactions').catch(() => null),
      ]);

      const apiMethods: PaymentMethod[] = (methodsRes?.data?.data || []).map((m: any) => ({
        id: m.id,
        type: m.type || 'card',
        last4: m.last4,
        brand: m.brand,
        expiryMonth: m.exp_month,
        expiryYear: m.exp_year,
        bankName: m.bank_name,
        email: m.email,
        isDefault: m.is_default || false,
        nickname: m.nickname,
      }));

      const apiTransactions: Transaction[] = (transactionsRes?.data?.data || []).map((t: any) => ({
        id: t.id,
        bookingId: t.booking_id,
        propertyTitle: t.booking?.property?.title || '',
        propertyImage: t.booking?.property?.photos?.[0]?.photo_url || '',
        amount: (t.amount_cents || 0) / 100,
        currency: t.currency || 'USD',
        status: t.status || 'pending',
        paymentMethod: apiMethods.find((m: PaymentMethod) => m.id === t.payment_method_id) || { id: '', type: 'card' as const, isDefault: false },
        date: t.created_at,
        description: t.description || '',
        refundAmount: t.refund_amount_cents ? t.refund_amount_cents / 100 : undefined,
        refundDate: t.refund_date,
      }));

      set({
        paymentMethods: apiMethods.length > 0 ? apiMethods : get().paymentMethods,
        transactions: apiTransactions.length > 0 ? apiTransactions : get().transactions,
      });
    } catch (error) {
      console.error('Failed to load payment data:', error);
    }
  },

  addPaymentMethod: (method) => {
    const newMethod: PaymentMethod = {
      ...method,
      id: `pm-${Date.now()}`,
    };
    set((state) => ({
      paymentMethods: [...state.paymentMethods, newMethod],
    }));
  },

  updatePaymentMethod: (id, updates) => {
    set((state) => ({
      paymentMethods: state.paymentMethods.map(pm =>
        pm.id === id ? { ...pm, ...updates } : pm
      ),
    }));
  },

  deletePaymentMethod: (id) => {
    set((state) => ({
      paymentMethods: state.paymentMethods.filter(pm => pm.id !== id),
    }));
  },

  setDefaultPaymentMethod: (id) => {
    set((state) => ({
      paymentMethods: state.paymentMethods.map(pm => ({
        ...pm,
        isDefault: pm.id === id,
      })),
    }));
  },

  addTransaction: (transaction) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: `tx-${Date.now()}`,
    };
    set((state) => ({
      transactions: [newTransaction, ...state.transactions],
    }));
  },

  requestRefund: (transactionId, amount) => {
    set((state) => ({
      transactions: state.transactions.map(tx =>
        tx.id === transactionId
          ? {
              ...tx,
              status: amount === tx.amount ? 'refunded' : 'partially_refunded',
              refundAmount: amount,
              refundDate: new Date().toISOString(),
            }
          : tx
      ),
    }));
  },

  createSplitPayment: (split) => {
    const newSplit: SplitPayment = {
      ...split,
      id: `split-${Date.now()}`,
    };
    set((state) => ({
      splitPayments: [...state.splitPayments, newSplit],
    }));
  },

  updateSplitPaymentStatus: (splitId, userId, status) => {
    set((state) => ({
      splitPayments: state.splitPayments.map(sp =>
        sp.id === splitId
          ? {
              ...sp,
              splits: sp.splits.map(s =>
                s.userId === userId
                  ? { ...s, status, paidAt: status === 'paid' ? new Date().toISOString() : undefined }
                  : s
              ),
            }
          : sp
      ),
    }));
  },
}));
