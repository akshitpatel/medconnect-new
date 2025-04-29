import React from 'react';

// Types for logo props
interface LogoProps {
  primaryColor: string;
  secondaryColor: string;
  isAnimated: boolean;
  className?: string;
}

// 1. Pulse Wave Logo
export const PulseWaveLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Heart */}
    <path
      d="M20 28C20 28 12 24 12 18C12 14 14 12 16 12C18 12 20 14 20 14C20 14 22 12 24 12C26 12 28 14 28 18C28 24 20 28 20 28Z"
      fill={primaryColor}
      className={isAnimated ? 'animate-[heartPulse_1.5s_ease-in-out_infinite]' : ''}
    />
    {/* Pulse Wave */}
    <path
      d="M4 20H10L12 16L16 24L20 14L24 26L28 18L30 20H36"
      fill="none"
      stroke={secondaryColor}
      strokeWidth="2"
      strokeLinecap="round"
      className={isAnimated ? 'animate-[pulseWave_2s_ease-in-out_infinite]' : ''}
    />
  </svg>
);

// 2. Genome Sequence Logo
export const GenomeSequenceLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Circular DNA */}
    <circle
      cx="20"
      cy="20"
      r="12"
      fill="none"
      stroke={primaryColor}
      strokeWidth="2"
      strokeDasharray="2 2"
      className={isAnimated ? 'animate-[rotate_10s_linear_infinite]' : ''}
    />
    {/* Base Pairs */}
    {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
      <React.Fragment key={i}>
        <line
          x1={20 + 8 * Math.cos(angle * Math.PI / 180)}
          y1={20 + 8 * Math.sin(angle * Math.PI / 180)}
          x2={20 + 16 * Math.cos(angle * Math.PI / 180)}
          y2={20 + 16 * Math.sin(angle * Math.PI / 180)}
          stroke={secondaryColor}
          strokeWidth="2"
          className={isAnimated ? `animate-[basePair_1.5s_ease-in-out_infinite]` : ''}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
        <circle
          cx={20 + 16 * Math.cos(angle * Math.PI / 180)}
          cy={20 + 16 * Math.sin(angle * Math.PI / 180)}
          r="1.5"
          fill={secondaryColor}
          className={isAnimated ? `animate-[baseNode_1s_ease-in-out_infinite]` : ''}
          style={{ animationDelay: `${i * 0.2}s` }}
        />
      </React.Fragment>
    ))}
  </svg>
);

// 3. Telemedicine Logo
export const TelemedicineLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Device Screen */}
    <rect x="8" y="10" width="24" height="18" rx="2" fill={primaryColor} />
    {/* Screen Content */}
    <rect x="10" y="12" width="20" height="14" fill="white" />
    {/* Doctor Silhouette */}
    <path
      d="M16 16C16 16 15 18 17 20C19 22 17 24 17 24M24 16C24 16 25 18 23 20C21 22 23 24 23 24M20 16V24"
      stroke={secondaryColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      className={isAnimated ? 'animate-[doctorSilhouette_3s_ease-in-out_infinite]' : ''}
    />
    {/* Signal Waves */}
    <path
      d="M6 20C6 20 4 16 8 16M34 20C34 20 36 16 32 16"
      stroke={secondaryColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      className={isAnimated ? 'animate-[signalWaves_2s_ease-in-out_infinite]' : ''}
    />
    {/* Stand */}
    <rect x="16" y="28" width="8" height="2" fill={primaryColor} />
  </svg>
);

// 4. Medical Research Logo
export const MedicalResearchLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Microscope Base */}
    <rect x="12" y="30" width="16" height="2" fill={primaryColor} />
    {/* Microscope Stand */}
    <rect x="18" y="20" width="4" height="10" fill={primaryColor} />
    {/* Microscope Arm */}
    <path
      d="M22 20H28V14H22"
      fill="none"
      stroke={primaryColor}
      strokeWidth="2"
      className={isAnimated ? 'animate-[microscopeArm_3s_ease-in-out_infinite]' : ''}
    />
    {/* Lens */}
    <circle
      cx="20"
      cy="16"
      r="6"
      fill={primaryColor}
      className={isAnimated ? 'animate-[lens_2s_ease-in-out_infinite]' : ''}
    />
    {/* Cell Sample */}
    <circle
      cx="28"
      cy="14"
      r="3"
      fill="none"
      stroke={secondaryColor}
      strokeWidth="1"
      className={isAnimated ? 'animate-[cellSample_2s_ease-in-out_infinite]' : ''}
    />
    {/* Cell Nucleus */}
    <circle
      cx="28"
      cy="14"
      r="1"
      fill={secondaryColor}
      className={isAnimated ? 'animate-[cellNucleus_1.5s_ease-in-out_infinite]' : ''}
    />
  </svg>
);

