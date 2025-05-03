// Dashboard Analytics Service
// This service handles fetching and processing dashboard analytics data

// Types for the dashboard analytics data
export interface DashboardAnalyticsData {
  timeRange: string;
  userStats: {
    total: number;
    active: number;
    new: number;
    growth: number;
  };
  appointmentStats: {
    total: number;
    completed: number;
    upcoming: number;
    cancelled: number;
  };
  systemHealth: {
    uptime: number;
    responseTime: number;
    errorRate: number;
    databaseLoad: number;
  };
  activity: {
    recentActivities: Array<{
      type: string;
      description: string;
      timestamp: string;
    }>;
  };
}

// Types for predictive analytics
export interface PredictiveAnalyticsData {
  appointmentPredictions: {
    current: number;
    predicted: number;
    trend: 'up' | 'down' | 'stable';
    percentageChange: number;
    nextWeekPrediction: number[];
  };
  userGrowthPredictions: {
    current: number;
    predicted: number;
    trend: 'up' | 'down' | 'stable';
    percentageChange: number;
    nextWeekPrediction: number[];
  };
}

// Types for user engagement metrics
export interface UserEngagementData {
  metrics: Array<{
    name: string;
    value: number;
    previousValue: number;
    change: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

// Fetch dashboard analytics data
export const fetchDashboardAnalytics = async (timeRange: string): Promise<DashboardAnalyticsData> => {
  // For development purposes, we'll use mock data to ensure the dashboard works
  // In production, this would be replaced with actual API calls
  console.log('Using mock dashboard data for time range:', timeRange);
  return getMockDashboardData(timeRange);
  
  // The following code is commented out until we have proper authentication
  // in place for the backend API
  /*
  try {
    console.log(`Attempting to fetch dashboard analytics for time range: ${timeRange}`);
    
    // Try to use the API proxy route with a timeout to prevent long waits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      const response = await fetch(`/api/admin/dashboard/analytics?timeRange=${timeRange}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Check if the response contains the expected data structure
      if (result.success && result.data) {
        console.log('Successfully fetched dashboard analytics from API');
        return result.data;
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error('Error fetching dashboard analytics:', error);
    // Fallback to mock data if API fails
    console.log('Falling back to mock dashboard data for:', timeRange);
    return getMockDashboardData(timeRange);
  }
  */
};

// Fetch predictive analytics data
export const fetchPredictiveAnalytics = async (timeRange: string): Promise<PredictiveAnalyticsData> => {
  // For development purposes, we'll use mock data to ensure the dashboard works
  // In production, this would be replaced with actual API calls
  console.log('Using mock predictive analytics data for time range:', timeRange);
  return getMockPredictiveData(timeRange);
  
  // The following code is commented out until we have proper authentication
  // in place for the backend API
  /*
  try {
    console.log(`Attempting to fetch predictive analytics for time range: ${timeRange}`);
    
    // Try to use the API proxy route with a timeout to prevent long waits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      const response = await fetch(`/api/admin/dashboard/predictive-analytics?timeRange=${timeRange}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Check if the response contains the expected data structure
      if (result.success && result.data) {
        console.log('Successfully fetched predictive analytics from API');
        return result.data;
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error('Error fetching predictive analytics:', error);
    // Fallback to mock data if API fails
    console.log('Falling back to mock predictive data for:', timeRange);
    return getMockPredictiveData(timeRange);
  }
  */
};

// Fetch user engagement metrics
export const fetchUserEngagementMetrics = async (timeRange: string): Promise<UserEngagementData> => {
  // For development purposes, we'll use mock data to ensure the dashboard works
  // In production, this would be replaced with actual API calls
  console.log('Using mock user engagement data for time range:', timeRange);
  return getMockEngagementData(timeRange);
  
  // The following code is commented out until we have proper authentication
  // in place for the backend API
  /*
  try {
    console.log(`Attempting to fetch user engagement metrics for time range: ${timeRange}`);
    
    // Try to use the API proxy route with a timeout to prevent long waits
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    try {
      const response = await fetch(`/api/admin/dashboard/user-engagement?timeRange=${timeRange}`, {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`API returned status: ${response.status}`);
      }
      
      const result = await response.json();
      
      // Check if the response contains the expected data structure
      if (result.success && result.data) {
        console.log('Successfully fetched user engagement metrics from API');
        return result.data;
      } else {
        throw new Error('Invalid response format from API');
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      throw fetchError;
    }
  } catch (error) {
    console.error('Error fetching user engagement metrics:', error);
    // Fallback to mock data if API fails
    console.log('Falling back to mock engagement data for:', timeRange);
    return getMockEngagementData(timeRange);
  }
  */
};

// Generate mock dashboard data based on time range
const getMockDashboardData = (timeRange: string): DashboardAnalyticsData => {
  // Base values that will be modified based on time range
  const baseData = {
    timeRange,
    userStats: {
      total: 8429,
      active: 6218,
      new: 342,
      growth: 12.5,
    },
    appointmentStats: {
      total: 1250,
      completed: 980,
      upcoming: 270,
      cancelled: 45,
    },
    systemHealth: {
      uptime: 99.9,
      responseTime: 120,
      errorRate: 0.8,
      databaseLoad: 45,
    },
    activity: {
      recentActivities: [
        {
          type: 'user_registration',
          description: 'New patient registered',
          timestamp: new Date(Date.now() - 10 * 60000).toISOString(),
        },
        {
          type: 'appointment_created',
          description: 'New appointment scheduled',
          timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
        },
        {
          type: 'medication_update',
          description: 'Medication database updated',
          timestamp: new Date(Date.now() - 60 * 60000).toISOString(),
        },
      ],
    },
  };

  // Modify data based on time range
  switch (timeRange) {
    case 'Today':
      return {
        ...baseData,
        userStats: {
          ...baseData.userStats,
          active: 2105,
          new: 87,
          growth: 4.2,
        },
        appointmentStats: {
          ...baseData.appointmentStats,
          total: 215,
          completed: 145,
          upcoming: 70,
          cancelled: 12,
        },
      };
    case 'This Week':
      return baseData; // Use the base data for 'This Week'
    case 'This Month':
      return {
        ...baseData,
        userStats: {
          ...baseData.userStats,
          total: 8429 * 2.5,
          active: 6218 * 2.2,
          new: 342 * 3.8,
          growth: 18.7,
        },
        appointmentStats: {
          ...baseData.appointmentStats,
          total: 1250 * 3.2,
          completed: 980 * 3.1,
          upcoming: 270 * 3.5,
          cancelled: 45 * 2.8,
        },
      };
    case 'This Year':
      return {
        ...baseData,
        userStats: {
          ...baseData.userStats,
          total: 8429 * 12,
          active: 6218 * 10,
          new: 342 * 45,
          growth: 85.3,
        },
        appointmentStats: {
          ...baseData.appointmentStats,
          total: 1250 * 48,
          completed: 980 * 47,
          upcoming: 270 * 2, // Less upcoming appointments for yearly view
          cancelled: 45 * 42,
        },
      };
    default:
      return baseData;
  }
};

// Generate mock predictive analytics data
const getMockPredictiveData = (timeRange: string): PredictiveAnalyticsData => {
  // Base prediction values
  const baseData = {
    appointmentPredictions: {
      current: 270,
      predicted: 310,
      trend: 'up' as const,
      percentageChange: 14.8,
      nextWeekPrediction: [42, 56, 48, 62, 58, 32, 12],
    },
    userGrowthPredictions: {
      current: 342,
      predicted: 385,
      trend: 'up' as const,
      percentageChange: 12.6,
      nextWeekPrediction: [48, 52, 58, 65, 72, 45, 45],
    },
  };

  // Modify predictions based on time range
  switch (timeRange) {
    case 'Today':
      return {
        appointmentPredictions: {
          ...baseData.appointmentPredictions,
          current: 70,
          predicted: 85,
          percentageChange: 21.4,
          nextWeekPrediction: [12, 18, 15, 22, 25, 10, 5],
        },
        userGrowthPredictions: {
          ...baseData.userGrowthPredictions,
          current: 87,
          predicted: 95,
          percentageChange: 9.2,
          nextWeekPrediction: [12, 15, 18, 22, 25, 15, 10],
        },
      };
    case 'This Month':
      return {
        appointmentPredictions: {
          ...baseData.appointmentPredictions,
          current: 945,
          predicted: 1050,
          percentageChange: 11.1,
          nextWeekPrediction: [150, 165, 170, 180, 175, 120, 90],
        },
        userGrowthPredictions: {
          ...baseData.userGrowthPredictions,
          current: 1300,
          predicted: 1520,
          percentageChange: 16.9,
          nextWeekPrediction: [180, 195, 210, 235, 250, 230, 220],
        },
      };
    case 'This Year':
      return {
        appointmentPredictions: {
          ...baseData.appointmentPredictions,
          current: 12960,
          predicted: 14500,
          percentageChange: 11.9,
          nextWeekPrediction: [2100, 2250, 2300, 2450, 2400, 1800, 1200],
        },
        userGrowthPredictions: {
          ...baseData.userGrowthPredictions,
          current: 15390,
          predicted: 18200,
          percentageChange: 18.3,
          nextWeekPrediction: [2400, 2550, 2700, 2850, 3000, 2700, 2000],
        },
      };
    default:
      return baseData; // Use base data for 'This Week'
  }
};

// Generate mock user engagement data
const getMockEngagementData = (timeRange: string): UserEngagementData => {
  // Base engagement metrics
  const baseData = {
    metrics: [
      {
        name: 'Active Sessions',
        value: 1250,
        previousValue: 1050,
        change: 19.0,
        trend: 'up' as const,
      },
      {
        name: 'Session Duration',
        value: 8.5, // minutes
        previousValue: 7.2,
        change: 18.1,
        trend: 'up' as const,
      },
      {
        name: 'Appointment Bookings',
        value: 342,
        previousValue: 315,
        change: 8.6,
        trend: 'up' as const,
      },
      {
        name: 'Feature Usage',
        value: 78, // percentage
        previousValue: 65,
        change: 20.0,
        trend: 'up' as const,
      },
      {
        name: 'Mobile App Usage',
        value: 62, // percentage
        previousValue: 48,
        change: 29.2,
        trend: 'up' as const,
      },
    ],
  };

  // Modify engagement data based on time range
  switch (timeRange) {
    case 'Today':
      return {
        metrics: baseData.metrics.map(metric => ({
          ...metric,
          value: Math.round(metric.value / 7), // Roughly divide by days in a week
          previousValue: Math.round(metric.previousValue / 7),
          change: metric.change * 0.8, // Slightly lower change for daily view
        })),
      };
    case 'This Month':
      return {
        metrics: baseData.metrics.map(metric => ({
          ...metric,
          value: Math.round(metric.value * 4), // Roughly multiply by weeks in a month
          previousValue: Math.round(metric.previousValue * 4),
          change: metric.change * 1.2, // Slightly higher change for monthly view
        })),
      };
    case 'This Year':
      return {
        metrics: baseData.metrics.map(metric => ({
          ...metric,
          value: Math.round(metric.value * 52), // Roughly multiply by weeks in a year
          previousValue: Math.round(metric.previousValue * 52),
          change: metric.change * 1.5, // Higher change for yearly view
        })),
      };
    default:
      return baseData; // Use base data for 'This Week'
  }
};
