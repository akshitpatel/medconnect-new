# MedConnect Mobile App Implementation Guide

## Overview

This document provides detailed implementation guidance for the MedConnect mobile application using React Native and Google Gemini AI integration. The app will focus on providing patients with a comprehensive health management platform, featuring provider search capabilities, appointment booking, Health Passport, and AI-driven health insights.

## Development Environment Setup

### Prerequisites
- Node.js (LTS version)
- npm or yarn
- React Native CLI
- Android Studio / Xcode
- JDK 11
- Firebase account
- Google Cloud account (for Gemini API)
- VS Code with React Native extensions (recommended)

### Initial Project Setup
```bash
# Create a new React Native project with TypeScript template
npx react-native init MedConnectMobile --template react-native-template-typescript

# Navigate to project directory
cd MedConnectMobile

# Add initial dependencies
# Core
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs @react-navigation/drawer
npm install react-native-screens react-native-safe-area-context
npm install react-native-paper react-native-vector-icons
npm install @google/generative-ai

# Firebase
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
npm install @react-native-firebase/messaging @react-native-firebase/crashlytics @react-native-firebase/analytics

# Storage and state management
npm install @react-native-async-storage/async-storage
npm install realm
npm install zustand

# UI and animations
npm install react-native-reanimated react-native-gesture-handler
npm install react-native-svg
npm install lottie-react-native
npm install react-native-fast-image

# Forms and validation
npm install react-hook-form zod @hookform/resolvers

# Utilities
npm install axios
npm install react-native-geolocation-service
npm install react-native-maps
npm install react-native-document-picker
npm install react-native-qrcode-svg
npm install react-native-voice
npm install date-fns

# Install pod dependencies for iOS
cd ios && pod install && cd ..
```

## Project Structure

The React Native application will follow a feature-based architecture:

```
src/
├── api/                # API service layer
│   ├── auth.ts         # Authentication API
│   ├── providers.ts    # Healthcare providers API
│   ├── appointments.ts # Appointments API
│   └── gemini.ts       # Gemini AI API wrapper
├── assets/             # Static assets
│   ├── images/         # Image files
│   ├── animations/     # Lottie animations
│   └── icons/          # Custom icons
├── components/         # Shared components
│   ├── ui/             # UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Input.tsx
│   └── common/         # Common feature components
│       ├── Header.tsx
│       ├── ProviderCard.tsx
│       └── HealthDocument.tsx
├── context/            # React Context providers
│   ├── AuthContext.tsx # Authentication context
│   └── ThemeContext.tsx # Theme context
├── features/           # Feature modules
│   ├── auth/           # Authentication
│   │   ├── screens/    # Screen components
│   │   └── components/ # Feature-specific components
│   ├── home/           # Home dashboard
│   ├── search/         # Provider search
│   ├── appointments/   # Appointment booking
│   ├── health-passport/ # Health passport
│   ├── medications/    # Medication management
│   ├── emergency/      # Emergency features
│   └── ai-tools/       # AI-powered tools
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   ├── useGemini.ts
│   └── useOffline.ts
├── navigation/         # Navigation configuration
│   ├── AppNavigator.tsx
│   ├── AuthNavigator.tsx
│   └── TabNavigator.tsx
├── services/           # Service integrations
│   ├── firebase.ts     # Firebase setup
│   ├── gemini.ts       # Gemini AI setup
│   └── storage.ts      # Storage utilities
├── store/              # State management
│   ├── auth.ts         # Auth state
│   └── app.ts          # App state
├── theme/              # Theming
│   ├── colors.ts
│   ├── typography.ts
│   └── spacing.ts
├── types/              # TypeScript type definitions
│   ├── api.ts
│   ├── models.ts
│   └── navigation.ts
└── utils/              # Utility functions
    ├── formatters.ts
    ├── validators.ts
    └── permissions.ts
```

## Key Implementation Areas

### 1. Theme Implementation

Create a consistent theme that aligns with the web application:

```typescript
// src/theme/colors.ts
export const colors = {
  primary: '#1A73E8',
  secondary: '#4285F4',
  background: '#F8F9FA',
  surface: '#FFFFFF',
  error: '#EA4335',
  success: '#34A853',
  warning: '#FBBC05',
  text: {
    primary: '#202124',
    secondary: '#5F6368',
    disabled: '#9AA0A6',
    inverse: '#FFFFFF'
  },
  border: '#DADCE0',
  divider: '#EBEBEB',
  elevation: {
    level1: 'rgba(0, 0, 0, 0.05)',
    level2: 'rgba(0, 0, 0, 0.08)',
    level3: 'rgba(0, 0, 0, 0.12)'
  }
};

// src/theme/typography.ts
export const typography = {
  fontFamily: {
    regular: 'Roboto-Regular',
    medium: 'Roboto-Medium',
    bold: 'Roboto-Bold'
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 30
  },
  lineHeight: {
    xs: 16,
    sm: 20,
    md: 24,
    lg: 28,
    xl: 32,
    xxl: 36,
    xxxl: 42
  }
};

// src/theme/spacing.ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64
};

// src/theme/index.ts
import { colors } from './colors';
import { typography } from './typography';
import { spacing } from './spacing';

export const theme = {
  colors,
  typography,
  spacing
};
```

