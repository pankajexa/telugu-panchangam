/**
 * Personal Muhurtha Calculator
 * Computes Tara Bala and Chandra Bala from user's Janma Nakshatra/Rashi.
 * Based on traditional Muhurta Chintamani rules.
 */

import { getPanchangamForDate } from './panchangam';
import { NAKSHATRAS_EN } from './constants';

// ── Tara Bala Data (9 Taras) ───────────────────────────────────────────────

export const TARA_DATA = [
  { id: 1, en: 'Janma',        te: 'జన్మ',        good: false, emoji: '🔵',
    meaningEn: 'Birth star — avoid important beginnings',
    meaningTe: 'జన్మ తార — ముఖ్య కార్యాలు ప్రారంభించకండి' },
  { id: 2, en: 'Sampat',       te: 'సంపత్',       good: true,  emoji: '💰',
    meaningEn: 'Wealth — excellent for prosperity & new ventures',
    meaningTe: 'సంపద తార — సంపద, కొత్త కార్యాలకు శ్రేష్ఠం' },
  { id: 3, en: 'Vipat',        te: 'విపత్',       good: false, emoji: '⚠️',
    meaningEn: 'Danger — avoid important activities',
    meaningTe: 'విపత్ తార — ముఖ్య కార్యాలు చేయకండి' },
  { id: 4, en: 'Kshema',       te: 'క్షేమ',       good: true,  emoji: '🛡️',
    meaningEn: 'Well-being — good for all activities',
    meaningTe: 'క్షేమ తార — అన్ని కార్యాలకు మంచిది' },
  { id: 5, en: 'Pratyak',      te: 'ప్రత్యక్',    good: false, emoji: '🚫',
    meaningEn: 'Obstruction — delays & obstacles possible',
    meaningTe: 'ప్రత్యక్ తార — ఆటంకాలు, ఆలస్యం రావచ్చు' },
  { id: 6, en: 'Sadhana',      te: 'సాధన',        good: true,  emoji: '🎯',
    meaningEn: 'Achievement — favorable for goals & efforts',
    meaningTe: 'సాధన తార — లక్ష్యాలు, కృషికి అనుకూలం' },
  { id: 7, en: 'Naidhana',     te: 'నైధన',        good: false, emoji: '💀',
    meaningEn: 'Destruction — strictly avoid all important work',
    meaningTe: 'నైధన తార — ముఖ్య కార్యాలు తప్పనిసరిగా మానండి' },
  { id: 8, en: 'Mitra',        te: 'మిత్ర',       good: true,  emoji: '🤝',
    meaningEn: 'Friend — very favorable for partnerships',
    meaningTe: 'మిత్ర తార — భాగస్వామ్యాలకు చాలా అనుకూలం' },
  { id: 9, en: 'Parama Mitra', te: 'పరమ మిత్ర',   good: true,  emoji: '⭐',
    meaningEn: 'Best Friend — most auspicious for everything',
    meaningTe: 'పరమ మిత్ర — అన్నిటికీ అత్యంత శుభకరం' },
];

// ── Chandra Bala Data (12 Houses) ──────────────────────────────────────────

