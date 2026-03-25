/**
 * Festival & Vrata Practices — Dharma Shastra backed.
 * Sources: Drik Panchang, ISKCON, Stotra Nidhi, SVCC Temple, Mulugu Panchangam.
 *
 * Each entry has:
 *  - steps[]: { te, en, icon? } — ordered practices for the day
 *  - mantra?: { text, meaning_te, meaning_en } — primary mantra/chant
 *  - food?: { offer_te, offer_en, avoid_te, avoid_en } — what to eat/avoid
 *  - timing?: { te, en } — key timing info
 */

// ═══════════════════════════════════════════════════════
// MAJOR FESTIVALS — keyed by english name from FESTIVAL_MAP
// ═══════════════════════════════════════════════════════

const FESTIVAL_PRACTICES = {
  // ─── Ugadi ─────────────────────────────────────────
  'Ugadi': {
    title_te: 'ఉగాది ఆచరణలు',
    title_en: 'Ugadi Practices',
    steps: [
      { te: 'బ్రహ్మ ముహూర్తంలో నిద్ర లేవండి, అభ్యంగ స్నానం (నువ్వుల నూనెతో తలస్నానం) చేయండి', en: 'Wake at Brahma Muhurta, take Abhyanga Snanam (oil bath with head bath)' },
      { te: 'కొత్త బట్టలు ధరించండి, ఇంటిని శుభ్రం చేసి మామిడి తోరణాలు, ముగ్గులు పెట్టండి', en: 'Wear new clothes, clean home and decorate with mango leaf toranams and rangoli' },
      { te: 'దేవుని పూజ — విష్ణు/శివ/లక్ష్మీ పూజ, సంకల్పం చెప్పుకోండి', en: 'Perform puja — worship Vishnu/Shiva/Lakshmi, take Sankalpa for the new year' },
      { te: 'ఉగాది పచ్చడి తయారు చేసి నైవేద్యంగా పెట్టి తినండి (6 రుచులు)', en: 'Prepare Ugadi Pachadi (6 tastes — neem, jaggery, tamarind, chili, salt, raw mango) and offer as Naivedyam' },
      { te: 'పంచాంగ శ్రవణం వినండి (సంవత్సర ఫలితాలు)', en: 'Listen to Panchanga Sravanam (year predictions and almanac reading)' },
      { te: 'పులిహోర, బొబ్బట్లు, పాయసం తయారు చేయండి', en: 'Prepare Pulihora, Bobbatlu, and Payasam' },
      { te: 'గుడికి వెళ్ళి దర్శనం చేసుకోండి, తులసి పూజ చేయండి', en: 'Visit temple, seek darshan, perform Tulasi worship' },
    ],
    food: {
      offer_te: 'ఉగాది పచ్చడి, పులిహోర, బొబ్బట్లు, పాయసం',
      offer_en: 'Ugadi Pachadi, Pulihora, Bobbatlu, Payasam',
    },
  },

  // ─── Sri Rama Navami ───────────────────────────────
  'Sri Rama Navami': {
    title_te: 'శ్రీ రామ నవమి ఆచరణలు',
    title_en: 'Sri Rama Navami Practices',
    steps: [
      { te: 'బ్రహ్మ ముహూర్తంలో లేచి పవిత్ర స్నానం చేయండి', en: 'Rise at Brahma Muhurta and take a purifying bath' },
      { te: 'రామ దర్బార్ అలంకరించండి — రాముడు, సీత, లక్ష్మణుడు, హనుమంతుడు', en: 'Set up and decorate Ram Darbar — Ram, Sita, Lakshmana, Hanuman' },
      { te: 'పంచామృతంతో అభిషేకం చేయండి (పాలు, పెరుగు, నెయ్యి, తేనె, గంగాజలం)', en: 'Perform Abhishekam with Panchamrit (milk, curd, ghee, honey, gangajal)' },
      { te: '"శ్రీ రామ జయ రామ జయ జయ రామ" మంత్రం 108 సార్లు జపించండి', en: 'Chant "Sri Rama Jaya Rama Jaya Jaya Rama" 108 times' },
      { te: 'సుందరకాండ లేదా రామాయణం పారాయణం చేయండి', en: 'Read Sundara Kandam or recite the Ramayanam' },
      { te: 'మధ్యాహ్నం 12 గంటలకు (రామ జన్మ సమయం) — ఆరతి, నైవేద్యం సమర్పించండి', en: 'At noon (Ram Janma moment ~12:27 PM) — perform Aarti, offer Naivedyam' },
      { te: 'పానకం, వడపప్పు, నీర్ మజ్జిగ నైవేద్యంగా పెట్టండి', en: 'Offer Panakam (jaggery water), Vadapappu (soaked chana dal), Neer Majjiga' },
    ],
    mantra: {
      text: 'శ్రీ రామ జయ రామ జయ జయ రామ',
      text_en: 'Sri Rama Jaya Rama Jaya Jaya Rama',
    },
    food: {
      offer_te: 'పానకం, వడపప్పు, నీర్ మజ్జిగ, కొబ్బరి చిప్పలు',
      offer_en: 'Panakam, Vadapappu, Neer Majjiga, Coconut pieces',
    },
    timing: {
      te: 'మధ్యాహ్న ముహూర్తం (మధ్యాహ్నం ~12:27) — రామ జన్మ సమయం',
      en: 'Madhyahna Muhurat (~12:27 PM) — Ram Janma moment',
    },
  },

  // ─── Vinayaka Chavithi ────────────────────────────
  'Vinayaka Chavithi': {
    title_te: 'వినాయక చవితి ఆచరణలు',
    title_en: 'Vinayaka Chavithi Practices',
    steps: [
      { te: 'తెల్లవారుజామున లేచి స్నానం చేసి శుభ్రమైన బట్టలు ధరించండి', en: 'Rise early, bathe, and wear clean clothes' },
      { te: 'మట్టి విగ్రహం లేదా గణేశ ప్రతిమను ప్రతిష్ఠించండి — ప్రాణ ప్రతిష్ఠ చేయండి', en: 'Install clay Ganesha idol — perform Prana Pratishtha (invocation)' },
      { te: 'షోడశోపచార పూజ చేయండి (16 ఉపచారాలతో పూజ)', en: 'Perform Shodashopachara Puja (16-step worship with Puranic mantras)' },
      { te: '21 ఉండ్రాళ్ళు (మోదకాలు), దానిమ్మ, కొబ్బరి, ఎర్ర పువ్వులు నైవేద్యం పెట్టండి', en: 'Offer 21 Modaks (Undrallu), pomegranate, coconut, and red flowers' },
      { te: 'వినాయక వ్రత కథ చదవండి', en: 'Read Vinayaka Vratha Katha' },
      { te: 'అనంత చతుర్దశి (10వ రోజు) న విసర్జనం చేయండి', en: 'Perform Visarjan (immersion) on Ananta Chaturdashi (day 10)' },
    ],
    mantra: {
      text: 'శ్రీ గణేశాయ నమః',
      text_en: 'Sri Ganeshaya Namaha',
    },
    food: {
      offer_te: '21 ఉండ్రాళ్ళు (మోదకాలు), కుడుములు, పాయసం',
      offer_en: '21 Modaks (Undrallu), Kudumulu, Payasam',
    },
  },

  // ─── Makara Sankranti ─────────────────────────────
  'Makara Sankranti': {
    title_te: 'మకర సంక్రాంతి ఆచరణలు',
    title_en: 'Makara Sankranti Practices',
    steps: [
      { te: 'సూర్యోదయానికి ముందు నువ్వుల నూనెతో స్నానం చేయండి', en: 'Bathe with sesame oil before sunrise' },
      { te: 'సూర్య భగవానుడికి పూజ చేయండి, నువ్వులు, బెల్లం నైవేద్యం పెట్టండి', en: 'Perform Surya Puja, offer sesame and jaggery as Naivedyam' },
      { te: 'అరిసెలు, బొబ్బట్లు, పొంగలి తయారు చేయండి', en: 'Prepare Ariselu, Bobbatlu, and Pongal' },
      { te: 'పసుపు-కుంకుమ పెట్టుకోండి, ముగ్గులు వేయండి', en: 'Apply turmeric-kumkum, draw rangoli/muggu' },
      { te: 'గాలిపటాలు ఎగరేయండి, కొత్త బట్టలు ధరించండి', en: 'Fly kites, wear new clothes' },
      { te: 'నువ్వులు-బెల్లం దానం చేయండి', en: 'Donate sesame and jaggery to others' },
    ],
    food: {
      offer_te: 'అరిసెలు, బొబ్బట్లు, పొంగలి, నువ్వులు-బెల్లం',
      offer_en: 'Ariselu, Bobbatlu, Pongal, Sesame-Jaggery',
    },
  },

  // ─── Bhogi ────────────────────────────────────────
  'Bhogi': {
    title_te: 'భోగి ఆచరణలు',
    title_en: 'Bhogi Practices',
    steps: [
      { te: 'తెల్లవారుజామున భోగి మంటలు వేయండి (పాత వస్తువులతో)', en: 'Light Bhogi bonfire at dawn with old belongings' },
      { te: 'ఇంటిని శుభ్రం చేసి కొత్తగా అలంకరించండి', en: 'Clean home thoroughly and decorate fresh' },
      { te: 'భోగి పళ్ళు — చిన్న పిల్లలపై రేగు పళ్ళు పోయండి', en: 'Bhogi Pallu — shower regi fruits on small children' },
    ],
  },

  // ─── Kanuma ───────────────────────────────────────
  'Kanuma': {
    title_te: 'కనుమ ఆచరణలు',
    title_en: 'Kanuma Practices',
    steps: [
      { te: 'పశువులను పూజించండి — అలంకరించి, ప్రత్యేక ఆహారం పెట్టండి', en: 'Worship cattle — decorate and feed them special food' },
      { te: 'కుటుంబ సమావేశాలు, విందులు జరుపుకోండి', en: 'Family gatherings and feasts' },
    ],
  },

  // ─── Deepavali ────────────────────────────────────
  'Deepavali': {
    title_te: 'దీపావళి ఆచరణలు',
    title_en: 'Deepavali Practices',
    steps: [
      { te: 'సూర్యోదయానికి ముందు నువ్వుల నూనెతో అభ్యంగ స్నానం చేయండి', en: 'Take Abhyanga Snanam with sesame oil before sunrise' },
      { te: 'కొత్త బట్టలు ధరించండి, ఇంటి ముందు దీపాలు, ముగ్గులు పెట్టండి', en: 'Wear new clothes, place diyas and rangoli at entrance' },
      { te: 'సాయంత్రం లక్ష్మీ పూజ చేయండి — సంపద, సౌభాగ్యం కోరుకోండి', en: 'Perform Lakshmi Puja in the evening — pray for wealth and prosperity' },
      { te: 'మిఠాయిలు, పిండి వంటలు తయారు చేసి పంచుకోండి', en: 'Prepare sweets and snacks, share with neighbors' },
      { te: 'బాణసంచా కాల్చండి, దీపాలతో ఇల్లు అలంకరించండి', en: 'Light fireworks, illuminate home with lamps' },
    ],
    food: {
      offer_te: 'లక్ష్మీ పూజకు నైవేద్యం — పాయసం, లడ్డూలు, అరిసెలు',
      offer_en: 'Naivedyam for Lakshmi Puja — Payasam, Laddus, Ariselu',
    },
  },

  // ─── Naraka Chaturdashi ────────────────────────────
  'Naraka Chaturdashi': {
    title_te: 'నరక చతుర్దశి ఆచరణలు',
    title_en: 'Naraka Chaturdashi Practices',
    steps: [
      { te: 'సూర్యోదయానికి ముందు అభ్యంగ స్నానం (నువ్వుల నూనెతో)', en: 'Take Abhyanga Snanam (oil bath) before sunrise' },
      { te: 'కృష్ణుడి నరకాసుర వధ కథ స్మరించండి', en: 'Remember the story of Krishna slaying Narakasura' },
      { te: 'ఇంటి చుట్టూ దీపాలు వెలిగించండి', en: 'Light lamps around the home' },
    ],
  },

  // ─── Vijaya Dashami ────────────────────────────────
  'Vijaya Dashami': {
    title_te: 'విజయదశమి ఆచరణలు',
    title_en: 'Vijaya Dashami Practices',
    steps: [
      { te: 'సరస్వతి పూజ — పుస్తకాలు, పనిముట్లు తిరిగి తీసుకోండి', en: 'Saraswati Puja — take back books and tools kept for worship' },
      { te: 'ఆయుధ పూజ — పనిముట్లు, వాహనాలు పూజించండి', en: 'Ayudha Puja — worship tools, vehicles, and instruments' },
      { te: 'శమీ వృక్షం పూజించండి, బంగారం (జమ్మి ఆకులు) పంచుకోండి', en: 'Worship Shami tree, exchange gold (Jammi leaves) with others' },
      { te: 'విద్యారంభం — చిన్నపిల్లలకు అక్షరాభ్యాసం చేయించండి', en: 'Vidyarambham — initiate children into learning/writing' },
    ],
  },

  // ─── Dasara Navaratri begins ───────────────────────
  'Dasara Navaratri begins': {
    title_te: 'దసరా నవరాత్రులు ఆచరణలు',
    title_en: 'Dasara Navaratri Practices',
    steps: [
      { te: 'ఘటస్థాపన — కలశం ప్రతిష్ఠించి 9 రోజులు పూజ చేయండి', en: 'Ghatasthapana — install sacred pot and worship for 9 days' },
      { te: 'మొదటి 3 రోజులు — దుర్గా దేవిని పూజించండి', en: 'First 3 days — worship Goddess Durga' },
      { te: 'తరువాత 3 రోజులు — లక్ష్మీ దేవిని పూజించండి', en: 'Next 3 days — worship Goddess Lakshmi' },
      { te: 'చివరి 3 రోజులు — సరస్వతి దేవిని పూజించండి', en: 'Last 3 days — worship Goddess Saraswati' },
      { te: 'దుర్గా సప్తశతి / దేవీ మాహాత్మ్యం పారాయణం చేయండి', en: 'Recite Durga Saptashati / Devi Mahatmyam' },
    ],
  },

  // ─── Maha Shivaratri ──────────────────────────────
  'Maha Shivaratri': {
    title_te: 'మహా శివరాత్రి ఆచరణలు',
    title_en: 'Maha Shivaratri Practices',
    steps: [
      { te: 'ఉపవాసం ఉండండి (నిర్జల లేదా ఫలాహారం)', en: 'Observe fast (Nirjala or fruits only)' },
      { te: 'శివలింగానికి అభిషేకం — పాలు, నీరు, బిల్వ పత్రాలతో', en: 'Perform Abhishekam to Shivalinga — with milk, water, and Bilva leaves' },
      { te: 'రాత్రి జాగరణం (4 జాములలో పూజ) — నాలుగు ప్రహరాల పూజ', en: 'Night vigil (Jagarana) — worship in four praharas (quarters of the night)' },
      { te: '"ఓం నమః శివాయ" జపం 108 సార్లు చేయండి', en: 'Chant "Om Namah Shivaya" 108 times' },
      { te: 'రుద్ర నమకం-చమకం పారాయణం చేయండి', en: 'Recite Rudra Namakam-Chamakam' },
      { te: 'శివ ఆలయంలో దర్శనం చేసుకోండి', en: 'Visit Shiva temple for darshan' },
    ],
    mantra: {
      text: 'ఓం నమః శివాయ',
      text_en: 'Om Namah Shivaya',
    },
    food: {
      avoid_te: 'అన్న ధాన్యాలు, ఉల్లి, వెల్లుల్లి',
      avoid_en: 'Grains, onion, garlic',
      offer_te: 'పాలు, పండ్లు, బిల్వ పత్రాలు',
      offer_en: 'Milk, fruits, Bilva leaves',
    },
  },

  // ─── Krishna Janmashtami ──────────────────────────
  'Krishna Janmashtami': {
    title_te: 'శ్రీ కృష్ణ జన్మాష్టమి ఆచరణలు',
    title_en: 'Krishna Janmashtami Practices',
    steps: [
      { te: 'ఉపవాసం ఉండండి — అర్ధరాత్రి వరకు ఆహారం తీసుకోకండి', en: 'Observe fast — no food until midnight' },
      { te: 'కృష్ణ విగ్రహం అలంకరించి ఊయలలో పెట్టండి', en: 'Decorate Krishna idol and place in a swing (Jhula)' },
      { te: 'అర్ధరాత్రి 12 గంటలకు (కృష్ణ జన్మ సమయం) — అభిషేకం, ఆరతి చేయండి', en: 'At midnight (Krishna Janma time) — perform Abhishekam and Aarti' },
      { te: 'భాగవతం, కృష్ణ లీలలు చదవండి', en: 'Read Bhagavatam, Krishna Leelas' },
      { te: 'వెన్న, పాలు, మిఠాయిలు నైవేద్యం పెట్టండి', en: 'Offer butter, milk, and sweets as Naivedyam' },
    ],
    food: {
      offer_te: 'వెన్న, పాలు, అప్పాలు, సీడై, పాయసం',
      offer_en: 'Butter, milk, Appalu, Seedai, Payasam',
    },
  },

  // ─── Ratha Saptami ────────────────────────────────
  'Ratha Saptami': {
    title_te: 'రథ సప్తమి ఆచరణలు',
    title_en: 'Ratha Saptami Practices',
    steps: [
      { te: 'సూర్యోదయానికి ముందు రేగు ఆకులు తలపై పెట్టుకుని స్నానం చేయండి', en: 'Bathe before sunrise with Regu (jujube) leaves placed on head' },
      { te: 'సూర్య భగవానుడికి అర్ఘ్యం ఇవ్వండి', en: 'Offer Arghyam (water) to Sun God' },
      { te: 'ఆదిత్య హృదయం పారాయణం చేయండి', en: 'Recite Aditya Hrudayam' },
    ],
  },

  // ─── Kartika Purnima ──────────────────────────────
  'Kartika Purnima': {
    title_te: 'కార్తీక పూర్ణిమ ఆచరణలు',
    title_en: 'Kartika Purnima Practices',
    steps: [
      { te: 'సూర్యోదయానికి ముందు నదిలో లేదా చెరువులో స్నానం చేయండి', en: 'Bathe in river or temple tank before sunrise' },
      { te: 'రోజంతా ఉపవాసం ఉండండి', en: 'Observe fast for the entire day' },
      { te: '365 వత్తుల దీపం వెలిగించండి', en: 'Light 365-wick deepam (lamp)' },
      { te: 'శివ-విష్ణు పూజ చేయండి, కార్తీక పురాణం చదవండి', en: 'Perform Shiva-Vishnu puja, read Kartika Puranam' },
      { te: 'చంద్ర దర్శనం తరువాత ఉపవాసం విరమించండి', en: 'Break fast only after Moon darshan' },
    ],
  },

  // ─── Varalakshmi Vratam ───────────────────────────
  'Varalakshmi Vratam': {
    title_te: 'వరలక్ష్మీ వ్రతం ఆచరణలు',
    title_en: 'Varalakshmi Vratam Practices',
    steps: [
      { te: 'ఉపవాసం ఉండి, లక్ష్మీ దేవి ప్రతిమను అలంకరించండి', en: 'Observe fast, decorate Goddess Lakshmi idol' },
      { te: 'కలశం ప్రతిష్ఠించి, కొబ్బరి, మామిడి ఆకులతో అలంకరించండి', en: 'Install Kalasham decorated with coconut and mango leaves' },
      { te: 'లక్ష్మీ అష్టోత్తరం, లక్ష్మీ స్తోత్రం పారాయణం చేయండి', en: 'Recite Lakshmi Ashtottaram and Lakshmi Stotram' },
      { te: 'తోరం (దారం) చేతికి కట్టుకోండి', en: 'Tie Toram (sacred thread) on wrist' },
      { te: 'ముత్తయిదువులను పిలిచి తాంబూలం ఇవ్వండి', en: 'Invite married women and offer Tamboolam' },
    ],
  },

  // ─── Holi ────────────────────────────────────────
  'Holi': {
    title_te: 'హోళి ఆచరణలు',
    title_en: 'Holi Practices',
    steps: [
      { te: 'హోళికా దహనం — సాయంత్రం అగ్ని వెలిగించి ప్రదక్షిణ చేయండి', en: 'Holika Dahan — light bonfire in evening and circumambulate' },
      { te: 'రంగులతో ఆడుకోండి, కుటుంబ సభ్యులతో ఆనందించండి', en: 'Play with colors, celebrate with family and friends' },
    ],
  },

  // ─── Akshaya Tritiya ──────────────────────────────
  'Akshaya Tritiya': {
    title_te: 'అక్షయ తృతీయ ఆచరణలు',
    title_en: 'Akshaya Tritiya Practices',
    steps: [
      { te: 'ఈ రోజు చేసే పుణ్యకార్యాలు, దానాలు అక్షయం (నాశనం లేనివి)', en: 'Meritorious acts and charity on this day yield eternal (Akshaya) results' },
      { te: 'విష్ణు-లక్ష్మీ పూజ చేయండి', en: 'Perform Vishnu-Lakshmi Puja' },
      { te: 'దానధర్మాలు చేయండి — అన్నదానం, వస్త్రదానం', en: 'Perform charity — food donation, clothes donation' },
      { te: 'బంగారం కొనడానికి శుభ ముహూర్తం', en: 'Auspicious time for purchasing gold' },
    ],
  },
};

