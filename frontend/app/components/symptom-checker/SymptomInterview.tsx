"use client";

import React, { useState, useEffect } from 'react';
import { FaUser, FaRobot, FaSpinner, FaArrowRight, FaSadTear, FaImage, FaPaperclip } from 'react-icons/fa';
import { MdSick, MdOutlineHealthAndSafety } from 'react-icons/md';
import { BodyPart } from './BodyPartSelector';
import Image from 'next/image';
import GeminiApi, { Prediction } from '../../utils/gemini-api';

// Define the structure of our conversation
interface Message {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  options?: string[];
  imageUrl?: string;
  isLoading?: boolean;
}

// Symptom data structure
interface Symptom {
  id: string;
  name: string;
  relatedBodyParts: string[];
  followUpQuestions?: string[];
  severity?: 'mild' | 'moderate' | 'severe';
  duration?: string;
}

interface SymptomInterviewProps {
  selectedBodyPart: BodyPart | null;
  onComplete: (data: any) => void;
  onBack: () => void;
}

// Define form data interface to fix type errors
interface FormData {
  bodyPartId: string;
  symptoms: string[];
  symptomDetails: Record<string, any>;
  age: string;
  gender: string;
  medicalHistory: string[];
  additionalNotes: string;
  [key: string]: any; // Allow additional dynamic properties
}

// Emergency symptoms that require immediate attention
const emergencySymptoms = [
  'severe chest pain', 'difficulty breathing', 'sudden severe headache',
  'sudden confusion', 'severe abdominal pain', 'uncontrollable bleeding',
  'loss of consciousness', 'suicidal thoughts'
];

