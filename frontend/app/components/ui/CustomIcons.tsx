'use client';

import React from 'react';

interface IconProps {
  size?: number;
  color?: string;
  className?: string;
}

export function UsersIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M12 13C14.2091 13 16 11.2091 16 9C16 6.79086 14.2091 5 12 5C9.79086 5 8 6.79086 8 9C8 11.2091 9.79086 13 12 13Z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M19.5 20.5C19.5 16.9101 16.0899 14 12 14C7.91015 14 4.5 16.9101 4.5 20.5" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 13C14.2091 13 16 11.2091 16 9C16 6.79086 14.2091 5 12 5C9.79086 5 8 6.79086 8 9C8 11.2091 9.79086 13 12 13Z" 
        fill="rgba(20, 184, 166, 0.2)" 
      />
    </svg>
  );
}

export function MedicationIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect 
        x="7" 
        y="4" 
        width="10" 
        height="16" 
        rx="2" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <rect 
        x="7" 
        y="4" 
        width="10" 
        height="16" 
        rx="2" 
        fill="rgba(20, 184, 166, 0.2)" 
      />
      <path 
        d="M7 10H17" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <path 
        d="M12 14L12 16" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
      <path 
        d="M10 7.5H14" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />
    </svg>
  );
}

export function DoctorIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M12 13C14.2091 13 16 11.2091 16 9C16 6.79086 14.2091 5 12 5C9.79086 5 8 6.79086 8 9C8 11.2091 9.79086 13 12 13Z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M12 13C14.2091 13 16 11.2091 16 9C16 6.79086 14.2091 5 12 5C9.79086 5 8 6.79086 8 9C8 11.2091 9.79086 13 12 13Z" 
        fill="rgba(20, 184, 166, 0.2)" 
      />
      <path 
        d="M17.5 20.5C17.5 16.9101 15.0899 14 12 14C8.91015 14 6.5 16.9101 6.5 20.5" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <rect 
        x="11" 
        y="2" 
        width="2" 
        height="2" 
        rx="1" 
        fill={color}
      />
      <path 
        d="M9 18H15" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
      <path 
        d="M9 16H15" 
        stroke={color} 
        strokeWidth="1.5" 
        strokeLinecap="round"
      />
    </svg>
  );
}

export function AppointmentIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect 
        x="4" 
        y="5" 
        width="16" 
        height="15" 
        rx="2" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <rect 
        x="4" 
        y="5" 
        width="16" 
        height="15" 
        rx="2" 
        fill="rgba(20, 184, 166, 0.2)" 
      />
      <path 
        d="M16 2V5" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M8 2V5" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M4 10H20" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <circle cx="12" cy="15" r="2" fill={color} />
    </svg>
  );
}

export function AnalyticsIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M4 4V20H20" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <rect 
        x="6" 
        y="14" 
        width="3" 
        height="6" 
        rx="1" 
        fill="rgba(20, 184, 166, 0.4)" 
        stroke={color} 
      />
      <rect 
        x="11" 
        y="10" 
        width="3" 
        height="10" 
        rx="1" 
        fill="rgba(20, 184, 166, 0.6)" 
        stroke={color} 
      />
      <rect 
        x="16" 
        y="7" 
        width="3" 
        height="13" 
        rx="1" 
        fill="rgba(20, 184, 166, 0.8)" 
        stroke={color}
      />
    </svg>
  );
}

