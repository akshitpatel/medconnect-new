'use client';

import React, { useState, useRef, useEffect } from 'react';
import { 
  FaSearch, 
  FaPaperPlane, 
  FaPaperclip, 
  FaSmile, 
  FaVideo,
  FaPhone,
  FaEllipsisH,
  FaCircle,
  FaImage,
  FaFile,
  FaSpinner
} from 'react-icons/fa';

// Mock conversation data
const MOCK_CONVERSATIONS = [
  {
    id: '1',
    patient: {
      id: '1001',
      name: 'Sarah Johnson',
      avatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      online: true
    },
    lastMessage: {
      text: 'How long should I take the new medication?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      isRead: true,
      sender: 'patient'
    },
    unreadCount: 0
  },
  {
    id: '2',
    patient: {
      id: '1002',
      name: 'Michael Chen',
      avatar: 'https://randomuser.me/api/portraits/men/59.jpg',
      online: false
    },
    lastMessage: {
      text: 'Your test results are ready, everything looks good!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      isRead: false,
      sender: 'provider'
    },
    unreadCount: 0
  },
  {
    id: '3',
    patient: {
      id: '1003',
      name: 'Emily Rodriguez',
      avatar: 'https://randomuser.me/api/portraits/women/17.jpg',
      online: true
    },
    lastMessage: {
      text: 'I have a question about the side effects we discussed',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hours ago
      isRead: false,
      sender: 'patient'
    },
    unreadCount: 1
  },
  {
    id: '4',
    patient: {
      id: '1004',
      name: 'James Wilson',
      avatar: 'https://randomuser.me/api/portraits/men/22.jpg',
      online: false
    },
    lastMessage: {
      text: 'Thank you for the prescription. I will follow up next week.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      isRead: true,
      sender: 'patient'
    },
    unreadCount: 0
  },
  {
    id: '5',
    patient: {
      id: '1005',
      name: 'Olivia Taylor',
      avatar: 'https://randomuser.me/api/portraits/women/32.jpg',
      online: false
    },
    lastMessage: {
      text: 'Please let me know if your symptoms improve with the new dosage',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
      isRead: true,
      sender: 'provider'
    },
    unreadCount: 0
  }
];

// Define the message template interface
interface MessageTemplate {
  id: string;
  text: string;
  timestamp: Date;
  sender: string;
  senderName: string;
  senderAvatar: string;
  isRead: boolean;
}

// Define a proper type for the MOCK_MESSAGES lookup object
interface MessagesByConversation {
  [conversationId: string]: MessageTemplate[];
}

// Then update the MOCK_MESSAGES definition
const MOCK_MESSAGES: MessagesByConversation = {
  '1': [
    {
      id: '101',
      text: 'Good morning Dr. Smith, I had a question about the medication you prescribed yesterday.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      sender: 'patient',
      senderName: 'Sarah Johnson',
      senderAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      isRead: true
    },
    {
      id: '102',
      text: 'Of course, Sarah. What would you like to know?',
      timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
      sender: 'provider',
      senderName: 'Dr. Smith',
      senderAvatar: 'https://randomuser.me/api/portraits/men/41.jpg',
      isRead: true
    },
    {
      id: '103',
      text: 'Should I take it with food or on an empty stomach?',
      timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
      sender: 'patient',
      senderName: 'Sarah Johnson',
      senderAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      isRead: true
    },
    {
      id: '104',
      text: "It's best to take it with food to minimize stomach irritation. A light meal or snack should be sufficient.",
      timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      sender: 'provider',
      senderName: 'Dr. Smith',
      senderAvatar: 'https://randomuser.me/api/portraits/men/41.jpg',
      isRead: true
    },
    {
      id: '105',
      text: 'Thank you! Also, how long should I expect to take this medication?',
      timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
      sender: 'patient',
      senderName: 'Sarah Johnson',
      senderAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      isRead: true
    },
    {
      id: '106',
      text: 'How long should I take the new medication?',
      timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
      sender: 'patient',
      senderName: 'Sarah Johnson',
      senderAvatar: 'https://randomuser.me/api/portraits/women/42.jpg',
      isRead: true
    }
  ]
};

