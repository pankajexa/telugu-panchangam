/**
 * Custom Hindu spiritual SVG icons.
 * These are universal Hindu religious symbols — hand-crafted for this app.
 * Flaticon-inspired clean line style, consistent 24x24 viewBox.
 */

// ═══════════════════════════════════════════════════
// Om (ॐ) — The primordial sound
// ═══════════════════════════════════════════════════
export function OmIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M8.5 17.5c-2.5 0-4.5-1.8-4.5-4.2 0-2 1.2-3.5 3-4.1.3-2.5 2.5-4.2 5-4.2 2.8 0 5 2.2 5 5 0 .4 0 .7-.1 1.1 1.5.7 2.6 2.1 2.6 3.9 0 2.3-1.9 4.2-4.3 4.2"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M15.5 8c1.2 0 2.2.5 2.8 1.3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="17.5" cy="5.5" r="1.2" fill={color} />
      <path d="M14.5 4.5c.5-.8 1.2-1.2 2-1.2" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// Diya (दीपक) — Sacred oil lamp
// ═══════════════════════════════════════════════════
export function DiyaIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      {/* Flame */}
      <path d="M12 3c0 0-2.5 3-2.5 4.5C9.5 9 10.5 10 12 10s2.5-1 2.5-2.5C14.5 6 12 3 12 3z"
        fill={color} opacity="0.25" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
      {/* Lamp body */}
      <path d="M7 14c0-2 2.2-3 5-3s5 1 5 3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Base */}
      <path d="M6 14h12c0 0-.5 4-6 4s-6-4-6-4z" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Stand */}
      <line x1="12" y1="18" x2="12" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="20" x2="15" y2="20" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// Kalash (कलश) — Sacred pot with coconut & leaves
// ═══════════════════════════════════════════════════
export function KalashIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      {/* Pot body */}
      <path d="M7 12c0 4 2.2 7 5 7s5-3 5-7" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      {/* Pot rim */}
      <path d="M6.5 12h11" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Neck */}
      <path d="M9 12V10.5c0-.8.7-1.5 1.5-1.5h3c.8 0 1.5.7 1.5 1.5V12" stroke={color} strokeWidth="1.5" />
      {/* Coconut */}
      <circle cx="12" cy="7" r="2" stroke={color} strokeWidth="1.3" />
      {/* Leaves */}
      <path d="M10 6.5c-1.5-1.5-3-1.5-3-1.5s0 1.5 1.5 3" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M14 6.5c1.5-1.5 3-1.5 3-1.5s0 1.5-1.5 3" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      {/* Base */}
      <path d="M9 19h6" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// Trishul (त्रिशूल) — Shiva's trident
// ═══════════════════════════════════════════════════
export function TrishulIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <line x1="12" y1="6" x2="12" y2="21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Center prong */}
      <path d="M12 6V3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Left prong */}
      <path d="M7 8c0-3 2-5 2-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right prong */}
      <path d="M17 8c0-3-2-5-2-5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* Cross bar */}
      <path d="M7 8h10" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      {/* Damru */}
      <path d="M10 11h4M10.5 10l3 2M13.5 10l-3 2" stroke={color} strokeWidth="1" strokeLinecap="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// Lotus (कमल) — Purity, spiritual awakening
// ═══════════════════════════════════════════════════
export function LotusIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      {/* Center petal */}
      <path d="M12 4c-1.5 3-1.5 6 0 9 1.5-3 1.5-6 0-9z" fill={color} opacity="0.15" stroke={color} strokeWidth="1.2" />
      {/* Left petals */}
      <path d="M8.5 6.5C7 9 7.5 12 9.5 14c-.5-3.5.5-6 2-7.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5.5 9C4.5 11.5 5.5 14 8 15.5c-1-3 0-5.5 1.5-7" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      {/* Right petals */}
      <path d="M15.5 6.5C17 9 16.5 12 14.5 14c.5-3.5-.5-6-2-7.5" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M18.5 9c1 2.5 0 5-2.5 6.5 1-3 0-5.5-1.5-7" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
      {/* Base/water */}
      <path d="M5 16.5c2.5 1.5 5 2 7 2s4.5-.5 7-2" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// Shankha (शंख) — Sacred conch shell
