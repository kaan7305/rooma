'use client';

import Link from 'next/link';
import { Users, MessageSquare, Star, TrendingUp, Award } from 'lucide-react';

export default function HostingCommunityPage() {
  const discussions = [
    {
      id: 1,
      title: 'Best practices for student tenants',
      author: 'Jennifer Smith',
      replies: 34,
      likes: 56,
      category: 'Tips & Tricks',
    },
    {
      id: 2,
      title: 'How I increased my bookings by 40%',
      author: 'Robert Johnson',
      replies: 28,
      likes: 89,
      category: 'Success Stories',
    },
    {
      id: 3,
      title: 'Dealing with maintenance requests',
      author: 'Lisa Anderson',
      replies: 19,
      likes: 42,
      category: 'Property Management',
    },
    {
      id: 4,
      title: 'Photography tips that worked for me',
      author: 'Michael Brown',
      replies: 45,
      likes: 112,
      category: 'Marketing',
    },
  ];

  const topHosts = [
    { name: 'Sarah Williams', properties: 8, rating: 4.9, bookings: 245 },
    { name: 'David Chen', properties: 5, rating: 4.8, bookings: 198 },
    { name: 'Emily Rodriguez', properties: 12, rating: 4.9, bookings: 356 },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Host Community
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Connect with fellow hosts, share tips, and learn from experienced property managers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">Active Discussions</h2>
                <button className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 transition-all">
                  New Topic
                </button>
              </div>

              <div className="space-y-4">
                {discussions.map((discussion) => (
                  <Link
                    key={discussion.id}
                    href={`/hosting-community/${discussion.id}`}
                    className="block p-4 border border-gray-200 rounded-xl hover:border-rose-300 hover:shadow-md transition-all"
                  >
                    <div className="inline-block px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold mb-2">
                      {discussion.category}
                    </div>
                    <h3 className="text-lg font-bold text-black mb-2 hover:text-rose-600 transition-colors">
                      {discussion.title}
                    </h3>
                    <div className="flex items-center justify-between text-sm text-black">
                      <p>by {discussion.author}</p>
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {discussion.replies}
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4" />
                          {discussion.likes}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-black mb-4 flex items-center gap-2">
                <Award className="w-6 h-6 text-rose-600" />
                Top Hosts
              </h3>
              <div className="space-y-4">
                {topHosts.map((host, idx) => (
                  <div key={host.name} className="flex items-center gap-3 p-3 rounded-xl hover:bg-rose-50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-black">{host.name}</p>
                      <div className="flex items-center gap-2 text-sm text-black">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{host.rating}</span>
                        <span>•</span>
                        <span>{host.properties} properties</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Host Resources</h3>
              <p className="mb-6 text-white">Access guides, tools, and support to grow your hosting business.</p>
              <Link
                href="/host-resources"
                className="block w-full text-center bg-white text-rose-600 px-6 py-3 rounded-xl font-semibold hover:bg-rose-50 transition-colors"
              >
                View Resources
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
