import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { usePanchangamPrefs } from '../context/PanchangamPrefsContext';

const SERIF = "'Plus Jakarta Sans', system-ui, sans-serif";

function to12Hr(time24) {
  if (!time24 || time24 === '--') return time24 || '--';
  const [hh, mm] = time24.split(':').map(Number);
  if (isNaN(hh)) return time24;
  const period = hh >= 12 ? 'PM' : 'AM';
  const h = hh % 12 || 12;
  return `${h}:${String(mm).padStart(2, '0')} ${period}`;
}

function TimeRow({ label, value, font }) {
  if (!value || value === '--') return null;
  return (
    <div style={s.row}>
      <span style={{ ...s.label, fontFamily: font }}>{label}</span>
      <span style={s.value}>{value}</span>
    </div>
  );
}

function TransitionRow({ item, font, language }) {
  const name = language === 'te' ? item.telugu : item.english;
  const start = item.start?.time ? to12Hr(item.start.time) : '';
  const end = item.end?.time ? to12Hr(item.end.time) : '';
  const startDate = item.start?.sameDay === false ? item.start.date : '';
  const endDate = item.end?.sameDay === false ? item.end.date : '';

  return (
    <div style={s.transRow}>
      <span style={{ ...s.transName, fontFamily: font }}>{name}</span>
      <span style={s.transTime}>
        {startDate ? `${startDate} ` : ''}{start} – {endDate ? `${endDate} ` : ''}{end}
      </span>
    </div>
  );
}

function GroupCard({ title, children }) {
  if (!children || (Array.isArray(children) && children.every(c => !c))) return null;
  return (
    <div style={s.card}>
      <div style={s.groupHeader}>{title}</div>
      <div style={s.groupBody}>{children}</div>
    </div>
  );
}

