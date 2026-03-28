import { useMemo, useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useLocation } from '../../context/LocationContext';
import { NAKSHATRAS, NAKSHATRAS_EN, RASHIS, RASHIS_EN } from '../../data/constants';
import {
  getPersonalMuhurtha, getWeekForecast, getMonthForecast, clearBirthData, TARA_DATA,
} from '../../data/personalMuhurtha';
import { Star, Edit3, Trash2, AlertTriangle, TrendingUp, Moon } from 'lucide-react';

const SERIF = "'Plus Jakarta Sans', sans-serif";
const DAYS_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const DAYS_TE = ['ఆది', 'సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని'];

function ScoreGauge({ score }) {
  const color = score >= 65 ? '#2D8A39' : score >= 35 ? '#D4920B' : '#CC3333';
  const bg = score >= 65 ? '#F0FFF0' : score >= 35 ? '#FFF9E6' : '#FFF1F0';
  const label = score >= 65 ? 'Shubh' : score >= 35 ? 'Moderate' : 'Avoid';
  const angle = (score / 100) * 360;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
      <div style={{
        width: 100, height: 100, borderRadius: '50%',
        background: `conic-gradient(${color} ${angle}deg, #F0EDE8 ${angle}deg)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
      }}>
        <div style={{
          width: 76, height: 76, borderRadius: '50%',
          background: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column',
        }}>
          <span style={{ fontSize: 28, fontWeight: 800, color, fontFamily: SERIF }}>{score}</span>
        </div>
      </div>
      <span style={{
        fontSize: 11, fontWeight: 700, padding: '3px 14px', borderRadius: 20,
        background: bg, color, border: `1px solid ${color}20`,
        fontFamily: SERIF, letterSpacing: '0.03em',
      }}>{label}</span>
    </div>
  );
}

function TaraBalaCard({ taraBala, pick, font }) {
  const color = taraBala.good ? '#2D8A39' : '#CC3333';
  const bg = taraBala.good ? '#F0FFF0' : '#FFF1F0';

  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <Star size={16} color={color} fill={`${color}30`} strokeWidth={2} />
        <span style={{ ...S.cardLabel, fontFamily: SERIF }}>{pick('తార బలం', 'Tara Bala')}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
        <span style={{ fontSize: 15, fontWeight: 700, color, fontFamily: font }}>
          {taraBala.emoji} {pick(taraBala.te, taraBala.en)}
        </span>
        <span style={{
          fontSize: 10, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
          background: bg, color, fontFamily: SERIF,
        }}>
          {taraBala.good ? pick('శుభం', 'Good') : pick('అశుభం', 'Avoid')}
        </span>
      </div>
      <div style={{ fontSize: 12, color: '#888', lineHeight: 1.6, fontFamily: font }}>
        {pick(taraBala.meaningTe, taraBala.meaningEn)}
      </div>
      {/* 9-dot Tara indicator */}
      <div style={{ display: 'flex', gap: 6, marginTop: 12, justifyContent: 'center' }}>
        {TARA_DATA.map((t, i) => (
          <div key={i} style={{
            width: t.id === taraBala.id ? 24 : 8,
            height: 8,
            borderRadius: 4,
            background: t.id === taraBala.id
              ? (t.good ? '#2D8A39' : '#CC3333')
              : (t.good ? '#D4F5D4' : '#FFD6D6'),
            transition: 'width 300ms',
          }} />
        ))}
      </div>
    </div>
  );
}

function ChandraBalaCard({ chandraBala, transitRashiTe, transitRashiEn, pick, font }) {
  const color = chandraBala.isChandrashtama ? '#CC3333' : chandraBala.good ? '#2D8A39' : '#D4920B';
  const bg = chandraBala.isChandrashtama ? '#FFF1F0' : chandraBala.good ? '#F0FFF0' : '#FFF9E6';

  return (
    <div style={{ ...S.card, ...(chandraBala.isChandrashtama ? { border: '1.5px solid #FF6B6B' } : {}) }}>
      {chandraBala.isChandrashtama && (
        <div style={S.chandrashtamaBanner}>
          <AlertTriangle size={14} color="#CC3333" strokeWidth={2.5} />
          <span style={{ fontFamily: font, fontSize: 12, fontWeight: 700, color: '#CC3333' }}>
            {pick('చంద్రాష్టమ — ముఖ్య నిర్ణయాలు మానండి', 'Chandrashtama — Avoid important decisions')}
          </span>
        </div>
      )}
      <div style={S.cardHeader}>
        <Moon size={16} color={color} fill={`${color}30`} strokeWidth={2} />
        <span style={{ ...S.cardLabel, fontFamily: SERIF }}>{pick('చంద్ర బలం', 'Chandra Bala')}</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color, fontFamily: font }}>
          {pick(chandraBala.te, chandraBala.en)} ({chandraBala.house}{pick('వ భావం', 'th house')})
        </span>
        <span style={{
          fontSize: 10, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
          background: bg, color, fontFamily: SERIF,
        }}>
          {chandraBala.good ? pick('శుభం', 'Good') : pick('అశుభం', 'Avoid')}
        </span>
      </div>
      <div style={{ fontSize: 12, color: '#888', lineHeight: 1.6, fontFamily: font }}>
        {pick(chandraBala.meaningTe, chandraBala.meaningEn)}
      </div>
      <div style={{ fontSize: 11, color: '#AAA', marginTop: 6, fontFamily: font }}>
        {pick('చంద్ర స్థితి', 'Moon transit')}: {pick(transitRashiTe, transitRashiEn)}
      </div>
    </div>
  );
}

function WeekForecast({ forecast, pick, font, language }) {
  const today = new Date().getDay();
  return (
    <div style={S.card}>
      <div style={S.cardHeader}>
        <TrendingUp size={16} color="#E63B2E" strokeWidth={2} />
        <span style={{ ...S.cardLabel, fontFamily: SERIF }}>{pick('7 రోజుల అంచనా', '7-Day Forecast')}</span>
      </div>
      <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
        {forecast.map((day, i) => {
          const color = day.score >= 65 ? '#2D8A39' : day.score >= 35 ? '#D4920B' : '#CC3333';
          const bg = day.score >= 65 ? '#F0FFF0' : day.score >= 35 ? '#FFF9E6' : '#FFF1F0';
          const isToday = i === 0;
          const dayIdx = day.date.getDay();
          return (
            <div key={i} style={{
              flex: 1, display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 4, padding: '8px 2px',
              borderRadius: 10,
              background: isToday ? 'rgba(230,59,46,0.06)' : 'transparent',
              border: isToday ? '1px solid rgba(230,59,46,0.15)' : '1px solid transparent',
            }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: isToday ? '#E63B2E' : '#999', fontFamily: SERIF }}>
                {language === 'te' ? DAYS_TE[dayIdx] : DAYS_EN[dayIdx]}
              </span>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: bg, border: `1.5px solid ${color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontSize: 11, fontWeight: 800, color, fontFamily: SERIF }}>
                  {day.score}
                </span>
              </div>
              {day.isChandrashtama && (
                <span style={{ fontSize: 8, color: '#CC3333', fontWeight: 700 }}>⚠</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function PersonalMuhurthaView({ birthData, onEdit }) {
  const { pick, font, language } = useLanguage();
  const { location } = useLocation();

  const today = useMemo(() => new Date(), []);

  const result = useMemo(() =>
    getPersonalMuhurtha(birthData.janmaNakshatra, birthData.janmaRashi, today, location),
    [birthData, today, location]
  );

  const [forecastMode, setForecastMode] = useState('week'); // 'week' or 'month'

  const forecast = useMemo(() =>
    getWeekForecast(birthData.janmaNakshatra, birthData.janmaRashi, today, location),
    [birthData, today, location]
  );

  const monthForecast = useMemo(() =>
    forecastMode === 'month'
      ? getMonthForecast(birthData.janmaNakshatra, birthData.janmaRashi, today, location)
      : [],
    [birthData, today, location, forecastMode]
  );

  const handleClear = () => {
    clearBirthData();
    onEdit?.();
  };

  if (!result) return null;

  const nakTe = NAKSHATRAS[birthData.janmaNakshatra] || '';
  const nakEn = NAKSHATRAS_EN[birthData.janmaNakshatra] || '';
  const rashiTe = RASHIS[birthData.janmaRashi] || '';
  const rashiEn = RASHIS_EN[birthData.janmaRashi] || '';

  return (
    <div style={{ padding: '16px 0' }}>
      {/* Birth Star Header */}
      <div style={S.birthHeader}>
        <div>
          <div style={{ fontSize: 12, color: '#999', fontFamily: SERIF, marginBottom: 2 }}>
            {pick('మీ జన్మ నక్షత్రం', 'Your Birth Star')}
          </div>
          <div style={{ fontSize: 17, fontWeight: 700, color: '#1A1A1A', fontFamily: font }}>
            ⭐ {pick(nakTe, nakEn)}
            <span style={{ fontSize: 13, fontWeight: 400, color: '#999', marginLeft: 8 }}>
              {pick(rashiTe, rashiEn)}
            </span>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button style={S.headerBtn} onClick={onEdit}>
            <Edit3 size={14} color="#999" />
          </button>
          <button style={S.headerBtn} onClick={handleClear}>
            <Trash2 size={14} color="#CC3333" />
          </button>
        </div>
      </div>

      {/* Score */}
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <ScoreGauge score={result.score} />
      </div>

      <div style={{ textAlign: 'center', fontSize: 12, color: '#AAA', fontFamily: SERIF, marginBottom: 20 }}>
        {pick('నేటి మొత్తం స్కోరు', "Today's Overall Score")}
      </div>

      {/* Tara Bala */}
      <TaraBalaCard taraBala={result.taraBala} pick={pick} font={font} />

      {/* Chandra Bala */}
      <ChandraBalaCard
        chandraBala={result.chandraBala}
        transitRashiTe={result.transitRashiTe}
        transitRashiEn={result.transitRashiEn}
        pick={pick}
        font={font}
      />

      {/* Forecast Toggle + View */}
      <div style={S.card}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={S.cardHeader}>
            <TrendingUp size={16} color="#E63B2E" strokeWidth={2} />
            <span style={{ ...S.cardLabel, fontFamily: SERIF }}>{pick('అంచనా', 'Forecast')}</span>
          </div>
          <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid rgba(0,0,0,0.08)' }}>
            {[
              { key: 'week', label: pick('7 రోజులు', '7 Days') },
              { key: 'month', label: pick('30 రోజులు', '30 Days') },
            ].map(opt => (
              <button key={opt.key} onClick={() => setForecastMode(opt.key)} style={{
                padding: '4px 10px', border: 'none', cursor: 'pointer',
                fontSize: 10, fontWeight: 600, fontFamily: SERIF,
                background: forecastMode === opt.key ? '#E63B2E' : '#FFF',
                color: forecastMode === opt.key ? '#FFF' : '#999',
                WebkitTapHighlightColor: 'transparent',
              }}>{opt.label}</button>
            ))}
          </div>
        </div>

        {forecastMode === 'week' && forecast.length > 0 && (
          <div style={{ display: 'flex', gap: 4 }}>
            {forecast.map((day, i) => {
              const color = day.score >= 65 ? '#2D8A39' : day.score >= 35 ? '#D4920B' : '#CC3333';
              const bg = day.score >= 65 ? '#F0FFF0' : day.score >= 35 ? '#FFF9E6' : '#FFF1F0';
              const isToday = i === 0;
              const dayIdx = day.date.getDay();
              return (
                <div key={i} style={{
                  flex: 1, display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 4, padding: '8px 2px',
                  borderRadius: 10,
                  background: isToday ? 'rgba(230,59,46,0.06)' : 'transparent',
                  border: isToday ? '1px solid rgba(230,59,46,0.15)' : '1px solid transparent',
                }}>
                  <span style={{ fontSize: 10, fontWeight: 600, color: isToday ? '#E63B2E' : '#999', fontFamily: SERIF }}>
                    {language === 'te' ? DAYS_TE[dayIdx] : DAYS_EN[dayIdx]}
                  </span>
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: bg, border: `1.5px solid ${color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 11, fontWeight: 800, color, fontFamily: SERIF }}>{day.score}</span>
                  </div>
                  {day.isChandrashtama && <span style={{ fontSize: 8, color: '#CC3333', fontWeight: 700 }}>⚠</span>}
                </div>
              );
            })}
          </div>
        )}

        {forecastMode === 'month' && monthForecast.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
            {monthForecast.map((day, i) => {
              const color = day.score >= 65 ? '#2D8A39' : day.score >= 35 ? '#D4920B' : '#CC3333';
              const bg = day.score >= 65 ? '#F0FFF0' : day.score >= 35 ? '#FFF9E6' : '#FFF1F0';
              const isToday = i === 0;
              return (
                <div key={i} style={{
                  width: 'calc(14.28% - 4px)', display: 'flex', flexDirection: 'column',
                  alignItems: 'center', gap: 2, padding: '6px 2px',
                  borderRadius: 8,
                  background: isToday ? 'rgba(230,59,46,0.06)' : 'transparent',
                  border: isToday ? '1px solid rgba(230,59,46,0.15)' : '1px solid transparent',
                }}>
                  <span style={{ fontSize: 8, color: '#BBB', fontFamily: SERIF }}>{day.month} {day.dayNum}</span>
                  <div style={{
                    width: 24, height: 24, borderRadius: '50%',
                    background: bg, border: `1px solid ${color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <span style={{ fontSize: 9, fontWeight: 800, color, fontFamily: SERIF }}>{day.score}</span>
                  </div>
                  {day.isChandrashtama && <span style={{ fontSize: 7, color: '#CC3333' }}>⚠</span>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  birthHeader: {
    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
    marginBottom: 8,
  },
  headerBtn: {
    background: 'none', border: '1px solid rgba(0,0,0,0.08)',
    borderRadius: 10, padding: 8, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    WebkitTapHighlightColor: 'transparent',
  },
  card: {
    background: '#FFF', border: '1px solid rgba(0,0,0,0.06)',
    borderRadius: 16, padding: '16px 18px', marginBottom: 12,
    boxShadow: '0 1px 4px rgba(0,0,0,0.03)',
  },
  cardHeader: {
    display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
  },
  cardLabel: {
    fontSize: 11, fontWeight: 700, color: '#AAA', letterSpacing: '0.06em', textTransform: 'uppercase',
  },
  chandrashtamaBanner: {
    display: 'flex', alignItems: 'center', gap: 8,
    background: 'rgba(204,51,51,0.06)', borderRadius: 10,
    padding: '8px 12px', marginBottom: 12,
  },
};
