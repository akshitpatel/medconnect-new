'use client';

import React, { useState, useRef, useEffect } from 'react';
import DefaultLayout from '@/app/components/DefaultLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/app/utils/cn';
import { useTheme } from '@/app/contexts/ThemeContext';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Card, CardHeader, CardContent } from '@/app/components/ui/Card';
import Tabs from '@/app/components/ui/Tabs';
import { 
  SendIcon, 
  PaperclipIcon, 
  MicIcon, 
  SmileIcon, 
  SearchIcon, 
  MoreHorizontalIcon, 
  CheckIcon, 
  PhoneIcon, 
  VideoIcon,
  PinIcon,
  StarIcon,
  ClockIcon,
  PlusCircleIcon,
  FilterIcon
} from 'lucide-react';
import ProfileAvatar from '@/app/components/ui/ProfileAvatar';

// Define message categories
const MESSAGE_CATEGORIES = [
  { id: 'all', name: 'All' },
  { id: 'doctors', name: 'Doctors' },
  { id: 'pharmacy', name: 'Pharmacy' },
  { id: 'support', name: 'Support' },
  { id: 'starred', name: 'Starred' }
];

// Define quick replies
const QUICK_REPLIES = [
  { id: 1, text: "Yes, I've been taking my medication as prescribed." },
  { id: 2, text: "No, I haven't experienced any side effects." },
  { id: 3, text: "I've been feeling better since starting the new treatment." },
  { id: 4, text: "When would be a good time to schedule a follow-up?" },
  { id: 5, text: "Could you please explain that in simpler terms?" }
];

// Sample data for conversations
const conversations = [
  {
    id: 1,
    name: 'Dr. Sarah Chen',
    role: 'Cardiologist',
    initials: 'SC',
    online: true,
    lastMessage: 'Your test results look good. No need to worry.',
    timestamp: '10:30 AM',
    unread: 0,
    category: 'doctors',
    starred: true
  },
  {
    id: 2,
    name: 'Dr. Michael Rodriguez',
    role: 'General Physician',
    initials: 'MR',
    online: false,
    lastMessage: 'Please remember to take your medication regularly.',
    timestamp: 'Yesterday',
    unread: 2,
    category: 'doctors',
    starred: false
  },
  {
    id: 3,
    name: 'Dr. Emily Johnson',
    role: 'Neurologist',
    initials: 'EJ',
    online: true,
    lastMessage: 'Let\'s schedule a follow-up appointment next week.',
    timestamp: 'Yesterday',
    unread: 0,
    category: 'doctors',
    starred: false
  },
  {
    id: 4,
    name: 'Dr. Robert Williams',
    role: 'Dermatologist',
    initials: 'RW',
    online: false,
    lastMessage: 'Apply the cream twice daily for best results.',
    timestamp: 'Mon',
    unread: 0,
    category: 'doctors',
    starred: false
  },
  {
    id: 5,
    name: 'Pharmacy Support',
    role: 'Medication Team',
    initials: 'PS',
    online: true,
    lastMessage: 'Your prescription is ready for pickup.',
    timestamp: 'Sun',
    unread: 1,
    category: 'pharmacy',
    starred: false
  },
  {
    id: 6,
    name: 'Patient Support',
    role: 'Support Team',
    initials: 'ST',
    online: true,
    lastMessage: 'How can we assist you today?',
    timestamp: 'Last week',
    unread: 0,
    category: 'support',
    starred: false
  },
];

// Sample messages for a conversation
const sampleMessages = [
  {
    id: 101,
    senderId: 1,
    text: 'Hello John, how are you feeling today?',
    timestamp: '10:25 AM',
    status: 'read',
  },
  {
    id: 102,
    senderId: 'me',
    text: 'Hi Dr. Chen, I\'m feeling much better. The new medication seems to be working well.',
    timestamp: '10:27 AM',
    status: 'read',
  },
  {
    id: 103,
    senderId: 1,
    text: 'That\'s great to hear! Any side effects or concerns?',
    timestamp: '10:28 AM',
    status: 'read',
  },
  {
    id: 104,
    senderId: 'me',
    text: 'Just a little drowsiness in the morning, but it goes away after an hour or so.',
    timestamp: '10:29 AM',
    status: 'read',
  },
  {
    id: 105,
    senderId: 1,
    text: 'Your test results look good. No need to worry about the drowsiness, it\'s a common side effect and should diminish over time as your body adjusts to the medication.',
    timestamp: '10:30 AM',
    status: 'read',
  }
];

