import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../theme';

const EmergencyScreen = () => {
  const handleCallEmergency = (phoneNumber: string) => {
    Alert.alert(
      'Emergency Call',
      `Are you sure you want to call ${phoneNumber}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call',
          onPress: () => {
            Linking.openURL(`tel:${phoneNumber}`);
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Emergency Services</Text>
          <Text style={styles.subtitle}>
            Get immediate help in case of emergency
          </Text>
        </View>

        <View style={styles.emergencyCallSection}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          
          <TouchableOpacity 
            style={[styles.emergencyButton, styles.urgentButton]}
            onPress={() => handleCallEmergency('911')}
          >
            <Text style={styles.emergencyButtonText}>Call 911</Text>
            <Text style={styles.emergencyButtonSubtext}>
              For life-threatening emergencies
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={() => handleCallEmergency('800-222-1222')}
          >
            <Text style={styles.emergencyButtonText}>Poison Control</Text>
            <Text style={styles.emergencyButtonSubtext}>
              800-222-1222
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.emergencyButton}
            onPress={() => handleCallEmergency('800-273-8255')}
          >
            <Text style={styles.emergencyButtonText}>Mental Health Crisis</Text>
            <Text style={styles.emergencyButtonSubtext}>
              800-273-8255
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.nearbySection}>
          <Text style={styles.sectionTitle}>Nearby Emergency Facilities</Text>
          
          <TouchableOpacity style={styles.facilityCard}>
            <View>
              <Text style={styles.facilityName}>City General Hospital</Text>
              <Text style={styles.facilityAddress}>123 Medical Center Dr</Text>
              <Text style={styles.facilityDistance}>1.2 miles away</Text>
            </View>
            <View style={styles.facilityActions}>
              <TouchableOpacity 
                style={styles.facilityButton}
                onPress={() => handleCallEmergency('555-123-4567')}
              >
                <Text style={styles.facilityButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.facilityButton}
                onPress={() => {}}
              >
                <Text style={styles.facilityButtonText}>Directions</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.facilityCard}>
            <View>
              <Text style={styles.facilityName}>Urgent Care Center</Text>
              <Text style={styles.facilityAddress}>456 Health Pkwy</Text>
              <Text style={styles.facilityDistance}>2.5 miles away</Text>
            </View>
            <View style={styles.facilityActions}>
              <TouchableOpacity 
                style={styles.facilityButton}
                onPress={() => handleCallEmergency('555-987-6543')}
              >
                <Text style={styles.facilityButtonText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.facilityButton}
                onPress={() => {}}
              >
                <Text style={styles.facilityButtonText}>Directions</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.firstAidSection}>
          <Text style={styles.sectionTitle}>First Aid Information</Text>
          <TouchableOpacity style={styles.firstAidCard}>
            <Text style={styles.firstAidTitle}>CPR Instructions</Text>
            <Text style={styles.firstAidDescription}>
              Learn how to perform CPR in emergency situations
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.firstAidCard}>
            <Text style={styles.firstAidTitle}>Choking Response</Text>
            <Text style={styles.firstAidDescription}>
              Steps to help someone who is choking
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.firstAidCard}>
            <Text style={styles.firstAidTitle}>Bleeding Control</Text>
            <Text style={styles.firstAidDescription}>
              How to control severe bleeding
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
  },
  header: {
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.typography.fontSize.xxl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
  sectionTitle: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  emergencyCallSection: {
    marginBottom: theme.spacing.xl,
  },
  emergencyButton: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...theme.shadows.sm,
  },
  urgentButton: {
    backgroundColor: theme.colors.error,
    borderColor: theme.colors.error,
  },
  emergencyButtonText: {
    fontSize: theme.typography.fontSize.lg,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  emergencyButtonSubtext: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  nearbySection: {
    marginBottom: theme.spacing.xl,
  },
  facilityCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  facilityName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  facilityAddress: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  facilityDistance: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.primary,
  },
  facilityActions: {
    justifyContent: 'space-between',
  },
  facilityButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.sm,
  },
  facilityButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  firstAidSection: {
    marginBottom: theme.spacing.xl,
  },
  firstAidCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  firstAidTitle: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  firstAidDescription: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
});

export default EmergencyScreen; 