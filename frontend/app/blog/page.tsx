'use client';

import Link from 'next/link';
import { BookOpen, Calendar, User, ArrowRight, TrendingUp } from 'lucide-react';

export default function BlogPage() {
  const stories = [
    {
      id: 1,
      title: 'Finding My Perfect Student Apartment in New York',
      excerpt: 'How I navigated the NYC housing market as an international student and found an amazing sublet through ROOMA.',
      author: 'Sarah Chen',
      date: 'Dec 15, 2024',
      category: 'Student Life',
      image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
      readTime: '5 min read',
    },
    {
      id: 2,
      title: 'Tips for First-Time Subletters',
      excerpt: 'Everything I wish I knew before subletting my first apartment. A comprehensive guide for beginners.',
      author: 'Michael Rodriguez',
      date: 'Dec 12, 2024',
      category: 'Tips & Guides',
      image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=800&q=80',
      readTime: '7 min read',
    },
    {
      id: 3,
      title: 'Summer Housing: My Internship Experience',
      excerpt: 'Securing affordable summer housing for my tech internship in San Francisco.',
      author: 'Emily Watson',
      date: 'Dec 10, 2024',
      category: 'Internships',
      image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
      readTime: '4 min read',
    },
    {
      id: 4,
      title: 'Making Friends Through Roommate Finder',
      excerpt: 'How I found not just a place to live, but lifelong friends through ROOMA roommate matching.',
      author: 'David Park',
      date: 'Dec 8, 2024',
      category: 'Community',
      image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
      readTime: '6 min read',
    },
    {
      id: 5,
      title: 'Hosting as a Student: Extra Income Guide',
      excerpt: 'How I earn extra money by hosting my spare room during summer break.',
      author: 'Jessica Lee',
      date: 'Dec 5, 2024',
      category: 'Hosting',
      image: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      readTime: '5 min read',
    },
    {
      id: 6,
      title: 'Study Abroad Housing Made Easy',
      excerpt: 'My semester in London and how ROOMA made finding housing stress-free.',
      author: 'Tom Anderson',
      date: 'Dec 1, 2024',
      category: 'Study Abroad',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80',
      readTime: '8 min read',
    },
  ];

  const categories = ['All', 'Student Life', 'Tips & Guides', 'Internships', 'Community', 'Hosting', 'Study Abroad'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <BookOpen className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Sublet Stories
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Real stories from our community of students, hosts, and travelers sharing their experiences.
          </p>
        </div>

        {/* Categories */}
        <div className="flex gap-3 overflow-x-auto pb-6 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              className={`px-6 py-2 rounded-xl font-semibold whitespace-nowrap transition ${
                category === 'All'
                  ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white shadow-lg'
                  : 'bg-white text-black hover:bg-rose-50 border border-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Featured Story */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-12 hover:shadow-2xl transition-shadow">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <img
              src={stories[0].image}
              alt={stories[0].title}
              className="w-full h-64 lg:h-full object-cover"
            />
            <div className="p-8 flex flex-col justify-center">
              <div className="inline-block px-4 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-semibold mb-4 w-fit">
                <TrendingUp className="w-4 h-4 inline mr-1" />
                Featured Story
              </div>
              <h2 className="text-3xl font-bold text-black mb-4">{stories[0].title}</h2>
              <p className="text-black mb-6">{stories[0].excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-black mb-6">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {stories[0].author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {stories[0].date}
                </div>
              </div>
              <Link
                href={`/blog/${stories[0].id}`}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 transition-all w-fit"
              >
                Read Full Story
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Story Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stories.slice(1).map((story) => (
            <Link
              key={story.id}
              href={`/blog/${story.id}`}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow group"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <img
                  src={story.image}
                  alt={story.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <div className="inline-block px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-xs font-semibold mb-3">
                  {story.category}
                </div>
                <h3 className="text-xl font-bold text-black mb-2 group-hover:text-rose-600 transition-colors">
                  {story.title}
                </h3>
                <p className="text-black mb-4 line-clamp-2">{story.excerpt}</p>
                <div className="flex items-center justify-between text-sm text-black">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {story.author}
                  </div>
                  <span>{story.readTime}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Share Your Story</h2>
          <p className="mb-6 text-white max-w-2xl mx-auto">
            Have an interesting housing or travel experience? We would love to hear from you and share it with our community.
          </p>
          <button className="bg-white text-rose-600 px-8 py-3 rounded-xl font-semibold hover:bg-rose-50 transition-colors">
            Submit Your Story
          </button>
        </div>
      </div>
    </div>
  );
}