export default function DetailedPanchangam({ detailedData }) {
  const { t, font, language } = useLanguage();
  const { isGroupEnabled } = usePanchangamPrefs();
  const [expanded, setExpanded] = useState(false);

  if (!detailedData) return null;

  const pick = (te, en) => language === 'te' ? te : en;
  const d = detailedData;

  // Check if there's anything to show
  const hasContent = d.shubha || d.ashubha || d.calendar || d.timings || d.rashi || d.yogas;
  if (!hasContent) return null;

  return (
    <div style={s.container}>
      <button style={s.toggle} onClick={() => setExpanded(!expanded)}>
        <span style={{ ...s.toggleText, fontFamily: font }}>{t('detailed.title')}</span>
        <span style={s.chevron}>{expanded ? '▾' : '▸'}</span>
      </button>

      {expanded && (
        <div style={s.content}>
          {/* Shubha Muhurtham */}
          {d.shubha && (
            <GroupCard title={<span style={{ fontFamily: font }}>{t('detailed.shubha')}</span>}>
              <TimeRow label={t('field.abhijit')} value={d.shubha.abhijit} font={font} />
              <TimeRow label={t('field.amritKalam')} value={d.shubha.amritKalam} font={font} />
              <TimeRow label={t('field.brahmaMuhurta')} value={d.shubha.brahmaMuhurta} font={font} />
            </GroupCard>
          )}

          {/* Ashubha Muhurtham */}
          {d.ashubha && (
            <GroupCard title={<span style={{ fontFamily: font }}>{t('detailed.ashubha')}</span>}>
              <TimeRow label={t('field.yamaganda')} value={d.ashubha.yamaganda} font={font} />
              <TimeRow label={t('field.gulika')} value={d.ashubha.gulika} font={font} />
            </GroupCard>
          )}

          {/* Calendar Systems */}
          {d.calendar && (
            <GroupCard title={<span style={{ fontFamily: font }}>{t('detailed.calendar')}</span>}>
              {d.calendar.vikramSamvat && (
                <TimeRow label={t('field.vikramSamvat')} value={String(d.calendar.vikramSamvat)} font={font} />
              )}
              {d.calendar.shakaSamvat && (
                <TimeRow label={t('field.shakaSamvat')} value={String(d.calendar.shakaSamvat)} font={font} />
              )}
              {d.calendar.samvatsaraName && (
                <TimeRow label={t('field.samvatsara')} value={pick(d.calendar.samvatsaraName.telugu, d.calendar.samvatsaraName.english)} font={font} />
              )}
              {d.calendar.amanta && (
                <TimeRow label={pick('అమాంత మాసం', 'Amanta Masa')} value={pick(d.calendar.amanta.telugu, d.calendar.amanta.english)} font={font} />
              )}
              {d.calendar.ritu && (
                <TimeRow label={t('field.ritu')} value={pick(d.calendar.ritu.telugu, d.calendar.ritu.english)} font={font} />
              )}
              {d.calendar.ayana && (
                <TimeRow label={t('field.ayana')} value={pick(d.calendar.ayana.telugu, d.calendar.ayana.english)} font={font} />
              )}
            </GroupCard>
          )}

          {/* Detailed Timings */}
          {d.timings && (
            <GroupCard title={<span style={{ fontFamily: font }}>{t('detailed.timings')}</span>}>
              {d.timings.moonrise && (
                <TimeRow label={t('field.moonrise')} value={d.timings.moonrise.time ? to12Hr(d.timings.moonrise.time) : '--'} font={font} />
              )}
              {d.timings.moonset && (
                <TimeRow label={t('field.moonset')} value={d.timings.moonset.time ? to12Hr(d.timings.moonset.time) : '--'} font={font} />
              )}
              {d.timings.tithiTransitions?.length > 0 && (
                <div style={s.transSection}>
                  <div style={{ ...s.transSectionLabel, fontFamily: font }}>{t('field.tithiTransitions')}</div>
                  {d.timings.tithiTransitions.map((t, i) => (
                    <TransitionRow key={i} item={t} font={font} language={language} />
                  ))}
                </div>
              )}
              {d.timings.nakshatraTransitions?.length > 0 && (
                <div style={s.transSection}>
                  <div style={{ ...s.transSectionLabel, fontFamily: font }}>{t('field.nakshatraTransitions')}</div>
                  {d.timings.nakshatraTransitions.map((t, i) => (
                    <TransitionRow key={i} item={t} font={font} language={language} />
                  ))}
                </div>
              )}
              {d.timings.yogaTransitions?.length > 0 && (
                <div style={s.transSection}>
                  <div style={{ ...s.transSectionLabel, fontFamily: font }}>{t('field.yogaTransitions')}</div>
                  {d.timings.yogaTransitions.map((t, i) => (
                    <TransitionRow key={i} item={t} font={font} language={language} />
                  ))}
                </div>
              )}
              {d.timings.karanaTransitions?.length > 0 && (
                <div style={s.transSection}>
                  <div style={{ ...s.transSectionLabel, fontFamily: font }}>{t('field.karanaTransitions')}</div>
                  {d.timings.karanaTransitions.map((t, i) => (
                    <TransitionRow key={i} item={t} font={font} language={language} />
                  ))}
                </div>
              )}
            </GroupCard>
          )}

          {/* Rashi & Graha */}
          {d.rashi && (
            <GroupCard title={<span style={{ fontFamily: font }}>{t('detailed.rashi')}</span>}>
              {d.rashi.sunRashi && (
                <TimeRow label={t('field.sunRashi')} value={pick(d.rashi.sunRashi.telugu, d.rashi.sunRashi.english)} font={font} />
              )}
              {d.rashi.moonRashi && (
                <TimeRow label={t('field.moonRashi')} value={pick(d.rashi.moonRashi.telugu, d.rashi.moonRashi.english)} font={font} />
              )}
              {d.rashi.dishaShoola && (
                <TimeRow label={t('field.dishaShoola')} value={pick(d.rashi.dishaShoola.telugu, d.rashi.dishaShoola.english)} font={font} />
              )}
              {d.rashi.moonRashiTransitions?.length > 0 && (
                <div style={s.transSection}>
                  <div style={{ ...s.transSectionLabel, fontFamily: font }}>{t('field.moonRashiTransition')}</div>
                  {d.rashi.moonRashiTransitions.map((t, i) => (
                    <div key={i} style={s.transRow}>
                      <span style={{ ...s.transName, fontFamily: font }}>{pick(t.telugu, t.english)}</span>
                      <span style={s.transTime}>{t.time?.time ? to12Hr(t.time.time) : ''}</span>
                    </div>
                  ))}
                </div>
              )}
            </GroupCard>
          )}

          {/* Special Yogas */}
          {d.yogas && (
            <GroupCard title={<span style={{ fontFamily: font }}>{t('detailed.yogas')}</span>}>
              {d.yogas.anandadiYoga && (
                <TimeRow label={t('field.anandadiYoga')} value={pick(d.yogas.anandadiYoga.te, d.yogas.anandadiYoga.en)} font={font} />
              )}
              {d.yogas.gandamool && (
                <TimeRow label={t('field.gandamool')} value={pick('అవును', 'Yes')} font={font} />
              )}
              {d.yogas.specialYogas?.length > 0 && (
                <div style={s.transSection}>
                  <div style={{ ...s.transSectionLabel, fontFamily: font }}>{t('field.specialYogas')}</div>
                  {d.yogas.specialYogas.map((y, i) => (
                    <div key={i} style={s.transRow}>
                      <span style={s.transName}>{y.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </GroupCard>
          )}
        </div>
      )}
    </div>
  );
}

const s = {
  container: {
    width: '100%',
    marginTop: '4px',
  },
  toggle: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '6px',
    width: '100%',
    background: 'none',
    border: '1px solid rgba(196,155,42,0.2)',
    borderRadius: '12px',
    padding: '8px 16px',
    cursor: 'pointer',
  },
  toggleText: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#C49B2A',
  },
  chevron: {
    fontSize: '12px',
    color: '#C49B2A',
    opacity: 0.6,
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    marginTop: '8px',
  },
  card: {
    background: '#FFFFFF',
    border: '1px solid rgba(45,24,16,0.06)',
    borderRadius: '14px',
    overflow: 'hidden',
    boxShadow: '0 1px 6px rgba(45,24,16,0.05)',
  },
  groupHeader: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#C49B2A',
    padding: '10px 14px 6px',
    letterSpacing: '0.2px',
  },
  groupBody: {
    padding: '0 14px 10px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '5px 0',
    gap: '8px',
  },
  label: {
    fontSize: '12px',
    fontWeight: 500,
    color: '#5C3D2E',
    flex: 1,
  },
  value: {
    fontFamily: SERIF,
    fontSize: '12px',
    fontWeight: 600,
    color: '#2D1810',
    textAlign: 'right',
  },
  transSection: {
    marginTop: '6px',
    paddingTop: '6px',
    borderTop: '1px solid rgba(45,24,16,0.05)',
  },
  transSectionLabel: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#915838',
    marginBottom: '4px',
  },
  transRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '3px 0',
    gap: '6px',
  },
  transName: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#3a150a',
  },
  transTime: {
    fontFamily: SERIF,
    fontSize: '11px',
    color: '#6b2d15',
    textAlign: 'right',
    whiteSpace: 'nowrap',
  },
};
