/**
 * Generates a beautiful festival wishes image card.
 * Returns a PNG Blob ready for WhatsApp sharing.
 */

import { SAMVATSARAM } from '../data/constants';
import {
  C, F, ensureFonts, createCanvas, drawBackground,
  drawBorder, drawBranding, wrapText, canvasToBlob,
} from './cardUtils';

const W = 1080;
const H = 1080;

export async function generateWishCard(festival, template) {
  await ensureFonts();

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const cx = W / 2;

  // Background
  drawBackground(ctx, W, H);
  drawBorder(ctx, W, H, 30);

  let y = 120;

  // Ornamental top
  ctx.textAlign = 'center';
  ctx.font = `400 20px ${F.english}`;
  ctx.fillStyle = C.ink4;
  ctx.globalAlpha = 0.5;
  ctx.fillText('✦   ✦   ✦', cx, y);
  ctx.globalAlpha = 1;

  y += 50;

  // Samvatsaram + festival heading
  ctx.font = `500 26px ${F.telugu}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText(`శ్రీ పరాభవ నామ సంవత్సర`, cx, y);
  y += 50;

  ctx.font = `900 56px ${F.telugu}`;
  ctx.fillStyle = C.fest;
  ctx.fillText(`${festival.telugu} శుభాకాంక్షలు`, cx, y);

  y += 30;

  // Ornamental divider
  ctx.fillStyle = C.ink4;
  ctx.globalAlpha = 0.4;
  ctx.font = `400 16px ${F.english}`;
  ctx.fillText('━━━━━━━━━━━━━━━━━━━━━━━━━━', cx, y);
  ctx.globalAlpha = 1;

  y += 50;

  // Wish message text — word wrapped
  ctx.font = `500 34px ${F.telugu}`;
  ctx.fillStyle = C.ink;
  const maxTextWidth = W - 140;
  const messageLines = template.message.split('\n');

  for (const paragraph of messageLines) {
    if (paragraph.trim() === '') {
      y += 20;
      continue;
    }
    const wrapped = wrapText(ctx, paragraph.trim(), maxTextWidth);
    for (const line of wrapped) {
      ctx.fillText(line, cx, y);
      y += 46;
    }
  }

  y += 20;

  // Bottom ornament
  ctx.fillStyle = C.ink4;
  ctx.globalAlpha = 0.4;
  ctx.font = `400 16px ${F.english}`;
  ctx.fillText('━━━━━━━━━━━━━━━━━━━━━━━━━━', cx, y);
  ctx.globalAlpha = 1;

  // Branding
  drawBranding(ctx, W, H - 50);

  return canvasToBlob(canvas);
}