### 2. Authentication Implementation

Set up Firebase Authentication with the following features:
- Email/password authentication
- Social logins (Google, Apple)
- Phone number verification
- Biometric authentication

```typescript
// src/services/firebase.ts
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { appleAuth } from '@invertase/react-native-apple-authentication';

// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID',
});

// Email/Password Authentication
export const signUpWithEmail = async (email: string, password: string) => {
  try {
    return await auth().createUserWithEmailAndPassword(email, password);
  } catch (error) {
    throw error;
  }
};

export const signInWithEmail = async (email: string, password: string) => {
  try {
    return await auth().signInWithEmailAndPassword(email, password);
  } catch (error) {
    throw error;
  }
};

// Google Authentication
export const signInWithGoogle = async () => {
  try {
    const { idToken } = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    return await auth().signInWithCredential(googleCredential);
  } catch (error) {
    throw error;
  }
};

// Apple Authentication
export const signInWithApple = async () => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    
    const { identityToken, nonce } = appleAuthRequestResponse;
    
    if (identityToken) {
      const appleCredential = auth.AppleAuthProvider.credential(identityToken, nonce);
      return await auth().signInWithCredential(appleCredential);
    } else {
      throw new Error('Apple Sign-In failed: No identity token returned');
    }
  } catch (error) {
    throw error;
  }
};

// Phone Authentication
export const signInWithPhone = async (phoneNumber: string) => {
  try {
    return await auth().signInWithPhoneNumber(phoneNumber);
  } catch (error) {
    throw error;
  }
};

// Sign Out
export const signOut = async () => {
  try {
    await auth().signOut();
  } catch (error) {
    throw error;
  }
};
```

### 3. Gemini AI Integration

Integrate Google Generative AI SDK to power the app's AI features:

```typescript
// src/services/gemini.ts
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API with the API key
const API_KEY = 'AIzaSyCrU95g64dkZ16WP9-sYlJPxdH38u0ej9A';
const genAI = new GoogleGenerativeAI(API_KEY);

// Get the specific models
const getFlashModel = () => genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
const getProModel = () => genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

// Symptom checker using Gemini Flash
export const checkSymptoms = async (symptoms: string): Promise<string> => {
  try {
    const model = getFlashModel();
    const prompt = `I have the following symptoms: ${symptoms}. What might be the potential causes? Should I see a doctor? Please provide brief information about each potential condition.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in symptom checking:', error);
    throw error;
  }
};

// Health document analysis using Gemini Pro
export const analyzeHealthDocument = async (documentText: string): Promise<string> => {
  try {
    const model = getProModel();
    const prompt = `Please analyze and summarize the following medical document in simple terms: ${documentText}`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in document analysis:', error);
    throw error;
  }
};

// Generate provider recommendations based on symptoms
export const recommendProviders = async (symptoms: string): Promise<string> => {
  try {
    const model = getFlashModel();
    const prompt = `Based on these symptoms: ${symptoms}, what type of medical specialist should I see?`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in provider recommendations:', error);
    throw error;
  }
};

// AI chatbot for health queries
export const chatWithHealthAssistant = async (
  history: Array<{ role: 'user' | 'model', text: string }>,
  newMessage: string
): Promise<string> => {
  try {
    const model = getFlashModel();
    
    // Prepare chat history in the format expected by the model
    const chat = model.startChat({
      history: history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }],
      })),
    });
    
    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in health assistant chat:', error);
    throw error;
  }
};

