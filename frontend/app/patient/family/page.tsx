'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Navbar } from '@/app/components/ui/Navbar';
import { Card } from '@/app/components/ui/Card';
import { Switch } from '@/app/components/ui/Switch';
import { Button } from '@/app/components/ui/button';

// Define interfaces for family members
interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  dateOfBirth: string;
  imageUrl: string;
  permissions: Permission[];
}

interface Permission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

// Mock data for family members
const initialFamilyMembers: FamilyMember[] = [
  {
    id: 'fm-1',
    name: 'Emma Johnson',
    relationship: 'Spouse',
    dateOfBirth: '1982-06-15',
    imageUrl: '/placeholder-family-1.jpg',
    permissions: [
      {
        id: 'perm-1',
        name: 'View Appointments',
        description: 'Can view your appointment schedule',
        enabled: true
      },
      {
        id: 'perm-2',
        name: 'View Medications',
        description: 'Can view your current medications',
        enabled: true
      },
      {
        id: 'perm-3',
        name: 'View Lab Results',
        description: 'Can view your laboratory test results',
        enabled: false
      }
    ]
  },
  {
    id: 'fm-2',
    name: 'Michael Johnson',
    relationship: 'Son',
    dateOfBirth: '2010-03-22',
    imageUrl: '/placeholder-family-2.jpg',
    permissions: [
      {
        id: 'perm-1',
        name: 'View Appointments',
        description: 'Can view your appointment schedule',
        enabled: false
      },
      {
        id: 'perm-2',
        name: 'View Medications',
        description: 'Can view your current medications',
        enabled: false
      },
      {
        id: 'perm-3',
        name: 'View Lab Results',
        description: 'Can view your laboratory test results',
        enabled: false
      }
    ]
  }
];

// Calculate age from date of birth
const calculateAge = (dob: string): number => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  
  if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

