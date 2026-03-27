/**
 * Ganapathi Panchopachara Puja — 10 guided steps
 * Shastra-backed daily puja with Sanskrit mantras, Telugu transliteration, and English meaning.
 * Total duration: ~10 minutes
 */

export const GANAPATHI_PUJA_STEPS = [
  {
    id: 1,
    nameKey: 'puja.step.purification',
    nameSanskrit: 'पवित्रीकरणम्',
    nameEnglish: 'Purification',
    duration: 30,
    icon: 'kalash',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'ॐ अपवित्रः पवित्रो वा सर्वावस्थां गतोऽपि वा।\nयः स्मरेत् पुण्डरीकाक्षं स बाह्याभ्यन्तरः शुचिः॥',
      telugu:
        'ఓం అపవిత్రః పవిత్రో వా సర్వావస్థాం గతోఽపి వా।\nయః స్మరేత్ పుణ్డరీకాక్షం స బాహ్యాభ్యన్తరః శుచిః॥',
      english:
        'Whether pure or impure, in whatever state one may be, one who remembers the lotus-eyed Lord becomes pure both inside and out.',
      source: 'Garuda Purana',
    },
    instructions: {
      te: 'కుడిచేత్తో నీళ్ళు తీసుకుని, మంత్రం చెప్పి, ఆ నీళ్ళను చల్లుకోండి. మనసును శుద్ధి చేసుకోండి.',
      en: 'Take water in your right hand. Recite the mantra and sprinkle the water on yourself. Purify your mind.',
    },
  },
  {
    id: 2,
    nameKey: 'puja.step.pranayama',
    nameSanskrit: 'प्राणायामः',
    nameEnglish: 'Pranayama',
    duration: 120,
    icon: 'om',
    hasBreathingGuide: true,
    mantra: {
      devanagari:
        'ॐ भूः। ॐ भुवः। ओँ सुवः। ॐ महः। ॐ जनः। ॐ तपः। ओँ सत्यम्।\nॐ तत्सवितुर्वरेण्यं भर्गो देवस्य धीमहि।\nधियो यो नः प्रचोदयात्॥',
      telugu:
        'ఓం భూః। ఓం భువః। ఓం సువః। ఓం మహః। ఓం జనః। ఓం తపః। ఓం సత్యమ్।\nఓం తత్సవితుర్వరేణ్యం భర్గో దేవస్య ధీమహి।\nధియో యో నః ప్రచోదయాత్॥',
      english:
        'We meditate upon the divine light of the Sun God Savitri. May that supreme light illuminate our intellect and guide us on the right path.',
      source: 'Rig Veda 3.62.10 (Gayatri Mantra)',
    },
    instructions: {
      te: 'కుడి చేతి బొటనవేలుతో కుడి నాసికను మూసి, ఎడమ నాసిక ద్వారా శ్వాస తీసుకోండి. రెండూ మూసి ధారణ చేయండి. కుడి నాసిక ద్వారా వదలండి.',
      en: 'Close the right nostril with your right thumb. Inhale through the left nostril. Hold both nostrils closed. Exhale through the right nostril.',
    },
  },
  {
    id: 3,
    nameKey: 'puja.step.sankalpa',
    nameSanskrit: 'सङ्कल्पम्',
    nameEnglish: 'Sankalpa',
    duration: 30,
    icon: 'mala',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'मम उपात्त समस्त दुरितक्षयद्वारा\nश्री महागणपति प्रीत्यर्थं\nपञ्चोपचार पूजां करिष्ये॥',
      telugu:
        'మమ ఉపాత్త సమస్త దురితక్షయద్వారా\nశ్రీ మహాగణపతి ప్రీత్యర్థం\nపంచోపచార పూజాం కరిష్యే॥',
      english:
        'For the removal of all my accumulated sins, and for the pleasure of Sri Maha Ganapathi, I shall now perform the Panchopachara Puja.',
      source: 'Traditional Sankalpa',
    },
    instructions: {
      te: 'ఎడమ అరచేతిని కుడి తొడపై ఉంచండి. కుడి అరచేతిని దానిపై ఉంచండి. సంకల్పం చెప్పండి.',
      en: 'Place the left palm on the right thigh, right palm on top. State your intention with devotion.',
    },
  },
  {
    id: 4,
    nameKey: 'puja.step.dhyanam',
    nameSanskrit: 'ध्यानम्',
    nameEnglish: 'Meditation',
    duration: 120,
    icon: 'lotus',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'शुक्लाम्बरधरं विष्णुं शशिवर्णं चतुर्भुजम्।\nप्रसन्नवदनं ध्यायेत् सर्वविघ्नोपशान्तये॥\n\nवक्रतुण्ड महाकाय सूर्यकोटि समप्रभ।\nनिर्विघ्नं कुरु मे देव सर्वकार्येषु सर्वदा॥',
      telugu:
        'శుక్లాంబరధరం విష్ణుం శశివర్ణం చతుర్భుజమ్।\nప్రసన్నవదనం ధ్యాయేత్ సర్వవిఘ్నోపశాంతయే॥\n\nవక్రతుండ మహాకాయ సూర్యకోటి సమప్రభ।\nనిర్విఘ్నం కురు మే దేవ సర్వకార్యేషు సర్వదా॥',
      english:
        'We meditate upon the one who wears white garments, who is all-pervading, bright as the moon, with four arms and a pleasant face — for the removal of all obstacles.\n\nO Lord with the curved trunk, mighty body, and the brilliance of a crore suns, make all my endeavors free of obstacles, always.',
      source: 'Ganapathi Dhyana Shloka',
    },
    instructions: {
      te: 'కళ్ళు మూసుకుని, గణపతిని మీ హృదయంలో ధ్యానించండి. ఎర్రని వర్ణం, నాలుగు చేతులు, ఏకదంతం, ప్రసన్న వదనం.',
      en: 'Close your eyes. Visualize Lord Ganapathi in your heart — red complexion, four arms, single tusk, pleasant face, seated on a lotus.',
    },
  },
  {
    id: 5,
    nameKey: 'puja.step.gandham',
    nameSanskrit: 'गन्धम्',
    nameEnglish: 'Sandalwood Paste',
    duration: 30,
    icon: 'lotus',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'अष्टगन्धसमायुक्तं गन्धं रक्तं गजानन।\nद्वादशाङ्गेषु ते ढुण्ढे लेपयामि सुचित्रवत्॥\nश्री महागणपतये नमः। गन्धं समर्पयामि॥',
      telugu:
        'అష్టగంధసమాయుక్తం గంధం రక్తం గజానన।\nద్వాదశాంగేషు తే ఢుణ్ఢే లేపయామి సుచిత్రవత్॥\nశ్రీ మహాగణపతయే నమః। గంధం సమర్పయామి॥',
      english:
        'O elephant-faced Lord, I anoint your twelve limbs with this fragrant red sandalwood paste mixed with eight fragrances, beautifully.\nI offer this sandalwood paste to Sri Maha Ganapathi.',
      source: 'Ganapathi Panchopachara Puja',
    },
    instructions: {
      te: 'గంధం లేదా కుంకుమ తీసుకుని విగ్రహానికి అలంకరించండి. మానస పూజలో, మనసులో అర్పించండి.',
      en: 'Apply sandalwood paste or kumkum to the deity. In Manasa Pooja, offer it mentally with devotion.',
    },
  },
  {
    id: 6,
    nameKey: 'puja.step.pushpam',
    nameSanskrit: 'पुष्पम्',
    nameEnglish: 'Flowers',
    duration: 30,
    icon: 'lotus',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'चम्पकादिसुवृक्षेभ्यः सम्भूतानि गजानन।\nपुष्पाणि शमीमन्दारदूर्वादीनि गृहाण च॥\nश्री महागणपतये नमः। पुष्पं समर्पयामि॥',
      telugu:
        'చంపకాదిసువృక్షేభ్యః సంభూతాని గజానన।\nపుష్పాణి శమీమందారదూర్వాదీని గృహాణ చ॥\nశ్రీ మహాగణపతయే నమః। పుష్పం సమర్పయామి॥',
      english:
        'O elephant-faced Lord, accept these flowers — champaka, shami, mandara, and durva grass — born from the finest trees.\nI offer these flowers to Sri Maha Ganapathi.',
      source: 'Ganapathi Panchopachara Puja',
    },
    instructions: {
      te: 'తాజా పూలు లేదా దూర్వాంకురాలను విగ్రహానికి అర్పించండి.',
      en: 'Offer fresh flowers or durva grass to the deity.',
    },
  },
  {
    id: 7,
    nameKey: 'puja.step.dhoopam',
    nameSanskrit: 'धूपम्',
    nameEnglish: 'Incense',
    duration: 30,
    icon: 'diya',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'दशाङ्गं गुग्गुलं धूपं सर्वसौरभकारकम्।\nगृहाण त्वं मया दत्तं विनायक महोदर॥\nश्री महागणपतये नमः। धूपं आघ्रापयामि॥',
      telugu:
        'దశాంగం గుగ్గులం ధూపం సర్వసౌరభకారకమ్।\nగృహాణ త్వం మయా దత్తం వినాయక మహోదర॥\nశ్రీ మహాగణపతయే నమః। ధూపం ఆఘ్రాపయామి॥',
      english:
        'O Vinayaka of great form, accept this fragrant incense of guggul and ten ingredients that fills everything with divine fragrance.\nI offer this incense to Sri Maha Ganapathi.',
      source: 'Ganapathi Panchopachara Puja',
    },
    instructions: {
      te: 'అగరబత్తి వెలిగించి, విగ్రహం ముందు ఊపండి.',
      en: 'Light the incense stick and wave it before the deity.',
    },
  },
  {
    id: 8,
    nameKey: 'puja.step.deepam',
    nameSanskrit: 'दीपम्',
    nameEnglish: 'Lamp',
    duration: 30,
    icon: 'diya',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'नानाजातिभवं दीपं गृहाण गणनायक।\nअज्ञानमलजं दीपं हरन्तं ज्योतिरूपकम्॥\nश्री महागणपतये नमः। दीपं दर्शयामि॥',
      telugu:
        'నానాజాతిభవం దీపం గృహాణ గణనాయక।\nఅజ్ఞానమలజం దీపం హరంతం జ్యోతిరూపకమ్॥\nశ్రీ మహాగణపతయే నమః। దీపం దర్శయామి॥',
      english:
        'O Lord of the Ganas, accept this lamp that dispels the darkness of ignorance and shines as the form of divine light.\nI show this lamp to Sri Maha Ganapathi.',
      source: 'Ganapathi Panchopachara Puja',
    },
    instructions: {
      te: 'నెయ్యి లేదా నూనె దీపం వెలిగించి, దేవుని ముందు చూపించండి.',
      en: 'Light a ghee or oil lamp and show it before the deity in a clockwise motion.',
    },
  },
  {
    id: 9,
    nameKey: 'puja.step.naivedyam',
    nameSanskrit: 'नैवेद्यम्',
    nameEnglish: 'Food Offering',
    duration: 60,
    icon: 'kalash',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'चतुर्विधान्नसम्पन्नं मधुरं लड्डुकादिकम्।\nनैवेद्यं ते मया दत्तं भोजनं कुरु विघ्नप॥\nश्री महागणपतये नमः। नैवेद्यं समर्पयामि॥\n\nॐ प्राणाय स्वाहा। ॐ अपानाय स्वाहा।\nॐ व्यानाय स्वाहा। ॐ उदानाय स्वाहा।\nॐ समानाय स्वाहा। ॐ ब्रह्मणे स्वाहा॥',
      telugu:
        'చతుర్విధాన్నసంపన్నం మధురం లడ్డుకాదికమ్।\nనైవేద్యం తే మయా దత్తం భోజనం కురు విఘ్నప॥\nశ్రీ మహాగణపతయే నమః। నైవేద్యం సమర్పయామి॥\n\nఓం ప్రాణాయ స్వాహా। ఓం అపానాయ స్వాహా।\nఓం వ్యానాయ స్వాహా। ఓం ఉదానాయ స్వాహా।\nఓం సమానాయ స్వాహా। ఓం బ్రహ్మణే స్వాహా॥',
      english:
        'O remover of obstacles, accept this food offering of four kinds of food, sweets, and laddus prepared by me. Please partake of this meal.\nI offer this naivedya to Sri Maha Ganapathi.\n\nOm, this is offered to Prana, Apana, Vyana, Udana, Samana, and to Brahman.',
      source: 'Ganapathi Panchopachara Puja',
    },
    instructions: {
      te: 'పండ్లు, లడ్డు లేదా ఏదైనా ఆహారం దేవుని ముందు ఉంచి, నీళ్ళు చల్లి నైవేద్యం సమర్పించండి.',
      en: 'Place fruit, laddu, or any food before the deity. Sprinkle water around it and offer with the mantra.',
    },
  },
  {
    id: 10,
    nameKey: 'puja.step.prarthana',
    nameSanskrit: 'प्रार्थना',
    nameEnglish: 'Closing Prayer',
    duration: 120,
    icon: 'bell',
    hasBreathingGuide: false,
    mantra: {
      devanagari:
        'अपराधानसङ्ख्यातान् क्षमस्व गणनायक।\nअनेन पञ्चोपचार पूजनेन\nश्री महागणपतिः प्रीयताम्॥\n\nकायेन वाचा मनसेन्द्रियैर्वा\nबुद्ध्यात्मना वा प्रकृतेः स्वभावात्।\nकरोमि यद्यत् सकलं परस्मै\nनारायणायेति समर्पयामि॥\n\nॐ शान्तिः शान्तिः शान्तिः॥',
      telugu:
        'అపరాధానసంఖ్యాతాన్ క్షమస్వ గణనాయక।\nఅనేన పంచోపచార పూజనేన\nశ్రీ మహాగణపతిః ప్రీయతామ్॥\n\nకాయేన వాచా మనసేంద్రియైర్వా\nబుద్ధ్యాత్మనా వా ప్రకృతేః స్వభావాత్।\nకరోమి యద్యత్ సకలం పరస్మై\nనారాయణాయేతి సమర్పయామి॥\n\nఓం శాంతిః శాంతిః శాంతిః॥',
      english:
        'O Lord of the Ganas, forgive my countless transgressions. May Sri Maha Ganapathi be pleased with this Panchopachara Puja.\n\nWhatever I do with body, speech, mind, senses, intellect, or by nature — I offer all of it to the Supreme Lord Narayana.\n\nOm Peace, Peace, Peace.',
      source: 'Ganapathi Panchopachara Puja / Panduranga Ashtakam',
    },
    instructions: {
      te: 'చేతులు జోడించి, హృదయపూర్వకంగా ప్రార్థన చేయండి. గణపతికి నమస్కరించండి.',
      en: 'Join your palms in Namaste. Pray with all your heart. Bow to Lord Ganapathi.',
    },
  },
];

export const PUJA_ITEMS_NEEDED = {
  te: ['నీళ్ళు', 'గంధం / కుంకుమ', 'పూలు / దూర్వాంకురాలు', 'అగరబత్తి', 'దీపం (నెయ్యి/నూనె)', 'నైవేద్యం (పండు / లడ్డు)'],
  en: ['Water', 'Sandalwood paste / Kumkum', 'Flowers / Durva grass', 'Incense stick', 'Lamp (ghee or oil)', 'Fruit / Sweet offering'],
};

export const TOTAL_DURATION = 600; // 10 minutes in seconds

export const PUJA_META = {
  title: { te: 'గణపతి పంచోపచార పూజ', en: 'Ganapathi Panchopachara Puja' },
  subtitle: { te: 'మానస పూజ • 10 నిమిషాలు', en: 'Manasa Pooja • 10 minutes' },
  deity: 'Ganapathi',
};
