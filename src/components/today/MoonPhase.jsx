import { memo } from 'react';

/**
 * MoonPhase — Photorealistic moon with dramatic glow effects.
 * NASA moon photo (pre-cropped circle) with CSS gradient phase masking.
 * tithiIndex 0-14 = Shukla (waxing), 15-29 = Krishna (waning)
 */
const MoonPhase = memo(function MoonPhase({ tithiIndex = 0, paksha, pakshaEn, tithiName, t }) {
  let illumination;
  if (tithiIndex <= 14) {
    illumination = (tithiIndex + 1) / 15;
  } else {
    illumination = (30 - tithiIndex) / 15;
  }
  illumination = Math.max(0.02, Math.min(1, illumination));
  const percent = Math.round(illumination * 100);
  const isWaxing = tithiIndex <= 14;

  // Phase mask — reveals the illuminated portion
  const phaseMask = buildPhaseMask(illumination, isWaxing);

  // Glow scales with illumination — more light = more glow
  const g = illumination;
  const warmGlow = `rgba(255, 240, 180, ${0.2 + g * 0.4})`;

  return (
    <div data-moon="true" style={S.wrapper}>
      {/* Deep space background with stars */}
      <div data-moon="true" style={S.spaceBackground}>
        {STARS.map((star, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%', background: '#FFF',
            width: star.s, height: star.s,
            left: `${star.x}%`, top: `${star.y}%`,
            opacity: star.o,
            animation: star.tw ? `twinkle ${star.tw}s ease-in-out infinite` : undefined,
          }} />
        ))}
      </div>

      {/* Outer atmospheric haze */}
      <div style={{
        ...S.atmosphericHaze,
        background: `radial-gradient(circle, ${warmGlow} 0%, rgba(255,240,180,${g * 0.08}) 50%, transparent 70%)`,
      }} />

      {/* Moon body */}
      <div style={S.moonContainer}>
        {/* Glow ring 1 — large soft outer */}
        <div style={{
          ...S.glowRing,
          boxShadow: `
            0 0 ${20 + g * 30}px rgba(255,245,200,${0.15 + g * 0.2}),
            0 0 ${40 + g * 60}px rgba(255,240,180,${0.08 + g * 0.12}),
            0 0 ${80 + g * 80}px rgba(255,230,150,${g * 0.06}),
            inset 0 0 ${10 + g * 15}px rgba(255,250,220,${0.1 + g * 0.15})
          `,
        }} />

        {/* Dark moon base (unlit surface — dim but visible) */}
        <picture style={S.moonPicture}>
          <source srcSet="/assets/images/moon.webp" type="image/webp" />
          <img src="/assets/images/moon.png" alt="" style={{
            ...S.moonImg,
            filter: `brightness(${0.15 + illumination * 0.1}) contrast(1.2)`,
          }} draggable="false" />
        </picture>

        {/* Lit moon surface — masked to show only illuminated portion */}
        <div style={{
          ...S.moonLitLayer,
          WebkitMaskImage: phaseMask,
          maskImage: phaseMask,
        }}>
          <picture>
            <source srcSet="/assets/images/moon.webp" type="image/webp" />
            <img src="/assets/images/moon.png" alt="" style={{
              ...S.moonImg,
              filter: `brightness(${1.1 + g * 0.3}) contrast(1.05) saturate(0.85)`,
            }} draggable="false" />
          </picture>
        </div>

        {/* Subtle edge highlight on the lit side */}
        <div style={{
          ...S.edgeHighlight,
          background: `radial-gradient(circle at ${isWaxing ? '70%' : '30%'} 35%, rgba(255,252,240,${0.12 + g * 0.08}), transparent 50%)`,
        }} />
      </div>

      {/* Tithi label */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, marginTop: 6 }}>
        <div style={S.tithiName}>
          {paksha || pakshaEn || ''}{tithiName ? ` ${tithiName}` : ''}
        </div>
        <div style={S.illumination}>
          {percent}% {t ? t('today.illuminated') : 'Illuminated'}
        </div>
      </div>
    </div>
  );
});

