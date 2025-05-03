'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { cn } from '@/app/lib/utils';
import { useTheme } from '@/app/contexts/ThemeContext';
import { patientAPI } from '@/app/services/api';
import { useAuth } from '@/app/contexts/AuthContext';

type ProfilePhotoUploaderProps = {
  currentPhotoUrl?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  onPhotoUpdate?: (newPhotoUrl: string) => void;
};

const ProfilePhotoUploader: React.FC<ProfilePhotoUploaderProps> = ({
  currentPhotoUrl,
  size = 'md',
  className,
  onPhotoUpdate
}) => {
  const { isDarkMode } = useTheme();
  const { user, updateUserProfile } = useAuth();
  // Format profile photo URL to use the full backend URL if it's a relative path
  const formatPhotoUrl = (url: string | null): string | null => {
    if (!url) return null;
    
    // Check if the URL is a relative path (starts with /)
    if (url.startsWith('/')) {
      try {
        // Prepend the backend API URL without the /api/v1 part
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';
        const baseUrl = apiUrl.replace(/\/api\/v1$/, '');
        return `${baseUrl}${url}`;
      } catch (error) {
        console.error('Error formatting profile photo URL:', error);
        return url; // Return the original URL if there's an error
      }
    }
    
    return url;
  };

  const [photo, setPhoto] = useState<string | null>(formatPhotoUrl(currentPhotoUrl || null));
  const [isUploading, setIsUploading] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentPhotoUrl !== undefined) {
      setPhoto(formatPhotoUrl(currentPhotoUrl));
    }
  }, [currentPhotoUrl, formatPhotoUrl]);

  // Size configurations
  const sizeConfig = {
    sm: { containerSize: 'h-20 w-20', fontSize: 'text-sm' },
    md: { containerSize: 'h-24 w-24', fontSize: 'text-base' },
    lg: { containerSize: 'h-32 w-32', fontSize: 'text-lg' },
    xl: { containerSize: 'h-40 w-40', fontSize: 'text-xl' }
  };

  const currentSize = sizeConfig[size] || sizeConfig.md;

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size
    if (!file.type.match(/image\/(jpeg|jpg|png|gif)/)) {
      setUploadError('Please select a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB max
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Create a preview of the image
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setPhoto(reader.result);
        }
      };
      reader.readAsDataURL(file);

      // Create FormData for upload
      const formData = new FormData();
      formData.append('profile_photo', file);

      // Upload to server
      // You'll need to implement this API endpoint in your backend
      const response = await patientAPI.updateProfilePhoto(formData);

      if (response.data.success) {
        // Update the photo URL in state and notify parent component
        const newPhotoUrl = response.data.data.photo_url;
        const formattedPhotoUrl = formatPhotoUrl(newPhotoUrl);
        setPhoto(formattedPhotoUrl);
        if (onPhotoUpdate) {
          onPhotoUpdate(newPhotoUrl); // Pass the original URL to parent for storage
        }

        // Update user context if it exists
        if (updateUserProfile && user) {
          // Create a properly typed User object with the updated profile picture
          const updatedUser = {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            phone: user.phone || undefined,
            profilePicture: newPhotoUrl
          };
          updateUserProfile(updatedUser);
        }
      } else {
        throw new Error(response.data.message || 'Failed to upload photo');
      }
    } catch (error) {
      console.error('Error uploading profile photo:', error);
      setUploadError('Failed to upload photo. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div
        className={cn(
          "relative rounded-full overflow-hidden",
          "bg-gradient-to-br shadow-sm",
          currentSize.containerSize,
          "from-teal-500 to-cyan-600",
          className
        )}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {photo ? (
          <Image
            src={photo}
            alt="Profile Photo"
            fill
            className="object-cover"
            sizes={`(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
            <svg
              className="w-1/2 h-1/2 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
          </div>
        )}

        {/* Upload overlay */}
        <div
          className={cn(
            "absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center transition-opacity duration-200",
            isHovering || isUploading ? "opacity-100" : "opacity-0"
          )}
          onClick={handleTriggerFileInput}
        >
          {isUploading ? (
            <div className="animate-pulse text-white">
              <svg
                className="animate-spin h-8 w-8 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            <div className="text-white text-center">
              <svg
                className="w-8 h-8 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
              <span className="text-xs mt-1 block">Update</span>
            </div>
          )}
        </div>

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/jpeg, image/png, image/gif"
          className="hidden"
        />
      </div>

      {uploadError && (
        <p className="text-sm text-red-500 text-center max-w-xs">{uploadError}</p>
      )}

      <button
        type="button"
        onClick={handleTriggerFileInput}
        className={cn(
          "text-sm font-medium transition-colors",
          isDarkMode
            ? "text-teal-400 hover:text-teal-300"
            : "text-teal-600 hover:text-teal-700"
        )}
        disabled={isUploading}
      >
        {photo ? "Change Photo" : "Upload Photo"}
      </button>
    </div>
  );
};

export default ProfilePhotoUploader;
