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
  drawBranding, to12Hr, canvasToBlob,
} from './cardUtils';

const W = 1080;
const H = 1620; // taller to fit shubha + ashubha muhurtams
const CX = W / 2;
const INSET = 32;

export async function generatePanchangamCard(data, cityLabel) {
  await ensureFonts();

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // ── Background ──
  drawBackground(ctx, W, H);
  drawMandala(ctx, CX, H * 0.4, 340, C.goldDark, 0.04);

  // ── Ornate border + corner ornaments ──
  drawOrnateBorder(ctx, W, H, INSET);
  drawCornerOrnaments(ctx, W, H, INSET, C.gold, 0.22);
  drawDiya(ctx, INSET + 55, INSET + 50, 16);
  drawDiya(ctx, W - INSET - 55, INSET + 50, 16);

  let y = 105;

  // ── Header: Telugu day + month ──
  ctx.textAlign = 'left';
  ctx.font = `700 56px ${F.telugu}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(data.vaaram, 70, y);

  ctx.textAlign = 'right';
  ctx.font = `600 48px ${F.telugu}`;
  ctx.fillStyle = C.ink2;
  ctx.fillText(data.masam.telugu, W - 70, y);

  y += 46;

  // ── Sub-header: English date ──
  ctx.textAlign = 'left';
  ctx.font = `500 28px ${F.english}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText(data.englishDay, 70, y);

  ctx.textAlign = 'center';
  ctx.font = `700 30px ${F.english}`;
  ctx.fillStyle = C.ink2;
  ctx.fillText(`${data.englishMonth.toUpperCase()} ${data.year}`, CX, y);

  ctx.textAlign = 'right';
  ctx.font = `500 26px ${F.english}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText(data.masam.english, W - 70, y);

  y += 30;
  drawDivider(ctx, CX, y, (W - 140) / 2);
  y += 20;

  // ── Sunrise + Date Number + Sunset ──
  const sunY = y + 85;

  // Sunrise (left)
  ctx.textAlign = 'center';
  ctx.font = `700 40px ${F.english}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(to12Hr(data.sunrise), 175, sunY);
  ctx.font = `500 22px ${F.english}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText('sunrise', 175, sunY + 28);

  // Sun icon
  ctx.globalAlpha = 0.15;
  ctx.beginPath();
  ctx.arc(175, sunY - 36, 13, 0, Math.PI * 2);
  ctx.fillStyle = C.fest;
  ctx.fill();
  ctx.globalAlpha = 1;

  // Date number (huge)
  drawGlowText(
    ctx, String(data.dateNum), CX, sunY + 32,
    `400 200px ${F.date}`, C.fest, 'rgba(212,85,0,0.15)', 30
  );

  // Sunset (right)
  ctx.textAlign = 'center';
  ctx.font = `700 40px ${F.english}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(to12Hr(data.sunset), W - 175, sunY);
  ctx.font = `500 22px ${F.english}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText('sunset', W - 175, sunY + 28);

  ctx.globalAlpha = 0.12;
  ctx.beginPath();
  ctx.arc(W - 175, sunY - 36, 11, 0, Math.PI * 2);
  ctx.fillStyle = C.ink3;
  ctx.fill();
  ctx.globalAlpha = 1;

  y = sunY + 70;

  // ── Festival name ──
  if (data.festival) {
    y += 12;
    drawGlowText(
      ctx, data.festival.telugu, CX, y,
      `800 52px ${F.telugu}`, C.fest, 'rgba(212,85,0,0.2)', 20
    );
    if (data.festival.english) {
      y += 36;
      ctx.textAlign = 'center';
      ctx.font = `600 26px ${F.english}`;
      ctx.fillStyle = C.ink3;
      ctx.fillText(data.festival.english, CX, y);
    }
    if (data.festival.description) {
      y += 34;
      ctx.textAlign = 'center';
      ctx.font = `400 28px ${F.telugu}`;
      ctx.fillStyle = C.ink3;
      ctx.fillText(data.festival.description, CX, y);
    }
    y += 12;
    drawLotus(ctx, 100, y - 40, 14, C.gold, 0.18);
    drawLotus(ctx, W - 100, y - 40, 14, C.gold, 0.18);
  }

  y += 24;
  drawDivider(ctx, CX, y, (W - 140) / 2);
  y += 36;

  // ── Paksha + Tithi ──
  ctx.textAlign = 'center';
  ctx.font = `500 26px ${F.telugu}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText(`${data.paksha} పక్షం`, CX, y);
  y += 46;

  ctx.font = `700 42px ${F.telugu}`;
  ctx.fillStyle = C.ink;
  const tithiText = data.tithi.name;
  const tithiW = ctx.measureText(tithiText).width;
  ctx.fillText(tithiText, CX, y);
  ctx.strokeStyle = C.ink4;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(CX - tithiW / 2 - 55, y - 7);
  ctx.lineTo(CX - tithiW / 2 - 14, y - 7);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(CX + tithiW / 2 + 14, y - 7);
  ctx.lineTo(CX + tithiW / 2 + 55, y - 7);
  ctx.stroke();
  ctx.globalAlpha = 1;
  y += 50;

  // ── Nakshatra ──
  ctx.font = `500 24px ${F.telugu}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText('నక్షత్రం', CX, y);
  y += 42;
  ctx.font = `800 48px ${F.telugu}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(data.nakshatra.name, CX, y);
  y += 50;

  // ── Yogam + Karanam ──
  ctx.font = `500 28px ${F.telugu}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText(`యోగం  ${data.yogam.name}   ·   కరణం  ${data.karanam.name}`, CX, y);
  y += 38;

  drawDivider(ctx, CX, y, (W - 140) / 2);
  y += 38;

  // ── Helper: draw 3-column timing row ──
  const drawTimingRow = (items, atY) => {
    const colW = (W - 140) / 3;
    items.forEach((t, i) => {
      const tx = 70 + colW * i + colW / 2;
      ctx.textAlign = 'center';
      ctx.fillStyle = C.ink4;
      ctx.font = `500 24px ${F.telugu}`;
      ctx.fillText(t.label, tx, atY);
      ctx.fillStyle = C.ink2;
      ctx.font = `600 25px ${F.english}`;
      const val = Array.isArray(t.value) ? t.value.join(', ') : t.value;
      ctx.fillText(val || '--', tx, atY + 32);
    });
  };

  // ── Shubha Muhurtham (Auspicious) ──
  ctx.textAlign = 'center';
  ctx.font = `600 22px ${F.telugu}`;
  ctx.fillStyle = C.gold;
  ctx.fillText('✦  శుభ ముహూర్తం  ✦', CX, y);
  y += 32;

  drawTimingRow([
    { label: 'అభిజిత్', value: data.abhijitMuhurta },
    { label: 'అమృతకాలం', value: data.amritKalam },
    { label: 'బ్రహ్మ ము.', value: data.brahmaMuhurta },
  ], y);

  y += 72;

  // ── Ashubha Muhurtham (Inauspicious) ──
  ctx.textAlign = 'center';
  ctx.font = `600 22px ${F.telugu}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText('అశుభ సమయాలు', CX, y);
  y += 32;

  drawTimingRow([
    { label: 'రాహు కాలం', value: data.rahuKalam },
    { label: 'వర్జ్యం', value: data.varjyam },
    { label: 'దుర్ముహూర్తం', value: data.durmuhurtham },
  ], y);

  y += 78;
  drawDivider(ctx, CX, y, (W - 140) / 2);
  y += 38;

  // ── Samvatsaram + City ──
  ctx.textAlign = 'center';
  ctx.font = `400 26px ${F.telugu}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText(SAMVATSARAM, CX, y);
  y += 34;
  ctx.font = `600 30px ${F.telugu}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText(cityLabel || 'హైదరాబాద్', CX, y);

  // ── Bottom diyas ──
  drawDiya(ctx, INSET + 55, H - INSET - 50, 16);
  drawDiya(ctx, W - INSET - 55, H - INSET - 50, 16);

  // ── Branding ──
  drawBranding(ctx, W, H - 46);

  return canvasToBlob(canvas);
}
