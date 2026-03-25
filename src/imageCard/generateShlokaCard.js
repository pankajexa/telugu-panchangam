/**
 * Canvas-based shloka share card generator.
 * Output: 1080 × 1350 px (4:5 — ideal for WhatsApp & Instagram)
 * Style: golden parchment matching the app's aesthetic.
 */

const W = 1080;
const H = 1350;

// Colors — matching app palette
const GOLD       = '#C49B2A';
const GOLD_DARK  = '#A07820';
const GOLD_LIGHT = '#E8C84A';
const PAPER      = '#FBF0CA';
const PAPER_DARK = '#F0DC90';
const PAPER_MID  = '#F5E4A8';
const INK        = '#3a150a';
const INK2       = '#6b2d15';
const INK3       = '#915838';

function hex(h) { return h; }

function setFont(ctx, size, weight, family) {
  ctx.font = `${weight} ${size}px ${family}`;
}

/**
 * Draw text that wraps to multiple lines.
 * Returns the Y position after the last line.
 */
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let curY = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, curY);
      line = word;
      curY += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) { ctx.fillText(line, x, curY); curY += lineHeight; }
  return curY;
}

/**
 * Draw Devanagari lines (newline-separated), centered.
 * Returns Y after last line.
 */
function drawCenteredLines(ctx, text, x, y, lineHeight) {
  const lines = text.split('\n');
  let curY = y;
  for (const line of lines) {
    ctx.fillText(line.trim(), x, curY);
    curY += lineHeight;
  }
  return curY;
}

