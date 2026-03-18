import React from 'react';

const HOLE_COUNT = 7;

export default function BindingStrip() {
  return (
    <div style={styles.container}>
      <div style={styles.holesRow}>
        {Array.from({ length: HOLE_COUNT }).map((_, i) => (
          <div key={i} style={styles.hole} />
        ))}
      </div>
      <div style={styles.tearLine} />
    </div>
  );
}

const styles = {
  container: {
    width: '100%',
    paddingTop: '8px',
    position: 'relative',
    zIndex: 2,
  },
  holesRow: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: '0 22px',
    marginBottom: '5px',
  },
  hole: {
    width: '11px',
    height: '11px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 40% 35%, #2a1a10, #1a120e)',
    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.5), 0 0 0 1.5px rgba(196,152,24,0.25)',
  },
  tearLine: {
    width: '82%',
    margin: '0 auto',
    height: '0',
    borderTop: '1.5px dashed rgba(58, 21, 10, 0.12)',
    marginTop: '3px',
  },
};
