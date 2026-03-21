/**
 * Generates a beautiful golden panchangam image card with
 * mandala watermark, ornate borders, and decorative accents.
 * Returns a PNG Blob ready for WhatsApp sharing.
 */

import { SAMVATSARAM } from '../data/constants';
import {
  C, F, ensureFonts, createCanvas, drawBackground,
  drawOrnateBorder, drawCornerOrnaments, drawMandala,
  drawDivider, drawLotus, drawDiya, drawGlowText,
  drawBranding, drawTithiLine, to12Hr, canvasToBlob,
} from './cardUtils';

const W = 1080;
const H = 1350;
const CX = W / 2;
const INSET = 32;

export async function generatePanchangamCard(data, cityLabel) {
  await ensureFonts();

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // ── Background ──
  drawBackground(ctx, W, H);

  // Mandala watermark (very faint, behind everything)
  drawMandala(ctx, CX, H * 0.42, 320, C.goldDark, 0.045);

  // ── Ornate border + corner ornaments ──
  drawOrnateBorder(ctx, W, H, INSET);
  drawCornerOrnaments(ctx, W, H, INSET, C.gold, 0.22);

  // Small diyas at top-left and top-right inside border
  drawDiya(ctx, INSET + 55, INSET + 50, 16);
  drawDiya(ctx, W - INSET - 55, INSET + 50, 16);

  let y = 100;

  // ── Header: Telugu day + month ──
  ctx.textAlign = 'left';
  ctx.font = `700 48px ${F.telugu}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(data.vaaram, 70, y);

  ctx.textAlign = 'right';
  ctx.font = `600 40px ${F.telugu}`;
  ctx.fillStyle = C.ink2;
  ctx.fillText(data.masam.telugu, W - 70, y);

  y += 44;

  // ── Sub-header: English date ──
  ctx.textAlign = 'left';
  ctx.font = `500 26px ${F.english}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText(data.englishDay, 70, y);

  ctx.textAlign = 'center';
  ctx.font = `700 28px ${F.english}`;
  ctx.fillStyle = C.ink2;
  ctx.fillText(`${data.englishMonth.toUpperCase()} ${data.year}`, CX, y);

  ctx.textAlign = 'right';
  ctx.font = `500 24px ${F.english}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText(data.masam.english, W - 70, y);

  y += 28;

  // Decorative divider
  drawDivider(ctx, CX, y, (W - 140) / 2);
  y += 18;

  // ── Sunrise + Date Number + Sunset ──
  const sunY = y + 80;

  // Sunrise (left)
  ctx.textAlign = 'center';
  ctx.font = `700 34px ${F.english}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(to12Hr(data.sunrise), 175, sunY);
  ctx.font = `500 20px ${F.english}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText('sunrise', 175, sunY + 26);

  // Sun icon hint (small circle)
  ctx.globalAlpha = 0.15;
  ctx.beginPath();
  ctx.arc(175, sunY - 34, 12, 0, Math.PI * 2);
  ctx.fillStyle = C.fest;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Date number (center, huge)
  drawGlowText(
    ctx, String(data.dateNum), CX, sunY + 30,
    `400 200px ${F.date}`, C.fest, 'rgba(212,85,0,0.15)', 30
  );

  // Sunset (right)
  ctx.textAlign = 'center';
  ctx.font = `700 34px ${F.english}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(to12Hr(data.sunset), W - 175, sunY);
  ctx.font = `500 20px ${F.english}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText('sunset', W - 175, sunY + 26);

  // Moon icon hint
  ctx.globalAlpha = 0.12;
  ctx.beginPath();
  ctx.arc(W - 175, sunY - 34, 10, 0, Math.PI * 2);
  ctx.fillStyle = C.ink3;
  ctx.fill();
  ctx.globalAlpha = 1;

  y = sunY + 70;

  // ── Festival name (if applicable) ──
  if (data.festival) {
    y += 15;
    // Festival name with glow
    drawGlowText(
      ctx, data.festival.telugu, CX, y,
      `800 52px ${F.telugu}`, C.fest, 'rgba(212,85,0,0.2)', 20
    );

    if (data.festival.english) {
      y += 36;
      ctx.textAlign = 'center';
      ctx.font = `600 24px ${F.english}`;
      ctx.fillStyle = C.ink3;
      ctx.fillText(data.festival.english, CX, y);
    }

    if (data.festival.description) {
      y += 34;
      ctx.textAlign = 'center';
      ctx.font = `400 26px ${F.telugu}`;
      ctx.fillStyle = C.ink3;
      ctx.fillText(data.festival.description, CX, y);
    }
    y += 15;

    // Small lotus accents beside festival
    drawLotus(ctx, 100, y - 45, 14, C.gold, 0.18);
    drawLotus(ctx, W - 100, y - 45, 14, C.gold, 0.18);
  }

  y += 22;
  drawDivider(ctx, CX, y, (W - 140) / 2);
  y += 32;

  // ── Paksha + Tithi ──
  ctx.textAlign = 'center';
  ctx.font = `500 22px ${F.telugu}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText(`${data.paksha} పక్షం`, CX, y);
  y += 42;

  drawTithiLine(ctx, data.tithi.name, CX, y);
  y += 50;

  // ── Nakshatra ──
  ctx.textAlign = 'center';
  ctx.font = `500 22px ${F.telugu}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText('నక్షత్రం', CX, y);
  y += 40;
  ctx.font = `800 44px ${F.telugu}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(data.nakshatra.name, CX, y);
  y += 48;

  // ── Yogam + Karanam ──
  ctx.font = `500 26px ${F.telugu}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText(`యోగం  ${data.yogam.name}   ·   కరణం  ${data.karanam.name}`, CX, y);
  y += 36;

  drawDivider(ctx, CX, y, (W - 140) / 2);
  y += 38;

  // ── Inauspicious timings (3 columns) ──
  ctx.font = `500 24px ${F.telugu}`;
  const timings = [
    { label: 'రాహు కాలం', value: data.rahuKalam },
    { label: 'వర్జ్యం', value: data.varjyam },
    { label: 'దుర్ముహూర్తం', value: Array.isArray(data.durmuhurtham) ? data.durmuhurtham.join(', ') : data.durmuhurtham },
  ];
  const colW = (W - 140) / 3;
  timings.forEach((t, i) => {
    const tx = 70 + colW * i + colW / 2;
    ctx.textAlign = 'center';
    ctx.fillStyle = C.ink4;
    ctx.font = `500 21px ${F.telugu}`;
    ctx.fillText(t.label, tx, y);
    ctx.fillStyle = C.ink2;
    ctx.font = `600 24px ${F.english}`;
    ctx.fillText(t.value, tx, y + 32);
  });

  y += 72;
  drawDivider(ctx, CX, y, (W - 140) / 2);
  y += 36;

  // ── Samvatsaram + City ──
  ctx.textAlign = 'center';
  ctx.font = `400 24px ${F.telugu}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText(SAMVATSARAM, CX, y);
  y += 30;
  ctx.font = `600 26px ${F.telugu}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText(cityLabel || 'హైదరాబాద్', CX, y);

  // ── Bottom diyas ──
  drawDiya(ctx, INSET + 55, H - INSET - 50, 16);
  drawDiya(ctx, W - INSET - 55, H - INSET - 50, 16);

  // ── Branding ──
  drawBranding(ctx, W, H - 48);

  return canvasToBlob(canvas);
}
