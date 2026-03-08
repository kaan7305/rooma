'use client';

import Link from 'next/link';
import { Target, Users, Globe, Heart, Award, TrendingUp } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Properties Listed', value: '15K+', icon: Globe },
    { label: 'Cities Worldwide', value: '200+', icon: Target },
    { label: 'Successful Bookings', value: '100K+', icon: Award },
  ];

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'CEO & Founder',
      bio: 'Former student who experienced housing challenges firsthand and created ROOMA to help others.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
    },
    {
      name: 'Michael Chen',
      role: 'CTO',
      bio: 'Tech enthusiast passionate about building platforms that connect communities.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Head of Community',
      bio: 'Dedicated to creating safe and welcoming spaces for students worldwide.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
            About ROOMA
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto">
            We are building the worlds largest student housing platform, connecting students with safe, affordable, and flexible accommodation.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-md text-center">
                <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-rose-600" />
                </div>
                <p className="text-3xl font-bold text-black mb-1">{stat.value}</p>
                <p className="text-sm text-black">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-md mb-12">
          <h2 className="text-3xl font-bold text-black mb-6 text-center">Our Story</h2>
          <div className="max-w-3xl mx-auto space-y-4 text-black">
            <p>
              ROOMA was founded in 2023 by a group of students who experienced the challenges of finding safe, affordable housing while studying abroad. We understand the stress and uncertainty that comes with searching for accommodation in a new city.
            </p>
            <p>
              Our mission is to make student housing accessible, transparent, and trustworthy. We verify every property and user, ensure secure payments, and provide 24/7 support to create a safe community for students worldwide.
            </p>
            <p>
              Today, ROOMA serves over 50,000 students across 200+ cities globally, offering short-term sublets, semester housing, summer internships, and study abroad accommodations.
            </p>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center mb-4">
                <Heart className="w-6 h-6 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Community First</h3>
              <p className="text-black">We prioritize the safety, trust, and well-being of our community above all else.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-100 to-purple-100 rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Global Reach</h3>
              <p className="text-black">Connecting students worldwide with housing opportunities in every major city.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-indigo-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-black mb-2">Continuous Innovation</h3>
              <p className="text-black">Always improving our platform with new features and better user experiences.</p>
            </div>
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-black mb-8 text-center">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {team.map((member) => (
              <div key={member.name} className="bg-white rounded-2xl shadow-md overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold text-black mb-1">{member.name}</h3>
                  <p className="text-rose-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-black">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Join Our Team</h2>
          <p className="mb-6 text-white max-w-2xl mx-auto">
            We are always looking for passionate individuals to join our mission of revolutionizing student housing.
          </p>
          <Link
            href="/careers"
            className="inline-block bg-white text-rose-600 px-8 py-3 rounded-xl font-semibold hover:bg-rose-50 transition-colors"
          >
            View Open Positions
          </Link>
        </div>
      </div>
    </div>
  );
}
