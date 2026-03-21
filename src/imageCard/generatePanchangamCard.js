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
  drawMandala(ctx, CX, H * 0.45, 320, C.goldDark, 0.045);

  // ── Ornate border + corner ornaments ──
  drawOrnateBorder(ctx, W, H, INSET);
  drawCornerOrnaments(ctx, W, H, INSET, C.gold, 0.22);
  drawDiya(ctx, INSET + 55, INSET + 50, 16);
  drawDiya(ctx, W - INSET - 55, INSET + 50, 16);

  let y = 105;

  // ── Header: Telugu day + month ──
  ctx.textAlign = 'left';
  ctx.font = `700 58px ${F.telugu}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(data.vaaram, 70, y);

  ctx.textAlign = 'right';
  ctx.font = `600 50px ${F.telugu}`;
  ctx.fillStyle = C.ink2;
  ctx.fillText(data.masam.telugu, W - 70, y);

  y += 48;

  // ── Sub-header: English date ──
  ctx.textAlign = 'left';
  ctx.font = `500 30px ${F.english}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText(data.englishDay, 70, y);

  ctx.textAlign = 'center';
  ctx.font = `700 32px ${F.english}`;
  ctx.fillStyle = C.ink2;
  ctx.fillText(`${data.englishMonth.toUpperCase()} ${data.year}`, CX, y);

  ctx.textAlign = 'right';
  ctx.font = `500 28px ${F.english}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText(data.masam.english, W - 70, y);

  y += 32;
  drawDivider(ctx, CX, y, (W - 140) / 2);
  y += 24;

  // ── Sunrise + Date Number + Sunset ──
  const sunY = y + 90;

  // Sunrise (left)
  ctx.textAlign = 'center';
  ctx.font = `700 42px ${F.english}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(to12Hr(data.sunrise), 175, sunY);
  ctx.font = `500 24px ${F.english}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText('sunrise', 175, sunY + 30);

  // Sun icon
  ctx.globalAlpha = 0.15;
  ctx.beginPath();
  ctx.arc(175, sunY - 38, 14, 0, Math.PI * 2);
  ctx.fillStyle = C.fest;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Date number (huge)
  drawGlowText(
    ctx, String(data.dateNum), CX, sunY + 38,
    `400 220px ${F.date}`, C.fest, 'rgba(212,85,0,0.15)', 30
  );

  // Sunset (right)
  ctx.textAlign = 'center';
  ctx.font = `700 42px ${F.english}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(to12Hr(data.sunset), W - 175, sunY);
  ctx.font = `500 24px ${F.english}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText('sunset', W - 175, sunY + 30);

  // Moon icon
  ctx.globalAlpha = 0.12;
  ctx.beginPath();
  ctx.arc(W - 175, sunY - 38, 12, 0, Math.PI * 2);
  ctx.fillStyle = C.ink3;
  ctx.fill();
  ctx.globalAlpha = 1;

  y = sunY + 80;

  // ── Festival name ──
  if (data.festival) {
    y += 16;
    drawGlowText(
      ctx, data.festival.telugu, CX, y,
      `800 58px ${F.telugu}`, C.fest, 'rgba(212,85,0,0.2)', 20
    );
    if (data.festival.english) {
      y += 40;
      ctx.textAlign = 'center';
      ctx.font = `600 28px ${F.english}`;
      ctx.fillStyle = C.ink3;
      ctx.fillText(data.festival.english, CX, y);
    }
    if (data.festival.description) {
      y += 38;
      ctx.textAlign = 'center';
      ctx.font = `400 30px ${F.telugu}`;
      ctx.fillStyle = C.ink3;
      ctx.fillText(data.festival.description, CX, y);
    }
    y += 16;
    drawLotus(ctx, 100, y - 45, 14, C.gold, 0.18);
    drawLotus(ctx, W - 100, y - 45, 14, C.gold, 0.18);
  }

  y += 28;
  drawDivider(ctx, CX, y, (W - 140) / 2);
  y += 40;

  // ── Paksha + Tithi ──
  ctx.textAlign = 'center';
  ctx.font = `500 28px ${F.telugu}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText(`${data.paksha} పక్షం`, CX, y);
  y += 50;

  // Tithi (bigger)
  ctx.font = `700 46px ${F.telugu}`;
  ctx.fillStyle = C.ink;
  const tithiText = data.tithi.name;
  const tithiW = ctx.measureText(tithiText).width;
  ctx.fillText(tithiText, CX, y);
  // Ornamental dashes
  ctx.strokeStyle = C.ink4;
  ctx.lineWidth = 1.2;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(CX - tithiW / 2 - 60, y - 8);
  ctx.lineTo(CX - tithiW / 2 - 16, y - 8);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(CX + tithiW / 2 + 16, y - 8);
  ctx.lineTo(CX + tithiW / 2 + 60, y - 8);
  ctx.stroke();
  ctx.globalAlpha = 1;
  y += 55;

  // ── Nakshatra ──
  ctx.font = `500 28px ${F.telugu}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText('నక్షత్రం', CX, y);
  y += 48;
  ctx.font = `800 54px ${F.telugu}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(data.nakshatra.name, CX, y);
  y += 55;

  // ── Yogam + Karanam ──
  ctx.font = `500 32px ${F.telugu}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText(`యోగం  ${data.yogam.name}   ·   కరణం  ${data.karanam.name}`, CX, y);
  y += 42;

  drawDivider(ctx, CX, y, (W - 140) / 2);
  y += 44;

  // ── Inauspicious timings ──
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
    ctx.font = `500 26px ${F.telugu}`;
    ctx.fillText(t.label, tx, y);
    ctx.fillStyle = C.ink2;
    ctx.font = `600 28px ${F.english}`;
    ctx.fillText(t.value, tx, y + 36);
  });

  y += 84;
  drawDivider(ctx, CX, y, (W - 140) / 2);
  y += 42;

  // ── Samvatsaram + City ──
  ctx.textAlign = 'center';
  ctx.font = `400 28px ${F.telugu}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText(SAMVATSARAM, CX, y);
  y += 36;
  ctx.font = `600 32px ${F.telugu}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText(cityLabel || 'హైదరాబాద్', CX, y);

  // ── Bottom diyas ──
  drawDiya(ctx, INSET + 55, H - INSET - 50, 16);
  drawDiya(ctx, W - INSET - 55, H - INSET - 50, 16);

  // ── Branding ──
  drawBranding(ctx, W, H - 46);

  return canvasToBlob(canvas);
}