// 5. Medical AI Logo
export const MedicalAILogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Brain Outline */}
    <path
      d="M12 16C12 12 16 10 20 10C24 10 28 12 28 16C28 20 24 22 20 22C16 22 12 20 12 16Z"
      fill="none"
      stroke={primaryColor}
      strokeWidth="2"
      className={isAnimated ? 'animate-[brainOutline_2s_ease-in-out_infinite]' : ''}
    />
    {/* Neural Network */}
    <circle cx="16" cy="14" r="1.5" fill={secondaryColor} />
    <circle cx="24" cy="14" r="1.5" fill={secondaryColor} />
    <circle cx="20" cy="12" r="1.5" fill={secondaryColor} />
    <circle cx="20" cy="18" r="1.5" fill={secondaryColor} />
    <circle cx="14" cy="18" r="1.5" fill={secondaryColor} />
    <circle cx="26" cy="18" r="1.5" fill={secondaryColor} />
    
    {/* Neural Connections */}
    <path
      d="M16 14L20 12M16 14L14 18M16 14L20 18M24 14L20 12M24 14L26 18M24 14L20 18M14 18L20 18M26 18L20 18"
      stroke={secondaryColor}
      strokeWidth="1"
      className={isAnimated ? 'animate-[neuralConnections_3s_ease-in-out_infinite]' : ''}
    />
    
    {/* Data Flow */}
    <path
      d="M16 24L16 28M20 24L20 30M24 24L24 28"
      stroke={secondaryColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeDasharray="2 1"
      className={isAnimated ? 'animate-[dataFlow_2s_linear_infinite]' : ''}
    />
  </svg>
);

// 6. Vaccine Logo
export const VaccineLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Syringe Body */}
    <rect x="10" y="16" width="20" height="8" rx="2" fill={primaryColor} />
    {/* Syringe Needle */}
    <path
      d="M30 20H36"
      stroke={primaryColor}
      strokeWidth="2"
      strokeLinecap="round"
      className={isAnimated ? 'animate-[syringeNeedle_2s_ease-in-out_infinite]' : ''}
    />
    {/* Plunger */}
    <rect
      x="4"
      y="16"
      width="6"
      height="8"
      rx="1"
      fill={secondaryColor}
      className={isAnimated ? 'animate-[plunger_3s_ease-in-out_infinite]' : ''}
    />
    {/* Liquid */}
    <rect
      x="10"
      y="18"
      width="20"
      height="4"
      fill="white"
      opacity="0.6"
      className={isAnimated ? 'animate-[liquid_2s_ease-in-out_infinite]' : ''}
    />
    {/* Bubbles */}
    <circle
      cx="15"
      cy="20"
      r="1"
      fill="white"
      className={isAnimated ? 'animate-[bubble1_2s_ease-in-out_infinite]' : ''}
    />
    <circle
      cx="22"
      cy="20"
      r="0.8"
      fill="white"
      className={isAnimated ? 'animate-[bubble2_2.5s_ease-in-out_infinite]' : ''}
    />
  </svg>
);

// 7. Medical Chart Logo
export const MedicalChartLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Clipboard */}
    <rect x="10" y="8" width="20" height="26" rx="2" fill={primaryColor} />
    <rect x="12" y="10" width="16" height="22" fill="white" />
    {/* Clip */}
    <path
      d="M16 8C16 6 24 6 24 8"
      stroke={secondaryColor}
      strokeWidth="2"
      fill="none"
      className={isAnimated ? 'animate-[clip_3s_ease-in-out_infinite]' : ''}
    />
    {/* Chart Lines */}
    <path
      d="M14 16H26M14 20H26M14 24H20"
      stroke={secondaryColor}
      strokeWidth="1"
      strokeLinecap="round"
      strokeDasharray={isAnimated ? "1 1" : "0 0"}
      className={isAnimated ? 'animate-[chartLines_2s_ease-in-out_infinite]' : ''}
    />
    {/* Medical Cross */}
    <path
      d="M24 24V28M22 26H26"
      stroke={secondaryColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      className={isAnimated ? 'animate-[medicalCross_2s_ease-in-out_infinite]' : ''}
    />
  </svg>
);