export const CHANDRA_HOUSES = [
  { house: 1,  good: true,  en: 'Janma Rashi',  te: 'జన్మ రాశి',
    meaningEn: 'Birth sign — mixed, proceed with caution',
    meaningTe: 'జన్మ రాశి — మిశ్రమ ఫలితాలు, జాగ్రత్తగా ముందుకు సాగండి' },
  { house: 2,  good: false, en: 'Dhana',         te: 'ధన స్థానం',
    meaningEn: 'Wealth house — avoid financial decisions',
    meaningTe: 'ధన స్థానం — ఆర్థిక నిర్ణయాలు మానండి' },
  { house: 3,  good: true,  en: 'Sahaja',        te: 'సహజ స్థానం',
    meaningEn: 'Courage — favorable for new initiatives',
    meaningTe: 'సహజ స్థానం — కొత్త కార్యాలకు అనుకూలం' },
  { house: 4,  good: false, en: 'Sukha',         te: 'సుఖ స్థానం',
    meaningEn: 'Comfort house — domestic disturbances possible',
    meaningTe: 'సుఖ స్థానం — గృహ విషయాలలో ఇబ్బందులు' },
  { house: 5,  good: false, en: 'Putra',         te: 'పుత్ర స్థానం',
    meaningEn: 'Children house — avoid speculation & risk',
    meaningTe: 'పుత్ర స్థానం — రిస్క్ తీసుకోకండి' },
  { house: 6,  good: true,  en: 'Ripu',          te: 'శత్రు స్థానం',
    meaningEn: 'Victory over enemies — favorable for competition',
    meaningTe: 'శత్రు స్థానం — పోటీలో విజయం లభిస్తుంది' },
  { house: 7,  good: true,  en: 'Kalatra',       te: 'కళత్ర స్థానం',
    meaningEn: 'Partnership — good for relationships & agreements',
    meaningTe: 'కళత్ర స్థానం — సంబంధాలు, ఒప్పందాలకు మంచిది' },
  { house: 8,  good: false, en: 'Ayu (Chandrashtama)', te: 'ఆయు (చంద్రాష్టమ)',
    meaningEn: 'CHANDRASHTAMA — strictly avoid all important decisions',
    meaningTe: 'చంద్రాష్టమ — ముఖ్య నిర్ణయాలు తప్పనిసరిగా మానండి' },
  { house: 9,  good: false, en: 'Bhagya',        te: 'భాగ్య స్థానం',
    meaningEn: 'Fortune house — avoid long journeys',
    meaningTe: 'భాగ్య స్థానం — దూర ప్రయాణాలు మానండి' },
  { house: 10, good: true,  en: 'Karma',         te: 'కర్మ స్థానం',
    meaningEn: 'Career — excellent for professional work',
    meaningTe: 'కర్మ స్థానం — వృత్తి కార్యాలకు అద్భుతం' },
  { house: 11, good: true,  en: 'Labha',         te: 'లాభ స్థానం',
    meaningEn: 'Gains — most favorable for prosperity & income',
    meaningTe: 'లాభ స్థానం — సంపద, ఆదాయానికి అత్యంత అనుకూలం' },
  { house: 12, good: false, en: 'Vyaya',         te: 'వ్యయ స్థానం',
    meaningEn: 'Expenditure — avoid spending & new commitments',
    meaningTe: 'వ్యయ స్థానం — ఖర్చులు, కొత్త బాధ్యతలు మానండి' },
];

// ── Nakshatra → Primary Rashi mapping ──────────────────────────────────────
// Each nakshatra spans 13°20'. 2.25 nakshatras = 1 rashi (27/12).
// This maps each nakshatra to its "primary" (majority padas) rashi.
export const NAKSHATRA_TO_RASHI = [
  0,  // 0  Ashwini       → Mesha (Aries)
  0,  // 1  Bharani       → Mesha
  1,  // 2  Krittika      → Vrishabha (3/4 padas in Vrishabha)
  1,  // 3  Rohini        → Vrishabha
  2,  // 4  Mrigashira    → Mithuna (split but primarily Mithuna in quick mode)
  2,  // 5  Ardra         → Mithuna
  2,  // 6  Punarvasu     → Mithuna (3/4 padas)
  3,  // 7  Pushyami      → Karkataka
  3,  // 8  Ashlesha      → Karkataka
  4,  // 9  Magha         → Simha
  4,  // 10 Purva Phal.   → Simha
  5,  // 11 Uttara Phal.  → Kanya (3/4 padas)
  5,  // 12 Hasta         → Kanya
  5,  // 13 Chitta        → Kanya (2 padas) — could be Tula too
  6,  // 14 Swati         → Tula
  6,  // 15 Vishakha      → Tula (3/4 padas)
  7,  // 16 Anuradha      → Vrischika
  7,  // 17 Jyeshtha      → Vrischika
  8,  // 18 Moola         → Dhanus
  8,  // 19 Purvashadha   → Dhanus
  9,  // 20 Uttarashadha  → Makara (3/4 padas)
  9,  // 21 Shravanam     → Makara
  10, // 22 Dhanishtha    → Kumbha (split, 2 padas each)
  10, // 23 Shatabhisham  → Kumbha
  11, // 24 Purvabhadra   → Meena (3/4 padas)
  11, // 25 Uttarabhadra  → Meena
  11, // 26 Revati        → Meena
];

