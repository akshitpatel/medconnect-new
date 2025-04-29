import React from 'react';

// Types for logo props
interface MedConnectLogoProps {
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  isAnimated?: boolean;
  className?: string;
  variant?: 'full' | 'icon' | 'text';
  darkMode?: boolean;
}

/**
 * MedConnect Logo Component
 * A refined, subtle logo for the MedConnect healthcare platform
 */
export const MedConnectLogo: React.FC<MedConnectLogoProps> = ({
  primaryColor = '#0d9488', // Teal
  secondaryColor = '#14b8a6', // Light Teal
  tertiaryColor = '#0f766e', // Dark Teal
  isAnimated = false,
  className = "w-64 h-24",
  variant = 'full',
  darkMode = false
}) => {
  // Text color based on dark mode
  const textColor = darkMode ? '#ffffff' : '#1e293b';
  
  // Animation keyframes - simplified for subtlety
  const logoAnimationKeyframes = `
    @keyframes subtle-glow {
      0%, 100% { filter: drop-shadow(0 0 1px ${secondaryColor}30); }
      50% { filter: drop-shadow(0 0 3px ${secondaryColor}50); }
    }
    @keyframes gentle-beat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }
    @keyframes soft-wave {
      0% { stroke-dashoffset: 20; }
      100% { stroke-dashoffset: 0; }
    }
    @keyframes light-fade {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 0.9; }
    }
  `;

  // Icon-only variant
  if (variant === 'icon') {
    return (
      <>
        {isAnimated && (
          <style jsx global>{logoAnimationKeyframes}</style>
        )}
        <svg 
          viewBox="0 0 80 80" 
          className={`${className} ${isAnimated ? 'filter drop-shadow(0 0 1px ' + secondaryColor + '30)' : ''}`}
          style={isAnimated ? { animation: 'subtle-glow 4s ease-in-out infinite' } : undefined}
        >
          {/* Background Shield */}
          <path
            d="M40 5L10 15V40C10 55 20 65 40 75C60 65 70 55 70 40V15L40 5Z"
            fill={primaryColor}
          />
          
          {/* Inner Shield */}
          <path
            d="M40 15L20 22V40C20 50 28 58 40 65C52 58 60 50 60 40V22L40 15Z"
            fill={secondaryColor}
            opacity="0.7"
            className={isAnimated ? 'animate-[light-fade_4s_ease-in-out_infinite]' : ''}
          />
          
          {/* Medical Cross */}
          <path
            d="M40 25V55M25 40H55"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            className={isAnimated ? 'animate-[gentle-beat_3s_ease-in-out_infinite]' : ''}
          />
          
          {/* Heartbeat Line - simplified */}
          <path
            d="M25 48C25 48 30 48 33 48C36 48 37 42 40 42C43 42 44 48 47 48C50 48 55 48 55 48"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 2"
            className={isAnimated ? 'animate-[soft-wave_3s_linear_infinite]' : ''}
          />
          
          {/* Single DNA Helix - simplified */}
          {isAnimated && (
            <g opacity="0.6">
              <path
                d="M18 30C18 30 16 34 18 38C20 42 18 46 18 46"
                fill="none"
                stroke={tertiaryColor}
                strokeWidth="1"
                strokeLinecap="round"
              />
              <path
                d="M22 30C22 30 24 34 22 38C20 42 22 46 22 46"
                fill="none"
                stroke={tertiaryColor}
                strokeWidth="1"
                strokeLinecap="round"
              />
              {/* DNA Connections */}
              <line x1="18" y1="36" x2="22" y2="36" stroke={tertiaryColor} strokeWidth="1" />
              <line x1="18" y1="40" x2="22" y2="40" stroke={tertiaryColor} strokeWidth="1" />
            </g>
          )}
        </svg>
      </>
    );
  }
  
  // Text-only variant
  if (variant === 'text') {
    return (
      <div className={className}>
        <svg viewBox="0 0 240 60" width="100%" height="100%">
          {/* MedConnect Text */}
          <text
            x="10"
            y="40"
            fontFamily="Arial, sans-serif"
            fontSize="32"
            fontWeight="bold"
            fill={textColor}
          >
            Med
            <tspan fill={primaryColor}>Connect</tspan>
          </text>
          
          {/* Tagline */}
          <text
            x="12"
            y="55"
            fontFamily="Arial, sans-serif"
            fontSize="12"
            fill={textColor}
            opacity="0.8"
          >
            Your Health, Connected
          </text>
        </svg>
      </div>
    );
  }
  
  // Full logo (default)
  return (
    <>
      {isAnimated && (
        <style jsx global>{logoAnimationKeyframes}</style>
      )}
      <svg 
        viewBox="0 0 280 80" 
        className={`${className} ${isAnimated ? 'filter drop-shadow(0 0 1px ' + secondaryColor + '30)' : ''}`}
        style={isAnimated ? { animation: 'subtle-glow 4s ease-in-out infinite' } : undefined}
      >
        {/* Icon Part */}
        <g transform="translate(5, 0)">
          {/* Background Shield */}
          <path
            d="M40 5L10 15V40C10 55 20 65 40 75C60 65 70 55 70 40V15L40 5Z"
            fill={primaryColor}
          />
          
          {/* Inner Shield */}
          <path
            d="M40 15L20 22V40C20 50 28 58 40 65C52 58 60 50 60 40V22L40 15Z"
            fill={secondaryColor}
            opacity="0.7"
            className={isAnimated ? 'animate-[light-fade_4s_ease-in-out_infinite]' : ''}
          />
          
          {/* Medical Cross */}
          <path
            d="M40 25V55M25 40H55"
            stroke="white"
            strokeWidth="6"
            strokeLinecap="round"
            className={isAnimated ? 'animate-[gentle-beat_3s_ease-in-out_infinite]' : ''}
          />
          
          {/* Heartbeat Line - simplified */}
          <path
            d="M25 48C25 48 30 48 33 48C36 48 37 42 40 42C43 42 44 48 47 48C50 48 55 48 55 48"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray="2 2"
            className={isAnimated ? 'animate-[soft-wave_3s_linear_infinite]' : ''}
          />
          
          {/* Single DNA Helix - simplified */}
          {isAnimated && (
            <g opacity="0.6">
              <path
                d="M18 30C18 30 16 34 18 38C20 42 18 46 18 46"
                fill="none"
                stroke={tertiaryColor}
                strokeWidth="1"
                strokeLinecap="round"
              />
              <path
                d="M22 30C22 30 24 34 22 38C20 42 22 46 22 46"
                fill="none"
                stroke={tertiaryColor}
                strokeWidth="1"
                strokeLinecap="round"
              />
              {/* DNA Connections */}
              <line x1="18" y1="36" x2="22" y2="36" stroke={tertiaryColor} strokeWidth="1" />
              <line x1="18" y1="40" x2="22" y2="40" stroke={tertiaryColor} strokeWidth="1" />
            </g>
          )}
        </g>
        
        {/* Text Part - moved much closer to the icon */}
        <g transform="translate(65, 10)">
          {/* MedConnect Text */}
          <text
            x="10"
            y="40"
            fontFamily="Arial, sans-serif"
            fontSize="32"
            fontWeight="bold"
            fill={textColor}
          >
            Med
            <tspan fill={primaryColor}>Connect</tspan>
          </text>
          
          {/* Tagline */}
          <text
            x="12"
            y="55"
            fontFamily="Arial, sans-serif"
            fontSize="12"
            fill={textColor}
            opacity="0.8"
          >
            Your Health, Connected
          </text>
        </g>
      </svg>
    </>
  );
};

// Export animation keyframes - simplified
export const MedConnectLogoAnimations = () => (
  <style jsx global>{`
    @keyframes subtle-glow {
      0%, 100% { filter: drop-shadow(0 0 1px #14b8a630); }
      50% { filter: drop-shadow(0 0 3px #14b8a650); }
    }
    @keyframes gentle-beat {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.03); }
    }
    @keyframes soft-wave {
      0% { stroke-dashoffset: 20; }
      100% { stroke-dashoffset: 0; }
    }
    @keyframes light-fade {
      0%, 100% { opacity: 0.8; }
      50% { opacity: 0.9; }
    }
  `}</style>
);

export default MedConnectLogo; 