function drawGoldenBorder(ctx, margin = 32) {
  // Outer thick border
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  roundRect(ctx, margin, margin, W - margin * 2, H - margin * 2, 20);
  ctx.stroke();

  // Inner thin line
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  roundRect(ctx, margin + 10, margin + 10, W - (margin + 10) * 2, H - (margin + 10) * 2, 14);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawCornerOrnaments(ctx) {
  // Simple lotus-petal corner accents
  const corners = [
    [60, 60, 0],
    [W - 60, 60, 90],
    [W - 60, H - 60, 180],
    [60, H - 60, 270],
  ];
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.5;
  ctx.globalAlpha = 0.55;
  for (const [cx, cy, rot] of corners) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((rot * Math.PI) / 180);
    // L-shaped bracket
    ctx.beginPath();
    ctx.moveTo(0, -22); ctx.lineTo(0, 0); ctx.lineTo(22, 0);
    ctx.stroke();
    // Small diamond
    ctx.beginPath();
    ctx.moveTo(0, -6); ctx.lineTo(5, 0); ctx.lineTo(0, 6); ctx.lineTo(-5, 0); ctx.closePath();
    ctx.fillStyle = GOLD;
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = 1;
}

function drawHorizontalRule(ctx, y, xPad = 60) {
  const grad = ctx.createLinearGradient(xPad, y, W - xPad, y);
  grad.addColorStop(0, 'rgba(196,155,42,0)');
  grad.addColorStop(0.2, GOLD);
  grad.addColorStop(0.8, GOLD);
  grad.addColorStop(1, 'rgba(196,155,42,0)');
  ctx.strokeStyle = grad;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(xPad, y); ctx.lineTo(W - xPad, y);
  ctx.stroke();
}

function drawOmSymbol(ctx, x, y) {
  setFont(ctx, 56, '700', "'Noto Sans Devanagari', sans-serif");
  ctx.fillStyle = GOLD;
  ctx.globalAlpha = 0.85;
  ctx.textAlign = 'center';
  ctx.fillText('ॐ', x, y);
  ctx.globalAlpha = 1;
}

function drawFaintWatermark(ctx) {
  ctx.save();
  ctx.translate(W / 2, H / 2);
  ctx.rotate(0);
  setFont(ctx, 280, '700', "'Noto Sans Devanagari', sans-serif");
  ctx.fillStyle = GOLD;
  ctx.globalAlpha = 0.04;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('ॐ', 0, 0);
  ctx.restore();
}

export async function generateShlokaCard(shloka) {
  // Ensure fonts are loaded
  try {
    await document.fonts.load(`700 24px 'Noto Sans Devanagari'`);
    await document.fonts.load(`600 24px 'Noto Sans Telugu'`);
    await document.fonts.load(`600 24px 'Plus Jakarta Sans'`);
  } catch (_) { /* use whatever is available */ }

  const canvas = document.createElement('canvas');
  canvas.width  = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // ── Background ──────────────────────────────────────────────────────────────
  const bg = ctx.createLinearGradient(0, 0, W, H);
  bg.addColorStop(0,   PAPER);
  bg.addColorStop(0.4, PAPER_MID);
  bg.addColorStop(1,   PAPER_DARK);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);

  // Subtle top sheen
  const sheen = ctx.createLinearGradient(0, 0, 0, 220);
  sheen.addColorStop(0, 'rgba(255,255,255,0.18)');
  sheen.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, W, 220);

  // Faint Om watermark
  drawFaintWatermark(ctx);

  // Border & ornaments
  drawGoldenBorder(ctx, 36);
  drawCornerOrnaments(ctx);

  // ── Om symbol ───────────────────────────────────────────────────────────────
  drawOmSymbol(ctx, W / 2, 140);

  // Title line
  setFont(ctx, 22, '600', "'Plus Jakarta Sans', sans-serif");
  ctx.fillStyle = INK2;
  ctx.globalAlpha = 0.75;
  ctx.textAlign = 'center';
  ctx.fillText('RAMAYANA SHLOKA', W / 2, 175);
  ctx.globalAlpha = 1;

  drawHorizontalRule(ctx, 200, 80);

  // ── Devanagari (primary, large) ──────────────────────────────────────────────
  let y = 250;
  ctx.textAlign = 'center';
  ctx.fillStyle = INK;
  const lines = shloka.sanskritDevanagari.split('\n');
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    // Auto-size: start at 46px, shrink to fit
    let fontSize = 46;
    setFont(ctx, fontSize, '600', "'Noto Sans Devanagari', sans-serif");
    while (ctx.measureText(trimmed).width > W - 140 && fontSize > 28) {
      fontSize -= 2;
      setFont(ctx, fontSize, '600', "'Noto Sans Devanagari', sans-serif");
    }
    ctx.fillText(trimmed, W / 2, y);
    y += fontSize * 1.6;
  }

  // ── Telugu transliteration ──────────────────────────────────────────────────
  y += 14;
  drawHorizontalRule(ctx, y, 100);
  y += 36;

  ctx.fillStyle = INK2;
  const teLines = shloka.teluguTransliteration.split('\n');
  for (const line of teLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    let fontSize = 32;
    setFont(ctx, fontSize, '500', "'Noto Sans Telugu', sans-serif");
    while (ctx.measureText(trimmed).width > W - 140 && fontSize > 20) {
      fontSize -= 2;
      setFont(ctx, fontSize, '500', "'Noto Sans Telugu', sans-serif");
    }
    ctx.fillText(trimmed, W / 2, y);
    y += fontSize * 1.6;
  }

  // ── English meaning ──────────────────────────────────────────────────────────
  y += 18;
  drawHorizontalRule(ctx, y, 100);
  y += 40;

  setFont(ctx, 26, '400', "'Plus Jakarta Sans', sans-serif");
  ctx.fillStyle = INK;
  ctx.font = `italic 26px 'Plus Jakarta Sans', sans-serif`;
  ctx.textAlign = 'center';
  // Wrap meaning text
  const words = shloka.englishMeaning.split(' ');
  let line2 = '';
  const meaningLines = [];
  for (const word of words) {
    const test = line2 ? `${line2} ${word}` : word;
    if (ctx.measureText(test).width > W - 160 && line2) {
      meaningLines.push(line2);
      line2 = word;
    } else {
      line2 = test;
    }
  }
  if (line2) meaningLines.push(line2);
  for (const ml of meaningLines) {
    ctx.fillText(ml, W / 2, y);
    y += 38;
  }

  // ── Purpose chip ─────────────────────────────────────────────────────────────
  y += 20;
  const chipLabel = shloka.purpose.toUpperCase();
  setFont(ctx, 20, '700', "'Plus Jakarta Sans', sans-serif");
  const chipW = ctx.measureText(chipLabel).width + 50;
  const chipX = (W - chipW) / 2;
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 1.5;
  roundRect(ctx, chipX, y - 22, chipW, 36, 18);
  ctx.stroke();
  ctx.fillStyle = 'rgba(196,155,42,0.08)';
  roundRect(ctx, chipX, y - 22, chipW, 36, 18);
  ctx.fill();
  ctx.fillStyle = GOLD_DARK;
  ctx.fillText(chipLabel, W / 2, y + 4);

  y += 50;

  // ── Source ───────────────────────────────────────────────────────────────────
  setFont(ctx, 20, '400', "'Plus Jakarta Sans', sans-serif");
  ctx.font = `italic 20px 'Plus Jakarta Sans', sans-serif`;
  ctx.fillStyle = INK3;
  ctx.globalAlpha = 0.75;
  ctx.fillText(shloka.source, W / 2, y);
  ctx.globalAlpha = 1;

  // ── Branding footer ───────────────────────────────────────────────────────────
  drawHorizontalRule(ctx, H - 100, 80);

  setFont(ctx, 34, '700', "'Noto Sans Telugu', sans-serif");
  ctx.fillStyle = GOLD_DARK;
  ctx.textAlign = 'center';
  ctx.fillText('మనCalendar', W / 2, H - 66);

  setFont(ctx, 19, '400', "'Plus Jakarta Sans', sans-serif");
  ctx.fillStyle = INK3;
  ctx.globalAlpha = 0.65;
  ctx.fillText('Telugu Panchangam · Ramayana Shlokas', W / 2, H - 42);
  ctx.globalAlpha = 1;

  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => blob ? resolve(blob) : reject(new Error('Canvas toBlob failed')), 'image/png');
  });
}
