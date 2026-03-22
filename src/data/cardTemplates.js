/**
 * Card templates — background images with text zone definitions.
 * Each template is a pre-designed background where we overlay text.
 *
 * Text zones define where greeting/panchangam text gets drawn.
 * All x/y values are fractions (0-1) of canvas dimensions.
 */

const B = '/assets/greetings/backgrounds';

// ─── DAILY PANCHANGAM CARD TEMPLATES ──────────────────────
// These are used for daily panchangam sharing.
// They have large empty areas where we overlay panchangam data.

export const DAILY_TEMPLATES = [
  {
    id: 'daily-ganapathi',
    name: 'గణపతి',
    nameEn: 'Ganapathi',
    image: `${B}/daily-ganapathi.png`,
    // Ganapathi at bottom, ornate borders on sides. Text goes in upper-center area.
    textColor: '#3a150a',
    textColorSecondary: '#6b2d15',
    accentColor: '#C49B2A',
    headerY: 0.08,      // where the Telugu date header starts
    contentY: 0.15,     // where panchangam rows start
    contentEndY: 0.58,  // where content area ends (Ganapathi starts below)
    maxWidth: 0.7,      // text area width (avoid side borders)
  },
  {
    id: 'daily-temple',
    name: 'ఆలయం',
    nameEn: 'Temple',
    image: `${B}/daily-temple.jpg`,
    // Temples at bottom. Large open cream area above.
    textColor: '#3a150a',
    textColorSecondary: '#6b2d15',
    accentColor: '#8B4513',
    headerY: 0.06,
    contentY: 0.13,
    contentEndY: 0.62,
    maxWidth: 0.85,
  },
  {
    id: 'daily-floral',
    name: 'పూలు',
    nameEn: 'Floral',
    image: `${B}/daily-floral.jpg`,
    // Plants on left, flowers bottom-right. Gold border. Open center-right area.
    textColor: '#3a150a',
    textColorSecondary: '#6b2d15',
    accentColor: '#C49B2A',
    headerY: 0.08,
    contentY: 0.15,
    contentEndY: 0.65,
    maxWidth: 0.75,
  },
  {
    id: 'daily-hanuman',
    name: 'హనుమాన్',
    nameEn: 'Hanuman',
    image: `${B}/daily-hanuman.jpg`,
    // Hanuman at top with mandala, marigold borders on sides. Text goes below.
    textColor: '#3a150a',
    textColorSecondary: '#6b2d15',
    accentColor: '#FF6B00',
    headerY: 0.38,
    contentY: 0.45,
    contentEndY: 0.92,
    maxWidth: 0.7,
  },
  {
    id: 'daily-shiva',
    name: 'శివ',
    nameEn: 'Shiva',
    image: `${B}/shiva-bg.jpg`,
    // Shiva lingam at bottom center, garlands at top. Open middle area.
    textColor: '#1a3a1a',
    textColorSecondary: '#2d5a2d',
    accentColor: '#FF6B00',
    headerY: 0.08,
    contentY: 0.15,
    contentEndY: 0.55,
    maxWidth: 0.8,
  },
  {
    id: 'daily-venkateswara',
    name: 'వేంకటేశ్వర',
    nameEn: 'Venkateswara',
    image: `${B}/daily-venkateswara.jpg`,
    // Venkateswara at top with lotus/flowers. Large open yellow area below.
    textColor: '#3a150a',
    textColorSecondary: '#6b2d15',
    accentColor: '#800020',
    headerY: 0.42,
    contentY: 0.50,
    contentEndY: 0.92,
    maxWidth: 0.8,
  },
];

// ─── FESTIVAL GREETING CARD TEMPLATES ─────────────────────
// These are used for festival-specific greetings.
// They have pre-designed festive backgrounds where we overlay Telugu text.

export const FESTIVAL_TEMPLATES = {
  'sri rama navami': [
    {
      id: 'rama-navami-1',
      name: 'ఆలయ దర్శనం',
      nameEn: 'Temple View',
      image: `${B}/rama-navami-card-2.jpg`,
      // Rama with bow facing temple at bottom. Text area at top.
      textColor: '#3a150a',
      textColorSecondary: '#6b2d15',
      accentColor: '#FF6B00',
      greetingY: 0.08,
      secondaryY: 0.15,
      quoteY: 0.22,
      nameY: 0.88,
      maxWidth: 0.8,
    },
    {
      id: 'rama-navami-2',
      name: 'శ్రీరాముడు',
      nameEn: 'Sri Rama',
      image: `${B}/rama-navami-card-3.jpg`,
      // Rama face with garlands. Text below center.
      textColor: '#333333',
      textColorSecondary: '#666666',
      accentColor: '#C41E3A',
      greetingY: 0.58,
      secondaryY: 0.65,
      quoteY: 0.72,
      nameY: 0.88,
      maxWidth: 0.8,
    },
    {
      id: 'rama-navami-3',
      name: 'పట్టాభిషేకం',
      nameEn: 'Pattabhishekam',
      image: `${B}/rama-navami-card.jpg`,
      // Rama Sita in circle, mandalas at corners. Text below center.
      textColor: '#333333',
      textColorSecondary: '#666666',
      accentColor: '#2E7D32',
      greetingY: 0.62,
      secondaryY: 0.70,
      quoteY: 0.78,
      nameY: 0.90,
      maxWidth: 0.8,
    },
  ],

  // Generic festival templates (used for festivals without specific backgrounds)
  '_default': [
    {
      id: 'generic-ganapathi',
      name: 'గణపతి',
      nameEn: 'Ganapathi',
      image: `${B}/daily-ganapathi.png`,
      textColor: '#3a150a',
      textColorSecondary: '#6b2d15',
      accentColor: '#C49B2A',
      greetingY: 0.12,
      secondaryY: 0.20,
      quoteY: 0.28,
      nameY: 0.50,
      maxWidth: 0.7,
    },
    {
      id: 'generic-temple',
      name: 'ఆలయం',
      nameEn: 'Temple',
      image: `${B}/temple-gopuram.jpg`,
      textColor: '#3a150a',
      textColorSecondary: '#6b2d15',
      accentColor: '#8B4513',
      greetingY: 0.08,
      secondaryY: 0.16,
      quoteY: 0.24,
      nameY: 0.50,
      maxWidth: 0.85,
    },
    {
      id: 'generic-floral',
      name: 'పూల హారం',
      nameEn: 'Floral',
      image: `${B}/paper-cream.jpg`,
      textColor: '#3a150a',
      textColorSecondary: '#6b2d15',
      accentColor: '#C49B2A',
      greetingY: 0.15,
      secondaryY: 0.25,
      quoteY: 0.35,
      nameY: 0.70,
      maxWidth: 0.8,
    },
  ],
};

/**
 * Get festival templates for a given festival.
 * Falls back to default templates if no festival-specific ones exist.
 */
export function getFestivalTemplates(festivalEnglish) {
  if (!festivalEnglish) return FESTIVAL_TEMPLATES['_default'];
  const key = festivalEnglish.toLowerCase();
  return FESTIVAL_TEMPLATES[key] || FESTIVAL_TEMPLATES['_default'];
}
