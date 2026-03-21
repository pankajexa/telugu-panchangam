/**
 * Generates a beautiful festival wishes image card with
 * mandala frame, lotus accents, and warm golden aesthetic.
 * Returns a PNG Blob ready for WhatsApp sharing.
 */

import { SAMVATSARAM } from '../data/constants';
import {
  C, F, ensureFonts, createCanvas, drawBackground,
  drawOrnateBorder, drawCornerOrnaments, drawMandala,
  drawDivider, drawLotus, drawDiya, drawGlowText,
  drawBranding, wrapText, canvasToBlob,
} from './cardUtils';

const W = 1080;
const H = 1080;
const CX = W / 2;
const INSET = 32;

// Festival accent colors (subtle tint on the fest color)
const FESTIVAL_ACCENTS = {
  'Ugadi': '#B8860B',
  'Diwali': '#D84315',
  'Deepavali': '#D84315',
  'Ganesh Chaturthi': '#C62828',
  'Vinayaka Chavithi': '#C62828',
  'Dussehra': '#AD1457',
  'Vijayadashami': '#AD1457',
  'Rama Navami': '#1565C0',
  'Krishna Janmashtami': '#283593',
  'Sankranti': '#E65100',
  'Makar Sankranti': '#E65100',
};

function getAccent(festivalEnglish) {
  if (!festivalEnglish) return C.fest;
  for (const [key, color] of Object.entries(FESTIVAL_ACCENTS)) {
    if (festivalEnglish.toLowerCase().includes(key.toLowerCase())) return color;
  }
  return C.fest;
}

export async function generateWishCard(festival, template) {
  await ensureFonts();

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const accent = getAccent(festival.english);

  // ── Background ──
  drawBackground(ctx, W, H);

  // Large mandala watermark (center, very faint)
  drawMandala(ctx, CX, H * 0.45, 350, C.goldDark, 0.04);

  // ── Border + corners ──
  drawOrnateBorder(ctx, W, H, INSET);
  drawCornerOrnaments(ctx, W, H, INSET, C.gold, 0.25);

  // Diyas at top corners
  drawDiya(ctx, INSET + 55, INSET + 55, 18);
  drawDiya(ctx, W - INSET - 55, INSET + 55, 18);

  let y = 110;

  // ── Top ornamental motif ──
  drawLotus(ctx, CX, y, 22, C.gold, 0.3);
  y += 40;

  // ── Samvatsaram header ──
  ctx.textAlign = 'center';
  ctx.font = `500 26px ${F.telugu}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText('శ్రీ పరాభవ నామ సంవత్సర', CX, y);
  y += 52;

  // ── Festival name (huge, with glow) ──
  const festName = `${festival.telugu} శుభాకాంక్షలు`;
  // Check if name is long, reduce font size
  ctx.font = `900 56px ${F.telugu}`;
  let nameW = ctx.measureText(festName).width;
  let fontSize = 56;
  if (nameW > W - 120) {
    fontSize = 46;
  }

  drawGlowText(
    ctx, festName, CX, y,
    `900 ${fontSize}px ${F.telugu}`,
    accent, accent + '30', 24
  );

  // English festival name below
  if (festival.english) {
    y += 38;
    ctx.font = `600 22px ${F.english}`;
    ctx.fillStyle = C.ink4;
    ctx.fillText(festival.english.toUpperCase(), CX, y);
  }

  y += 20;

  // ── Ornamental divider ──
  drawDivider(ctx, CX, y, (W - 160) / 2);

  // Lotus accents on divider sides
  drawLotus(ctx, 90, y, 12, C.gold, 0.15);
  drawLotus(ctx, W - 90, y, 12, C.gold, 0.15);

  y += 42;

  // ── Wish message text ──
  ctx.font = `500 34px ${F.telugu}`;
  ctx.fillStyle = C.ink;
  ctx.textAlign = 'center';
  const maxTextWidth = W - 160;
  const messageLines = template.message.split('\n');

  for (const paragraph of messageLines) {
    if (paragraph.trim() === '') {
      y += 18;
      continue;
    }
    const wrapped = wrapText(ctx, paragraph.trim(), maxTextWidth);
    for (const line of wrapped) {
      if (y > H - 130) break; // Don't overflow into footer
      ctx.fillText(line, CX, y);
      y += 46;
    }
  }

  // ── Bottom ornament ──
  const bottomY = H - 105;
  drawDivider(ctx, CX, bottomY, (W - 160) / 2);

  // Bottom diyas
  drawDiya(ctx, INSET + 55, H - INSET - 50, 16);
  drawDiya(ctx, W - INSET - 55, H - INSET - 50, 16);

  // ── Branding ──
  drawBranding(ctx, W, H - 48);

  return canvasToBlob(canvas);
}
