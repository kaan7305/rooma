'use client';

import { useState } from 'react';
import {
  HelpCircle,
  MessageCircle,
  Mail,
  Phone,
  Search,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Users,
  Shield,
  CreditCard,
  Home,
  FileText
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Topics', icon: BookOpen },
    { id: 'booking', label: 'Booking', icon: Home },
    { id: 'payment', label: 'Payments', icon: CreditCard },
    { id: 'account', label: 'Account', icon: Users },
    { id: 'safety', label: 'Safety', icon: Shield },
    { id: 'policies', label: 'Policies', icon: FileText },
  ];

  const faqs: FAQItem[] = [
    {
      id: '1',
      category: 'booking',
      question: 'How do I book a property?',
      answer: 'To book a property, browse available listings, select your desired dates, and click "Book Now". You\'ll need to provide payment information and agree to the terms. Once the host accepts your request, you\'ll receive a confirmation email.',
    },
    {
      id: '2',
      category: 'booking',
      question: 'Can I cancel my booking?',
      answer: 'Yes, you can cancel your booking according to the cancellation policy set by the host. Most properties offer flexible, moderate, or strict cancellation policies. Check the property details for specific terms.',
    },
    {
      id: '3',
      category: 'payment',
      question: 'What payment methods are accepted?',
      answer: 'We accept major credit cards (Visa, Mastercard, American Express), debit cards, and bank transfers. All payments are processed securely through our platform.',
    },
    {
      id: '4',
      category: 'payment',
      question: 'When will I receive my payout as a host?',
      answer: 'Payouts are typically processed 24 hours after guest check-in and arrive in your account within 3-5 business days, depending on your payout method and bank.',
    },
    {
      id: '5',
      category: 'account',
      question: 'How do I verify my account?',
      answer: 'To verify your account, go to Settings > Security and upload a government-issued ID. For student verification, upload your student ID or enrollment letter. Verification typically takes 24-48 hours.',
    },
    {
      id: '6',
      category: 'account',
      question: 'How do I update my profile information?',
      answer: 'Navigate to Settings from your profile dropdown menu. From there, you can update your personal information, contact details, and preferences.',
    },
    {
      id: '7',
      category: 'safety',
      question: 'How does ROOMA ensure safety?',
      answer: 'We verify all users, secure all payments, provide 24/7 customer support, and have a review system. Never communicate or pay outside the platform. Report any suspicious activity immediately.',
    },
    {
      id: '8',
      category: 'safety',
      question: 'What should I do if I feel unsafe?',
      answer: 'Your safety is our priority. Contact our support team immediately through the in-app chat or emergency hotline. We have a dedicated trust and safety team available 24/7.',
    },
    {
      id: '9',
      category: 'policies',
      question: 'What is the refund policy?',
      answer: 'Refund policies vary by property and cancellation timing. Generally, cancellations made well in advance receive fuller refunds. Check the specific property\'s cancellation policy before booking.',
    },
    {
      id: '10',
      category: 'policies',
      question: 'What are the guest requirements?',
      answer: 'Guests must be 18 years or older, have a verified account, and agree to house rules set by the host. Student properties may require valid student verification.',
    },
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleFAQ = (id: string) => {
    setExpandedFAQ(expandedFAQ === id ? null : id);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-600 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">How can we help you?</h1>
          <p className="text-lg text-gray-600 mb-8">
            Search our help center or contact our support team
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-black" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for help..."
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        {/* Contact Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-rose-300 transition cursor-pointer">
            <div className="h-12 w-12 bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg flex items-center justify-center mb-4">
              <MessageCircle className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-sm text-gray-600 mb-4">
              Chat with our support team in real-time
            </p>
            <button className="text-rose-600 font-medium hover:text-rose-700 transition">
              Start Chat →
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-rose-300 transition cursor-pointer">
            <div className="h-12 w-12 bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg flex items-center justify-center mb-4">
              <Mail className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-sm text-gray-600 mb-4">
              Get help via email within 24 hours
            </p>
            <a href="mailto:support@rooma.com" className="text-rose-600 font-medium hover:text-rose-700 transition">
              support@rooma.com →
            </a>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:border-rose-300 transition cursor-pointer">
            <div className="h-12 w-12 bg-gradient-to-r from-rose-100 to-pink-100 rounded-lg flex items-center justify-center mb-4">
              <Phone className="w-6 h-6 text-rose-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Phone Support</h3>
            <p className="text-sm text-gray-600 mb-4">
              Call us for urgent assistance
            </p>
            <a href="tel:+1-800-NEST-HELP" className="text-rose-600 font-medium hover:text-rose-700 transition">
              1-800-NEST-HELP →
            </a>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {category.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>

          {filteredFAQs.length === 0 ? (
            <div className="text-center py-12">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No results found. Try a different search term.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredFAQs.map(faq => (
                <div
                  key={faq.id}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full px-6 py-4 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <span className="font-medium text-gray-900 text-left">
                      {faq.question}
                    </span>
                    {expandedFAQ === faq.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 ml-4" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 ml-4" />
                    )}
                  </button>
                  {expandedFAQ === faq.id && (
                    <div className="px-6 py-4 bg-white border-t border-gray-200">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Still Need Help */}
        <div className="mt-12 bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg shadow-lg p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-2">Still need help?</h2>
          <p className="mb-6 text-rose-100">
            Our support team is available 24/7 to assist you
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="px-6 py-3 bg-white text-rose-600 rounded-lg font-semibold hover:bg-gray-50 transition">
              Contact Support
            </button>
            <button className="px-6 py-3 bg-rose-700 text-white rounded-lg font-semibold hover:bg-rose-800 transition">
              Submit a Ticket
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
