'use client';

import Link from 'next/link';
import { Shield, Eye, Lock, AlertTriangle, CheckCircle, Phone, UserCheck, CreditCard } from 'lucide-react';

export default function SafetyCenterPage() {
  const safetyTips = [
    {
      title: 'Verify User Identity',
      description: 'Always check that hosts and guests have verified profiles with government-issued IDs and student verification.',
      icon: UserCheck,
    },
    {
      title: 'Keep Payments on Platform',
      description: 'Never pay or communicate outside ROOMA. Our secure payment system protects both parties.',
      icon: CreditCard,
    },
    {
      title: 'Trust Your Instincts',
      description: 'If something feels off, it probably is. Report suspicious behavior immediately to our trust and safety team.',
      icon: AlertTriangle,
    },
    {
      title: 'Meet in Safe Places',
      description: 'When viewing properties, meet during daylight hours and consider bringing a friend along.',
      icon: Eye,
    },
    {
      title: 'Read Reviews Carefully',
      description: 'Check host and guest reviews thoroughly. Look for consistent positive feedback and verified stays.',
      icon: CheckCircle,
    },
    {
      title: 'Secure Your Account',
      description: 'Use a strong password, enable two-factor authentication, and never share your login credentials.',
      icon: Lock,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Safety Center
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Your safety is our top priority. Learn how we protect our community and what you can do to stay safe.
          </p>
        </div>

        {/* How We Protect You */}
        <div className="bg-white rounded-2xl p-8 shadow-md mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">How ROOMA Protects You</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center shrink-0">
                <UserCheck className="w-6 h-6 text-rose-600" />
              </div>
              <div>
                <h3 className="font-bold text-black mb-2">Identity Verification</h3>
                <p className="text-black">All users must verify their identity with government-issued IDs. Students verify with valid student credentials.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center shrink-0">
                <CreditCard className="w-6 h-6 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-black mb-2">Secure Payments</h3>
                <p className="text-black">All transactions are processed securely through our platform with encryption and fraud protection.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center shrink-0">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-black mb-2">24/7 Support</h3>
                <p className="text-black">Our trust and safety team is available around the clock to handle emergencies and concerns.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-blue-100 rounded-xl flex items-center justify-center shrink-0">
                <CheckCircle className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="font-bold text-black mb-2">Review System</h3>
                <p className="text-black">Verified reviews from real stays help you make informed decisions about hosts and properties.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Safety Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {safetyTips.map((tip, idx) => {
              const Icon = tip.icon;
              return (
                <div key={idx} className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-shadow">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-rose-600" />
                  </div>
                  <h3 className="font-bold text-black mb-2">{tip.title}</h3>
                  <p className="text-black">{tip.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Report Issues */}
        <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-2xl p-8 border-2 border-red-200">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-black mb-2">Report a Safety Concern</h3>
              <p className="text-black mb-4">
                If you encounter suspicious behavior, feel unsafe, or need immediate assistance, contact us right away.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="bg-red-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                  <Phone className="w-5 h-5" />
                  Emergency: 1-800-NEST-911
                </button>
                <Link 
                  href="/help"
                  className="bg-white text-red-600 px-6 py-3 rounded-xl font-semibold hover:bg-red-50 transition-colors text-center border-2 border-red-600"
                >
                  Report an Issue
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
