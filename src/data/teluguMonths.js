// Telugu month boundaries for Parabhava Nama Samvatsaram (2026-2027)
// Using Amanta system (month ends on Amavasya)

export const TELUGU_MONTHS = [
  { telugu: 'చైత్రం', english: 'Chaitra', start: '2026-03-20', end: '2026-04-17' },
  { telugu: 'వైశాఖం', english: 'Vaisakha', start: '2026-04-18', end: '2026-05-16' },
  { telugu: 'జ్యేష్ఠం', english: 'Jyeshtha', start: '2026-05-17', end: '2026-06-15' },
  { telugu: 'అధిక జ్యేష్ఠం', english: 'Adhika Jyeshtha', start: '2026-06-16', end: '2026-07-14', isAdhika: true },
  { telugu: 'ఆషాఢం', english: 'Ashada', start: '2026-07-15', end: '2026-08-12' },
  { telugu: 'శ్రావణం', english: 'Shravana', start: '2026-08-13', end: '2026-09-11' },
  { telugu: 'భాద్రపదం', english: 'Bhadrapada', start: '2026-09-12', end: '2026-10-10' },
  { telugu: 'ఆశ్వయుజం', english: 'Ashvayuja', start: '2026-10-11', end: '2026-11-09' },
  { telugu: 'కార్తీకం', english: 'Kartika', start: '2026-11-10', end: '2026-12-09' },
  { telugu: 'మార్గశిరం', english: 'Margashira', start: '2026-12-10', end: '2027-01-08' },
  { telugu: 'పుష్యం', english: 'Pushya', start: '2027-01-09', end: '2027-02-07' },
  { telugu: 'మాఘం', english: 'Magha', start: '2027-02-08', end: '2027-03-08' },
  { telugu: 'ఫాల్గుణం', english: 'Phalguna', start: '2027-03-09', end: '2027-04-06' },
];

// For dates before Chaitra (Mar 19 is Ugadi but still in prior month technically)
// We'll treat Mar 19 as the first day of the calendar
export const PRE_CHAITRA = { telugu: 'ఫాల్గుణం', english: 'Phalguna' };

export function getTeluguMonth(dateStr) {
  // dateStr: 'YYYY-MM-DD'
  for (const month of TELUGU_MONTHS) {
    if (dateStr >= month.start && dateStr <= month.end) {
      return { telugu: month.telugu, english: month.english };
    }
  }
  // Before Chaitra starts (Mar 19)
  if (dateStr < '2026-03-20') {
    return PRE_CHAITRA;
  }
  // After Phalguna ends (Apr 7 is next Ugadi)
  if (dateStr >= '2027-04-07') {
    return { telugu: 'చైత్రం', english: 'Chaitra' };
  }
  return PRE_CHAITRA;
}
