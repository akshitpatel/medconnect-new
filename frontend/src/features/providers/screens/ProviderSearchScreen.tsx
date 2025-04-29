import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, FlatList, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme } from '../../../theme';

// Mock data for providers
const mockProviders = [
  {
    id: '1',
    name: 'Dr. Sarah Johnson',
    specialty: 'Cardiologist',
    rating: 4.8,
    distance: '2.3 miles',
    available: true,
  },
  {
    id: '2',
    name: 'Dr. Michael Chen',
    specialty: 'Dermatologist',
    rating: 4.7,
    distance: '1.5 miles',
    available: true,
  },
  {
    id: '3',
    name: 'Dr. Emily Rodriguez',
    specialty: 'Pediatrician',
    rating: 4.9,
    distance: '3.1 miles',
    available: false,
  },
  {
    id: '4',
    name: 'Dr. James Wilson',
    specialty: 'Orthopedic Surgeon',
    rating: 4.6,
    distance: '4.2 miles',
    available: true,
  },
  {
    id: '5',
    name: 'Dr. Lisa Thompson',
    specialty: 'Neurologist',
    rating: 4.5,
    distance: '2.8 miles',
    available: true,
  },
];

const ProviderSearchScreen = ({ navigation }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProviders, setFilteredProviders] = useState(mockProviders);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text.trim() === '') {
      setFilteredProviders(mockProviders);
    } else {
      const filtered = mockProviders.filter(
        provider => 
          provider.name.toLowerCase().includes(text.toLowerCase()) ||
          provider.specialty.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredProviders(filtered);
    }
  };

  const renderProviderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.providerCard}
      onPress={() => {}}
    >
      <View style={styles.providerInfo}>
        <Text style={styles.providerName}>{item.name}</Text>
        <Text style={styles.providerSpecialty}>{item.specialty}</Text>
        <View style={styles.providerDetails}>
          <Text style={styles.providerRating}>★ {item.rating}</Text>
          <Text style={styles.providerDistance}>{item.distance}</Text>
        </View>
      </View>
      <View style={styles.availabilityContainer}>
        <View style={[
          styles.availabilityIndicator, 
          { backgroundColor: item.available ? theme.colors.success : theme.colors.error }
        ]} />
        <Text style={styles.availabilityText}>
          {item.available ? 'Available' : 'Unavailable'}
        </Text>
        <TouchableOpacity 
          style={[
            styles.bookButton,
            !item.available && styles.bookButtonDisabled
          ]}
          disabled={!item.available}
          onPress={() => {}}
        >
          <Text style={styles.bookButtonText}>Book</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Providers</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or specialty"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <View style={styles.filtersContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Specialty</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Distance</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Availability</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>Rating</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredProviders}
        renderItem={renderProviderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.providersList}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No providers found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.fontSize.xl,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.md,
  },
  searchInput: {
    height: 50,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filtersContainer: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surfaceVariant,
    justifyContent: 'space-between',
  },
  filterButton: {
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonText: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.primary,
  },
  providersList: {
    padding: theme.spacing.md,
  },
  providerCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.sm,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: theme.typography.fontSize.md,
    fontWeight: theme.typography.fontWeight.bold,
    color: theme.colors.text.primary,
    marginBottom: theme.spacing.xs,
  },
  providerSpecialty: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  providerDetails: {
    flexDirection: 'row',
  },
  providerRating: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.warning,
    marginRight: theme.spacing.md,
  },
  providerDistance: {
    fontSize: theme.typography.fontSize.sm,
    color: theme.colors.text.secondary,
  },
  availabilityContainer: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  availabilityIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: theme.spacing.xs,
  },
  availabilityText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.sm,
  },
  bookButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.sm,
  },
  bookButtonDisabled: {
    backgroundColor: theme.colors.text.disabled,
  },
  bookButtonText: {
    color: theme.colors.text.inverse,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  emptyContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.typography.fontSize.md,
    color: theme.colors.text.secondary,
  },
});

export default ProviderSearchScreen; 