# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).

puts "Starting database seed..."

# Create admin user if it doesn't exist
unless User.exists?(email: 'admin@medconnect.com')
  admin = User.create!(
    email: 'admin@medconnect.com',
    password: 'password',
    password_confirmation: 'password',
    full_name: 'Admin User',
    role: 'admin'
  )
  puts "Created admin user: #{admin.email}"
end

# Helper method to create a provider with profile
def create_provider(attributes, profile_attributes = {})
  # Check if provider already exists
  return if User.exists?(email: attributes[:email])
  
  user = User.create!(
    email: attributes[:email],
    password: 'password',
    password_confirmation: 'password',
    full_name: attributes[:name],
    role: 'provider',
    address: attributes[:address],
    phone: attributes[:phone]
  )
  
  profile = user.create_provider_profile!(
    provider_type: profile_attributes[:provider_type],
    specialization: profile_attributes[:specialization],
    bio: profile_attributes[:bio],
    profile_image_url: profile_attributes[:profile_image_url],
    facility_details: profile_attributes[:facility_details] || {},
    equipment: profile_attributes[:equipment] || [],
    insurance_providers: profile_attributes[:insurance_providers] || [],
    operating_hours: profile_attributes[:operating_hours] || {}
  )
  
  puts "Created #{profile_attributes[:provider_type]}: #{attributes[:name]}"
  user
end

# 1. Create Hospitals
puts "Creating hospitals..."

create_provider(
  { 
    name: 'City General Hospital',
    email: 'info@citygeneral.com',
    address: '123 Main St, Metropolis',
    phone: '(555) 123-4567'
  },
  { 
    provider_type: 'hospital',
    specialization: 'General Hospital',
    bio: 'Leading general hospital with advanced medical facilities.',
    verified: true,
    facility_details: {
      departments: ['Emergency', 'Surgery', 'Cardiology', 'Neurology', 'Pediatrics'],
      emergency_services: true,
      bed_capacity: 500,
      accreditations: ['JCI', 'NABH']
    }
  }
)

create_provider(
  { 
    name: 'Metro Specialty Hospital',
    email: 'contact@metrospecialty.com',
    address: '456 Health Ave, Metropolis',
    phone: '(555) 234-5678'
  },
  { 
    provider_type: 'hospital',
    specialization: 'Specialty Care',
    bio: 'Specialized hospital focusing on cardiac and cancer care.',
    verified: true,
    facility_details: {
      departments: ['Cardiology', 'Oncology', 'Radiology'],
      emergency_services: false,
      bed_capacity: 250,
      accreditations: ['NABH']
    }
  }
)

# 2. Create Doctors
puts "Creating doctors..."

create_provider(
  { 
    name: 'Dr. Sarah Johnson',
    email: 'dr.johnson@heartcare.com',
    address: '789 Health Blvd, Metropolis',
    phone: '(555) 345-6789'
  },
  { 
    provider_type: 'doctor',
    specialization: 'Cardiologist',
    bio: 'Board-certified cardiologist with 15 years of experience.',
    verified: true,
    facility_details: {
      hospital_affiliations: ['City General Hospital', 'Metro Specialty Hospital'],
      accepting_new_patients: true
    }
  }
)

create_provider(
  { 
    name: 'Dr. Michael Chen',
    email: 'dr.chen@metrohealth.com',
    address: '101 Doctor Lane, Metropolis',
    phone: '(555) 456-7890'
  },
  { 
    provider_type: 'doctor',
    specialization: 'Neurologist',
    bio: 'Specializing in neurological disorders and stroke treatment.',
    verified: true,
    facility_details: {
      hospital_affiliations: ['Metro Specialty Hospital'],
      accepting_new_patients: true
    }
  }
)

# 3. Create Diagnostic Centers
puts "Creating diagnostic centers..."

create_provider(
  { 
    name: 'MetroScan Diagnostics',
    email: 'appointments@metroscan.com',
    address: '222 Tech Blvd, Metropolis',
    phone: '(555) 567-8901'
  },
  { 
    provider_type: 'diagnostic',
    specialization: 'Medical Diagnostics',
    bio: 'Comprehensive diagnostic services with latest technology.',
    verified: true,
    equipment: ['X-Ray', 'Ultrasound', 'ECG', 'Mammography'],
    facility_details: {
      services: ['X-Ray', 'Ultrasound', 'ECG', 'Blood Tests', 'Mammography'],
      certifications: ['ISO 9001', 'NABL']
    }
  }
)

