/**
 * Simple card renderer — background image + text overlay.
 * No complex layers. Just draw the background, then draw text on top.
 *
 * Supports Telugu and English based on language parameter.
 */

import { wrapText, drawBranding, ensureFonts } from './cardUtils.js';

const ASSET_BASE = '/assets/greetings';
const FONT_FILES = {
  'Mandali': `${ASSET_BASE}/fonts/Mandali-Regular.ttf`,
  'NotoSansTelugu': `${ASSET_BASE}/fonts/NotoSansTelugu-Regular.ttf`,
  'NotoSansTelugu-Bold': `${ASSET_BASE}/fonts/NotoSansTelugu-Bold.ttf`,
};

const loadedFonts = new Set();

async function loadFonts() {
  const toLoad = [
    ['Mandali', FONT_FILES['Mandali'], {}],
    ['Noto Sans Telugu', FONT_FILES['NotoSansTelugu'], {}],
    ['Noto Sans Telugu', FONT_FILES['NotoSansTelugu-Bold'], { weight: 'bold' }],
  ];

  const promises = [];
  for (const [family, url, descriptors] of toLoad) {
    const key = `${family}-${descriptors.weight || 'normal'}`;
    if (loadedFonts.has(key)) continue;
    const font = new FontFace(family, `url(${url})`, descriptors);
    promises.push(
      font.load().then(f => {
        document.fonts.add(f);
        loadedFonts.add(key);
      }).catch(() => {})
    );
  }
  if (promises.length > 0) await Promise.all(promises);
  await ensureFonts();
}

function loadImage(src) {
  return new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

// ─── HELPERS ──────────────────────────────────────────────

/** Safely extract a string from panchangam data fields (which may be objects or strings) */
function str(val, lang) {
  if (val == null) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object') {
    if (lang === 'en') return val.nameEn || val.english || val.name || val.telugu || '';
    return val.name || val.telugu || val.nameEn || val.english || '';
  }
  return String(val);
}

/** Format the date header line */
function dateHeader(data, lang) {
  if (lang === 'en') {
    return `${data.englishDay || ''}, ${data.dateNum || ''} ${data.englishMonth || ''} ${data.year || ''}`;
  }
  // Telugu: వారం, తేదీ
  const paksha = data.paksha || '';
  const tithi = str(data.tithi, 'te');
  const masam = str(data.masam, 'te');
  return `${masam} ${paksha} ${tithi}`;
}

/** Format the sub-header line */
function dateSubHeader(data, lang) {
  if (lang === 'en') {
    const masam = str(data.masam, 'en');
    const paksha = data.pakshaEn || '';
    const tithi = str(data.tithi, 'en');
    return `${masam} ${paksha} ${tithi}`;
  }
  return `${data.dateNum || ''} ${data.englishMonth || ''} ${data.year || ''}, ${data.vaaram || ''}`;
}

/** Build panchangam rows based on language */
function buildPanchangamRows(data, lang) {
  const te = lang !== 'en';
  const rows = [];

  const add = (labelTe, labelEn, val) => {
    const v = str(val, lang);
    if (v && v !== '--') rows.push([te ? labelTe : labelEn, v]);
  };

  add('తిథి', 'Tithi', data.tithi);
  add('నక్షత్రం', 'Nakshatra', data.nakshatra);
  add('యోగం', 'Yoga', data.yogam);
  add('కరణం', 'Karana', data.karanam);

  // Divider
  rows.push(null);

  add('సూర్యోదయం', 'Sunrise', data.sunrise);
  add('సూర్యాస్తమయం', 'Sunset', data.sunset);
  add('రాహుకాలం', 'Rahu Kalam', data.rahuKalam);
  add('వర్జ్యం', 'Varjyam', data.varjyam);

  // Durmuhurtham can be an array
  if (data.durmuhurtham) {
    const dm = Array.isArray(data.durmuhurtham)
      ? data.durmuhurtham.join(', ')
      : String(data.durmuhurtham);
    if (dm && dm !== '--') {
      rows.push([te ? 'దుర్ముహూర్తం' : 'Durmuhurtham', dm]);
    }
  }

  return rows;
}

// ─── DAILY PANCHANGAM CARD ────────────────────────────────

/**
 * Render a daily panchangam card.
 * @param {Object} template - from DAILY_TEMPLATES
 * @param {Object} data - panchangam data from the app
 * @param {string} [customName] - optional user name
 * @param {string} [lang='te'] - 'te' for Telugu, 'en' for English
 * @returns {Promise<Blob>}
 */
