// Festival wish templates — curated Telugu + English messages
// Each template has a theme name and the full message text
// Festival-specific templates keyed by festival English name

const UGADI_TEMPLATES = [
  {
    theme: 'సంప్రదాయం',
    themeEn: 'Traditional',
    message: `షడ్రుచుల సమ్మేళనంతో సాగే ఈ ఉగాది,
మీ జీవితంలో సరికొత్త వెలుగులు నింపాలని,
ఆయురారోగ్య ఐశ్వర్యాలతో మీరు వర్ధిల్లాలని కోరుకుంటూ...
మీకు మరియు మీ కుటుంబ సభ్యులకు ఉగాది శుభాకాంక్షలు!

May this year be as balanced and beautiful as the Ugadi Pachadi.`,
  },
  {
    theme: 'విజయం',
    themeEn: 'Success',
    message: `కొత్త ఆశలు, కొత్త ఆశయాలతో ఈ నూతన సంవత్సరం
మీ ఇంట్లో సిరిసంపదలను, విజయాలను కురిపించాలని ఆకాంక్షిస్తున్నాను.
మీ ప్రతి అడుగు విజయానికి నాంది కావాలి.
అందరికీ శ్రీ పరాభవ నామ సంవత్సర ఉగాది శుభాకాంక్షలు!

Wishing you a year of immense growth and breakthrough success.`,
  },
  {
    theme: 'ప్రశాంతత',
    themeEn: 'Inner Peace',
    message: `వేపపూతలోని చేదు, మామిడి పిందెలోని వొగరు
జీవితంలోని కష్టసుఖాలను సమానంగా స్వీకరించే ధైర్యాన్ని మీకు ఇవ్వాలి.
ఈ ఉగాది మీ మనసుకి ప్రశాంతతను, ఆనందాన్ని చేకూర్చాలి.
ఉగాది శుభాకాంక్షలు!

May you find the strength to embrace all of life's flavors with a smile.`,
  },
  {
    theme: 'కవిత్వం',
    themeEn: 'Poetic',
    message: `కోయిలమ్మ పాటలు, మామిడి ఆకుల తోరణాలు
వసంత కాలం తెచ్చే కొత్త ఉత్సాహం మీ సొంతం కావాలి.
ఈ పండుగ మీ ఇంట సంతోషాల వెల్లువను తీసుకురావాలి.
శ్రీ ఉగాది శుభాకాంక్షలు!

Let the melody of the cuckoo and the freshness of spring brighten your days.`,
  },
  {
    theme: 'స్నేహం',
    themeEn: 'Friendship',
    message: `జీవితం అంటే కేవలం తీపి మాత్రమే కాదు, అన్ని రుచుల కలయిక.
అందుకే ఈ ఉగాది పచ్చడిలాగే మన స్నేహం కూడా ఎప్పటికీ బ్యాలెన్స్‌డ్‌గా ఉండాలి.
కొత్త ఏడాదిలో మనం మరిన్ని మెమొరీస్ క్రియేట్ చేద్దాం.
హ్యాపీ ఉగాది మై డియర్ ఫ్రెండ్!

Cheers to another year of friendship, fun, and sharing life's ups and downs.`,
  },
  {
    theme: 'కుటుంబం',
    themeEn: 'Family',
    message: `మామిడి తోరణాల కింద, పచ్చడి రుచుల మధ్య
మన కుటుంబం ఎప్పుడూ ఇలాగే నవ్వుతూ, కలిసి ఉండాలని ఆశిస్తున్నాను.
పెద్దల ఆశీస్సులు, దేవుని కృప మనపై ఎల్లప్పుడూ ఉండాలి.
కుటుంబ సభ్యులందరికీ ఉగాది శుభాకాంక్షలు!

May our family bond grow stronger and sweeter with every passing year.`,
  },
  {
    theme: 'మోడ్రన్',
    themeEn: 'Modern',
    message: `ఈ ఉగాది మీ లైఫ్‌లో ఒక కొత్త బిగినింగ్ కావాలని,
మీరు అనుకున్న పనులన్నీ సజావుగా సాగిపోవాలని కోరుకుంటున్నాను.
నెగెటివిటీని వదిలేసి, పాజిటివ్ వైబ్స్‌తో ముందుకు సాగుదాం.
శ్రీ పరాభవ నామ సంవత్సర ఉగాది శుభాకాంక్షలు!

Wishing you a fresh start filled with positive vibes and new opportunities.`,
  },
  {
    theme: 'సంపద',
    themeEn: 'Prosperity',
    message: `లక్ష్మీదేవి కటాక్షం మీపై ఉండి, ధనధాన్యాలకు లోటు లేకుండా
ఈ ఏడాది అంతా సుఖసంతోషాలతో గడిచిపోవాలని మనస్ఫూర్తిగా కోరుకుంటున్నాను.
కొత్త పనులు మొదలుపెట్టడానికి ఇదే సరైన సమయం.
మీకు నా ఉగాది శుభాకాంక్షలు!

May Goddess Lakshmi bless your home with eternal prosperity and joy.`,
  },
  {
    theme: 'తీయదనం',
    themeEn: 'Sweet',
    message: `బెల్లం తీపిలా మీ మాటలు, మామిడి పులుపులా మీ చిలిపి చేష్టలు
ఈ ఏడాది అంతా మనల్ని అలరించాలని కోరుకుంటున్నాను.
చిన్న చిన్న ఆనందాలే కదా జీవితానికి అందం!
అందరికీ ఉగాది శుభాకాంక్షలు!

May your life be as sweet as jaggery and as tangy as a fresh mango.`,
  },
  {
    theme: 'ఆరోగ్యం',
    themeEn: 'Health',
    message: `ఈ నూతన సంవత్సరం మీలో కొత్త శక్తిని నింపి,
సంపూర్ణ ఆరోగ్యంతో, ఉత్సాహంగా ఉండాలని కోరుకుంటున్నాను.
ఆరోగ్యమే మహాభాగ్యం అని మరిచిపోకండి.
మిత్రులందరికీ ఉగాది శుభాకాంక్షలు!

Wishing you a year of vibrant health and boundless energy. Happy Ugadi!`,
  },
];

