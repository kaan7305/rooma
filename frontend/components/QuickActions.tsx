'use client';

import Link from 'next/link';
import { Search, Home, Bookmark, Calendar, MessageCircle, Settings, User, Bell } from 'lucide-react';

export default function QuickActions() {
  const actions = [
    {
      name: 'Find Sublets',
      description: 'Search for properties',
      icon: Search,
      href: '/search',
      color: 'from-teal-600 to-teal-700',
      hoverColor: 'hover:from-teal-700 hover:to-teal-800',
    },
    {
      name: 'List Property',
      description: 'Become a host',
      icon: Home,
      href: '/list-property',
      color: 'from-blue-500 to-cyan-500',
      hoverColor: 'hover:from-blue-600 hover:to-cyan-600',
    },
    {
      name: 'My Favorites',
      description: 'View saved properties',
      icon: Bookmark,
      href: '/favorites',
      color: 'from-teal-600 to-teal-800',
      hoverColor: 'hover:from-teal-700 hover:to-teal-900',
    },
    {
      name: 'My Bookings',
      description: 'Manage reservations',
      icon: Calendar,
      href: '/bookings',
      color: 'from-emerald-500 to-teal-500',
      hoverColor: 'hover:from-emerald-600 hover:to-teal-600',
    },
    {
      name: 'Messages',
      description: 'Chat with hosts',
      icon: MessageCircle,
      href: '/messages',
      color: 'from-amber-500 to-orange-500',
      hoverColor: 'hover:from-amber-600 hover:to-orange-600',
    },
    {
      name: 'Profile',
      description: 'Edit your profile',
      icon: User,
      href: '/profile',
      color: 'from-teal-600 to-teal-700',
      hoverColor: 'hover:from-teal-700 hover:to-teal-800',
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.name}
              href={action.href}
              className="group"
            >
              <div className="p-4 rounded-xl border-2 border-gray-200 hover:border-transparent hover:shadow-lg transition-all">
                <div className={`w-12 h-12 bg-gradient-to-r ${action.color} ${action.hoverColor} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform shadow-md`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 mb-1 group-hover:text-teal-700 transition-colors">
                  {action.name}
                </h3>
                <p className="text-xs text-gray-500">{action.description}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