function buildPhaseMask(illumination, isWaxing) {
  if (illumination >= 0.98) return 'none';
  if (illumination <= 0.02) return 'linear-gradient(to right, transparent, transparent)';

  // For a circular moon, a linear gradient mask at position X% doesn't
  // correspond to X% illuminated area. We need to account for circular
  // geometry: area fraction = (θ - sinθcosθ)/π where θ = arccos(1-2x).
  // Simplified: to show `illumination` fraction of a circle's area as lit,
  // the linear terminator position from the dark edge should be:
  //   pos = 0.5 * (1 - cos(π * illumination))
  // This maps 0→0%, 0.5→50%, 1→100% but with circular correction.
  const corrected = 0.5 * (1 - Math.cos(Math.PI * illumination));
  // Convert to percentage from the dark side
  const darkPercent = (1 - corrected) * 100;

  const softEdge = 6;

  if (isWaxing) {
    // Right side is lit — dark on left
    const t = Math.max(0, darkPercent - softEdge);
    return `linear-gradient(to right, transparent ${t}%, rgba(0,0,0,0.3) ${t + softEdge * 0.4}%, black ${darkPercent}%)`;
  } else {
    // Left side is lit — dark on right
    const litEnd = corrected * 100;
    return `linear-gradient(to right, black ${litEnd}%, rgba(0,0,0,0.3) ${litEnd + softEdge * 0.4}%, transparent ${Math.min(100, litEnd + softEdge)}%)`;
  }
}

// Deterministic star positions with optional twinkle
const STARS = [
  { x: 4, y: 6, s: 1, o: 0.5 }, { x: 14, y: 3, s: 1.5, o: 0.7, tw: 3 },
  { x: 26, y: 10, s: 1, o: 0.3 }, { x: 40, y: 4, s: 2, o: 0.6, tw: 4 },
  { x: 55, y: 2, s: 1, o: 0.4 }, { x: 70, y: 7, s: 2, o: 0.8, tw: 5 },
  { x: 83, y: 3, s: 1, o: 0.4 }, { x: 94, y: 12, s: 1.5, o: 0.6 },
  { x: 7, y: 88, s: 1, o: 0.4 }, { x: 18, y: 93, s: 1.5, o: 0.6, tw: 3.5 },
  { x: 33, y: 90, s: 1, o: 0.3 }, { x: 62, y: 92, s: 2, o: 0.7, tw: 4.5 },
  { x: 76, y: 87, s: 1, o: 0.4 }, { x: 91, y: 90, s: 1.5, o: 0.5 },
  { x: 2, y: 40, s: 1, o: 0.3 }, { x: 97, y: 55, s: 1, o: 0.3 },
  { x: 10, y: 25, s: 1, o: 0.2 }, { x: 89, y: 70, s: 1, o: 0.25 },
  { x: 50, y: 95, s: 1.5, o: 0.4, tw: 6 }, { x: 48, y: 1, s: 1, o: 0.35 },
];

const MOON_SIZE = 120;

const S = {
  wrapper: {
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '20px 12px 12px',
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 20,
  },
  spaceBackground: {
    position: 'absolute', inset: 0,
    background: 'radial-gradient(ellipse at 50% 45%, #111827 0%, #0B0F19 40%, #060A12 100%)',
    borderRadius: 20,
  },
  atmosphericHaze: {
    position: 'absolute',
    width: MOON_SIZE * 2.5, height: MOON_SIZE * 2.5,
    left: '50%', top: '45%',
    transform: 'translate(-50%, -50%)',
    borderRadius: '50%',
    zIndex: 0,
    animation: 'moonBreath 6s ease-in-out infinite',
  },
  moonContainer: {
    width: MOON_SIZE, height: MOON_SIZE,
    position: 'relative', zIndex: 1,
  },
  glowRing: {
    position: 'absolute', inset: -2, borderRadius: '50%',
    background: 'transparent',
    animation: 'moonBreath 6s ease-in-out infinite',
  },
  moonPicture: {
    position: 'absolute', inset: 0,
    display: 'block',
  },
  moonImg: {
    width: MOON_SIZE, height: MOON_SIZE,
    display: 'block', userSelect: 'none', pointerEvents: 'none',
    borderRadius: '50%',
  },
  moonLitLayer: {
    position: 'absolute', inset: 0, borderRadius: '50%',
    overflow: 'hidden',
  },
  edgeHighlight: {
    position: 'absolute', inset: 0, borderRadius: '50%',
    pointerEvents: 'none',
  },
  tithiName: {
    fontSize: 13, fontWeight: 700, color: '#F0E8D4',
    letterSpacing: '0.03em', whiteSpace: 'nowrap',
    textShadow: '0 1px 6px rgba(0,0,0,0.6)',
  },
  illumination: {
    fontSize: 9, color: 'rgba(255,248,220,0.45)',
    marginTop: 2,
  },
};

// Inject keyframe animations once
if (typeof document !== 'undefined' && !document.getElementById('moonStyles')) {
  const style = document.createElement('style');
  style.id = 'moonStyles';
  style.textContent = `
    @keyframes moonBreath {
      0%, 100% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
      50% { opacity: 0.85; transform: translate(-50%, -50%) scale(1.04); }
    }
    @keyframes twinkle {
      0%, 100% { opacity: inherit; }
      50% { opacity: 0.1; }
    }
  `;
  document.head.appendChild(style);
}

export default MoonPhase;