const RAMA_NAVAMI_TEMPLATES = [
  {
    theme: 'భక్తి',
    themeEn: 'Devotion',
    message: `శ్రీరామచంద్రుని దివ్య జన్మదినం సందర్భంగా,
ఆయన ఆశీర్వాదాలు మీపై సదా వర్షించాలని,
ధర్మ మార్గంలో మీరు నడవాలని కోరుకుంటున్నాను.
శ్రీ రామ నవమి శుభాకాంక్షలు!

May Lord Rama's divine blessings guide you on the path of righteousness.`,
  },
  {
    theme: 'ధర్మం',
    themeEn: 'Dharma',
    message: `రామో విగ్రహవాన్ ధర్మః — ధర్మమే రాముడు, రాముడే ధర్మం.
ఈ శుభదినాన శ్రీరాముడి ధర్మబోధన మన జీవితాల్లో వెలుగులు నింపాలి.
సత్యం, ధర్మం, ప్రేమల మార్గంలో నడుద్దాం.
శ్రీ సీతారామ కల్యాణం శుభాకాంక్షలు!

Dharma is the essence of Rama — may His teachings illuminate our lives.`,
  },
  {
    theme: 'పట్టాభిషేకం',
    themeEn: 'Coronation',
    message: `అయోధ్యాపతి శ్రీరామచంద్రుని పట్టాభిషేకం నాటి ఆనందం
మీ ఇంట కూడా వెల్లివిరియాలని ఆశిస్తున్నాను.
రామరాజ్యంలో వలె మీ జీవితం సుఖసంతోషాలతో నిండాలి.
శ్రీ రామ నవమి శుభాకాంక్షలు!

Like the joy of Rama's coronation in Ayodhya, may happiness reign in your home.`,
  },
  {
    theme: 'సీతారామ',
    themeEn: 'Sita-Rama',
    message: `సీతారాముల అనురాగం, అన్యోన్యత
మన దాంపత్య జీవితాలకు ఆదర్శం కావాలి.
ఆ దివ్య దంపతుల ఆశీస్సులు మనందరిపై ఉండాలి.
జై శ్రీ రామ! శ్రీ రామ నవమి శుభాకాంక్షలు!

May the divine love of Sita and Rama bless every home with harmony.`,
  },
  {
    theme: 'హనుమంతుడు',
    themeEn: 'Hanuman',
    message: `హనుమంతుడి భక్తి, విశ్వాసం, సేవాభావం
మనకు ఎల్లప్పుడూ స్ఫూర్తి కావాలి.
రామభక్తి ఉన్న చోట భయమే లేదు!
జై శ్రీ రామ! జై హనుమాన్! శ్రీ రామ నవమి శుభాకాంక్షలు!

Like Hanuman's unwavering devotion, may faith guide our every step. Jai Sri Ram!`,
  },
  {
    theme: 'కుటుంబం',
    themeEn: 'Family',
    message: `తల్లిదండ్రుల పట్ల రాముడి భక్తి, సోదరుల పట్ల ప్రేమ
ఆదర్శ కుటుంబానికి మార్గదర్శనం.
మీ కుటుంబం శ్రీరాముడి కుటుంబంలా అనుబంధంతో వెలగాలి.
మీ అందరికీ శ్రీ రామ నవమి శుభాకాంక్షలు!

Rama's love for family inspires us all. May your family be blessed with unity and joy.`,
  },
  {
    theme: 'విజయం',
    themeEn: 'Victory',
    message: `అసత్యంపై సత్యం, అధర్మంపై ధర్మం విజయం సాధించిన రోజు ఇది.
శ్రీరాముడి ధైర్యం, శౌర్యం మీకు ఎల్లప్పుడూ తోడుండాలి.
మీ జీవితంలో ప్రతి సవాలుపై విజయం సాధించాలని కోరుకుంటున్నాను.
శ్రీ రామ నవమి శుభాకాంక్షలు!

May Rama's courage inspire you to triumph over every challenge in life.`,
  },
  {
    theme: 'రామరాజ్యం',
    themeEn: 'Ram Rajya',
    message: `రామరాజ్యంలో ఉన్నట్లు ప్రతి ఇంట్లో సుఖశాంతులు నెలకొనాలి.
న్యాయం, సమానత్వం, ప్రేమతో నిండిన సమాజం మనది కావాలి.
శ్రీరాముడి పాలన మనకు ఆదర్శం.
శ్రీ రామ నవమి శుభాకాంక్షలు!

May Ram Rajya's ideals of justice and peace bless our homes and society.`,
  },
  {
    theme: 'మోడ్రన్',
    themeEn: 'Modern',
    message: `రాముడి స్టోరీ నేటికీ రిలేట్ అవుతుంది — ఎంత కష్టమైనా ధర్మాన్ని వదలకపోవడం.
ఈ రామనవమి మీలో కొత్త స్ట్రెంగ్త్‌ని, పాజిటివిటీని నింపాలి.
లెట్స్ బి ద బెస్ట్ వర్షన్ ఆఫ్ అవర్‌సెల్వ్స్!
జై శ్రీ రామ! 🙏

Rama's story is timeless — stand for what's right, no matter what. Happy Rama Navami!`,
  },
  {
    theme: 'శాంతి',
    themeEn: 'Peace',
    message: `శ్రీరాముడి కరుణ, సహనం, క్షమాగుణం
ఈ ప్రపంచానికి ఎంతో అవసరం.
ఈ పవిత్ర దినాన మన హృదయాల్లో శాంతి నెలకొనాలి.
సర్వే జనాః సుఖినో భవంతు.
శ్రీ రామ నవమి శుభాకాంక్షలు!

May Lord Rama's compassion fill our hearts with peace and goodwill.`,
  },
];

