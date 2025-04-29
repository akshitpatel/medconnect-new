'use client';

import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/app/utils/cn';

interface Participant {
  id: string;
  name: string;
  role: 'patient' | 'provider' | 'system';
  specialty?: string;
  status?: 'online' | 'offline' | 'busy';
}

interface ConversationData {
  id: string;
  participant: Participant;
  lastMessage: {
    content: string;
    timestamp: string;
    senderId: string;
    isRead: boolean;
  };
  unreadCount: number;
}

interface MessageListProps {
  conversations: ConversationData[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  className?: string;
}

export function MessageList({
  conversations,
  activeConversationId,
  onSelectConversation,
  className = '',
}: MessageListProps) {
  // Helper function to format relative time
  const formatRelativeTime = (timestamp: string) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch (error) {
      return 'recently';
    }
  };

  return (
    <div className={cn("flex flex-col h-full bg-white border border-gray-200 rounded-lg shadow-sm", className)}>
      <div className="p-4 border-b bg-white rounded-t-lg">
        <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
      </div>
      
      {conversations.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 p-6 text-gray-500">
          <svg className="w-16 h-16 mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          <p className="text-center text-gray-600 font-medium mb-2">No conversations yet</p>
          <p className="text-center text-gray-500 text-sm">
            Your secure messages with healthcare providers will appear here
          </p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto divide-y divide-gray-100">
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className={cn(
                "p-4 hover:bg-gray-50 cursor-pointer transition-colors",
                activeConversationId === conversation.id ? 'bg-teal-50 border-l-2 border-teal-600' : ''
              )}
              onClick={() => onSelectConversation(conversation.id)}
            >
              <div className="flex items-start">
                <div className="relative mr-3 flex-shrink-0">
                  <div className={cn(
                    "h-10 w-10 rounded-full flex items-center justify-center text-lg font-semibold",
                    conversation.participant.role === 'provider' 
                      ? "bg-teal-100 text-teal-600" 
                      : "bg-gray-100 text-gray-600"
                  )}>
                    {conversation.participant.name.charAt(0)}
                  </div>
                  <span 
                    className={cn(
                      "absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-white",
                      conversation.participant.status === 'online' ? 'bg-green-500' : 
                      conversation.participant.status === 'busy' ? 'bg-amber-500' : 'bg-gray-400'
                    )}
                  ></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {conversation.participant.role === 'provider' 
                        ? `Dr. ${conversation.participant.name}` 
                        : conversation.participant.name}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(conversation.lastMessage.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-1">
                    {conversation.participant.specialty || conversation.participant.role}
                  </p>
                  <p className={cn(
                    "text-sm truncate",
                    conversation.unreadCount > 0 && conversation.lastMessage.senderId !== 'patient-1' 
                      ? 'font-semibold text-gray-900' 
                      : 'text-gray-500'
                  )}>
                    {conversation.lastMessage.content}
                  </p>
                </div>
                {conversation.unreadCount > 0 && (
                  <div className="ml-2 bg-teal-600 text-white text-xs font-semibold rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                    {conversation.unreadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="p-4 border-t mt-auto">
        <button 
          className="w-full py-2.5 px-4 rounded-md bg-teal-600 text-white flex items-center justify-center hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-colors text-sm font-medium shadow-sm"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          New Conversation
        </button>
      </div>
    </div>
  );
} 