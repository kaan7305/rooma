'use client';

import { X, Copy, Check, Facebook, Twitter, Mail, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/lib/toast-context';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  image?: string;
}

export default function ShareModal({ isOpen, onClose, title, url, image }: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  const toast = useToast();

  if (!isOpen) return null;

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}${url}` : url;
  const shareText = `Check out this amazing property: ${title}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const shareOptions = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => {
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank',
          'width=600,height=400'
        );
      },
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'bg-sky-500 hover:bg-sky-600',
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
          '_blank',
          'width=600,height=400'
        );
      },
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-600 hover:bg-green-700',
      action: () => {
        window.open(
          `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
          '_blank'
        );
      },
    },
    {
      name: 'Email',
      icon: Mail,
      color: 'bg-gray-600 hover:bg-gray-700',
      action: () => {
        window.location.href = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;
      },
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Share Property</h2>
              <p className="text-sm text-gray-600 mt-1">Share this listing with your friends</p>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 hover:bg-gray-100 rounded-xl flex items-center justify-center transition"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Property Preview */}
          {image && (
            <div className="flex gap-3 p-3 bg-gray-50 rounded-xl border border-gray-200">
              <img
                src={image}
                alt={title}
                className="w-16 h-16 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{title}</h3>
                <p className="text-xs text-gray-500 mt-1">{shareUrl.replace('http://', '').replace('https://', '').substring(0, 40)}...</p>
              </div>
            </div>
          )}

          {/* Share Options */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Share via</p>
            <div className="grid grid-cols-2 gap-3">
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.name}
                    onClick={option.action}
                    className={`flex items-center justify-center gap-2 px-4 py-3 ${option.color} text-white rounded-xl transition-all shadow-md hover:shadow-lg font-semibold`}
                  >
                    <Icon className="w-5 h-5" />
                    {option.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Copy Link */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">Or copy link</p>
            <div className="flex gap-2">
              <div className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-xl text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">
                {shareUrl}
              </div>
              <button
                onClick={handleCopyLink}
                className={`px-4 py-3 rounded-xl font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-2 ${
                  copied
                    ? 'bg-emerald-500 text-white'
                    : 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-5 h-5" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-5 h-5" />
                    Copy
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
