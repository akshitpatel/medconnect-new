'use client';

import { useState, useEffect } from 'react';
import { 
  FaAmbulance, FaPhoneAlt, FaMapMarkerAlt, 
  FaHospital, FaFirstAid, FaHeartbeat, 
  FaPlusCircle, FaUser, FaExclamationTriangle, FaBandAid, FaArrowLeft,
  FaCar, FaHospitalAlt, FaChevronRight, FaArrowRight, FaInfoCircle, FaShieldAlt
} from 'react-icons/fa';
import Link from 'next/link';
import { motion } from 'framer-motion';

// Mock emergency hospitals data
const nearbyHospitals = [
  {
    id: 1,
    name: 'City General Hospital',
    address: '123 Healthcare Ave, Central City',
    phone: '911',
    distance: '1.5 km',
    emergencyServices: ['24/7 Emergency Care', 'Trauma Center'],
    coordinates: { lat: 12.9716, lng: 77.5946 }, // Example coordinates for Bangalore
  },
  {
    id: 2,
    name: 'Apollo Hospital',
    address: '456 Medical Blvd, Downtown',
    phone: '911',
    distance: '3.2 km',
    emergencyServices: ['24/7 Emergency Care', 'Cardiac Center'],
    coordinates: { lat: 12.9819, lng: 77.6078 },
  },
  {
    id: 3,
    name: 'Fortis Healthcare',
    address: '789 Wellness Road, Westside',
    phone: '911',
    distance: '4.7 km',
    emergencyServices: ['24/7 Emergency Care', 'Stroke Unit'],
    coordinates: { lat: 13.0022, lng: 77.5563 },
  },
  {
    id: 4,
    name: 'Manipal Hospital',
    address: '321 Lifesaver Street, Eastside',
    phone: '911',
    distance: '5.3 km',
    emergencyServices: ['24/7 Emergency Care', 'Critical Care Unit'],
    coordinates: { lat: 12.9531, lng: 77.6246 },
  },
];

// Mock emergency contacts
const emergencyContacts = [
  { 
    id: 1, 
    name: 'National Emergency', 
    phone: '112',
    description: 'National emergency services hotline',
    icon: <FaPhoneAlt className="text-white" />,
    bgColor: "from-red-600 to-red-500"
  },
  { 
    id: 2, 
    name: 'Ambulance Services', 
    phone: '108',
    description: 'Medical emergency ambulance service',
    icon: <FaAmbulance className="text-white" />,
    bgColor: "from-amber-600 to-amber-500"
  },
  { 
    id: 3, 
    name: 'Police Control Room', 
    phone: '100',
    description: 'Police emergency assistance',
    icon: <FaCar className="text-white" />,
    bgColor: "from-blue-600 to-blue-500"
  },
  { 
    id: 4, 
    name: 'Fire Department', 
    phone: '101',
    description: 'Fire emergency response',
    icon: <FaHospitalAlt className="text-white" />,
    bgColor: "from-orange-600 to-orange-500"
  },
  { 
    id: 5, 
    name: 'Poison Control', 
    phone: '1800-222-1222',
    description: 'Help for poison emergencies',
    icon: <FaUser className="text-white" />,
    bgColor: "from-purple-600 to-purple-500"
  },
  { 
    id: 6, 
    name: 'Covid Helpline', 
    phone: '1075',
    description: 'Covid-19 related emergencies',
    icon: <FaHeartbeat className="text-white" />,
    bgColor: "from-green-600 to-green-500"
  }
];

