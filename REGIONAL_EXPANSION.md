# Regional Calendar App Expansion Guide

## Strategy
Each regional calendar is a **separate Play Store app** with its own branding, but shares 95% of the codebase. This is the proven approach used by DrikPanchang, ProKerala, and other successful panchangam apps.

| App | Name | Package ID | Default Language | Default Location |
|-----|------|-----------|-----------------|-----------------|
| Telugu (LIVE) | మనCalendar | com.manacalendar.app | Telugu (te) | Hyderabad |
| Tamil | நம் Calendar | com.namcalendar.app | Tamil (ta) | Chennai |
| Kannada | ನಮ್ಮ Calendar | com.nammacalendar.app | Kannada (kn) | Bengaluru |
| Malayalam | നമ്മുടെ Calendar | com.nammudecalendar.app | Malayalam (ml) | Thiruvananthapuram |

---

## What Changes Per Regional Clone

### 1. Translations File (`src/data/translations.js`)
- Full UI translation in the target language
- All month names, day names, festival names
- Puja instructions, shloka meanings
- ~300 string keys to translate

### 2. Month & Day Names (`src/data/constants.js`)
```
Telugu:  చైత్రం, వైశాఖం, జ్యేష్ఠం...
Tamil:   சித்திரை, வைகாசி, ஆனி...
Kannada: ಚೈತ್ರ, ವೈಶಾಖ, ಜ್ಯೇಷ್ಠ...
Malayalam: ചൈത്രം, വൈശാഖം, ജ്യേഷ്ഠം...
```

### 3. Festival List (`src/data/festivals.js`)
- Core Hindu festivals are shared (Ugadi, Diwali, Sankranti, Ekadashi etc.)
- Region-specific festivals to ADD:

**Tamil:**
- Pongal (Thai Pongal, Mattu Pongal, Kaanum Pongal)
- Tamil New Year (Puthandu)
- Aadi Perukku, Karthigai Deepam
- Thirukarthigai, Panguni Uthiram
- Chithirai Thiruvizha

**Kannada:**
- Yugadi (same as Ugadi, different name)
- Varamahalakshmi Vrata
- Dasara (Mysuru Dasara is huge)
- Bisu (Tulu New Year)
- Karaga Festival

**Malayalam:**
- Vishu (Kerala New Year)
- Onam (Thiruvonam, Uthradom)
- Thrissur Pooram
- Thiruvathira
- Mandala Pooja season

### 4. Festival Practices (`src/data/festivalPractices.js`)
- Regional variations of same festivals
- E.g., Pongal practices differ from Sankranti practices
- Regional vrata traditions

### 5. Location Data (`src/data/locations.js`)
- Default city changes per region
- Pre-populated cities for that state
- Telugu app: Telangana + AP cities
- Tamil app: Tamil Nadu cities
- Kannada app: Karnataka cities
- Malayalam app: Kerala cities

### 6. Fonts (`src/styles/paper.css`)
```css
/* Telugu (current) */
Noto Sans Telugu

/* Tamil */
@import url('...family=Noto+Sans+Tamil:wght@400;500;600;700...');

/* Kannada */
@import url('...family=Noto+Sans+Kannada:wght@400;500;600;700...');

/* Malayalam */
@import url('...family=Noto+Sans+Malayalam:wght@400;500;600;700...');
```

### 7. App Config (`capacitor.config.ts`, `android/app/build.gradle`)
- Different `appId` (package name)
- Different `appName`
- Different app icon with regional script
- Different Play Store listing

### 8. Shloka Data (`src/data/shlokas.js`)
- Sanskrit shlokas are universal (same Devanagari)
- Regional transliteration changes (Tamil script, Kannada script, Malayalam script)
- Meaning translations in regional language
- May add region-specific devotional content (Thirukkural for Tamil, Dasara Padagalu for Kannada)

---

## What Does NOT Change (Shared Core — 95%)

| Module | Why It's Universal |
|--------|-------------------|
| `panchangam.js` | Astronomical calculations are location-based, not language-based |
| `panchangam-js` library | Same Drik Ganita system works for all |
| `customYogas.js` | Yoga/Karana calculations are universal |
| Canvas share card generators | Same layout, different fonts/text |
| Puja guided flow engine | Same UI, different text |
| Alarm/notification system | Same Capacitor plugins |
| Calendar views (month/year) | Same grid, different labels |
| Muhurta calculations | Same astronomical formulas |
| GPS/Location detection | Same Geolocation API |
| Audio (tanpura, bell) | Same sounds |

