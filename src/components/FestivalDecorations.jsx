import React from 'react';
import { getMotif, DefaultTop, DefaultBottom } from './festivalMotifs/motifs';

// Auspicious motif for non-festival days — Swastik with small diyas
const G = '#d6a820';
const G2 = '#b88050';

function AuspiciousTop() {
  return (
    <svg viewBox="0 0 360 65" style={{ width: '100%', height: '100%', display: 'block' }}>
      {/* Hindu Swastik — each arm tip hooks outward */}
      <g transform="translate(180,32)" opacity="0.5"
         fill="none" stroke={G} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        {/* Top arm: up, bends right, tip hooks UP */}
        <path d="M0,0 V-14 H14 V-18" />
        {/* Right arm: right, bends down, tip hooks RIGHT */}
        <path d="M0,0 H14 V14 H18" />
        {/* Bottom arm: down, bends left, tip hooks DOWN */}
        <path d="M0,0 V14 H-14 V18" />
        {/* Left arm: left, bends up, tip hooks LEFT */}
        <path d="M0,0 H-14 V-14 H-18" />
      </g>

      {/* Four sacred dots */}
      <g transform="translate(180,32)">
        <circle cx="7" cy="-7" r="1.8" fill={G} opacity="0.45" />
        <circle cx="7" cy="7" r="1.8" fill={G} opacity="0.45" />
        <circle cx="-7" cy="-7" r="1.8" fill={G} opacity="0.45" />
        <circle cx="-7" cy="7" r="1.8" fill={G} opacity="0.45" />
      </g>

      {/* Diyas on either side */}
      {[90, 270].map(x => (
        <g key={x} transform={`translate(${x},38)`} opacity="0.35">
          {/* Lamp bowl — filled yellow */}
          <path d="M-7,6 Q-9,2 -6,-1 Q0,-3 6,-1 Q9,2 7,6"
            stroke={G} strokeWidth="1" fill="#f5d050" fillOpacity="0.5" />
          <line x1="-8" y1="6" x2="8" y2="6" stroke={G} strokeWidth="0.8" />
          {/* Stand */}
          <line x1="0" y1="6" x2="0" y2="10" stroke={G2} strokeWidth="0.6" />
          <line x1="-4" y1="10" x2="4" y2="10" stroke={G2} strokeWidth="0.6" />
          {/* Flame — filled yellow */}
          <path d="M0,-1 Q-2.5,-7 0,-12 Q2.5,-7 0,-1"
            stroke={G} strokeWidth="0.8" fill="#f5d050" fillOpacity="0.6" />
          {/* Glow at tip */}
          <circle cx="0" cy="-10" r="3" fill="#f5d050" opacity="0.25" />
          <circle cx="0" cy="-11" r="1.5" fill="#fff8e0" opacity="0.4" />
        </g>
      ))}
    </svg>
  );
}

function AuspiciousBottom() {
  return (
    <svg viewBox="0 0 360 35" style={{ width: '100%', height: '100%', display: 'block' }}>
      <path d="M100,18 Q180,8 260,18" stroke={G2} strokeWidth="0.5" fill="none" opacity="0.2" />
    </svg>
  );
}

// Reusable Diya with yellow fill and glow
function Diya({ x, y, scale = 1, opacity = 0.35 }) {
  return (
    <g transform={`translate(${x},${y}) scale(${scale})`} opacity={opacity}>
      <path d="M-7,6 Q-9,2 -6,-1 Q0,-3 6,-1 Q9,2 7,6"
        stroke={G} strokeWidth="1" fill="#f5d050" fillOpacity="0.5" />
      <line x1="-8" y1="6" x2="8" y2="6" stroke={G} strokeWidth="0.8" />
      <line x1="0" y1="6" x2="0" y2="10" stroke={G2} strokeWidth="0.6" />
      <line x1="-4" y1="10" x2="4" y2="10" stroke={G2} strokeWidth="0.6" />
      <path d="M0,-1 Q-2.5,-7 0,-12 Q2.5,-7 0,-1"
        stroke={G} strokeWidth="0.8" fill="#f5d050" fillOpacity="0.6" />
      <circle cx="0" cy="-10" r="3" fill="#f5d050" opacity="0.25" />
      <circle cx="0" cy="-11" r="1.5" fill="#fff8e0" opacity="0.4" />
    </g>
  );
}

// Overlay SVG with diyas on left and right — rendered on top of any motif
function DiyaOverlay() {
  return (
    <svg viewBox="0 0 360 65" style={{
      position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none',
    }}>
      <Diya x={40} y={38} />
      <Diya x={320} y={38} />
    </svg>
  );
}

export default function FestivalDecorations({ festival, position }) {
  const isTop = position === 'top';
  const isFestival = festival && festival.major;

  let Component;
  if (isFestival) {
    const motif = getMotif(festival.english);
    Component = isTop ? motif.top : motif.bottom;
  } else {
    Component = isTop ? AuspiciousTop : AuspiciousBottom;
  }

  return (
    <div style={{
      width: '100%',
      height: isTop ? '65px' : '35px',
      padding: isTop ? '0 24px 4px' : '4px 24px 0',
      pointerEvents: 'none',
      position: 'relative',
    }}>
      <Component />
      {isTop && <DiyaOverlay />}
    </div>
  );
}
