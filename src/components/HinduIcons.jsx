/**
 * Hindu symbolic icon set — Phosphor Icons + custom Hindu-specific ones.
 * Consistent visual language across the app.
 */

import {
  FlowerLotus,
  HandsPraying,
  Bell,
  BellRinging,
  Sun,
  SunHorizon,
  Scroll,
  Flame,
  Star,
  Globe,
  MapPin,
  Info,
} from '@phosphor-icons/react';

// ═══ Re-exports from Phosphor (consistent naming for the app) ═══

export function LotusIcon({ size = 24, color = 'currentColor', weight = 'duotone' }) {
  return <FlowerLotus size={size} color={color} weight={weight} />;
}

export function NamasteIcon({ size = 24, color = 'currentColor', weight = 'duotone' }) {
  return <HandsPraying size={size} color={color} weight={weight} />;
}

export function BellIcon({ size = 24, color = 'currentColor', weight = 'duotone' }) {
  return <BellRinging size={size} color={color} weight={weight} />;
}

export function SunIcon({ size = 24, color = 'currentColor', weight = 'duotone' }) {
  return <Sun size={size} color={color} weight={weight} />;
}

export function SunriseIcon({ size = 24, color = 'currentColor', weight = 'duotone' }) {
  return <SunHorizon size={size} color={color} weight={weight} />;
}

export function ScrollIcon({ size = 24, color = 'currentColor', weight = 'duotone' }) {
  return <Scroll size={size} color={color} weight={weight} />;
}

export function DiyaIcon({ size = 24, color = 'currentColor', weight = 'duotone' }) {
  return <Flame size={size} color={color} weight={weight} />;
}

export function StarIcon({ size = 24, color = 'currentColor', weight = 'duotone' }) {
  return <Star size={size} color={color} weight={weight} />;
}

export function GlobeIcon({ size = 24, color = 'currentColor', weight = 'duotone' }) {
  return <Globe size={size} color={color} weight={weight} />;
}

export function PinIcon({ size = 24, color = 'currentColor', weight = 'duotone' }) {
  return <MapPin size={size} color={color} weight={weight} />;
}

export function InfoIcon({ size = 24, color = 'currentColor', weight = 'duotone' }) {
  return <Info size={size} color={color} weight={weight} />;
}

// ═══ Custom Hindu-specific icons (not in Phosphor) ═══

// Trishul — Shiva's trident (simple geometric)
export function TrishulIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" style={{ display: 'block' }}>
      <line x1="128" y1="240" x2="128" y2="72" stroke={color} strokeWidth="14" strokeLinecap="round" />
      <path d="M128 72V24" stroke={color} strokeWidth="14" strokeLinecap="round" />
      <path d="M72 96C72 56 100 32 128 24C156 32 184 56 184 96" stroke={color} strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <line x1="96" y1="128" x2="160" y2="128" stroke={color} strokeWidth="12" strokeLinecap="round" />
    </svg>
  );
}

// Mala — prayer beads (Phosphor doesn't have this)
export function MalaIcon({ size = 24, color = 'currentColor' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 256 256" fill="none" style={{ display: 'block' }}>
      {/* Bead circle */}
      <circle cx="128" cy="128" r="80" stroke={color} strokeWidth="10" strokeDasharray="20 14" fill="none" />
      {/* Top bead (sumeru) */}
      <circle cx="128" cy="48" r="14" fill={color} opacity="0.35" stroke={color} strokeWidth="8" />
      {/* Tassel */}
      <line x1="128" y1="62" x2="128" y2="90" stroke={color} strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

// Om — using the Unicode character (most reliable rendering)
export function OmIcon({ size = 24, color = 'currentColor' }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: size, height: size, fontSize: size * 0.8,
      fontFamily: 'serif', color, lineHeight: 1,
    }}>
      ॐ
    </span>
  );
}
