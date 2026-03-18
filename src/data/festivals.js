// Festival data for Parabhava Nama Samvatsaram (2026-2027)
// ★★ = very major, ★ = important

const FESTIVALS = {
  // March 2026
  '2026-03-19': {
    telugu: 'ఉగాది',
    english: 'Ugadi',
    description: 'శ్రీ పరాభవ నామ సంవత్సరారంభం',
    major: true,
    isMuhurtham: false,
  },
  '2026-03-27': {
    telugu: 'శ్రీ రామ నవమి',
    english: 'Sri Rama Navami',
    major: true,
  },

  // April 2026
  '2026-04-02': {
    telugu: 'చైత్ర పూర్ణిమ',
    english: 'Chaitra Purnima',
  },
  '2026-04-17': {
    telugu: 'అమావాస్య',
    english: 'Amavasya',
  },
  '2026-04-20': {
    telugu: 'అక్షయ తృతీయ',
    english: 'Akshaya Tritiya',
    major: true,
    isMuhurtham: true,
  },

  // May 2026
  '2026-05-01': {
    telugu: 'వైశాఖ పూర్ణిమ / బుద్ధ పూర్ణిమ',
    english: 'Buddha Purnima',
    major: true,
  },

  // July 2026
  '2026-07-21': {
    telugu: 'బోనాలు ప్రారంభం',
    english: 'Bonalu begins',
    major: true,
  },

  // August 2026
  '2026-08-01': {
    telugu: 'శ్రావణ మంగళవారం',
    english: 'Sravana Mangalavaram',
  },
  '2026-08-08': {
    telugu: 'శ్రావణ మంగళవారం',
    english: 'Sravana Mangalavaram',
  },
  '2026-08-11': {
    telugu: 'వరలక్ష్మీ వ్రతం',
    english: 'Varalakshmi Vratam',
    major: true,
  },
  '2026-08-15': {
    telugu: 'స్వాతంత్ర్య దినోత్సవం',
    english: 'Independence Day',
    major: true,
  },
  '2026-08-21': {
    telugu: 'రాఖీ పూర్ణిమ',
    english: 'Rakhi Purnima',
  },

  // September 2026
  '2026-09-04': {
    telugu: 'శ్రీ కృష్ణ జన్మాష్టమి',
    english: 'Krishna Janmashtami',
    major: true,
  },
  '2026-09-14': {
    telugu: 'వినాయక చవితి',
    english: 'Vinayaka Chavithi',
    major: true,
  },

  // October 2026
  '2026-10-02': {
    telugu: 'గాంధీ జయంతి',
    english: 'Gandhi Jayanti',
  },
  '2026-10-10': {
    telugu: 'మహాలయ అమావాస్య',
    english: 'Mahalaya Amavasya',
  },
  '2026-10-11': {
    telugu: 'దసరా నవరాత్రులు ప్రారంభం',
    english: 'Dasara Navaratri begins',
    major: true,
  },
  '2026-10-12': { telugu: 'నవరాత్రి', english: 'Navaratri Day 2' },
  '2026-10-13': { telugu: 'నవరాత్రి', english: 'Navaratri Day 3' },
  '2026-10-14': { telugu: 'నవరాత్రి', english: 'Navaratri Day 4' },
  '2026-10-15': { telugu: 'నవరాత్రి', english: 'Navaratri Day 5' },
  '2026-10-16': { telugu: 'నవరాత్రి', english: 'Navaratri Day 6' },
  '2026-10-17': { telugu: 'నవరాత్రి', english: 'Navaratri Day 7' },
  '2026-10-18': {
    telugu: 'సద్దుల బతుకమ్మ / దుర్గాష్టమి',
    english: 'Saddula Bathukamma',
    major: true,
  },
  '2026-10-19': { telugu: 'మహా నవమి', english: 'Maha Navami', major: true },
  '2026-10-20': {
    telugu: 'విజయదశమి',
    english: 'Vijaya Dashami',
    major: true,
  },

  // November 2026
  '2026-11-08': {
    telugu: 'దీపావళి',
    english: 'Deepavali',
    major: true,
  },
  '2026-11-13': {
    telugu: 'నాగుల చవితి',
    english: 'Nagula Chavithi',
  },
  '2026-11-24': {
    telugu: 'కార్తీక పూర్ణిమ',
    english: 'Kartika Purnima',
    major: true,
  },

  // December 2026
  '2026-12-25': {
    telugu: 'క్రిస్మస్',
    english: 'Christmas',
  },
  '2026-12-30': {
    telugu: 'ధనుర్మాసం ప్రారంభం',
    english: 'Dhanurmasam begins',
  },

  // January 2027
  '2027-01-14': {
    telugu: 'భోగి',
    english: 'Bhogi',
    major: true,
  },
  '2027-01-15': {
    telugu: 'మకర సంక్రాంతి',
    english: 'Makara Sankranti',
    major: true,
  },
  '2027-01-16': {
    telugu: 'కనుమ',
    english: 'Kanuma',
    major: true,
  },
  '2027-01-23': {
    telugu: 'వసంత పంచమి',
    english: 'Vasant Panchami',
  },
  '2027-01-25': {
    telugu: 'రథ సప్తమి',
    english: 'Ratha Saptami',
    major: true,
  },
  '2027-01-26': {
    telugu: 'గణతంత్ర దినోత్సవం',
    english: 'Republic Day',
    major: true,
  },
  '2027-01-29': {
    telugu: 'భీష్మ ఏకాదశి',
    english: 'Bhishma Ekadashi',
  },

  // February 2027
  '2027-02-01': {
    telugu: 'మాఘ పూర్ణిమ',
    english: 'Magha Purnima',
  },
  '2027-02-15': {
    telugu: 'మహా శివరాత్రి',
    english: 'Maha Shivaratri',
    major: true,
  },

  // March 2027
  '2027-03-03': {
    telugu: 'హోళి',
    english: 'Holi',
    major: true,
  },
  '2027-03-19': {
    telugu: 'ఫాల్గుణ అమావాస్య',
    english: 'Phalguna Amavasya',
  },

  // April 2027
  '2027-04-07': {
    telugu: 'ఉగాది',
    english: 'Ugadi',
    description: 'నూతన సంవత్సరారంభం',
    major: true,
  },
};

export function getFestival(dateStr) {
  return FESTIVALS[dateStr] || null;
}

export default FESTIVALS;
