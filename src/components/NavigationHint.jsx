import React from 'react';

export default function NavigationHint() {
  return (
    <div className="nav-hint" style={styles.container}>
      <span style={styles.arrow}>↑</span>
      <span style={styles.label}>రోజు మార్చండి</span>
      <span style={styles.arrow}>↓</span>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    paddingTop: '6px',
    pointerEvents: 'none',
  },
  arrow: {
    fontSize: '12px',
    color: '#d6a820',
    opacity: 0.3,
  },
  label: {
    fontFamily: "'Noto Serif Telugu', serif",
    fontSize: '9px',
    fontWeight: 500,
    color: '#d6a820',
    opacity: 0.3,
  },
};