// Medication information retrieval
export const getMedicationInfo = async (medicationName: string): Promise<string> => {
  try {
    const model = getFlashModel();
    const prompt = `Provide concise information about ${medicationName} including its uses, common side effects, and important precautions. Format this as bullet points.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in medication information retrieval:', error);
    throw error;
  }
};
```

### 4. Health Passport Implementation

The Health Passport feature allows users to store, manage, and share their medical documents:

```typescript
// src/features/health-passport/screens/HealthPassportScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text, FAB, Searchbar, Chip, ActivityIndicator } from 'react-native-paper';
import DocumentPicker from 'react-native-document-picker';
import { useNavigation } from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { useGemini } from '../../../hooks/useGemini';
import HealthDocumentCard from '../components/HealthDocumentCard';
import { theme } from '../../../theme';

const HealthPassportScreen = () => {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const { analyzeHealthDocument } = useGemini();
  
  const categories = [
    'All', 'Prescriptions', 'Lab Reports', 'Vaccinations', 
    'Medical History', 'Insurance', 'Other'
  ];
  
  // Fetch user's documents
  useEffect(() => {
    const userId = auth().currentUser?.uid;
    if (!userId) return;
    
    const subscriber = firestore()
      .collection('users')
      .doc(userId)
      .collection('healthDocuments')
      .onSnapshot(querySnapshot => {
        const docs = [];
        querySnapshot.forEach(documentSnapshot => {
          docs.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setDocuments(docs);
        setLoading(false);
      });
      
    return () => subscriber();
  }, []);
  
  // Filter documents based on search and category
  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (doc.tags && doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())));
      
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Upload new document
  const handleDocumentUpload = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [DocumentPicker.types.pdf, DocumentPicker.types.images],
      });
      
      // Show uploading indicator
      setLoading(true);
      
      const userId = auth().currentUser?.uid;
      const fileRef = `users/${userId}/healthDocuments/${Date.now()}_${result[0].name}`;
      const reference = storage().ref(fileRef);
      
      // Upload the file
      await reference.putFile(result[0].uri);
      
      // Get download URL
      const url = await reference.getDownloadURL();
      
      // Add document metadata to Firestore
      await firestore()
        .collection('users')
        .doc(userId)
        .collection('healthDocuments')
        .add({
          title: result[0].name,
          category: 'Other',
          url: url,
          filePath: fileRef,
          fileType: result[0].type,
          createdAt: firestore.FieldValue.serverTimestamp(),
          tags: [],
        });
        
      setLoading(false);
    } catch (error) {
      if (!DocumentPicker.isCancel(error)) {
        console.error('Error uploading document:', error);
      }
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Search documents"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      
      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <Chip
            selected={selectedCategory === item}
            onPress={() => setSelectedCategory(item)}
            style={styles.categoryChip}
            selectedColor={theme.colors.primary}
          >
            {item}
          </Chip>
        )}
        contentContainerStyle={styles.categoriesContainer}
        showsHorizontalScrollIndicator={false}
      />
      
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} style={styles.loader} />
      ) : filteredDocuments.length > 0 ? (
        <FlatList
          data={filteredDocuments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HealthDocumentCard
              document={item}
              onAnalyze={async () => {
                // This would extract text from the document first
                // For demonstration, we're just passing the title
                const analysis = await analyzeHealthDocument(item.title);
                navigation.navigate('DocumentAnalysis', { document: item, analysis });
              }}
            />
          )}
          contentContainerStyle={styles.documentsContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No documents found</Text>
        </View>
      )}
      
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleDocumentUpload}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchBar: {
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    elevation: 2,
  },
  categoriesContainer: {
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  categoryChip: {
    marginRight: theme.spacing.sm,
  },
  documentsContainer: {
    padding: theme.spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSize.lg,
    color: theme.colors.text.secondary,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    margin: theme.spacing.lg,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.primary,
  },
});

export default HealthPassportScreen;
```

### 5. Emergency Button Implementation

```typescript
// src/features/emergency/screens/EmergencyScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, Platform, Linking } from 'react-native';
import { Button, Text, Dialog, Portal, List, Avatar } from 'react-native-paper';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import LottieView from 'lottie-react-native';
import { theme } from '../../../theme';

const EmergencyScreen = () => {
  const [location, setLocation] = useState(null);
  const [emergencyContacts, setEmergencyContacts] = useState([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [requesting, setRequesting] = useState(false);
  
  // Fetch emergency contacts
  useEffect(() => {
    const userId = auth().currentUser?.uid;
    if (!userId) return;
    
    const subscriber = firestore()
      .collection('users')
      .doc(userId)
      .collection('emergencyContacts')
      .onSnapshot(querySnapshot => {
        const contacts = [];
        querySnapshot.forEach(documentSnapshot => {
          contacts.push({
            id: documentSnapshot.id,
            ...documentSnapshot.data(),
          });
        });
        setEmergencyContacts(contacts);
      });
      
    return () => subscriber();
  }, []);
  
  // Request location permission
  const requestLocationPermission = async () => {
    try {
      const permission = Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      });
      
      const result = await request(permission);
      
      if (result === RESULTS.GRANTED) {
        getLocation();
        return true;
      } else {
        Alert.alert(
          'Location Permission',
          'Location permission is required for emergency services',
          [{ text: 'OK' }]
        );
        return false;
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
      return false;
    }
  };
  
  // Get current location
  const getLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        console.error('Error getting location:', error);
        Alert.alert('Error', 'Unable to get your location. Please try again.');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };
  
  // Handle emergency button press
  const handleEmergencyPress = async () => {
    setDialogVisible(true);
    const hasPermission = await requestLocationPermission();
    
    if (!hasPermission) {
      return;
    }
  };
  
  // Call emergency services
  const callEmergency = () => {
    Linking.openURL('tel:108'); // India's emergency number
    setDialogVisible(false);
  };
  
  // Notify emergency contacts
  const notifyContacts = async () => {
    if (emergencyContacts.length === 0) {
      Alert.alert('No Emergency Contacts', 'Please add emergency contacts in your profile settings.');
      return;
    }
    
    setRequesting(true);
    
    try {
      const userId = auth().currentUser?.uid;
      const userName = auth().currentUser?.displayName || 'A user';
      
      // Store emergency request in Firestore
      const emergencyRequest = await firestore()
        .collection('emergencyRequests')
        .add({
          userId,
          userName,
          location,
          status: 'active',
          timestamp: firestore.FieldValue.serverTimestamp(),
          contactsNotified: emergencyContacts.map(contact => contact.id),
        });
      
      // In a real app, you would send SMS or push notifications here
      // This is a simplified demonstration
      
      Alert.alert(
        'Emergency Contacts Notified',
        'Your emergency contacts have been notified of your situation and location.',
        [{ text: 'OK' }]
      );
      
      setRequesting(false);
      setDialogVisible(false);
    } catch (error) {
      console.error('Error notifying contacts:', error);
      Alert.alert('Error', 'Failed to notify emergency contacts. Please try again.');
      setRequesting(false);
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <LottieView
          source={require('../../../assets/animations/emergency-pulse.json')}
          style={styles.animation}
          autoPlay
          loop
        />
        
        <Button
          mode="contained"
          color={theme.colors.error}
          onPress={handleEmergencyPress}
          style={styles.emergencyButton}
          labelStyle={styles.emergencyButtonLabel}
        >
          EMERGENCY
        </Button>
        
        <Text style={styles.helpText}>
          Tap the button above in case of a medical emergency.
          This will connect you to emergency services and notify your emergency contacts.
        </Text>
      </View>
      
      <Portal>
        <Dialog visible={dialogVisible} onDismiss={() => setDialogVisible(false)}>
          <Dialog.Title>Emergency Options</Dialog.Title>
          <Dialog.Content>
            <List.Item
              title="Call Emergency Services (108)"
              description="Connect directly to ambulance services"
              left={props => <Avatar.Icon {...props} icon="phone" color={theme.colors.text.inverse} style={{ backgroundColor: theme.colors.error }} />}
              onPress={callEmergency}
            />
            <List.Item
              title="Notify Emergency Contacts"
              description={`Send alert to ${emergencyContacts.length} contacts`}
              left={props => <Avatar.Icon {...props} icon="bell-alert" color={theme.colors.text.inverse} style={{ backgroundColor: theme.colors.warning }} />}
              onPress={notifyContacts}
              disabled={requesting}
            />
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
  },
  buttonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.lg,
  },
  animation: {
    width: 240,
    height: 240,
  },
  emergencyButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    backgroundColor: theme.colors.error,
    marginBottom: theme.spacing.xl,
  },
  emergencyButtonLabel: {
    fontSize: theme.typography.fontSize.xxl,
    fontFamily: theme.typography.fontFamily.bold,
  },
  helpText: {
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    color: theme.colors.text.secondary,
    fontSize: theme.typography.fontSize.md,
    maxWidth: '80%',
  },
});

export default EmergencyScreen;
```

## Implementation Timeline

### Phase 1: Project Setup and Core Features (Weeks 1-4)
- Project initialization and environment setup
- Authentication implementation
- Navigation structure
- Basic UI components
- Health Passport core functionality

### Phase 2: Main Feature Implementation (Weeks 5-10)
- Provider search and filters
- Appointment booking
- Medicine ordering
- Diagnostic test booking
- Emergency button
- Notification system

### Phase 3: AI Integration and Enhancements (Weeks 11-16)
- Gemini AI integration
- Symptom checker
- Health document analysis
- Chatbot implementation
- Offline functionality
- Comprehensive testing

### Phase 4: Final Testing and Deployment (Weeks 17-20)
- User testing and feedback
- Performance optimization
- Security audits
- App store preparation
- Initial release
- Post-launch monitoring and fixes

## Security and Compliance

- Implement secure storage for PHI using encryption
- Set up appropriate Firebase Security Rules
- Follow HIPAA compliance guidelines for mobile apps
- Implement audit logging for sensitive operations
- Conduct regular security testing and vulnerability assessments
- Set up data anonymization where appropriate
- Configure secure API communications with certificate pinning 