// First Aid guides
const firstAidGuides = [
  {
    id: 1,
    title: 'Choking',
    description: 'How to help someone who is choking on food or an object',
    icon: <FaExclamationTriangle />,
    color: "from-amber-500 to-red-500",
    steps: [
      'Ask "Are you choking?" If the person nods yes and cannot talk, they need help.',
      'Stand behind the person and slightly to one side. Support their chest with one hand.',
      'Lean the person forward so the object blocking their airway can come out of their mouth.',
      'Give up to 5 sharp blows between the person\'s shoulder blades with the heel of your hand.',
      'Check if the blockage has cleared. If not, give up to 5 abdominal thrusts (Heimlich maneuver).',
      'Place your fist above their belly button. Cover your fist with your other hand.',
      'Pull sharply inward and upward. Repeat up to 5 times.',
      'If the obstruction doesn\'t clear after 5 blows and 5 abdominal thrusts, call emergency services.'
    ]
  },
  {
    id: 2,
    title: 'Heart Attack',
    description: 'Recognizing and responding to a heart attack',
    icon: <FaHeartbeat />,
    color: "from-red-600 to-red-500",
    steps: [
      'Call emergency services immediately (112 or 911) if you suspect a heart attack.',
      'Help the person sit down and rest in a position that makes breathing comfortable.',
      'Loosen any tight clothing, especially around the neck.',
      'If the person is not allergic to aspirin and has no contraindications, give them an aspirin to chew.',
      'If prescribed, help them take their nitroglycerin medication.',
      'Monitor their vital signs (consciousness, breathing, pulse) until help arrives.',
      'Be prepared to perform CPR if the person becomes unresponsive and isn\'t breathing normally.',
      'If an automated external defibrillator (AED) is available, use it by following the device instructions.'
    ]
  },
  {
    id: 3,
    title: 'Severe Bleeding',
    description: 'How to control severe bleeding in an emergency',
    icon: <FaBandAid />,
    color: "from-red-500 to-pink-500",
    steps: [
      'Apply direct pressure to the wound using a clean cloth, gauze, or clothing.',
      'If possible, raise the injured area above the level of the heart to reduce blood flow.',
      'Add more layers of cloth if blood soaks through. Do not remove the original cloth.',
      'Secure the dressing with a bandage or tape.',
      'If bleeding continues severely and you suspect an arterial bleed, apply pressure to the relevant artery.',
      'For arm injuries, press the brachial artery against the bone (inner side of upper arm).',
      'For leg injuries, press the femoral artery against the pelvic bone (in the groin area).',
      'Call emergency services immediately while continuing to apply pressure.'
    ]
  },
  {
    id: 4,
    title: 'Burns',
    description: 'First aid for burns of different severity',
    icon: <FaExclamationTriangle />,
    color: "from-orange-500 to-red-500",
    steps: [
      'Remove the person from the source of the burn immediately.',
      'For minor burns, cool the burn with cool (not cold) running water for 10-15 minutes.',
      'Do not use ice, as it can damage the skin further.',
      'Remove jewelry or tight items from the burned area before swelling occurs.',
      'Cover the burn with a clean, non-stick bandage or cloth.',
      'Do not apply butter, oil, or ointments to the burn.',
      'Take over-the-counter pain relievers if needed.',
      'Seek medical attention for burns that are larger than 3 inches, deep burns, or burns on the face, hands, feet, genitals, or major joints.'
    ]
  }
];

