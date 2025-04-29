"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { 
  FaBrain, 
  FaHeartbeat, 
  FaLungs, 
  FaBone, 
  FaHandPaper,
  FaEye,
  FaTooth,
  FaAllergies,
  FaUser,
  FaProcedures,
  FaTablets,
  FaWeight,
  FaStethoscope,
  FaVenus,
  FaMars,
  FaVenusMars,
  FaBaby
} from 'react-icons/fa';
import { MdOutlineEarbuds, MdFemale, MdMale, MdPregnantWoman } from 'react-icons/md';
import { AiOutlineSkin } from 'react-icons/ai';
import { GiFemale, GiMale } from 'react-icons/gi';

interface BodyPart {
  id: string;
  name: string;
  label?: string;
  icon: React.ReactNode;
  commonSymptoms: string[];
  gender?: 'all' | 'female' | 'male';
}

interface BodyPartSelectorProps {
  onBodyPartSelect?: (bodyPart: BodyPart) => void;
  onSelectBodyPart?: (bodyPart: BodyPart) => void;
  selectedBodyPart?: BodyPart | null;
  selectedGender?: string;
}

const bodyParts: BodyPart[] = [
  {
    id: 'head',
    name: 'Head & Brain',
    icon: <FaBrain className="text-3xl text-teal-600" />,
    commonSymptoms: ['Headache', 'Dizziness', 'Confusion', 'Memory issues', 'Vision problems'],
    gender: 'all'
  },
  {
    id: 'heart',
    name: 'Heart & Chest',
    icon: <FaHeartbeat className="text-3xl text-teal-600" />,
    commonSymptoms: ['Chest pain', 'Palpitations', 'Shortness of breath', 'Fatigue', 'Dizziness'],
    gender: 'all'
  },
  {
    id: 'lungs',
    name: 'Lungs & Respiratory',
    icon: <FaLungs className="text-3xl text-teal-600" />,
    commonSymptoms: ['Cough', 'Shortness of breath', 'Wheezing', 'Chest tightness', 'Sputum production'],
    gender: 'all'
  },
  {
    id: 'stomach',
    name: 'Stomach & Digestion',
    icon: <FaTablets className="text-3xl text-teal-600" />,
    commonSymptoms: ['Abdominal pain', 'Nausea', 'Vomiting', 'Indigestion', 'Bloating'],
    gender: 'all'
  },
  {
    id: 'intestines',
    name: 'Intestines & Bowels',
    icon: <FaProcedures className="text-3xl text-teal-600" />,
    commonSymptoms: ['Diarrhea', 'Constipation', 'Cramping', 'Blood in stool', 'Change in bowel habits'],
    gender: 'all'
  },
  {
    id: 'kidney',
    name: 'Kidney & Urinary',
    icon: <FaStethoscope className="text-3xl text-teal-600" />,
    commonSymptoms: ['Frequent urination', 'Pain during urination', 'Lower back pain', 'Blood in urine', 'Swelling'],
    gender: 'all'
  },
  {
    id: 'bones',
    name: 'Bones & Joints',
    icon: <FaBone className="text-3xl text-teal-600" />,
    commonSymptoms: ['Joint pain', 'Stiffness', 'Swelling', 'Decreased mobility', 'Redness'],
    gender: 'all'
  },
  {
    id: 'muscles',
    name: 'Muscles',
    icon: <FaWeight className="text-3xl text-teal-600" />,
    commonSymptoms: ['Muscle pain', 'Weakness', 'Cramping', 'Stiffness', 'Spasms'],
    gender: 'all'
  },
  {
    id: 'skin',
    name: 'Skin',
    icon: <AiOutlineSkin className="text-3xl text-teal-600" />,
    commonSymptoms: ['Rash', 'Itching', 'Dryness', 'Discoloration', 'Bumps or growths'],
    gender: 'all'
  },
  {
    id: 'eyes',
    name: 'Eyes',
    icon: <FaEye className="text-3xl text-teal-600" />,
    commonSymptoms: ['Blurred vision', 'Eye pain', 'Redness', 'Dry eyes', 'Sensitivity to light'],
    gender: 'all'
  },
  {
    id: 'ears',
    name: 'Ears',
    icon: <MdOutlineEarbuds className="text-3xl text-teal-600" />,
    commonSymptoms: ['Hearing loss', 'Ear pain', 'Ringing in ears', 'Vertigo', 'Discharge'],
    gender: 'all'
  },
  {
    id: 'mouth',
    name: 'Mouth & Dental',
    icon: <FaTooth className="text-3xl text-teal-600" />,
    commonSymptoms: ['Toothache', 'Bleeding gums', 'Bad breath', 'Swelling', 'Difficulty swallowing'],
    gender: 'all'
  },
  {
    id: 'allergic',
    name: 'Allergic Reactions',
    icon: <FaAllergies className="text-3xl text-teal-600" />,
    commonSymptoms: ['Hives', 'Itching', 'Swelling', 'Shortness of breath', 'Anaphylaxis'],
    gender: 'all'
  },
  // Female-specific body parts
  {
    id: 'reproductive_female',
    name: 'Female Reproductive',
    icon: <FaVenus className="text-3xl text-pink-600" />,
    commonSymptoms: [
      'Abnormal vaginal bleeding',
      'Painful periods',
      'Irregular periods',
      'Vaginal discharge',
      'Pelvic pain',
      'Pain during intercourse'
    ],
    gender: 'female'
  },
  {
    id: 'breast',
    name: 'Breast',
    icon: <MdFemale className="text-3xl text-pink-600" />,
    commonSymptoms: [
      'Breast pain',
      'Breast lump',
      'Nipple discharge',
      'Changes in breast appearance',
      'Redness or warmth'
    ],
    gender: 'female'
  },
  {
    id: 'pregnancy',
    name: 'Pregnancy Related',
    icon: <MdPregnantWoman className="text-3xl text-pink-600" />,
    commonSymptoms: [
      'Morning sickness',
      'Abdominal cramping',
      'Spotting or bleeding',
      'Decreased fetal movement',
      'Contractions',
      'Water breaking'
    ],
    gender: 'female'
  },
  {
    id: 'menopause',
    name: 'Menopause',
    icon: <GiFemale className="text-3xl text-pink-600" />,
    commonSymptoms: [
      'Hot flashes',
      'Night sweats',
      'Mood changes',
      'Vaginal dryness',
      'Sleep disturbances',
      'Weight gain'
    ],
    gender: 'female'
  },
  // Male-specific body parts
  {
    id: 'reproductive_male',
    name: 'Male Reproductive',
    icon: <FaMars className="text-3xl text-blue-600" />,
    commonSymptoms: [
      'Testicular pain',
      'Penile discharge',
      'Erectile dysfunction',
      'Painful urination',
      'Scrotal swelling',
      'Prostate issues'
    ],
    gender: 'male'
  },
  {
    id: 'general',
    name: 'General / Whole Body',
    icon: <FaUser className="text-3xl text-teal-600" />,
    commonSymptoms: ['Fever', 'Fatigue', 'Weakness', 'Night sweats', 'Weight changes'],
    gender: 'all'
  }
];

