/**
 * Divine background pattern — faint repeating lotus watermark.
 */

const C = '#C49B2A';

export default function DivinePattern() {
  return (
    <svg
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <defs>
        <pattern id="divine" x="0" y="0" width="280" height="280" patternUnits="userSpaceOnUse">
          <g transform="translate(140,140)" opacity="0.04">
            {/* Center circle */}
            <circle cx="0" cy="0" r="5" fill={C} opacity="0.4" />
            <circle cx="0" cy="0" r="8" stroke={C} strokeWidth="1" fill="none" />
            {/* 8 petals */}
            {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
              <ellipse
                key={angle}
                cx="0" cy="-20"
                rx="8" ry="16"
                fill="none"
                stroke={C}
                strokeWidth="1.2"
                transform={`rotate(${angle})`}
              />
            ))}
            {/* Inner ring of small petals */}
            {[22, 67, 112, 157, 202, 247, 292, 337].map(angle => (
              <ellipse
                key={angle}
                cx="0" cy="-12"
                rx="4.5" ry="9"
                fill={C}
                opacity="0.15"
                stroke="none"
                transform={`rotate(${angle})`}
              />
            ))}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#divine)" />
    </svg>
  );
}
