/**
 * Festival greeting configs — defines deity sets, color palettes, quotes,
 * and template assignments for each festival's greeting cards.
 *
 * This is separate from festivals.js (which has dates/names).
 * Keyed by festival english name (lowercase) to match festivals.js lookups.
 */

export const FESTIVAL_GREETINGS = {
  'ugadi': {
    id: 'ugadi',
    greetingText: 'ఉగాది శుభాకాంక్షలు',
    secondaryText: 'నూతన సంవత్సర శుభాకాంక్షలు',
    deitySet: ['generic-om', 'vishnu'],
    palettes: [
      { id: 'spring-green', name: 'Spring Green', bg: '#2E8B57', bgSecondary: '#FFD700', accent: '#FF6B00', text: '#FFFFFF', textSecondary: '#F0FFF0' },
      { id: 'mango-gold', name: 'Mango Gold', bg: '#FFB347', bgSecondary: '#FF8C00', accent: '#006400', text: '#333333', textSecondary: '#006400' },
      { id: 'temple-cream', name: 'Temple Cream', bg: '#FFF8F0', bgSecondary: '#F5E6D0', accent: '#8B4513', text: '#333333', textSecondary: '#8B4513' },
    ],
    quotes: [
      { telugu: 'కొత్త సంవత్సరం కొత్త ఆశలు', meaning: 'New year, new hopes' },
      { telugu: 'షడ్రుచుల కలయిక ఉగాది పచ్చడి', meaning: 'Ugadi pachadi, a blend of six tastes' },
      { telugu: 'జీవితంలో మధురానుభూతులే నిండాలి', meaning: 'May life be filled with sweet experiences' },
    ],
    templates: ['divine-radiance', 'scenic-silhouette', 'minimal-modern', 'floral-warm'],
  },

  'sri rama navami': {
    id: 'rama-navami',
    greetingText: 'శ్రీరామ నవమి శుభాకాంక్షలు',
    secondaryText: 'జై శ్రీ రాం',
    deitySet: ['rama-traditional', 'rama-silhouette', 'rama-parivar'],
    palettes: [
      { id: 'saffron-gold', name: 'Saffron Gold', bg: '#FF6B00', bgSecondary: '#FFD700', accent: '#8B0000', text: '#FFFFFF', textSecondary: '#FFF8DC' },
      { id: 'sunrise', name: 'Sunrise', bg: '#FF9933', bgSecondary: '#1A0A2E', accent: '#FFD700', text: '#FFFFFF', textSecondary: '#FFE4B5' },
      { id: 'temple-cream', name: 'Temple Cream', bg: '#FFF8F0', bgSecondary: '#F5E6D0', accent: '#8B4513', text: '#333333', textSecondary: '#8B4513' },
      { id: 'royal-maroon', name: 'Royal Maroon', bg: '#800020', bgSecondary: '#4A0012', accent: '#FFD700', text: '#FFFFFF', textSecondary: '#FFF8DC' },
      { id: 'navy-gold', name: 'Navy Gold', bg: '#0D1B3E', bgSecondary: '#1A2E5A', accent: '#FFD700', text: '#FFD700', textSecondary: '#FFFFFF' },
    ],
    quotes: [
      { telugu: 'రామో విగ్రహవాన్ ధర్మః', meaning: 'Rama is dharma personified' },
      { telugu: 'శ్రీరామ రక్ష ఉంటే భయమెందుకు', meaning: 'With Rama\'s protection, why fear' },
      { telugu: 'రామ నామం సర్వ పాప హరం', meaning: 'The name of Rama destroys all sins' },
      { telugu: 'మర్యాదా పురుషోత్తమ శ్రీరాముడు', meaning: 'Maryada Purushottama Sri Rama' },
    ],
    templates: ['divine-radiance', 'scenic-silhouette', 'minimal-modern', 'ornate-frame', 'bold-typographic', 'floral-warm'],
  },

  'vinayaka chavithi': {
    id: 'vinayaka-chavithi',
    greetingText: 'వినాయక చవితి శుభాకాంక్షలు',
    secondaryText: 'గణపతి బప్పా మోరియా',
    deitySet: ['ganesh'],
    palettes: [
      { id: 'vermillion-gold', name: 'Vermillion Gold', bg: '#E34234', bgSecondary: '#FFD700', accent: '#FF6B00', text: '#FFFFFF', textSecondary: '#FFF8DC' },
      { id: 'green-festive', name: 'Green Festive', bg: '#006400', bgSecondary: '#228B22', accent: '#FFD700', text: '#FFFFFF', textSecondary: '#F0FFF0' },
      { id: 'cream-gold', name: 'Cream Gold', bg: '#FFF8F0', bgSecondary: '#FFF0D0', accent: '#E34234', text: '#333333', textSecondary: '#8B4513' },
    ],
    quotes: [
      { telugu: 'వక్రతుండ మహాకాయ సూర్యకోటి సమప్రభ', meaning: 'O Lord with curved trunk and mighty body' },
      { telugu: 'విఘ్నేశ్వరుడు మన విఘ్నాలను తొలగించుగాక', meaning: 'May Vighneswara remove all obstacles' },
    ],
    templates: ['divine-radiance', 'ornate-frame', 'floral-warm', 'bold-typographic'],
  },

  'deepavali': {
    id: 'deepavali',
    greetingText: 'దీపావళి శుభాకాంక్షలు',
    secondaryText: 'దీపాల వెలుగుల పండుగ',
    deitySet: ['lakshmi', 'ganesh'],
    palettes: [
      { id: 'deep-blue-gold', name: 'Deep Blue Gold', bg: '#0D1B3E', bgSecondary: '#1A0A2E', accent: '#FFD700', text: '#FFD700', textSecondary: '#FFFFFF' },
      { id: 'royal-purple', name: 'Royal Purple', bg: '#2D0A4E', bgSecondary: '#4A1670', accent: '#FFD700', text: '#FFFFFF', textSecondary: '#FFE4B5' },
      { id: 'warm-saffron', name: 'Warm Saffron', bg: '#FF6B00', bgSecondary: '#FF9933', accent: '#FFFFFF', text: '#FFFFFF', textSecondary: '#FFF8DC' },
    ],
    quotes: [
      { telugu: 'తమసో మా జ్యోతిర్గమయ', meaning: 'Lead me from darkness to light' },
      { telugu: 'దీపం జ్ఞాన స్వరూపం', meaning: 'The lamp is the form of knowledge' },
    ],
    templates: ['divine-radiance', 'scenic-silhouette', 'bold-typographic', 'ornate-frame'],
  },

  'krishna janmashtami': {
    id: 'krishna-janmashtami',
    greetingText: 'కృష్ణ జన్మాష్టమి శుభాకాంక్షలు',
    secondaryText: 'హరే కృష్ణ',
    deitySet: ['vishnu'],
    palettes: [
      { id: 'midnight-blue', name: 'Midnight Blue', bg: '#0A1628', bgSecondary: '#1A2E5A', accent: '#FFD700', text: '#FFFFFF', textSecondary: '#87CEEB' },
      { id: 'peacock-green', name: 'Peacock Green', bg: '#004D40', bgSecondary: '#00695C', accent: '#FFD700', text: '#FFFFFF', textSecondary: '#E0F2F1' },
    ],
    quotes: [
      { telugu: 'యదా యదా హి ధర్మస్య గ్లానిర్భవతి భారత', meaning: 'Whenever dharma declines, O Bharata' },
      { telugu: 'కృష్ణం వందే జగద్గురుం', meaning: 'I bow to Krishna, the world teacher' },
    ],
    templates: ['divine-radiance', 'scenic-silhouette', 'minimal-modern', 'ornate-frame'],
  },

  'maha shivaratri': {
    id: 'maha-shivaratri',
    greetingText: 'మహా శివరాత్రి శుభాకాంక్షలు',
    secondaryText: 'ఓం నమః శివాయ',
    deitySet: ['shiva'],
    palettes: [
      { id: 'shiva-blue', name: 'Shiva Blue', bg: '#1A237E', bgSecondary: '#0D1B3E', accent: '#E0E0E0', text: '#FFFFFF', textSecondary: '#B0BEC5' },
      { id: 'rudra-maroon', name: 'Rudra Maroon', bg: '#4A0012', bgSecondary: '#800020', accent: '#FFD700', text: '#FFFFFF', textSecondary: '#FFE4B5' },
    ],
    quotes: [
      { telugu: 'ఓం నమః శివాయ', meaning: 'Om Namah Shivaya' },
      { telugu: 'శివమ్ శంకరం శంభుం', meaning: 'Shiva, Shankara, Shambhu' },
    ],
    templates: ['divine-radiance', 'minimal-modern', 'bold-typographic', 'scenic-silhouette'],
  },

  'makara sankranti': {
    id: 'makara-sankranti',
    greetingText: 'సంక్రాంతి శుభాకాంక్షలు',
    secondaryText: 'సంక్రాంతి పండుగ',
    deitySet: ['generic-om'],
    palettes: [
      { id: 'harvest-gold', name: 'Harvest Gold', bg: '#F5A623', bgSecondary: '#FF8C00', accent: '#006400', text: '#333333', textSecondary: '#006400' },
      { id: 'sky-blue', name: 'Sky Blue', bg: '#87CEEB', bgSecondary: '#4682B4', accent: '#FFD700', text: '#1A237E', textSecondary: '#FFFFFF' },
    ],
    quotes: [
      { telugu: 'పొంగలో పొంగల్', meaning: 'Pongal celebrations' },
      { telugu: 'సూర్యుడు ఉత్తరాయణంలో ప్రవేశించిన శుభ సమయం', meaning: 'Auspicious time of Sun entering Uttarayana' },
    ],
    templates: ['floral-warm', 'bold-typographic', 'scenic-silhouette', 'minimal-modern'],
  },

  'vijaya dashami': {
    id: 'vijaya-dashami',
    greetingText: 'విజయదశమి శుభాకాంక్షలు',
    secondaryText: 'దసరా పండుగ',
    deitySet: ['generic-om'],
    palettes: [
      { id: 'victory-saffron', name: 'Victory Saffron', bg: '#FF6B00', bgSecondary: '#FFD700', accent: '#800020', text: '#FFFFFF', textSecondary: '#FFF8DC' },
      { id: 'royal-green', name: 'Royal Green', bg: '#1B5E20', bgSecondary: '#2E7D32', accent: '#FFD700', text: '#FFFFFF', textSecondary: '#E8F5E9' },
    ],
    quotes: [
      { telugu: 'అధర్మంపై ధర్మం విజయం', meaning: 'Victory of dharma over adharma' },
    ],
    templates: ['divine-radiance', 'bold-typographic', 'ornate-frame', 'minimal-modern'],
  },

  'varalakshmi vratam': {
    id: 'varalakshmi-vratam',
    greetingText: 'వరలక్ష్మీ వ్రతం శుభాకాంక్షలు',
    secondaryText: 'శ్రీ మహాలక్ష్మీ దేవి',
    deitySet: ['lakshmi'],
    palettes: [
      { id: 'lotus-pink', name: 'Lotus Pink', bg: '#FFE4E1', bgSecondary: '#FFB6C1', accent: '#C41E3A', text: '#800020', textSecondary: '#C41E3A' },
      { id: 'gold-rich', name: 'Gold Rich', bg: '#FFD700', bgSecondary: '#DAA520', accent: '#800020', text: '#4A0012', textSecondary: '#800020' },
    ],
    quotes: [
      { telugu: 'లక్ష్మీ దేవి కృప మనపై ఉండుగాక', meaning: 'May Lakshmi Devi\'s grace be upon us' },
    ],
    templates: ['divine-radiance', 'floral-warm', 'ornate-frame', 'minimal-modern'],
  },

  'holi': {
    id: 'holi',
    greetingText: 'హోళీ శుభాకాంక్షలు',
    secondaryText: 'రంగుల పండుగ',
    deitySet: ['vishnu'],
    palettes: [
      { id: 'rainbow-burst', name: 'Rainbow Burst', bg: '#FF4081', bgSecondary: '#7C4DFF', accent: '#FFD740', text: '#FFFFFF', textSecondary: '#FFFFFF' },
      { id: 'spring-colors', name: 'Spring Colors', bg: '#00C853', bgSecondary: '#FF6D00', accent: '#2962FF', text: '#FFFFFF', textSecondary: '#FFF8E1' },
    ],
    quotes: [
      { telugu: 'రంగులతో జీవితం రంగరించుదాం', meaning: 'Let\'s color life with colors' },
    ],
    templates: ['bold-typographic', 'scenic-silhouette', 'minimal-modern'],
  },
};

