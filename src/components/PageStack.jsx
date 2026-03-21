import React from 'react';

export default function PageStack({ dayIndex, totalDays }) {
  const remaining = totalDays - dayIndex;
  const stackLayers = Math.max(2, Math.min(4, Math.ceil(remaining / 96)));

  return (
    <div style={styles.container}>
      {Array.from({ length: stackLayers }).map((_, i) => {
        const offset = (i + 1) * 3;
        return (
          <div
            key={i}
            style={{
              position: 'relative',
              width: `calc(100% - ${(offset + 1) * 2}px)`,
              margin: '0 auto',
              height: '3px',
              background: `rgb(${232 - i * 10}, ${208 - i * 10}, ${128 - i * 8})`,
              borderRadius: '0 0 3px 3px',
              boxShadow: `0 1px 3px rgba(60,30,10,${0.1 + i * 0.05})`,
            }}
          />
        );
      })}
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
  },
};
