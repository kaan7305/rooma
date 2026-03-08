'use client';

import { useState, useEffect } from 'react';
import {
  CreditCard,
  Building2,
  Check,
  ChevronRight,
  Lock,
  Shield,
  Users,
  Plus,
  X,
  AlertCircle
} from 'lucide-react';
import { usePaymentStore, type PaymentMethod } from '@/lib/payment-store';
import { useToast } from '@/lib/toast-context';

interface CheckoutFlowProps {
  bookingId: string;
  propertyTitle: string;
  propertyImage: string;
  totalAmount: number;
  checkIn: string;
  checkOut: string;
  guests: number;
  onComplete: () => void;
  onCancel: () => void;
}

export default function CheckoutFlow({
  bookingId,
  propertyTitle,
  propertyImage,
  totalAmount,
  checkIn,
  checkOut,
  guests,
  onComplete,
  onCancel,
}: CheckoutFlowProps) {
  const toast = useToast();
  const { paymentMethods, loadPaymentData, addPaymentMethod } = usePaymentStore();
  const [step, setStep] = useState<'payment' | 'review' | 'processing'>('payment');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [enableSplitPayment, setEnableSplitPayment] = useState(false);
  const [splitParticipants, setSplitParticipants] = useState<Array<{ email: string; amount: number }>>([]);
  const [showAddCard, setShowAddCard] = useState(false);

  // New card form state
  const [newCard, setNewCard] = useState({
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    nickname: '',
  });

  useEffect(() => {
    loadPaymentData();
  }, [loadPaymentData]);

  useEffect(() => {
    if (paymentMethods.length > 0 && !selectedPaymentMethod) {
      const defaultMethod = paymentMethods.find(pm => pm.isDefault) || paymentMethods[0];
      setSelectedPaymentMethod(defaultMethod);
    }
  }, [paymentMethods, selectedPaymentMethod]);

  const handleAddParticipant = () => {
    const remainingAmount = totalAmount - splitParticipants.reduce((sum, p) => sum + p.amount, 0);
    if (remainingAmount > 0) {
      setSplitParticipants([...splitParticipants, { email: '', amount: remainingAmount }]);
    }
  };

  const handleRemoveParticipant = (index: number) => {
    setSplitParticipants(splitParticipants.filter((_, i) => i !== index));
  };

  const handleParticipantChange = (index: number, field: 'email' | 'amount', value: string | number) => {
    const updated = [...splitParticipants];
    updated[index] = { ...updated[index], [field]: value };
    setSplitParticipants(updated);
  };

  const handleAddNewCard = () => {
    if (!newCard.cardNumber || !newCard.expiryMonth || !newCard.expiryYear || !newCard.cvv) {
      toast.error('Please fill in all card details');
      return;
    }

    const last4 = newCard.cardNumber.slice(-4);
    const brand = newCard.cardNumber.startsWith('4') ? 'Visa' : 'Mastercard';

    addPaymentMethod({
      type: 'card',
      last4,
      brand,
      expiryMonth: parseInt(newCard.expiryMonth),
      expiryYear: parseInt(newCard.expiryYear),
      isDefault: paymentMethods.length === 0,
      nickname: newCard.nickname || `${brand} ending in ${last4}`,
    });

    toast.success('Card added successfully!');
    setShowAddCard(false);
    setNewCard({ cardNumber: '', expiryMonth: '', expiryYear: '', cvv: '', nickname: '' });
  };

  const handleProceedToReview = () => {
    if (!selectedPaymentMethod) {
      toast.error('Please select a payment method');
      return;
    }

    if (enableSplitPayment) {
      const totalSplit = splitParticipants.reduce((sum, p) => sum + p.amount, 0);
      if (Math.abs(totalSplit - totalAmount) > 0.01) {
        toast.error('Split amounts must equal total amount');
        return;
      }
      if (splitParticipants.some(p => !p.email)) {
        toast.error('Please enter email for all participants');
        return;
      }
    }

    setStep('review');
  };

  const handleConfirmPayment = () => {
    setStep('processing');
    // Simulate payment processing
    setTimeout(() => {
      toast.success('Payment successful!');
      onComplete();
    }, 2000);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const renderPaymentMethodIcon = (method: PaymentMethod) => {
    if (method.type === 'bank') {
      return <Building2 className="w-8 h-8 text-blue-600" />;
    }
    return <CreditCard className="w-8 h-8 text-purple-600" />;
  };

  if (step === 'processing') {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="w-20 h-20 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full flex items-center justify-center mb-6 animate-pulse">
          <Lock className="w-10 h-10 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h3>
        <p className="text-gray-600">Please wait while we process your payment securely...</p>
      </div>
    );
  }

  if (step === 'review') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-200 pb-4">
          <h3 className="text-2xl font-bold text-gray-900">Review & Confirm</h3>
          <button
            onClick={() => setStep('payment')}
            className="text-rose-600 hover:text-rose-700 font-medium"
          >
            ← Edit
          </button>
        </div>

        {/* Booking Summary */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Booking Details</h4>
          <div className="flex gap-4">
            <img
              src={propertyImage}
              alt={propertyTitle}
              className="w-24 h-24 rounded-lg object-cover"
            />
            <div className="flex-1">
              <h5 className="font-semibold text-gray-900">{propertyTitle}</h5>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-gray-600">
                <div>Check-in: {formatDate(checkIn)}</div>
                <div>Check-out: {formatDate(checkOut)}</div>
                <div>Guests: {guests}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Payment Method</h4>
          {selectedPaymentMethod && (
            <div className="flex items-center gap-3">
              {renderPaymentMethodIcon(selectedPaymentMethod)}
              <div>
                <p className="font-medium text-gray-900">
                  {selectedPaymentMethod.brand || selectedPaymentMethod.bankName} ****{selectedPaymentMethod.last4}
                </p>
                {selectedPaymentMethod.expiryMonth && selectedPaymentMethod.expiryYear && (
                  <p className="text-sm text-gray-600">
                    Expires {selectedPaymentMethod.expiryMonth}/{selectedPaymentMethod.expiryYear}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="font-semibold text-gray-900 mb-4">Price Breakdown</h4>
          <div className="space-y-2">
            {enableSplitPayment ? (
              <>
                {splitParticipants.map((participant, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">{participant.email || `Participant ${index + 1}`}</span>
                    <span className="font-medium">${participant.amount.toFixed(2)}</span>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Total booking cost</span>
                <span className="font-medium">${totalAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-emerald-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirmPayment}
            className="flex-1 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            <Lock className="w-5 h-5" />
            Confirm & Pay ${totalAmount.toFixed(2)}
          </button>
        </div>

        <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
          <Shield className="w-4 h-4" />
          <span>Secured by SSL encryption</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <h3 className="text-2xl font-bold text-gray-900">Payment Details</h3>
        <div className="flex items-center gap-2 text-sm text-emerald-600">
          <Shield className="w-4 h-4" />
          <span>Secure Checkout</span>
        </div>
      </div>

      {/* Payment Methods */}
      <div>
        <h4 className="font-semibold text-gray-900 mb-3">Select Payment Method</h4>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedPaymentMethod(method)}
              className={`w-full p-4 rounded-xl border-2 transition-all ${
                selectedPaymentMethod?.id === method.id
                  ? 'border-rose-500 bg-rose-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-3">
                {renderPaymentMethodIcon(method)}
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">
                    {method.brand || method.bankName} ****{method.last4}
                  </p>
                  {method.nickname && (
                    <p className="text-sm text-gray-600">{method.nickname}</p>
                  )}
                  {method.expiryMonth && method.expiryYear && (
                    <p className="text-sm text-gray-600">
                      Exp: {method.expiryMonth}/{method.expiryYear}
                    </p>
                  )}
                </div>
                {selectedPaymentMethod?.id === method.id && (
                  <Check className="w-6 h-6 text-rose-500" />
                )}
              </div>
            </button>
          ))}

          {/* Add New Card */}
          {!showAddCard ? (
            <button
              onClick={() => setShowAddCard(true)}
              className="w-full p-4 rounded-xl border-2 border-dashed border-gray-300 hover:border-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center gap-2 text-gray-600 hover:text-rose-600"
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">Add New Card</span>
            </button>
          ) : (
            <div className="p-6 rounded-xl border-2 border-rose-500 bg-rose-50">
              <div className="flex items-center justify-between mb-4">
                <h5 className="font-semibold text-gray-900">Add New Card</h5>
                <button
                  onClick={() => setShowAddCard(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Card Number"
                  value={newCard.cardNumber}
                  onChange={(e) => setNewCard({ ...newCard, cardNumber: e.target.value.replace(/\s/g, '').slice(0, 16) })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <div className="grid grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="MM"
                    value={newCard.expiryMonth}
                    onChange={(e) => setNewCard({ ...newCard, expiryMonth: e.target.value.slice(0, 2) })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="YYYY"
                    value={newCard.expiryYear}
                    onChange={(e) => setNewCard({ ...newCard, expiryYear: e.target.value.slice(0, 4) })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="CVV"
                    value={newCard.cvv}
                    onChange={(e) => setNewCard({ ...newCard, cvv: e.target.value.slice(0, 4) })}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Card Nickname (optional)"
                  value={newCard.nickname}
                  onChange={(e) => setNewCard({ ...newCard, nickname: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <button
                  onClick={handleAddNewCard}
                  className="w-full px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors"
                >
                  Add Card
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Split Payment Option */}
      <div className="border-t border-gray-200 pt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-gray-600" />
            <span className="font-semibold text-gray-900">Split Payment</span>
          </div>
          <button
            onClick={() => setEnableSplitPayment(!enableSplitPayment)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
              enableSplitPayment ? 'bg-rose-500' : 'bg-gray-300'
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                enableSplitPayment ? 'translate-x-6' : 'translate-x-1'
              }`}
            />
          </button>
        </div>

        {enableSplitPayment && (
          <div className="space-y-3">
            {splitParticipants.map((participant, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email address"
                  value={participant.email}
                  onChange={(e) => handleParticipantChange(index, 'email', e.target.value)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <input
                  type="number"
                  placeholder="Amount"
                  value={participant.amount}
                  onChange={(e) => handleParticipantChange(index, 'amount', parseFloat(e.target.value) || 0)}
                  className="w-32 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                />
                <button
                  onClick={() => handleRemoveParticipant(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
            <button
              onClick={handleAddParticipant}
              className="w-full px-4 py-2 border-2 border-dashed border-gray-300 hover:border-rose-500 hover:bg-rose-50 rounded-lg text-gray-600 hover:text-rose-600 font-medium transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Participant
            </button>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-6">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">Total Amount</span>
          <span className="text-3xl font-bold text-emerald-600">${totalAmount.toFixed(2)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl font-semibold transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleProceedToReview}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          Continue to Review
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
