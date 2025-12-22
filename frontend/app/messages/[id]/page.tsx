'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { useMessagesStore, type Message } from '@/lib/messages-store';
import { ArrowLeft, Send } from 'lucide-react';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const { conversations, messages, loadMessages, sendMessage, markAsRead, getConversationMessages } = useMessagesStore();

  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const conversationId = params.id as string;

  useEffect(() => {
    if (!isAuthenticated) {
      alert('Please log in to view messages');
      router.push('/auth/login');
      return;
    }
    loadMessages();
  }, [isAuthenticated, router, loadMessages]);

  useEffect(() => {
    if (conversationId && user) {
      const conv = conversations.find(c => c.id === conversationId);
      setConversation(conv);

      const msgs = getConversationMessages(conversationId);
      setConversationMessages(msgs);
    }
  }, [conversationId, user, conversations, messages, getConversationMessages]);

  // Mark as read only once when conversation loads
  useEffect(() => {
    if (conversationId && user) {
      markAsRead(conversationId, user.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId, user?.id]);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newMessage.trim() || !user || !conversation) return;

    const receiverId = conversation.participant1Id === user.id
      ? conversation.participant2Id
      : conversation.participant1Id;

    sendMessage({
      conversationId,
      senderId: user.id,
      receiverId,
      propertyId: conversation.propertyId,
      content: newMessage.trim(),
    });

    setNewMessage('');
  };

  const getOtherParticipant = () => {
    if (!user || !conversation) return { name: '', initials: '' };

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

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  if (!isAuthenticated) {
    return null;
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Conversation not found</h3>
          <Link
            href="/messages"
            className="inline-block bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl px-6 py-3 transition-all shadow-lg hover:shadow-xl font-semibold mt-4"
          >
            Back to Messages
          </Link>
        </div>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-6">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <Link
                href="/messages"
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>

              <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <img
                  src={conversation.propertyImage}
                  alt={conversation.propertyTitle}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-rose-400 to-pink-500 flex items-center justify-center text-white font-bold text-xs">
                    {otherParticipant.initials}
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">{otherParticipant.name}</h2>
                </div>
                <p className="text-sm text-gray-600">{conversation.propertyTitle}</p>
              </div>

              <Link
                href={`/properties/${conversation.propertyId}`}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl transition font-semibold text-sm"
              >
                View Property
              </Link>
            </div>
          </div>

          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 bg-gray-50">
            {conversationMessages.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversationMessages.map((message) => {
                  const isOwnMessage = message.senderId === user?.id;
                  return (
                    <div
                      key={message.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-md rounded-2xl px-4 py-3 ${
                          isOwnMessage
                            ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                            : 'bg-white text-gray-900 shadow-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwnMessage ? 'text-rose-100' : 'text-gray-500'
                          }`}
                        >
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-transparent outline-none text-black placeholder:text-gray-900"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-6 py-3 bg-gradient-to-r from-rose-500 via-pink-500 to-purple-600 hover:from-rose-600 hover:via-pink-600 hover:to-purple-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
