/**
 * Generates a beautiful golden panchangam image card.
 * Returns a PNG Blob ready for WhatsApp sharing.
 */

import { SAMVATSARAM, CITY } from '../data/constants';
import {
  C, F, ensureFonts, createCanvas, drawBackground,
  drawBorder, drawBranding, drawSeparator, drawTithiLine, to12Hr, canvasToBlob,
} from './cardUtils';

const W = 1080;
const H = 1350;

export async function generatePanchangamCard(data) {
  await ensureFonts();

  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');
  const cx = W / 2;

  // Background
  drawBackground(ctx, W, H);
  drawBorder(ctx, W, H, 30);

  let y = 90;

  // Telugu day name (left) + Telugu month (right)
  ctx.textAlign = 'left';
  ctx.font = `700 44px ${F.telugu}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(data.vaaram, 60, y);

  ctx.textAlign = 'right';
  ctx.font = `600 38px ${F.telugu}`;
  ctx.fillStyle = C.ink2;
  ctx.fillText(data.masam.telugu, W - 60, y);

  y += 40;

  // English sub-header
  ctx.textAlign = 'left';
  ctx.font = `500 26px ${F.english}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText(data.englishDay, 60, y);

  ctx.textAlign = 'center';
  ctx.font = `700 28px ${F.english}`;
  ctx.fillStyle = C.ink2;
  ctx.fillText(`${data.englishMonth.toUpperCase()} ${data.year}`, cx, y);

  ctx.textAlign = 'right';
  ctx.font = `500 24px ${F.english}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText(data.masam.english, W - 60, y);

  y += 30;

  // Sunrise + Date Number + Sunset
  const sunY = y + 80;

  // Sunrise (left)
  ctx.textAlign = 'center';
  ctx.font = `700 36px ${F.english}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(to12Hr(data.sunrise), 170, sunY);
  ctx.font = `500 22px ${F.english}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText('sunrise', 170, sunY + 28);

  // Date number (center)
  ctx.textAlign = 'center';
  ctx.font = `400 200px ${F.date}`;
  ctx.fillStyle = C.fest;
  ctx.fillText(String(data.dateNum), cx, sunY + 30);

  // Sunset (right)
  ctx.font = `700 36px ${F.english}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(to12Hr(data.sunset), W - 170, sunY);
  ctx.font = `500 22px ${F.english}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText('sunset', W - 170, sunY + 28);

  y = sunY + 70;

  // Festival name
  if (data.festival) {
    y += 20;
    ctx.textAlign = 'center';
    ctx.font = `800 48px ${F.telugu}`;
    ctx.fillStyle = C.fest;
    ctx.fillText(data.festival.telugu, cx, y);
    if (data.festival.description) {
      y += 40;
      ctx.font = `400 28px ${F.telugu}`;
      ctx.fillStyle = C.ink3;
      ctx.fillText(data.festival.description, cx, y);
    }
    y += 20;
  }

  y += 30;
  drawSeparator(ctx, 60, y, W - 120);
  y += 30;

  // Tithi line
  drawTithiLine(ctx, `${data.paksha} ${data.tithi.name}`, cx, y);
  y += 50;

  // Nakshatra block
  ctx.textAlign = 'center';
  ctx.font = `500 22px ${F.telugu}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText('నక్షత్రం', cx, y);
  y += 38;
  ctx.font = `800 42px ${F.telugu}`;
  ctx.fillStyle = C.ink;
  ctx.fillText(data.nakshatra.name, cx, y);
  y += 50;

  // Yogam + Karanam
  ctx.font = `500 26px ${F.telugu}`;
  ctx.fillStyle = C.ink3;
  ctx.fillText(`యోగం  ${data.yogam.name}  ·  కరణం  ${data.karanam.name}`, cx, y);
  y += 40;

  drawSeparator(ctx, 60, y, W - 120);
  y += 35;

  // Inauspicious timings
  ctx.font = `500 24px ${F.telugu}`;
  const timings = [
    { label: 'రాహు', value: data.rahuKalam },
    { label: 'వర్జ్యం', value: data.varjyam },
    { label: 'దుర్ము.', value: data.durmuhurtham },
  ];
  const colW = (W - 120) / 3;
  timings.forEach((t, i) => {
    const tx = 60 + colW * i + colW / 2;
    ctx.textAlign = 'center';
    ctx.fillStyle = C.ink3;
    ctx.font = `500 22px ${F.telugu}`;
    ctx.fillText(t.label, tx, y);
    ctx.fillStyle = C.ink2;
    ctx.font = `600 24px ${F.english}`;
    ctx.fillText(t.value, tx, y + 30);
  });

  y += 70;
  drawSeparator(ctx, 60, y, W - 120);
  y += 35;

  // Samvatsaram
  ctx.textAlign = 'center';
  ctx.font = `400 24px ${F.telugu}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText(`${SAMVATSARAM} · ${CITY}`, cx, y);

  // Branding
  drawBranding(ctx, W, H - 50);

  return canvasToBlob(canvas);
}
