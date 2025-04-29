import React from 'react';

// Healthcare-Specific Animated Icons
export const createHealthcareIcons = (primaryColors: string[], secondaryColors: string[], logoStyle: string) => [
  // Hospital Icon Animation
  (id: number) => {
    const primary = primaryColors[0];
    const secondary = secondaryColors[0];
    
    return (
      <div className="logo-option">
        <div className="logo-number">Logo #{id}</div>
        <svg viewBox="0 0 40 40" className={logoStyle}>
          <rect width="40" height="40" fill="transparent" />
          
          {/* Hospital Building */}
          <rect x="8" y="10" width="24" height="22" rx="1" fill={primary} />
          
          {/* Windows */}
          <rect x="12" y="14" width="4" height="4" fill="white" className="animate-pulse" style={{ animationDuration: '3s' }} />
          <rect x="18" y="14" width="4" height="4" fill="white" className="animate-pulse" style={{ animationDuration: '2s' }} />
          <rect x="24" y="14" width="4" height="4" fill="white" className="animate-pulse" style={{ animationDuration: '4s' }} />
          
          <rect x="12" y="20" width="4" height="4" fill="white" className="animate-pulse" style={{ animationDuration: '2.5s' }} />
          <rect x="18" y="20" width="4" height="4" fill="white" className="animate-pulse" style={{ animationDuration: '3.5s' }} />
          <rect x="24" y="20" width="4" height="4" fill="white" className="animate-pulse" style={{ animationDuration: '2.8s' }} />
          
          {/* Door */}
          <rect x="16" y="26" width="8" height="6" fill="white" />
          
          {/* Hospital Cross */}
          <path 
            d="M20 7V10M18.5 8.5H21.5" 
            stroke={secondary} 
            strokeWidth="2" 
            strokeLinecap="round"
            className="animate-pulse" 
          />
          
          {/* Ambulance Animation */}
          <rect 
            x="10" 
            y="32" 
            width="6" 
            height="3" 
            fill={secondary}
            className="animate-[hospital-ambulance_5s_ease-in-out_infinite]" 
          />
          
          <style jsx>{`
            @keyframes hospital-ambulance {
              0%, 100% {
                transform: translateX(0);
              }
              50% {
                transform: translateX(14px);
              }
            }
          `}</style>
        </svg>
        <div className="font-semibold text-xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{
            backgroundImage: `linear-gradient(to right, ${primary}, ${secondary})`
          }}>Med</span>
          <span>Connect</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">Hospital Services</div>
      </div>
    );
  },
  
  // Doctor Icon Animation
  (id: number) => {
    const primary = primaryColors[1];
    const secondary = secondaryColors[1];
    
    return (
      <div className="logo-option">
        <div className="logo-number">Logo #{id}</div>
        <svg viewBox="0 0 40 40" className={logoStyle}>
          <rect width="40" height="40" fill="transparent" />
          
          {/* Doctor Head */}
          <circle cx="20" cy="12" r="6" fill={primary} />
          
          {/* Stethoscope */}
          <path 
            d="M14 19C14 19 12 24 16 26C20 28 26 25 26 20" 
            fill="none" 
            stroke={secondary} 
            strokeWidth="1.5" 
            strokeLinecap="round"
            className="animate-[stethoscope-pulse_3s_ease-in-out_infinite]" 
          />
          
          <circle 
            cx="26" 
            cy="20" 
            r="2" 
            fill={secondary}
            className="animate-pulse" 
          />
          
          {/* Doctor Body */}
          <path 
            d="M16 18L16 31M24 18L24 31M16 24H24M16 31H24" 
            stroke={primary} 
            strokeWidth="2" 
            strokeLinecap="round" 
          />
          
          {/* Face Features */}
          <circle cx="18" cy="11" r="1" fill="white" />
          <circle cx="22" cy="11" r="1" fill="white" />
          <path d="M18 14C19 15 21 15 22 14" stroke="white" strokeWidth="0.8" strokeLinecap="round" />
          
          <style jsx>{`
            @keyframes stethoscope-pulse {
              0%, 100% {
                stroke-width: 1.5;
                transform: translateY(0);
              }
              50% {
                stroke-width: 2;
                transform: translateY(-1px);
              }
            }
          `}</style>
        </svg>
        <div className="font-semibold text-xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{
            backgroundImage: `linear-gradient(to right, ${primary}, ${secondary})`
          }}>Med</span>
          <span>Connect</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">Doctor Consultations</div>
      </div>
    );
  },
  
  // Laboratory Icon Animation
  (id: number) => {
    const primary = primaryColors[2];
    const secondary = secondaryColors[2];
    
    return (
      <div className="logo-option">
        <div className="logo-number">Logo #{id}</div>
        <svg viewBox="0 0 40 40" className={logoStyle}>
          <rect width="40" height="40" fill="transparent" />
          
          {/* Lab Flask */}
          <path 
            d="M16 10V20L10 30H30L24 20V10" 
            fill="none" 
            stroke={primary} 
            strokeWidth="2" 
            strokeLinejoin="round" 
          />
          
          {/* Flask Top */}
          <rect x="16" y="8" width="8" height="3" fill={primary} />
          
          {/* Liquid Animation */}
          <path 
            d="M13 26C15 24 25 24 27 26L25 30H15L13 26Z" 
            fill={secondary}
            className="animate-[lab-liquid_4s_ease-in-out_infinite]" 
          />
          
          {/* Bubbles */}
          <circle 
            cx="18" 
            cy="24" 
            r="1" 
            fill="white" 
            className="animate-[lab-bubble1_3s_ease-in-out_infinite]" 
          />
          <circle 
            cx="22" 
            cy="23" 
            r="0.8" 
            fill="white" 
            className="animate-[lab-bubble2_2.5s_ease-in-out_infinite]" 
          />
          <circle 
            cx="20" 
            cy="25" 
            r="0.6" 
            fill="white" 
            className="animate-[lab-bubble3_2s_ease-in-out_infinite]" 
          />
          
          <style jsx>{`
            @keyframes lab-liquid {
              0%, 100% {
                d: path('M13 26C15 24 25 24 27 26L25 30H15L13 26Z');
              }
              50% {
                d: path('M13 26C17 28 23 28 27 26L25 30H15L13 26Z');
              }
            }
            @keyframes lab-bubble1 {
              0% {
                transform: translateY(0);
                opacity: 0.8;
              }
              100% {
                transform: translateY(-4px);
                opacity: 0;
              }
            }
            @keyframes lab-bubble2 {
              0% {
                transform: translateY(0);
                opacity: 0.8;
              }
              100% {
                transform: translateY(-3px);
                opacity: 0;
              }
            }
            @keyframes lab-bubble3 {
              0% {
                transform: translateY(0);
                opacity: 0.8;
              }
              100% {
                transform: translateY(-2px);
                opacity: 0;
              }
            }
          `}</style>
        </svg>
        <div className="font-semibold text-xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{
            backgroundImage: `linear-gradient(to right, ${primary}, ${secondary})`
          }}>Med</span>
          <span>Connect</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">Laboratory Services</div>
      </div>
    );
  },
  
  // Pharmacy Icon Animation
  (id: number) => {
    const primary = primaryColors[3];
    const secondary = secondaryColors[3];
    
    return (
      <div className="logo-option">
        <div className="logo-number">Logo #{id}</div>
        <svg viewBox="0 0 40 40" className={logoStyle}>
          <rect width="40" height="40" fill="transparent" />
          
          {/* Medicine Bottle */}
          <path 
            d="M14 12H26V14C29 14 30 16 30 18V30C30 32 28 33 26 33H14C12 33 10 32 10 30V18C10 16 11 14 14 14V12Z" 
            fill={primary} 
          />
          
          {/* Bottle Cap */}
          <rect x="15" y="9" width="10" height="3" rx="1" fill={secondary} />
          
          {/* Label */}
          <rect x="12" y="18" width="16" height="8" rx="1" fill="white" />
          
          {/* Pills Animation */}
          <circle 
            cx="16" 
            cy="30" 
            r="1.5" 
            fill={secondary}
            className="animate-[pill1_5s_ease-in-out_infinite]" 
          />
          <circle 
            cx="20" 
            cy="30" 
            r="1.5" 
            fill={secondary}
            className="animate-[pill2_5s_ease-in-out_infinite]"
            style={{ animationDelay: '0.7s' }} 
          />
          <circle 
            cx="24" 
            cy="30" 
            r="1.5" 
            fill={secondary}
            className="animate-[pill3_5s_ease-in-out_infinite]"
            style={{ animationDelay: '1.4s' }} 
          />
          
          {/* Rx Symbol */}
          <text 
            x="20" 
            y="23" 
            fill={primary} 
            fontSize="5" 
            fontWeight="bold" 
            textAnchor="middle"
            dominantBaseline="middle"
          >
            Rx
          </text>
          
          <style jsx>{`
            @keyframes pill1 {
              0%, 100% {
                transform: translateY(0);
              }
              20%, 80% {
                transform: translateY(-4px);
              }
            }
            @keyframes pill2 {
              0%, 100% {
                transform: translateY(0);
              }
              20%, 80% {
                transform: translateY(-3px);
              }
            }
            @keyframes pill3 {
              0%, 100% {
                transform: translateY(0);
              }
              20%, 80% {
                transform: translateY(-5px);
              }
            }
          `}</style>
        </svg>
        <div className="font-semibold text-xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{
            backgroundImage: `linear-gradient(to right, ${primary}, ${secondary})`
          }}>Med</span>
          <span>Connect</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">Pharmacy Services</div>
      </div>
    );
  },
  
  // Patient Care Icon Animation
  (id: number) => {
    const primary = primaryColors[4];
    const secondary = secondaryColors[4];
    
    return (
      <div className="logo-option">
        <div className="logo-number">Logo #{id}</div>
        <svg viewBox="0 0 40 40" className={logoStyle}>
          <rect width="40" height="40" fill="transparent" />
          
          {/* Caring Hands */}
          <path 
            d="M10 24C14 18 20 15 20 15C20 15 26 18 30 24" 
            fill="none" 
            stroke={primary} 
            strokeWidth="2" 
            strokeLinejoin="round" 
            strokeLinecap="round"
            className="animate-[caring-hands_4s_ease-in-out_infinite]" 
          />
          
          {/* Heart */}
          <path 
            d="M20 18C20 18 24 14 28 18C31 21 28 26 20 30C12 26 9 21 12 18C16 14 20 18 20 18Z" 
            fill={secondary}
            className="animate-[heart-beat_1.5s_ease-in-out_infinite]" 
          />
          
          {/* Patient */}
          <circle 
            cx="20" 
            cy="10" 
            r="4" 
            fill={primary}
            className="animate-pulse"
            style={{ animationDuration: '3s' }} 
          />
          
          {/* Heartbeat Line */}
          <path 
            d="M14 22L17 20L19 24L21 20L23 24L26 22" 
            stroke="white" 
            strokeWidth="1" 
            strokeLinecap="round"
            strokeLinejoin="round"
            className="animate-pulse"
            style={{ animationDuration: '1.5s' }} 
          />
          
          <style jsx>{`
            @keyframes caring-hands {
              0%, 100% {
                transform: translateY(0) scale(1);
              }
              50% {
                transform: translateY(-1px) scale(1.05);
              }
            }
            @keyframes heart-beat {
              0%, 100% {
                transform: scale(1);
              }
              15% {
                transform: scale(1.1);
              }
              30% {
                transform: scale(1);
              }
              45% {
                transform: scale(1.05);
              }
            }
          `}</style>
        </svg>
        <div className="font-semibold text-xl">
          <span className="text-transparent bg-clip-text bg-gradient-to-r" style={{
            backgroundImage: `linear-gradient(to right, ${primary}, ${secondary})`
          }}>Med</span>
          <span>Connect</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">Patient Care</div>
      </div>
    );
  },
];

export default createHealthcareIcons; 