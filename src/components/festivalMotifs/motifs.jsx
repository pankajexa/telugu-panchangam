/**
 * Festival motif SVGs — golden line art on dark wall.
 * Each motif depicts recognizable Hindu religious symbols.
 */

import React from 'react';

const G = '#d6a820';
const G2 = '#b88050';
const sw = (w = 1) => ({ stroke: G, strokeWidth: w, fill: 'none' });
const sw2 = (w = 0.7) => ({ stroke: G2, strokeWidth: w, fill: 'none' });

// ═══════════════════════════════════════════════
// UGADI — Kalasha (round bellied metal pot + coconut + mango leaves)
// ═══════════════════════════════════════════════
export function UgadiTop() {
  return (
    <svg viewBox="0 0 360 110" style={svgStyle}>
      <g transform="translate(180,24)" opacity="0.65">
        {/* === KALASHA — wide round belly === */}
        {/* Pot body — wide, round, like a real brass lota */}
        <path d="M-18,70 Q-28,64 -34,50 Q-36,38 -30,28 Q-24,22 -14,20
                 L-12,20 Q-14,17 -14,14 L14,14 Q14,17 12,20
                 L14,20 Q24,22 30,28 Q36,38 34,50 Q28,64 18,70"
          stroke={G} strokeWidth="1.4" fill="#d6a820" fillOpacity="0.15" />
        {/* Inner glow on pot belly */}
        <path d="M-20,60 Q-26,46 -20,34 Q-10,26 0,24 Q10,26 20,34 Q26,46 20,60"
          fill="#f5d050" fillOpacity="0.1" stroke="none" />
        {/* Flat base */}
        <path d="M-18,70 Q-10,74 0,75 Q10,74 18,70" {...sw(1.2)} />
        <line x1="-14" y1="75" x2="14" y2="75" {...sw(1)} />
        {/* Pot mouth rim — wider than neck */}
        <ellipse cx="0" cy="14" rx="16" ry="4"
          stroke={G} strokeWidth="1.2" fill="#d6a820" fillOpacity="0.2" />
        {/* === Decorative designs on belly === */}
        {/* Om symbol in center of pot */}
        <text x="0" y="46" textAnchor="middle" fontFamily="serif"
          fontSize="16" fill={G} fillOpacity="0.35" stroke="none">ॐ</text>
        {/* Decorative bands */}
        <path d="M-32,32 Q0,27 32,32" {...sw2(0.7)} opacity="0.5" />
        <path d="M-31,34 Q0,29 31,34" {...sw2(0.5)} opacity="0.4" />
        <path d="M-32,56 Q0,51 32,56" {...sw2(0.7)} opacity="0.5" />
        <path d="M-31,58 Q0,53 31,58" {...sw2(0.5)} opacity="0.4" />
        {/* Small paisley/mango motifs on belly sides */}
        <path d="M-20,44 Q-23,39 -18,36 Q-15,39 -18,44" {...sw2(0.5)} opacity="0.35" />
        <path d="M20,44 Q23,39 18,36 Q15,39 18,44" {...sw2(0.5)} opacity="0.35" />
        {/* Dots between bands */}
        {[-14, -7, 0, 7, 14].map(x => (
          <circle key={x} cx={x} cy={48} r="1" fill={G} opacity="0.3" />
        ))}
        {/* === MANGO LEAVES — large, fanning from behind coconut === */}
        {/* Left leaves */}
        <path d="M-4,14 Q-16,2 -24,-8" stroke={G} strokeWidth="1.2" fill="#d6a820" fillOpacity="0.12" />
        <path d="M-3,12 Q-12,-2 -18,-14" stroke={G} strokeWidth="1" fill="#d6a820" fillOpacity="0.08" />
        {/* Right leaves */}
        <path d="M4,14 Q16,2 24,-8" stroke={G} strokeWidth="1.2" fill="#d6a820" fillOpacity="0.12" />
        <path d="M3,12 Q12,-2 18,-14" stroke={G} strokeWidth="1" fill="#d6a820" fillOpacity="0.08" />
        {/* Leaf veins */}
        <path d="M-8,6 Q-16,-2 -20,-6" {...sw2(0.3)} opacity="0.25" />
        <path d="M8,6 Q16,-2 20,-6" {...sw2(0.3)} opacity="0.25" />

        {/* === COCONUT — wide round body, pointed top like real coconut === */}
        <path d="M-14,10 Q-16,2 -14,-6 Q-12,-14 -6,-20 Q-2,-24 0,-26 Q2,-24 6,-20 Q12,-14 14,-6 Q16,2 14,10"
          stroke={G} strokeWidth="1.4" fill="#d6a820" fillOpacity="0.25" />
        {/* Fibrous texture — vertical curved lines */}
        <path d="M-9,8 Q-10,-2 -6,-18" {...sw2(0.35)} opacity="0.2" />
        <path d="M-4,9 Q-4,-4 -2,-22" {...sw2(0.3)} opacity="0.18" />
        <path d="M4,9 Q4,-4 2,-22" {...sw2(0.3)} opacity="0.18" />
        <path d="M9,8 Q10,-2 6,-18" {...sw2(0.35)} opacity="0.2" />
        {/* Thread tied around middle */}
        <path d="M-14,-2 Q0,-5 14,-2" stroke={G} strokeWidth="0.7" fill="none" opacity="0.4" />
        <path d="M-14,-0.5 Q0,-3.5 14,-0.5" stroke={G} strokeWidth="0.5" fill="none" opacity="0.3" />
        {/* Kumkum dot */}
        <circle cx="0" cy="-6" r="1.8" fill="#d45500" opacity="0.5" />
        {/* Three eyes near bottom */}
        <circle cx="-4" cy="5" r="1.2" fill={G} opacity="0.3" />
        <circle cx="4" cy="5" r="1.2" fill={G} opacity="0.3" />
        <circle cx="0" cy="7" r="1" fill={G} opacity="0.25" />

        {/* === MARIGOLD flower on top of coconut === */}
        <g transform="translate(0,-28)" opacity="0.55">
          <circle cx="0" cy="0" r="4" stroke={G} strokeWidth="0.8" fill="#d6a820" fillOpacity="0.3" />
          {/* Petals */}
          {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
            <path key={a} d="M0,-2 Q1.5,-5 0,-6.5 Q-1.5,-5 0,-2"
              transform={`rotate(${a})`}
              stroke={G} strokeWidth="0.5" fill="#d6a820" fillOpacity="0.2" />
          ))}
          <circle cx="0" cy="0" r="2" fill="#d6a820" fillOpacity="0.35" stroke="none" />
        </g>
      </g>
      {/* Mango leaf toranam garlands on sides */}
      <path d="M166,22 Q130,12 95,18 Q65,26 35,18"
        {...sw(0.8)} opacity="0.45" />
      <path d="M194,22 Q230,12 265,18 Q295,26 325,18"
        {...sw(0.8)} opacity="0.45" />
      {/* Hanging mango leaves */}
      {[55, 80, 105, 135].map(x => (
        <path key={x} d={`M${x},${20 + (x % 10)} L${x - 1},${32 + (x % 8)} Q${x},${36 + (x % 6)} ${x + 2},${30 + (x % 7)}`}
          {...sw2(0.6)} opacity="0.35" />
      ))}
      {[225, 255, 280, 305].map(x => (
        <path key={x} d={`M${x},${20 + (x % 10) * 0.3} L${x + 1},${32 + (x % 8) * 0.4} Q${x},${36 + (x % 6) * 0.3} ${x - 2},${30 + (x % 7) * 0.3}`}
          {...sw2(0.6)} opacity="0.35" />
      ))}
    </svg>
  );
}

