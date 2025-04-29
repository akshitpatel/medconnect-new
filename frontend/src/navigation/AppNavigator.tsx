import React from 'react';

// AppNavigator stub for web version

// Import necessary screens
import LoginScreen from '../features/auth/screens/LoginScreen';
import HomeScreen from '../features/home/screens/HomeScreen';
import ProviderSearchScreen from '../features/providers/screens/ProviderSearchScreen';
import EmergencyScreen from '../features/emergency/screens/EmergencyScreen';

// Main App Navigator
const AppNavigator = ({ children }: { children?: React.ReactNode }) => {
  return (
    <div>
      {/* Navigation logic is not needed on web. Render children directly. */}
      {children || <div>Navigation placeholder</div>}
    </div>
  );
};

export default AppNavigator;