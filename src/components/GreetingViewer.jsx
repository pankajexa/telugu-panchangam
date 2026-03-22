import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { renderDailyCard, renderFestivalCard } from '../imageCard/cardRenderer';
import { shareImage, saveToGallery } from '../utils/sharingService';

/**
 * Fullscreen preview of a generated card with share/save actions.
 *
 * Props:
 *   template — card template (from cardTemplates.js)
 *   mode — 'daily' or 'festival'
 *   festival — festival object (for festival mode)
 *   greetingConfig — from festivalGreetings.js (for festival mode)
 *   panchangamData — panchangam data object
 *   onClose — callback
 */
export default function GreetingViewer({ template, mode, festival, greetingConfig, panchangamData, onClose }) {
  const { font, language } = useLanguage();
  const [imageUrl, setImageUrl] = useState(null);
  const [rendering, setRendering] = useState(true);
  const [sharing, setSharing] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [customName, setCustomName] = useState(() =>
    localStorage.getItem('manacalendar-custom-name') || ''
  );
  const blobRef = useRef(null);
  const debounceRef = useRef(null);

  const doRender = useCallback(async (name, qi) => {
    setRendering(true);
    try {
      let blob;
      const lang = language === 'te' ? 'te' : 'en';
      if (mode === 'daily') {
        blob = await renderDailyCard(template, panchangamData || {}, name, lang);
      } else {
        blob = await renderFestivalCard(template, festival, greetingConfig, qi, name, lang);
      }
      blobRef.current = blob;
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      setImageUrl(URL.createObjectURL(blob));
    } catch (_) {}
    setRendering(false);
  }, [template, mode, panchangamData, festival, greetingConfig, language]);

  // Initial render
  useEffect(() => {
    doRender(customName, quoteIndex);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  // Re-render on quote change
  useEffect(() => {
    if (imageUrl) doRender(customName, quoteIndex);
  }, [quoteIndex]);

  const handleNameChange = useCallback((e) => {
    const name = e.target.value;
    setCustomName(name);
    localStorage.setItem('manacalendar-custom-name', name);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doRender(name, quoteIndex), 500);
  }, [doRender, quoteIndex]);

  const handleShare = useCallback(async () => {
    if (!blobRef.current) return;
    setSharing(true);
    try {
      const isEn = language !== 'te';
      const text = mode === 'festival'
        ? `${isEn ? `Happy ${festival?.english}` : (greetingConfig?.greetingText || festival?.telugu)} 🙏\n\n— shared from manacalendar.com`
        : `${isEn ? "Today's Panchangam" : 'నేటి పంచాంగం'} 🙏\n\n— shared from manacalendar.com`;
      const fileName = mode === 'festival'
        ? `${festival?.english || 'festival'}-greeting.jpg`
        : `panchangam-${new Date().toISOString().split('T')[0]}.jpg`;
      await shareImage(blobRef.current, fileName, text);
    } catch (_) {}
    setSharing(false);
  }, [mode, festival, greetingConfig]);

  const handleSave = useCallback(async () => {
    if (!blobRef.current) return;
    const fileName = `manacalendar-${template.id}-${Date.now()}.jpg`;
    await saveToGallery(blobRef.current, fileName).catch(() => {});
  }, [template]);

  const hasQuotes = mode === 'festival' && !template.preRendered && greetingConfig?.quotes?.length > 1;

  // Cleanup
  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl); }, []);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div style={styles.header}>
          <button style={styles.backBtn} onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M15 18l-6-6 6-6" stroke="#2D1810" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <span style={{ ...styles.headerTitle, fontFamily: font }}>
            {mode === 'festival'
              ? (language === 'te' ? `${festival?.telugu} శుభాకాంక్షలు` : `${festival?.english} Wishes`)
              : (language === 'te' ? 'నేటి పంచాంగం' : "Today's Panchangam")}
          </span>
        </div>

        {/* Scrollable content area */}
        <div style={styles.scrollArea}>
          {/* Image */}
          <div style={styles.imageBox}>
            {rendering && !imageUrl ? (
              <div style={styles.loadingBox}><div style={styles.spinnerLg} /></div>
            ) : imageUrl ? (
              <img src={imageUrl} alt="Card" style={styles.previewImg} />
            ) : null}
            {rendering && imageUrl && (
              <div style={styles.renderingOverlay}><div style={styles.spinnerSm} /></div>
            )}
          </div>

          {/* Quote switcher */}
          {hasQuotes && (
            <div style={styles.quoteRow}>
              <span style={{ ...styles.quoteLabel, fontFamily: font }}>
                {language === 'te' ? 'శ్లోకం:' : 'Quote:'}
              </span>
              {greetingConfig.quotes.map((_, i) => (
                <button
                  key={i}
                  style={{ ...styles.quoteDot, ...(i === quoteIndex ? styles.quoteDotActive : {}) }}
                  onClick={() => setQuoteIndex(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}

          {/* Name input */}
          <div style={styles.nameRow}>
            <input
              type="text"
              value={customName}
              onChange={handleNameChange}
              placeholder={language === 'te' ? 'మీ పేరు / కుటుంబం పేరు (ఐచ్ఛికం)' : 'Your name / Family name (optional)'}
              style={{ ...styles.nameInput, fontFamily: font }}
            />
          </div>
        </div>

        {/* Actions — pinned at bottom */}
        <div style={styles.actions}>
          <button
            style={{ ...styles.shareBtn, opacity: sharing ? 0.6 : 1 }}
            onClick={handleShare}
            disabled={sharing || !blobRef.current}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            </svg>
            <span style={{ fontFamily: font, fontWeight: 700 }}>
              {sharing ? (language === 'te' ? 'షేర్ అవుతోంది...' : 'Sharing...') : 'Share'}
            </span>
          </button>
          <button style={styles.saveBtn} onClick={handleSave} disabled={!blobRef.current}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#C49B2A">
              <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    zIndex: 50,
    background: 'rgba(0,0,0,0.6)',
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  modal: {
    width: '100%',
    maxWidth: '420px',
    maxHeight: '95vh',
    background: '#FDF8EF',
    borderRadius: '20px 20px 0 0',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '14px 16px',
    borderBottom: '1px solid rgba(45,24,16,0.06)',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    padding: '4px',
    cursor: 'pointer',
    display: 'flex',
  },
  headerTitle: {
    fontSize: '15px',
    fontWeight: 700,
    color: '#2D1810',
    flex: 1,
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    minHeight: 0,
  },
  imageBox: {
    padding: '10px 16px',
    display: 'flex',
    justifyContent: 'center',
    position: 'relative',
  },
  previewImg: {
    width: '100%',
    maxHeight: '55vh',
    objectFit: 'contain',
    borderRadius: '10px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
  },
  loadingBox: {
    width: '100%',
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(245,228,168,0.15)',
    borderRadius: '10px',
  },
  renderingOverlay: {
    position: 'absolute',
    inset: '10px 16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(253,248,239,0.5)',
    borderRadius: '10px',
  },
  spinnerLg: {
    width: '36px',
    height: '36px',
    border: '3px solid rgba(196,155,42,0.2)',
    borderTopColor: '#C49B2A',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  },
  spinnerSm: {
    width: '20px',
    height: '20px',
    border: '2px solid rgba(196,155,42,0.2)',
    borderTopColor: '#C49B2A',
    borderRadius: '50%',
    animation: 'spin 0.6s linear infinite',
  },
  quoteRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    padding: '0 16px 4px',
  },
  quoteLabel: {
    fontSize: '12px',
    color: '#8A7568',
    marginRight: '4px',
  },
  quoteDot: {
    width: '26px',
    height: '26px',
    borderRadius: '50%',
    border: '1px solid rgba(196,155,42,0.4)',
    background: 'transparent',
    fontSize: '11px',
    color: '#8A7568',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteDotActive: {
    background: '#C49B2A',
    color: '#FFFFFF',
    borderColor: '#C49B2A',
  },
  nameRow: {
    padding: '6px 16px',
  },
  nameInput: {
    width: '100%',
    padding: '9px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(196,155,42,0.3)',
    background: '#FFFFFF',
    fontSize: '13px',
    color: '#2D1810',
    outline: 'none',
    boxSizing: 'border-box',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    padding: '10px 16px',
    paddingBottom: 'calc(10px + env(safe-area-inset-bottom, 0px))',
    borderTop: '1px solid rgba(45,24,16,0.06)',
    flexShrink: 0,
  },
  shareBtn: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    padding: '11px',
    borderRadius: '12px',
    border: 'none',
    background: '#25D366',
    color: '#FFFFFF',
    fontSize: '15px',
    cursor: 'pointer',
  },
  saveBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '11px 14px',
    borderRadius: '12px',
    border: '1.5px solid rgba(196,155,42,0.4)',
    background: '#FFFFFF',
    cursor: 'pointer',
  },
};
