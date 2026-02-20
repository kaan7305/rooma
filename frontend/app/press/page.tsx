'use client';

import Link from 'next/link';
import { Newspaper, Download, Mail, ExternalLink } from 'lucide-react';

export default function PressPage() {
  const pressReleases = [
    {
      id: 1,
      title: 'ROOMA Raises $10M Series A to Expand Student Housing Platform',
      date: 'December 15, 2024',
      excerpt: 'ROOMA announces Series A funding to scale operations and expand to 50 new cities globally.',
    },
    {
      id: 2,
      title: 'ROOMA Reaches 50,000 Active Users Milestone',
      date: 'November 28, 2024',
      excerpt: 'Platform celebrates major growth milestone as student housing demand continues to surge.',
    },
    {
      id: 3,
      title: 'ROOMA Launches AI-Powered Roommate Matching',
      date: 'October 12, 2024',
      excerpt: 'New feature uses machine learning to help students find compatible roommates based on lifestyle preferences.',
    },
    {
      id: 4,
      title: 'ROOMA Partners with 100+ Universities Worldwide',
      date: 'September 5, 2024',
      excerpt: 'Strategic partnerships aim to provide verified housing options for international and domestic students.',
    },
  ];

  const coverage = [
    {
      outlet: 'TechCrunch',
      title: 'How ROOMA is Solving the Student Housing Crisis',
      date: 'Dec 2024',
      url: '#',
    },
    {
      outlet: 'Forbes',
      title: 'Student Housing Startup ROOMA Sees 300% Growth',
      date: 'Nov 2024',
      url: '#',
    },
    {
      outlet: 'The Wall Street Journal',
      title: 'The Future of Student Accommodation',
      date: 'Oct 2024',
      url: '#',
    },
    {
      outlet: 'Business Insider',
      title: 'Gen Z Embraces Flexible Housing Solutions',
      date: 'Sep 2024',
      url: '#',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Newspaper className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Press & Media
          </h1>
          <p className="text-xl text-black max-w-3xl mx-auto">
            Latest news, press releases, and media coverage about ROOMA.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl p-8 shadow-md">
              <h2 className="text-2xl font-bold text-black mb-6">Press Releases</h2>
              <div className="space-y-6">
                {pressReleases.map((release) => (
                  <div key={release.id} className="border-b border-gray-200 last:border-0 pb-6 last:pb-0">
                    <p className="text-sm text-black mb-2">{release.date}</p>
                    <h3 className="text-xl font-bold text-black mb-2 hover:text-rose-600 transition-colors cursor-pointer">
                      {release.title}
                    </h3>
                    <p className="text-black mb-3">{release.excerpt}</p>
                    <button className="text-rose-600 font-semibold hover:text-rose-700 transition-colors flex items-center gap-2">
                      Read Full Release
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-md">
              <h2 className="text-2xl font-bold text-black mb-6">Media Coverage</h2>
              <div className="space-y-4">
                {coverage.map((article, idx) => (
                  <a
                    key={idx}
                    href={article.url}
                    className="block p-4 border border-gray-200 rounded-xl hover:border-rose-300 hover:shadow-md transition-all group"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-bold text-rose-600 mb-1">{article.outlet}</p>
                        <h4 className="font-bold text-black group-hover:text-rose-600 transition-colors mb-1">
                          {article.title}
                        </h4>
                        <p className="text-sm text-black">{article.date}</p>
                      </div>
                      <ExternalLink className="w-5 h-5 text-black group-hover:text-rose-600 transition-colors shrink-0" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-black mb-4">Press Kit</h3>
              <p className="text-black mb-6">Download our official press kit including logos, brand assets, and company information.</p>
              <button className="w-full bg-gradient-to-r from-rose-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-rose-600 hover:to-pink-700 transition-all flex items-center justify-center gap-2">
                <Download className="w-5 h-5" />
                Download Press Kit
              </button>
            </div>

            <div className="bg-gradient-to-br from-rose-500 to-pink-600 rounded-2xl p-6 text-white">
              <h3 className="text-xl font-bold mb-4">Media Inquiries</h3>
              <p className="mb-6 text-white">For press inquiries, interviews, or more information, please contact our media team.</p>
              <div className="space-y-3">
                <a
                  href="mailto:press@rooma.com"
                  className="block w-full text-center bg-white text-rose-600 px-6 py-3 rounded-xl font-semibold hover:bg-rose-50 transition-colors"
                >
                  <Mail className="w-5 h-5 inline mr-2" />
                  press@rooma.com
                </a>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md">
              <h3 className="text-xl font-bold text-black mb-4">Quick Facts</h3>
              <ul className="space-y-3 text-black">
                <li className="flex justify-between">
                  <span className="font-semibold">Founded:</span>
                  <span>2023</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold">Headquarters:</span>
                  <span>San Francisco, CA</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold">Active Users:</span>
                  <span>50,000+</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold">Cities:</span>
                  <span>200+</span>
                </li>
                <li className="flex justify-between">
                  <span className="font-semibold">Properties:</span>
                  <span>15,000+</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
