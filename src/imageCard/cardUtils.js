/**
 * Shared Canvas drawing utilities for image card generation.
 * Colors and fonts match the app's golden paper aesthetic.
 */

// Colors
export const C = {
  paperBase: '#F5E4A8',
  paperLight: '#FBF0CA',
  paperDark: '#E8D080',
  paperDeep: '#D4B860',
  cream: '#FFF8E8',
  ink: '#3a150a',
  ink2: '#6b2d15',
  ink3: '#915838',
  ink4: '#b88050',
  fest: '#d45500',
  gold: '#d6a820',
  goldLight: '#E8C840',
  goldDark: '#A08018',
  wall: '#1a120e',
  warmWhite: '#FFF5E0',
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

/** Draw rich golden paper background with depth */
export function drawBackground(ctx, w, h) {
  // Base warm fill
  ctx.fillStyle = C.paperBase;
  ctx.fillRect(0, 0, w, h);

  // Radial glow from center-top
  const grad = ctx.createRadialGradient(w / 2, h * 0.3, 0, w / 2, h * 0.3, w * 0.8);
  grad.addColorStop(0, C.cream);
  grad.addColorStop(0.4, C.paperLight);
  grad.addColorStop(0.8, C.paperBase);
  grad.addColorStop(1, C.paperDark);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, w, h);

  // Subtle vignette at edges
  const vig = ctx.createRadialGradient(w / 2, h / 2, w * 0.25, w / 2, h / 2, w * 0.9);
  vig.addColorStop(0, 'rgba(0,0,0,0)');
  vig.addColorStop(1, 'rgba(80,50,20,0.08)');
  ctx.fillStyle = vig;
  ctx.fillRect(0, 0, w, h);
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

// ─── DECORATIVE ELEMENTS ───────────────────────────────

/** Draw faint mandala watermark */
export function drawMandala(ctx, cx, cy, maxR, color, baseAlpha) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  const rings = 6;
  for (let ring = 1; ring <= rings; ring++) {
    const r = maxR * ring / rings;
    const n = 8 * ring;
    const alpha = baseAlpha * (1 - ring * 0.1);

    // Ring circle
    ctx.globalAlpha = alpha * 0.6;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.stroke();

    // Dots on ring
    ctx.globalAlpha = alpha;
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * r, cy + Math.sin(a) * r, 1.5 + ring * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Petal arcs on even rings
    if (ring % 2 === 0 && ring < rings) {
      ctx.globalAlpha = alpha * 0.5;
      ctx.lineWidth = 0.6;
      const petals = n / 2;
      for (let i = 0; i < petals; i++) {
        const a1 = (i * 2 / n) * Math.PI * 2;
        const a2 = ((i * 2 + 2) / n) * Math.PI * 2;
        const mid = (a1 + a2) / 2;
        const bulge = r * 1.18;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a1) * r, cy + Math.sin(a1) * r);
        ctx.quadraticCurveTo(
          cx + Math.cos(mid) * bulge,
          cy + Math.sin(mid) * bulge,
          cx + Math.cos(a2) * r, cy + Math.sin(a2) * r
        );
        ctx.stroke();
      }
    }

    // Inner petal shapes on odd rings (lotus-like)
    if (ring % 2 === 1 && ring > 1) {
      ctx.globalAlpha = alpha * 0.3;
      const petals = Math.floor(n / 3);
      for (let i = 0; i < petals; i++) {
        const a = (i / petals) * Math.PI * 2;
        const tipR = r * 0.85;
        const baseR = maxR * (ring - 1) / rings;
        const spread = Math.PI / petals * 0.4;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(a - spread) * baseR, cy + Math.sin(a - spread) * baseR);
        ctx.quadraticCurveTo(
          cx + Math.cos(a) * tipR * 1.1,
          cy + Math.sin(a) * tipR * 1.1,
          cx + Math.cos(a + spread) * baseR, cy + Math.sin(a + spread) * baseR
        );
        ctx.stroke();
      }
    }
  }

  // Center lotus
  ctx.globalAlpha = baseAlpha * 1.2;
  const cr = maxR * 0.08;
  ctx.beginPath();
  ctx.arc(cx, cy, cr, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = baseAlpha * 0.8;
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2;
    const pr = cr * 2.5;
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    ctx.quadraticCurveTo(
      cx + Math.cos(a - 0.3) * pr, cy + Math.sin(a - 0.3) * pr,
      cx + Math.cos(a) * pr * 1.2, cy + Math.sin(a) * pr * 1.2
    );
    ctx.quadraticCurveTo(
      cx + Math.cos(a + 0.3) * pr, cy + Math.sin(a + 0.3) * pr,
      cx, cy
    );
    ctx.stroke();
  }

  ctx.restore();
}