// ═══════════════════════════════════════════════════════
// VRATA PRACTICES — keyed by type from resolveVrathams
// ═══════════════════════════════════════════════════════

const VRATA_PRACTICES = {
  // ─── Ekadashi ─────────────────────────────────────
  ekadashi: {
    title_te: 'ఏకాదశి వ్రతం ఆచరణలు',
    title_en: 'Ekadashi Vratham Practices',
    steps: [
      { te: 'సూర్యోదయం నుండి మరుసటి రోజు సూర్యోదయం వరకు ఉపవాసం', en: 'Fast from sunrise to next day sunrise' },
      { te: 'ఆహార ధాన్యాలు, బియ్యం, గోధుమలు, పప్పులు తినకూడదు', en: 'Avoid all grains — rice, wheat, pulses, lentils' },
      { te: 'పండ్లు, పాలు, నీరు తీసుకోవచ్చు (లేదా నిర్జల ఉపవాసం)', en: 'Fruits, milk, and water are permitted (or observe Nirjala — no water)' },
      { te: 'విష్ణు పూజ చేయండి, విష్ణు సహస్రనామం చదవండి', en: 'Perform Vishnu Puja, recite Vishnu Sahasranamam' },
      { te: 'భగవద్గీత పారాయణం చేయండి', en: 'Recite Bhagavad Gita' },
      { te: 'ద్వాదశి రోజు — ఏకాదశి తిథి ముగిసిన తరువాత, హరి వాసర ముందు పారణ చేయండి', en: 'On Dwadashi — break fast (Parana) after Ekadashi tithi ends, before Hari Vasara' },
    ],
    food: {
      avoid_te: 'అన్ని ధాన్యాలు, ఉల్లి, వెల్లుల్లి, మాంసం, మద్యం',
      avoid_en: 'All grains, onion, garlic, meat, alcohol',
      offer_te: 'పండ్లు, పాలు, బాదం, సగ్గుబియ్యం, కొబ్బరి',
      offer_en: 'Fruits, milk, almonds, sabudana, coconut',
    },
    timing: {
      te: 'పారణ: ద్వాదశి రోజు సూర్యోదయం తరువాత కొన్ని గంటల్లో',
      en: 'Parana: A few hours after sunrise on Dwadashi day',
    },
  },

  // ─── Sankashtahara / Sankashti Chaturthi ──────────
  chaturthi: {
    title_te: 'సంకష్టహర చతుర్థి వ్రతం ఆచరణలు',
    title_en: 'Sankashtahara Chaturthi Practices',
    steps: [
      { te: 'సూర్యోదయం నుండి చంద్రోదయం వరకు ఉపవాసం', en: 'Fast from sunrise to moonrise' },
      { te: 'పండ్లు, కూరగాయలు, వేరుశెనగ, సగ్గుబియ్యం తినవచ్చు', en: 'Fruits, vegetables, peanuts, sabudana are permitted' },
      { te: 'గణపతి అభిషేకం చేయండి, దూర్వాయుగ్మ పూజ చేయండి (11 లేదా 21 దూర్వాంకురాలు అర్పించండి)', en: 'Perform Ganapati Abhishekam and Durvayugma Puja (offer 11 or 21 Durvankura grass pairs)' },
      { te: '"శ్రీ గణేశాయ నమః" 108 సార్లు జపించండి', en: 'Chant "Sri Ganeshaya Namaha" 108 times' },
      { te: 'పువ్వులు, అగరబత్తి, దీపం, నైవేద్యం (మోదకం, లడ్డూ) అర్పించండి', en: 'Offer flowers, incense, lamp, Naivedyam (Modak, Laddu)' },
      { te: 'చంద్రోదయం తరువాత — చంద్ర దర్శనం చేయండి, అర్ఘ్యం ఇవ్వండి', en: 'After moonrise — sight the Moon, offer Arghyam (water with flowers, sandalwood, rice)' },
      { te: 'గణపతి ప్రసాదం తిని ఆ తరువాత ఉపవాసం విరమించండి', en: 'Eat Ganapati Prasadam first, then break the fast' },
    ],
    mantra: {
      text: 'శ్రీ గణేశాయ నమః',
      text_en: 'Sri Ganeshaya Namaha',
    },
    food: {
      avoid_te: 'ఆహార ధాన్యాలు',
      avoid_en: 'Food grains',
      offer_te: 'మోదకం, లడ్డూ, కొబ్బరి, పండ్లు',
      offer_en: 'Modak, Laddu, coconut, fruits',
    },
    timing: {
      te: 'చంద్రోదయం తరువాత ఉపవాసం విరమించండి',
      en: 'Break fast only after moonrise and Moon darshan',
    },
  },

  // ─── Pradosham ────────────────────────────────────
  pradosham: {
    title_te: 'ప్రదోషం ఆచరణలు',
    title_en: 'Pradosham Practices',
    steps: [
      { te: 'సూర్యోదయం నుండి సూర్యాస్తమయం వరకు ఉపవాసం', en: 'Fast from sunrise to sunset' },
      { te: 'సూర్యాస్తమయానికి 1.5 గంటల ముందు స్నానం చేయండి', en: 'Bathe 1.5 hours before sunset' },
      { te: 'సంధ్యాకాలంలో (సూర్యాస్తమయం ±1.5 గంటలు) శివ పూజ చేయండి', en: 'Perform Shiva Puja during Sandhya Kala (sunset ±1.5 hours)' },
      { te: 'శివ-పార్వతి-గణేశ-కార్తికేయ-నంది పూజ చేయండి', en: 'Worship Shiva, Parvati, Ganesha, Kartikeya, and Nandi' },
      { te: 'అభిషేకం చేయండి — బిల్వ పత్రాలు, విభూతి, చందనం అర్పించండి', en: 'Perform Abhishekam — offer Bilva leaves, Vibhuti, Sandalwood' },
      { te: 'రుద్ర నమకం-చమకం పారాయణం చేయండి', en: 'Recite Rudra Namakam-Chamakam' },
    ],
    timing: {
      te: 'ప్రదోష కాలం: సూర్యాస్తమయానికి 1.5 గంటల ముందు నుండి 1.5 గంటల తరువాత',
      en: 'Pradosh Kaal: 1.5 hours before to 1.5 hours after sunset',
    },
  },

  // ─── Masik Shivaratri ─────────────────────────────
  shivaratri: {
    title_te: 'మాస శివరాత్రి ఆచరణలు',
    title_en: 'Masik Shivaratri Practices',
    steps: [
      { te: 'ఉపవాసం ఉండండి (ఫలాహారం లేదా నిర్జల)', en: 'Observe fast (fruits only or Nirjala)' },
      { te: 'శివలింగానికి అభిషేకం — పాలు, నీరు, బిల్వ పత్రాలతో', en: 'Perform Abhishekam to Shivalinga with milk, water, Bilva leaves' },
      { te: '"ఓం నమః శివాయ" జపం చేయండి', en: 'Chant "Om Namah Shivaya"' },
      { te: 'శివ ఆలయంలో సాయంత్రం దర్శనం చేసుకోండి', en: 'Visit Shiva temple in the evening for darshan' },
    ],
  },

  // ─── Purnima ──────────────────────────────────────
  purnima: {
    title_te: 'పూర్ణిమ ఆచరణలు',
    title_en: 'Purnima Practices',
    steps: [
      { te: 'ఉపవాసం లేదా సత్వికాహారం తీసుకోండి', en: 'Observe fast or eat only Sattvic food' },
      { te: 'సత్యనారాయణ వ్రతం చేయండి (ఐచ్ఛికం)', en: 'Perform Satyanarayana Vratam (optional)' },
      { te: 'చంద్రుడికి అర్ఘ్యం ఇవ్వండి', en: 'Offer Arghyam to the Moon' },
      { te: 'దానధర్మాలు చేయండి', en: 'Perform charity and donations' },
    ],
  },

  // ─── Amavasya ─────────────────────────────────────
  amavasya: {
    title_te: 'అమావాస్య ఆచరణలు',
    title_en: 'Amavasya Practices',
    steps: [
      { te: 'పితృ తర్పణం ఇవ్వండి (పూర్వీకులకు జల తర్పణం)', en: 'Offer Pitru Tarpanam (water oblations to ancestors)' },
      { te: 'తిల తర్పణం — నువ్వులతో తర్పణం చేయండి', en: 'Tila Tarpanam — offer with sesame seeds' },
      { te: 'దానధర్మాలు, బ్రాహ్మణ భోజనం చేయించండి', en: 'Perform charity, feed Brahmanas' },
      { te: 'దీపదానం చేయండి', en: 'Donate lamps (Deepa Danam)' },
    ],
  },
};

/**
 * Look up practices for a given festival or vrata.
 * @param {object} festival — festival object from panchangam { telugu, english, major }
 * @param {array} vrathams — vrathams array from panchangam [{ telugu, english, type }]
 * @returns {object|null} — practices object or null
 */
export function getPractices(festival, vrathams) {
  // Check festival first
  if (festival?.english && FESTIVAL_PRACTICES[festival.english]) {
    return { ...FESTIVAL_PRACTICES[festival.english], source: 'festival' };
  }

  // Check vrathams by type
  if (vrathams?.length > 0) {
    for (const v of vrathams) {
      if (v.type && VRATA_PRACTICES[v.type]) {
        return { ...VRATA_PRACTICES[v.type], source: 'vrata' };
      }
    }
  }

  return null;
}

export { FESTIVAL_PRACTICES, VRATA_PRACTICES };
