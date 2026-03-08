'use client';

import { useState } from 'react';
import { CreditCard, Plus, Trash2, DollarSign, Building, CheckCircle } from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'bank';
  last4: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  bankName?: string;
  isDefault: boolean;
}

interface PayoutMethod {
  id: string;
  type: 'bank' | 'paypal';
  last4?: string;
  email?: string;
  bankName?: string;
  accountName: string;
  isDefault: boolean;
}

export default function PaymentsPage() {
  const [activeSection, setActiveSection] = useState<'payment' | 'payout'>('payment');
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showAddPayoutModal, setShowAddPayoutModal] = useState(false);

  // Mock payment methods
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([
    {
      id: '1',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
    },
    {
      id: '2',
      type: 'card',
      last4: '5555',
      brand: 'Mastercard',
      expiryMonth: 6,
      expiryYear: 2026,
      isDefault: false,
    },
  ]);

  // Mock payout methods
  const [payoutMethods, setPayoutMethods] = useState<PayoutMethod[]>([
    {
      id: '1',
      type: 'bank',
      last4: '6789',
      bankName: 'Chase Bank',
      accountName: 'John Doe',
      isDefault: true,
    },
  ]);

  const handleSetDefaultPayment = (id: string) => {
    setPaymentMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleSetDefaultPayout = (id: string) => {
    setPayoutMethods(methods =>
      methods.map(method => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
  };

  const handleDeletePayment = (id: string) => {
    setPaymentMethods(methods => methods.filter(method => method.id !== id));
  };

  const handleDeletePayout = (id: string) => {
    setPayoutMethods(methods => methods.filter(method => method.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments & Payouts</h1>
          <p className="text-gray-600">Manage your payment methods and payout accounts</p>
        </div>

        {/* Section Toggle */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveSection('payment')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                activeSection === 'payment'
                  ? 'text-rose-600 border-b-2 border-rose-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <CreditCard className="w-5 h-5 inline mr-2" />
              Payment Methods
            </button>
            <button
              onClick={() => setActiveSection('payout')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition ${
                activeSection === 'payout'
                  ? 'text-rose-600 border-b-2 border-rose-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <DollarSign className="w-5 h-5 inline mr-2" />
              Payout Methods
            </button>
          </div>
        </div>

        {/* Payment Methods Section */}
        {activeSection === 'payment' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Your Payment Methods</h2>
              <button
                onClick={() => setShowAddPaymentModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition"
              >
                <Plus className="w-4 h-4" />
                Add Payment Method
              </button>
            </div>

            <div className="space-y-4">
              {paymentMethods.map(method => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-rose-300 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-rose-100 to-pink-100 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {method.brand} •••• {method.last4}
                        </p>
                        {method.isDefault && (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-medium rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        Expires {method.expiryMonth}/{method.expiryYear}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefaultPayment(method.id)}
                        className="px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        Set as default
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePayment(method.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {paymentMethods.length === 0 && (
              <div className="text-center py-12">
                <CreditCard className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No payment methods added yet</p>
              </div>
            )}
          </div>
        )}

        {/* Payout Methods Section */}
        {activeSection === 'payout' && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">Your Payout Methods</h2>
                <p className="text-sm text-gray-500 mt-1">
                  Add a payout method to receive payments for your listings
                </p>
              </div>
              <button
                onClick={() => setShowAddPayoutModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg hover:from-rose-600 hover:to-pink-700 transition"
              >
                <Plus className="w-4 h-4" />
                Add Payout Method
              </button>
            </div>

            <div className="space-y-4">
              {payoutMethods.map(method => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-rose-300 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-rose-100 to-pink-100 flex items-center justify-center">
                      <Building className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-900">
                          {method.bankName || method.email}
                        </p>
                        {method.isDefault && (
                          <span className="px-2 py-0.5 bg-rose-100 text-rose-700 text-xs font-medium rounded">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500">
                        {method.accountName} {method.last4 && `•••• ${method.last4}`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <button
                        onClick={() => handleSetDefaultPayout(method.id)}
                        className="px-3 py-1.5 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      >
                        Set as default
                      </button>
                    )}
                    <button
                      onClick={() => handleDeletePayout(method.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {payoutMethods.length === 0 && (
              <div className="text-center py-12">
                <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No payout methods added yet</p>
              </div>
            )}
          </div>
        )}

        {/* Transaction History */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Payment received</p>
                  <p className="text-sm text-gray-500">Booking #12345</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">+$450.00</p>
                <p className="text-sm text-gray-500">Dec 20, 2025</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Payout processed</p>
                  <p className="text-sm text-gray-500">To Chase Bank •••• 6789</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-gray-900">$850.00</p>
                <p className="text-sm text-gray-500">Dec 18, 2025</p>
              </div>
            </div>
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Payment received</p>
                  <p className="text-sm text-gray-500">Booking #12344</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-green-600">+$520.00</p>
                <p className="text-sm text-gray-500">Dec 15, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
