import React, { useMemo, useState } from 'react';
import { SHIFT_THEME_CONFIG, normalizeShiftCode } from '../constants';
import { ShiftUser } from '../types';

interface ShiftCoverageIndicatorProps {
  coverageValue: number;
  Icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  assignedUsers?: ShiftUser[];
  requiredUnits: number;
  gradientId: string;
  iconLabel: string;
  normalizedShiftCode: string;
  size?: number;
  radius?: number;
  strokeWidth?: number;
  badgeSize?: number;
  /** Force dark mode simulation for the component styles */
  darkMode?: boolean;
}

// Threshold: If we have FEWER than this number, show avatars. 
const AVATAR_THRESHOLD = 9;
const BADGE_BASE_TRANSFORM = 'translate(20%, 20%)';

const ShiftCoverageIndicator: React.FC<ShiftCoverageIndicatorProps> = ({
  coverageValue,
  Icon,
  assignedUsers = [],
  requiredUnits,
  gradientId,
  iconLabel,
  normalizedShiftCode,
  size = 56,
  radius = 24,
  strokeWidth = 6,
  badgeSize = 20,
  darkMode = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const safeShiftCode = normalizeShiftCode(normalizedShiftCode);
  const shiftConfig = SHIFT_THEME_CONFIG[safeShiftCode];

  // Theme Colors logic
  const startColor = darkMode ? shiftConfig.gradient.startDark : shiftConfig.gradient.startLight;
  const endColor = darkMode ? shiftConfig.gradient.endDark : shiftConfig.gradient.endLight;
  const iconColor = darkMode ? shiftConfig.icon.dark : shiftConfig.icon.light;
  const trackColor = darkMode ? 'rgba(255, 255, 255, 0.08)' : 'rgba(224, 224, 224, 1)'; // grey-300
  const badgeBg = darkMode ? '#1e293b' : '#ffffff';
  const badgeBorder = darkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)';
  const badgeText = darkMode ? '#f8fafc' : '#1e293b';

  // Circle Math
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (coverageValue / 100) * circumference;
  const assignedCount = assignedUsers.length;
  
  // Interaction Logic:
  // We only allow the "fly out" interaction if we have users AND they fit (count < 9).
  // Otherwise, we just show the static badge (for 0 users or > 8 users).
  const isInteractive = assignedCount > 0 && assignedCount < AVATAR_THRESHOLD;

  // Position avatars
  const avatarElements = useMemo(() => {
    // If we have too many users, we don't render avatars at all (just the badge).
    if (assignedCount >= AVATAR_THRESHOLD) return null;
    if (assignedCount === 0) return null;

    // Determine effective count for slot distribution
    const count = Math.max(assignedCount, requiredUnits || assignedCount);

    // DYNAMIC SIZING & ORBIT CALCULATION
    const trackGap = 4;
    let calculatedAvatarSize = size * 0.42;
    let orbitRadius = radius + (strokeWidth / 2) + trackGap + (calculatedAvatarSize / 2);
    const minAvatarGap = 2; 
    const chordLength = 2 * orbitRadius * Math.sin(Math.PI / count);
    const maxSafeSize = chordLength - minAvatarGap;
    
    if (maxSafeSize < calculatedAvatarSize) {
      calculatedAvatarSize = Math.max(20, maxSafeSize);
      orbitRadius = radius + (strokeWidth / 2) + trackGap + (calculatedAvatarSize / 2);
    }
    
    const angleStep = (2 * Math.PI) / count;

    // Calculate origin for the fly-out effect (approximate badge position at bottom-right)
    // Badge is at bottom:0, right:0 of the box, plus translate(20%, 20%).
    // We target the corner (size, size) as the spawn point.
    const spawnX = size; 
    const spawnY = size;

    return assignedUsers.map((user, index) => {
      // Place each avatar at the END of its "slot".
      const angle = -Math.PI / 2 + ((index + 1) * angleStep);
      
      const targetX = (size / 2) + orbitRadius * Math.cos(angle);
      const targetY = (size / 2) + orbitRadius * Math.sin(angle);

      // Delta to move FROM spawn point TO target point
      // If we are NOT hovered, we want to be at Spawn.
      // Current position is defined by left/top = targetX/targetY.
      // To visually move it to Spawn, we translate by (Spawn - Target).
      const deltaX = spawnX - targetX;
      const deltaY = spawnY - targetY;

      return (
        <div
          key={user.id}
          className="absolute rounded-full border-2 bg-white shadow-sm flex items-center justify-center overflow-hidden"
          style={{
            width: calculatedAvatarSize,
            height: calculatedAvatarSize,
            left: targetX,
            top: targetY,
            borderColor: endColor,
            zIndex: 10 + index,
            // Animation Styles
            opacity: isInteractive && !isHovered ? 0 : 1,
            transform: isInteractive && !isHovered
              ? `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(0.1)` // Start at badge, tiny
              : 'translate(-50%, -50%) scale(1)', // End at orbit, full size
            transition: `transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 40}ms, opacity 0.2s ${index * 40}ms`,
            pointerEvents: isHovered ? 'auto' : 'none', // Prevent interactions when hidden
          }}
          title={user.name}
        >
          <img 
            src={user.avatarUrl} 
            alt={user.name} 
            className="w-full h-full object-cover"
          />
        </div>
      );
    });
  }, [assignedUsers, assignedCount, size, radius, strokeWidth, endColor, requiredUnits, isInteractive, isHovered]);


  const title = `${iconLabel}: ${assignedCount}/${requiredUnits} (${coverageValue}%)`;

  return (
    <div 
      className="relative flex items-center justify-center select-none"
      style={{ width: size, height: size }}
      title={title}
      aria-label={title}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* The Avatars (Satellites) */}
      {avatarElements}

      {/* The SVG Chart */}
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible" 
        style={{ transform: 'rotate(0deg)' }} 
        role="presentation"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={startColor} />
            <stop offset="100%" stopColor={endColor} />
          </linearGradient>
        </defs>
        
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={trackColor}
          fill="transparent"
        />
        
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke={`url(#${gradientId})`}
          fill="transparent"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>

      {/* Center Icon */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
        style={{ color: iconColor }}
      >
        {Icon && <Icon width={size * 0.45} height={size * 0.45} aria-label={iconLabel} />}
      </div>

      {/* Bottom Right Badge */}
      {/* Logic: Always rendered. If interactive & hovered, it scales down/fades out. */}
      <div
        className="absolute flex items-center justify-center rounded-full shadow-sm border transition-all duration-300 ease-in-out"
        style={{
          bottom: 0,
          right: 0,
          transform: isInteractive && isHovered 
            ? `${BADGE_BASE_TRANSFORM} scale(0)` 
            : `${BADGE_BASE_TRANSFORM} scale(1)`,
          opacity: isInteractive && isHovered ? 0 : 1,
          width: badgeSize,
          height: badgeSize,
          backgroundColor: badgeBg,
          borderColor: badgeBorder,
          zIndex: 20
        }}
      >
        <span
          style={{
            fontWeight: 700,
            lineHeight: 1,
            fontSize: badgeSize ? `${badgeSize * 0.55}px` : '0.6rem',
            color: badgeText,
          }}
        >
          {assignedCount === 0 || assignedCount > requiredUnits ? assignedCount : requiredUnits}
        </span>
      </div>
    </div>
  );
};

export default ShiftCoverageIndicator;