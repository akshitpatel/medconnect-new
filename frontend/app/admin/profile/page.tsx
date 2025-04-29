'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, Shield, Key, Bell, Moon, Sun, LogOut, Edit2, Save, X, Camera } from 'lucide-react';
import AnimatedCard from '@/app/components/ui/AnimatedCard';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  avatar: string;
  department: string;
  joinDate: string;
  lastLogin: string;
  twoFactorEnabled: boolean;
  notificationsEnabled: boolean;
  darkModeEnabled: boolean;
}

const MOCK_PROFILE: UserProfile = {
  id: 'admin-123',
  name: 'Alex Morgan',
  email: 'alex.morgan@medconnect.com',
  phone: '(555) 123-4567',
  role: 'System Administrator',
  avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
  department: 'IT & Operations',
  joinDate: '2021-06-15T10:30:00Z',
  lastLogin: '2023-05-15T08:25:00Z',
  twoFactorEnabled: true,
  notificationsEnabled: true,
  darkModeEnabled: false
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'preferences'>('profile');

  useEffect(() => {
    // Simulate API call to fetch user profile
    const timer = setTimeout(() => {
      setProfile(MOCK_PROFILE);
      setEditedProfile(MOCK_PROFILE);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleEditToggle = () => {
    if (isEditing) {
      // Discard changes
      setEditedProfile(profile);
    }
    setIsEditing(!isEditing);
  };

  const handleSaveProfile = () => {
    // In a real app, this would save to the backend
    setProfile(editedProfile);
    setIsEditing(false);
    alert('Profile updated successfully!');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile(prev => prev ? { ...prev, [name]: value } : null);
  };

  const handleToggleChange = (setting: 'twoFactorEnabled' | 'notificationsEnabled' | 'darkModeEnabled') => {
    setEditedProfile(prev => prev ? { ...prev, [setting]: !prev[setting] } : null);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' at ' + date.toLocaleTimeString();
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Profile</h1>
        </div>
        <AnimatedCard className="rounded-xl p-6 bg-white dark:bg-gray-800 shadow-md">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-6">
              <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              <div className="flex-1">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </AnimatedCard>
      </div>
    );
  }

  if (!profile || !editedProfile) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <div className="text-center py-10">
          <User className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Profile not found</h3>
          <p className="mt-1 text-gray-500 dark:text-gray-400">Please try again later or contact support.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <User className="mr-2 text-teal-500" />
          My Profile
        </h1>
        <div className="flex items-center space-x-2">
          {isEditing ? (
            <>
              <button 
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </button>
              <button 
                onClick={handleEditToggle}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center"
              >
                <X className="h-4 w-4 mr-2" />
                Cancel
              </button>
            </>
          ) : (
            <button 
              onClick={handleEditToggle}
              className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors flex items-center"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Profile
            </button>
          )}
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center">
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <AnimatedCard className="rounded-xl bg-white dark:bg-gray-800 shadow-md overflow-hidden">
            <div className="p-6 text-center">
              <div className="relative mx-auto w-32 h-32 mb-4">
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="rounded-full h-32 w-32 object-cover border-4 border-teal-100 dark:border-teal-900/30"
                />
                {isEditing && (
                  <div className="absolute bottom-0 right-0 bg-teal-500 p-2 rounded-full text-white cursor-pointer hover:bg-teal-600 transition-colors">
                    <Camera className="h-4 w-4" />
                  </div>
                )}
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{profile.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{profile.role}</p>
              <div className="flex justify-center space-x-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal-100 text-teal-800 dark:bg-teal-900/20 dark:text-teal-400">
                  {profile.department}
                </span>
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700">
              <nav className="flex flex-col">
                <button 
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-3 flex items-center text-sm font-medium ${
                    activeTab === 'profile' 
                      ? 'bg-teal-50 dark:bg-teal-900/10 text-teal-600 dark:text-teal-400 border-l-4 border-teal-500'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <User className="h-4 w-4 mr-3" />
                  Profile Information
                </button>
                <button 
                  onClick={() => setActiveTab('security')}
                  className={`px-6 py-3 flex items-center text-sm font-medium ${
                    activeTab === 'security' 
                      ? 'bg-teal-50 dark:bg-teal-900/10 text-teal-600 dark:text-teal-400 border-l-4 border-teal-500'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Shield className="h-4 w-4 mr-3" />
                  Security
                </button>
                <button 
                  onClick={() => setActiveTab('preferences')}
                  className={`px-6 py-3 flex items-center text-sm font-medium ${
                    activeTab === 'preferences' 
                      ? 'bg-teal-50 dark:bg-teal-900/10 text-teal-600 dark:text-teal-400 border-l-4 border-teal-500'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                  }`}
                >
                  <Bell className="h-4 w-4 mr-3" />
                  Preferences
                </button>
              </nav>
            </div>
          </AnimatedCard>

          <AnimatedCard className="rounded-xl bg-white dark:bg-gray-800 shadow-md mt-6 p-6">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-3">Account Information</h3>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Member Since</p>
                <p className="text-gray-900 dark:text-white">{formatDate(profile.joinDate)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Last Login</p>
                <p className="text-gray-900 dark:text-white">{formatDate(profile.lastLogin)}</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">User ID</p>
                <p className="text-gray-900 dark:text-white">{profile.id}</p>
              </div>
            </div>
          </AnimatedCard>
        </div>
        
        {/* Main content */}
        <div className="lg:col-span-3">
          <AnimatedCard className="rounded-xl bg-white dark:bg-gray-800 shadow-md p-6">
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="name" 
                        value={editedProfile.name} 
                        onChange={handleInputChange}
                        className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <User className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900 dark:text-white">{profile.name}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input 
                        type="email" 
                        name="email" 
                        value={editedProfile.email} 
                        onChange={handleInputChange}
                        className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <Mail className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900 dark:text-white">{profile.email}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input 
                        type="tel" 
                        name="phone" 
                        value={editedProfile.phone} 
                        onChange={handleInputChange}
                        className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <Phone className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900 dark:text-white">{profile.phone}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Department
                    </label>
                    {isEditing ? (
                      <input 
                        type="text" 
                        name="department" 
                        value={editedProfile.department} 
                        onChange={handleInputChange}
                        className="px-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center px-4 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <Shield className="h-5 w-5 text-gray-400 mr-3" />
                        <span className="text-gray-900 dark:text-white">{profile.department}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'security' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Key className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Change Password</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Update your password regularly to keep your account secure</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors text-sm">
                      Change
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Shield className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Add an extra layer of security to your account</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button 
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${editedProfile.twoFactorEnabled ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                        onClick={() => handleToggleChange('twoFactorEnabled')}
                      >
                        <span 
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${editedProfile.twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Key className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Active Sessions</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">View and manage your active login sessions</p>
                      </div>
                    </div>
                    <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors text-sm">
                      View
                    </button>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'preferences' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Preferences</h2>
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <Bell className="h-6 w-6 text-gray-400" />
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Receive email updates about system activities</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button 
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${editedProfile.notificationsEnabled ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                        onClick={() => handleToggleChange('notificationsEnabled')}
                      >
                        <span 
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${editedProfile.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        {editedProfile.darkModeEnabled ? (
                          <Moon className="h-6 w-6 text-gray-400" />
                        ) : (
                          <Sun className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button 
                        className={`relative inline-flex h-6 w-11 items-center rounded-full ${editedProfile.darkModeEnabled ? 'bg-teal-500' : 'bg-gray-200 dark:bg-gray-700'}`}
                        onClick={() => handleToggleChange('darkModeEnabled')}
                      >
                        <span 
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${editedProfile.darkModeEnabled ? 'translate-x-6' : 'translate-x-1'}`}
                        />
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-3">Email Preferences</h3>
                    <div className="space-y-2">
                      <div className="flex items-center">
                        <input 
                          id="security-emails" 
                          type="checkbox" 
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          defaultChecked 
                        />
                        <label htmlFor="security-emails" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Security alerts
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="product-emails" 
                          type="checkbox" 
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                          defaultChecked 
                        />
                        <label htmlFor="product-emails" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Product updates
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input 
                          id="marketing-emails" 
                          type="checkbox" 
                          className="w-4 h-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500" 
                        />
                        <label htmlFor="marketing-emails" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                          Marketing communications
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </AnimatedCard>
        </div>
      </div>
    </div>
  );
} 