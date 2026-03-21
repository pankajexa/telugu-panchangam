/**
 * Custom panchangam calculations not provided by the library.
 * All functions are pure — no side effects.
 */

// ─── Gandamool Nakshatra ────────────────────────────────
// Nakshatras at the junction of two rashis
const GANDAMOOL_INDICES = new Set([0, 8, 9, 17, 18, 26]);
// Ashwini(0), Ashlesha(8), Magha(9), Jyeshtha(17), Moola(18), Revati(26)

export function isGandamool(nakshatraIndex) {
  return GANDAMOOL_INDICES.has(nakshatraIndex);
}

// ─── Anandadi Yoga ──────────────────────────────────────
// 28 yogas based on (weekday + nakshatra) combination
const ANANDADI_YOGAS = [
  { te: 'అమృతం', en: 'Amrita' },
  { te: 'ముసలం', en: 'Musala' },
  { te: 'మృత్యు', en: 'Mrityu' },
  { te: 'కాల', en: 'Kala' },
  { te: 'సిద్ధి', en: 'Siddhi' },
  { te: 'సాధ్య', en: 'Sadhya' },
  { te: 'శుభ', en: 'Shubha' },
  { te: 'అమృతం', en: 'Amrita' },
  { te: 'ముసలం', en: 'Musala' },
  { te: 'దగ్ధ', en: 'Dagdha' },
  { te: 'కాల', en: 'Kala' },
  { te: 'సిద్ధి', en: 'Siddhi' },
  { te: 'శుభ', en: 'Shubha' },
  { te: 'అమృతం', en: 'Amrita' },
  { te: 'మరణ', en: 'Marana' },
  { te: 'ముసలం', en: 'Musala' },
  { te: 'సిద్ధి', en: 'Siddhi' },
  { te: 'శుభ', en: 'Shubha' },
  { te: 'కాల', en: 'Kala' },
  { te: 'అమృతం', en: 'Amrita' },
  { te: 'దగ్ధ', en: 'Dagdha' },
  { te: 'కాల', en: 'Kala' },
  { te: 'ముసలం', en: 'Musala' },
  { te: 'సిద్ధి', en: 'Siddhi' },
  { te: 'మరణ', en: 'Marana' },
  { te: 'శుభ', en: 'Shubha' },
  { te: 'అమృతం', en: 'Amrita' },
  { te: 'సిద్ధి', en: 'Siddhi' },
];

export function getAnandadiYoga(vara, nakshatraIndex) {
  // vara: 0=Sunday..6=Saturday; nakshatraIndex: 0-26
  const index = (vara + nakshatraIndex) % 28;
  return ANANDADI_YOGAS[index];
}

// ─── Telugu Ritu (Season) Mapping ───────────────────────
export const RITU_TELUGU = {
  'Vasant': 'వసంతం',
  'Grishma': 'గ్రీష్మం',
  'Varsha': 'వర్షం',
  'Sharad': 'శరత్తు',
  'Hemant': 'హేమంతం',
  'Shishir': 'శిశిరం',
};

// ─── Telugu Ayana Mapping ───────────────────────────────
export const AYANA_TELUGU = {
  'Uttarayana': 'ఉత్తరాయణం',
  'Dakshinayana': 'దక్షిణాయనం',
};

// ─── Telugu Direction Mapping ───────────────────────────
export const DIRECTION_TELUGU = {
  'East': 'తూర్పు',
  'West': 'పశ్చిమం',
  'North': 'ఉత్తరం',
  'South': 'దక్షిణం',
  'North-East': 'ఈశాన్యం',
  'North-West': 'వాయువ్యం',
  'South-East': 'ఆగ్నేయం',
  'South-West': 'నైరుతి',
};

// ─── Samvatsara 60-year cycle Telugu names ───────────────
export const SAMVATSARA_NAMES_TE = [
  'ప్రభవ', 'విభవ', 'శుక్ల', 'ప్రమోదూత', 'ప్రజోత్పత్తి',
  'ఆంగీరస', 'శ్రీముఖ', 'భావ', 'యువ', 'ధాత',
  'ఈశ్వర', 'బహుధాన్య', 'ప్రమాథి', 'విక్రమ', 'వృష',
  'చిత్రభాను', 'స్వభాను', 'తారణ', 'పార్థివ', 'వ్యయ',
  'సర్వజిత్', 'సర్వధారి', 'విరోధి', 'వికృతి', 'ఖర',
  'నందన', 'విజయ', 'జయ', 'మన్మథ', 'దుర్ముఖి',
  'హేవిళంబి', 'విళంబి', 'వికారి', 'శార్వరి', 'ప్లవ',
  'శుభకృత్', 'శోభకృత్', 'క్రోధి', 'విశ్వావసు', 'పరాభవ',
  'ప్లవంగ', 'కీలక', 'సౌమ్య', 'సాధారణ', 'విరోధికృత్',
  'పరిధావి', 'ప్రమాదీచ', 'ఆనంద', 'రాక్షస', 'నల',
  'పింగళ', 'కాళయుక్తి', 'సిద్ధార్థి', 'రౌద్రి', 'దుర్మతి',
  'దుందుభి', 'రుధిరోద్గారి', 'రక్తాక్షి', 'క్రోధన', 'అక్షయ',
];

// ─── Rashi arrays ───────────────────────────────────────
export const RASHIS_TELUGU = [
  'మేషం', 'వృషభం', 'మిథునం', 'కర్కాటకం', 'సింహం', 'కన్య',
  'తుల', 'వృశ్చికం', 'ధనుస్సు', 'మకరం', 'కుంభం', 'మీనం',
];

export const RASHIS_EN = [
  'Aries (Mesha)', 'Taurus (Vrishabha)', 'Gemini (Mithuna)',
  'Cancer (Karkataka)', 'Leo (Simha)', 'Virgo (Kanya)',
  'Libra (Tula)', 'Scorpio (Vrischika)', 'Sagittarius (Dhanus)',
  'Capricorn (Makara)', 'Aquarius (Kumbha)', 'Pisces (Meena)',
];
