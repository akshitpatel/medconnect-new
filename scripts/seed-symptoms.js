/**
 * Seed script for symptoms collection
 * Usage: node scripts/seed-symptoms.js
 */

require('dotenv').config();
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('MONGODB_URI not found in environment variables');
  process.exit(1);
}

const dbName = uri.includes('mongodb+srv') ? uri.split('/').pop()?.split('?')[0] : 'healcard';

// Initial symptom data organized by body part
const symptomData = [
  // Head symptoms
  {
    id: 'headache',
    name: 'Headache',
    relatedBodyParts: ['head'],
    followUpQuestions: [
      'How would you rate your headache pain from 1-10?',
      'Is the pain localized to a specific area?',
      'Does the pain come and go or is it constant?'
    ]
  },
  {
    id: 'dizziness',
    name: 'Dizziness',
    relatedBodyParts: ['head'],
    followUpQuestions: [
      'Do you feel like the room is spinning?',
      'Is your dizziness triggered by certain movements?',
      'Have you experienced any hearing changes?'
    ]
  },
  {
    id: 'vision_changes',
    name: 'Vision changes',
    relatedBodyParts: ['head', 'eyes'],
    followUpQuestions: [
      'Are you seeing spots or floaters?',
      'Any blurred vision or double vision?',
      'Any light sensitivity?'
    ]
  },
  
  // Chest symptoms
  {
    id: 'chest_pain',
    name: 'Chest pain',
    relatedBodyParts: ['chest'],
    followUpQuestions: [
      'Is the pain sharp, dull, or pressure-like?',
      'Does the pain radiate to other areas?',
      'Is it related to exertion?'
    ]
  },
  {
    id: 'shortness_of_breath',
    name: 'Shortness of breath',
    relatedBodyParts: ['chest', 'lungs'],
    followUpQuestions: [
      'Does it occur at rest or with activity?',
      'How long have you been experiencing this?',
      'Any cough accompanying this?'
    ]
  },
  {
    id: 'palpitations',
    name: 'Heart palpitations',
    relatedBodyParts: ['chest', 'heart'],
    followUpQuestions: [
      'Do you feel your heart racing, fluttering, or skipping beats?',
      'How long do episodes last?',
      'Any lightheadedness with palpitations?'
    ]
  },
  
  // Abdomen symptoms
  {
    id: 'abdominal_pain',
    name: 'Abdominal pain',
    relatedBodyParts: ['abdomen', 'stomach'],
    followUpQuestions: [
      'Where exactly is the pain located?',
      'Is it worse after eating?',
      'Any nausea or vomiting?'
    ]
  },
  {
    id: 'nausea',
    name: 'Nausea',
    relatedBodyParts: ['abdomen', 'stomach'],
    followUpQuestions: [
      'Have you vomited?',
      'Is it related to eating?',
      'Any recent food changes?'
    ]
  },
  {
    id: 'diarrhea',
    name: 'Diarrhea',
    relatedBodyParts: ['abdomen', 'intestines'],
    followUpQuestions: [
      'How many bowel movements per day?',
      'Any blood in the stool?',
      'Any fever accompanying this?'
    ]
  },
  
  // Back symptoms
  {
    id: 'back_pain',
    name: 'Back pain',
    relatedBodyParts: ['back'],
    followUpQuestions: [
      'Is the pain in your upper, middle, or lower back?',
      'Does it radiate to your legs?',
      'What makes it better or worse?'
    ]
  },
  {
    id: 'stiffness',
    name: 'Stiffness',
    relatedBodyParts: ['back', 'joints'],
    followUpQuestions: [
      'Is it worse in the morning?',
      'Does it improve with movement?',
      'Any swelling in the area?'
    ]
  },
  
  // Limbs symptoms
  {
    id: 'joint_pain',
    name: 'Joint pain',
    relatedBodyParts: ['limbs', 'joints'],
    followUpQuestions: [
      'Which joints are affected?',
      'Any swelling, redness, or warmth?',
      'Is the pain worse with movement?'
    ]
  },
  {
    id: 'muscle_pain',
    name: 'Muscle pain',
    relatedBodyParts: ['limbs', 'muscles'],
    followUpQuestions: [
      'Are specific muscles affected?',
      'Any recent injuries or overuse?',
      'Any weakness accompanying the pain?'
    ]
  },
  {
    id: 'numbness',
    name: 'Numbness or tingling',
    relatedBodyParts: ['limbs', 'nerves'],
    followUpQuestions: [
      'Where exactly do you feel numbness?',
      'Is it constant or intermittent?',
      'Any weakness in the affected area?'
    ]
  },
  
  // Female reproductive symptoms
  {
    id: 'abnormal_bleeding',
    name: 'Abnormal vaginal bleeding',
    relatedBodyParts: ['reproductive_female'],
    followUpQuestions: [
      'Is the bleeding between periods or after menopause?',
      'How heavy is the bleeding compared to your normal periods?',
      'Any pain associated with the bleeding?'
    ]
  },
  {
    id: 'menstrual_pain',
    name: 'Painful periods',
    relatedBodyParts: ['reproductive_female'],
    followUpQuestions: [
      'How severe is the pain on a scale of 1-10?',
      'Does pain medication help relieve the symptoms?',
      'Does the pain interfere with daily activities?'
    ]
  },
  {
    id: 'irregular_periods',
    name: 'Irregular periods',
    relatedBodyParts: ['reproductive_female'],
    followUpQuestions: [
      'How has your cycle length changed?',
      'Have you missed periods entirely?',
      'Any changes in flow amount or duration?'
    ]
  },
  {
    id: 'vaginal_discharge',
    name: 'Vaginal discharge',
    relatedBodyParts: ['reproductive_female'],
    followUpQuestions: [
      'What color is the discharge?',
      'Does it have an unusual odor?',
      'Any itching or burning with the discharge?'
    ]
  },
  {
    id: 'pelvic_pain',
    name: 'Pelvic pain',
    relatedBodyParts: ['reproductive_female'],
    followUpQuestions: [
      'Is the pain constant or intermittent?',
      'Does the pain occur during intercourse?',
      'Any changes in your menstrual cycle with the pain?'
    ]
  },
  
  // Breast symptoms
  {
    id: 'breast_pain',
    name: 'Breast pain',
    relatedBodyParts: ['breast'],
    followUpQuestions: [
      'Is the pain in one breast or both?',
      'Is the pain related to your menstrual cycle?',
      'Any lumps or skin changes?'
    ]
  },
  {
    id: 'breast_lump',
    name: 'Breast lump',
    relatedBodyParts: ['breast'],
    followUpQuestions: [
      'When did you first notice the lump?',
      'Has the lump changed in size?',
      'Is there any pain associated with the lump?'
    ]
  },
  {
    id: 'nipple_discharge',
    name: 'Nipple discharge',
    relatedBodyParts: ['breast'],
    followUpQuestions: [
      'What color is the discharge?',
      'Is it from one breast or both?',
      'Does it happen spontaneously or only with pressure?'
    ]
  },
  
  // Pregnancy symptoms
  {
    id: 'morning_sickness',
    name: 'Morning sickness',
    relatedBodyParts: ['pregnancy'],
    followUpQuestions: [
      'How frequently are you experiencing nausea or vomiting?',
      'Are you able to keep food and liquids down?',
      'How far along are you in your pregnancy?'
    ]
  },
  {
    id: 'pregnancy_bleeding',
    name: 'Pregnancy bleeding or spotting',
    relatedBodyParts: ['pregnancy'],
    followUpQuestions: [
      'How heavy is the bleeding?',
      'Is there any pain with the bleeding?',
      'How far along are you in your pregnancy?'
    ]
  },
  {
    id: 'decreased_fetal_movement',
    name: 'Decreased fetal movement',
    relatedBodyParts: ['pregnancy'],
    followUpQuestions: [
      'When did you last feel movement?',
      'How far along are you in your pregnancy?',
      'Have you tried any methods to stimulate movement?'
    ]
  },
  
  // Menopause symptoms
  {
    id: 'hot_flashes',
    name: 'Hot flashes',
    relatedBodyParts: ['menopause'],
    followUpQuestions: [
      'How frequently do you experience hot flashes?',
      'How long do they typically last?',
      'Do they interfere with sleep or daily activities?'
    ]
  },
  {
    id: 'night_sweats',
    name: 'Night sweats',
    relatedBodyParts: ['menopause'],
    followUpQuestions: [
      'How frequently do they occur?',
      'How severely do they disrupt your sleep?',
      'Have you noticed any other associated symptoms?'
    ]
  },
  {
    id: 'vaginal_dryness',
    name: 'Vaginal dryness',
    relatedBodyParts: ['menopause'],
    followUpQuestions: [
      'Does it cause pain during intercourse?',
      'Have you tried any treatments for relief?',
      'Any associated itching or burning?'
    ]
  },
  
  // Male reproductive symptoms
  {
    id: 'testicular_pain',
    name: 'Testicular pain',
    relatedBodyParts: ['reproductive_male'],
    followUpQuestions: [
      'Is the pain in one or both testicles?',
      'Did the pain start suddenly or gradually?',
      'Any swelling or lumps in the testicles?'
    ]
  },
  {
    id: 'erectile_dysfunction',
    name: 'Erectile dysfunction',
    relatedBodyParts: ['reproductive_male'],
    followUpQuestions: [
      'When did this problem begin?',
      'Does it happen with all sexual encounters?',
      'Any medications you are currently taking?'
    ]
  },
  {
    id: 'prostate_issues',
    name: 'Prostate issues',
    relatedBodyParts: ['reproductive_male'],
    followUpQuestions: [
      'Do you have difficulty starting urination?',
      'Do you need to urinate frequently, especially at night?',
      'Any burning sensation during urination?'
    ]
  }
];

async function seedSymptoms() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db(dbName);
    const collection = db.collection('symptoms');
    
    // Check if collection is empty
    const count = await collection.countDocuments();
    if (count > 0) {
      console.log('Symptoms collection already has data. Skipping seed.');
      return;
    }
    
    // Insert all symptoms
    const result = await collection.insertMany(symptomData);
    console.log(`✅ Successfully added ${result.insertedCount} symptoms to the database`);
    
  } catch (error) {
    console.error('❌ Error seeding symptoms:', error);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

// Run the seed function
seedSymptoms()
  .then(() => console.log('Seeding complete'))
  .catch(err => console.error('Seeding failed:', err)); 