# 4. Create Labs
puts "Creating labs..."

create_provider(
  { 
    name: 'MetroLab Diagnostics',
    email: 'tests@metrolab.com',
    address: '333 Science Dr, Metropolis',
    phone: '(555) 678-9012'
  },
  { 
    provider_type: 'lab',
    specialization: 'Medical Laboratory',
    bio: 'Full-service medical laboratory offering comprehensive testing.',
    verified: true,
    equipment: ['Blood Analyzer', 'Centrifuge', 'Microscope', 'PCR Machine'],
    facility_details: {
      services: ['Blood Tests', 'Urine Analysis', 'Genetic Testing', 'Microbiology'],
      certifications: ['NABL', 'ISO 15189']
    }
  }
)

# 5. Create Imaging Centers
puts "Creating imaging centers..."

create_provider(
  { 
    name: 'Clear View Imaging',
    email: 'appointments@clearview.com',
    address: '444 Scan Street, Metropolis',
    phone: '(555) 789-0123'
  },
  { 
    provider_type: 'imaging',
    specialization: 'Medical Imaging',
    bio: 'State-of-the-art imaging center for MRI, CT, and other advanced scans.',
    verified: true,
    equipment: ['MRI Machine', 'CT Scanner', 'X-Ray', 'Ultrasound'],
    facility_details: {
      services: ['MRI', 'CT Scan', 'X-Ray', 'Ultrasound', '3D Imaging'],
      equipment_details: [
        { name: 'Siemens MAGNETOM Vida', type: 'MRI', details: '3 Tesla MRI Scanner' },
        { name: 'GE Revolution CT', type: 'CT', details: '256-slice CT Scanner' }
      ],
      certifications: ['ACR']
    }
  }
)

# 6. Create Pharmacies
puts "Creating pharmacies..."

create_provider(
  { 
    name: 'HealthPlus Pharmacy',
    email: 'rx@healthplus.com',
    address: '555 Med Avenue, Metropolis',
    phone: '(555) 890-1234'
  },
  { 
    provider_type: 'pharmacy',
    specialization: 'Retail Pharmacy',
    bio: '24-hour pharmacy with prescription and OTC medications.',
    verified: true,
    facility_details: {
      delivery_available: true
    },
    operating_hours: {
      monday: '00:00-24:00',
      tuesday: '00:00-24:00',
      wednesday: '00:00-24:00',
      thursday: '00:00-24:00',
      friday: '00:00-24:00',
      saturday: '00:00-24:00',
      sunday: '00:00-24:00'
    }
  }
)

# 7. Create Insurance Providers
puts "Creating insurance providers..."

create_provider(
  { 
    name: 'MetroHealth Insurance',
    email: 'info@metrohealthinsurance.com',
    address: '666 Coverage Lane, Metropolis',
    phone: '(555) 901-2345'
  },
  { 
    provider_type: 'insurance',
    specialization: 'Health Insurance',
    bio: 'Comprehensive health insurance plans for individuals and families.',
    verified: true,
    facility_details: {
      insurance_plans: ['Basic Health', 'Premium Health', 'Family Coverage', 'Senior Care'],
      coverage_area: 'Nationwide'
    }
  }
)

# 8. Create Home Services
puts "Creating home services..."

create_provider(
  { 
    name: 'Metro Home Healthcare',
    email: 'care@metrohomehealth.com',
    address: '777 Care Street, Metropolis',
    phone: '(555) 012-3456'
  },
  { 
    provider_type: 'homeservice',
    specialization: 'Home Healthcare',
    bio: 'Professional healthcare services delivered in the comfort of your home.',
    verified: true,
    facility_details: {
      service_area: 'Metropolis and surrounding areas',
      services: ['Nursing Care', 'Physical Therapy', 'Elder Care', 'Post-Surgery Care']
    }
  }
)

puts "Finished database seed!"