/**
 * Get greeting config for a festival.
 * @param {string} festivalEnglish - English name from festivals.js
 * @returns {object|null}
 */
export function getGreetingConfig(festivalEnglish) {
  if (!festivalEnglish) return null;
  const key = festivalEnglish.toLowerCase();
  return FESTIVAL_GREETINGS[key] || null;
}

/**
 * Default greeting config for festivals without specific configs.
 * Uses generic styling.
 */
export const DEFAULT_GREETING = {
  id: 'generic',
  greetingText: '',  // filled dynamically from festival.telugu
  secondaryText: 'శుభాకాంక్షలు',
  deitySet: ['generic-om'],
  palettes: [
    { id: 'saffron-gold', name: 'Saffron Gold', bg: '#FF6B00', bgSecondary: '#FFD700', accent: '#8B0000', text: '#FFFFFF', textSecondary: '#FFF8DC' },
    { id: 'temple-cream', name: 'Temple Cream', bg: '#FFF8F0', bgSecondary: '#F5E6D0', accent: '#8B4513', text: '#333333', textSecondary: '#8B4513' },
    { id: 'deep-maroon', name: 'Deep Maroon', bg: '#800020', bgSecondary: '#4A0012', accent: '#FFD700', text: '#FFFFFF', textSecondary: '#FFF8DC' },
  ],
  quotes: [],
  templates: ['divine-radiance', 'minimal-modern', 'bold-typographic', 'floral-warm'],
};
