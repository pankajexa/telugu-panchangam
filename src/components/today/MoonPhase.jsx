import { memo } from 'react';

/**
 * MoonPhase — SVG moon visualization from tithi index.
 * tithiIndex 0 = Pratipada (Shukla), 14 = Purnima, 15 = Pratipada (Krishna), 29 = Amavasya
 * Phase: 0 = new moon, 0.5 = first/last quarter, 1.0 = full moon
 */
const MoonPhase = memo(function MoonPhase({ tithiIndex = 0, paksha, pakshaEn, tithiName, t }) {
  // Convert tithi index (0-29) to illumination fraction (0-1)
  // Shukla 0-14: waxing (0% → 100%), Krishna 15-29: waning (100% → 0%)
  let illumination;
  if (tithiIndex <= 14) {
    illumination = (tithiIndex + 1) / 15; // 1/15 to 1.0
  } else {
    illumination = (30 - tithiIndex) / 15; // ~1.0 down to ~1/15
  }
  // Clamp
  illumination = Math.max(0, Math.min(1, illumination));
  const percent = Math.round(illumination * 100);

  // SVG moon rendering
  const size = 88;
  const r = size / 2 - 4;
  const cx = size / 2;
  const cy = size / 2;

  // For the moon crescent path:
  // phase 0 = new (dark), 0.5 = quarter, 1.0 = full (bright)
  const phase = illumination;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <defs>
          <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF7E6" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#FFF7E6" stopOpacity="0" />
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Glow behind moon */}
        <circle cx={cx} cy={cy} r={r + 6} fill="url(#moonGlow)" />
        {/* Dark base (unlit portion) */}
        <circle cx={cx} cy={cy} r={r} fill="#2A2A2A" />
        {/* Lit portion */}
        <clipPath id="moonClip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>
        <g clipPath="url(#moonClip)" filter="url(#softGlow)">
          <path
            d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} A ${Math.abs(r * (1 - 2 * phase))} ${r} 0 0 ${phase > 0.5 ? 1 : 0} ${cx} ${cy - r}`}
            fill="#FFF3D4"
          />
        </g>
        {/* Subtle ring */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,243,212,0.15)" strokeWidth="1" />
      </svg>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#1A1A1A', letterSpacing: '0.02em', whiteSpace: 'nowrap' }}>
          {paksha || pakshaEn || ''}{tithiName ? ` ${tithiName}` : ''}
        </div>
        <div style={{ fontSize: 9, color: '#999', marginTop: 2 }}>
          {percent}% {t ? t('today.illuminated') : 'Illuminated'}
        </div>
      </div>
    </div>
  );
});

export default MoonPhase;
