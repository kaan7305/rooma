'use client';

import Link from 'next/link';
import { Users, MessageSquare, ThumbsUp, Eye, Calendar } from 'lucide-react';

export default function CommunityForumPage() {
  const topics = [
    {
      id: 1,
      title: 'Best neighborhoods for students in Boston?',
      author: 'Alex Thompson',
      category: 'Location Advice',
      replies: 24,
      views: 156,
      lastActivity: '2 hours ago',
    },
    {
      id: 2,
      title: 'Tips for negotiating rent with landlords',
      author: 'Maria Garcia',
      category: 'Advice',
      replies: 18,
      views: 203,
      lastActivity: '5 hours ago',
    },
    {
      id: 3,
      title: 'Summer sublet success stories',
      author: 'John Smith',
      category: 'Success Stories',
      replies: 31,
      views: 289,
      lastActivity: '1 day ago',
    },
    {
      id: 4,
      title: 'How to prepare for roommate meetings',
      author: 'Emma Wilson',
      category: 'Roommates',
      replies: 15,
      views: 142,
      lastActivity: '2 days ago',
    },
  ];

  const categories = [
    { name: 'General Discussion', count: 245, color: 'rose' },
    { name: 'Location Advice', count: 189, color: 'pink' },
    { name: 'Roommates', count: 156, color: 'purple' },
    { name: 'Success Stories', count: 98, color: 'indigo' },
    { name: 'Questions', count: 312, color: 'blue' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Community Forum
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Connect with fellow students, share experiences, and get advice from our community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-black">Recent Discussions</h2>
                <button className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-2 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 transition-all">
                  New Topic
                </button>
              </div>

              <div className="space-y-4">
                {topics.map((topic) => (
                  <Link
                    key={topic.id}
                    href={`/community/${topic.id}`}
                    className="block p-4 border border-gray-200 rounded-xl hover:border-rose-300 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="inline-block px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold mb-2">
                          {topic.category}
                        </div>
                        <h3 className="text-lg font-bold text-black mb-2 hover:text-rose-600 transition-colors">
                          {topic.title}
                        </h3>
                        <p className="text-sm text-black">Started by {topic.author}</p>
                      </div>
                      <div className="text-right text-sm text-black">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="w-4 h-4" />
                            {topic.replies}
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {topic.views}
                          </div>
                        </div>
                        <p>{topic.lastActivity}</p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-black mb-4">Categories</h3>
              <div className="space-y-3">
                {categories.map((category) => (
                  <Link
                    key={category.name}
                    href={`/community/category/${category.name.toLowerCase()}`}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-rose-50 transition-colors group"
                  >
                    <span className="font-semibold text-black group-hover:text-rose-600 transition-colors">
                      {category.name}
                    </span>
                    <span className="text-sm text-black bg-gray-100 px-3 py-1 rounded-full">
                      {category.count}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Community Guidelines</h3>
              <ul className="space-y-2 text-sm text-white">
                <li className="flex items-start gap-2">
                  <ThumbsUp className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Be respectful and helpful</span>
                </li>
                <li className="flex items-start gap-2">
                  <ThumbsUp className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Stay on topic</span>
                </li>
                <li className="flex items-start gap-2">
                  <ThumbsUp className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>No spam or self-promotion</span>
                </li>
                <li className="flex items-start gap-2">
                  <ThumbsUp className="w-4 h-4 mt-0.5 shrink-0" />
                  <span>Report inappropriate content</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