const SymptomInterview: React.FC<SymptomInterviewProps> = ({ selectedBodyPart, onComplete, onBack }) => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState<Symptom | null>(null);
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<number>(0);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [availableSymptoms, setAvailableSymptoms] = useState<Symptom[]>([]);
  const [isLoadingSymptoms, setIsLoadingSymptoms] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>({
    bodyPartId: selectedBodyPart?.id || '',
    symptoms: [],
    symptomDetails: {},
    age: '',
    gender: '',
    medicalHistory: [],
    additionalNotes: ''
  });

  // Reference to scroll to bottom of conversation
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Load symptoms from API when body part changes
  useEffect(() => {
    if (selectedBodyPart) {
      fetchSymptoms();
      
      // Start conversation with greeting
      setConversation([
        {
          id: '1',
          sender: 'assistant',
          content: `Hello! I'm here to help you identify your symptoms related to the ${selectedBodyPart.label}. What symptoms are you experiencing?`,
          options: availableSymptoms.map(s => s.name)
        }
      ]);

      // Update form data with selected body part
      setFormData(prev => ({
        ...prev,
        bodyPartId: selectedBodyPart.id
      }));
    }
  }, [selectedBodyPart, availableSymptoms]);

  // Scroll to bottom of conversation whenever it updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation]);

  // Fetch symptoms from API
  const fetchSymptoms = async () => {
    if (!selectedBodyPart) return;
    
    setIsLoadingSymptoms(true);
    try {
      const response = await fetch(`/api/symptoms?bodyPartId=${selectedBodyPart.id}`);
      if (!response.ok) throw new Error('Failed to fetch symptoms');
      
      const data = await response.json();
      setAvailableSymptoms(data.symptoms);
      
      // If no symptoms found, add a loading message
      if (data.symptoms.length === 0) {
        addMessage(
          'assistant',
          'I don\'t see any specific symptoms for this body part in our database yet. Please describe your symptoms in your own words.',
          []
        );
      } else {
        // Show available symptoms as options
        const symptomNames = data.symptoms.map((s: Symptom) => s.name);
        addMessage(
          'assistant', 
          'Please select from the following symptoms or describe your own:',
          symptomNames
        );
      }
    } catch (error) {
      console.error('Error fetching symptoms:', error);
      addMessage(
        'assistant',
        'I had trouble loading symptoms. Please describe what you\'re experiencing in your own words.',
        []
      );
    } finally {
      setIsLoadingSymptoms(false);
    }
  };

  const handleSymptomSelect = (symptomName: string) => {
    // Find symptom in available symptoms
    const symptom = availableSymptoms.find(s => s.name === symptomName);
    
    if (!symptom) {
      // Handle custom symptom
      const customSymptom: Symptom = {
        id: 'custom_' + Date.now(),
        name: symptomName,
        relatedBodyParts: selectedBodyPart ? [selectedBodyPart.id] : []
      };
      
      setCurrentSymptom(customSymptom);
      setSelectedSymptoms(prev => [...prev, customSymptom]);
      
      addMessage('user', `I'm experiencing ${symptomName}`);
      addMessage('assistant', 'Can you tell me more about this symptom? How long have you experienced it?');
      
      // Update form data
      setFormData(prev => ({
        ...prev,
        symptoms: [...prev.symptoms, customSymptom.id],
        symptomDetails: {
          ...prev.symptomDetails,
          [customSymptom.id]: { name: symptomName }
        }
      }));
      
      return;
    }
    
    // Update current symptom
    setCurrentSymptom(symptom);
    setSelectedSymptoms(prev => [...prev, symptom]);
    
    // Add message for selected symptom
    addMessage('user', `I'm experiencing ${symptomName}`);
    
    // Check if the symptom has follow-up questions
    if (symptom.followUpQuestions && symptom.followUpQuestions.length > 0) {
      setCurrentQuestion(0);
      addMessage('assistant', symptom.followUpQuestions[0]);
    } else {
      askAboutOtherSymptoms();
    }
    
    // Update form data
    setFormData(prev => ({
      ...prev,
      symptoms: [...prev.symptoms, symptom.id],
      symptomDetails: {
        ...prev.symptomDetails,
        [symptom.id]: { name: symptom.name }
      }
    }));
  };

  const handleUserInput = (input: string) => {
    addMessage('user', input);
    
    if (currentSymptom && currentSymptom.followUpQuestions && currentQuestion < currentSymptom.followUpQuestions.length) {
      // Save the answer
      setFormData(prev => ({
        ...prev,
        symptomDetails: {
          ...prev.symptomDetails,
          [currentSymptom.id]: {
            ...prev.symptomDetails[currentSymptom.id],
            [`question_${currentQuestion}`]: input
          }
        }
      }));
      
      // Move to next question or finish current symptom
      if (currentQuestion + 1 < currentSymptom.followUpQuestions.length) {
        setCurrentQuestion(prev => prev + 1);
        addMessage('assistant', currentSymptom.followUpQuestions[currentQuestion + 1]);
      } else {
        setCurrentQuestion(0);
        askAboutOtherSymptoms();
      }
    } else {
      // General input processing
      processGeneralUserInput(input);
    }
  };

  const askAboutOtherSymptoms = () => {
    if (selectedBodyPart) {
      const remainingSymptoms = availableSymptoms.filter(
        s => !selectedSymptoms.find(selected => selected.id === s.id)
      );
      
      if (remainingSymptoms.length > 0) {
        addMessage(
          'assistant', 
          'Are you experiencing any other symptoms?', 
          remainingSymptoms.map(s => s.name)
        );
      } else {
        // No more symptoms to ask about, move to demographic questions
        addMessage('assistant', 'Thank you for sharing those symptoms. How old are you?');
      }
    } else {
      // No body part selected, go to demographic questions
      addMessage('assistant', 'How old are you?');
    }
  };

  const processGeneralUserInput = (input: string) => {
    if (!formData.age) {
      // Assume they're answering age question
      setFormData(prev => ({ ...prev, age: input }));
      addMessage('assistant', 'What is your gender?');
    } else if (!formData.gender) {
      // Assume they're answering gender question
      setFormData(prev => ({ ...prev, gender: input }));
      addMessage('assistant', 'Do you have any pre-existing medical conditions? (e.g., diabetes, hypertension, asthma)');
    } else if (formData.medicalHistory.length === 0) {
      // Assume they're answering medical history
      setFormData(prev => ({ ...prev, medicalHistory: input.split(',').map((item: string) => item.trim()) }));
      addMessage('assistant', 'Is there anything else you would like to add about your symptoms or health condition?');
    } else {
      // Assume they're providing additional information
      setFormData(prev => ({ ...prev, additionalNotes: input }));
      
      // Add loading message while "analyzing"
      const loadingMessageId = Date.now().toString();
      addMessage('assistant', 'Analyzing your symptoms...', undefined, undefined, true, loadingMessageId);
      
      // Send to Gemini API for analysis
      analyzeWithGemini();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      // Add message about uploaded image
      addMessage('user', "I've uploaded an image related to my symptoms.", undefined, reader.result as string);
    }
  };

  const processGeminiResponse = (prediction: Prediction) => {
    // Display the prediction results in the conversation
    addMessage('assistant', 'Based on the information you provided, here\'s my analysis:');
    
    // Display possible causes
    prediction.possibleCauses.forEach(cause => {
      let urgencyLabel = '';
      
      if (cause.urgency === 'emergency') {
        urgencyLabel = '🚨 EMERGENCY: Seek immediate medical attention';
      } else if (cause.urgency === 'urgent') {
        urgencyLabel = '⚠️ URGENT: See a doctor soon';
      } else {
        urgencyLabel = '✓ Routine: Schedule a regular appointment';
      }
      
      addMessage('assistant', `Possible condition: ${cause.condition} (${cause.probability} probability)\n${cause.description}\n${urgencyLabel}`);
    });
    
    // Display recommended specialties
    if (prediction.recommendedSpecialties.length > 0) {
      addMessage('assistant', `Recommended specialists: ${prediction.recommendedSpecialties.join(', ')}`);
    }
    
    // Display general advice
    addMessage('assistant', `General advice: ${prediction.generalAdvice}`);
    
    // Display emergency warning if present
    if (prediction.emergencyWarning) {
      addMessage('assistant', '🚨 IMPORTANT: Your symptoms may indicate a medical emergency. Please consider seeking immediate medical attention.');
    }
    
    // Display disclaimer
    addMessage('assistant', `DISCLAIMER: ${prediction.disclaimer}`);
    
    // Complete the interview
    onComplete(formData);
  };

  const analyzeWithGemini = async () => {
    try {
      let prediction: Prediction;
      
      if (imageFile) {
        // Analyze with image
        prediction = await GeminiApi.analyzeSymptomsWithImage(formData, imageFile);
      } else {
        // Analyze without image
        prediction = await GeminiApi.analyzeSymptoms(formData);
      }
      
      // Remove loading message
      setConversation(prev => prev.filter(msg => !msg.isLoading));
      
      // Process the response
      processGeminiResponse(prediction);
      
      // Save to database
      saveSymptomCheck(prediction);
      
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
      setConversation(prev => prev.filter(msg => !msg.isLoading));
      addMessage('assistant', 'I apologize, but I encountered an error analyzing your symptoms. Please try again later.');
    }
  };
  
  // Save symptom check to database
  const saveSymptomCheck = async (prediction: Prediction) => {
    try {
      const symptomCheckData = {
        patientName: 'Anonymous User', // Replace with user's name if available
        bodyPart: selectedBodyPart?.name || '',
        symptoms: selectedSymptoms.map(s => s.name),
        formData,
        prediction: {
          possibleCauses: prediction.possibleCauses.map(c => c.condition),
          recommendedSpecialties: prediction.recommendedSpecialties,
          urgency: prediction.possibleCauses[0]?.urgency || 'routine'
        },
        contactInfo: {
          email: '', // Replace with user's email if available
        }
      };
      
      const response = await fetch('/api/symptom-checks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(symptomCheckData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save symptom check');
      }
      
      // No need to do anything with the response here
    } catch (error) {
      console.error('Error saving symptom check:', error);
      // Continue anyway, don't show error to user
    }
  };

  const addMessage = (
    sender: 'user' | 'assistant', 
    content: string, 
    options?: string[],
    imageUrl?: string,
    isLoading: boolean = false,
    id: string = Date.now().toString()
  ) => {
    const newMessage: Message = {
      id,
      sender,
      content,
      options,
      imageUrl,
      isLoading
    };
    
    setConversation(prev => [...prev, newMessage]);
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg shadow-lg">
      <div className="px-4 py-3 bg-blue-600 text-white rounded-t-lg flex items-center justify-between">
        <div className="flex items-center">
          <MdOutlineHealthAndSafety className="text-2xl mr-2" />
          <h2 className="text-xl font-semibold">Symptom Interview</h2>
        </div>
        <button 
          onClick={onBack}
          className="text-white hover:text-blue-200 transition-colors"
        >
          Back
        </button>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto max-h-[60vh]">
        {conversation.map((message) => (
          <div 
            key={message.id} 
            className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`rounded-lg p-3 max-w-[80%] ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white rounded-tr-none' 
                  : 'bg-gray-100 text-gray-800 rounded-tl-none'
              }`}
            >
              <div className="flex items-center mb-2">
                {message.sender === 'user' ? (
                  <>
                    <span className="font-semibold">You</span>
                    <FaUser className="ml-2 text-sm" />
                  </>
                ) : (
                  <>
                    <FaRobot className="mr-2 text-sm" />
                    <span className="font-semibold">MedConnect AI</span>
                  </>
                )}
              </div>
              
              {message.isLoading ? (
                <div className="flex items-center">
                  <FaSpinner className="animate-spin mr-2" />
                  <span>{message.content}</span>
                </div>
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
              
              {message.imageUrl && (
                <div className="mt-2">
                  <img 
                    src={message.imageUrl} 
                    alt="Uploaded image" 
                    className="max-w-full rounded-lg max-h-48"
                  />
                </div>
              )}
              
              {message.options && message.options.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {message.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleSymptomSelect(option)}
                      className="bg-white text-blue-600 border border-blue-300 rounded-full px-3 py-1 text-sm hover:bg-blue-50 transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center mb-2">
          <button 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors mr-2"
            onClick={() => document.getElementById('image-upload')?.click()}
          >
            <FaPaperclip className="text-gray-500" />
          </button>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          
          {imagePreview && (
            <div className="relative h-10 w-10 mr-2">
              <img 
                src={imagePreview} 
                alt="Preview" 
                className="h-full w-full object-cover rounded-md"
              />
              <button 
                className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full h-4 w-4 flex items-center justify-center text-xs"
                onClick={() => {
                  setImageFile(null);
                  setImagePreview(null);
                }}
              >
                ×
              </button>
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Type your response..."
            className="flex-1 border border-gray-300 rounded-l-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                const input = e.currentTarget.value.trim();
                if (input) {
                  handleUserInput(input);
                  e.currentTarget.value = '';
                }
              }
            }}
          />
          <button 
            className="bg-blue-600 text-white rounded-r-lg py-2 px-4 hover:bg-blue-700 transition-colors"
            onClick={() => {
              const input = document.querySelector('input[type="text"]') as HTMLInputElement;
              if (input && input.value.trim()) {
                handleUserInput(input.value.trim());
                input.value = '';
              }
            }}
          >
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SymptomInterview; 