export async function renderDailyCard(template, data, customName, lang = 'te') {
  const [bgImg] = await Promise.all([
    loadImage(template.image),
    loadFonts(),
  ]);

  // Match background aspect ratio
  const width = 1080;
  const height = bgImg ? Math.round(width * (bgImg.naturalHeight / bgImg.naturalWidth)) : 1350;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const c = canvas.getContext('2d');
  c.imageSmoothingEnabled = true;
  c.imageSmoothingQuality = 'high';

  // Draw background
  if (bgImg) {
    c.drawImage(bgImg, 0, 0, width, height);
  } else {
    c.fillStyle = '#FFF8F0';
    c.fillRect(0, 0, width, height);
  }

  const mx = width * ((1 - template.maxWidth) / 2);
  const contentW = width * template.maxWidth;
  const cx = width / 2;

  // ── Header ──
  let y = height * template.headerY;
  c.textAlign = 'center';
  c.textBaseline = 'top';

  c.fillStyle = template.accentColor;
  c.font = `bold 40px "Mandali", sans-serif`;
  const headerText = dateHeader(data, lang);
  const headerLines = wrapText(c, headerText, contentW);
  for (const line of headerLines) {
    c.fillText(line, cx, y);
    y += 48;
  }

  // ── Sub-header ──
  y += 4;
  c.fillStyle = template.textColorSecondary;
  c.font = `24px "Noto Sans Telugu", sans-serif`;
  c.fillText(dateSubHeader(data, lang), cx, y, contentW);
  y += 36;

  // ── Festival badge ──
  if (data.festival) {
    const festText = lang === 'en' ? (data.festival.english || '') : (data.festival.telugu || '');
    if (festText) {
      c.font = `bold 26px "Mandali", sans-serif`;
      const tw = c.measureText(festText).width;
      const badgeW = tw + 40;
      const badgeH = 38;
      const badgeX = cx - badgeW / 2;

      c.fillStyle = template.accentColor;
      c.globalAlpha = 0.15;
      c.beginPath();
      c.roundRect(badgeX, y, badgeW, badgeH, 19);
      c.fill();
      c.globalAlpha = 1;

      c.fillStyle = template.accentColor;
      c.fillText(festText, cx, y + 5, contentW);
      y += 48;
    }
  }

  // ── Panchangam rows ──
  const startY = Math.max(y + 8, height * template.contentY);
  const endY = height * template.contentEndY;
  const rows = buildPanchangamRows(data, lang);
  const totalRows = rows.filter(r => r !== null).length;
  const availableH = endY - startY;
  const rowH = Math.min(availableH / (totalRows + 1), 48);
  let ry = startY;

  for (const row of rows) {
    if (row === null) {
      c.strokeStyle = template.accentColor;
      c.globalAlpha = 0.3;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(mx + 20, ry + rowH * 0.3);
      c.lineTo(width - mx - 20, ry + rowH * 0.3);
      c.stroke();
      c.globalAlpha = 1;
      ry += rowH * 0.5;
      continue;
    }

    const [label, value] = row;
    const fontSize = Math.min(24, rowH * 0.55);

    c.textAlign = 'left';
    c.fillStyle = template.textColorSecondary;
    c.font = `${fontSize}px "Noto Sans Telugu", sans-serif`;
    c.fillText(label, mx + 20, ry);

    c.textAlign = 'right';
    c.fillStyle = template.textColor;
    c.font = `bold ${fontSize}px "Noto Sans Telugu", sans-serif`;
    c.fillText(value, width - mx - 20, ry);

    ry += rowH;
  }

  // ── Custom name ──
  if (customName) {
    c.textAlign = 'center';
    c.fillStyle = template.textColorSecondary;
    c.font = `22px "Noto Sans Telugu", sans-serif`;
    c.fillText(customName, cx, height * 0.92, contentW);
  }

  // ── Branding ──
  drawBranding(c, width, height * 0.97);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => blob ? resolve(blob) : reject(new Error('toBlob failed')),
      'image/jpeg', 0.90
    );
  });
}

// ─── FESTIVAL GREETING CARD ───────────────────────────────

