import React from 'react';

// Types for logo props
interface LogoProps {
  primaryColor: string;
  secondaryColor: string;
  isAnimated: boolean;
  className?: string;
}

// 1. Caduceus Medical Logo
export const CaduceusLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Staff */}
    <rect x="19" y="8" width="2" height="24" fill={primaryColor} />
    {/* Snakes */}
    <path
      d="M15 12C15 12 13 16 19 20C25 24 23 28 23 28"
      fill="none"
      stroke={secondaryColor}
      strokeWidth="2"
      className={isAnimated ? 'animate-[snake1_3s_ease-in-out_infinite]' : ''}
    />
    <path
      d="M25 12C25 12 27 16 21 20C15 24 17 28 17 28"
      fill="none"
      stroke={secondaryColor}
      strokeWidth="2"
      className={isAnimated ? 'animate-[snake2_3s_ease-in-out_infinite]' : ''}
    />
    {/* Wings */}
    <path
      d="M14 10C14 10 18 8 20 8C22 8 26 10 26 10"
      fill="none"
      stroke={primaryColor}
      strokeWidth="2"
      className={isAnimated ? 'animate-[wings_2s_ease-in-out_infinite]' : ''}
    />
  </svg>
);

// 2. Heartbeat Medical Logo
export const HeartbeatLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Heart */}
    <path
      d="M20 32C20 32 8 26 8 16C8 10 12 8 16 8C19 8 20 10 20 10C20 10 21 8 24 8C28 8 32 10 32 16C32 26 20 32 20 32Z"
      fill={primaryColor}
      className={isAnimated ? 'animate-[heartbeat_1.5s_ease-in-out_infinite]' : ''}
    />
    {/* Heartbeat Line */}
    <path
      d="M10 20H16L18 16L22 24L24 20H30"
      fill="none"
      stroke={secondaryColor}
      strokeWidth="2"
      strokeLinecap="round"
      className={isAnimated ? 'animate-[pulse_2s_ease-in-out_infinite]' : ''}
    />
  </svg>
);

// 3. DNA Medical Logo
export const DNALogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* DNA Strands */}
    <path
      d="M15 8C15 8 25 16 25 32"
      fill="none"
      stroke={primaryColor}
      strokeWidth="2"
      className={isAnimated ? 'animate-[dnaStrand1_3s_ease-in-out_infinite]' : ''}
    />
    <path
      d="M25 8C25 8 15 16 15 32"
      fill="none"
      stroke={primaryColor}
      strokeWidth="2"
      className={isAnimated ? 'animate-[dnaStrand2_3s_ease-in-out_infinite]' : ''}
    />
    {/* Connections */}
    {[12, 16, 20, 24, 28].map((y, i) => (
      <line
        key={i}
        x1="15"
        y1={y}
        x2="25"
        y2={y}
        stroke={secondaryColor}
        strokeWidth="2"
        className={isAnimated ? `animate-[connection_1s_ease-in-out_infinite]` : ''}
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </svg>
);

// 4. Cross Medical Logo
export const CrossLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Cross */}
    <path
      d="M20 8V32M8 20H32"
      stroke={primaryColor}
      strokeWidth="4"
      strokeLinecap="round"
      className={isAnimated ? 'animate-[crossPulse_2s_ease-in-out_infinite]' : ''}
    />
    {/* Circle */}
    <circle
      cx="20"
      cy="20"
      r="16"
      fill="none"
      stroke={secondaryColor}
      strokeWidth="2"
      className={isAnimated ? 'animate-[circle_3s_linear_infinite]' : ''}
    />
  </svg>
);

// 5. Brain Tech Logo
export const BrainTechLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Brain */}
    <path
      d="M12 16C12 12 16 10 20 10C24 10 28 12 28 16C28 20 24 22 20 22C16 22 12 20 12 16Z"
      fill={primaryColor}
      className={isAnimated ? 'animate-[brainPulse_2s_ease-in-out_infinite]' : ''}
    />
    {/* Circuit Lines */}
    <path
      d="M16 24L16 28M20 24L20 30M24 24L24 28"
      stroke={secondaryColor}
      strokeWidth="2"
      strokeLinecap="round"
      className={isAnimated ? 'animate-[circuits_1.5s_ease-in-out_infinite]' : ''}
    />
  </svg>
);

// 6. Microscope Logo
export const MicroscopeLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Base */}
    <rect x="12" y="30" width="16" height="2" fill={primaryColor} />
    {/* Stand */}
    <rect x="18" y="20" width="4" height="12" fill={primaryColor} />
    {/* Lens */}
    <circle
      cx="20"
      cy="16"
      r="6"
      fill={primaryColor}
      className={isAnimated ? 'animate-[lens_2s_ease-in-out_infinite]' : ''}
    />
    {/* Focus Ring */}
    <circle
      cx="20"
      cy="16"
      r="4"
      fill="none"
      stroke={secondaryColor}
      strokeWidth="1"
      className={isAnimated ? 'animate-[focus_1.5s_linear_infinite]' : ''}
    />
  </svg>
);

