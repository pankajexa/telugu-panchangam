import { useState, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { useLocation } from '../context/LocationContext';
import { getPanchangamForDate } from '../data/panchangam';
import { getShlokaOfTheDay, getShlokasByCategory, SHLOKAS, CATEGORY_LABELS } from '../data/shlokas';
import { Share2, Sunrise, Sunset, Sparkles, Download } from 'lucide-react';
import { CrescentIcon } from '../components/icons/HinduIcons';
import ShlokaCard from '../components/shlokas/ShlokaCard';
import ShlokaDetail from '../components/shlokas/ShlokaDetail';
import ShareButton from '../components/ShareButton';
import FestivalWishes from '../components/FestivalWishes';
import { generateFestivalShlokaCard, FESTIVAL_THEMES } from '../imageCard/generateFestivalShlokaCard';
import { shareImage } from '../utils/sharingService';

const ASSET_BASE = '/assets/greetings';

export default function ShareCenterPage() {
  const { t, pick, font, language } = useLanguage();
  const { isNight, colors } = useTheme();
  const { location } = useLocation();

  const today = useMemo(() => new Date(), []);
  const data = useMemo(() => getPanchangamForDate(today, location), [today, location]);
  const shlokaOfDay = useMemo(() => data ? getShlokaOfTheDay(today, data.festival?.english) : SHLOKAS[0], [today, data]);
  const categories = useMemo(() => getShlokasByCategory(), []);
  const categoryKeys = useMemo(() => Object.keys(categories).filter(k => categories[k].length > 0), [categories]);

  const [selectedShloka, setSelectedShloka] = useState(null);
  const [activeCategory, setActiveCategory] = useState(categoryKeys[0] || 'devotion');
  const [sharingId, setSharingId] = useState(null);

  // ── Festival-special detection ──
  const festivalEnglish = data?.festival?.english || null;
  const hasFestivalTheme = festivalEnglish && FESTIVAL_THEMES[festivalEnglish];
  const festivalTheme = hasFestivalTheme ? FESTIVAL_THEMES[festivalEnglish] : null;

  // Get all shlokas tagged for this festival
  const festivalShlokas = useMemo(() => {
    if (!festivalEnglish) return [];
    const festKey = festivalEnglish.toLowerCase().replace(/\s+/g, '_');
    return SHLOKAS.filter(s => s.festivalTags?.some(tag => {
      // Match: "rama_navami" should match festival "sri_rama_navami"
      return festKey.includes(tag) || tag.includes(festKey) || festKey === tag;
    }));
  }, [festivalEnglish]);

  const handleNavigate = useCallback((dir) => {
    if (!selectedShloka) return;
    const idx = SHLOKAS.findIndex(s => s.id === selectedShloka.id);
    const next = dir === 'next' ? idx + 1 : idx - 1;
    if (next >= 0 && next < SHLOKAS.length) setSelectedShloka(SHLOKAS[next]);
  }, [selectedShloka]);

  // Share a festival shloka card (image with deity + shloka)
  const handleShareFestivalShloka = useCallback(async (shloka) => {
    if (sharingId) return;
    setSharingId(shloka.id);
    try {
      const wishText = pick(
        `${data?.festival?.telugu || ''} శుభాకాంక్షలు`,
        `Happy ${festivalEnglish || ''}`
      );
      const blob = await generateFestivalShlokaCard(shloka, festivalEnglish, wishText);
      const text = `${shloka.sanskritDevanagari}\n\n${shloka.englishMeaning}\n\n🙏 ${wishText}\n\n— ${shloka.source}\n\nమనCalendar — Telugu Panchangam`;
      await shareImage(blob, `${festivalEnglish?.replace(/\s/g, '_')}_shloka_${shloka.id}`, text);
    } catch (e) {
      console.error('Share failed:', e);
    } finally {
      setSharingId(null);
    }
  }, [sharingId, festivalEnglish, data, pick]);

  if (!data) return null;

  const festivalName = data.festival ? pick(data.festival.telugu, data.festival.english) : null;
  const isFestivalSpecial = hasFestivalTheme && festivalShlokas.length > 0;

  return (
    <div style={S.page}>
      <div style={S.content}>

        {/* ═══════════════════════════════════════════ */}
        {/* ═══ FESTIVAL-SPECIAL HERO (when active) ═══ */}
        {/* ═══════════════════════════════════════════ */}
        {isFestivalSpecial ? (
          <>
            {/* Festival hero banner */}
            <div style={S.festHero}>
              <div style={{ ...S.festHeroBg, background: `linear-gradient(160deg, ${festivalTheme.gradient[0]}, ${festivalTheme.gradient[1]}, ${festivalTheme.gradient[2]})` }}>
                {/* Deity image */}
                <img
                  src={festivalTheme.image}
                  alt={festivalEnglish}
                  style={S.festHeroImg}
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
                {/* Gradient overlay at bottom */}
                <div style={S.festHeroOverlay} />
                {/* Festival title over image */}
                <div style={S.festHeroTitle}>
                  <div style={S.festHeroChip}>
                    <Sparkles size={12} color="#E8C840" strokeWidth={2} />
                    <span style={S.festHeroChipText}>{pick('ప్రత్యేక సంచిక', 'Special Edition')}</span>
                  </div>
                  <h1 style={{ ...S.festHeroName, fontFamily: font }}>{festivalName}</h1>
                  <div style={S.festHeroSub}>
                    {festivalShlokas.length} {pick('శ్లోకాలు • వాల్మీకి రామాయణం', 'Shlokas • Valmiki Ramayana')}
                  </div>
                </div>
              </div>
            </div>

            {/* Festival wishes card */}
            {data.festival?.major && (
              <div style={{ ...S.festWishCard, background: colors.cardBg, border: `1px solid ${colors.border}` }}>
                <div style={S.festWishHeader}>
                  <div style={{ ...S.festWishName, fontFamily: font, color: colors.text }}>
                    {pick(`${festivalName} శుభాకాంక్షలు పంపండి`, `Send ${festivalName} Wishes`)}
                  </div>
                </div>
                <FestivalWishes festival={data.festival} />
              </div>
            )}

            {/* Festival shlokas — all tagged shlokas */}
            <div style={{ ...S.sectionLabel, marginTop: 20 }}>
              {pick(`${festivalName} శ్లోకాలు`, `${festivalEnglish} Shlokas`)}
            </div>
            <div style={S.festShlokaGrid}>
              {festivalShlokas.map((shloka) => (
                <div key={shloka.id} style={{ ...S.festShlokaCard, background: colors.cardBg, border: `1px solid ${colors.border}` }}>
                  {/* Shloka content */}
                  <div style={{ ...S.festShlokaDevanagari, fontFamily: "'Noto Sans Devanagari', sans-serif", color: colors.text }}>
                    {shloka.sanskritDevanagari.split('\n')[0]}…
                  </div>
                  <div style={{ ...S.festShlokaTelugu, fontFamily: "'Noto Sans Telugu', sans-serif", color: colors.iconColor }}>
                    {shloka.teluguTransliteration.split('\n')[0]}
                  </div>
                  <div style={{ ...S.festShlokaMeaning, color: colors.textMuted }}>
                    {shloka.englishMeaning.length > 100 ? shloka.englishMeaning.slice(0, 100) + '…' : shloka.englishMeaning}
                  </div>
                  <div style={{ ...S.festShlokaFooter, borderTop: `1px solid ${colors.border}` }}>
                    <span style={{ ...S.festShlokaSource, color: colors.textFaint }}>{shloka.source}</span>
                    <div style={S.festShlokaBtns}>
                      <button style={S.festReadBtn} onClick={() => setSelectedShloka(shloka)}>
                        {pick('చదవండి', 'Read')}
                      </button>
                      <button
                        style={{ ...S.festShareBtn, opacity: sharingId === shloka.id ? 0.5 : 1 }}
                        onClick={() => handleShareFestivalShloka(shloka)}
                        disabled={sharingId === shloka.id}
                      >
                        <Share2 size={13} color="white" strokeWidth={2} />
                        <span>{sharingId === shloka.id ? '…' : pick('షేర్', 'Share')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Divider before regular sections */}
            <div style={S.divider} />
          </>
        ) : (
          /* ═══ Regular header (non-festival day) ═══ */
          <div style={S.headerRow}>
            <div>
              <h1 style={{ ...S.title, color: colors.text }}>{t('share.title')}</h1>
              <div style={{ ...S.subtitle, color: colors.textMuted }}>{t('share.subtitle')}</div>
            </div>
            <Share2 size={24} color="#E63B2E" strokeWidth={1.8} />
          </div>
        )}

        {/* ═══════════════════════════════════════════ */}
        {/* ═══ REGULAR SECTIONS (always shown) ═══ */}
        {/* ═══════════════════════════════════════════ */}

        {/* Section: Today's Panchangam */}
        <div style={{ ...S.sectionLabel, color: colors.textFaint }}>{t('share.todayPanchangam')}</div>
        <div style={{ ...S.panchangCard, background: colors.cardBg, border: `1px solid ${colors.border}` }}>
          <div style={S.panchangHeader}>
            <div>
              <div style={{ ...S.panchangDate, fontFamily: "'Playfair Display', serif", color: colors.text }}>
                {data.dateNum} {data.englishMonth} {data.year}
              </div>
              <div style={{ ...S.panchangDay, fontFamily: font, color: colors.textSecondary }}>
                {pick(data.vaaram, data.englishDay)} • {pick(data.masam?.telugu, data.masam?.english)}
              </div>
            </div>
            <div style={S.panchangTithi}>
              <CrescentIcon size={14} color="#E8A817" />
              <span style={{ ...S.panchangTithiText, fontFamily: font, color: colors.text }}>{pick(data.tithi.name, data.tithi.nameEn)}</span>
            </div>
          </div>
          <div style={{ ...S.quickRow, borderTop: `1px solid ${colors.border}`, borderBottom: `1px solid ${colors.border}` }}>
            <div style={S.quickItem}><Sunrise size={13} color="#D4790A" strokeWidth={1.8} /><span style={{ ...S.quickTime, color: colors.text }}>{data.sunrise}</span></div>
            <div style={S.quickDivider} />
            <div style={S.quickItem}><Sunset size={13} color="#C74530" strokeWidth={1.8} /><span style={{ ...S.quickTime, color: colors.text }}>{data.sunset}</span></div>
            <div style={S.quickDivider} />
            <div style={S.quickItem}><span style={{ ...S.quickLabel, fontFamily: font, color: colors.text }}>{pick(data.nakshatra.name, data.nakshatra.nameEn)}</span></div>
          </div>
          {festivalName && !isFestivalSpecial && <div style={S.panchangFest}>🎊 {festivalName}</div>}
          <div style={S.shareButtonWrap}><ShareButton data={data} /></div>
        </div>

        {/* Section: Shloka of the Day (when no festival-special, or as additional) */}
        {!isFestivalSpecial && (
          <>
            <div style={S.sectionLabel}>{t('share.shlokaOfDay')}</div>
            <ShlokaCard shloka={shlokaOfDay} onTap={() => setSelectedShloka(shlokaOfDay)} />
          </>
        )}

        {/* Section: Browse All Shlokas */}
        <div style={{ ...S.sectionLabel, marginTop: 24 }}>{t('share.browseShlokas')}</div>
        <div style={{ ...S.sectionSub, color: colors.textMuted }}>{SHLOKAS.length} {pick('శ్లోకాలు • వాల్మీకి రామాయణం', 'Shlokas • Valmiki Ramayana')}</div>
        <div style={S.chipScroll}>
          {categoryKeys.map(key => {
            const label = CATEGORY_LABELS[key] ? pick(CATEGORY_LABELS[key].te, CATEGORY_LABELS[key].en) : key;
            const active = activeCategory === key;
            return (
              <button key={key} onClick={() => setActiveCategory(key)} style={{
                ...S.chip, background: active ? colors.text : colors.cardBg, color: active ? (isNight ? '#0B0F19' : 'white') : colors.textMuted,
                border: active ? 'none' : `1px solid ${colors.chipBorder}`,
              }}>{label} ({categories[key].length})</button>
            );
          })}
        </div>
        <div style={S.shlokaGrid}>
          {(categories[activeCategory] || []).map(shloka => (
            <ShlokaCard key={shloka.id} shloka={shloka} label={shloka.purpose} onTap={() => setSelectedShloka(shloka)} />
          ))}
        </div>
      </div>

      {/* ═══ Shloka Detail Bottom Sheet ═══ */}
      {selectedShloka && (
        <ShlokaDetail shloka={selectedShloka} onClose={() => setSelectedShloka(null)} onNavigate={handleNavigate} />
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════
const S = {
  page: { width: '100%', maxWidth: '480px', margin: '0 auto' },
  content: { padding: '0 0 100px' },

  // Regular header
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, padding: '8px 20px 0' },
  title: { fontFamily: "'Playfair Display', serif", fontSize: 26, fontWeight: 700, margin: 0 },
  subtitle: { fontSize: 13, marginTop: 2, fontFamily: "'Plus Jakarta Sans', sans-serif" },

  // ── Festival hero ──
  festHero: { marginBottom: 16, borderRadius: '0 0 24px 24px', overflow: 'hidden' },
  festHeroBg: { position: 'relative', minHeight: 420, display: 'flex', flexDirection: 'column' },
  festHeroImg: { width: '100%', height: 340, objectFit: 'cover', objectPosition: 'center top', display: 'block' },
  festHeroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 200, background: 'linear-gradient(to top, rgba(0,0,0,0.85), transparent)', pointerEvents: 'none' },
  festHeroTitle: { position: 'absolute', bottom: 20, left: 20, right: 20, zIndex: 2 },
  festHeroChip: { display: 'inline-flex', alignItems: 'center', gap: 5, background: 'rgba(232,200,64,0.15)', border: '1px solid rgba(232,200,64,0.3)', borderRadius: 20, padding: '4px 12px', marginBottom: 8 },
  festHeroChipText: { fontSize: 11, fontWeight: 600, color: '#E8C840', letterSpacing: '0.05em', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  festHeroName: { fontSize: 28, fontWeight: 700, color: 'white', margin: 0, lineHeight: 1.2, textShadow: '0 2px 8px rgba(0,0,0,0.4)' },
  festHeroSub: { fontSize: 12, color: 'rgba(255,255,255,0.6)', marginTop: 6, fontFamily: "'Plus Jakarta Sans', sans-serif" },

  // ── Festival wishes card ──
  festWishCard: { margin: '0 20px 16px', borderRadius: 16, padding: '16px 18px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  festWishHeader: { marginBottom: 10 },
  festWishName: { fontSize: 15, fontWeight: 700 },

  // ── Festival shloka cards ──
  festShlokaGrid: { display: 'flex', flexDirection: 'column', gap: 14, padding: '0 20px' },
  festShlokaCard: { borderRadius: 16, padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' },
  festShlokaDevanagari: { fontSize: 16, fontWeight: 600, lineHeight: 1.6, marginBottom: 6 },
  festShlokaTelugu: { fontSize: 13, lineHeight: 1.5, marginBottom: 8 },
  festShlokaMeaning: { fontSize: 13, lineHeight: 1.5, fontStyle: 'italic', marginBottom: 14, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  festShlokaFooter: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12 },
  festShlokaSource: { fontSize: 11, fontFamily: "'Plus Jakarta Sans', sans-serif", flex: 1 },
  festShlokaBtns: { display: 'flex', gap: 8 },
  festReadBtn: { fontSize: 12, fontWeight: 600, color: '#E63B2E', background: 'rgba(230,59,46,0.06)', border: '1px solid rgba(230,59,46,0.15)', borderRadius: 10, padding: '6px 14px', cursor: 'pointer', fontFamily: "'Plus Jakarta Sans', sans-serif", WebkitTapHighlightColor: 'transparent' },
  festShareBtn: { fontSize: 12, fontWeight: 600, color: 'white', background: '#E63B2E', border: 'none', borderRadius: 10, padding: '6px 14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontFamily: "'Plus Jakarta Sans', sans-serif", WebkitTapHighlightColor: 'transparent' },

  divider: { height: 1, background: 'rgba(0,0,0,0.06)', margin: '24px 20px 20px' },

  // ── Section labels ──
  sectionLabel: { fontSize: 13, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, padding: '0 20px', fontFamily: "'Plus Jakarta Sans', sans-serif" },
  sectionSub: { fontSize: 12, marginBottom: 14, marginTop: -6, padding: '0 20px', fontFamily: "'Plus Jakarta Sans', sans-serif" },

  // ── Panchangam card ──
  panchangCard: { borderRadius: 16, padding: '18px 20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: 22, marginLeft: 20, marginRight: 20 },
  panchangHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  panchangDate: { fontSize: 18, fontWeight: 700 },
  panchangDay: { fontSize: 13, marginTop: 2 },
  panchangTithi: { display: 'flex', alignItems: 'center', gap: 6, background: 'linear-gradient(135deg, #FFFCF0, #FFF8E6)', padding: '6px 12px', borderRadius: 10, border: '1px solid rgba(232,168,23,0.12)' },
  panchangTithiText: { fontSize: 12, fontWeight: 600 },
  quickRow: { display: 'flex', alignItems: 'center', padding: '10px 0', marginBottom: 12 },
  quickItem: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 },
  quickDivider: { width: 1, height: 20, background: 'rgba(0,0,0,0.06)', flexShrink: 0 },
  quickTime: { fontSize: 13, fontWeight: 700, fontFamily: "'Plus Jakarta Sans', sans-serif" },
  quickLabel: { fontSize: 12, fontWeight: 600 },
  panchangFest: { fontSize: 13, fontWeight: 600, color: '#E63B2E', marginBottom: 12 },
  shareButtonWrap: { marginTop: 4 },

  // ── Category chips ──
  chipScroll: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 4, marginBottom: 16, padding: '0 20px 4px', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' },
  chip: { padding: '7px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', fontFamily: "'Plus Jakarta Sans', sans-serif", WebkitTapHighlightColor: 'transparent', outline: 'none', flexShrink: 0 },

  // ── Shloka grid ──
  shlokaGrid: { display: 'flex', flexDirection: 'column', gap: 12, padding: '0 20px' },
};
