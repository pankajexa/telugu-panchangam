import React from 'react';

export default function FestivalBlock({ festival }) {
  if (!festival) return null;
  const isMajor = festival.major;

  return (
    <div style={{ ...styles.container, ...(isMajor ? styles.majorContainer : {}) }}>
      {/* Ornamental corners */}
      <span style={{ ...styles.corner, top: -1, left: -1 }}>┌</span>
      <span style={{ ...styles.corner, top: -1, right: -1 }}>┐</span>
      <span style={{ ...styles.corner, bottom: -1, left: -1 }}>└</span>
      <span style={{ ...styles.corner, bottom: -1, right: -1 }}>┘</span>

      <div style={styles.inner}>
        {isMajor && <div style={styles.motifLine}>✦ ✦ ✦</div>}
        <div style={styles.teluguName}>{festival.telugu}</div>
        <div style={styles.englishName}>{festival.english}</div>
        {festival.description && (
          <div style={styles.description}>{festival.description}</div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
    border: '1px solid rgba(107, 45, 21, 0.2)',
    borderRadius: '2px',
    margin: '6px 14px',
    padding: '7px 12px',
    textAlign: 'center',
  },
  majorContainer: {
    border: '1.5px solid rgba(107, 45, 21, 0.3)',
    background: 'rgba(214, 168, 32, 0.12)',
  },
  corner: {
    position: 'absolute',
    color: 'rgba(107, 45, 21, 0.3)',
    fontSize: '13px',
    lineHeight: '1',
    fontFamily: 'monospace',
    fontWeight: 'bold',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '1px',
  },
  motifLine: {
    color: '#915838',
    fontSize: '7px',
    letterSpacing: '4px',
    marginBottom: '2px',
    opacity: 0.7,
  },
  teluguName: {
    fontFamily: "'Noto Serif Telugu', serif",
    fontWeight: 800,
    fontSize: '15px',
    color: '#3a150a',
    lineHeight: 1.4,
  },
  englishName: {
    fontFamily: "'Inter', system-ui, sans-serif",
    fontWeight: 600,
    fontSize: '11px',
    color: '#6b2d15',
    letterSpacing: '0.8px',
  },
  description: {
    fontFamily: "'Noto Serif Telugu', serif",
    fontWeight: 400,
    fontSize: '10px',
    color: '#915838',
    marginTop: '2px',
    lineHeight: 1.3,
  },
};