export default function MessagesPage() {
  const [conversations, setConversations] = useState<typeof MOCK_CONVERSATIONS>([]);
  const [activeConversation, setActiveConversation] = useState<(typeof MOCK_CONVERSATIONS)[0] | null>(null);
  const [messages, setMessages] = useState<typeof MOCK_MESSAGES['1']>([]);
  const [loading, setLoading] = useState(true);
  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Simulate loading conversations
    const loadData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setConversations(MOCK_CONVERSATIONS);
        // Set the first conversation as active by default
        if (MOCK_CONVERSATIONS.length > 0) {
          setActiveConversation(MOCK_CONVERSATIONS[0]);
          const conversationId = MOCK_CONVERSATIONS[0].id;
          setMessages(MOCK_MESSAGES[conversationId] || []);
        }
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  useEffect(() => {
    // Scroll to the bottom of the messages
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageText.trim() || !activeConversation) return;
    
    const newMessage = {
      id: `msg_${Date.now()}`,
      text: messageText,
      timestamp: new Date(),
      sender: 'provider',
      senderName: 'Dr. Smith',
      senderAvatar: 'https://randomuser.me/api/portraits/men/41.jpg',
      isRead: false
    };
    
    // Add message to current conversation
    setMessages(prev => [...prev, newMessage]);
    
    // Update the conversation list with the new message
    setConversations(prev => 
      prev.map(conv => 
        conv.id === activeConversation.id
          ? {
              ...conv,
              lastMessage: {
                text: messageText,
                timestamp: new Date(),
                isRead: false,
                sender: 'provider'
              }
            }
          : conv
      )
    );
    
    // Clear the input
    setMessageText('');
  };
  
  const handleConversationSelect = (conversation: typeof MOCK_CONVERSATIONS[0]) => {
    setActiveConversation(conversation);
    // Load messages for this conversation
    const conversationId = conversation.id;
    setMessages(MOCK_MESSAGES[conversationId] || []);
    
    // Mark as read if there are unread messages
    if (conversation.unreadCount > 0) {
      setConversations(prev => 
        prev.map(conv => 
          conv.id === conversation.id
            ? { ...conv, unreadCount: 0 }
            : conv
        )
      );
    }
  };
  
  // Filter conversations based on search term
  const filteredConversations = conversations.filter(conversation => 
    conversation.patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatMessageTime = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      // Today - show time
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffDays === 1) {
      // Yesterday
      return 'Yesterday';
    } else if (diffDays < 7) {
      // This week - show day name
      return date.toLocaleDateString([], { weekday: 'short' });
    } else {
      // Older - show date
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };
  
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="h-screen flex overflow-hidden">
        {/* Left sidebar - Conversation list */}
        <div className="w-full sm:w-80 md:w-96 bg-white border-r border-neutral-200 flex flex-col">
          <div className="p-4 border-b border-neutral-200">
            <h1 className="text-xl font-bold text-neutral-800 mb-4">Messages</h1>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="h-4 w-4 text-neutral-400" />
              </div>
              <input
                type="text"
                className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-neutral-300 rounded-md"
                placeholder="Search patients"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div className="overflow-y-auto flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <FaSpinner className="animate-spin text-primary-600 text-2xl" />
              </div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center p-6 text-neutral-500">
                No conversations found
              </div>
            ) : (
              <ul className="divide-y divide-neutral-200">
                {filteredConversations.map((conversation) => (
                  <li 
                    key={conversation.id}
                    className={`hover:bg-neutral-50 cursor-pointer ${
                      activeConversation?.id === conversation.id ? 'bg-neutral-100' : ''
                    }`}
                    onClick={() => handleConversationSelect(conversation)}
                  >
                    <div className="px-4 py-3 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center min-w-0">
                          <div className="relative flex-shrink-0">
                            <img 
                              className="h-12 w-12 rounded-full object-cover" 
                              src={conversation.patient.avatar} 
                              alt={conversation.patient.name} 
                            />
                            {conversation.patient.online && (
                              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-400 ring-2 ring-white" />
                            )}
                          </div>
                          <div className="ml-4 min-w-0">
                            <p className="text-sm font-medium text-neutral-900 truncate">
                              {conversation.patient.name}
                            </p>
                            <p 
                              className={`text-sm truncate ${
                                conversation.lastMessage.sender === 'patient' && conversation.unreadCount > 0
                                  ? 'font-semibold text-neutral-900'
                                  : 'text-neutral-500'
                              }`}
                            >
                              {conversation.lastMessage.sender === 'provider' && 'You: '}
                              {conversation.lastMessage.text}
                            </p>
                          </div>
                        </div>
                        <div className="ml-2 flex flex-col items-end">
                          <p className="text-xs text-neutral-500">
                            {formatMessageTime(conversation.lastMessage.timestamp)}
                          </p>
                          {conversation.unreadCount > 0 && (
                            <span className="inline-flex items-center justify-center px-2 py-1 mt-1 text-xs font-bold leading-none text-white bg-primary-600 rounded-full">
                              {conversation.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        {/* Right side - Message thread */}
        {activeConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat header */}
            <div className="px-6 py-3 border-b border-neutral-200 bg-white flex items-center justify-between">
              <div className="flex items-center">
                <div className="relative">
                  <img 
                    className="h-10 w-10 rounded-full object-cover" 
                    src={activeConversation.patient.avatar} 
                    alt={activeConversation.patient.name} 
                  />
                  {activeConversation.patient.online && (
                    <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-white" />
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-neutral-900">
                    {activeConversation.patient.name}
                  </p>
                  <p className="text-xs text-neutral-500 flex items-center">
                    {activeConversation.patient.online ? (
                      <>
                        <FaCircle className="h-2 w-2 text-green-400 mr-1" />
                        Online
                      </>
                    ) : (
                      'Offline'
                    )}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <button 
                  className="p-2 rounded-full text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                  title="Audio call"
                >
                  <FaPhone />
                </button>
                <button 
                  className="p-2 rounded-full text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                  title="Video call"
                >
                  <FaVideo />
                </button>
                <button 
                  className="p-2 rounded-full text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100"
                  title="More options"
                >
                  <FaEllipsisH />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 bg-neutral-50">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id}
                    className={`flex ${message.sender === 'provider' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className="flex max-w-xs md:max-w-md lg:max-w-lg">
                      {message.sender === 'patient' && (
                        <img 
                          className="h-10 w-10 rounded-full object-cover mr-3 mt-1"
                          src={message.senderAvatar}
                          alt={message.senderName}
                        />
                      )}
                      <div>
                        <div 
                          className={`rounded-lg px-4 py-2 shadow-sm ${
                            message.sender === 'provider'
                              ? 'bg-primary-600 text-white'
                              : 'bg-white text-neutral-800'
                          }`}
                        >
                          <p className="text-sm">{message.text}</p>
                        </div>
                        <p className="text-xs text-neutral-500 mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      {message.sender === 'provider' && (
                        <img 
                          className="h-10 w-10 rounded-full object-cover ml-3 mt-1"
                          src={message.senderAvatar}
                          alt={message.senderName}
                        />
                      )}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            </div>
            
            {/* Message input */}
            <div className="p-4 border-t border-neutral-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex items-end">
                <div className="flex-1 min-w-0 relative rounded-md shadow-sm">
                  <textarea
                    rows={2}
                    className="focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-neutral-300 rounded-md pr-12 resize-none"
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                  />
                  <div className="absolute inset-y-0 right-0 flex">
                    <div className="flex items-center pr-2">
                      <button
                        type="button"
                        className="p-1 rounded-full text-neutral-400 hover:text-neutral-600"
                        title="Attach file"
                      >
                        <FaPaperclip />
                      </button>
                      <button
                        type="button"
                        className="ml-1 p-1 rounded-full text-neutral-400 hover:text-neutral-600"
                        title="Add emoji"
                      >
                        <FaSmile />
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!messageText.trim()}
                  className="ml-3 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <FaPaperPlane />
                </button>
              </form>
              
              <div className="mt-3 flex items-center justify-between text-sm text-neutral-500">
                <div className="flex space-x-3">
                  <button className="flex items-center hover:text-neutral-700">
                    <FaImage className="mr-1" /> Photos
                  </button>
                  <button className="flex items-center hover:text-neutral-700">
                    <FaFile className="mr-1" /> Documents
                  </button>
                </div>
                <p className="text-xs">Messages are confidential as per privacy policy</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-neutral-50">
            <div className="text-center">
              <h3 className="text-lg font-medium text-neutral-900">No Conversation Selected</h3>
              <p className="mt-1 text-sm text-neutral-500">
                Select a conversation from the list to start messaging
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}