/**
 * Render a festival greeting card.
 * @param {Object} template - from FESTIVAL_TEMPLATES
 * @param {Object} festival - festival object { telugu, english }
 * @param {Object} greetingConfig - from festivalGreetings.js
 * @param {number} quoteIndex - which quote to use
 * @param {string} [customName] - optional user name
 * @param {string} [lang='te'] - 'te' for Telugu, 'en' for English
 * @returns {Promise<Blob>}
 */
export async function renderFestivalCard(template, festival, greetingConfig, quoteIndex, customName, lang = 'te') {
  const [bgImg] = await Promise.all([
    loadImage(template.image),
    loadFonts(),
  ]);

  const width = 1080;
  const height = bgImg ? Math.round(width * (bgImg.naturalHeight / bgImg.naturalWidth)) : 1080;

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const c = canvas.getContext('2d');
  c.imageSmoothingEnabled = true;
  c.imageSmoothingQuality = 'high';

  if (bgImg) {
    c.drawImage(bgImg, 0, 0, width, height);
  } else {
    c.fillStyle = '#FFF8F0';
    c.fillRect(0, 0, width, height);
  }

  const cx = width / 2;
  const contentW = width * template.maxWidth;
  c.textAlign = 'center';
  c.textBaseline = 'top';

  // Skip text overlay for pre-rendered templates (background already has text)
  if (!template.preRendered) {
    // ── Greeting text ──
    let greetingText;
    if (lang === 'en') {
      greetingText = `Happy ${festival?.english || 'Festival'}!`;
    } else {
      greetingText = greetingConfig?.greetingText || `${festival?.telugu || ''} శుభాకాంక్షలు`;
    }

    c.fillStyle = template.textColor;
    c.font = `bold 46px "Mandali", sans-serif`;
    const greetingLines = wrapText(c, greetingText, contentW);
    let gy = height * template.greetingY;
    for (const line of greetingLines) {
      c.fillText(line, cx, gy);
      gy += 56;
    }

    // ── Secondary text ──
    let secondaryText;
    if (lang === 'en') {
      secondaryText = greetingConfig?.quotes?.[quoteIndex]?.meaning || '';
    } else {
      secondaryText = greetingConfig?.secondaryText || '';
    }
    if (secondaryText) {
      c.fillStyle = template.textColorSecondary;
      c.font = `bold 30px "Noto Sans Telugu", sans-serif`;
      const secLines = wrapText(c, secondaryText, contentW);
      let sy = height * template.secondaryY;
      for (const line of secLines) {
        c.fillText(line, cx, sy);
        sy += 38;
      }
    }

    // ── Quote ──
    if (greetingConfig?.quotes?.length > 0) {
      const quote = greetingConfig.quotes[quoteIndex % greetingConfig.quotes.length];
      const quoteText = lang === 'en' ? quote.meaning : quote.telugu;
      if (quoteText) {
        c.fillStyle = template.textColorSecondary;
        c.font = `24px "Noto Sans Telugu", sans-serif`;
        const quoteLines = wrapText(c, `"${quoteText}"`, contentW * 0.85);
        let qy = height * template.quoteY;
        for (const line of quoteLines) {
          c.fillText(line, cx, qy);
          qy += 32;
        }
      }
    }
  }

  // ── Custom name ──
  if (customName) {
    c.fillStyle = template.textColor;
    c.font = `24px "Noto Sans Telugu", sans-serif`;
    c.fillText(`— ${customName}`, cx, height * template.nameY, contentW);
  }

  // ── Branding ──
  drawBranding(c, width, height * 0.96);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => blob ? resolve(blob) : reject(new Error('toBlob failed')),
      'image/jpeg', 0.90
    );
  });
}

// ─── THUMBNAIL GENERATOR ──────────────────────────────────

/**
 * Generate a small thumbnail of a card template.
 * Just loads the background image and scales it down — fast.
 */
export async function renderTemplateThumbnail(imagePath) {
  const img = await loadImage(imagePath);
  if (!img) return null;

  const thumbW = 200;
  const thumbH = Math.round(thumbW * (img.naturalHeight / img.naturalWidth));

  const canvas = document.createElement('canvas');
  canvas.width = thumbW;
  canvas.height = thumbH;
  const c = canvas.getContext('2d');
  c.imageSmoothingEnabled = true;
  c.imageSmoothingQuality = 'high';
  c.drawImage(img, 0, 0, thumbW, thumbH);

  return new Promise(resolve => {
    canvas.toBlob(blob => {
      resolve(blob ? URL.createObjectURL(blob) : null);
    }, 'image/jpeg', 0.6);
  });
}