export default function EmergencyPage() {
  const [selectedGuide, setSelectedGuide] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  
  // In a real app, this would get the user's location upon page load
  useEffect(() => {
    // Simulating getting user location
    // In a real app, would use: navigator.geolocation.getCurrentPosition()
    const getLocation = () => {
      // Sample coordinates (Bangalore, India)
      setUserLocation({ lat: 12.9716, lng: 77.5946 });
    };
    
    getLocation();
  }, []);
  
  const callEmergencyServices = () => {
    console.log('Calling emergency services...');
    window.location.href = 'tel:112';
  };
  
  const callContact = (contactId: number) => {
    const contact = emergencyContacts.find(c => c.id === contactId);
    if (contact) {
      console.log(`Calling ${contact.name}...`);
      window.location.href = `tel:${contact.phone}`;
    }
  };
  
  const getDirections = (hospitalId: number) => {
    console.log(`Getting directions to hospital ${hospitalId}`);
    // In a real app, this would use the Maps API to get directions
  };
  
  const requestAmbulance = () => {
    console.log('Requesting ambulance...');
    // In a real app, this would trigger a request to ambulance services
  };
  
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Modern Hero Section with Emergency Banner */}
      <section className="relative bg-gradient-to-br from-emergency-700 via-emergency-600 to-emergency-800 text-white pt-20 pb-16 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Pattern overlay */}
          <div className="absolute inset-0 bg-[url('/images/pattern-dots.svg')] opacity-[0.05]"></div>
          
          {/* Dynamic gradient orbs */}
          <motion.div 
            className="absolute -right-40 top-20 w-[40rem] h-[40rem] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(239,68,68,0.1) 0%, rgba(239,68,68,0.05) 50%, rgba(0,0,0,0) 70%)"
            }}
            animate={{ 
              scale: [1, 1.1, 1],
              y: [0, -20, 0],
              opacity: [0.05, 0.08, 0.05] 
            }} 
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut" 
            }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-extrabold mb-4">Emergency Services</h1>
              <p className="text-lg md:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
                Quick access to emergency contacts and immediate care resources when you need them most.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <motion.button
                  onClick={callEmergencyServices}
                  className="inline-flex items-center justify-center bg-emergency-600 hover:bg-emergency-700 text-white px-6 py-3 rounded-lg text-lg font-bold shadow-lg hover:shadow-xl transition-all group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaPhoneAlt className="mr-2 group-hover:animate-pulse" /> Call Emergency (112)
                </motion.button>
                
                <motion.button
                  onClick={requestAmbulance}
                  className="inline-flex items-center justify-center bg-white text-emergency-700 hover:bg-gray-100 px-6 py-3 rounded-lg text-lg font-bold shadow-lg hover:shadow-xl transition-all group"
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FaAmbulance className="mr-2 group-hover:animate-pulse" /> Request Ambulance
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Emergency Contacts */}
      <section className="py-12 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <FaPhoneAlt className="mr-3 text-emergency-600" /> Emergency Contacts
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {emergencyContacts.map((contact) => (
              <motion.div
                key={contact.id}
                className="bg-white rounded-xl shadow-card-soft overflow-hidden transform transition-all hover:shadow-card-hover border border-gray-100"
                whileHover={{ y: -5 }}
              >
                <div className={`h-3 bg-gradient-to-r ${contact.bgColor}`}></div>
                <div className="p-6">
                  <div className="flex items-start">
                    <div className={`flex-shrink-0 rounded-full p-3 bg-gradient-to-r ${contact.bgColor} shadow-md`}>
                      {contact.icon}
                    </div>
                    
                    <div className="ml-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-1">{contact.name}</h3>
                      <p className="text-gray-600 text-sm mb-3">{contact.description}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-xl font-bold text-emergency-700">{contact.phone}</p>
                        <button
                          onClick={() => callContact(contact.id)}
                          className="inline-flex items-center bg-emergency-50 hover:bg-emergency-100 text-emergency-700 px-3 py-1 rounded-lg transition-colors text-sm font-medium"
                        >
                          <FaPhoneAlt className="mr-1" /> Call
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Nearby Hospitals */}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 flex items-center">
              <FaHospital className="mr-3 text-medical-blue-600" /> Nearby Hospitals
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {nearbyHospitals.map((hospital) => (
                <motion.div
                  key={hospital.id}
                  className="bg-white rounded-xl shadow-card-soft border border-gray-100 overflow-hidden hover:shadow-card-hover transition-all"
                  whileHover={{ y: -3 }}
                >
                  <div className="p-6">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-medical-blue-100 text-medical-blue-700 p-3 rounded-lg">
                        <FaHospitalAlt className="h-6 w-6" />
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-1">{hospital.name}</h3>
                            <p className="text-gray-600 flex items-center">
                              <FaMapMarkerAlt className="mr-1 text-gray-400" /> {hospital.address}
                            </p>
                          </div>
                          <div className="bg-medical-blue-50 text-medical-blue-800 px-2 py-1 rounded text-sm font-medium">
                            {hospital.distance}
                          </div>
                        </div>
                        
                        <div className="mt-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Emergency Services:</h4>
                          <div className="flex flex-wrap gap-2">
                            {hospital.emergencyServices.map((service, index) => (
                              <span key={index} className="bg-medical-mint-100 text-medical-mint-700 px-2 py-1 rounded text-xs">
                                {service}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                          <a 
                            href={`tel:${hospital.phone}`}
                            className="inline-flex items-center text-medical-blue-600 hover:text-medical-blue-800"
                          >
                            <FaPhoneAlt className="mr-1" /> {hospital.phone}
                          </a>
                          
                          <button
                            onClick={() => getDirections(hospital.id)}
                            className="inline-flex items-center bg-medical-blue-600 hover:bg-medical-blue-700 text-white px-3 py-2 rounded-lg transition-colors text-sm"
                          >
                            Get Directions <FaArrowRight className="ml-1" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      {/* First Aid Guides */}
      <section className="py-12 container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8 flex items-center">
            <FaFirstAid className="mr-3 text-emergency-600" /> First Aid Guides
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {firstAidGuides.map((guide) => (
              <div 
                key={guide.id}
                className="bg-white rounded-xl shadow-card-soft border border-gray-100 overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${guide.color}`}></div>
                <div className="p-6">
                  <div 
                    className="cursor-pointer"
                    onClick={() => setSelectedGuide(selectedGuide === guide.id ? null : guide.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={`inline-flex items-center justify-center p-3 rounded-lg bg-gradient-to-r ${guide.color} text-white`}>
                          {guide.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-800 ml-3">{guide.title}</h3>
                      </div>
                      <motion.div
                        animate={{ rotate: selectedGuide === guide.id ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <FaChevronRight className="text-gray-400" />
                      </motion.div>
                    </div>
                    <p className="text-gray-600 mt-2">{guide.description}</p>
                  </div>
                  
                  {selectedGuide === guide.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-4 pt-4 border-t border-gray-100"
                    >
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <FaInfoCircle className="mr-2 text-emergency-500" /> Step-by-Step Guide
                        </h4>
                        <ol className="list-decimal pl-5 space-y-2">
                          {guide.steps.map((step, index) => (
                            <li key={index} className="text-gray-700">{step}</li>
                          ))}
                        </ol>
                        <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                          <p className="flex items-center">
                            <FaShieldAlt className="mr-1 text-medical-teal-500" /> Follow these steps while waiting for professional help
                          </p>
                          <p className="text-emergency-600">Call emergency services: 112</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Important Disclaimer */}
      <section className="py-8 bg-gray-50 border-t border-gray-200">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-card-soft p-6 border border-gray-100">
            <h3 className="text-xl font-bold text-gray-800 mb-3 flex items-center">
              <FaExclamationTriangle className="mr-2 text-yellow-500" /> Important Disclaimer
            </h3>
            <p className="text-gray-700 mb-2">
              This emergency information is provided as a general reference only. In case of a medical emergency, always call emergency services immediately.
            </p>
            <p className="text-gray-700">
              First aid guides are not a substitute for professional medical advice or training. Seek professional help as soon as possible in an emergency situation.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
} 