// ── Core Calculations ──────────────────────────────────────────────────────

/**
 * Compute Tara Bala from birth and transit nakshatra indices (0-26).
 */
export function computeTaraBala(birthNakIndex, transitNakIndex) {
  // Count from birth to transit (1-indexed, inclusive)
  const count = ((transitNakIndex - birthNakIndex + 27) % 27) + 1;
  // Each tara covers 1 nakshatra, cycles every 9 (27 = 3 × 9)
  const taraId = ((count - 1) % 9) + 1;
  return { ...TARA_DATA[taraId - 1], count };
}

/**
 * Compute Chandra Bala from birth and transit rashi indices (0-11).
 */
export function computeChandraBala(birthRashiIndex, transitRashiIndex) {
  const house = ((transitRashiIndex - birthRashiIndex) + 12) % 12 + 1;
  const data = CHANDRA_HOUSES[house - 1];
  return {
    ...data,
    isChandrashtama: house === 8,
  };
}

/**
 * Get overall personal muhurtha score (0–100) for a given date.
 * Weight: Chandra Bala = 60%, Tara Bala = 40%
 */
export function computeScore(taraBala, chandraBala) {
  const taraScore = taraBala.good ? 100 : (taraBala.id === 1 ? 40 : 10); // Janma=neutral(40), others bad=10
  const chandraScore = chandraBala.isChandrashtama ? 0 :
                       chandraBala.good ? 100 : 25;
  return Math.round(chandraScore * 0.6 + taraScore * 0.4);
}

/**
 * Get complete personal muhurtha for a date.
 */
export function getPersonalMuhurtha(birthNakIndex, birthRashiIndex, date, location) {
  const data = getPanchangamForDate(date, location);
  if (!data) return null;

  // Extract nakshatra index (0-26)
  let nakIdx = data.nakshatra?.index;
  if (typeof nakIdx !== 'number') {
    // Fallback: find by English name
    const nameEn = data.nakshatra?.nameEn || '';
    nakIdx = NAKSHATRAS_EN.findIndex(n => n === nameEn);
    if (nakIdx < 0) nakIdx = 0;
  }

  // Extract moon rashi index (0-11) from raw panchangam
  // moonRashi may not be in the basic return — use NAKSHATRA_TO_RASHI as fallback
  let rashiIdx = NAKSHATRA_TO_RASHI[nakIdx] ?? 0;

  const taraBala = computeTaraBala(birthNakIndex, nakIdx);
  const chandraBala = computeChandraBala(birthRashiIndex, rashiIdx);
  const score = computeScore(taraBala, chandraBala);

  return {
    taraBala,
    chandraBala,
    score,
    transitNakshatra: data.nakshatra?.nameEn || '',
    transitNakshatraTe: data.nakshatra?.name || '',
    transitRashiEn: data.moonRashi?.english || '',
    transitRashiTe: data.moonRashi?.telugu || '',
    date,
  };
}

/**
 * Get 7-day forecast starting from a date.
 */
export function getWeekForecast(birthNakIndex, birthRashiIndex, startDate, location) {
  const forecast = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);
    const result = getPersonalMuhurtha(birthNakIndex, birthRashiIndex, d, location);
    if (result) {
      forecast.push({
        date: d,
        day: d.toLocaleDateString('en', { weekday: 'short' }),
        dayTe: d.toLocaleDateString('te', { weekday: 'short' }),
        score: result.score,
        taraBala: result.taraBala,
        chandraBala: result.chandraBala,
        isChandrashtama: result.chandraBala.isChandrashtama,
      });
    }
  }
  return forecast;
}

/**
 * Get birth data from localStorage.
 */
export function getSavedBirthData() {
  try {
    const raw = localStorage.getItem('personalBirthData');
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

/**
 * Save birth data to localStorage.
 */
export function saveBirthData(data) {
  localStorage.setItem('personalBirthData', JSON.stringify(data));
}

/**
 * Clear birth data from localStorage.
 */
export function clearBirthData() {
  localStorage.removeItem('personalBirthData');
}
