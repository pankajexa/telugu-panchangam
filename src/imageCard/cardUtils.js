/**
 * Shared Canvas drawing utilities for image card generation.
 * Colors and fonts match the app's golden paper aesthetic.
 */

// Colors
export const C = {
  paperBase: '#f0c230',
  paperLight: '#f5d050',
  paperDark: '#dbb428',
  ink: '#3a150a',
  ink2: '#6b2d15',
  ink3: '#915838',
  ink4: '#b88050',
  fest: '#d45500',
  gold: '#d6a820',
  wall: '#1a120e',
};

// Fonts (already loaded via Google Fonts in paper.css)
export const F = {
  telugu: "'Noto Serif Telugu', serif",
  english: "'Inter', system-ui, sans-serif",
  date: "'Abril Fatface', Georgia, serif",
};

/** Wait for all fonts to be ready */
export async function ensureFonts() {
  if (document.fonts) await document.fonts.ready;
}

/** Create a canvas of given size */
export function createCanvas(w, h) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

/** Draw golden paper background gradient */
export function drawBackground(ctx, w, h) {
  const grad = ctx.createRadialGradient(w / 2, h * 0.4, 0, w / 2, h * 0.4, w * 0.7);
  grad.addColorStop(0, C.paperLight);
  grad.addColorStop(0.5, C.paperBase);
  grad.addColorStop(1, C.paperDark);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);
}

/** Draw a decorative double-line border */
export function drawBorder(ctx, w, h, inset = 30) {
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 2;
  roundRect(ctx, inset, inset, w - inset * 2, h - inset * 2, 12);
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.strokeStyle = C.ink4;
  roundRect(ctx, inset + 6, inset + 6, w - (inset + 6) * 2, h - (inset + 6) * 2, 8);
  ctx.stroke();
}

/** Draw a rounded rectangle path */
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

/** Draw branding footer */
export function drawBranding(ctx, w, y) {
  ctx.textAlign = 'center';
  ctx.font = `800 28px ${F.telugu}`;
  ctx.fillStyle = C.ink4;
  ctx.fillText('మన', w / 2 - 50, y);
  ctx.font = `700 26px ${F.english}`;
  ctx.fillText('Calendar.com', w / 2 + 30, y);
}

/** Draw a thin ornamental separator line */
export function drawSeparator(ctx, x, y, width) {
  ctx.strokeStyle = C.ink4;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + width, y);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** Draw centered text with ornamental dashes */
export function drawTithiLine(ctx, text, cx, y) {
  ctx.textAlign = 'center';
  ctx.font = `700 36px ${F.telugu}`;
  ctx.fillStyle = C.ink;
  const textW = ctx.measureText(text).width;
  const dashW = 40;
  const gap = 16;

  ctx.fillText(text, cx, y);

  ctx.strokeStyle = C.ink4;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(cx - textW / 2 - gap - dashW, y - 6);
  ctx.lineTo(cx - textW / 2 - gap, y - 6);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + textW / 2 + gap, y - 6);
  ctx.lineTo(cx + textW / 2 + gap + dashW, y - 6);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** Word-wrap text to fit maxWidth, returns array of lines */
export function wrapText(ctx, text, maxWidth) {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? currentLine + ' ' + word : word;
    if (ctx.measureText(testLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/** Convert canvas to Blob (PNG) */
export function canvasToBlob(canvas) {
  return new Promise(resolve => {
    canvas.toBlob(resolve, 'image/png');
  });
}

/** Convert 24h time string to 12h */
export function to12Hr(time24) {
  const [hh, mm] = time24.split(':').map(Number);
  const period = hh >= 12 ? 'PM' : 'AM';
  const h = hh % 12 || 12;
  return `${h}:${mm.toString().padStart(2, '0')} ${period}`;
}