// Convert message categories to tabs format
const categoryTabs = MESSAGE_CATEGORIES.map(category => ({
  id: category.id,
  label: category.name
}));

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(1);
  const [messages, setMessages] = useState(sampleMessages);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isQuickReplyOpen, setIsQuickReplyOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { isDarkMode } = useTheme();

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Filter conversations based on search term and category
  const filteredConversations = conversations.filter(
    (conv) => {
      const matchesSearch = conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           conv.role.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = activeCategory === 'all' || 
                             (activeCategory === 'starred' ? conv.starred : conv.category === activeCategory);
      return matchesSearch && matchesCategory;
    }
  );
  
  // Find the selected conversation
  const currentConversation = conversations.find(c => c.id === selectedConversation);

  // Handle sending a new message
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;
    
    const newMsg = {
      id: Math.floor(Math.random() * 10000),
      senderId: 'me',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent' as const,
    };
    
    setMessages([...messages, newMsg]);
    setNewMessage('');
    
    // Simulate a response after a delay
    setTimeout(() => {
      const responseMsg = {
        id: Math.floor(Math.random() * 10000),
        senderId: currentConversation?.id || 1,
        text: `Thanks for your message. I'll get back to you as soon as possible.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'sent' as const,
      };
      setMessages(prev => [...prev, responseMsg]);
    }, 3000);
  };
  
  // Handle key press for sending message
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Insert quick reply into message input
  const handleQuickReply = (text: string) => {
    setNewMessage(text);
    setIsQuickReplyOpen(false);
  };
  
  // Star a conversation
  const toggleStarConversation = (id: number, e: React.MouseEvent) => {
    e.stopPropagation();
    // Would update the data in a real app
    console.log(`Toggled star for conversation ${id}`);
  };
  
  return (
    <DefaultLayout>
      <div className="h-[calc(100vh-8rem)] flex flex-col">
        <Card className="flex-1 flex overflow-hidden">
          {/* Conversations panel with sleek design */}
          <div className="w-full md:w-80 lg:w-96 border-r overflow-hidden flex flex-col h-full">
            {/* Title and controls */}
            <CardHeader className="px-4 py-3 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Messages</h2>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="rounded-full p-2 text-gray-500 hover:text-teal-600 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <PlusCircleIcon className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            
            {/* Category Tabs */}
            <div className="px-3 py-2 border-b">
              <Tabs
                tabs={categoryTabs}
                activeTab={activeCategory}
                onTabChange={setActiveCategory}
              />
            </div>
            
            {/* Search */}
            <div className="px-4 py-2 border-b">
              <div className="relative">
                <div className={cn(
                  "absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none transition-opacity",
                  isSearchFocused ? "opacity-0" : "opacity-100"
                )}>
                  <SearchIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  className={cn(
                    "bg-transparent w-full py-2 pl-10 pr-4 rounded-lg border transition-all",
                    "focus:outline-none focus:ring-2 focus:pl-4",
                    isDarkMode 
                      ? "border-gray-700 focus:border-teal-600 focus:ring-teal-600/20 text-white" 
                      : "border-gray-300 focus:border-teal-500 focus:ring-teal-500/20 text-gray-900"
                  )}
                  placeholder="Search conversations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                />
              </div>
            </div>
            
            {/* Conversation list with animations */}
            <div className="flex-1 overflow-y-auto">
              <AnimatePresence>
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className={cn(
                        "p-3 cursor-pointer border-l-2 transition-all duration-200 group",
                        selectedConversation === conversation.id 
                          ? isDarkMode 
                            ? "bg-gray-800 border-l-teal-500" 
                            : "bg-teal-50 border-l-teal-500"
                          : isDarkMode
                            ? "hover:bg-gray-800/50 border-l-transparent" 
                            : "hover:bg-gray-50 border-l-transparent",
                      )}
                      onClick={() => setSelectedConversation(conversation.id)}
                    >
                      <div className="flex items-start">
                        {/* Avatar with online indicator */}
                        <div className="relative mr-3">
                          <ProfileAvatar 
                            initials={conversation.initials}
                            alt={conversation.name}
                            size="md"
                            role={conversation.role.toLowerCase().includes('doctor') ? 'doctor' : 
                                  conversation.role.toLowerCase().includes('pharmacy') ? 'staff' : 'patient'}
                          />
                          {conversation.online && (
                            <span className="absolute bottom-0 right-0 w-3 h-3 bg-teal-500 border-2 rounded-full border-white dark:border-gray-900"></span>
                          )}
                        </div>
                        
                        {/* Conversation details */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-baseline">
                            <h3 className={cn(
                              "font-medium truncate",
                              isDarkMode ? "text-white" : "text-gray-900"
                            )}>
                              {conversation.name}
                            </h3>
                            <div className="flex items-center">
                              {conversation.starred && (
                                <StarIcon className="h-3.5 w-3.5 text-amber-500 mr-1" />
                              )}
                              <span className={cn(
                                "text-xs whitespace-nowrap",
                                isDarkMode ? "text-gray-400" : "text-gray-500"
                              )}>
                                {conversation.timestamp}
                              </span>
                            </div>
                          </div>
                          
                          <p className={cn(
                            "text-sm truncate",
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          )}>
                            {conversation.role}
                          </p>
                          
                          <div className="flex justify-between items-center mt-1">
                            <p className={cn(
                              "text-xs truncate max-w-[80%]",
                              isDarkMode ? "text-gray-500" : "text-gray-600"
                            )}>
                              {conversation.lastMessage}
                            </p>
                            <div className="flex items-center">
                              {conversation.unread > 0 && (
                                <span className={cn(
                                  "px-2 py-0.5 rounded-full text-xs font-medium text-white",
                                  "bg-teal-500"
                                )}>
                                  {conversation.unread}
                                </span>
                              )}
                              <Button
                                variant="ghost"
                                size="sm"
                                className="p-1 ml-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-amber-500"
                                onClick={(e) => toggleStarConversation(conversation.id, e)}
                              >
                                <StarIcon className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center text-center p-8 h-40"
                  >
                    <SearchIcon className="h-8 w-8 text-gray-300 dark:text-gray-600 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">No conversations found</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Chat area with beautiful design */}
          <div className="hidden md:flex flex-1 flex-col h-full">
            {selectedConversation ? (
              <>
                {/* Chat header */}
                <div className="p-4 border-b flex items-center justify-between shadow-sm">
                  {currentConversation && (
                    <div className="flex items-center">
                      <div className="relative mr-3">
                        <ProfileAvatar 
                          initials={currentConversation.initials}
                          alt={currentConversation.name}
                          size="md"
                          role={currentConversation.role.toLowerCase().includes('doctor') ? 'doctor' : 
                                currentConversation.role.toLowerCase().includes('pharmacy') ? 'staff' : 'patient'}
                        />
                        {currentConversation.online && (
                          <span className="absolute bottom-0 right-0 w-3 h-3 bg-teal-500 border-2 rounded-full border-white dark:border-gray-900"></span>
                        )}
                      </div>
                      <div>
                        <h3 className={cn(
                          "font-medium",
                          isDarkMode ? "text-white" : "text-gray-900"
                        )}>
                          {currentConversation.name}
                        </h3>
                        <div className="flex items-center">
                          <span className={cn(
                            "text-xs",
                            isDarkMode ? "text-gray-400" : "text-gray-500"
                          )}>
                            {currentConversation.role}
                          </span>
                          {currentConversation.online && (
                            <span className="flex items-center text-xs text-teal-500 ml-2">
                              <span className="w-1.5 h-1.5 bg-teal-500 rounded-full mr-1"></span>
                              Online
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2 rounded-full text-gray-500 hover:text-teal-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                    >
                      <PhoneIcon size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2 rounded-full text-gray-500 hover:text-teal-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                    >
                      <VideoIcon size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2 rounded-full text-gray-500 hover:text-teal-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                    >
                      <MoreHorizontalIcon size={16} />
                    </Button>
                  </div>
                </div>
                
                {/* Messages area with elegant styling */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50 dark:bg-gray-900">
                  <div className="max-w-2xl mx-auto space-y-4">
                    {messages.map((message, index) => {
                      const isMe = message.senderId === 'me';
                      const showTimestamp = index === 0 || new Date(message.timestamp).getHours() !== new Date(messages[index - 1].timestamp).getHours();
                      
                      return (
                        <React.Fragment key={message.id}>
                          {showTimestamp && (
                            <div className="flex justify-center my-4">
                              <div className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 rounded-full">
                                {message.timestamp}
                              </div>
                            </div>
                          )}
                          <motion.div 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2 }}
                            className={cn(
                              "flex",
                              isMe ? "justify-end" : "justify-start"
                            )}
                          >
                            <div className={cn(
                              "max-w-[75%] rounded-2xl px-4 py-2 shadow-sm",
                              isMe
                                ? isDarkMode 
                                  ? "bg-teal-600 text-white" 
                                  : "bg-teal-500 text-white"
                                : isDarkMode
                                  ? "bg-gray-800 text-gray-100" 
                                  : "bg-white text-gray-800"
                            )}>
                              <p className="text-sm">{message.text}</p>
                              <div className={cn(
                                "text-right text-xs mt-1",
                                isMe
                                  ? "text-teal-100/80"
                                  : isDarkMode ? "text-gray-400" : "text-gray-500"
                              )}>
                                {message.timestamp}
                                {isMe && (
                                  <span className="ml-1">
                                    {message.status === 'read' ? (
                                      <CheckIcon className="inline h-3 w-3 text-teal-100" />
                                    ) : (
                                      <CheckIcon className="inline h-3 w-3 opacity-50" />
                                    )}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        </React.Fragment>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </div>
                
                {/* Message input with modern features */}
                <div className="p-3 border-t bg-white dark:bg-gray-900 dark:border-gray-800">
                  {isQuickReplyOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mb-2 rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                      <div className="px-3 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Replies</h4>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="p-1 h-auto text-gray-500 hover:text-gray-700"
                          onClick={() => setIsQuickReplyOpen(false)}
                        >
                          ×
                        </Button>
                      </div>
                      <div className="p-2 max-h-40 overflow-y-auto">
                        {QUICK_REPLIES.map(reply => (
                          <Button
                            key={reply.id}
                            variant="ghost"
                            className="w-full justify-start text-left text-xs p-2 h-auto mb-1 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                            onClick={() => handleQuickReply(reply.text)}
                          >
                            {reply.text}
                          </Button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                
                  <div className="max-w-2xl mx-auto flex items-end gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2 rounded-full text-gray-500 hover:text-teal-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-teal-400 dark:hover:bg-gray-800"
                      onClick={() => setIsQuickReplyOpen(!isQuickReplyOpen)}
                    >
                      <PlusCircleIcon size={18} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2 rounded-full text-gray-500 hover:text-teal-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-teal-400 dark:hover:bg-gray-800"
                    >
                      <PaperclipIcon size={18} />
                    </Button>
                    <div className="flex-1 relative">
                      <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message..."
                        className={cn(
                          "w-full resize-none px-4 py-3 rounded-2xl",
                          "focus:outline-none focus:ring-2 transition-all",
                          "min-h-[2.5rem] max-h-32",
                          isDarkMode 
                            ? "bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-teal-600/20" 
                            : "bg-gray-100 border-gray-200 text-gray-900 placeholder-gray-500 focus:ring-teal-500/20"
                        )}
                        rows={1}
                      />
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="absolute right-2 bottom-2 p-1.5 rounded-full text-gray-500 hover:text-teal-700 hover:bg-gray-200 dark:text-gray-400 dark:hover:text-teal-400 dark:hover:bg-gray-700"
                      >
                        <SmileIcon size={18} />
                      </Button>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="p-2 rounded-full text-gray-500 hover:text-teal-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-teal-400 dark:hover:bg-gray-800"
                    >
                      <MicIcon size={18} />
                    </Button>
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className={cn(
                        "p-2 rounded-full",
                        "bg-teal-500 hover:bg-teal-600 text-white",
                        "disabled:bg-gray-300 disabled:text-gray-500 dark:disabled:bg-gray-700 dark:disabled:text-gray-400"
                      )}
                    >
                      <SendIcon size={18} />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-500 mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-1">Select a conversation</h3>
                  <p className="text-gray-500 dark:text-gray-400">Choose a conversation from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>

          {/* Mobile empty state */}
          <div className="flex md:hidden flex-1 items-center justify-center">
            <div className="text-center p-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 text-teal-500 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">View on larger screen</h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm">Messages are optimized for larger screens</p>
            </div>
          </div>
        </Card>
      </div>
    </DefaultLayout>
  );
} 