export default function FamilyPage() {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialFamilyMembers);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    relationship: '',
    dateOfBirth: '',
  });
  const [loading, setLoading] = useState(true);
  const [activeCard, setActiveCard] = useState<string | null>(null);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, []);

  // Function to toggle permission for a family member
  const togglePermission = (familyMemberId: string, permissionId: string) => {
    setFamilyMembers(prev => 
      prev.map(member => {
        if (member.id === familyMemberId) {
          return {
            ...member,
            permissions: member.permissions.map(perm => {
              if (perm.id === permissionId) {
                return { ...perm, enabled: !perm.enabled };
              }
              return perm;
            })
          };
        }
        return member;
      })
    );
  };

  // Function to handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMember(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Function to handle adding a new family member
  const handleAddFamilyMember = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newFamilyMember: FamilyMember = {
      id: `fm-${familyMembers.length + 1}`,
      name: newMember.name,
      relationship: newMember.relationship,
      dateOfBirth: newMember.dateOfBirth,
      imageUrl: '/placeholder-avatar.jpg',
      permissions: [
        {
          id: 'perm-1',
          name: 'View Appointments',
          description: 'Can view your appointment schedule',
          enabled: false
        },
        {
          id: 'perm-2',
          name: 'View Medications',
          description: 'Can view your current medications',
          enabled: false
        },
        {
          id: 'perm-3',
          name: 'View Lab Results',
          description: 'Can view your laboratory test results',
          enabled: false
        }
      ]
    };
    
    setFamilyMembers(prev => [...prev, newFamilyMember]);
    setNewMember({
      name: '',
      relationship: '',
      dateOfBirth: '',
    });
    setShowAddForm(false);
  };

  // Function to remove a family member
  const removeFamilyMember = (id: string) => {
    setFamilyMembers(prev => prev.filter(member => member.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <Navbar activePage="family management" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Family Management</h1>
            <p className="text-gray-600 mt-1">Manage family members linked to your MedConnect account</p>
          </div>
          <Button 
            onClick={() => setShowAddForm(true)}
            className="bg-teal-600 hover:bg-teal-700 text-white transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
          >
            Add Family Member
          </Button>
        </div>

        {/* Add Family Member Form */}
        {showAddForm && (
          <Card className="mb-8 p-6 animate-float">
            <h2 className="text-xl font-semibold mb-4">Add New Family Member</h2>
            <form onSubmit={handleAddFamilyMember}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={newMember.name}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-all duration-300"
                  />
                </div>
                <div>
                  <label htmlFor="relationship" className="block text-sm font-medium text-gray-700 mb-1">
                    Relationship
                  </label>
                  <select
                    id="relationship"
                    name="relationship"
                    required
                    value={newMember.relationship}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-all duration-300"
                  >
                    <option value="">Select a relationship</option>
                    <option value="Spouse">Spouse</option>
                    <option value="Parent">Parent</option>
                    <option value="Child">Child</option>
                    <option value="Sibling">Sibling</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="dateOfBirth"
                    required
                    value={newMember.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-all duration-300"
                  />
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <Button 
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white transition-all duration-300 transform hover:scale-105"
                >
                  Add Member
                </Button>
                <Button 
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  variant="outline"
                  className="border-gray-300 text-gray-700 transition-all duration-300 hover:border-red-300"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Family Members List */}
        {familyMembers.length === 0 ? (
          <Card className={`p-8 text-center transition-all duration-500 ${loading ? 'opacity-0' : 'opacity-100'}`}>
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 animate-bounce-slow">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">No family members yet</h3>
            <p className="mt-1 text-gray-500">Add family members to share your health information with them.</p>
            <div className="mt-6">
              <Button 
                onClick={() => setShowAddForm(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white transition-all duration-300 transform hover:scale-105"
              >
                Add Family Member
              </Button>
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {familyMembers.map((member, index) => (
              <Card 
                key={member.id} 
                className={`overflow-hidden transition-all duration-300 hover:shadow-lg ${
                  activeCard === member.id ? 'border-teal-300 shadow-md' : ''
                }`}
                onMouseEnter={() => setActiveCard(member.id)}
                onMouseLeave={() => setActiveCard(null)}
                style={{ 
                  transitionDelay: `${index * 150}ms`,
                  opacity: loading ? 0 : 1,
                  transform: loading ? 'translateY(20px)' : 'translateY(0)',
                  transition: 'opacity 0.5s ease, transform 0.5s ease'
                }}
              >
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center">
                      <div className={`relative h-14 w-14 rounded-full bg-gray-200 overflow-hidden transition-transform duration-300 ${
                        activeCard === member.id ? 'scale-110' : ''
                      }`}>
                        {member.imageUrl ? (
                          <Image
                            src={member.imageUrl}
                            alt={member.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full bg-teal-100 text-teal-600">
                            <span className="text-lg font-medium">
                              {member.name.split(' ').map(n => n[0]).join('')}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <span>{member.relationship}</span>
                          <span className="mx-2">•</span>
                          <span>{calculateAge(member.dateOfBirth)} years old</span>
                        </div>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      onClick={() => removeFamilyMember(member.id)}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-300"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </Button>
                  </div>
                </div>
                <div className="border-t border-gray-200 px-6 py-4">
                  <h4 className="font-medium text-gray-900 mb-3">Permissions</h4>
                  <div className="space-y-4">
                    {member.permissions.map((permission) => (
                      <div 
                        key={permission.id} 
                        className="flex items-center justify-between hover:bg-gray-50 p-2 rounded-md transition-colors duration-300"
                      >
                        <div>
                          <p className="text-sm font-medium text-gray-700">{permission.name}</p>
                          <p className="text-xs text-gray-500">{permission.description}</p>
                        </div>
                        <Switch
                          checked={permission.enabled}
                          onCheckedChange={() => togglePermission(member.id, permission.id)}
                          className={permission.enabled ? "bg-teal-600" : "bg-gray-200"}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* Invite Section */}
        <Card className={`mt-8 p-6 transition-all duration-500 ${loading ? 'opacity-0 translate-y-10' : 'opacity-100 translate-y-0'}`} style={{ transitionDelay: '300ms' }}>
          <div className="flex items-start">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-teal-100 flex items-center justify-center animate-pulse-slow">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-teal-600">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </div>
            <div className="ml-4 flex-1">
              <h3 className="text-lg font-medium text-gray-900">Invite Family Members</h3>
              <p className="mt-1 text-sm text-gray-500">Invite family members via email to link their accounts with yours.</p>
              <div className="mt-4 flex">
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 transition-all duration-300"
                />
                <Button className="rounded-l-none bg-teal-600 hover:bg-teal-700 text-white transition-all duration-300 transform hover:scale-105">
                  Send Invite
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
} 