/**
 * Formats a date string to a human-readable format
 * @param dateString - ISO date string to format
 * @param options - Optional formatting options
 * @returns Formatted date string
 */
export function formatDate(
  dateString: string, 
  options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
): string {
  try {
    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      console.error(`Invalid date string: ${dateString}`);
      return 'Invalid date';
    }
    
    return date.toLocaleDateString('en-US', options);
  } catch (error) {
    console.error(`Error formatting date: ${dateString}`, error);
    return 'Error formatting date';
  }
}

/**
 * Calculate age from date of birth
 * @param dateOfBirth - ISO date string of birth date
 * @returns Age in years
 */
export function calculateAge(dateOfBirth: string): number {
  try {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    
    // Check if date is valid
    if (isNaN(birthDate.getTime())) {
      console.error(`Invalid date of birth: ${dateOfBirth}`);
      return 0;
    }
    
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    
    // Adjust age if birthday hasn't occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  } catch (error) {
    console.error(`Error calculating age from date: ${dateOfBirth}`, error);
    return 0;
  }
} 