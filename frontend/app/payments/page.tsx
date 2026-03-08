'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  CreditCard,
  Building2,
  Plus,
  Trash2,
  Star,
  Check,
  Download,
  RefreshCw,
  DollarSign,
  Calendar,
  Filter,
  Search
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { usePaymentStore, type PaymentMethod, type Transaction } from '@/lib/payment-store';
import { useToast } from '@/lib/toast-context';

export default function PaymentsPage() {
  const router = useRouter();
  const toast = useToast();
  const { isAuthenticated, loadUser } = useAuthStore();
  const {
    paymentMethods,
    transactions,
    loadPaymentData,
    deletePaymentMethod,
    setDefaultPaymentMethod,
    requestRefund,
  } = usePaymentStore();

  const [activeTab, setActiveTab] = useState<'methods' | 'transactions'>('methods');
  const [filterStatus, setFilterStatus] = useState<'all' | Transaction['status']>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  useEffect(() => {
    if (!isAuthenticated) {
      toast.warning('Please log in to access payments');
      router.push('/auth/login');
    } else {
      loadPaymentData();
    }
  }, [isAuthenticated, router, toast, loadPaymentData]);

  const handleDeletePaymentMethod = (id: string) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      deletePaymentMethod(id);
      toast.success('Payment method removed');
    }
  };

  const handleSetDefault = (id: string) => {
    setDefaultPaymentMethod(id);
    toast.success('Default payment method updated');
  };

  const handleRequestRefund = (transactionId: string, amount: number) => {
    if (confirm(`Request refund of $${amount.toFixed(2)}?`)) {
      requestRefund(transactionId, amount);
      toast.success('Refund request submitted');
    }
  };

  const filteredTransactions = transactions
    .filter(tx => filterStatus === 'all' || tx.status === filterStatus)
    .filter(tx =>
      tx.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'failed':
        return 'bg-red-100 text-red-700';
      case 'refunded':
      case 'partially_refunded':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const renderPaymentMethodIcon = (method: PaymentMethod) => {
    if (method.type === 'bank') {
      return <Building2 className="w-10 h-10 text-blue-600" />;
    }
    return <CreditCard className="w-10 h-10 text-purple-600" />;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments & Billing</h1>
          <p className="text-gray-600">Manage your payment methods and transaction history</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('methods')}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'methods'
                    ? 'text-rose-600 border-b-2 border-rose-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                Payment Methods
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-colors ${
                  activeTab === 'transactions'
                    ? 'text-rose-600 border-b-2 border-rose-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <DollarSign className="w-5 h-5" />
                Transaction History
              </button>
            </div>
          </div>

          <div className="p-8">
            {/* Payment Methods Tab */}
            {activeTab === 'methods' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Saved Payment Methods</h3>
                  <button className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white rounded-lg font-medium transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                    <Plus className="w-4 h-4" />
                    Add Payment Method
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200 hover:border-rose-500 hover:shadow-lg transition-all relative"
                    >
                      {method.isDefault && (
                        <div className="absolute top-4 right-4 px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <Star className="w-3 h-3 fill-white" />
                          Default
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        {renderPaymentMethodIcon(method)}
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-lg mb-1">
                            {method.brand || method.bankName}
                          </h4>
                          <p className="text-gray-600 mb-1">****  {method.last4}</p>
                          {method.nickname && (
                            <p className="text-sm text-gray-500 mb-2">{method.nickname}</p>
                          )}
                          {method.expiryMonth && method.expiryYear && (
                            <p className="text-sm text-gray-600">
                              Expires {method.expiryMonth.toString().padStart(2, '0')}/{method.expiryYear}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        {!method.isDefault && (
                          <button
                            onClick={() => handleSetDefault(method.id)}
                            className="flex-1 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-1"
                          >
                            <Check className="w-4 h-4" />
                            Set as Default
                          </button>
                        )}
                        <button
                          onClick={() => handleDeletePaymentMethod(method.id)}
                          className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                        >
                          <Trash2 className="w-4 h-4" />
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {paymentMethods.length === 0 && (
                  <div className="text-center py-12">
                    <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No payment methods</h3>
                    <p className="text-gray-600 mb-6">Add a payment method to make bookings</p>
                  </div>
                )}
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="space-y-6">
                {/* Filters */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value as any)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    >
                      <option value="all">All Transactions</option>
                      <option value="completed">Completed</option>
                      <option value="pending">Pending</option>
                      <option value="refunded">Refunded</option>
                      <option value="failed">Failed</option>
                    </select>
                  </div>
                </div>

                {/* Transactions List */}
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={transaction.propertyImage}
                          alt={transaction.propertyTitle}
                          className="w-24 h-24 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-bold text-gray-900">{transaction.propertyTitle}</h4>
                              <p className="text-sm text-gray-600">{transaction.description}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-bold text-emerald-600">
                                ${transaction.amount.toLocaleString()}
                              </p>
                              <span className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(transaction.status)}`}>
                                {transaction.status.replace('_', ' ')}
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm mb-3">
                            <div>
                              <p className="text-gray-500">Date</p>
                              <p className="font-medium flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatDate(transaction.date)}
                              </p>
                            </div>
                            <div>
                              <p className="text-gray-500">Payment Method</p>
                              <p className="font-medium">
                                {transaction.paymentMethod.brand || transaction.paymentMethod.bankName} ****{transaction.paymentMethod.last4}
                              </p>
                            </div>
                            {transaction.refundAmount && (
                              <div>
                                <p className="text-gray-500">Refund Amount</p>
                                <p className="font-medium text-blue-600">
                                  ${transaction.refundAmount.toLocaleString()}
                                </p>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <button className="px-3 py-2 bg-white hover:bg-gray-100 border border-gray-300 rounded-lg text-sm font-medium transition-colors flex items-center gap-1">
                              <Download className="w-4 h-4" />
                              Download Receipt
                            </button>
                            {transaction.status === 'completed' && !transaction.refundAmount && (
                              <button
                                onClick={() => handleRequestRefund(transaction.id, transaction.amount)}
                                className="px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg text-sm font-medium transition-colors flex items-center gap-1"
                              >
                                <RefreshCw className="w-4 h-4" />
                                Request Refund
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredTransactions.length === 0 && (
                  <div className="text-center py-12">
                    <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No transactions found</h3>
                    <p className="text-gray-600">Your payment history will appear here</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