export function HealthIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} pulse-animation`}
    >
      <path 
        d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="rgba(20, 184, 166, 0.2)"
      />
      <path 
        d="M9 12H15" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      <path 
        d="M12 9L12 15" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round"
      />

      <style jsx>{`
        .pulse-animation {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
          100% {
            transform: scale(1);
          }
        }
      `}</style>
    </svg>
  );
}

export function SecurityIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M12 2L3 7V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V7L12 2Z" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
        fill="rgba(20, 184, 166, 0.2)"
      />
      <path 
        d="M12 8V16" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
      <path 
        d="M8 12H16" 
        stroke={color} 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SettingsIcon({ size = 24, color = 'currentColor', className = '' }: IconProps) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} settings-rotate`}
    >
      <circle 
        cx="12" 
        cy="12" 
        r="3" 
        stroke={color}
        strokeWidth="2"
        fill="rgba(20, 184, 166, 0.3)"
      />
      <path 
        d="M19.4 15.0001C19.2669 15.3016 19.2272 15.6362 19.286 15.9606C19.3448 16.285 19.4995 16.5843 19.73 16.8101L19.79 16.8701C19.976 17.0564 20.1235 17.2791 20.2241 17.5245C20.3248 17.7699 20.3766 18.0322 20.3766 18.2976C20.3766 18.5629 20.3248 18.8253 20.2241 19.0707C20.1235 19.316 19.976 19.5388 19.79 19.7251C19.6037 19.911 19.381 20.0586 19.1356 20.1592C18.8902 20.2599 18.6279 20.3117 18.3625 20.3117C18.0971 20.3117 17.8348 20.2599 17.5894 20.1592C17.344 20.0586 17.1212 19.911 16.935 19.7251L16.875 19.6651C16.6492 19.4345 16.3499 19.2798 16.0255 19.221C15.7011 19.1622 15.3665 19.2019 15.065 19.3351C14.7723 19.4612 14.5231 19.6713 14.3478 19.9408C14.1726 20.2103 14.0781 20.5274 14.075 20.8501V21.0001C14.075 21.5305 13.8643 22.0392 13.4892 22.4143C13.1141 22.7893 12.6055 23.0001 12.075 23.0001C11.5445 23.0001 11.0359 22.7893 10.6608 22.4143C10.2857 22.0392 10.075 21.5305 10.075 21.0001V20.9101C10.0655 20.5788 9.9577 20.2556 9.77448 19.9841C9.59126 19.7127 9.33291 19.5051 9.03 19.3851C8.72854 19.2518 8.39394 19.2122 8.06951 19.271C7.74508 19.3298 7.44581 19.4845 7.22 19.7151L7.16 19.7751C6.97366 19.961 6.75089 20.1086 6.50549 20.2092C6.26008 20.3099 5.99776 20.3617 5.7324 20.3617C5.46703 20.3617 5.20471 20.3099 4.95931 20.2092C4.7139 20.1086 4.49114 19.961 4.3048 19.7751C4.11878 19.5888 3.97123 19.366 3.87057 19.1206C3.76991 18.8752 3.71813 18.6129 3.71813 18.3476C3.71813 18.0822 3.76991 17.8199 3.87057 17.5745C3.97123 17.3291 4.11878 17.1063 4.3048 16.9201L4.3648 16.8601C4.59539 16.6343 4.75006 16.335 4.80889 16.0106C4.86771 15.6862 4.82809 15.3516 4.695 15.0501C4.5689 14.7575 4.35877 14.5082 4.08929 14.333C3.81981 14.1577 3.50264 14.0633 3.18 14.0601H3.0748C2.54435 14.0601 2.03571 13.8494 1.66064 13.4743C1.28556 13.0992 1.0748 12.5906 1.0748 12.0601C1.0748 11.5297 1.28556 11.021 1.66064 10.6459C2.03571 10.2709 2.54435 10.0601 3.0748 10.0601H3.1648C3.49607 10.0507 3.81929 9.94285 4.09079 9.75963C4.36229 9.57641 4.56987 9.31806 4.69 9.01515C4.82309 8.71369 4.86271 8.37909 4.80389 8.05466C4.74506 7.73022 4.59039 7.43095 4.36 7.20515L4.3 7.14515C4.11398 6.95881 3.96643 6.73605 3.86577 6.49064C3.76511 6.24524 3.71333 5.98292 3.71333 5.71755C3.71333 5.45219 3.76511 5.18987 3.86577 4.94446C3.96643 4.69906 4.11398 4.4763 4.3 4.29015C4.48635 4.10413 4.70911 3.95658 4.95452 3.85592C5.19992 3.75526 5.46224 3.70348 5.7276 3.70348C5.99297 3.70348 6.25529 3.75526 6.50069 3.85592C6.7461 3.95658 6.96886 4.10413 7.1552 4.29015L7.2152 4.35015C7.441 4.58074 7.74027 4.73541 8.0647 4.79423C8.38913 4.85306 8.72374 4.81344 9.0252 4.68035H9.0752C9.36791 4.55425 9.61713 4.34412 9.79237 4.07464C9.9676 3.80516 10.062 3.48799 10.0652 3.16535V3.00015C10.0652 2.46971 10.276 1.96106 10.651 1.58599C11.0261 1.21091 11.5348 1.00015 12.0652 1.00015C12.5956 1.00015 13.1043 1.21091 13.4794 1.58599C13.8544 1.96106 14.0652 2.46971 14.0652 3.00015V3.09015C14.0684 3.41279 14.1628 3.72996 14.338 3.99944C14.5133 4.26892 14.7625 4.47905 15.0552 4.60515C15.3566 4.73824 15.6912 4.77786 16.0157 4.71903C16.3401 4.66021 16.6394 4.50554 16.8652 4.27515L16.9252 4.21515C17.1115 4.02913 17.3343 3.88158 17.5797 3.78092C17.8251 3.68026 18.0874 3.62848 18.3528 3.62848C18.6181 3.62848 18.8805 3.68026 19.1259 3.78092C19.3713 3.88158 19.594 4.02913 19.7802 4.21515C19.9662 4.4015 20.1138 4.62426 20.2144 4.86967C20.3151 5.11507 20.3669 5.37739 20.3669 5.64275C20.3669 5.90812 20.3151 6.17044 20.2144 6.41584C20.1138 6.66125 19.9662 6.88401 19.7802 7.07035L19.7202 7.13035C19.4896 7.35615 19.3349 7.65541 19.2761 7.97985C19.2173 8.30428 19.2569 8.63888 19.39 8.94035V9.00015C19.5161 9.29286 19.7262 9.54208 19.9957 9.71732C20.2652 9.89255 20.5823 9.98698 20.905 9.99015H21.0652C21.5956 9.99015 22.1043 10.2009 22.4794 10.576C22.8544 10.9511 23.0652 11.4597 23.0652 11.9901C23.0652 12.5206 22.8544 13.0293 22.4794 13.4043C22.1043 13.7794 21.5956 13.9901 21.0652 13.9901H20.9752C20.6525 13.9933 20.3354 14.0878 20.0659 14.263C19.7964 14.4382 19.5863 14.6875 19.4602 14.9801L19.4 15.0001Z" 
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <style jsx>{`
        .settings-rotate {
          animation: rotate 8s linear infinite;
        }
        @keyframes rotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </svg>
  );
}

export function NotificationIcon({ size = 24, color = 'currentColor', className = '', showBadge = false }: IconProps & { showBadge?: boolean }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} ${showBadge ? 'notification-shake' : ''}`}
    >
      <path 
        d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(20, 184, 166, 0.2)"
      />
      <path 
        d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {showBadge && (
        <circle cx="18" cy="6" r="3" fill="#ef4444" />
      )}

      <style jsx>{`
        .notification-shake {
          animation: shake 2s cubic-bezier(.36,.07,.19,.97) 2s infinite;
          transform-origin: top center;
        }
        @keyframes shake {
          0%, 100% {
            transform: rotate(0);
          }
          10%, 30%, 50%, 70%, 90% {
            transform: rotate(-2deg);
          }
          20%, 40%, 60%, 80% {
            transform: rotate(2deg);
          }
        }
      `}</style>
    </svg>
  );
}

export default {
  UsersIcon,
  MedicationIcon,
  DoctorIcon,
  AppointmentIcon,
  AnalyticsIcon,
  HealthIcon,
  SecurityIcon,
  SettingsIcon,
  NotificationIcon
}; 