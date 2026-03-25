import { useState, useEffect } from 'react';

/**
 * SplashScreen — full-screen animated loading screen.
 * Warm gradient background with a blooming lotus SVG, app branding, and smooth fade-out.
 */
export default function SplashScreen({ visible, onDone }) {
  const [phase, setPhase] = useState('enter'); // 'enter' → 'fadeout' → 'gone'
  const [mounted, setMounted] = useState(false);

  // Trigger CSS bloom immediately after first paint
  useEffect(() => {
    const raf = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!visible) return;
    // Hold fully bloomed for a beat, then fade out
    const t1 = setTimeout(() => setPhase('fadeout'), 2200);
    const t2 = setTimeout(() => { setPhase('gone'); onDone?.(); }, 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [visible, onDone]);

  if (phase === 'gone') return null;

  return (
    <div style={{
      ...styles.container,
      opacity: phase === 'fadeout' ? 0 : 1,
      transition: 'opacity 700ms ease-out',
    }}>
      {/* Gradient background */}
      <div style={styles.bg} />

      {/* Floating particles */}
      <div style={styles.particles}>
        {[...Array(8)].map((_, i) => (
          <div key={i} style={{
            ...styles.particle,
            left: `${12 + i * 11}%`,
            top: `${20 + (i % 3) * 25}%`,
            animationDelay: `${i * 0.3}s`,
            width: 3 + (i % 3) * 2,
            height: 3 + (i % 3) * 2,
          }} />
        ))}
      </div>

      {/* Lotus bloom — center */}
      <div style={styles.lotusWrap}>
        {/* Glow behind lotus */}
        <div style={{
          ...styles.glow,
          transform: mounted ? 'scale(1)' : 'scale(0.3)',
          opacity: mounted ? 0.6 : 0,
        }} />

        {/* Lotus SVG — starts small, blooms to full via CSS transition on mount */}
        <svg
          width="220" height="220" viewBox="0 0 200 200"
          style={{
            ...styles.lotus,
            transform: mounted ? 'scale(1) rotate(0deg)' : 'scale(0.15) rotate(-40deg)',
            opacity: mounted ? 1 : 0,
          }}
        >
          <defs>
            <radialGradient id="lotusGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="1" />
              <stop offset="70%" stopColor="#FFE4E0" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#FFB8B0" stopOpacity="0.6" />
            </radialGradient>
            <filter id="lotusShadow">
              <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="rgba(0,0,0,0.15)" />
            </filter>
          </defs>

          {/* Outer petals (layer 3 — largest) */}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => (
            <ellipse
              key={`o${i}`}
              cx="100" cy="100"
              rx="14" ry="55"
              fill="url(#lotusGrad)"
              opacity="0.35"
              transform={`rotate(${angle} 100 100) translate(0 -30)`}
              filter="url(#lotusShadow)"
            />
          ))}

          {/* Middle petals (layer 2) */}
          {[0, 40, 80, 120, 160, 200, 240, 280, 320].map((angle, i) => (
            <ellipse
              key={`m${i}`}
              cx="100" cy="100"
              rx="12" ry="42"
              fill="url(#lotusGrad)"
              opacity="0.55"
              transform={`rotate(${angle} 100 100) translate(0 -22)`}
            />
          ))}

          {/* Inner petals (layer 1 — smallest, most opaque) */}
          {[0, 51, 102, 153, 204, 255, 306].map((angle, i) => (
            <ellipse
              key={`in${i}`}
              cx="100" cy="100"
              rx="10" ry="30"
              fill="url(#lotusGrad)"
              opacity="0.8"
              transform={`rotate(${angle} 100 100) translate(0 -14)`}
            />
          ))}

          {/* Center circle */}
          <circle cx="100" cy="100" r="16" fill="white" opacity="0.95" />
          <circle cx="100" cy="100" r="10" fill="#FFF0ED" />
          {/* Center dots */}
          {[0, 60, 120, 180, 240, 300].map((a, i) => {
            const r = 6;
            const x = 100 + r * Math.cos((a * Math.PI) / 180);
            const y = 100 + r * Math.sin((a * Math.PI) / 180);
            return <circle key={`d${i}`} cx={x} cy={y} r="1.2" fill="#E8A0A0" opacity="0.6" />;
          })}
        </svg>
      </div>

      {/* Branding */}
      <div style={{
        ...styles.branding,
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(20px)',
      }}>
        <div style={styles.appName}>మనCalendar</div>
        <div style={styles.tagline}>తెలుగు పంచాంగం</div>
      </div>

      {/* Year badge at bottom */}
      <div style={{
        ...styles.yearBadge,
        opacity: mounted ? 1 : 0,
      }}>
        <div style={styles.yearText}>శ్రీ పరాభవ నామ సంవత్సరం</div>
        <div style={styles.yearSub}>2026 – 2027</div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    inset: 0,
    zIndex: 999,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  bg: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(160deg, #E8584A 0%, #C62850 30%, #8B2A6E 60%, #4A2080 100%)',
  },
  particles: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  particle: {
    position: 'absolute',
    borderRadius: '50%',
    background: 'rgba(255,255,255,0.25)',
    animation: 'splashFloat 3s ease-in-out infinite',
  },
  lotusWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
  },
  glow: {
    position: 'absolute',
    width: 300,
    height: 300,
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%)',
    transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 1.2s ease',
  },
  lotus: {
    position: 'relative',
    zIndex: 2,
    transition: 'transform 1.2s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.8s ease',
    filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.15))',
  },
  branding: {
    textAlign: 'center',
    zIndex: 3,
    transition: 'opacity 0.6s ease 0.5s, transform 0.6s ease 0.5s',
  },
  appName: {
    fontFamily: "'Playfair Display', 'Noto Sans Telugu', serif",
    fontSize: 32,
    fontWeight: 700,
    color: 'white',
    letterSpacing: '0.02em',
    textShadow: '0 2px 12px rgba(0,0,0,0.2)',
  },
  tagline: {
    fontFamily: "'Noto Sans Telugu', sans-serif",
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    marginTop: 6,
    letterSpacing: '0.05em',
  },
  yearBadge: {
    position: 'absolute',
    bottom: 60,
    textAlign: 'center',
    zIndex: 3,
    transition: 'opacity 0.6s ease 0.7s',
  },
  yearText: {
    fontFamily: "'Noto Sans Telugu', sans-serif",
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: '0.03em',
  },
  yearSub: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 18,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
    letterSpacing: '0.08em',
  },
};
