/**
 * Simple card renderer — background image + text overlay.
 * No complex layers. Just draw the background, then draw text on top.
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

// ─── DAILY PANCHANGAM CARD ────────────────────────────────

/**
 * Render a daily panchangam card.
 * @param {Object} template - from DAILY_TEMPLATES
 * @param {Object} data - panchangam data from the app
 * @param {string} [customName] - optional user name
 * @returns {Promise<Blob>}
 */
export async function renderDailyCard(template, data, customName) {
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

  const mx = width * ((1 - template.maxWidth) / 2); // margin x
  const contentW = width * template.maxWidth;
  const cx = width / 2;

  // ── Header: Telugu date ──
  let y = height * template.headerY;
  c.textAlign = 'center';
  c.textBaseline = 'top';

  c.fillStyle = template.accentColor;
  c.font = `bold 42px "Mandali", sans-serif`;
  c.fillText(data.teluguDate || '', cx, y, contentW);

  // ── Sub-header: English date + day ──
  y += 52;
  c.fillStyle = template.textColorSecondary;
  c.font = `24px "Noto Sans Telugu", sans-serif`;
  const dateStr = [data.gregorianDate, data.dayOfWeek].filter(Boolean).join(' | ');
  c.fillText(dateStr, cx, y, contentW);

  // ── Festival badge (if any) ──
  y += 40;
  if (data.festival?.telugu) {
    c.fillStyle = template.accentColor;
    const festText = data.festival.telugu;
    c.font = `bold 28px "Mandali", sans-serif`;
    const tw = c.measureText(festText).width;
    const badgeW = tw + 40;
    const badgeH = 40;
    const badgeX = cx - badgeW / 2;

    // Badge background
    c.globalAlpha = 0.15;
    c.beginPath();
    c.roundRect(badgeX, y, badgeW, badgeH, 20);
    c.fill();
    c.globalAlpha = 1;

    // Badge text
    c.fillStyle = template.accentColor;
    c.fillText(festText, cx, y + 6, contentW);
    y += 50;
  }

  // ── Panchangam rows ──
  const startY = Math.max(y, height * template.contentY);
  const endY = height * template.contentEndY;
  const availableH = endY - startY;

  const rows = [];
  if (data.samvatsaram) rows.push(['సంవత్సరం', data.samvatsaram]);
  if (data.masam) rows.push(['మాసం', data.masam]);
  if (data.tithi) rows.push(['తిథి', data.tithi]);
  if (data.nakshatra) rows.push(['నక్షత్రం', data.nakshatra]);
  if (data.yogam) rows.push(['యోగం', data.yogam]);
  if (data.karanam) rows.push(['కరణం', data.karanam]);

  // Divider
  rows.push(null); // separator

  if (data.sunrise) rows.push(['సూర్యోదయం', data.sunrise]);
  if (data.sunset) rows.push(['సూర్యాస్తమయం', data.sunset]);
  if (data.rahukalam) rows.push(['రాహుకాలం', data.rahukalam]);
  if (data.varjyam) rows.push(['వర్జ్యం', data.varjyam]);
  if (data.durmuhurtham) rows.push(['దుర్ముహూర్తం', data.durmuhurtham]);

  const rowH = Math.min(availableH / rows.length, 52);
  let ry = startY;

  for (const row of rows) {
    if (row === null) {
      // Draw divider
      c.strokeStyle = template.accentColor;
      c.globalAlpha = 0.3;
      c.lineWidth = 1;
      c.beginPath();
      c.moveTo(mx + 20, ry + rowH / 2);
      c.lineTo(width - mx - 20, ry + rowH / 2);
      c.stroke();
      c.globalAlpha = 1;
      ry += rowH * 0.6;
      continue;
    }

    const [label, value] = row;

    // Label (left)
    c.textAlign = 'left';
    c.fillStyle = template.textColorSecondary;
    c.font = `24px "Noto Sans Telugu", sans-serif`;
    c.fillText(label, mx + 20, ry);

    // Value (right)
    c.textAlign = 'right';
    c.fillStyle = template.textColor;
    c.font = `bold 24px "Noto Sans Telugu", sans-serif`;
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
 * @param {Object} greetingConfig - from festivalGreetings.js (has quotes, greetingText)
 * @param {number} quoteIndex - which quote to use
 * @param {string} [customName] - optional user name
 * @returns {Promise<Blob>}
 */
export async function renderFestivalCard(template, festival, greetingConfig, quoteIndex, customName) {
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

  // Draw background
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

  // ── Greeting text (main) ──
  const greetingText = greetingConfig?.greetingText || `${festival.telugu} శుభాకాంక్షలు`;
  c.fillStyle = template.textColor;
  c.font = `bold 48px "Mandali", sans-serif`;
  const greetingLines = wrapText(c, greetingText, contentW);
  let gy = height * template.greetingY;
  for (const line of greetingLines) {
    c.fillText(line, cx, gy);
    gy += 58;
  }

  // ── Secondary text ──
  const secondaryText = greetingConfig?.secondaryText || '';
  if (secondaryText) {
    c.fillStyle = template.textColorSecondary;
    c.font = `bold 32px "Noto Sans Telugu", sans-serif`;
    c.fillText(secondaryText, cx, height * template.secondaryY, contentW);
  }

  // ── Quote ──
  if (greetingConfig?.quotes?.length > 0) {
    const quote = greetingConfig.quotes[quoteIndex % greetingConfig.quotes.length];
    c.fillStyle = template.textColorSecondary;
    c.font = `italic 26px "Noto Sans Telugu", sans-serif`;
    const quoteLines = wrapText(c, `"${quote.telugu}"`, contentW * 0.9);
    let qy = height * template.quoteY;
    for (const line of quoteLines) {
      c.fillText(line, cx, qy);
      qy += 34;
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
 * @param {string} imagePath - template.image path
 * @returns {Promise<string>} Object URL of thumbnail
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