/** Draw corner ornaments (quarter mandalas at each corner) */
export function drawCornerOrnaments(ctx, w, h, inset, color, alpha) {
  const size = 70;
  const corners = [
    { x: inset, y: inset, sa: Math.PI, ea: Math.PI * 1.5 },
    { x: w - inset, y: inset, sa: Math.PI * 1.5, ea: Math.PI * 2 },
    { x: w - inset, y: h - inset, sa: 0, ea: Math.PI * 0.5 },
    { x: inset, y: h - inset, sa: Math.PI * 0.5, ea: Math.PI },
  ];

  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;

  for (const { x, y, sa, ea } of corners) {
    // Concentric quarter arcs
    for (let i = 1; i <= 4; i++) {
      const r = size * i / 4;
      ctx.lineWidth = 1.2 - i * 0.15;
      ctx.globalAlpha = alpha * (1.1 - i * 0.15);
      ctx.beginPath();
      ctx.arc(x, y, r, sa, ea);
      ctx.stroke();

      // Dots along arc
      const steps = 2 + i;
      ctx.globalAlpha = alpha * 0.8;
      for (let j = 0; j <= steps; j++) {
        const a = sa + (ea - sa) * j / steps;
        ctx.beginPath();
        ctx.arc(x + Math.cos(a) * r, y + Math.sin(a) * r, 1.8 - i * 0.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Small petal flourish at corner
    const petalR = 18;
    const mid = (sa + ea) / 2;
    ctx.globalAlpha = alpha * 0.6;
    ctx.lineWidth = 0.8;
    for (let p = -1; p <= 1; p++) {
      const a = mid + p * 0.4;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(
        x + Math.cos(a - 0.15) * petalR * 0.7,
        y + Math.sin(a - 0.15) * petalR * 0.7,
        x + Math.cos(a) * petalR,
        y + Math.sin(a) * petalR
      );
      ctx.quadraticCurveTo(
        x + Math.cos(a + 0.15) * petalR * 0.7,
        y + Math.sin(a + 0.15) * petalR * 0.7,
        x, y
      );
      ctx.stroke();
    }
  }
  ctx.restore();
}

/** Draw ornate multi-layer border with dot accents */
export function drawOrnateBorder(ctx, w, h, inset) {
  const m = inset;

  // Outer gold frame
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 3;
  roundRect(ctx, m, m, w - m * 2, h - m * 2, 14);
  ctx.stroke();

  // Middle decorative frame
  ctx.strokeStyle = C.goldDark;
  ctx.lineWidth = 1;
  roundRect(ctx, m + 5, m + 5, w - (m + 5) * 2, h - (m + 5) * 2, 10);
  ctx.stroke();

  // Dot pattern along border
  ctx.fillStyle = C.gold;
  ctx.globalAlpha = 0.25;
  const sp = 20;
  for (let x = m + sp; x < w - m; x += sp) {
    ctx.beginPath(); ctx.arc(x, m + 2.5, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(x, h - m - 2.5, 1.2, 0, Math.PI * 2); ctx.fill();
  }
  for (let y = m + sp; y < h - m; y += sp) {
    ctx.beginPath(); ctx.arc(m + 2.5, y, 1.2, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(w - m - 2.5, y, 1.2, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Inner thin frame
  ctx.strokeStyle = C.ink4;
  ctx.lineWidth = 0.5;
  ctx.globalAlpha = 0.5;
  roundRect(ctx, m + 10, m + 10, w - (m + 10) * 2, h - (m + 10) * 2, 6);
  ctx.stroke();
  ctx.globalAlpha = 1;
}

/** Draw decorative divider with center diamond */
export function drawDivider(ctx, cx, y, halfW) {
  ctx.save();

  // Lines extending from center
  ctx.strokeStyle = C.ink4;
  ctx.lineWidth = 0.7;
  ctx.globalAlpha = 0.35;
  ctx.beginPath();
  ctx.moveTo(cx - halfW, y);
  ctx.lineTo(cx - 14, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 14, y);
  ctx.lineTo(cx + halfW, y);
  ctx.stroke();

  // Center diamond
  ctx.fillStyle = C.gold;
  ctx.globalAlpha = 0.5;
  ctx.beginPath();
  ctx.moveTo(cx, y - 5);
  ctx.lineTo(cx + 5, y);
  ctx.lineTo(cx, y + 5);
  ctx.lineTo(cx - 5, y);
  ctx.closePath();
  ctx.fill();

  // Flanking dots
  ctx.globalAlpha = 0.3;
  [-10, -20, 10, 20].forEach(dx => {
    ctx.beginPath();
    ctx.arc(cx + dx, y, 1.3, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.restore();
}

/** Draw a lotus flower icon */
export function drawLotus(ctx, x, y, size, color, alpha) {
  ctx.save();
  ctx.translate(x, y);
  ctx.globalAlpha = alpha;

  const petals = 8;
  const petalLen = size;
  const petalWidth = size * 0.35;

  for (let i = 0; i < petals; i++) {
    const angle = (i / petals) * Math.PI * 2 - Math.PI / 2;
    ctx.save();
    ctx.rotate(angle);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(-petalWidth, -petalLen * 0.6, 0, -petalLen);
    ctx.quadraticCurveTo(petalWidth, -petalLen * 0.6, 0, 0);
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha * 0.3;
    ctx.fill();
    ctx.strokeStyle = color;
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = alpha;
    ctx.stroke();
    ctx.restore();
  }

  // Center
  ctx.globalAlpha = alpha * 0.6;
  ctx.beginPath();
  ctx.arc(0, 0, size * 0.2, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();

  ctx.restore();
}

/** Draw a small diya (oil lamp) */
export function drawDiya(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  const s = size / 20;

  // Lamp bowl
  ctx.beginPath();
  ctx.moveTo(-8 * s, 4 * s);
  ctx.quadraticCurveTo(-10 * s, -1 * s, -6 * s, -4 * s);
  ctx.quadraticCurveTo(0, -6 * s, 6 * s, -4 * s);
  ctx.quadraticCurveTo(10 * s, -1 * s, 8 * s, 4 * s);
  ctx.closePath();
  ctx.fillStyle = C.gold;
  ctx.globalAlpha = 0.3;
  ctx.fill();
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 1;
  ctx.globalAlpha = 0.5;
  ctx.stroke();

  // Base
  ctx.beginPath();
  ctx.moveTo(-8 * s, 4 * s);
  ctx.lineTo(8 * s, 4 * s);
  ctx.stroke();

  // Flame
  ctx.globalAlpha = 0.6;
  ctx.beginPath();
  ctx.moveTo(0, -4 * s);
  ctx.quadraticCurveTo(-3 * s, -12 * s, 0, -18 * s);
  ctx.quadraticCurveTo(3 * s, -12 * s, 0, -4 * s);
  ctx.fillStyle = '#F5E4A8';
  ctx.fill();
  ctx.strokeStyle = C.gold;
  ctx.lineWidth = 0.7;
  ctx.stroke();

  // Flame glow
  ctx.globalAlpha = 0.15;
  ctx.beginPath();
  ctx.arc(0, -12 * s, 8 * s, 0, Math.PI * 2);
  ctx.fillStyle = C.warmWhite;
  ctx.fill();

  ctx.restore();
}

/** Draw text with a soft glow behind it */
export function drawGlowText(ctx, text, x, y, font, color, glowColor, glowSize) {
  ctx.save();
  ctx.font = font;
  ctx.textAlign = 'center';

  // Glow
  ctx.shadowColor = glowColor;
  ctx.shadowBlur = glowSize;
  ctx.fillStyle = glowColor;
  ctx.globalAlpha = 0.4;
  ctx.fillText(text, x, y);
  ctx.fillText(text, x, y);

  // Main text
  ctx.shadowBlur = 0;
  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.fillText(text, x, y);

  ctx.restore();
}

/** Draw branding footer — properly measured to avoid overlap */
export function drawBranding(ctx, w, y) {
  ctx.save();
  ctx.globalAlpha = 0.55;
  ctx.textBaseline = 'alphabetic';

  const gap = 4;
  ctx.font = `800 32px ${F.telugu}`;
  ctx.fillStyle = C.ink3;
  const manaW = ctx.measureText('మన').width;

  ctx.font = `700 30px ${F.english}`;
  const calW = ctx.measureText('Calendar.com').width;

  const totalW = manaW + gap + calW;
  const startX = (w - totalW) / 2;

  ctx.textAlign = 'left';
  ctx.font = `800 32px ${F.telugu}`;
  ctx.fillText('మన', startX, y);

  ctx.font = `700 30px ${F.english}`;
  ctx.fillText('Calendar.com', startX + manaW + gap, y);

  ctx.restore();
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

/** Share an image blob with text fallback */
export async function shareImageWithFallback(blob, filename, text) {
  const file = new File([blob], filename, { type: 'image/png' });

  // Try sharing with image file
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file] });
      return;
    }
  } catch (e) {
    if (e.name === 'AbortError') return; // User cancelled
    // Other error — fall through to text
  }

  // Fallback: text share
  try {
    if (navigator.share) {
      await navigator.share({ text });
      return;
    }
  } catch (e) {
    if (e.name === 'AbortError') return;
  }

  // Last resort: WhatsApp deep link
  window.location.href = `whatsapp://send?text=${encodeURIComponent(text)}`;
}