---

## Regional Calendar Differences (Important Nuances)

### Solar vs Lunisolar Calendar Systems
| Region | Calendar Type | New Year | Year Start Month |
|--------|-------------|----------|-----------------|
| Telugu | Lunisolar (Chandramana) | Ugadi (Chaitra Shukla Prathama) | Chaitra |
| Tamil | Solar (Sauramana) | Puthandu (Apr 14) | Chithirai |
| Kannada | Lunisolar (Chandramana) | Yugadi (same as Ugadi) | Chaitra |
| Malayalam | Solar (Sauramana) | Vishu (Apr 14-15) | Medam |

**Key difference:** Tamil and Malayalam follow the SOLAR calendar (based on Sun's entry into zodiac signs / Sankranti), while Telugu and Kannada follow the LUNAR calendar (based on Moon's tithi cycle). This affects:
- Month boundaries (solar months vs lunar months)
- New Year date
- Some festival date calculations

Our `panchangam-js` library supports both `calendarType: 'amanta'` (lunar) and solar calculations via Sankranti detection (`findSankrantisInRange`).

### Amanta vs Purnimanta
| Region | System | Month ends on |
|--------|--------|--------------|
| Telugu (South) | Amanta | Amavasya (new moon) |
| Kannada (South) | Amanta | Amavasya |
| Tamil | Solar | Sankranti (sun transit) |
| Malayalam | Solar | Sankranti |
| North India | Purnimanta | Purnima (full moon) |

Our app uses Amanta (`calendarType: 'amanta'`). For North Indian expansion (Hindi, Gujarati, Marathi), switch to Purnimanta.

### Ayanamsha
All Drik Panchang-compatible apps use **Lahiri Ayanamsha** (Chitrapaksha). This is standard across South India. Our library uses Lahiri by default. No change needed for regional clones.

---

## Step-by-Step Clone Process

### Phase 1: Setup (~30 minutes)
1. Clone the repo to a new directory
2. Change `capacitor.config.ts` → new `appId`, `appName`
3. Change `android/app/build.gradle` → new `applicationId`, `versionCode: 1`
4. Generate new app icon with regional script
5. Generate new signing keystore

### Phase 2: Translations (~4-6 hours per language)
1. Copy `translations.js` → translate all ~300 keys
2. Update `constants.js` — month names, day names in target script
3. Update festival names in `festivals.js`
4. Translate `festivalPractices.js` content
5. Add regional script transliteration to shlokas
6. Update puja data files with regional translations

### Phase 3: Regional Customization (~2-3 hours)
1. Add region-specific festivals
2. Add regional cities to `locations.js`
3. Set default location
4. Add regional Google Font to `paper.css`
5. If Tamil/Malayalam: implement solar calendar month display

### Phase 4: Testing & Launch (~2-3 hours)
1. Test all calculations against ProKerala/DrikPanchang for that region
2. Test fonts render correctly
3. Test share cards generate with correct script
4. Build APK/AAB
5. Create Play Store listing in regional language
6. Submit for review

---

## AI Translation Strategy

For efficiency, use Claude/GPT to translate the bulk content:
- Feed the full `translations.js` with context about the app
- Provide 5-10 example translations done by a native speaker as reference
- AI generates the rest, native speaker reviews
- Repeat for festival practices, puja instructions

**Critical: Get native speaker review for:**
- Festival names (regional variations matter)
- Puja mantras (must be accurate)
- Religious/spiritual terminology
- Colloquial phrases that AI might get wrong

---

## Revenue Considerations

Each regional app can be monetized independently:
- Separate ad placement (if added later)
- Regional sponsor opportunities (local temples, astrologers)
- Premium features per region
- Each app builds its own review count and ranking

---

## Priority Order for Expansion

1. **Kannada** — closest to Telugu (same Chandramana system, similar festivals, same Ugadi)
2. **Tamil** — large market but needs solar calendar support
3. **Malayalam** — similar to Tamil (solar calendar), smaller but devoted market
4. **Hindi** — huge market but needs Purnimanta system + North Indian festivals

---

## Technical Debt to Fix Before Cloning

- [ ] Extract all hardcoded Telugu strings into translations.js
- [ ] Make font family configurable (not hardcoded 'Noto Sans Telugu')
- [ ] Abstract calendar type (amanta/purnimanta/solar) into config
- [ ] Make share card text configurable per language
- [ ] Create a `config.js` that holds all region-specific constants