export function UgadiBottom() {
  return (
    <svg viewBox="0 0 360 50" style={svgStyle}>
      <path d="M40,25 Q100,10 180,25 Q260,40 320,25"
        {...sw2(0.8)} opacity="0.35" />
      {[90, 130, 170, 210, 250].map(x => (
        <g key={x} transform={`translate(${x},${25 + Math.sin((x - 90) * 0.04) * 10})`} opacity="0.35">
          <path d="M0,0 Q-3,-5 0,-8 Q3,-5 0,0" {...sw(0.6)} />
        </g>
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════════
// VINAYAKA CHAVITHI — Seated Ganesha
// ═══════════════════════════════════════════════
export function GaneshaTop() {
  return (
    <svg viewBox="0 0 360 120" style={svgStyle}>
      <g transform="translate(180,5)" opacity="0.6">
        {/* === HEAD — large elephant head === */}
        <ellipse cx="0" cy="28" rx="22" ry="18" {...sw(1.4)} />
        {/* Large flapping ears */}
        <path d="M-22,22 Q-38,15 -40,30 Q-40,42 -30,46 Q-24,44 -22,38"
          {...sw(1.2)} />
        <path d="M22,22 Q38,15 40,30 Q40,42 30,46 Q24,44 22,38"
          {...sw(1.2)} />
        {/* Inner ear lines */}
        <path d="M-30,25 Q-34,30 -32,38" {...sw2(0.5)} opacity="0.4" />
        <path d="M30,25 Q34,30 32,38" {...sw2(0.5)} opacity="0.4" />
        {/* Crown / Kiritam */}
        <path d="M-14,12 Q-10,3 -5,8 Q0,-2 5,8 Q10,3 14,12"
          {...sw(1)} />
        <path d="M-10,6 Q0,-4 10,6" {...sw2(0.6)} opacity="0.4" />
        {/* Eyes — small, gentle */}
        <path d="M-10,25 Q-7,22 -4,25" {...sw(0.9)} />
        <path d="M4,25 Q7,22 10,25" {...sw(0.9)} />
        {/* Trunk — curving to the left, bending at the end */}
        <path d="M-3,38 Q-6,48 -10,55 Q-15,62 -20,65 Q-22,67 -18,68 Q-14,66 -12,62"
          {...sw(1.5)} />
        {/* Right tusk */}
        <path d="M6,40 Q10,50 8,55" {...sw(1)} />
        {/* Tilak on forehead */}
        <path d="M-2,18 L0,14 L2,18" {...sw2(0.6)} opacity="0.5" />
        {/* === BODY — large round belly === */}
        <path d="M-18,45 Q-24,55 -24,68 Q-24,80 -16,88
                 Q-8,94 0,95 Q8,94 16,88
                 Q24,80 24,68 Q24,55 18,45"
          {...sw(1.3)} />
        {/* Belly button / belly line */}
        <path d="M-10,72 Q0,78 10,72" {...sw2(0.6)} opacity="0.4" />
        {/* === LEGS — seated cross-legged === */}
        <path d="M-16,88 Q-22,92 -28,90 Q-32,88 -30,82 Q-26,80 -20,84"
          {...sw(1)} />
        <path d="M16,88 Q22,92 28,90 Q32,88 30,82 Q26,80 20,84"
          {...sw(1)} />
        {/* === ARMS === */}
        {/* Upper left arm holding modak */}
        <path d="M-18,52 Q-28,48 -32,52 Q-34,56 -30,58"
          {...sw(1)} />
        {/* Modak in left hand */}
        <path d="M-34,55 Q-30,48 -26,55 Q-30,58 -34,55" {...sw(0.8)} />
        {/* Upper right arm raised in blessing */}
        <path d="M18,52 Q28,46 32,42 Q34,38 30,36"
          {...sw(1)} />
        {/* Palm in blessing (abhaya mudra) */}
        <ellipse cx="30" cy="35" rx="4" ry="5" {...sw(0.8)} />
      </g>
      {/* Small modakam on sides */}
      {[55, 80, 280, 305].map(x => (
        <g key={x} transform={`translate(${x},80)`} opacity="0.3">
          <path d="M0,10 Q5,0 10,10 Q5,13 0,10" {...sw2(0.7)} />
        </g>
      ))}
    </svg>
  );
}

export function GaneshaBottom() {
  return (
    <svg viewBox="0 0 360 45" style={svgStyle}>
      {/* Modakam garland */}
      <path d="M50,22 Q130,8 180,22 Q230,36 310,22"
        {...sw2(0.7)} opacity="0.3" />
      {[95, 135, 175, 215, 255].map(x => (
        <path key={x}
          d={`M${x - 5},${22 + Math.sin((x - 95) * 0.05) * 8} Q${x},${14 + Math.sin((x - 95) * 0.05) * 8} ${x + 5},${22 + Math.sin((x - 95) * 0.05) * 8} Q${x},${27 + Math.sin((x - 95) * 0.05) * 8} ${x - 5},${22 + Math.sin((x - 95) * 0.05) * 8}`}
          {...sw(0.6)} opacity="0.35" />
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════════
// DEEPAVALI — Row of diyas (oil lamps on stands)
// ═══════════════════════════════════════════════
export function DiyaTop() {
  return (
    <svg viewBox="0 0 360 95" style={svgStyle}>
      {[75, 115, 148, 180, 212, 245, 285].map((x, i) => {
        const isC = i === 3;
        const isI = i === 2 || i === 4;
        const sc = isC ? 1.4 : isI ? 1.15 : 0.95;
        const y = isC ? 35 : isI ? 42 : 50;
        const op = isC ? 0.65 : isI ? 0.5 : 0.4;
        return (
          <g key={x} transform={`translate(${x},${y}) scale(${sc})`} opacity={op}>
            {/* Diya bowl — wide shallow bowl shape */}
            <path d="M-9,8 Q-11,3 -8,-1 Q-4,-3 0,-3 Q4,-3 8,-1 Q11,3 9,8"
              {...sw(1)} />
            {/* Oil surface */}
            <path d="M-8,-1 Q0,-2 8,-1" {...sw2(0.5)} opacity="0.4" />
            {/* Stand / pedestal */}
            <line x1="0" y1="8" x2="0" y2="14" {...sw(0.7)} />
            <path d="M-5,14 Q0,12 5,14" {...sw(0.7)} />
            <line x1="-6" y1="15" x2="6" y2="15" {...sw(0.8)} />
            {/* Wick */}
            <line x1="0" y1="-3" x2="0" y2="-7" {...sw(0.5)} />
            {/* Flame — teardrop shape */}
            <path d="M0,-7 Q-3.5,-14 0,-22 Q3.5,-14 0,-7" {...sw(1)} />
            {/* Inner flame */}
            <path d="M0,-9 Q-1.5,-13 0,-17 Q1.5,-13 0,-9" {...sw2(0.5)} opacity="0.5" />
            {/* Light glow dots */}
            {isC && <>
              <circle cx="-5" cy="-15" r="0.6" {...sw2(0.3)} opacity="0.3" />
              <circle cx="5" cy="-15" r="0.6" {...sw2(0.3)} opacity="0.3" />
              <circle cx="0" cy="-24" r="0.6" {...sw2(0.3)} opacity="0.3" />
            </>}
          </g>
        );
      })}
    </svg>
  );
}

export function DiyaBottom() {
  return (
    <svg viewBox="0 0 360 55" style={svgStyle}>
      {/* Rangoli — lotus pattern */}
      <g transform="translate(180,27)" opacity="0.4">
        <circle cx="0" cy="0" r="6" {...sw(0.6)} />
        <circle cx="0" cy="0" r="14" {...sw2(0.5)} opacity="0.5" />
        <circle cx="0" cy="0" r="22" {...sw2(0.4)} opacity="0.3" />
        {/* Lotus petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map(a => (
          <path key={a} d="M0,-7 Q3,-14 0,-20 Q-3,-14 0,-7"
            transform={`rotate(${a})`} {...sw(0.5)} opacity="0.45" />
        ))}
        {/* Dots between petals */}
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(a => {
          const r = 18;
          const x = r * Math.cos(a * Math.PI / 180);
          const y = r * Math.sin(a * Math.PI / 180);
          return <circle key={a} cx={x} cy={y} r="1" {...sw2(0.4)} opacity="0.3" />;
        })}
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════════════
// SANKRANTI — Sun with sugarcane & pot
// ═══════════════════════════════════════════════
export function HarvestTop() {
  return (
    <svg viewBox="0 0 360 100" style={svgStyle}>
      {/* Sun disc */}
      <g transform="translate(180,42)" opacity="0.55">
        <circle cx="0" cy="0" r="14" {...sw(1.3)} />
        {/* Face — simple eyes and smile */}
        <circle cx="-4" cy="-2" r="1.5" {...sw2(0.5)} opacity="0.4" />
        <circle cx="4" cy="-2" r="1.5" {...sw2(0.5)} opacity="0.4" />
        <path d="M-4,4 Q0,7 4,4" {...sw2(0.5)} opacity="0.4" />
        {/* Rays — alternating long and short */}
        {Array.from({ length: 16 }).map((_, i) => {
          const a = i * 22.5;
          const inner = 16;
          const outer = i % 2 === 0 ? 26 : 21;
          return (
            <line key={i}
              x1={inner * Math.cos(a * Math.PI / 180)}
              y1={inner * Math.sin(a * Math.PI / 180)}
              x2={outer * Math.cos(a * Math.PI / 180)}
              y2={outer * Math.sin(a * Math.PI / 180)}
              {...sw(i % 2 === 0 ? 1 : 0.6)} strokeLinecap="round" />
          );
        })}
      </g>
      {/* Sugarcane — left side (joints + leaves) */}
      {[90, 108].map((x, idx) => (
        <g key={x} opacity="0.4">
          <line x1={x} y1="90" x2={x - 6} y2="8" {...sw2(1)} />
          {/* Joints */}
          {[20, 35, 50, 65, 78].map(y => (
            <g key={y}>
              <line x1={x - 6 + (90 - y) * 0.065 - 2} y1={y} x2={x - 6 + (90 - y) * 0.065 + 2} y2={y}
                {...sw2(0.6)} opacity="0.6" />
              {/* Leaf */}
              {idx === 0 && <path d={`M${x - 6 + (90 - y) * 0.065},${y} Q${x - 20},${y - 6} ${x - 28},${y + 2}`}
                {...sw2(0.5)} opacity="0.35" />}
            </g>
          ))}
        </g>
      ))}
      {/* Sugarcane — right side */}
      {[252, 270].map((x, idx) => (
        <g key={x} opacity="0.4">
          <line x1={x} y1="90" x2={x + 6} y2="8" {...sw2(1)} />
          {[20, 35, 50, 65, 78].map(y => (
            <g key={y}>
              <line x1={x + 6 - (90 - y) * 0.065 - 2} y1={y} x2={x + 6 - (90 - y) * 0.065 + 2} y2={y}
                {...sw2(0.6)} opacity="0.6" />
              {idx === 0 && <path d={`M${x + 6 - (90 - y) * 0.065},${y} Q${x + 20},${y - 6} ${x + 28},${y + 2}`}
                {...sw2(0.5)} opacity="0.35" />}
            </g>
          ))}
        </g>
      ))}
    </svg>
  );
}

export function HarvestBottom() {
  return (
    <svg viewBox="0 0 360 50" style={svgStyle}>
      {/* Muggu / Rangoli dots pattern */}
      <g transform="translate(180,25)" opacity="0.35">
        {[-16, -8, 0, 8, 16].map(x =>
          [-6, 0, 6].map(y => (
            <circle key={`${x},${y}`} cx={x} cy={y} r="1.2" {...sw(0.5)} />
          ))
        )}
        {/* Lines connecting dots */}
        <path d="M-16,-6 L16,-6 M-16,0 L16,0 M-16,6 L16,6" {...sw2(0.3)} opacity="0.4" />
        <path d="M-16,-6 L-16,6 M-8,-6 L-8,6 M0,-6 L0,6 M8,-6 L8,6 M16,-6 L16,6"
          {...sw2(0.3)} opacity="0.4" />
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════════════
// DASARA — Bow & arrow (Rama's Kodandam)
// ═══════════════════════════════════════════════
export function DasaraTop() {
  return (
    <svg viewBox="0 0 360 100" style={svgStyle}>
      {/* Bow — large arc */}
      <g transform="translate(180,48)" opacity="0.55">
        <path d="M-40,22 Q-30,-10 0,-28 Q30,-10 40,22" {...sw(1.5)} />
        {/* Bow string */}
        <line x1="-40" y1="22" x2="40" y2="22" {...sw(0.7)} />
        {/* Arrow on the string */}
        <line x1="0" y1="22" x2="0" y2="-35" {...sw(1)} />
        {/* Arrowhead — triangular */}
        <path d="M-4,-33 L0,-42 L4,-33 Z" {...sw(0.8)} />
        {/* Arrow feathers */}
        <path d="M-2,18 Q-5,14 -2,10" {...sw2(0.5)} opacity="0.5" />
        <path d="M2,18 Q5,14 2,10" {...sw2(0.5)} opacity="0.5" />
        {/* Grip wrap on bow center */}
        <path d="M-2,-3 L2,-1 L-2,1 L2,3" {...sw2(0.5)} opacity="0.4" />
      </g>
      {/* Shami leaves / flowers on sides */}
      {[50, 80, 280, 310].map(x => (
        <g key={x} transform={`translate(${x},58)`} opacity="0.3">
          <circle cx="0" cy="0" r="6" {...sw(0.6)} />
          <circle cx="0" cy="0" r="2.5" {...sw2(0.4)} />
        </g>
      ))}
    </svg>
  );
}

export function DasaraBottom() {
  return (
    <svg viewBox="0 0 360 45" style={svgStyle}>
      {/* Flower garland */}
      <path d="M40,22 Q100,8 180,22 Q260,36 320,22"
        {...sw2(0.7)} opacity="0.3" />
      {[80, 120, 160, 200, 240, 280].map(x => (
        <g key={x} transform={`translate(${x},${22 + Math.sin((x - 80) * 0.05) * 8})`} opacity="0.3">
          <circle cx="0" cy="0" r="4" {...sw(0.5)} />
          <circle cx="0" cy="0" r="1.5" {...sw2(0.4)} />
        </g>
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════════
// SHIVARATRI — Shiva Lingam with Trishul
// ═══════════════════════════════════════════════
export function ShivaTop() {
  return (
    <svg viewBox="0 0 360 110" style={svgStyle}>
      <g transform="translate(180,5)" opacity="0.55">
        {/* === TRISHUL (Trident) === */}
        {/* Main shaft */}
        <line x1="0" y1="25" x2="0" y2="95" {...sw(1.3)} />
        {/* Center prong */}
        <path d="M-2,8 L0,-2 L2,8" {...sw(1.2)} />
        <line x1="0" y1="8" x2="0" y2="25" {...sw(1.3)} />
        {/* Left prong — curves outward then points up */}
        <path d="M0,25 Q-12,22 -16,15 Q-18,10 -16,5 L-14,0"
          {...sw(1.2)} />
        <path d="M-16,4 L-14,-3 L-12,4" {...sw(1)} />
        {/* Right prong */}
        <path d="M0,25 Q12,22 16,15 Q18,10 16,5 L14,0"
          {...sw(1.2)} />
        <path d="M12,4 L14,-3 L16,4" {...sw(1)} />
        {/* Damaru (drum) tied to shaft */}
        <g transform="translate(8,42)" opacity="0.5">
          <path d="M0,0 L8,0 L6,5 L2,5 Z" {...sw2(0.7)} />
          <path d="M2,5 L0,10 L8,10 L6,5" {...sw2(0.7)} />
        </g>
        {/* Crescent moon near top */}
        <path d="M20,12 Q28,4 24,-2 Q32,6 26,14"
          {...sw2(0.8)} opacity="0.5" />
        {/* Snake coiled on shaft */}
        <path d="M-3,55 Q5,52 3,60 Q-4,63 -2,68 Q4,70 2,75"
          {...sw2(0.6)} opacity="0.35" />
      </g>
    </svg>
  );
}

export function ShivaBottom() {
  return (
    <svg viewBox="0 0 360 50" style={svgStyle}>
      {/* Shiva Lingam on Yoni base */}
      <g transform="translate(180,8)" opacity="0.4">
        {/* Yoni base — elongated ellipse with spout */}
        <ellipse cx="0" cy="28" rx="28" ry="10" {...sw(0.8)} />
        <path d="M0,38 L0,44" {...sw(0.6)} />
        {/* Lingam — rounded top cylinder */}
        <path d="M-8,28 L-8,14 Q-8,4 0,0 Q8,4 8,14 L8,28" {...sw(1)} />
        {/* Bilva leaves on top */}
        <path d="M-3,2 Q-6,-6 -2,-10" {...sw2(0.4)} opacity="0.5" />
        <path d="M0,0 Q0,-8 0,-12" {...sw2(0.4)} opacity="0.5" />
        <path d="M3,2 Q6,-6 2,-10" {...sw2(0.4)} opacity="0.5" />
      </g>
    </svg>
  );
}

// ═══════════════════════════════════════════════
// KRISHNA JANMASHTAMI — Flute + Peacock feather + Butter pot
// ═══════════════════════════════════════════════
export function KrishnaTop() {
  return (
    <svg viewBox="0 0 360 100" style={svgStyle}>
      <g transform="translate(180,10)" opacity="0.55">
        {/* === FLUTE (Murali) — slightly angled === */}
        <g transform="rotate(-12 0 40)">
          <rect x="-30" y="38" width="60" height="7" rx="3.5" {...sw(1)} />
          {/* Finger holes */}
          {[-18, -8, 2, 12, 22].map(x => (
            <circle key={x} cx={x} cy="41.5" r="1.8" {...sw(0.6)} />
          ))}
          {/* Mouthpiece */}
          <path d="M-30,38 Q-34,41 -30,45" {...sw(0.7)} />
        </g>
        {/* === PEACOCK FEATHER (Mor Pankh) === */}
        <g transform="translate(5,0)">
          {/* Shaft */}
          <path d="M0,35 Q3,18 2,0" {...sw(0.9)} />
          {/* Eye — the distinctive peacock eye shape */}
          <ellipse cx="2" cy="12" rx="8" ry="14" {...sw(0.9)} />
          <ellipse cx="2" cy="12" rx="5" ry="9" {...sw(0.7)} opacity="0.6" />
          <ellipse cx="2" cy="11" rx="2.5" ry="4.5" {...sw2(0.5)} opacity="0.5" />
          <circle cx="2" cy="10" r="1.5" {...sw(0.4)} opacity="0.5" />
          {/* Barbs — fine lines radiating from shaft */}
          <path d="M-4,5 Q-8,3 -10,6" {...sw2(0.3)} opacity="0.3" />
          <path d="M-5,18 Q-10,18 -12,22" {...sw2(0.3)} opacity="0.3" />
          <path d="M8,5 Q12,3 14,6" {...sw2(0.3)} opacity="0.3" />
          <path d="M9,18 Q14,18 16,22" {...sw2(0.3)} opacity="0.3" />
        </g>
      </g>
      {/* Butter pots (Makhan) on sides */}
      {[65, 295].map(x => (
        <g key={x} transform={`translate(${x},45)`} opacity="0.35">
          {/* Round pot */}
          <path d="M-10,20 Q-14,10 -10,2 Q-6,-2 0,-3 Q6,-2 10,2 Q14,10 10,20"
            {...sw(0.8)} />
          <ellipse cx="0" cy="-3" rx="8" ry="3" {...sw(0.7)} />
          {/* Butter mound on top */}
          <path d="M-5,-4 Q0,-10 5,-4" {...sw2(0.5)} opacity="0.5" />
        </g>
      ))}
    </svg>
  );
}

export function KrishnaBottom() {
  return (
    <svg viewBox="0 0 360 45" style={svgStyle}>
      {/* Baby Krishna footprints (paadalu) */}
      {[155, 190].map((x, i) => (
        <g key={x} transform={`translate(${x},6) scale(${i === 0 ? -1 : 1},1)`} opacity="0.4">
          {/* Foot outline */}
          <path d="M-5,22 Q-7,14 -5,6 Q-3,2 0,0 Q3,2 5,6 Q7,14 5,22 Q0,25 -5,22"
            {...sw(0.7)} />
          {/* Toes */}
          <circle cx="-3" cy="1" r="1.5" {...sw(0.5)} />
          <circle cx="0" cy="-1" r="1.5" {...sw(0.5)} />
          <circle cx="3" cy="0" r="1.3" {...sw(0.5)} />
          <circle cx="5" cy="3" r="1" {...sw(0.4)} />
        </g>
      ))}
    </svg>
  );
}

// ═══════════════════════════════════════════════
// DEFAULT — Floral garland (pushpa mala)
// ═══════════════════════════════════════════════
export function DefaultTop() {
  return (
    <svg viewBox="0 0 360 65" style={svgStyle}>
      <path d="M30,35 Q90,12 180,30 Q270,48 330,25"
        {...sw2(0.8)} opacity="0.35" />
      {[70, 110, 145, 180, 215, 250, 290].map(x => (
        <g key={x} transform={`translate(${x},${30 + Math.sin((x - 70) * 0.035) * 12})`} opacity="0.4">
          <circle cx="0" cy="0" r="5" {...sw(0.6)} />
          <circle cx="0" cy="0" r="2" {...sw2(0.4)} />
        </g>
      ))}
    </svg>
  );
}

export function DefaultBottom() {
  return (
    <svg viewBox="0 0 360 30" style={svgStyle}>
      <path d="M80,15 Q180,5 280,15" {...sw2(0.6)} opacity="0.25" />
    </svg>
  );
}

// ═══════════════════════════════════════════════
// MAPPING
// ═══════════════════════════════════════════════
const MOTIF_MAP = {
  'Ugadi':               { top: UgadiTop, bottom: UgadiBottom },
  'Vinayaka Chavithi':   { top: GaneshaTop, bottom: GaneshaBottom },
  'Deepavali':           { top: DiyaTop, bottom: DiyaBottom },
  'Kartika Purnima':     { top: DiyaTop, bottom: DiyaBottom },
  'Makara Sankranti':    { top: HarvestTop, bottom: HarvestBottom },
  'Bhogi':               { top: HarvestTop, bottom: HarvestBottom },
  'Kanuma':              { top: HarvestTop, bottom: HarvestBottom },
  'Vijaya Dashami':      { top: DasaraTop, bottom: DasaraBottom },
  'Dasara Navaratri begins': { top: DasaraTop, bottom: DasaraBottom },
  'Saddula Bathukamma':  { top: DasaraTop, bottom: DasaraBottom },
  'Maha Navami':         { top: DasaraTop, bottom: DasaraBottom },
  'Sri Rama Navami':     { top: DasaraTop, bottom: DasaraBottom },
  'Maha Shivaratri':     { top: ShivaTop, bottom: ShivaBottom },
  'Krishna Janmashtami': { top: KrishnaTop, bottom: KrishnaBottom },
  'Holi':                { top: DefaultTop, bottom: DefaultBottom },
  'Varalakshmi Vratam':  { top: UgadiTop, bottom: UgadiBottom },
  'Bonalu begins':       { top: UgadiTop, bottom: UgadiBottom },
  'Buddha Purnima':      { top: DefaultTop, bottom: DefaultBottom },
  'Ratha Saptami':       { top: HarvestTop, bottom: HarvestBottom },
  'Independence Day':    { top: DefaultTop, bottom: DefaultBottom },
  'Republic Day':        { top: DefaultTop, bottom: DefaultBottom },
};

for (let i = 2; i <= 9; i++) {
  MOTIF_MAP[`Navaratri Day ${i}`] = { top: DasaraTop, bottom: DasaraBottom };
}

export function getMotif(festivalEnglish) {
  return MOTIF_MAP[festivalEnglish] || { top: DefaultTop, bottom: DefaultBottom };
}

const svgStyle = { width: '100%', height: '100%', display: 'block' };
