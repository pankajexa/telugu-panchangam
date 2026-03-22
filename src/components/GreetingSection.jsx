import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { getGreetingConfig } from '../data/festivalGreetings';
import { getFestivalTemplates, DAILY_TEMPLATES } from '../data/cardTemplates';
import { renderTemplateThumbnail } from '../imageCard/cardRenderer';
import GreetingViewer from './GreetingViewer';

/**
 * Horizontal scrollable card template picker.
 * Shows on festival days (festival greetings) and always (daily panchangam).
 *
 * Props:
 *   festival — festival object from festivals.js (or null for non-festival days)
 *   panchangamData — panchangam data object from the app
 */
export default function GreetingSection({ festival, panchangamData }) {
  const { font, language } = useLanguage();
  const [thumbnails, setThumbnails] = useState([]);
  const [selected, setSelected] = useState(null); // { template, mode }
  const [loading, setLoading] = useState(true);

  // Get festival greeting config and templates
  const greetingConfig = useMemo(() => {
    if (!festival?.major) return null;
    return getGreetingConfig(festival.english);
  }, [festival]);

  const festivalTemplates = useMemo(() => {
    if (!festival?.major) return [];
    return getFestivalTemplates(festival.english);
  }, [festival]);

  // Load thumbnails for all templates
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    const allTemplates = [
      ...festivalTemplates.map(t => ({ ...t, mode: 'festival' })),
      ...DAILY_TEMPLATES.map(t => ({ ...t, mode: 'daily' })),
    ];

    async function load() {
      const results = [];
      for (const tmpl of allTemplates) {
        if (cancelled) break;
        const thumbUrl = await renderTemplateThumbnail(tmpl.image);
        if (thumbUrl) results.push({ template: tmpl, thumbUrl, mode: tmpl.mode });
      }
      if (!cancelled) {
        setThumbnails(results);
        setLoading(false);
      }
    }

    load();
    return () => { cancelled = true; };
  }, [festivalTemplates]);

  const handleSelect = useCallback((template, mode) => {
    setSelected({ template, mode });
  }, []);

  const handleClose = useCallback(() => {
    setSelected(null);
  }, []);

  const hasFestival = festivalTemplates.length > 0;

  return (
    <>
      <div style={styles.container}>
        {/* Festival greetings */}
        {hasFestival && (
          <>
            <div style={{ ...styles.sectionTitle, fontFamily: font }}>
              {language === 'te' ? `${festival.telugu} శుభాకాంక్షలు` : `${festival.english} Wishes`}
            </div>
            <div style={styles.scrollRow}>
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <div key={`fp-${i}`} style={styles.placeholder}><div style={styles.spinner} /></div>
                ))
              ) : (
                thumbnails
                  .filter(t => t.mode === 'festival')
                  .map(({ template, thumbUrl }) => (
                    <button key={template.id} style={styles.thumbBtn} onClick={() => handleSelect(template, 'festival')}>
                      <img src={thumbUrl} alt={template.nameEn} style={styles.thumbImg} />
                      <span style={{ ...styles.thumbLabel, fontFamily: font }}>{template.name}</span>
                    </button>
                  ))
              )}
            </div>
          </>
        )}

        {/* Daily panchangam */}
        <div style={{ ...styles.sectionTitle, fontFamily: font, marginTop: hasFestival ? '12px' : 0 }}>
          {language === 'te' ? 'నేటి పంచాంగం కార్డ్' : "Today's Panchangam Card"}
        </div>
        <div style={styles.scrollRow}>
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={`dp-${i}`} style={styles.placeholder}><div style={styles.spinner} /></div>
            ))
          ) : (
            thumbnails
              .filter(t => t.mode === 'daily')
              .map(({ template, thumbUrl }) => (
                <button key={template.id} style={styles.thumbBtn} onClick={() => handleSelect(template, 'daily')}>
                  <img src={thumbUrl} alt={template.nameEn} style={styles.thumbImg} />
                  <span style={{ ...styles.thumbLabel, fontFamily: font }}>{template.name}</span>
                </button>
              ))
          )}
        </div>
      </div>

      {selected && (
        <GreetingViewer
          template={selected.template}
          mode={selected.mode}
          festival={festival}
          greetingConfig={greetingConfig}
          panchangamData={panchangamData}
          onClose={handleClose}
        />
      )}
    </>
  );
}

const styles = {
  container: {
    width: '100%',
    padding: '8px 0',
  },
  sectionTitle: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#C49B2A',
    textAlign: 'center',
    marginBottom: '6px',
  },
  scrollRow: {
    display: 'flex',
    gap: '10px',
    overflowX: 'auto',
    scrollSnapType: 'x mandatory',
    WebkitOverflowScrolling: 'touch',
    padding: '0 16px 6px',
    scrollbarWidth: 'none',
  },
  thumbBtn: {
    flex: '0 0 auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '4px',
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
    scrollSnapAlign: 'start',
  },
  thumbImg: {
    width: '100px',
    height: '130px',
    objectFit: 'cover',
    borderRadius: '10px',
    border: '2px solid rgba(196,155,42,0.25)',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  },
  thumbLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#6b2d15',
  },
  placeholder: {
    flex: '0 0 auto',
    width: '100px',
    height: '130px',
    borderRadius: '10px',
    border: '2px solid rgba(196,155,42,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(245,228,168,0.1)',
  },
  spinner: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(196,155,42,0.2)',
    borderTopColor: '#C49B2A',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  },
};
