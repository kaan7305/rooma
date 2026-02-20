'use client';

import { useState, useEffect } from 'react';
import {
  Gift,
  Users,
  DollarSign,
  Copy,
  Check,
  Share2,
  Mail,
  MessageCircle,
  Trophy,
  Sparkles,
  TrendingUp,
  Facebook,
  Twitter,
  Linkedin
} from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { useToast } from '@/lib/toast-context';

interface ReferralStat {
  label: string;
  value: string | number;
  icon: typeof Users;
  color: string;
  bgColor: string;
}

interface Referral {
  id: string;
  name: string;
  email: string;
  status: 'pending' | 'completed';
  reward: number;
  date: string;
}

interface RewardTier {
  referrals: number;
  reward: number;
  bonus?: number;
  label: string;
}

export default function ReferralProgram() {
  const toast = useToast();
  const { user } = useAuthStore();
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState('');
  const [referrals, setReferrals] = useState<Referral[]>([]);

  useEffect(() => {
    if (user) {
      // Generate referral code from user info
      const code = `NQ${user.firstName.slice(0, 2).toUpperCase()}${user.lastName.slice(0, 2).toUpperCase()}${user.id.slice(0, 4).toUpperCase()}`;
      setReferralCode(code);

      // Simulate referral data
      setReferrals([
        {
          id: '1',
          name: 'Sarah Johnson',
          email: 's***@email.com',
          status: 'completed',
          reward: 50,
          date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '2',
          name: 'Mike Chen',
          email: 'm***@email.com',
          status: 'completed',
          reward: 50,
          date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
        },
        {
          id: '3',
          name: 'Emily Davis',
          email: 'e***@email.com',
          status: 'pending',
          reward: 50,
          date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]);
    }
  }, [user]);

  const referralUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/auth/signup?ref=${referralCode}`
    : '';

  const completedReferrals = referrals.filter(r => r.status === 'completed').length;
  const pendingReferrals = referrals.filter(r => r.status === 'pending').length;
  const totalEarned = referrals.filter(r => r.status === 'completed').reduce((sum, r) => sum + r.reward, 0);

  const stats: ReferralStat[] = [
    {
      label: 'Total Referrals',
      value: referrals.length,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'Successful',
      value: completedReferrals,
      icon: Check,
      color: 'text-emerald-600',
      bgColor: 'from-emerald-500 to-teal-500',
    },
    {
      label: 'Pending',
      value: pendingReferrals,
      icon: TrendingUp,
      color: 'text-yellow-600',
      bgColor: 'from-yellow-500 to-orange-500',
    },
    {
      label: 'Total Earned',
      value: `$${totalEarned}`,
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'from-purple-500 to-pink-500',
    },
  ];

  const rewardTiers: RewardTier[] = [
    { referrals: 1, reward: 50, label: 'Getting Started' },
    { referrals: 5, reward: 75, bonus: 100, label: 'Rising Star' },
    { referrals: 10, reward: 100, bonus: 250, label: 'Super Referrer' },
    { referrals: 25, reward: 150, bonus: 500, label: 'Elite Ambassador' },
  ];

  const currentTier = rewardTiers
    .filter(tier => completedReferrals >= tier.referrals)
    .pop() || rewardTiers[0];

  const nextTier = rewardTiers.find(tier => tier.referrals > completedReferrals);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success(`${label} copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent('Join ROOMA - Get $50 Off!');
    const body = encodeURIComponent(
      `Hey! I've been using ROOMA to find student housing and it's amazing. Join using my referral link and get $50 off your first booking:\n\n${referralUrl}\n\nUse code: ${referralCode}`
    );
    window.open(`mailto:?subject=${subject}&body=${body}`);
  };

  const shareViaSocial = (platform: 'facebook' | 'twitter' | 'linkedin') => {
    const text = `Join ROOMA and get $50 off your first booking!`;
    let url = '';

    switch (platform) {
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralUrl)}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(referralUrl)}`;
        break;
      case 'linkedin':
        url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralUrl)}`;
        break;
    }

    window.open(url, '_blank', 'width=600,height=400');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-2xl shadow-xl p-8 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Gift className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold">Referral Program</h2>
            <p className="text-white/90 text-lg">Invite friends, earn rewards together!</p>
          </div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
          <p className="text-white/90 mb-4">
            Refer a friend to ROOMA and you'll both get <span className="font-bold text-yellow-300">$50</span> off your next booking!
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-white/70 mb-2">Your Referral Code</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 font-mono text-xl font-bold">
                  {referralCode}
                </div>
                <button
                  onClick={() => copyToClipboard(referralCode, 'Referral code')}
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-colors"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div>
              <p className="text-sm text-white/70 mb-2">Your Referral Link</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 truncate text-sm">
                  {referralUrl}
                </div>
                <button
                  onClick={() => copyToClipboard(referralUrl, 'Referral link')}
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-lg flex items-center justify-center transition-colors"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${stat.bgColor} rounded-xl flex items-center justify-center mb-3 shadow-md`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
              <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Share Options */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Share2 className="w-6 h-6 text-rose-600" />
          <h3 className="text-2xl font-bold text-gray-900">Share & Earn</h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={shareViaEmail}
            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-50 to-cyan-50 hover:from-blue-100 hover:to-cyan-100 rounded-xl transition-all group"
          >
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <Mail className="w-7 h-7 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Email</span>
          </button>

          <button
            onClick={() => shareViaSocial('facebook')}
            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-indigo-50 to-blue-50 hover:from-indigo-100 hover:to-blue-100 rounded-xl transition-all group"
          >
            <div className="w-14 h-14 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <Facebook className="w-7 h-7 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Facebook</span>
          </button>

          <button
            onClick={() => shareViaSocial('twitter')}
            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-sky-50 to-blue-50 hover:from-sky-100 hover:to-blue-100 rounded-xl transition-all group"
          >
            <div className="w-14 h-14 bg-gradient-to-r from-sky-500 to-blue-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <Twitter className="w-7 h-7 text-white" />
            </div>
            <span className="font-semibold text-gray-900">Twitter</span>
          </button>

          <button
            onClick={() => shareViaSocial('linkedin')}
            className="flex flex-col items-center gap-3 p-6 bg-gradient-to-br from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-xl transition-all group"
          >
            <div className="w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
              <Linkedin className="w-7 h-7 text-white" />
            </div>
            <span className="font-semibold text-gray-900">LinkedIn</span>
          </button>
        </div>
      </div>

      {/* Reward Tiers */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Trophy className="w-6 h-6 text-yellow-600" />
          <h3 className="text-2xl font-bold text-gray-900">Reward Tiers</h3>
        </div>

        {/* Current Tier */}
        <div className="bg-gradient-to-r from-yellow-50 via-orange-50 to-rose-50 rounded-xl p-6 mb-6 border-2 border-yellow-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Current Tier</p>
                <p className="text-xl font-bold text-gray-900">{currentTier.label}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Per Referral</p>
              <p className="text-2xl font-bold text-emerald-600">${currentTier.reward}</p>
            </div>
          </div>
          {nextTier && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-gray-600">Progress to {nextTier.label}</span>
                <span className="font-semibold text-gray-900">
                  {completedReferrals}/{nextTier.referrals} referrals
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all"
                  style={{ width: `${(completedReferrals / nextTier.referrals) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* All Tiers */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {rewardTiers.map((tier) => {
            const achieved = completedReferrals >= tier.referrals;
            return (
              <div
                key={tier.referrals}
                className={`p-6 rounded-xl border-2 transition-all ${
                  achieved
                    ? 'bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-300'
                    : 'bg-gray-50 border-gray-200'
                }`}
              >
                {achieved && (
                  <div className="flex justify-end mb-2">
                    <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  </div>
                )}
                <p className="text-sm text-gray-600 mb-1">{tier.referrals} Referrals</p>
                <p className="text-lg font-bold text-gray-900 mb-2">{tier.label}</p>
                <p className="text-2xl font-bold text-emerald-600 mb-1">${tier.reward}</p>
                <p className="text-xs text-gray-600">per referral</p>
                {tier.bonus && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <p className="text-xs text-gray-600">Bonus Reward</p>
                    <p className="text-lg font-bold text-purple-600">+${tier.bonus}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Referral History */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-rose-600" />
            <h3 className="text-2xl font-bold text-gray-900">Referral History</h3>
          </div>
          <span className="text-sm text-gray-600">{referrals.length} total referrals</span>
        </div>

        {referrals.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No referrals yet</p>
            <p className="text-gray-500 text-sm">Start sharing your referral link to earn rewards!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {referrals.map((referral) => (
              <div
                key={referral.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center">
                    <span className="text-lg font-bold text-rose-600">
                      {referral.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{referral.name}</p>
                    <p className="text-sm text-gray-600">{referral.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Joined</p>
                    <p className="text-sm font-semibold text-gray-900">{formatDate(referral.date)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Reward</p>
                    <p className="text-lg font-bold text-emerald-600">${referral.reward}</p>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        referral.status === 'completed'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {referral.status === 'completed' ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 rounded-2xl shadow-xl p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">How It Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Share2 className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">1. Share Your Link</h4>
            <p className="text-gray-600 text-sm">
              Share your unique referral link with friends via email, social media, or messaging
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">2. Friends Sign Up</h4>
            <p className="text-gray-600 text-sm">
              Your friends create an account using your referral link and get $50 off their first booking
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <Gift className="w-8 h-8 text-white" />
            </div>
            <h4 className="font-bold text-gray-900 mb-2">3. Earn Rewards</h4>
            <p className="text-gray-600 text-sm">
              When they complete their first booking, you both earn rewards! The more you refer, the more you earn
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
