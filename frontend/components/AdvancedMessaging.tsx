'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Send,
  Search,
  Image as ImageIcon,
  Paperclip,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Archive,
  Trash2,
  Check,
  CheckCheck,
  Circle,
  MessageCircle
} from 'lucide-react';
import { useMessagesStore } from '@/lib/messages-store';
import { useToast } from '@/lib/toast-context';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  read: boolean;
  hasAttachment?: boolean;
  attachmentType?: 'image' | 'file';
  attachmentUrl?: string;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  participantAvatar?: string;
  propertyId: number;
  propertyTitle: string;
  propertyImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isTyping: boolean;
  messages: Message[];
}

export default function AdvancedMessaging() {
  const toast = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickReplies = [
    'Thank you!',
    'Sounds good',
    'I\'m interested',
    'Can we schedule a viewing?',
    'What are the lease terms?',
  ];

  useEffect(() => {
    // Simulate loading conversations
    const mockConversations: Conversation[] = [
      {
        id: 'conv-1',
        participantId: 'user-1',
        participantName: 'Sarah Johnson',
        participantAvatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=e91e63&color=fff',
        propertyId: 101,
        propertyTitle: 'Modern Studio in Downtown',
        propertyImage: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        lastMessage: 'Great! Looking forward to it.',
        lastMessageTime: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        unreadCount: 2,
        isTyping: false,
        messages: [
          {
            id: 'msg-1',
            senderId: 'user-1',
            senderName: 'Sarah Johnson',
            text: 'Hi! I\'m interested in your studio. Is it still available?',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            read: true,
          },
          {
            id: 'msg-2',
            senderId: 'me',
            senderName: 'You',
            text: 'Yes, it\'s still available! Would you like to schedule a viewing?',
            timestamp: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
            read: true,
          },
          {
            id: 'msg-3',
            senderId: 'user-1',
            senderName: 'Sarah Johnson',
            text: 'That would be great! How about tomorrow afternoon?',
            timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
            read: true,
          },
          {
            id: 'msg-4',
            senderId: 'me',
            senderName: 'You',
            text: 'Perfect! I\'ll send you the details.',
            timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
            read: true,
          },
          {
            id: 'msg-5',
            senderId: 'user-1',
            senderName: 'Sarah Johnson',
            text: 'Great! Looking forward to it.',
            timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            read: false,
          },
        ],
      },
      {
        id: 'conv-2',
        participantId: 'user-2',
        participantName: 'Michael Chen',
        participantAvatar: 'https://ui-avatars.com/api/?name=Michael+Chen&background=3f51b5&color=fff',
        propertyId: 102,
        propertyTitle: 'Cozy 2BR Near Campus',
        propertyImage: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800',
        lastMessage: 'What utilities are included?',
        lastMessageTime: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        unreadCount: 0,
        isTyping: true,
        messages: [
          {
            id: 'msg-6',
            senderId: 'user-2',
            senderName: 'Michael Chen',
            text: 'What utilities are included?',
            timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
            read: true,
          },
        ],
      },
    ];

    setConversations(mockConversations);
    setActiveConversation(mockConversations[0]);
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [activeConversation?.messages]);

  useEffect(() => {
    if (messageText.length > 0) {
      setIsTyping(true);
      const timeout = setTimeout(() => setIsTyping(false), 1000);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
    }
  }, [messageText]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (!messageText.trim() || !activeConversation) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: 'me',
      senderName: 'You',
      text: messageText,
      timestamp: new Date().toISOString(),
      read: false,
    };

    setConversations(conversations.map(conv =>
      conv.id === activeConversation.id
        ? {
            ...conv,
            messages: [...conv.messages, newMessage],
            lastMessage: messageText,
            lastMessageTime: newMessage.timestamp,
          }
        : conv
    ));

    setActiveConversation({
      ...activeConversation,
      messages: [...activeConversation.messages, newMessage],
    });

    setMessageText('');
    toast.success('Message sent');

    // Simulate mark as read after delay
    setTimeout(() => {
      setConversations(prevConvs =>
        prevConvs.map(conv =>
          conv.id === activeConversation.id
            ? {
                ...conv,
                messages: conv.messages.map(msg =>
                  msg.id === newMessage.id ? { ...msg, read: true } : msg
                ),
              }
            : conv
        )
      );
    }, 2000);
  };

  const handleQuickReply = (reply: string) => {
    setMessageText(reply);
  };

  const handleArchiveConversation = (convId: string) => {
    toast.success('Conversation archived');
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.participantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-[calc(100vh-200px)] bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden flex">
      {/* Conversations List */}
      <div className="w-1/3 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            <input
              type="text"
              placeholder="Search messages..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setActiveConversation(conv)}
              className={`w-full p-4 flex gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 ${
                activeConversation?.id === conv.id ? 'bg-rose-50 dark:bg-rose-900/20' : ''
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={conv.participantAvatar}
                  alt={conv.participantName}
                  className="w-12 h-12 rounded-full"
                />
                {conv.isTyping && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800" />
                )}
              </div>
              <div className="flex-1 text-left overflow-hidden">
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate">{conv.participantName}</h4>
                  <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0 ml-2">{formatTime(conv.lastMessageTime)}</span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300 truncate mb-1">{conv.propertyTitle}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {conv.isTyping ? (
                    <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                      <Circle className="w-2 h-2 fill-emerald-600 dark:fill-emerald-400 animate-pulse" />
                      typing...
                    </span>
                  ) : (
                    conv.lastMessage
                  )}
                </p>
              </div>
              {conv.unreadCount > 0 && (
                <div className="w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {conv.unreadCount}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeConversation.participantAvatar}
                alt={activeConversation.participantName}
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{activeConversation.participantName}</h3>
                <p className="text-sm text-gray-600">{activeConversation.propertyTitle}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Phone className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Video className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Info className="w-5 h-5 text-gray-600" />
              </button>
              <div className="relative group">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-2xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                  <button
                    onClick={() => handleArchiveConversation(activeConversation.id)}
                    className="w-full px-4 py-3 hover:bg-gray-50 text-left text-sm text-gray-700 flex items-center gap-2"
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                  <button className="w-full px-4 py-3 hover:bg-red-50 text-left text-sm text-red-600 flex items-center gap-2">
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {activeConversation.messages.map((message) => {
              const isMe = message.senderId === 'me';
              return (
                <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[70%] ${isMe ? 'order-2' : 'order-1'}`}>
                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isMe
                          ? 'bg-gradient-to-r from-rose-500 to-pink-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <div className={`flex items-center gap-1 mt-1 text-xs text-gray-500 ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <span>{formatTime(message.timestamp)}</span>
                      {isMe && (
                        message.read ? (
                          <CheckCheck className="w-4 h-4 text-blue-500" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-2">
              {quickReplies.map((reply, index) => (
                <button
                  key={index}
                  onClick={() => handleQuickReply(reply)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 whitespace-nowrap transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-end gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Paperclip className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <ImageIcon className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 focus-within:ring-2 focus-within:ring-rose-500">
                <textarea
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage();
                    }
                  }}
                  placeholder="Type a message..."
                  rows={1}
                  className="w-full bg-transparent resize-none focus:outline-none text-sm"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Smile className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                className="p-3 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-all shadow-lg hover:shadow-xl"
              >
                <Send className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p>Select a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}
