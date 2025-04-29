'use client';

import React, { useState, useEffect } from 'react';
import { FaUser, FaSave, FaEdit, FaTrash, FaPlusCircle, FaRegCalendarAlt, FaWeight, FaRulerVertical, FaAllergies, FaNotesMedical } from 'react-icons/fa';

export interface HealthProfileData {
  id?: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other' | '';
  height?: number; // in cm
  weight?: number; // in kg
  allergies: string[];
  conditions: string[];
  medications: string[];
  lastUpdated?: Date;
}

interface HealthProfileProps {
  initialProfile?: HealthProfileData | null;
  onProfileSaved: (profile: HealthProfileData) => void;
  onProfileSelected: (profile: HealthProfileData) => void;
  sessionId: string;
}

const HealthProfile: React.FC<HealthProfileProps> = ({ initialProfile, onProfileSaved, onProfileSelected, sessionId }) => {
  const [profiles, setProfiles] = useState<HealthProfileData[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<HealthProfileData | null>(initialProfile || null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedProfile, setEditedProfile] = useState<HealthProfileData>({
    name: '',
    age: 0,
    gender: '',
    allergies: [],
    conditions: [],
    medications: []
  });
  const [newAllergy, setNewAllergy] = useState<string>('');
  const [newCondition, setNewCondition] = useState<string>('');
  const [newMedication, setNewMedication] = useState<string>('');
  const [showProfileForm, setShowProfileForm] = useState<boolean>(false);

  // Load saved profiles from localStorage on first render
  useEffect(() => {
    const savedProfiles = localStorage.getItem('healthProfiles');
    if (savedProfiles) {
      try {
        setProfiles(JSON.parse(savedProfiles));
      } catch (e) {
        console.error('Failed to parse saved health profiles', e);
      }
    }
  }, []);

  // Start with a new profile if no initial profile is provided
  useEffect(() => {
    if (!initialProfile && profiles.length === 0) {
      setShowProfileForm(true);
    } else if (initialProfile) {
      setSelectedProfile(initialProfile);
    }
  }, [initialProfile, profiles]);

  // Save changes to localStorage whenever profiles change
  useEffect(() => {
    if (profiles.length > 0) {
      localStorage.setItem('healthProfiles', JSON.stringify(profiles));
    }
  }, [profiles]);

  const handleCreateProfile = () => {
    setEditedProfile({
      name: '',
      age: 0,
      gender: '',
      allergies: [],
      conditions: [],
      medications: []
    });
    setIsEditing(false);
    setShowProfileForm(true);
  };

  const handleEditProfile = () => {
    if (selectedProfile) {
      setEditedProfile({ ...selectedProfile });
      setIsEditing(true);
      setShowProfileForm(true);
    }
  };

  const handleDeleteProfile = (profileToDelete: HealthProfileData) => {
    if (confirm('Are you sure you want to delete this health profile?')) {
      const updatedProfiles = profiles.filter(p => p.id !== profileToDelete.id);
      setProfiles(updatedProfiles);
      
      if (selectedProfile?.id === profileToDelete.id) {
        setSelectedProfile(null);
      }
      
      // Log deletion
      try {
        fetch('/api/analytics/log', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'health_profile_deleted',
            data: {
              sessionId,
              journeyType: 'symptom_checker',
              profileName: profileToDelete.name,
              timestamp: new Date().toISOString()
            }
          })
        });
      } catch (error) {
        console.error('Failed to log profile deletion:', error);
      }
    }
  };

  const handleSelectProfile = (profile: HealthProfileData) => {
    setSelectedProfile(profile);
    onProfileSelected(profile);
    
    // Log selection
    try {
      fetch('/api/analytics/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'health_profile_selected',
          data: {
            sessionId,
            journeyType: 'symptom_checker',
            profileName: profile.name,
            timestamp: new Date().toISOString()
          }
        })
      });
    } catch (error) {
      console.error('Failed to log profile selection:', error);
    }
  };

  const handleSaveProfile = () => {
    if (!editedProfile.name || !editedProfile.age || !editedProfile.gender) {
      alert('Please fill in all required fields (name, age, gender).');
      return;
    }
    
    const now = new Date();
    const updatedProfile = {
      ...editedProfile,
      id: isEditing ? editedProfile.id : `profile_${Date.now()}`,
      lastUpdated: now
    };
    
    let newProfiles;
    if (isEditing) {
      newProfiles = profiles.map(p => p.id === updatedProfile.id ? updatedProfile : p);
    } else {
      newProfiles = [...profiles, updatedProfile];
    }
    
    setProfiles(newProfiles);
    setSelectedProfile(updatedProfile);
    setShowProfileForm(false);
    onProfileSaved(updatedProfile);
    
    // Log saving profile
    try {
      fetch('/api/analytics/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isEditing ? 'health_profile_updated' : 'health_profile_created',
          data: {
            sessionId,
            journeyType: 'symptom_checker',
            profileName: updatedProfile.name,
            profileAge: updatedProfile.age,
            profileGender: updatedProfile.gender,
            hasConditions: updatedProfile.conditions.length > 0,
            hasMedications: updatedProfile.medications.length > 0,
            hasAllergies: updatedProfile.allergies.length > 0,
            timestamp: new Date().toISOString()
          }
        })
      });
    } catch (error) {
      console.error('Failed to log profile save:', error);
    }
  };

  const handleAddAllergy = () => {
    if (newAllergy.trim()) {
      setEditedProfile({
        ...editedProfile,
        allergies: [...editedProfile.allergies, newAllergy.trim()]
      });
      setNewAllergy('');
    }
  };

  const handleAddCondition = () => {
    if (newCondition.trim()) {
      setEditedProfile({
        ...editedProfile,
        conditions: [...editedProfile.conditions, newCondition.trim()]
      });
      setNewCondition('');
    }
  };

  const handleAddMedication = () => {
    if (newMedication.trim()) {
      setEditedProfile({
        ...editedProfile,
        medications: [...editedProfile.medications, newMedication.trim()]
      });
      setNewMedication('');
    }
  };

  const handleRemoveAllergy = (index: number) => {
    const newAllergies = [...editedProfile.allergies];
    newAllergies.splice(index, 1);
    setEditedProfile({ ...editedProfile, allergies: newAllergies });
  };

  const handleRemoveCondition = (index: number) => {
    const newConditions = [...editedProfile.conditions];
    newConditions.splice(index, 1);
    setEditedProfile({ ...editedProfile, conditions: newConditions });
  };

  const handleRemoveMedication = (index: number) => {
    const newMedications = [...editedProfile.medications];
    newMedications.splice(index, 1);
    setEditedProfile({ ...editedProfile, medications: newMedications });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FaUser className="mr-2 text-teal-600" />
          Health Profile
        </h2>
        
        {!showProfileForm ? (
          <>
            {/* Profile selector */}
            {profiles.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select a profile
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {profiles.map((profile) => (
                    <div 
                      key={profile.id} 
                      className={`border rounded-lg p-3 cursor-pointer transition-all
                        ${selectedProfile?.id === profile.id 
                          ? 'border-teal-500 bg-teal-50' 
                          : 'border-gray-200 hover:border-teal-200 hover:bg-gray-50'}`}
                      onClick={() => handleSelectProfile(profile)}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium">{profile.name}</h3>
                          <p className="text-sm text-gray-500">
                            {profile.age} years, {profile.gender}
                          </p>
                        </div>
                        <div className="flex">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditProfile();
                            }}
                            className="text-gray-500 hover:text-teal-600 mr-2"
                            aria-label="Edit profile"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProfile(profile);
                            }}
                            className="text-gray-500 hover:text-red-600"
                            aria-label="Delete profile"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  <div 
                    className="border-2 border-dashed border-gray-300 rounded-lg p-3 flex items-center justify-center cursor-pointer hover:border-teal-300 hover:bg-gray-50"
                    onClick={handleCreateProfile}
                  >
                    <div className="text-center">
                      <FaPlusCircle className="inline-block text-gray-400 text-xl mb-1" />
                      <p className="text-gray-500">New Profile</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Selected profile display */}
            {selectedProfile ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between mb-3">
                  <h3 className="font-medium text-lg">{selectedProfile.name}'s Health Profile</h3>
                  <div>
                    <button 
                      onClick={handleEditProfile}
                      className="text-teal-600 hover:text-teal-800 text-sm flex items-center"
                    >
                      <FaEdit className="mr-1" /> Edit
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                  <div className="flex items-center">
                    <FaRegCalendarAlt className="text-gray-500 mr-2" />
                    <span className="text-gray-700 font-medium">Age:</span>
                    <span className="ml-2">{selectedProfile.age} years</span>
                  </div>
                  
                  <div className="flex items-center">
                    <FaUser className="text-gray-500 mr-2" />
                    <span className="text-gray-700 font-medium">Gender:</span>
                    <span className="ml-2">{selectedProfile.gender.charAt(0).toUpperCase() + selectedProfile.gender.slice(1)}</span>
                  </div>
                  
                  {selectedProfile.height && (
                    <div className="flex items-center">
                      <FaRulerVertical className="text-gray-500 mr-2" />
                      <span className="text-gray-700 font-medium">Height:</span>
                      <span className="ml-2">{selectedProfile.height} cm</span>
                    </div>
                  )}
                  
                  {selectedProfile.weight && (
                    <div className="flex items-center">
                      <FaWeight className="text-gray-500 mr-2" />
                      <span className="text-gray-700 font-medium">Weight:</span>
                      <span className="ml-2">{selectedProfile.weight} kg</span>
                    </div>
                  )}
                </div>
                
                <div className="mt-4">
                  <div className="mb-3">
                    <h4 className="flex items-center text-sm font-medium text-gray-700">
                      <FaAllergies className="text-red-500 mr-1" /> Allergies
                    </h4>
                    {selectedProfile.allergies.length > 0 ? (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedProfile.allergies.map((allergy, index) => (
                          <span key={index} className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">No allergies recorded</p>
                    )}
                  </div>
                  
                  <div className="mb-3">
                    <h4 className="flex items-center text-sm font-medium text-gray-700">
                      <FaNotesMedical className="text-blue-500 mr-1" /> Medical Conditions
                    </h4>
                    {selectedProfile.conditions.length > 0 ? (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedProfile.conditions.map((condition, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            {condition}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">No conditions recorded</p>
                    )}
                  </div>
                  
                  <div>
                    <h4 className="flex items-center text-sm font-medium text-gray-700">
                      <FaNotesMedical className="text-green-500 mr-1" /> Current Medications
                    </h4>
                    {selectedProfile.medications.length > 0 ? (
                      <div className="mt-1 flex flex-wrap gap-2">
                        {selectedProfile.medications.map((medication, index) => (
                          <span key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">
                            {medication}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">No medications recorded</p>
                    )}
                  </div>
                </div>
                
                {selectedProfile.lastUpdated && (
                  <p className="text-xs text-gray-500 mt-4">
                    Last updated: {new Date(selectedProfile.lastUpdated).toLocaleString()}
                  </p>
                )}
              </div>
            ) : (
              <div className="text-center py-6">
                {profiles.length === 0 ? (
                  <>
                    <p className="text-gray-600 mb-4">You don't have any health profiles yet.</p>
                    <button
                      onClick={handleCreateProfile}
                      className="inline-flex items-center px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                    >
                      <FaPlusCircle className="mr-2" />
                      Create a Health Profile
                    </button>
                  </>
                ) : (
                  <p className="text-gray-600">Select a profile from above or create a new one.</p>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Profile edit form */}
            <form onSubmit={(e) => { e.preventDefault(); handleSaveProfile(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Age*
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="120"
                    value={editedProfile.age}
                    onChange={(e) => setEditedProfile({ ...editedProfile, age: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Gender*
                  </label>
                  <select
                    value={editedProfile.gender}
                    onChange={(e) => setEditedProfile({ ...editedProfile, gender: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                    required
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="300"
                    value={editedProfile.height || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, height: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="500"
                    value={editedProfile.weight || ''}
                    onChange={(e) => setEditedProfile({ ...editedProfile, weight: parseInt(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Allergies</h3>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Add an allergy"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddAllergy}
                    className="px-3 py-2 bg-teal-600 text-white rounded-r-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Add
                  </button>
                </div>
                {editedProfile.allergies.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editedProfile.allergies.map((allergy, index) => (
                      <div key={index} className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded flex items-center">
                        {allergy}
                        <button
                          type="button"
                          onClick={() => handleRemoveAllergy(index)}
                          className="ml-1 text-red-600 hover:text-red-800 focus:outline-none"
                        >
                          <FaTrash size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Medical Conditions</h3>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={newCondition}
                    onChange={(e) => setNewCondition(e.target.value)}
                    placeholder="Add a medical condition"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddCondition}
                    className="px-3 py-2 bg-teal-600 text-white rounded-r-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Add
                  </button>
                </div>
                {editedProfile.conditions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editedProfile.conditions.map((condition, index) => (
                      <div key={index} className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded flex items-center">
                        {condition}
                        <button
                          type="button"
                          onClick={() => handleRemoveCondition(index)}
                          className="ml-1 text-blue-600 hover:text-blue-800 focus:outline-none"
                        >
                          <FaTrash size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Current Medications</h3>
                <div className="flex mb-2">
                  <input
                    type="text"
                    value={newMedication}
                    onChange={(e) => setNewMedication(e.target.value)}
                    placeholder="Add a medication"
                    className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-teal-500 focus:border-teal-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddMedication}
                    className="px-3 py-2 bg-teal-600 text-white rounded-r-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
                  >
                    Add
                  </button>
                </div>
                {editedProfile.medications.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editedProfile.medications.map((medication, index) => (
                      <div key={index} className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded flex items-center">
                        {medication}
                        <button
                          type="button"
                          onClick={() => handleRemoveMedication(index)}
                          className="ml-1 text-green-600 hover:text-green-800 focus:outline-none"
                        >
                          <FaTrash size={10} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-6 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowProfileForm(false)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 flex items-center"
                >
                  <FaSave className="mr-2" />
                  Save Profile
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default HealthProfile; 