import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { SymptomFormData } from '../components/symptom-checker/SymptomForm';

const GEMINI_API_KEY = 'AIzaSyCrU95g64dkZ16WP9-sYlJPxdH38u0ej9A';
const MODEL_NAME = 'gemini-2.0-flash';
const VISION_MODEL_NAME = 'gemini-2.0-flash';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Interface for API response prediction structure
export interface Prediction {
  possibleCauses: {
    condition: string;
    probability: 'high' | 'medium' | 'low';
    description: string;
    urgency: 'emergency' | 'urgent' | 'routine';
  }[];
  recommendedSpecialties: string[];
  generalAdvice: string;
  disclaimer: string;
  emergencyWarning: boolean;
  genderSpecificConsiderations?: string;
}

// Convert image file to base64
const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result);
    };
    reader.onerror = error => reject(error);
  });
};

// Analyze symptoms with text only
export const analyzeSymptoms = async (
  data: any,
  files?: File[]
): Promise<Prediction> => {
  try {
    // Create a timeout promise that will reject after 20 seconds
    const timeoutPromise = new Promise<Prediction>((_, reject) => {
      setTimeout(() => {
        console.log('Gemini API request timed out');
        reject(new Error('Request timed out after 20 seconds'));
      }, 20000);
    });
    
    // Wrap the actual API call in an async function
    const analysisPromise = async (): Promise<Prediction> => {
      // If files are provided, use the multi-modal analysis
      if (files && files.length > 0) {
        return await analyzeSymptomsWithFiles(data, files);
      }

      const model = genAI.getGenerativeModel({ model: MODEL_NAME });
      
      // Configure safety settings
      const generationConfig = {
        temperature: 0.4,
        topK: 32,
        topP: 0.95,
        maxOutputTokens: 2048,
      };
      
      const safetySettings = [
        {
          category: HarmCategory.HARM_CATEGORY_HARASSMENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
        {
          category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
          threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
        },
      ];
      
      const promptText = buildPrompt(data);
      
      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: promptText }] }],
        generationConfig,
        safetySettings,
      });
      
      const response = result.response;
      const text = response.text();
      
      return parseGeminiResponse(text);
    };
    
    // Race the analysis against the timeout
    return Promise.race([analysisPromise(), timeoutPromise]);
  } catch (error) {
    console.error('Error analyzing symptoms:', error);
    return getFallbackPrediction();
  }
};

// Analyze symptoms with multiple files (images and PDFs)
export const analyzeSymptomsWithFiles = async (
  data: any,
  files: File[]
): Promise<Prediction> => {
  try {
    const model = genAI.getGenerativeModel({ model: VISION_MODEL_NAME });
    
    // Configure safety settings
    const generationConfig = {
      temperature: 0.4,
      topK: 32,
      topP: 0.95,
      maxOutputTokens: 2048,
    };
    
    const safetySettings = [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
      },
    ];
    
    const promptText = buildPrompt(data);
    
    // Add file analysis instructions based on gender and file types
    const gender = data.gender || 'unknown';
    let fileAnalysisInstructions = `
Analyze the provided medical files in conjunction with the patient's symptoms. 
These files may include medical reports, test results, images of symptoms, or other relevant medical information.
Look for visual indicators and textual information that may help with diagnosis.
`;

    if (gender === 'female' || gender === 'male') {
      fileAnalysisInstructions += `
Consider gender-specific anatomical differences and health conditions when analyzing these files.
For a ${gender} patient, pay attention to gender-specific presentations of conditions shown in these documents.
`;
    }

    const fileTypes = files.map(file => file.type).join(', ');
    fileAnalysisInstructions += `
The provided files are of the following types: ${fileTypes}.
Extract all relevant information from these files to enhance your analysis.
`;

    const enhancedPrompt = promptText + fileAnalysisInstructions;
    
    // Convert all files to inline data parts
    const fileParts = await Promise.all(
      files.map(async (file) => {
        const base64Data = await getBase64(file);
        return {
          inlineData: {
            mimeType: file.type,
            data: base64Data.split(",")[1] 
          }
        };
      })
    );
    
    // Create parts array with text prompt first, then all files
    const parts = [{ text: enhancedPrompt }, ...fileParts];
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts }],
      generationConfig,
      safetySettings,
    });
    
    const response = result.response;
    const text = response.text();
    
    return parseGeminiResponse(text);
  } catch (error) {
    console.error('Error analyzing symptoms with files:', error);
    return getFallbackPrediction();
  }
};

// This function is kept for backward compatibility
export const analyzeSymptomsWithImage = async (
  data: any,
  imageFile: File
): Promise<Prediction> => {
  return analyzeSymptomsWithFiles(data, [imageFile]);
};

