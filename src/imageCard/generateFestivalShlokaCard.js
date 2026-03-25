/**
 * Festival Shloka Card Generator
 * Creates a beautiful shareable image: deity image at top + shloka + meaning + wishes
 * Output: 1080×1920 (9:16 portrait — Instagram story / WhatsApp status optimized)
 */

import { ensureFonts, canvasToBlob } from './cardUtils.js';

const W = 1080;
const H = 1920;

const ASSET_BASE = '/assets/greetings';

// Festival → deity image + color theme
const FESTIVAL_THEMES = {
  'Sri Rama Navami': {
    image: `${ASSET_BASE}/deities/rama-pattabhishekam.jpg`,
    gradient: ['#1A0A2E', '#0D1B3E', '#1A0A2E'],  // deep blue-purple
    accent: '#E8C840',     // gold
    accentLight: '#FFF5D0',
    title: 'శ్రీ రామ నవమి',
    titleEn: 'Sri Rama Navami',
  },
  'Vinayaka Chavithi': {
    image: `${ASSET_BASE}/deities/ganesh.png`,
    gradient: ['#2E0A0A', '#3E1B0D', '#2E0A0A'],
    accent: '#E8C840',
    accentLight: '#FFF5D0',
    title: 'వినాయక చవితి',
    titleEn: 'Vinayaka Chavithi',
  },
  // Add more festivals as deity images are added
};

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function setFont(ctx, size, weight, family) {
  ctx.font = `${weight} ${size}px ${family}`;
}

function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

/**
 * Generate a festival shloka card.
 * @param {object} shloka — shloka object from shlokas.js
 * @param {string} festivalEnglish — festival english name (e.g. 'Sri Rama Navami')
 * @param {string} wishText — optional wish text
 * @returns {Promise<Blob>} — PNG image blob
 */
export async function generateFestivalShlokaCard(shloka, festivalEnglish, wishText) {
  await ensureFonts();

  const theme = FESTIVAL_THEMES[festivalEnglish] || FESTIVAL_THEMES['Sri Rama Navami'];
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // ── Background gradient ──
  const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
  bgGrad.addColorStop(0, theme.gradient[0]);
  bgGrad.addColorStop(0.5, theme.gradient[1]);
  bgGrad.addColorStop(1, theme.gradient[2]);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // ── Subtle pattern overlay ──
  ctx.fillStyle = 'rgba(255,255,255,0.02)';
  for (let y = 0; y < H; y += 4) {
    ctx.fillRect(0, y, W, 1);
  }

  // ── Load and draw deity image ──
  let imgH = 650;
  try {
    const img = await loadImage(theme.image);
    const aspect = img.width / img.height;
    const drawW = W - 80;      // 40px padding each side
    const drawH = drawW / aspect;
    imgH = Math.min(drawH, 700);
    const drawX = (W - drawW) / 2;
    const drawY = 60;

    // Rounded clip for image
    const r = 24;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(drawX + r, drawY);
    ctx.lineTo(drawX + drawW - r, drawY);
    ctx.quadraticCurveTo(drawX + drawW, drawY, drawX + drawW, drawY + r);
    ctx.lineTo(drawX + drawW, drawY + imgH - r);
    ctx.quadraticCurveTo(drawX + drawW, drawY + imgH, drawX + drawW - r, drawY + imgH);
    ctx.lineTo(drawX + r, drawY + imgH);
    ctx.quadraticCurveTo(drawX, drawY + imgH, drawX, drawY + imgH - r);
    ctx.lineTo(drawX, drawY + r);
    ctx.quadraticCurveTo(drawX, drawY, drawX + r, drawY);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(img, drawX, drawY, drawW, imgH);
    ctx.restore();

    // Subtle golden border around image
    ctx.strokeStyle = `${theme.accent}55`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(drawX, drawY, drawW, imgH, r);
    ctx.stroke();
  } catch (e) {
    // If image fails, leave gradient background
    imgH = 100;
  }

  let y = 60 + imgH + 40;

  // ── Festival title ──
  ctx.textAlign = 'center';
  setFont(ctx, 18, '600', "'Plus Jakarta Sans', sans-serif");
  ctx.fillStyle = `${theme.accent}AA`;
  ctx.letterSpacing = '4px';
  ctx.fillText(theme.titleEn.toUpperCase(), W / 2, y);
  ctx.letterSpacing = '0px';
  y += 36;

  // ── Decorative divider ──
  const divW = 120;
  ctx.strokeStyle = `${theme.accent}44`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(W / 2 - divW, y);
  ctx.lineTo(W / 2 + divW, y);
  ctx.stroke();
  // Center diamond
  ctx.fillStyle = theme.accent;
  ctx.beginPath();
  ctx.moveTo(W / 2, y - 5);
  ctx.lineTo(W / 2 + 5, y);
  ctx.lineTo(W / 2, y + 5);
  ctx.lineTo(W / 2 - 5, y);
  ctx.closePath();
  ctx.fill();
  y += 30;

  // ── Shloka (Devanagari) ──
  const devaLines = shloka.sanskritDevanagari.split('\n').filter(l => l.trim());
  setFont(ctx, 30, '600', "'Noto Sans Devanagari', sans-serif");
  ctx.fillStyle = theme.accentLight;
  for (const line of devaLines) {
    ctx.fillText(line.trim(), W / 2, y);
    y += 42;
  }
  y += 10;

  // ── Telugu transliteration ──
  const teLines = shloka.teluguTransliteration.split('\n').filter(l => l.trim());
  setFont(ctx, 24, '500', "'Noto Sans Telugu', sans-serif");
  ctx.fillStyle = 'rgba(255,255,255,0.6)';
  for (const line of teLines) {
    ctx.fillText(line.trim(), W / 2, y);
    y += 34;
  }
  y += 14;

  // ── English meaning ──
  setFont(ctx, 22, '400', "'Plus Jakarta Sans', sans-serif");
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  const meaningLines = wrapText(ctx, shloka.englishMeaning, W - 120);
  for (const line of meaningLines.slice(0, 4)) {
    ctx.fillText(line, W / 2, y);
    y += 30;
  }
  y += 12;

  // ── Source ──
  setFont(ctx, 18, '400', "'Plus Jakarta Sans', sans-serif");
  ctx.fillStyle = `${theme.accent}66`;
  ctx.font = `italic 18px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillText(`— ${shloka.source}`, W / 2, y);
  y += 40;

  // ── Wish text (if provided) ──
  if (wishText) {
    setFont(ctx, 20, '500', "'Noto Sans Telugu', sans-serif");
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.fillText(wishText, W / 2, y);
    y += 30;
  }

  // ── Footer branding ──
  const footerY = H - 40;
  setFont(ctx, 16, '500', "'Plus Jakarta Sans', sans-serif");
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.fillText('మనCalendar — Telugu Panchangam', W / 2, footerY);

  return canvasToBlob(canvas);
}

export { FESTIVAL_THEMES };
