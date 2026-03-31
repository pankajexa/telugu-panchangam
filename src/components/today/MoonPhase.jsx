import { memo, useMemo } from 'react';

/**
 * MoonPhase — Photorealistic moon with dramatic glow effects.
 * NASA moon photo with CSS gradient phase masking.
 * Dark deep-blue card at night, soft white/cream card during daytime.
 */
const MoonPhase = memo(function MoonPhase({ tithiIndex = 0, paksha, pakshaEn, tithiName, t }) {
  const isNight = useMemo(() => {
    const h = new Date().getHours();
    return h < 6 || h >= 18;
  }, []);
  let illumination;
  if (tithiIndex <= 14) {
    illumination = (tithiIndex + 1) / 15;
  } else {
    illumination = (30 - tithiIndex) / 15;
  }
  illumination = Math.max(0.02, Math.min(1, illumination));
  const percent = Math.round(illumination * 100);
  const isWaxing = tithiIndex <= 14;
  const phaseMask = buildPhaseMask(illumination, isWaxing);
  const g = illumination;
  const warmGlow = `rgba(255, 240, 180, ${0.2 + g * 0.4})`;

  return (
    <div style={S.wrapper}>
      {/* Sky background — dark at night, soft cream during day */}
      <div style={{
        ...S.spaceBackground,
        background: isNight
          ? 'radial-gradient(ellipse at 50% 40%, #1C2347 0%, #151B3D 45%, #101535 100%)'
          : 'radial-gradient(ellipse at 50% 40%, #F5F0E8 0%, #EDE6DA 45%, #E8E0D0 100%)',
      }}>
        {isNight && STARS.map((star, i) => (
          <div key={i} style={{
            position: 'absolute', borderRadius: '50%', background: '#FFF',
            width: star.s, height: star.s,
            left: `${star.x}%`, top: `${star.y}%`,
            opacity: star.o,
            animation: star.tw ? `twinkle ${star.tw}s ease-in-out infinite` : undefined,
          }} />
        ))}
      </div>

      {/* Atmospheric haze */}
      <div style={{
        ...S.atmosphericHaze,
        background: isNight
          ? `radial-gradient(circle, ${warmGlow} 0%, rgba(255,240,180,${g * 0.08}) 50%, transparent 70%)`
          : `radial-gradient(circle, rgba(180,160,120,${0.1 + g * 0.15}) 0%, rgba(180,160,120,${g * 0.05}) 50%, transparent 70%)`,
      }} />

      {/* Moon body */}
      <div style={S.moonContainer}>
        {/* Glow rings */}
        <div style={{
          ...S.glowRing,
          boxShadow: isNight
            ? `
              0 0 ${20 + g * 30}px rgba(255,245,200,${0.15 + g * 0.2}),
              0 0 ${40 + g * 60}px rgba(255,240,180,${0.08 + g * 0.12}),
              0 0 ${80 + g * 80}px rgba(255,230,150,${g * 0.06}),
              inset 0 0 ${10 + g * 15}px rgba(255,250,220,${0.1 + g * 0.15})
            `
            : `
              0 0 ${15 + g * 20}px rgba(160,140,100,${0.1 + g * 0.12}),
              0 0 ${30 + g * 40}px rgba(160,140,100,${0.05 + g * 0.08})
            `,
        }} />

        {/* Dark moon base */}
        <picture style={S.moonPicture}>
          <source srcSet="/assets/images/moon.webp" type="image/webp" />
          <img src="/assets/images/moon.png" alt="" style={{
            ...S.moonImg,
            filter: `brightness(${0.15 + illumination * 0.1}) contrast(1.2)`,
          }} draggable="false" />
        </picture>

        {/* Lit moon surface */}
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

        {/* Edge highlight */}
        <div style={{
          ...S.edgeHighlight,
          background: `radial-gradient(circle at ${isWaxing ? '70%' : '30%'} 35%, rgba(255,252,240,${0.12 + g * 0.08}), transparent 50%)`,
        }} />
      </div>

      {/* Tithi label */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 2, marginTop: 6 }}>
        <div style={{
          ...S.tithiName,
          color: isNight ? '#F0E8D4' : '#3A3020',
          textShadow: isNight ? '0 1px 6px rgba(0,0,0,0.6)' : '0 1px 3px rgba(255,255,255,0.5)',
        }}>
          {paksha || pakshaEn || ''}{tithiName ? ` ${tithiName}` : ''}
        </div>
        <div style={{
          ...S.illumination,
          color: isNight ? 'rgba(255,248,220,0.45)' : 'rgba(80,70,50,0.5)',
        }}>
          {percent}% {t ? t('today.illuminated') : 'Illuminated'}
        </div>
      </div>
    </div>
  );
});

function buildPhaseMask(illumination, isWaxing) {
  if (illumination >= 0.98) return 'none';
  if (illumination <= 0.02) return 'linear-gradient(to right, transparent, transparent)';

  // Simple linear mapping — the circle shape naturally creates the crescent.
  // 73% illumination = 27% of the width is dark on the unlit side.
  const darkPct = (1 - illumination) * 100;
  const softEdge = 8; // Soft terminator for realism

  if (isWaxing) {
    // Waxing: right side lit, left side dark
    // mask: transparent = hidden, black = visible
    // So: transparent on the LEFT (hidden = dark), black on the RIGHT (visible = lit)
    const edgeStart = Math.max(0, darkPct - softEdge / 2);
    const edgeEnd = Math.min(100, darkPct + softEdge / 2);
    return `linear-gradient(to right, transparent ${edgeStart}%, black ${edgeEnd}%)`;
  } else {
    // Waning: left side lit, right side dark
    const litPct = illumination * 100;
    const edgeStart = Math.max(0, litPct - softEdge / 2);
    const edgeEnd = Math.min(100, litPct + softEdge / 2);
    return `linear-gradient(to right, black ${edgeStart}%, transparent ${edgeEnd}%)`;
  }
}

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
  moonPicture: { position: 'absolute', inset: 0, display: 'block' },
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
    fontSize: 13, fontWeight: 700,
    letterSpacing: '0.03em', whiteSpace: 'nowrap',
  },
  illumination: {
    fontSize: 9,
    marginTop: 2, position: 'relative', zIndex: 1,
  },
};

// Inject animations once
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