const BodyPartSelector: React.FC<BodyPartSelectorProps> = ({ 
  onBodyPartSelect, 
  onSelectBodyPart,
  selectedBodyPart,
  selectedGender = 'all'
}) => {
  const [hoveredBodyPart, setHoveredBodyPart] = useState<BodyPart | null>(null);
  
  const handleBodyPartClick = (bodyPart: BodyPart) => {
    const bodyPartWithLabel = {
      ...bodyPart,
      label: bodyPart.label || bodyPart.name
    };
    
    if (onBodyPartSelect) {
      onBodyPartSelect(bodyPartWithLabel);
    }
    
    if (onSelectBodyPart) {
      onSelectBodyPart(bodyPartWithLabel);
    }
  };

  // Filter body parts based on selected gender
  const filteredBodyParts = bodyParts.filter(part => 
    part.gender === 'all' || part.gender === selectedGender
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Body Part</h2>
      <p className="text-gray-600 mb-6">
        Please select the area where you're experiencing symptoms to help us better understand your condition.
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredBodyParts.map((part) => (
          <div
            key={part.id}
            onClick={() => handleBodyPartClick(part)}
            className={`
              flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer transition-all
              ${selectedBodyPart?.id === part.id 
                ? 'bg-teal-100 border-2 border-teal-500 shadow-md' 
                : 'border border-gray-200 hover:border-teal-300 hover:bg-teal-50'}
              ${part.gender === 'female' ? 'border-pink-200 hover:border-pink-300 hover:bg-pink-50' : ''}
              ${part.gender === 'male' ? 'border-blue-200 hover:border-blue-300 hover:bg-blue-50' : ''}
              ${selectedBodyPart?.id === part.id && part.gender === 'female' ? 'bg-pink-100 border-2 border-pink-500' : ''}
              ${selectedBodyPart?.id === part.id && part.gender === 'male' ? 'bg-blue-100 border-2 border-blue-500' : ''}
            `}
          >
            <div className="mb-3">{part.icon}</div>
            <span className="text-center text-sm font-medium">{part.name}</span>
          </div>
        ))}
      </div>

      {selectedBodyPart && (
        <div className={`mt-6 p-4 rounded-lg 
          ${selectedBodyPart.gender === 'female' ? 'bg-pink-50' : 
            selectedBodyPart.gender === 'male' ? 'bg-blue-50' : 'bg-teal-50'}`}>
          <h3 className={`font-medium mb-2 
            ${selectedBodyPart.gender === 'female' ? 'text-pink-800' : 
              selectedBodyPart.gender === 'male' ? 'text-blue-800' : 'text-teal-800'}`}>
            Common symptoms for {selectedBodyPart.name}:
          </h3>
          <ul className="list-disc pl-5 text-gray-700">
            {selectedBodyPart.commonSymptoms.map((symptom, index) => (
              <li key={index}>{symptom}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BodyPartSelector;
export type { BodyPart }; 