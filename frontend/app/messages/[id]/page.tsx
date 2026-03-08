'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuthStore } from '@/lib/auth-store';
import { useMessagesStore, type Message, type Conversation } from '@/lib/messages-store';
import { useWebSocket } from '@/lib/websocket-context';
import { useToast } from '@/lib/toast-context';
import { ArrowLeft, Send, MessageCircle, Circle } from 'lucide-react';

export default function ConversationPage() {
  const params = useParams();
  const router = useRouter();
  const toast = useToast();
  const { user, isAuthenticated, loadUser } = useAuthStore();
  const { conversations, messages, loadMessages, sendMessage: sendLocalMessage, markAsRead, getConversationMessages } = useMessagesStore();
  const ws = useWebSocket();

  const [conversationMessages, setConversationMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const hasRedirectedRef = useRef(false);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const messageTemplates = [
    "Hi! I'm interested in this property. Is it still available?",
    "Can we schedule a viewing?",
    "What utilities are included in the rent?",
    "Is the move-in date flexible?",
    "Thanks for the quick response!",
    "I'd like to move forward with booking this property."
  ];

  const conversationId = params.id as string;

  useEffect(() => {
    let isMounted = true;
    const checkAuth = async () => {
      if (isAuthenticated && user) {
        if (isMounted) setIsCheckingAuth(false);
        return;
      }
      await loadUser();
      if (isMounted) {
        setIsCheckingAuth(false);
      }
    };

    void checkAuth();

    return () => {
      isMounted = false;
    };
  }, [isAuthenticated, user, loadUser]);

  useEffect(() => {
    if (!isCheckingAuth && !isAuthenticated && !hasRedirectedRef.current) {
      hasRedirectedRef.current = true;
      toast.warning('Please log in to view messages');
      router.replace('/auth/login');
      return;
    }
    if (isCheckingAuth || !isAuthenticated) {
      return;
    }
    loadMessages();
  }, [isAuthenticated, isCheckingAuth, router, loadMessages, toast]);

  useEffect(() => {
    if (conversationId && user) {
      const conv = conversations.find(c => c.id === conversationId);
      setConversation(conv ?? null);

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

  // Join/leave WebSocket room and listen for real-time messages
  useEffect(() => {
    if (!conversationId || !ws.isConnected) return;

    ws.joinConversation(conversationId);

    const unsubscribe = ws.onMessageReceived((convId, message) => {
      if (convId === conversationId && message.senderId !== user?.id) {
        const newMsg: Message = {
          id: message.id || `ws_${Date.now()}`,
          conversationId: convId,
          senderId: message.senderId || message.sender_id,
          receiverId: message.receiverId || message.receiver_id || user?.id || '',
          propertyId: message.propertyId || message.property_id || conversation?.propertyId || '',
          content: message.content || message.message,
          timestamp: message.timestamp || message.created_at || new Date().toISOString(),
          read: false,
        };
        setConversationMessages((prev) => [...prev, newMsg]);
      }
    });

    return () => {
      ws.leaveConversation(conversationId);
      unsubscribe();
    };
  }, [conversationId, ws.isConnected]); // eslint-disable-line react-hooks/exhaustive-deps

  // Track typing status from other user
  useEffect(() => {
    setIsTyping(!!ws.typingUsers[conversationId]);
  }, [ws.typingUsers, conversationId]);

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

    const content = newMessage.trim();

    // Save locally
    sendLocalMessage({
      conversationId,
      senderId: user.id,
      receiverId,
      propertyId: conversation.propertyId,
      content,
    });

    // Send via WebSocket for real-time delivery
    if (ws.isConnected) {
      ws.sendMessage(conversationId, content);
      ws.setTyping(conversationId, false);
    }

    setNewMessage('');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    // Send typing indicator
    if (ws.isConnected && e.target.value.trim()) {
      ws.setTyping(conversationId, true);

      // Clear previous timeout
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

      // Stop typing after 2 seconds of no input
      typingTimeoutRef.current = setTimeout(() => {
        ws.setTyping(conversationId, false);
      }, 2000);
    } else if (ws.isConnected) {
      ws.setTyping(conversationId, false);
    }
  };

  const handleTemplateSelect = (template: string) => {
    setNewMessage(template);
    setShowTemplates(false);
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

  if (isCheckingAuth || !isAuthenticated) {
    return null;
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Conversation not found</h3>
          <Link
            href="/messages"
            className="inline-block bg-gradient-to-r from-teal-500 via-teal-500 to-teal-600 hover:from-teal-600 hover:via-teal-600 hover:to-teal-700 text-white rounded-xl px-6 py-3 transition-all shadow-lg hover:shadow-xl font-semibold mt-4"
          >
            Back to Messages
          </Link>
        </div>
      </div>
    );
  }

  const otherParticipant = getOtherParticipant();
  const otherParticipantId = conversation.participant1Id === user?.id
    ? conversation.participant2Id
    : conversation.participant1Id;

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-teal-50 to-teal-50">
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
                  <div className="relative w-8 h-8 rounded-full bg-gradient-to-r from-teal-400 to-teal-500 flex items-center justify-center text-white font-bold text-xs">
                    {otherParticipant.initials}
                    {ws.onlineUsers.has(otherParticipantId) && (
                      <Circle className="absolute -bottom-0.5 -right-0.5 w-3 h-3 text-emerald-500 fill-emerald-500" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">{otherParticipant.name}</h2>
                    <span className="text-xs text-gray-500">
                      {ws.onlineUsers.has(otherParticipantId) ? 'Online' : 'Offline'}
                    </span>
                  </div>
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
                            ? 'bg-gradient-to-r from-teal-500 to-teal-600 text-white'
                            : 'bg-white text-gray-900 shadow-sm'
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            isOwnMessage ? 'text-teal-100' : 'text-gray-500'
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

          {/* Typing indicator */}
          {isTyping && (
            <div className="px-6 py-2 text-sm text-gray-500 italic">
              {otherParticipant.name} is typing...
            </div>
          )}

          {/* Input Area */}
          <div className="p-6 border-t border-gray-200">
            {/* Quick Templates */}
            <div className="mb-4">
              <button
                type="button"
                onClick={() => setShowTemplates(!showTemplates)}
                className="text-sm text-teal-600 hover:text-teal-700 font-semibold flex items-center gap-2 mb-3"
              >
                <MessageCircle className="w-4 h-4" />
                {showTemplates ? 'Hide' : 'Show'} Quick Templates
              </button>

              {showTemplates && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                  {messageTemplates.map((template, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => handleTemplateSelect(template)}
                      className="px-4 py-2 bg-teal-50 hover:bg-teal-100 text-teal-700 rounded-lg text-sm text-left transition-colors border border-teal-200"
                    >
                      {template}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="flex gap-3">
              <input
                type="text"
                value={newMessage}
                onChange={handleInputChange}
                placeholder="Type a message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-transparent outline-none text-black placeholder:text-gray-900"
              />
              <button
                type="submit"
                disabled={!newMessage.trim()}
                className="px-6 py-3 bg-gradient-to-r from-teal-500 via-teal-500 to-teal-600 hover:from-teal-600 hover:via-teal-600 hover:to-teal-700 text-white rounded-xl transition-all shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
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