// ═══════════════════════════════════════════════════
export function ShankhaIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M14 4c3 1 5 4 5 8 0 4-2 7-5 8.5C11.5 19 9 17 9 14c0-2 1.5-3.5 3.5-3.5 1.5 0 2.5 1 2.5 2.5 0 1-1 2-2 2"
        stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9 14c-2 0-3.5-1-4-3" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M9.5 19.5L8 21" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// Mala (माला) — Prayer beads
// ═══════════════════════════════════════════════════
export function MalaIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      {/* String of beads in a loop */}
      <circle cx="12" cy="4" r="1.5" stroke={color} strokeWidth="1.2" />
      <circle cx="8" cy="5.5" r="1.5" stroke={color} strokeWidth="1.2" />
      <circle cx="5.5" cy="9" r="1.5" stroke={color} strokeWidth="1.2" />
      <circle cx="5" cy="13" r="1.5" stroke={color} strokeWidth="1.2" />
      <circle cx="7" cy="16.5" r="1.5" stroke={color} strokeWidth="1.2" />
      <circle cx="10" cy="19" r="1.5" stroke={color} strokeWidth="1.2" />
      <circle cx="14" cy="19" r="1.5" stroke={color} strokeWidth="1.2" />
      <circle cx="17" cy="16.5" r="1.5" stroke={color} strokeWidth="1.2" />
      <circle cx="19" cy="13" r="1.5" stroke={color} strokeWidth="1.2" />
      <circle cx="18.5" cy="9" r="1.5" stroke={color} strokeWidth="1.2" />
      <circle cx="16" cy="5.5" r="1.5" stroke={color} strokeWidth="1.2" />
      {/* Guru bead (tassel) */}
      <circle cx="12" cy="21.5" r="1" fill={color} opacity="0.4" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// Chakra (चक्र) — Sudarshana Chakra / Yoga wheel
// ═══════════════════════════════════════════════════
export function ChakraIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx="12" cy="12" r="8.5" stroke={color} strokeWidth="1.5" />
      <circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.3" />
      {/* Spokes */}
      {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => {
        const rad = (angle * Math.PI) / 180;
        const x1 = 12 + 3 * Math.cos(rad);
        const y1 = 12 + 3 * Math.sin(rad);
        const x2 = 12 + 8.5 * Math.cos(rad);
        const y2 = 12 + 8.5 * Math.sin(rad);
        return <line key={angle} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" />;
      })}
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// Crescent Moon (चंद्र) — For tithi representation
// ═══════════════════════════════════════════════════
export function CrescentIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M20 12c0 4.4-3.6 8-8 8-1.5 0-2.9-.4-4.1-1.1C10.4 18 12.5 15.2 12.5 12S10.4 6 7.9 5.1C9.1 4.4 10.5 4 12 4c4.4 0 8 3.6 8 8z"
        fill={color} opacity="0.15" stroke={color} strokeWidth="1.5" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// Star Cluster (नक्षत्र) — For nakshatra representation
// ═══════════════════════════════════════════════════
export function NakshatraIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      {/* Main star */}
      <path d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5z"
        fill={color} opacity="0.15" stroke={color} strokeWidth="1.2" strokeLinejoin="round" />
      {/* Small companion stars */}
      <circle cx="18" cy="14" r="1.2" fill={color} opacity="0.5" />
      <circle cx="6" cy="16" r="1" fill={color} opacity="0.4" />
      <circle cx="16" cy="19" r="0.8" fill={color} opacity="0.3" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// Diamond/Vajra (करण) — For karana representation
// ═══════════════════════════════════════════════════
export function VajraIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M12 3L19 12L12 21L5 12Z"
        fill={color} opacity="0.1" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <line x1="5" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.2" />
      <line x1="12" y1="3" x2="12" y2="21" stroke={color} strokeWidth="1" opacity="0.4" />
    </svg>
  );
}

// ═══════════════════════════════════════════════════
// Bell (घंटा) — Temple bell
// ═══════════════════════════════════════════════════
export function BellIcon({ size = 24, color = 'currentColor', ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M18 16H6c0-4 1-7 3-8.5V6c0-1.7 1.3-3 3-3s3 1.3 3 3v1.5c2 1.5 3 4.5 3 8.5z"
        stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M10 16v1c0 1.1.9 2 2 2s2-.9 2-2v-1" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="3" x2="12" y2="1.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
