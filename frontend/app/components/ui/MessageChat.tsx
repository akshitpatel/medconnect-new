'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/app/utils/cn';

interface Participant {
  id: string;
  name: string;
  role: 'patient' | 'provider' | 'system';
  specialty?: string;
  status?: 'online' | 'offline' | 'busy';
}

export interface MessageAttachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
}

export interface MessageData {
  id: string;
  content: string;
  sender: Participant;
  timestamp: string;
  status?: 'sent' | 'delivered' | 'read';
  attachments?: MessageAttachment[];
  isNew?: boolean;
}

interface MessageChatProps {
  messages: MessageData[];
  participant: Participant;
  currentUserId: string;
  onSendMessage: (content: string, attachments: File[]) => void;
  className?: string;
}

export default function MessageChat({
  messages,
  participant,
  currentUserId,
  onSendMessage,
  className = '',
}: MessageChatProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Format the date for display
  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format the date for message groups
  const formatMessageDay = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
    }
  };

  // Group messages by date for display purposes
  const groupMessagesByDate = () => {
    const groups: { date: string; messages: MessageData[] }[] = [];
    let currentDate = '';

    messages.forEach(message => {
      const messageDate = new Date(message.timestamp).toDateString();
      
      if (messageDate !== currentDate) {
        currentDate = messageDate;
        groups.push({
          date: message.timestamp,
          messages: [message]
        });
      } else {
        groups[groups.length - 1].messages.push(message);
      }
    });

    return groups;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      onSendMessage(newMessage, attachments);
      setNewMessage('');
      setAttachments([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleAttachmentClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const messageGroups = groupMessagesByDate();

  return (
    <div className={cn("flex flex-col h-full bg-white rounded-lg border border-gray-200 shadow-sm", className)}>
      {/* Chat header */}
      <div className="p-4 border-b flex items-center justify-between bg-white rounded-t-lg">
        <div className="flex items-center">
          <div className="relative">
            <div className="h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold text-lg">
              {participant.name.charAt(0)}
            </div>
            <span 
              className={cn(
                "absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-white",
                participant.status === 'online' ? 'bg-green-500' : 
                participant.status === 'busy' ? 'bg-amber-500' : 'bg-gray-400'
              )}
            ></span>
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-gray-900">
              {participant.role === 'provider' ? `Dr. ${participant.name}` : participant.name}
            </h3>
            <p className="text-sm text-gray-500">{participant.specialty || participant.role}</p>
          </div>
        </div>
        <div className={cn(
          "px-2.5 py-1 rounded-full text-xs font-medium",
          participant.status === 'online' ? 'bg-green-100 text-green-800' : 
          participant.status === 'busy' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-800'
        )}>
          {participant.status?.charAt(0).toUpperCase()}{participant.status?.slice(1)}
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {messageGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="mb-6">
            <div className="flex justify-center mb-4">
              <span className="text-xs bg-gray-200 text-gray-600 px-3 py-1 rounded-full">
                {formatMessageDay(group.date)}
              </span>
            </div>
            {group.messages.map((message, index) => {
              const isCurrentUser = message.sender.id === currentUserId;
              const showAvatar = index === 0 || 
                group.messages[index - 1].sender.id !== message.sender.id;
              
              return (
                <div key={message.id} 
                  className={cn("flex mb-4", isCurrentUser ? 'justify-end' : 'justify-start')}
                >
                  {!isCurrentUser && showAvatar && (
                    <div className={cn(
                      "h-8 w-8 rounded-full flex-shrink-0 flex items-center justify-center font-semibold",
                      message.sender.role === 'provider' ? "bg-teal-100 text-teal-600" : 
                      "bg-gray-100 text-gray-600"
                    )}>
                      {message.sender.name.charAt(0)}
                    </div>
                  )}
                  <div 
                    className={cn(
                      "max-w-[75%]",
                      isCurrentUser ? 'ml-2' : 'mr-2',
                      !isCurrentUser && !showAvatar ? 'ml-10' : ''
                    )}
                  >
                    <div 
                      className={cn(
                        "p-3 rounded-lg", 
                        isCurrentUser 
                          ? 'bg-teal-600 text-white rounded-br-none' 
                          : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm',
                        message.isNew ? 'animate-pulse' : ''
                      )}
                    >
                      {message.content}
                      {message.attachments && message.attachments.length > 0 && (
                        <div className="mt-2 space-y-2">
                          {message.attachments.map(attachment => (
                            <div 
                              key={attachment.id}
                              className="flex items-center p-2 bg-gray-100 rounded text-sm"
                            >
                              <svg className="w-4 h-4 mr-2 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
                              </svg>
                              <span className="text-teal-600 font-medium">{attachment.name}</span>
                              <span className="ml-2 text-gray-500">
                                {Math.round(attachment.size / 1024)} KB
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    <div 
                      className={cn(
                        "text-xs text-gray-500 mt-1 flex",
                        isCurrentUser ? 'justify-end' : 'justify-start'
                      )}
                    >
                      {formatMessageDate(message.timestamp)}
                      {isCurrentUser && message.status && (
                        <span className="ml-2">
                          {message.status === 'sent' && '✓'}
                          {message.status === 'delivered' && '✓✓'}
                          {message.status === 'read' && (
                            <span className="text-teal-500">✓✓</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Typing indicator */}
      {isTyping && (
        <div className="px-4 py-2 text-sm text-gray-500">
          {participant.role === 'provider' ? `Dr. ${participant.name}` : participant.name} is typing...
        </div>
      )}

      {/* Message input */}
      <div className="border-t bg-white p-4 rounded-b-lg">
        {attachments.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {attachments.map((file, index) => (
              <div key={index} className="flex items-center bg-gray-100 rounded-md px-3 py-1.5">
                <span className="text-sm truncate max-w-[150px] text-gray-700">{file.name}</span>
                <button 
                  type="button"
                  className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setAttachments(attachments.filter((_, i) => i !== index))}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex items-end">
          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message..."
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 resize-none shadow-sm"
              rows={2}
            />
          </div>
          <div className="flex ml-2">
            <button
              type="button"
              className="p-2 text-gray-500 hover:text-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 rounded-md"
              onClick={handleAttachmentClick}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"></path>
              </svg>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
            </button>
            <button
              type="submit"
              className="ml-2 bg-teal-600 text-white p-2 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!newMessage.trim()}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M12 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 