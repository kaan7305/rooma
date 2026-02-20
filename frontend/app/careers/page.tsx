'use client';

import Link from 'next/link';
import { Briefcase, MapPin, Clock, Heart, Users, Zap, Target } from 'lucide-react';

export default function CareersPage() {
  const positions = [
    {
      id: 1,
      title: 'Senior Software Engineer',
      department: 'Engineering',
      location: 'San Francisco, CA / Remote',
      type: 'Full-time',
      description: 'Build scalable features for our growing platform and mentor junior developers.',
    },
    {
      id: 2,
      title: 'Product Designer',
      department: 'Design',
      location: 'New York, NY / Remote',
      type: 'Full-time',
      description: 'Create beautiful, intuitive experiences for students and hosts worldwide.',
    },
    {
      id: 3,
      title: 'Customer Success Manager',
      department: 'Support',
      location: 'Remote',
      type: 'Full-time',
      description: 'Help our community members have the best experience on ROOMA.',
    },
    {
      id: 4,
      title: 'Marketing Manager',
      department: 'Marketing',
      location: 'Los Angeles, CA / Remote',
      type: 'Full-time',
      description: 'Drive growth through creative campaigns and community engagement.',
    },
    {
      id: 5,
      title: 'Data Analyst',
      department: 'Analytics',
      location: 'Remote',
      type: 'Full-time',
      description: 'Turn data into insights that drive product and business decisions.',
    },
    {
      id: 6,
      title: 'Community Manager',
      department: 'Community',
      location: 'Chicago, IL / Remote',
      type: 'Full-time',
      description: 'Build and nurture relationships with our host and student communities.',
    },
  ];

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health, dental, and vision insurance for you and your family.',
    },
    {
      icon: Zap,
      title: 'Flexible Work',
      description: 'Remote-first culture with flexible hours and unlimited PTO.',
    },
    {
      icon: Target,
      title: 'Career Growth',
      description: 'Professional development budget and opportunities for advancement.',
    },
    {
      icon: Users,
      title: 'Great Team',
      description: 'Work with passionate, talented people who care about making a difference.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Join Our Team
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Help us revolutionize student housing and make a real impact on students lives worldwide.
          </p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-md mb-12">
          <h2 className="text-2xl font-bold text-black mb-6">Why ROOMA?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((benefit) => {
              const Icon = benefit.icon;
              return (
                <div key={benefit.title} className="flex gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-black mb-2">{benefit.title}</h3>
                    <p className="text-black">{benefit.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-black mb-6">Open Positions</h2>
          <div className="space-y-4">
            {positions.map((position) => (
              <div
                key={position.id}
                className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-black mb-2">{position.title}</h3>
                    <p className="text-black mb-3">{position.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-black">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        {position.department}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {position.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {position.type}
                      </div>
                    </div>
                  </div>
                  <button className="bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 transition-all whitespace-nowrap">
                    Apply Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-8 text-center text-white">
          <h2 className="text-2xl font-bold mb-4">Do not See a Perfect Fit?</h2>
          <p className="mb-6 text-white max-w-2xl mx-auto">
            We are always interested in hearing from talented individuals. Send us your resume and tell us why you would like to join ROOMA.
          </p>
          <button className="bg-white text-rose-600 px-8 py-3 rounded-xl font-semibold hover:bg-rose-50 transition-colors">
            Send General Application
          </button>
        </div>
      </div>
    </div>
  );
}