// 8. Biotech Logo
export const BiotechLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Molecule Structure */}
    <circle
      cx="20"
      cy="20"
      r="2"
      fill={primaryColor}
      className={isAnimated ? 'animate-[centralAtom_2s_ease-in-out_infinite]' : ''}
    />
    {/* Atoms */}
    <circle
      cx="12"
      cy="12"
      r="3"
      fill={secondaryColor}
      className={isAnimated ? 'animate-[atom1_3s_ease-in-out_infinite]' : ''}
    />
    <circle
      cx="28"
      cy="12"
      r="3"
      fill={secondaryColor}
      className={isAnimated ? 'animate-[atom2_2.5s_ease-in-out_infinite]' : ''}
    />
    <circle
      cx="12"
      cy="28"
      r="3"
      fill={secondaryColor}
      className={isAnimated ? 'animate-[atom3_3.5s_ease-in-out_infinite]' : ''}
    />
    <circle
      cx="28"
      cy="28"
      r="3"
      fill={secondaryColor}
      className={isAnimated ? 'animate-[atom4_3s_ease-in-out_infinite]' : ''}
    />
    {/* Bonds */}
    <line
      x1="20"
      y1="20"
      x2="12"
      y2="12"
      stroke={primaryColor}
      strokeWidth="1.5"
      className={isAnimated ? 'animate-[bond1_2s_ease-in-out_infinite]' : ''}
    />
    <line
      x1="20"
      y1="20"
      x2="28"
      y2="12"
      stroke={primaryColor}
      strokeWidth="1.5"
      className={isAnimated ? 'animate-[bond2_2.2s_ease-in-out_infinite]' : ''}
    />
    <line
      x1="20"
      y1="20"
      x2="12"
      y2="28"
      stroke={primaryColor}
      strokeWidth="1.5"
      className={isAnimated ? 'animate-[bond3_2.4s_ease-in-out_infinite]' : ''}
    />
    <line
      x1="20"
      y1="20"
      x2="28"
      y2="28"
      stroke={primaryColor}
      strokeWidth="1.5"
      className={isAnimated ? 'animate-[bond4_2.6s_ease-in-out_infinite]' : ''}
    />
  </svg>
);

// 9. Medical Shield Logo
export const MedicalShieldLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Shield */}
    <path
      d="M20 4L8 10V20C8 28 14 32 20 36C26 32 32 28 32 20V10L20 4Z"
      fill={primaryColor}
      className={isAnimated ? 'animate-[shield_3s_ease-in-out_infinite]' : ''}
    />
    {/* Inner Shield */}
    <path
      d="M20 8L12 12V20C12 26 16 28 20 32C24 28 28 26 28 20V12L20 8Z"
      fill="white"
      opacity="0.3"
      className={isAnimated ? 'animate-[innerShield_2s_ease-in-out_infinite]' : ''}
    />
    {/* Medical Cross */}
    <path
      d="M20 14V26M14 20H26"
      stroke={secondaryColor}
      strokeWidth="3"
      strokeLinecap="round"
      className={isAnimated ? 'animate-[shieldCross_2s_ease-in-out_infinite]' : ''}
    />
  </svg>
);

// 10. Smart Health Wearable Logo
export const SmartHealthLogo: React.FC<LogoProps> = ({ primaryColor, secondaryColor, isAnimated, className = "w-16 h-16" }) => (
  <svg viewBox="0 0 40 40" className={`${className} ${isAnimated ? 'transform transition-transform hover:scale-110' : ''}`}>
    <rect width="40" height="40" fill="transparent" />
    {/* Watch Body */}
    <rect
      x="12"
      y="14"
      width="16"
      height="12"
      rx="2"
      fill={primaryColor}
      className={isAnimated ? 'animate-[watchBody_3s_ease-in-out_infinite]' : ''}
    />
    {/* Watch Screen */}
    <rect x="14" y="16" width="12" height="8" fill="white" />
    {/* Watch Bands */}
    <path
      d="M12 14V10C12 8 16 8 20 8C24 8 28 8 28 10V14"
      fill="none"
      stroke={primaryColor}
      strokeWidth="2"
      className={isAnimated ? 'animate-[topBand_2s_ease-in-out_infinite]' : ''}
    />
    <path
      d="M12 26V30C12 32 16 32 20 32C24 32 28 32 28 30V26"
      fill="none"
      stroke={primaryColor}
      strokeWidth="2"
      className={isAnimated ? 'animate-[bottomBand_2s_ease-in-out_infinite]' : ''}
    />
    {/* Heart Rate */}
    <path
      d="M16 20H18L19 18L21 22L22 20H24"
      fill="none"
      stroke={secondaryColor}
      strokeWidth="1"
      strokeLinecap="round"
      className={isAnimated ? 'animate-[heartRate_1.5s_ease-in-out_infinite]' : ''}
    />
  </svg>
);

