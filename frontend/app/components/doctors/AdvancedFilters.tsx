'use client';

import React, { useState, useEffect, Fragment } from 'react';
import { FaSearch, FaFilter, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';
import { Slider } from '../ui/Slider';
import { Switch } from '../ui/Switch';
import { Dialog, Transition } from '@headlessui/react';

// Types
export interface FilterState {
  specialization: string[];
  availability: string;
  consultationType: string[];
  gender: string;
  languages: string[];
  experience: {
    min: number;
    max: number;
  };
  fees: {
    min: number;
    max: number;
  };
  rating: number;
  distance: number;
  onlyGuruProgram: boolean;
  hospitalAffiliations: string[];
  insuranceAccepted: string[];
  symptoms: string[];
  conditions: string[];
  treatments: string[];
}

interface AdvancedFiltersProps {
  filters: FilterState;
  onFilterChange: (filterName: keyof FilterState, value: any) => void;
  onApplyFilters: () => void;
  onClearFilters: () => void;
  specialties: string[];
  hospitals: string[];
  insurance: string[];
  languages: string[];
  symptoms: string[];
  conditions: string[];
  treatments: string[];
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  filters,
  onFilterChange,
  onApplyFilters,
  onClearFilters,
  specialties = [],
  hospitals = [],
  insurance = [],
  languages = [],
  symptoms = [],
  conditions = [],
  treatments = []
}) => {
  const [isMobile, setIsMobile] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();

    // Add event listener
    window.addEventListener('resize', checkIfMobile);

    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  return (
    <>
      {/* Mobile Filter Button */}
      {isMobile && (
        <div className="sticky top-16 z-10 bg-white p-2 shadow">
          <button
            className="w-full flex items-center justify-center p-2 bg-teal-50 border border-teal-200 rounded-md text-teal-700"
            onClick={() => setIsFiltersOpen(true)}
          >
            <FaFilter className="mr-2" />
            Filters
          </button>
        </div>
      )}

      {/* Desktop Filters */}
      {!isMobile && (
        <aside className="w-full md:w-72 bg-white rounded-lg shadow-md p-4 h-fit sticky top-20">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
            <button
              onClick={onClearFilters}
              className="text-sm text-teal-600 hover:text-teal-800"
            >
              Clear All
            </button>
          </div>

          {renderFilterContent(
            filters, 
            onFilterChange, 
            specialties, 
            hospitals, 
            insurance, 
            languages, 
            symptoms, 
            conditions, 
            treatments
          )}

          <button
            onClick={onApplyFilters}
            className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md mt-4"
          >
            Apply Filters
          </button>
        </aside>
      )}

      {/* Mobile Filters Modal */}
      <Transition appear show={isFiltersOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-50 overflow-y-auto"
          onClose={() => setIsFiltersOpen(false)}
        >
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black opacity-30"></div>
            </Transition.Child>

            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md my-8 text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 p-4 border-b border-gray-200 sticky top-0 bg-white z-10 flex justify-between items-center"
                >
                  <span>Filters</span>
                  <button
                    onClick={onClearFilters}
                    className="text-sm text-teal-600 hover:text-teal-800"
                  >
                    Clear All
                  </button>
                </Dialog.Title>
                <div className="max-h-[70vh] overflow-y-auto p-4">
                  {renderFilterContent(
                    filters, 
                    onFilterChange, 
                    specialties, 
                    hospitals, 
                    insurance, 
                    languages, 
                    symptoms, 
                    conditions, 
                    treatments
                  )}
                </div>
                <div className="flex space-x-3 p-4 border-t border-gray-200 sticky bottom-0 bg-white">
                  <button
                    type="button"
                    className="w-1/2 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    onClick={() => setIsFiltersOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="w-1/2 bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-md"
                    onClick={() => {
                      onApplyFilters();
                      setIsFiltersOpen(false);
                    }}
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

function renderFilterContent(
  filters: FilterState,
  onFilterChange: (filterName: keyof FilterState, value: any) => void,
  specialties: string[],
  hospitals: string[],
  insurance: string[],
  languages: string[],
  symptoms: string[],
  conditions: string[],
  treatments: string[]
) {
  return (
    <div className="space-y-6">
      {/* Multi-select Specialization Filter */}
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-2">Specialties</h3>
        <div className="relative mb-2">
          <input 
            type="text" 
            placeholder="Search specialties..."
            className="w-full py-2 px-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 pl-9"
          />
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
        </div>
        <div className="max-h-40 overflow-y-auto space-y-1 p-1 border border-gray-200 rounded-md">
          {specialties.map((specialty, index) => (
            <label key={index} className="flex items-center py-1 px-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-teal-600 rounded"
                checked={filters.specialization.includes(specialty)}
                onChange={(e) => {
                  const newSpecializations = e.target.checked
                    ? [...filters.specialization, specialty]
                    : filters.specialization.filter(s => s !== specialty);
                  onFilterChange('specialization', newSpecializations);
                }}
              />
              <span className="ml-2 text-sm text-gray-700">{specialty}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-2">Gender</h3>
        <div className="space-y-2">
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              className="form-radio h-4 w-4 text-teal-600"
              checked={filters.gender === 'Male'}
              onChange={() => onFilterChange('gender', 'Male')}
            />
            <span className="ml-2 text-sm text-gray-700">Male Doctor</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              className="form-radio h-4 w-4 text-teal-600"
              checked={filters.gender === 'Female'}
              onChange={() => onFilterChange('gender', 'Female')}
            />
            <span className="ml-2 text-sm text-gray-700">Female Doctor</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="gender"
              className="form-radio h-4 w-4 text-teal-600"
              checked={filters.gender === ''}
              onChange={() => onFilterChange('gender', '')}
            />
            <span className="ml-2 text-sm text-gray-700">Any</span>
          </label>
        </div>
      </div>

      {/* Experience Filter */}
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-2">Experience (Years)</h3>
        <Slider
          min={0}
          max={30}
          value={filters.experience.min}
          onChange={(value) => onFilterChange('experience', { ...filters.experience, min: value })}
          showLabels={true}
        />
      </div>

      {/* Fee Filter */}
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-2">Consultation Fee</h3>
        <div className="flex justify-between mb-2">
          <div className="flex-1 pr-2">
            <label className="block text-xs text-gray-500 mb-1">Min</label>
            <input
              type="number"
              min={0}
              max={filters.fees.max}
              value={filters.fees.min}
              onChange={(e) => onFilterChange('fees', { ...filters.fees, min: Number(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
          <div className="flex-1 pl-2">
            <label className="block text-xs text-gray-500 mb-1">Max</label>
            <input
              type="number"
              min={filters.fees.min}
              value={filters.fees.max}
              onChange={(e) => onFilterChange('fees', { ...filters.fees, max: Number(e.target.value) })}
              className="w-full p-2 border border-gray-300 rounded-md text-sm"
            />
          </div>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-2">Rating</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <label key={star} className="flex items-center">
              <input
                type="radio"
                name="rating"
                className="form-radio h-4 w-4 text-teal-600"
                checked={filters.rating === star}
                onChange={() => onFilterChange('rating', star)}
              />
              <span className="ml-2 text-sm text-gray-700">{star}+ Stars</span>
            </label>
          ))}
          <label className="flex items-center">
            <input
              type="radio"
              name="rating"
              className="form-radio h-4 w-4 text-teal-600"
              checked={filters.rating === 0}
              onChange={() => onFilterChange('rating', 0)}
            />
            <span className="ml-2 text-sm text-gray-700">Any</span>
          </label>
        </div>
      </div>

      {/* Languages Filter */}
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-2">Languages</h3>
        <div className="max-h-32 overflow-y-auto space-y-1 p-1 border border-gray-200 rounded-md">
          {languages.map((language, index) => (
            <label key={index} className="flex items-center py-1 px-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-teal-600 rounded"
                checked={filters.languages.includes(language)}
                onChange={(e) => {
                  const newLanguages = e.target.checked
                    ? [...filters.languages, language]
                    : filters.languages.filter(l => l !== language);
                  onFilterChange('languages', newLanguages);
                }}
              />
              <span className="ml-2 text-sm text-gray-700">{language}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Consultation Type Filter */}
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-2">Consultation Type</h3>
        <div className="space-y-2">
          {['In-Person', 'Video', 'Phone'].map((type) => (
            <label key={type} className="flex items-center">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-teal-600 rounded"
                checked={filters.consultationType.includes(type)}
                onChange={(e) => {
                  const newTypes = e.target.checked
                    ? [...filters.consultationType, type]
                    : filters.consultationType.filter(t => t !== type);
                  onFilterChange('consultationType', newTypes);
                }}
              />
              <span className="ml-2 text-sm text-gray-700">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Availability Filter */}
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-2">Availability</h3>
        <div className="space-y-2">
          {['Today', 'Tomorrow', 'This Week', 'This Month'].map((availPeriod) => (
            <label key={availPeriod} className="flex items-center">
              <input
                type="radio"
                name="availability"
                className="form-radio h-4 w-4 text-teal-600"
                checked={filters.availability === availPeriod}
                onChange={() => onFilterChange('availability', availPeriod)}
              />
              <span className="ml-2 text-sm text-gray-700">{availPeriod}</span>
            </label>
          ))}
          <label className="flex items-center">
            <input
              type="radio"
              name="availability"
              className="form-radio h-4 w-4 text-teal-600"
              checked={filters.availability === ''}
              onChange={() => onFilterChange('availability', '')}
            />
            <span className="ml-2 text-sm text-gray-700">Any</span>
          </label>
        </div>
      </div>

      {/* Guru Program Switch */}
      <div>
        <Switch
          checked={filters.onlyGuruProgram}
          onChange={(checked) => onFilterChange('onlyGuruProgram', checked)}
          label="Only Guru Program Doctors"
          description="Highly qualified, verified doctors"
          size="md"
        />
      </div>

      {/* Hospital Affiliations Filter */}
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-2">Hospital Affiliations</h3>
        <div className="max-h-32 overflow-y-auto space-y-1 p-1 border border-gray-200 rounded-md">
          {hospitals.map((hospital, index) => (
            <label key={index} className="flex items-center py-1 px-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-teal-600 rounded"
                checked={filters.hospitalAffiliations.includes(hospital)}
                onChange={(e) => {
                  const newHospitals = e.target.checked
                    ? [...filters.hospitalAffiliations, hospital]
                    : filters.hospitalAffiliations.filter(h => h !== hospital);
                  onFilterChange('hospitalAffiliations', newHospitals);
                }}
              />
              <span className="ml-2 text-sm text-gray-700">{hospital}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Insurance Accepted Filter */}
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-2">Insurance Accepted</h3>
        <div className="max-h-32 overflow-y-auto space-y-1 p-1 border border-gray-200 rounded-md">
          {insurance.map((ins, index) => (
            <label key={index} className="flex items-center py-1 px-2 hover:bg-gray-50 rounded">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-teal-600 rounded"
                checked={filters.insuranceAccepted.includes(ins)}
                onChange={(e) => {
                  const newInsurance = e.target.checked
                    ? [...filters.insuranceAccepted, ins]
                    : filters.insuranceAccepted.filter(i => i !== ins);
                  onFilterChange('insuranceAccepted', newInsurance);
                }}
              />
              <span className="ml-2 text-sm text-gray-700">{ins}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Symptoms/Conditions/Treatments Filter - These would be connected to the search functionality */}
      <div>
        <h3 className="text-md font-medium text-gray-700 mb-2">Health Concerns</h3>
        <div className="p-2 border border-gray-200 rounded-md bg-gray-50 text-sm text-gray-600">
          Search by symptoms, conditions, or treatments in the search bar above
        </div>
      </div>
    </div>
  );
}

export default AdvancedFilters; 