'use client';

import Link from 'next/link';
import { BookOpen, Video, FileText, Users, TrendingUp, Shield, DollarSign, Home } from 'lucide-react';

export default function HostResourcesPage() {
  const resources = [
    {
      title: 'Getting Started Guide',
      description: 'Everything you need to know about listing your property on ROOMA.',
      icon: BookOpen,
      link: '/host-resources/getting-started',
    },
    {
      title: 'Pricing Your Property',
      description: 'Tips and tools to set competitive prices and maximize your earnings.',
      icon: DollarSign,
      link: '/host-resources/pricing',
    },
    {
      title: 'Safety & Security',
      description: 'Best practices for keeping your property and guests safe.',
      icon: Shield,
      link: '/host-resources/safety',
    },
    {
      title: 'Marketing Your Listing',
      description: 'Optimize your listing to attract more bookings.',
      icon: TrendingUp,
      link: '/host-resources/marketing',
    },
  ];

  const videos = [
    { title: 'Creating Your First Listing', duration: '5:32' },
    { title: 'Professional Photography Tips', duration: '7:45' },
    { title: 'Managing Guest Communications', duration: '4:18' },
    { title: 'Maximizing Your Earnings', duration: '6:20' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Host Resources
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Tools, guides, and support to help you succeed as a host on ROOMA.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <Link
                key={resource.title}
                href={resource.link}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all group"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-rose-600" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2 group-hover:text-rose-600 transition-colors">
                  {resource.title}
                </h3>
                <p className="text-black">{resource.description}</p>
              </Link>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-md mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Video Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video) => (
              <div
                key={video.title}
                className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:border-rose-300 hover:shadow-md transition-all cursor-pointer group"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-xl flex items-center justify-center shrink-0">
                  <Video className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-black group-hover:text-rose-600 transition-colors mb-1">
                    {video.title}
                  </h4>
                  <p className="text-sm text-black">{video.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-8 text-white">
            <Home className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Ready to List?</h3>
            <p className="mb-6 text-white">Start earning by listing your property on ROOMA today.</p>
            <Link
              href="/host/new"
              className="inline-block bg-white text-rose-600 px-6 py-3 rounded-xl font-semibold hover:bg-rose-50 transition-colors"
            >
              List Your Space
            </Link>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-8 text-white">
            <Users className="w-12 h-12 mb-4" />
            <h3 className="text-2xl font-bold mb-4">Join the Community</h3>
            <p className="mb-6 text-white">Connect with other hosts and share experiences.</p>
            <Link
              href="/hosting-community"
              className="inline-block bg-white text-purple-600 px-6 py-3 rounded-xl font-semibold hover:bg-purple-50 transition-colors"
            >
              Visit Forum
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