// Map of festival names to their specific templates
const FESTIVAL_TEMPLATES = {
  'Rama Navami': RAMA_NAVAMI_TEMPLATES,
  'Sri Rama Navami': RAMA_NAVAMI_TEMPLATES,
  'Ugadi': UGADI_TEMPLATES,
};

// Default templates (generic, works for any festival)
const DEFAULT_TEMPLATES = [
  {
    theme: 'సంప్రదాయం',
    themeEn: 'Traditional',
    message: `ఈ పవిత్ర పండుగ సందర్భంగా,
మీకు మరియు మీ కుటుంబ సభ్యులకు శుభాకాంక్షలు!
ఆయురారోగ్య ఐశ్వర్యాలతో మీరు వర్ధిల్లాలని కోరుకుంటున్నాను.

Wishing you and your family a blessed and joyful celebration.`,
  },
  {
    theme: 'భక్తి',
    themeEn: 'Devotion',
    message: `దైవ కృప మీపై సదా ఉండాలని,
మీ జీవితంలో సుఖసంతోషాలు వెల్లివిరియాలని
మనస్ఫూర్తిగా కోరుకుంటున్నాను.
ఈ పండుగ మీకు మంగళకరమవ్వాలి!

May divine grace shower upon you and fill your life with happiness.`,
  },
  {
    theme: 'కుటుంబం',
    themeEn: 'Family',
    message: `ఈ పండుగ వేళ కుటుంబమంతా కలిసి,
సంతోషంగా, ఆనందంగా గడపాలని ఆశిస్తున్నాను.
పెద్దల ఆశీస్సులు, పిల్లల నవ్వులతో మీ ఇల్లు కళకళలాడాలి!

May your home be filled with laughter and love this festive season.`,
  },
  {
    theme: 'శాంతి',
    themeEn: 'Peace',
    message: `ఈ పవిత్ర సందర్భంలో మీ హృదయంలో శాంతి,
మీ ఇంట సంతోషం, మీ జీవితంలో సమృద్ధి నెలకొనాలి.
అందరికీ హృదయపూర్వక శుభాకాంక్షలు!

Wishing you peace, happiness, and abundance on this auspicious day.`,
  },
  {
    theme: 'విజయం',
    themeEn: 'Success',
    message: `ఈ పండుగ మీ జీవితంలో కొత్త విజయాలకు నాంది కావాలి.
మీ ప్రతి ప్రయత్నం ఫలించాలని ఆకాంక్షిస్తున్నాను.
మీకు మరియు మీ కుటుంబానికి పండుగ శుభాకాంక్షలు!

May this festival mark the beginning of new achievements in your life.`,
  },
  {
    theme: 'సంపద',
    themeEn: 'Prosperity',
    message: `ఈ శుభ సందర్భంలో మీ ఇంట్లో సిరిసంపదలు,
ఆరోగ్యం, ఆనందం నిండి ఉండాలని కోరుకుంటున్నాను.
దైవ ఆశీర్వాదం మీ కుటుంబంపై సదా ఉండాలి!

Wishing you prosperity, health, and blessings on this festive occasion.`,
  },
];

/** Get wish templates for a specific festival, with fallback to defaults */
export function getWishTemplates(festivalEnglish) {
  if (!festivalEnglish) return DEFAULT_TEMPLATES;
  for (const [key, templates] of Object.entries(FESTIVAL_TEMPLATES)) {
    if (festivalEnglish.toLowerCase().includes(key.toLowerCase())) return templates;
  }
  return DEFAULT_TEMPLATES;
}

// Legacy export for backward compatibility
export const WISH_TEMPLATES = UGADI_TEMPLATES;
