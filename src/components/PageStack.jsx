import React from 'react';

export default function PageStack({ dayIndex, totalDays }) {
  const remaining = totalDays - dayIndex;
  const stackLayers = Math.max(1, Math.min(3, Math.ceil(remaining / 128)));

  return (
    <div style={styles.container}>
      {Array.from({ length: stackLayers }).map((_, i) => {
        const offset = (i + 1) * 2;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              bottom: -offset + 'px',
              left: offset + 'px',
              right: offset + 'px',
              height: '2px',
              background: `rgb(${196 - i * 12}, ${152 - i * 10}, ${24 - i * 4})`,
              borderRadius: '0 0 2px 2px',
              zIndex: -1 - i,
              boxShadow: `0 1px 2px rgba(60,30,10,${0.08 + i * 0.04})`,
            }}
          />
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    width: '100%',
    height: 0,
  },
};
