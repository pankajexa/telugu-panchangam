/**
 * Vahana (Vehicle) Puja — 9 guided steps
 * Shastra-backed vehicle blessing puja with Revanta Dhyanam.
 * Total duration: ~7 minutes (420 seconds)
 */

export const VAHANA_PUJA_STEPS = [
  {
    id: 1,
    nameKey: 'puja.step.purification',
    nameSanskrit: 'पवित्रीकरणम्',
    nameEnglish: 'Purification',
    duration: 25,
    icon: 'kalash',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'ॐ अपवित्रः पवित्रो वा सर्वावस्थां गतोऽपि वा।\nयः स्मरेत् पुण्डरीकाक्षं स बाह्याभ्यन्तरः शुचिः॥',
      telugu:
        'ఓం అపవిత్రః పవిత్రో వా సర్వావస్థాం గతోపి వా।\nయః స్మరేత్ పుండరీకాక్షం స బాహ్యాభ్యంతరః శుచిః॥',
      english:
        'Whether pure or impure, in whatever state one may be — one who remembers the lotus-eyed Lord becomes pure, inside and out.',
      source: 'Garuda Purana',
    },
    instructions: {
      te: 'వాహనం ముందు నిలబడి, నీళ్ళు చేతిలో తీసుకుని, మంత్రం చెప్పి, వాహనం మీద చల్లండి. మనసును శుద్ధి చేసుకోండి.',
      en: 'Stand before the vehicle. Take water in your right hand, recite the mantra, and sprinkle it on the vehicle. Purify your mind.',
    },
  },
  {
    id: 2,
    nameKey: 'puja.step.ganapathi',
    nameSanskrit: 'गणपति प्रार्थना',
    nameEnglish: 'Ganapathi Prayer',
    duration: 40,
    icon: 'om',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'वक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव शुभ कार्येषु सर्वदा॥\n\nॐ गं गणपतये नमः॥',
      telugu:
        'వక్రతుండ మహాకాయ సూర్యకోటి సమప్రభ।\nనిర్విఘ్నం కురు మే దేవ శుభ కార్యేషు సర్వదా॥\n\nఓం గం గణపతయే నమః॥',
      english:
        'O Lord with the curved trunk and mighty body, whose brilliance equals a billion suns — please remove all obstacles and bless all my auspicious endeavors.\n\nOm, Salutations to Lord Ganapathi.',
      source: 'Ganapathi Prarthana',
    },
    instructions: {
      te: 'వాహనానికి ఎదురుగా నిలబడి, గణపతిని ప్రార్థించండి. అన్ని ఆటంకాలు తొలగించమని వేడుకోండి.',
      en: 'Stand facing the vehicle and pray to Lord Ganapathi. Ask for the removal of all obstacles.',
    },
  },
  {
    id: 3,
    nameKey: 'puja.step.revanta_dhyanam',
    nameSanskrit: 'रेवन्त ध्यानम्',
    nameEnglish: 'Revanta Dhyanam',
    duration: 60,
    icon: 'om',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'सूर्यपुत्रं हयारूढं पञ्चवक्त्रं दशाम्भकम्।\nरक्तवर्णं कशाखण्डं रेवन्तं द्विभुजं स्मरेत्॥\n\nसूर्यपुत्र नमस्तेस्तु नमस्ते पञ्चवक्त्रक।\nनमो गन्धर्व देवाय रेवन्ताय नमो नमः॥',
      telugu:
        'సూర్యపుత్రం హయారూఢం పంచవక్త్రం దశాంభకం।\nరక్తవర్ణం కశాఖండం రేవంతం ద్విభుజం స్మరేత్॥\n\nసూర్యపుత్ర నమస్తేస్తు నమస్తే పంచవక్త్రక।\nనమోగంధర్వ దేవాయ రేవంతాయ నమోనమః॥',
      english:
        'I meditate upon Revanta, the son of Surya, mounted on a horse, five-faced and ten-eyed, red in complexion, holding a whip, and with two arms.\n\nSalutations to the son of Surya, the five-faced one. Salutations to Gandharva Deva Revanta, again and again.',
      source: 'Revanta Dhyanam — Vahana Raksha Mantra',
    },
    instructions: {
      te: 'రేవంతుడు సూర్యపుత్రుడు, వాహనాల అధిపతి. ఈ ధ్యాన శ్లోకంతో వాహన రక్షణ కోసం ప్రార్థించండి. మంత్రాన్ని 3 సార్లు చదవండి.',
      en: 'Revanta is the son of Surya and lord of vehicles. Pray for vehicle protection with this dhyana shloka. Chant the mantra 3 times.',
    },
  },
  {
    id: 4,
    nameKey: 'puja.step.swastik',
    nameSanskrit: 'स्वस्तिक चिह्नम्',
    nameEnglish: 'Swastik Mark',
    duration: 40,
    icon: 'lotus',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'स्वस्ति न इन्द्रो वृद्धश्रवाः।\nस्वस्ति नः पूषा विश्ववेदाः।\nस्वस्ति नस्तार्क्ष्यो अरिष्टनेमिः।\nस्वस्ति नो बृहस्पतिर्दधातु॥',
      telugu:
        'స్వస్తి న ఇంద్రో వృద్ధశ్రవాః।\nస్వస్తి నః పూషా విశ్వవేదాః।\nస్వస్తి నస్తార్క్ష్యో అరిష్టనేమిః।\nస్వస్తి నో బృహస్పతిర్దధాతు॥',
      english:
        'May Indra of great fame bless us. May Pusha, the all-knowing, bless us. May Garuda, the destroyer of evil, protect us. May Brihaspati grant us well-being.',
      source: 'Rig Veda — Swasti Mantra',
    },
    instructions: {
      te: 'పసుపు-కుంకుమ మిశ్రమంతో వాహనం బోనెట్ మీద స్వస్తిక్ గుర్తు పెట్టండి. ఆ గుర్తు మీద అక్షతలు (బియ్యం) అతికించండి.',
      en: 'Draw a Swastik symbol on the bonnet with turmeric-kumkum paste. Press rice grains (akshat) onto the wet mark.',
    },
  },
  {
    id: 5,
    nameKey: 'puja.step.pushpa_gandha',
    nameSanskrit: 'पुष्प-गन्ध अर्पणम्',
    nameEnglish: 'Flowers & Garland',
    duration: 30,
    icon: 'lotus',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'ॐ रेवन्ताय नमः। गन्धं समर्पयामि।\nॐ रेवन्ताय नमः। पुष्पं समर्पयामि॥',
      telugu:
        'ఓం రేవంతాయ నమః। గంధం సమర్పయామి।\nఓం రేవంతాయ నమః। పుష్పం సమర్పయామి॥',
      english:
        'Om, Salutations to Revanta. I offer fragrance.\nOm, Salutations to Revanta. I offer flowers.',
      source: 'Vahana Puja Panchopacharam',
    },
    instructions: {
      te: 'వాహనానికి పూలమాల వేయండి. గంధం లేదా కుంకుమ అద్దండి.',
      en: 'Adorn the vehicle with a flower garland. Apply sandalwood paste or kumkum.',
    },
  },
  {
    id: 6,
    nameKey: 'puja.step.dhoopa_deepa',
    nameSanskrit: 'धूप-दीप दर्शनम्',
    nameEnglish: 'Incense & Lamp',
    duration: 40,
    icon: 'diya',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'ॐ रेवन्ताय नमः। धूपमागर्पयामि।\nॐ रेवन्ताय नमः। दीपं दर्शयामि॥',
      telugu:
        'ఓం రేవంతాయ నమః। ధూపమాఘ్రాపయామి।\nఓం రేవంతాయ నమః। దీపం దర్శయామి॥',
      english:
        'Om, Salutations to Revanta. I offer incense.\nOm, Salutations to Revanta. I show the lamp.',
      source: 'Vahana Puja Panchopacharam',
    },
    instructions: {
      te: 'అగరబత్తి వెలిగించి, వాహనం చుట్టూ ప్రదక్షిణంగా తిప్పండి. దీపం వెలిగించి, చూపించండి.',
      en: 'Light incense sticks and wave clockwise around the vehicle. Light a diya and show it to the vehicle.',
    },
  },
  {
    id: 7,
    nameKey: 'puja.step.narikela',
    nameSanskrit: 'नारिकेल विसर्जनम्',
    nameEnglish: 'Coconut Offering',
    duration: 40,
    icon: 'kalash',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'इदं फलं मया देव स्थापितं पुरतस्तव।\nतेन मे सफलावाप्तिर्भवेज्जन्मनि जन्मनि॥',
      telugu:
        'ఇదం ఫలం మయా దేవ స్థాపితం పురతస్తవ।\nతేన మే సఫలావాప్తిర్భవేజ్జన్మని జన్మని॥',
      english:
        'O Lord, I place this fruit before you. May it bring me fruitful results in every birth.',
      source: 'Narikela Samarpana Mantra',
    },
    instructions: {
      te: 'కొబ్బరికాయను వాహనం కుడి ముందు టైరు దగ్గర కొట్టండి. కొబ్బరి నీళ్ళు నాలుగు టైర్లపై చల్లండి.',
      en: 'Break a coconut near the right front tire. Sprinkle coconut water on all four tires.',
    },
  },
  {
    id: 8,
    nameKey: 'puja.step.aarti',
    nameSanskrit: 'आरतिः',
    nameEnglish: 'Aarti',
    duration: 60,
    icon: 'diya',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'ॐ नमो भगवते शक्ति रुद्राय मारुति नमः॥\n\n(इस मन्त्र को ७ बार जपें)\n\nसर्वमङ्गलमाङ्गल्ये शिवे सर्वार्थसाधिके।\nशरण्ये त्र्यम्बके गौरि नारायणि नमोऽस्तु ते॥',
      telugu:
        'ఓం నమో భగవతే శక్తి రుద్రాయ మారుతి నమః॥\n\n(ఈ మంత్రాన్ని 7 సార్లు జపించండి)\n\nసర్వమంగళమాంగళ్యే శివే సర్వార్థసాధికే।\nశరణ్యే త్ర్యంబకే గౌరి నారాయణి నమోస్తు తే॥',
      english:
        'Om, Salutations to the powerful Lord Rudra and Maruti.\n\n(Chant this mantra 7 times)\n\nO auspicious Goddess, fulfiller of all desires, refuge of all, three-eyed Gauri — O Narayani, I bow to you.',
      source: 'Vahana Raksha Mantra / Sarva Mangala Stotram',
    },
    instructions: {
      te: 'కర్పూరం వెలిగించి, వాహనం చుట్టూ ప్రదక్షిణంగా ఆరతి ఇవ్వండి. రక్షా మంత్రం 7 సార్లు చదవండి.',
      en: 'Light camphor and perform aarti around the vehicle in clockwise direction. Chant the protection mantra 7 times.',
    },
  },
  {
    id: 9,
    nameKey: 'puja.step.prarthana',
    nameSanskrit: 'प्रार्थना',
    nameEnglish: 'Closing Prayer',
    duration: 85,
    icon: 'bell',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'कायेन वाचा मनसेन्द्रियैर्वा\nबुद्ध्यात्मना वा प्रकृतेः स्वभावात्।\nकरोमि यद्यत् सकलं परस्मै\nनारायणायेति समर्पयामि॥\n\nसूर्यपुत्र नमस्तेस्तु नमस्ते पञ्चवक्त्रक।\nनमो गन्धर्व देवाय रेवन्ताय नमो नमः॥\n\nॐ शान्तिः शान्तिः शान्तिः॥',
      telugu:
        'కాయేన వాచా మనసేంద్రియైర్వా\nబుద్ధ్యాత్మనా వా ప్రకృతేః స్వభావాత్।\nకరోమి యద్యత్ సకలం పరస్మై\nనారాయణాయేతి సమర్పయామి॥\n\nసూర్యపుత్ర నమస్తేస్తు నమస్తే పంచవక్త్రక।\nనమోగంధర్వ దేవాయ రేవంతాయ నమోనమః॥\n\nఓం శాంతిః శాంతిః శాంతిః॥',
      english:
        'Whatever I do with body, speech, mind, senses, intellect, or by nature — I offer all of it to the Supreme Lord Narayana.\n\nSalutations to the son of Surya, the five-faced one. Salutations to Gandharva Deva Revanta, again and again.\n\nOm Peace, Peace, Peace.',
      source: 'Panduranga Ashtakam / Revanta Stuti',
    },
    instructions: {
      te: 'చేతులు జోడించి, హృదయపూర్వకంగా ప్రార్థన చేయండి. రేవంతునికి, మీ కులదేవతకు నమస్కారం చేయండి.\n\n🍋 నాలుగు నిమ్మకాయలను నాలుగు టైర్ల కింద ఉంచి, ముందుకు నడిపించండి.',
      en: 'Join your palms in Namaste. Pray with all your heart. Bow to Revanta and your Kuladevata (family deity).\n\n🍋 Place four lemons under the four tires and drive forward slowly to crush them.',
    },
  },
];

export const VAHANA_PUJA_ITEMS = {
  te: ['నీళ్ళు', 'పసుపు & కుంకుమ', 'అక్షతలు (బియ్యం)', 'పూల మాల', 'అగరబత్తి', 'దీపం & కర్పూరం', 'కొబ్బరికాయ', '4 నిమ్మకాయలు'],
  en: ['Water', 'Turmeric & Kumkum', 'Rice (Akshat)', 'Flower garland', 'Incense sticks', 'Diya & Camphor', 'Coconut', '4 Lemons'],
};

export const VAHANA_TOTAL_DURATION = 420; // 7 minutes

export const VAHANA_PUJA_META = {
  title: { te: 'వాహన పూజ', en: 'Vahana Puja' },
  subtitle: { te: 'వాహన రక్షణ పూజ • 7 నిమిషాలు', en: 'Vehicle Blessing Puja • 7 minutes' },
  deity: 'Revanta',
};