// Build a prompt for the Gemini API based on symptom data
const buildPrompt = (data: any): string => {
  const bodyPart = data.bodyPartId || 'unspecified';
  const symptoms = data.symptoms?.join(', ') || 'unspecified';
  const details = JSON.stringify(data.symptomDetails || {});
  const age = data.age || 'unknown';
  const gender = data.gender || 'unknown';
  const medicalHistory = data.medicalHistory?.join(', ') || 'none reported';
  const additionalNotes = data.additionalNotes || 'none provided';

  // Gender-specific context for the analysis
  let genderContext = '';
  if (gender === 'female') {
    genderContext = `
Consider female-specific conditions and factors such as:
- Reproductive health issues (menstruation, pregnancy, menopause)
- Higher risk of certain autoimmune disorders
- Anatomical differences that may affect symptom presentation
- Different cardiovascular symptom presentation compared to males`;
  } else if (gender === 'male') {
    genderContext = `
Consider male-specific conditions and factors such as:
- Prostate and testicular health issues
- Different fat distribution patterns affecting certain conditions
- Higher risk of certain cardiovascular conditions
- Different hormonal influences on symptoms`;
  } else if (gender === 'other' || gender === 'prefer_not_to_say') {
    genderContext = `
Consider both male and female conditions as potentially relevant, and:
- Focus on symptoms rather than gender-specific assumptions
- Consider hormonal therapy effects if mentioned in medical history
- Be inclusive in your analysis of possible conditions`;
  }

  return `
You are an AI medical assistant. Analyze the following symptoms and provide a structured response. 
The response should be returned as JSON with the fields: 
- possibleCauses (array of conditions with probability, description, and urgency)
- recommendedSpecialties (array of medical specialties)
- generalAdvice (string)
- disclaimer (string)
- emergencyWarning (boolean)
- genderSpecificConsiderations (string with any gender-specific advice or considerations)

PATIENT INFORMATION:
- Body part affected: ${bodyPart}
- Symptoms: ${symptoms}
- Symptom details: ${details}
- Age: ${age}
- Gender: ${gender}
- Medical history: ${medicalHistory}
- Additional notes: ${additionalNotes}

${genderContext}

IMPORTANT: Your analysis must include at least 2-3 possible conditions for these symptoms, with a probability assessment (high, medium, or low) 
and urgency level (emergency, urgent, routine) for each. Flag any potentially emergency conditions.

When analyzing symptoms, consider how they may present differently based on the patient's gender and age. Some conditions have different prevalence rates or symptom presentations between genders.

In the genderSpecificConsiderations field, include any specific advice, screening recommendations, or information that is particularly relevant to the patient's gender in relation to their symptoms.

Format your response as a valid JSON object without any additional text before or after.
`;
};

// Parse the Gemini API response into a structured prediction
const parseGeminiResponse = (content: string): Prediction => {
  try {
    // Try to parse the JSON response
    // First, find the JSON part within the potential text response
    const jsonMatch = content.match(/(\{[\s\S]*\})/);
    const jsonString = jsonMatch ? jsonMatch[0] : content;
    
    const parsedResponse = JSON.parse(jsonString);
    
    // Ensure the response has the expected structure
    const prediction: Prediction = {
      possibleCauses: parsedResponse.possibleCauses || [],
      recommendedSpecialties: parsedResponse.recommendedSpecialties || [],
      generalAdvice: parsedResponse.generalAdvice || '',
      disclaimer: parsedResponse.disclaimer || 'This is not medical advice. Consult a healthcare professional.',
      emergencyWarning: parsedResponse.emergencyWarning || false,
      genderSpecificConsiderations: parsedResponse.genderSpecificConsiderations || '',
    };
    
    return prediction;
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    return getFallbackPrediction();
  }
};

// Fallback prediction if API fails
const getFallbackPrediction = (): Prediction => {
  return {
    possibleCauses: [
      {
        condition: 'Cannot determine',
        probability: 'medium',
        description: 'We could not analyze your symptoms at this time. Please consult with a healthcare provider.',
        urgency: 'routine',
      },
    ],
    recommendedSpecialties: ['Primary Care Physician'],
    generalAdvice: 'If symptoms persist or worsen, please consult with a healthcare provider.',
    disclaimer: 'This is not medical advice. Always consult with a qualified healthcare professional for any medical concerns.',
    emergencyWarning: false,
    genderSpecificConsiderations: '',
  };
};

export default {
  analyzeSymptoms,
  analyzeSymptomsWithImage,
}; 