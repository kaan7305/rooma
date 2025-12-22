'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { useMessagesStore, type Conversation } from '@/lib/messages-store';
import { MessageCircle } from 'lucide-react';

export default function MessagesPage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { conversations, loadMessages, getUserConversations } = useMessagesStore();

  const [userConversations, setUserConversations] = useState<Conversation[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      alert('Please log in to view messages');
      router.push('/auth/login');
      return;
    }
    loadMessages();
  }, [isAuthenticated, router, loadMessages]);

  useEffect(() => {
    if (user) {
      const convs = getUserConversations(user.id);
      setUserConversations(convs);
    }
  }, [user, conversations, getUserConversations]);

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getOtherParticipant = (conversation: Conversation) => {
    if (!user) return { name: '', initials: '' };

    if (conversation.participant1Id === user.id) {
      return {
        name: conversation.participant2Name,
        initials: conversation.participant2Initials,
      };
    }
    return {
      name: conversation.participant1Name,
      initials: conversation.participant1Initials,
    };
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Messages
          </h1>
          <p className="text-gray-600">Chat with hosts and guests</p>
        </div>

        {userConversations.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gradient-to-br from-rose-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <MessageCircle className="w-10 h-10 text-rose-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No messages yet</h3>
            <p className="text-gray-600 mb-6">Start a conversation by contacting a host</p>
            <Link
              href="/search"
              className="inline-block bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 transition-all shadow-lg hover:shadow-xl font-semibold"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <div className="divide-y divide-gray-200">
              {userConversations.map((conversation) => {
                const otherParticipant = getOtherParticipant(conversation);
                return (
                  <Link
                    key={conversation.id}
                    href={`/messages/${conversation.id}`}
                    className="flex items-center gap-4 p-6 hover:bg-gray-50 transition-colors"
                  >
                    {/* Property Image */}
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={conversation.propertyImage}
                        alt={conversation.propertyTitle}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Message Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-1">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-sm">
                            {otherParticipant.initials}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{otherParticipant.name}</h3>
                            <p className="text-sm text-gray-600 truncate">{conversation.propertyTitle}</p>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-4">
                          <p className="text-xs text-gray-500 mb-1">
                            {formatTime(conversation.lastMessageTime)}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="inline-block bg-rose-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      {conversation.lastMessage && (
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