// 7. Pharmacy Logo
export const PharmacyLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Mortar */}
    <path
      d="M12 20C12 20 14 32 20 32C26 32 28 20 28 20"
      fill={primaryColor}
    />
    {/* Pestle */}
    <rect
      x="18"
      y="8"
      width="4"
      height="16"
      fill={secondaryColor}
      className={isAnimated ? 'animate-[pestle_2s_ease-in-out_infinite]' : ''}
    />
    {/* Pills */}
    <circle
      cx="16"
      cy="24"
      r="2"
      fill={secondaryColor}
      className={isAnimated ? 'animate-[pill1_3s_ease-in-out_infinite]' : ''}
    />
    <circle
      cx="24"
      cy="24"
      r="2"
      fill={secondaryColor}
      className={isAnimated ? 'animate-[pill2_3s_ease-in-out_infinite]' : ''}
    />
  </svg>
);

// 8. Stethoscope Logo
export const StethoscopeLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Tube */}
    <path
      d="M12 8C12 8 8 12 8 16C8 20 12 28 20 28C28 28 32 20 32 16C32 12 28 8 28 8"
      fill="none"
      stroke={primaryColor}
      strokeWidth="2"
      className={isAnimated ? 'animate-[tube_3s_ease-in-out_infinite]' : ''}
    />
    {/* Earpieces */}
    <circle cx="12" cy="8" r="2" fill={secondaryColor} />
    <circle cx="28" cy="8" r="2" fill={secondaryColor} />
    {/* Chest Piece */}
    <circle
      cx="20"
      cy="28"
      r="4"
      fill={secondaryColor}
      className={isAnimated ? 'animate-[chestPiece_2s_ease-in-out_infinite]' : ''}
    />
  </svg>
);

// 9. Hospital Logo
export const HospitalLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Building */}
    <rect x="8" y="12" width="24" height="20" fill={primaryColor} />
    {/* Roof */}
    <path d="M6 12L20 4L34 12" fill={primaryColor} />
    {/* Windows */}
    <rect
      x="12"
      y="16"
      width="4"
      height="4"
      fill={secondaryColor}
      className={isAnimated ? 'animate-[window1_2s_ease-in-out_infinite]' : ''}
    />
    <rect
      x="24"
      y="16"
      width="4"
      height="4"
      fill={secondaryColor}
      className={isAnimated ? 'animate-[window2_2s_ease-in-out_infinite]' : ''}
    />
    {/* Door */}
    <rect
      x="16"
      y="24"
      width="8"
      height="8"
      fill={secondaryColor}
      className={isAnimated ? 'animate-[door_3s_ease-in-out_infinite]' : ''}
    />
  </svg>
);

// 10. Medical App Logo
export const MedicalAppLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Phone Shape */}
    <rect x="12" y="6" width="16" height="28" rx="2" fill={primaryColor} />
    {/* Screen */}
    <rect x="14" y="8" width="12" height="24" fill="white" />
    {/* Medical Cross */}
    <path
      d="M20 14V26M14 20H26"
      stroke={secondaryColor}
      strokeWidth="2"
      strokeLinecap="round"
      className={isAnimated ? 'animate-[appCross_2s_ease-in-out_infinite]' : ''}
    />
  </svg>
);

// Animation keyframes
const animationKeyframes = `
  @keyframes snake1 {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(2px); }
  }
  @keyframes snake2 {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(-2px); }
  }
  @keyframes wings {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-1px); }
  }
  @keyframes heartbeat {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  @keyframes dnaStrand1 {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(2deg); }
  }
  @keyframes dnaStrand2 {
    0%, 100% { transform: rotate(0deg); }
    50% { transform: rotate(-2deg); }
  }
  @keyframes connection {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes crossPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(0.95); }
  }
  @keyframes circle {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes brainPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
  @keyframes circuits {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  @keyframes lens {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  @keyframes focus {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes pestle {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(2px); }
  }
  @keyframes pill1 {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(-2px); }
  }
  @keyframes pill2 {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(2px); }
  }
  @keyframes tube {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  @keyframes chestPiece {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  @keyframes window1 {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  @keyframes window2 {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
  @keyframes door {
    0%, 100% { transform: scaleY(1); }
    50% { transform: scaleY(0.98); }
  }
  @keyframes appCross {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(0.9); }
  }
`;

// Export animation keyframes
export const LogoAnimations = () => (
  <style jsx global>{animationKeyframes}</style>
);

// Export all logos as a collection
export const MedicalLogos = {
  Caduceus: CaduceusLogo,
  Heartbeat: HeartbeatLogo,
  DNA: DNALogo,
  Cross: CrossLogo,
  BrainTech: BrainTechLogo,
  Microscope: MicroscopeLogo,
  Pharmacy: PharmacyLogo,
  Stethoscope: StethoscopeLogo,
  Hospital: HospitalLogo,
  MedicalApp: MedicalAppLogo,
}; 