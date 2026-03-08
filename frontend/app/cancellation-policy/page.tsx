'use client';

import Link from 'next/link';
import { FileText, Clock, DollarSign, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export default function CancellationPolicyPage() {
  const policies = [
    {
      name: 'Flexible',
      description: 'Full refund up to 24 hours before check-in',
      icon: CheckCircle,
      color: 'emerald',
      details: [
        'Cancel up to 24 hours before check-in for a full refund',
        'Cancel less than 24 hours before check-in for a 50% refund',
        'No refund after check-in',
      ],
    },
    {
      name: 'Moderate',
      description: 'Full refund up to 5 days before check-in',
      icon: AlertCircle,
      color: 'yellow',
      details: [
        'Cancel up to 5 days before check-in for a full refund',
        'Cancel 2-5 days before check-in for a 50% refund',
        'Cancel less than 2 days before check-in for no refund',
      ],
    },
    {
      name: 'Strict',
      description: 'Full refund up to 7 days before check-in',
      icon: XCircle,
      color: 'red',
      details: [
        'Cancel up to 7 days before check-in for a full refund',
        'Cancel less than 7 days before check-in for a 50% refund',
        'No refund within 48 hours of check-in',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Cancellation Policy
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Understanding our cancellation policies helps you make informed booking decisions.
          </p>
        </div>

        {/* Policy Types */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Policy Types</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {policies.map((policy, idx) => {
              const Icon = policy.icon;
              const colorMap: Record<string, string> = {
                emerald: 'from-emerald-100 to-green-100',
                yellow: 'from-yellow-100 to-orange-100',
                red: 'from-red-100 to-rose-100',
              };
              const iconColorMap: Record<string, string> = {
                emerald: 'text-emerald-600',
                yellow: 'text-yellow-600',
                red: 'text-red-600',
              };
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
                  <div className={`w-12 h-12 bg-gradient-to-br ${colorMap[policy.color]} rounded-xl flex items-center justify-center mb-4`}>
                    <Icon className={`w-6 h-6 ${iconColorMap[policy.color]}`} />
                  </div>
                  <h3 className="text-xl font-bold text-black mb-2">{policy.name}</h3>
                  <p className="text-black mb-4">{policy.description}</p>
                  <ul className="space-y-2">
                    {policy.details.map((detail, detailIdx) => (
                      <li key={detailIdx} className="flex items-start gap-2 text-sm text-black">
                        <CheckCircle className="w-4 h-4 text-rose-600 mt-0.5 shrink-0" />
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        {/* Important Information */}
        <div className="bg-white rounded-2xl p-8 shadow-md mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Important Information</h2>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center shrink-0">
                <Clock className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-black mb-2">Check the Policy Before Booking</h3>
                <p className="text-black">Each property has its own cancellation policy set by the host. Always review the specific policy displayed on the property page before making a booking.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center shrink-0">
                <DollarSign className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-black mb-2">Service Fees Are Non-Refundable</h3>
                <p className="text-black">While the accommodation cost may be refundable according to the policy, ROOMA service fees are generally non-refundable except in certain circumstances.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                <AlertCircle className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-black mb-2">Extenuating Circumstances</h3>
                <p className="text-black">In cases of serious illness, natural disasters, or other unforeseen events, we may make exceptions to the standard policy. Contact our support team for assistance.</p>
              </div>
            </div>
          </div>
        </div>

        {/* How to Cancel */}
        <div className="bg-gradient-to-br from-rose-100 to-pink-100 rounded-2xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-black mb-4">How to Cancel a Booking</h2>
          <ol className="space-y-3 text-black">
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-rose-600 shrink-0">1</span>
              <span>Go to "Bookings" in your account</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-rose-600 shrink-0">2</span>
              <span>Select the booking you want to cancel</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-rose-600 shrink-0">3</span>
              <span>Click "Cancel Booking" and review the refund amount</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-rose-600 shrink-0">4</span>
              <span>Confirm the cancellation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-8 h-8 bg-white rounded-full flex items-center justify-center font-bold text-rose-600 shrink-0">5</span>
              <span>Refunds will be processed within 5-10 business days</span>
            </li>
          </ol>
        </div>

        {/* Contact */}
        <div className="bg-white rounded-2xl p-8 shadow-md text-center">
          <h2 className="text-2xl font-bold text-black mb-4">Questions About Cancellations?</h2>
          <p className="text-black mb-6">Our support team is here to help clarify any questions about our cancellation policies.</p>
          <Link 
            href="/help"
            className="inline-block bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl px-8 py-3 font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
