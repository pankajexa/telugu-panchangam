import React from 'react';
import { getMotif } from './festivalMotifs/motifs';

export default function FestivalDecorations({ festival, position }) {
  if (!festival || !festival.major) return null;

  const motif = getMotif(festival.english);
  const Component = position === 'top' ? motif.top : motif.bottom;

  const isTop = position === 'top';

  return (
    <div style={{
      position: 'absolute',
      left: 0,
      right: 0,
      [isTop ? 'bottom' : 'top']: '100%',
      height: isTop ? '65px' : '35px',
      padding: isTop ? '0 24px 4px' : '4px 24px 0',
      pointerEvents: 'none',
      zIndex: 0,
    }}>
      <Component />
    </div>
  );
}
