'use client';

import React from 'react';
import { cn } from '@/app/utils/cn';

export interface MessageProps {
  message: {
    id: string;
    content: string;
    sender: {
      id: string;
      name: string;
      avatar?: string;
      role: 'patient' | 'provider' | 'system';
    };
    timestamp: string;
    status?: 'sent' | 'delivered' | 'read';
    attachments?: Array<{
      id: string;
      name: string;
      type: string;
      size: number;
      url: string;
    }>;
    isNew?: boolean;
  };
  currentUserId: string;
  className?: string;
}

export function Message({ message, currentUserId, className }: MessageProps) {
  const isCurrentUser = message.sender.id === currentUserId;
  const messageTime = new Date(message.timestamp);
  const today = new Date();
  
  // Format the message time based on whether it's today, this year, or earlier
  const formattedTime = messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formattedDate = messageTime.getDate() === today.getDate() && 
                        messageTime.getMonth() === today.getMonth() && 
                        messageTime.getFullYear() === today.getFullYear()
    ? 'Today'
    : messageTime.getFullYear() === today.getFullYear()
      ? messageTime.toLocaleDateString([], { month: 'short', day: 'numeric' })
      : messageTime.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Get appropriate icon for file type
  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return (
        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
      );
    } else if (type.startsWith('application/pdf')) {
      return (
        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      );
    } else if (type.startsWith('application/')) {
      return (
        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      );
    } else {
      return (
        <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
          <polyline points="13 2 13 9 20 9"></polyline>
        </svg>
      );
    }
  };

  return (
    <div className={cn(
      "flex w-full mb-4",
      isCurrentUser ? "justify-end" : "justify-start",
      className
    )}>
      <div className={cn(
        "flex max-w-[80%]",
        isCurrentUser ? "flex-row-reverse" : "flex-row"
      )}>
        {/* Avatar */}
        {!isCurrentUser && (
          <div className="flex-shrink-0 mr-3">
            {message.sender.avatar ? (
              <img 
                src={message.sender.avatar} 
                className="h-9 w-9 rounded-full"
                alt={`${message.sender.name}'s avatar`}
              />
            ) : (
              <div className={cn(
                "h-9 w-9 rounded-full flex items-center justify-center text-white",
                message.sender.role === 'provider' ? "bg-teal-600" : 
                message.sender.role === 'system' ? "bg-gray-500" : "bg-blue-600"
              )}>
                {message.sender.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}
        
        {/* Message content */}
        <div className={cn(
          "flex flex-col",
          isCurrentUser ? "items-end mr-3" : "items-start"
        )}>
          {/* Sender name and time */}
          <div className="flex items-center mb-1 text-xs text-gray-500">
            {!isCurrentUser && (
              <span className="font-medium mr-2">
                {message.sender.role === 'provider' ? `Dr. ${message.sender.name}` : message.sender.name}
              </span>
            )}
            <span>{formattedDate} {formattedTime}</span>
            {isCurrentUser && message.status && (
              <span className="ml-2">
                {message.status === 'sent' && (
                  <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
                {message.status === 'delivered' && (
                  <svg className="w-3 h-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
                {message.status === 'read' && (
                  <svg className="w-3 h-3 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6L7 17l-5-5"></path>
                    <path d="M22 10L13 19l-3-3"></path>
                  </svg>
                )}
              </span>
            )}
          </div>
          
          {/* Message bubble */}
          <div className={cn(
            "rounded-lg py-2 px-4 max-w-full break-words",
            isCurrentUser 
              ? "bg-teal-600 text-white rounded-tr-none"
              : message.sender.role === 'system'
                ? "bg-gray-200 text-gray-800 rounded-tl-none"
                : "bg-white border border-gray-200 shadow-sm text-gray-800 rounded-tl-none"
          )}>
            <p className="whitespace-pre-wrap">{message.content}</p>
            
            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map(attachment => (
                  <a 
                    key={attachment.id}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(
                      "flex items-center p-2 rounded",
                      isCurrentUser 
                        ? "bg-teal-500 hover:bg-teal-400" 
                        : "bg-gray-100 hover:bg-gray-200"
                    )}
                  >
                    <div className={cn(
                      "flex-shrink-0 mr-2",
                      isCurrentUser ? "text-white" : "text-gray-600"
                    )}>
                      {getFileIcon(attachment.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn(
                        "text-sm font-medium truncate",
                        isCurrentUser ? "text-white" : "text-gray-900"
                      )}>
                        {attachment.name}
                      </p>
                      <p className={cn(
                        "text-xs truncate",
                        isCurrentUser ? "text-teal-100" : "text-gray-500"
                      )}>
                        {formatFileSize(attachment.size)}
                      </p>
                    </div>
                    <div className={cn(
                      "flex-shrink-0 ml-2",
                      isCurrentUser ? "text-white" : "text-gray-600"
                    )}>
                      <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                      </svg>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
          
          {/* New message indicator */}
          {message.isNew && !isCurrentUser && (
            <div className="mt-1 text-xs font-medium text-blue-600">New message</div>
          )}
        </div>
        
        {/* Avatar for current user */}
        {isCurrentUser && (
          <div className="flex-shrink-0 ml-3">
            {message.sender.avatar ? (
              <img 
                src={message.sender.avatar} 
                className="h-9 w-9 rounded-full"
                alt="Your avatar"
              />
            ) : (
              <div className="h-9 w-9 rounded-full bg-blue-600 flex items-center justify-center text-white">
                {message.sender.name.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 