const translations = {
  te: {
    // App
    'app.loading': 'పంచాంగం',

    // Tab bar
    'tab.panchangam': 'పంచాంగం',
    'tab.puja': 'పూజ',
    'tab.jyotish': 'జ్యోతిష్',
    'tab.settings': 'సెట్టింగ్స్',

    // Page (daily calendar)
    'page.nakshatra': 'నక్షత్రం',
    'page.yogam': 'యోగం',
    'page.karanam': 'కరణం',
    'page.rahu': 'రాహు',
    'page.varjyam': 'వర్జ్యం',
    'page.durmuhurtham': 'దుర్ము.',
    'page.samvatsaram': 'శ్రీ పరాభవ నామ సంవత్సరం',

    // CalendarPad
    'cal.teluguMonth': 'తెలుగు నెల',
    'cal.englishMonth': 'ఇంగ్లీష్ నెల',
    'cal.day': 'రోజు',
    'cal.changeMonth': 'నెల మార్చండి',

    // ShareButton
    'share.panchangam': 'పంచాంగం పంపండి',
    'share.greeting': 'శుభోదయం',
    'share.sunrise': 'సూర్యోదయం',
    'share.sunset': 'సూర్యాస్తమయం',
    'share.nakshatra': 'నక్షత్రం',
    'share.yogam': 'యోగం',
    'share.rahu': 'రాహు',
    'share.varjyam': 'వర్జ్యం',
    'share.durmuhurtham': 'దుర్ము.',
    'share.cityPanchangam': 'పంచాంగం',

    // FestivalWishes
    'wishes.send': 'Wishes పంపండి',
    'wishes.header': 'శ్రీ పరాభవ నామ సంవత్సర {festival} శుభాకాంక్షలు',

    // AddToHomeScreen
    'pwa.add': 'హోమ్ స్క్రీన్ కు జోడించండి',
    'pwa.guideTitle': 'హోమ్ స్క్రీన్ కు జోడించడం',
    'pwa.step1': 'Safari లో <strong>Share</strong> బటన్ నొక్కండి (⬆ icon)',
    'pwa.step2': '<strong>"Add to Home Screen"</strong> ఎంచుకోండి',
    'pwa.step3': '<strong>"Add"</strong> నొక్కండి',
    'pwa.understood': 'అర్థమైంది',

    // LocationPicker
    'loc.title': 'ప్రాంతం ఎంచుకోండి',
    'loc.subtitle': 'Select Location',
    'loc.india': 'భారతదేశం',
    'loc.usa': 'అమెరికా (USA)',
    'loc.geoLoading': 'గుర్తిస్తోంది...',
    'loc.geoButton': 'నా ఖచ్చితమైన లొకేషన్ వాడండి',
    'loc.geoSub': 'Use my exact location',

    // MonthView
    'month.amavasya': 'అమావాస్య',
    'month.purnima': 'పూర్ణిమ',
    'month.days': ['ఆది', 'సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని'],

    // PujaPage
    'puja.title': 'పూజ & స్తోత్రాలు',
    'puja.subtitle': 'Daily puja audios — coming soon',
    'puja.dailyTitle': 'నిత్య పూజలు',
    'puja.dailySub': 'Daily Pujas',
    'puja.stotraTitle': 'స్తోత్రాలు',
    'puja.stotraSub': 'Stotras',
    'puja.comingSoon': 'పూజ ఆడియోలు త్వరలో వస్తాయి',
    'puja.comingSoonSub': 'Audio-guided pujas with bell timings, mantras, and step-by-step instructions',
    'puja.min': 'నిమి',
    'puja.items': [
      { name: 'గణపతి పూజ', duration: '10', icon: 'diya' },
      { name: 'శివ పూజ', duration: '10', icon: 'trishul' },
      { name: 'విష్ణు పూజ', duration: '10', icon: 'lotus' },
      { name: 'లక్ష్మీ పూజ', duration: '10', icon: 'lotus' },
      { name: 'సరస్వతి పూజ', duration: '10', icon: 'mala' },
      { name: 'హనుమాన్ పూజ', duration: '10', icon: 'namaste' },
    ],
    'puja.stotras': [
      { name: 'విష్ణు సహస్రనామం', duration: '20', icon: 'scroll' },
      { name: 'లలితా సహస్రనామం', duration: '25', icon: 'scroll' },
      { name: 'ఆదిత్య హృదయం', duration: '10', icon: 'sun' },
      { name: 'హనుమాన్ చాలీసా', duration: '8', icon: 'mala' },
    ],

    // JyotishPage
    'jyotish.title': 'జ్యోతిష్యం',
    'jyotish.subtitle': 'Vedic Astrology',
    'jyotish.todayTitle': 'నేటి గ్రహ స్థితి',
    'jyotish.tithi': 'తిథి',
    'jyotish.nakshatra': 'నక్షత్రం',
    'jyotish.yogam': 'యోగం',
    'jyotish.karanam': 'కరణం',
    'jyotish.rashiTitle': 'రాశి ఫలాలు',
    'jyotish.rashiSub': 'Daily Horoscope — coming soon',
    'jyotish.birthChart': 'జాతక చక్రం & వ్యక్తిగత ఫలాలు',
    'jyotish.birthChartSub': 'Enter your birth details for personalized Kundli, Dasha periods, and transit predictions',

    // SettingsPage
    'settings.title': 'సెట్టింగ్స్',
    'settings.subtitle': 'Settings',
    'settings.location': 'ప్రదేశం',
    'settings.notifications': 'నోటిఫికేషన్లు',
    'settings.festivalReminder': 'పండుగ రిమైండర్',
    'settings.festivalReminderSub': 'Festival reminders a day before',
    'settings.morningPuja': 'ఉదయ పూజ గుర్తు',
    'settings.morningPujaSub': 'Morning puja reminder',
    'settings.sunriseSunset': 'సూర్యోదయ/అస్తమయం',
    'settings.sunriseSunsetSub': 'Sunrise & sunset alerts',
    'settings.comingSoon': 'త్వరలో వస్తుంది',
    'settings.language': 'భాష',
    'settings.about': 'గురించి',
    'settings.year': 'సంవత్సరం',
    'settings.yearValue': 'శ్రీ పరాభవ నామ సంవత్సరం',
  },

  en: {
    // App
    'app.loading': 'Panchangam',

    // Tab bar
    'tab.panchangam': 'Panchangam',
    'tab.puja': 'Puja',
    'tab.jyotish': 'Jyotish',
    'tab.settings': 'Settings',

    // Page (daily calendar)
    'page.nakshatra': 'Nakshatra',
    'page.yogam': 'Yogam',
    'page.karanam': 'Karanam',
    'page.rahu': 'Rahu',
    'page.varjyam': 'Varjyam',
    'page.durmuhurtham': 'Durmu.',
    'page.samvatsaram': 'Sri Parabhava Nama Samvatsaram',

    // CalendarPad
    'cal.teluguMonth': 'Telugu Month',
    'cal.englishMonth': 'English Month',
    'cal.day': 'Day',
    'cal.changeMonth': 'Change month',

    // ShareButton
    'share.panchangam': 'Share Panchangam',
    'share.greeting': 'Good Morning',
    'share.sunrise': 'Sunrise',
    'share.sunset': 'Sunset',
    'share.nakshatra': 'Nakshatra',
    'share.yogam': 'Yogam',
    'share.rahu': 'Rahu',
    'share.varjyam': 'Varjyam',
    'share.durmuhurtham': 'Durmu.',
    'share.cityPanchangam': 'Panchangam',

    // FestivalWishes
    'wishes.send': 'Send Wishes',
    'wishes.header': 'Sri Parabhava Nama Samvatsara {festival} wishes',

    // AddToHomeScreen
    'pwa.add': 'Add to Home Screen',
    'pwa.guideTitle': 'Add to Home Screen',
    'pwa.step1': 'Tap the <strong>Share</strong> button in Safari (⬆ icon)',
    'pwa.step2': 'Select <strong>"Add to Home Screen"</strong>',
    'pwa.step3': 'Tap <strong>"Add"</strong>',
    'pwa.understood': 'Got it',

    // LocationPicker
    'loc.title': 'Select Location',
    'loc.subtitle': 'Choose your city',
    'loc.india': 'India',
    'loc.usa': 'USA',
    'loc.geoLoading': 'Detecting...',
    'loc.geoButton': 'Use my exact location',
    'loc.geoSub': 'GPS-based location',

    // MonthView
    'month.amavasya': 'Amavasya',
    'month.purnima': 'Purnima',
    'month.days': ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],

    // PujaPage
    'puja.title': 'Puja & Stotras',
    'puja.subtitle': 'Daily puja audios — coming soon',
    'puja.dailyTitle': 'Daily Pujas',
    'puja.dailySub': 'Nitya Puja',
    'puja.stotraTitle': 'Stotras',
    'puja.stotraSub': 'Hymns & Chants',
    'puja.comingSoon': 'Puja audios coming soon',
    'puja.comingSoonSub': 'Audio-guided pujas with bell timings, mantras, and step-by-step instructions',
    'puja.min': 'min',
    'puja.items': [
      { name: 'Ganapati Puja', duration: '10', icon: 'diya' },
      { name: 'Shiva Puja', duration: '10', icon: 'trishul' },
      { name: 'Vishnu Puja', duration: '10', icon: 'lotus' },
      { name: 'Lakshmi Puja', duration: '10', icon: 'lotus' },
      { name: 'Saraswati Puja', duration: '10', icon: 'mala' },
      { name: 'Hanuman Puja', duration: '10', icon: 'namaste' },
    ],
    'puja.stotras': [
      { name: 'Vishnu Sahasranamam', duration: '20', icon: 'scroll' },
      { name: 'Lalita Sahasranamam', duration: '25', icon: 'scroll' },
      { name: 'Aditya Hrudayam', duration: '10', icon: 'sun' },
      { name: 'Hanuman Chalisa', duration: '8', icon: 'mala' },
    ],

    // JyotishPage
    'jyotish.title': 'Jyotish',
    'jyotish.subtitle': 'Vedic Astrology',
    'jyotish.todayTitle': "Today's Planetary Position",
    'jyotish.tithi': 'Tithi',
    'jyotish.nakshatra': 'Nakshatra',
    'jyotish.yogam': 'Yogam',
    'jyotish.karanam': 'Karanam',
    'jyotish.rashiTitle': 'Rashi Predictions',
    'jyotish.rashiSub': 'Daily Horoscope — coming soon',
    'jyotish.birthChart': 'Birth Chart & Personal Predictions',
    'jyotish.birthChartSub': 'Enter your birth details for personalized Kundli, Dasha periods, and transit predictions',

    // SettingsPage
    'settings.title': 'Settings',
    'settings.subtitle': '',
    'settings.location': 'Location',
    'settings.notifications': 'Notifications',
    'settings.festivalReminder': 'Festival Reminder',
    'settings.festivalReminderSub': 'Reminders a day before festivals',
    'settings.morningPuja': 'Morning Puja Reminder',
    'settings.morningPujaSub': 'Daily morning puja alert',
    'settings.sunriseSunset': 'Sunrise/Sunset',
    'settings.sunriseSunsetSub': 'Sunrise & sunset alerts',
    'settings.comingSoon': 'Coming soon',
    'settings.language': 'Language',
    'settings.about': 'About',
    'settings.year': 'Year',
    'settings.yearValue': 'Sri Parabhava Nama Samvatsaram',
  },
};

export default translations;
