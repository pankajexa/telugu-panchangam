/**
 * Generates a beautiful festival wishes image card with
 * mandala frame, festival-specific artwork, and warm golden aesthetic.
 * Returns a PNG Blob ready for WhatsApp sharing.
 */

import {
  C, F, ensureFonts, createCanvas, drawBackground,
  drawOrnateBorder, drawCornerOrnaments, drawMandala,
  drawDivider, drawLotus, drawDiya, drawGlowText,
  drawBranding, wrapText, canvasToBlob,
} from './cardUtils';
import { getFestivalArt } from './festivalArt';

const W = 1080;
const H = 1350;
const CX = W / 2;
const INSET = 32;

// Festival accent colors
const FESTIVAL_ACCENTS = {
  'ugadi': '#B8860B',
  'diwali': '#D84315',
  'deepavali': '#D84315',
  'ganesh chaturthi': '#C62828',
  'vinayaka chavithi': '#C62828',
  'dussehra': '#AD1457',
  'vijayadashami': '#AD1457',
  'rama navami': '#1565C0',
  'krishna janmashtami': '#283593',
  'sankranti': '#E65100',
  'makar sankranti': '#E65100',
};

function getAccent(festivalEnglish) {
  if (!festivalEnglish) return C.fest;
  const lower = festivalEnglish.toLowerCase();
  for (const [key, color] of Object.entries(FESTIVAL_ACCENTS)) {
    if (lower.includes(key)) return color;
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

  // Check for festival-specific artwork
  const artFn = getFestivalArt(festival.english);
  const hasArt = !!artFn;

  // Mandala watermark — position depends on whether we have art
  if (!hasArt) {
    drawMandala(ctx, CX, H * 0.38, 350, C.goldDark, 0.04);
  }

  // ── Border + corners ──
  drawOrnateBorder(ctx, W, H, INSET);
  drawCornerOrnaments(ctx, W, H, INSET, C.gold, 0.25);

  // Diyas at top corners
  drawDiya(ctx, INSET + 55, INSET + 55, 18);
  drawDiya(ctx, W - INSET - 55, INSET + 55, 18);

  let y = 108;

  // ── Samvatsaram header ──
  ctx.textAlign = 'center';
  ctx.font = `500 30px ${F.telugu}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText('శ్రీ పరాభవ నామ సంవత్సర', CX, y);
  y += 56;

  // ── Festival name (huge, with glow) ──
  const festName = `${festival.telugu} శుభాకాంక్షలు`;
  ctx.font = `900 62px ${F.telugu}`;
  let nameW = ctx.measureText(festName).width;
  let fontSize = 62;
  if (nameW > W - 120) fontSize = 50;

  drawGlowText(
    ctx, festName, CX, y,
    `900 ${fontSize}px ${F.telugu}`,
    accent, accent + '30', 24
  );

  // English festival name
  if (festival.english) {
    y += 42;
    ctx.font = `600 26px ${F.english}`;
    ctx.fillStyle = C.ink4;
    ctx.textAlign = 'center';
    ctx.fillText(festival.english.toUpperCase(), CX, y);
  }

  y += 24;
  drawDivider(ctx, CX, y, (W - 160) / 2);

  // Lotus accents beside divider
  drawLotus(ctx, 90, y, 12, C.gold, 0.15);
  drawLotus(ctx, W - 90, y, 12, C.gold, 0.15);

  y += 36;

  // ── Festival artwork (if available) ──
  if (hasArt) {
    const artCenterY = y + 175;
    artFn(ctx, CX, artCenterY, 0.85, C.gold, 0.55);
    y = artCenterY + 195;

    drawDivider(ctx, CX, y, (W - 160) / 2);
    y += 36;
  }

  // ── Wish message text ──
  ctx.font = `500 38px ${F.telugu}`;
  ctx.fillStyle = C.ink;
  ctx.textAlign = 'center';
  const maxTextWidth = W - 160;
  const messageLines = template.message.split('\n');
  const maxY = H - 120;

  for (const paragraph of messageLines) {
    if (paragraph.trim() === '') {
      y += 20;
      continue;
    }
    const wrapped = wrapText(ctx, paragraph.trim(), maxTextWidth);
    for (const line of wrapped) {
      if (y > maxY) break;
      ctx.fillText(line, CX, y);
      y += 50;
    }
  }

  // ── Bottom ornament ──
  const bottomY = H - 100;
  drawDivider(ctx, CX, bottomY, (W - 160) / 2);

  // Bottom diyas
  drawDiya(ctx, INSET + 55, H - INSET - 50, 16);
  drawDiya(ctx, W - INSET - 55, H - INSET - 50, 16);

  // ── Branding ──
  drawBranding(ctx, W, H - 46);

  return canvasToBlob(canvas);
}