// Animation keyframes
const advancedAnimationKeyframes = `
  @keyframes heartPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  @keyframes pulseWave {
    0%, 100% { stroke-dashoffset: 0; }
    50% { stroke-dashoffset: 10; }
  }
  @keyframes rotate {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  @keyframes basePair {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.6; }
  }
  @keyframes baseNode {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.3); }
  }
  @keyframes doctorSilhouette {
    0%, 100% { stroke-width: 1.5; }
    50% { stroke-width: 2; }
  }
  @keyframes signalWaves {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 1; }
  }
  @keyframes microscopeArm {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-1px); }
  }
  @keyframes cellSample {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  @keyframes cellNucleus {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
  @keyframes brainOutline {
    0%, 100% { stroke-dashoffset: 0; }
    50% { stroke-dashoffset: 5; }
  }
  @keyframes neuralConnections {
    0%, 100% { stroke-dashoffset: 0; }
    50% { stroke-dashoffset: 10; }
  }
  @keyframes dataFlow {
    0% { stroke-dashoffset: 0; }
    100% { stroke-dashoffset: 10; }
  }
  @keyframes syringeNeedle {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(1px); }
  }
  @keyframes plunger {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(1px); }
  }
  @keyframes liquid {
    0%, 100% { opacity: 0.6; }
    50% { opacity: 0.8; }
  }
  @keyframes bubble1 {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(2px); }
  }
  @keyframes bubble2 {
    0%, 100% { transform: translateX(0); }
    50% { transform: translateX(-2px); }
  }
  @keyframes clip {
    0%, 100% { transform: scaleX(1); }
    50% { transform: scaleX(1.1); }
  }
  @keyframes chartLines {
    0%, 100% { stroke-dashoffset: 0; }
    50% { stroke-dashoffset: 4; }
  }
  @keyframes medicalCross {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
  }
  @keyframes centralAtom {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.2); }
  }
  @keyframes atom1 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-1px, -1px); }
  }
  @keyframes atom2 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(1px, -1px); }
  }
  @keyframes atom3 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(-1px, 1px); }
  }
  @keyframes atom4 {
    0%, 100% { transform: translate(0, 0); }
    50% { transform: translate(1px, 1px); }
  }
  @keyframes bond1 {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }
  @keyframes bond2 {
    0%, 100% { opacity: 0.7; }
    50% { opacity: 1; }
  }
  @keyframes bond3 {
    0%, 100% { opacity: 0.8; }
    50% { opacity: 0.5; }
  }
  @keyframes bond4 {
    0%, 100% { opacity: 0.5; }
    50% { opacity: 0.8; }
  }
  @keyframes shield {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }
  @keyframes innerShield {
    0%, 100% { opacity: 0.3; }
    50% { opacity: 0.5; }
  }
  @keyframes shieldCross {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(0.95); }
  }
  @keyframes watchBody {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.02); }
  }
  @keyframes topBand {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-1px); }
  }
  @keyframes bottomBand {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(1px); }
  }
  @keyframes heartRate {
    0%, 100% { stroke-dashoffset: 0; }
    50% { stroke-dashoffset: 5; }
  }
`;

// Export animation keyframes
export const AdvancedLogoAnimations = () => (
  <style jsx global>{advancedAnimationKeyframes}</style>
);

// Export all logos as a collection
export const AdvancedMedicalLogos = {
  PulseWave: PulseWaveLogo,
  GenomeSequence: GenomeSequenceLogo,
  Telemedicine: TelemedicineLogo,
  MedicalResearch: MedicalResearchLogo,
  MedicalAI: MedicalAILogo,
  Vaccine: VaccineLogo,
  MedicalChart: MedicalChartLogo,
  Biotech: BiotechLogo,
  MedicalShield: MedicalShieldLogo,
  SmartHealth: SmartHealthLogo,
}; 