/**
 * Festival-specific canvas artwork for wish cards.
 * Golden line-art style matching the app's motif aesthetic.
 */

import { C } from './cardUtils';

const G = C.gold;
const G2 = C.goldDark;

// ─── Helpers ──────────────────────────────────────────

function stroke(ctx, color, width, alpha) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.globalAlpha = alpha;
}

function fill(ctx, color, alpha) {
  ctx.fillStyle = color;
  ctx.globalAlpha = alpha;
}

// ─── RAMA PATTABHISHEKAM ──────────────────────────────
// Lord Rama and Sita seated on throne under royal canopy
// with Hanuman in devotion — coronation scene

export function drawRamaPattabhishekam(ctx, cx, cy, scale, color, alpha) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const col = color || G;
  const col2 = G2;

  // ═══ ROYAL CANOPY / PRABHAVALI ═══
  // Decorative arch above the figures
  stroke(ctx, col, 2.5, alpha * 0.7);
  ctx.beginPath();
  ctx.arc(0, -30, 170, Math.PI + 0.15, -0.15);
  ctx.stroke();

  // Scalloped outer edge
  stroke(ctx, col, 1.5, alpha * 0.5);
  for (let i = 0; i < 14; i++) {
    const a1 = Math.PI + 0.15 + (i / 14) * (Math.PI - 0.3);
    const a2 = Math.PI + 0.15 + ((i + 1) / 14) * (Math.PI - 0.3);
    const mid = (a1 + a2) / 2;
    const r = 170;
    const bulge = 185;
    ctx.beginPath();
    ctx.moveTo(Math.cos(a1) * r, -30 + Math.sin(a1) * r);
    ctx.quadraticCurveTo(
      Math.cos(mid) * bulge, -30 + Math.sin(mid) * bulge,
      Math.cos(a2) * r, -30 + Math.sin(a2) * r
    );
    ctx.stroke();
  }

  // Inner arch
  stroke(ctx, col2, 1, alpha * 0.35);
  ctx.beginPath();
  ctx.arc(0, -30, 155, Math.PI + 0.2, -0.2);
  ctx.stroke();

  // Kalasha on top of arch
  fill(ctx, col, alpha * 0.5);
  ctx.beginPath();
  ctx.moveTo(-8, -200);
  ctx.quadraticCurveTo(-12, -194, -10, -188);
  ctx.quadraticCurveTo(0, -184, 10, -188);
  ctx.quadraticCurveTo(12, -194, 8, -200);
  ctx.quadraticCurveTo(0, -210, -8, -200);
  ctx.fill();
  stroke(ctx, col, 1.2, alpha * 0.6);
  ctx.stroke();

  // ═══ PILLARS ═══
  stroke(ctx, col, 2, alpha * 0.6);
  // Left pillar
  ctx.beginPath();
  ctx.moveTo(-165, -30);
  ctx.lineTo(-165, 120);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(-172, -30);
  ctx.lineTo(-172, 120);
  ctx.stroke();
  // Pillar base
  ctx.beginPath();
  ctx.moveTo(-180, 120);
  ctx.lineTo(-155, 120);
  ctx.stroke();
  // Pillar decorations
  stroke(ctx, col2, 0.8, alpha * 0.3);
  for (let y = -10; y < 110; y += 25) {
    ctx.beginPath();
    ctx.moveTo(-172, y);
    ctx.lineTo(-165, y);
    ctx.stroke();
  }

  // Right pillar
  stroke(ctx, col, 2, alpha * 0.6);
  ctx.beginPath();
  ctx.moveTo(165, -30);
  ctx.lineTo(165, 120);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(172, -30);
  ctx.lineTo(172, 120);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(155, 120);
  ctx.lineTo(180, 120);
  ctx.stroke();
  stroke(ctx, col2, 0.8, alpha * 0.3);
  for (let y = -10; y < 110; y += 25) {
    ctx.beginPath();
    ctx.moveTo(165, y);
    ctx.lineTo(172, y);
    ctx.stroke();
  }

  // ═══ THRONE / SIMHASANA ═══
  stroke(ctx, col, 2, alpha * 0.65);
  // Throne seat
  ctx.beginPath();
  ctx.moveTo(-120, 70);
  ctx.lineTo(120, 70);
  ctx.lineTo(130, 85);
  ctx.lineTo(-130, 85);
  ctx.closePath();
  ctx.stroke();
  fill(ctx, col, alpha * 0.08);
  ctx.fill();

  // Throne base
  stroke(ctx, col, 1.8, alpha * 0.55);
  ctx.beginPath();
  ctx.moveTo(-130, 85);
  ctx.lineTo(130, 85);
  ctx.lineTo(140, 105);
  ctx.lineTo(-140, 105);
  ctx.closePath();
  ctx.stroke();
  // Base decorations
  stroke(ctx, col2, 0.8, alpha * 0.3);
  for (let x = -110; x <= 110; x += 30) {
    ctx.beginPath();
    ctx.arc(x, 95, 4, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Throne back (tall, behind figures)
  stroke(ctx, col, 1.5, alpha * 0.4);
  ctx.beginPath();
  ctx.moveTo(-100, 70);
  ctx.lineTo(-110, -50);
  ctx.quadraticCurveTo(-100, -80, -80, -70);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(100, 70);
  ctx.lineTo(110, -50);
  ctx.quadraticCurveTo(100, -80, 80, -70);
  ctx.stroke();

  // ═══ ROYAL UMBRELLA (CHHATRA) ═══
  stroke(ctx, col, 1.5, alpha * 0.5);
  // Pole
  ctx.beginPath();
  ctx.moveTo(0, -60);
  ctx.lineTo(0, -150);
  ctx.stroke();
  // Umbrella dome
  ctx.beginPath();
  ctx.arc(0, -150, 55, Math.PI, 0);
  ctx.stroke();
  // Fringes
  stroke(ctx, col2, 0.7, alpha * 0.35);
  for (let i = 0; i < 10; i++) {
    const a = Math.PI + (i / 9) * Math.PI;
    const x1 = Math.cos(a) * 55;
    const y1 = -150 + Math.sin(a) * 55;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1, y1 + 6);
    ctx.stroke();
  }

  // ═══ LORD RAMA (right of center) ═══
  const rx = 35; // Rama center x

  // Crown (Kiritam) — tall and ornate
  stroke(ctx, col, 1.8, alpha * 0.7);
  ctx.beginPath();
  ctx.moveTo(rx - 18, -20);
  ctx.lineTo(rx - 14, -50);
  ctx.quadraticCurveTo(rx - 8, -62, rx, -70);
  ctx.quadraticCurveTo(rx + 8, -62, rx + 14, -50);
  ctx.lineTo(rx + 18, -20);
  ctx.stroke();
  // Crown details
  stroke(ctx, col2, 0.8, alpha * 0.4);
  ctx.beginPath();
  ctx.moveTo(rx - 10, -35);
  ctx.quadraticCurveTo(rx, -45, rx + 10, -35);
  ctx.stroke();
  // Crown jewel
  fill(ctx, col, alpha * 0.4);
  ctx.beginPath();
  ctx.arc(rx, -58, 3, 0, Math.PI * 2);
  ctx.fill();

  // Head
  stroke(ctx, col, 1.5, alpha * 0.7);
  ctx.beginPath();
  ctx.ellipse(rx, -8, 16, 18, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Eyes
  stroke(ctx, col, 1, alpha * 0.5);
  ctx.beginPath();
  ctx.moveTo(rx - 8, -10);
  ctx.quadraticCurveTo(rx - 5, -13, rx - 2, -10);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(rx + 2, -10);
  ctx.quadraticCurveTo(rx + 5, -13, rx + 8, -10);
  ctx.stroke();

  // Tilak
  fill(ctx, col, alpha * 0.5);
  ctx.beginPath();
  ctx.moveTo(rx, -22);
  ctx.lineTo(rx - 2, -17);
  ctx.lineTo(rx + 2, -17);
  ctx.closePath();
  ctx.fill();

  // Earrings
  stroke(ctx, col2, 0.8, alpha * 0.4);
  ctx.beginPath();
  ctx.arc(rx - 16, -2, 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(rx + 16, -2, 3, 0, Math.PI * 2);
  ctx.stroke();

  // Body (seated, upper torso)
  stroke(ctx, col, 1.5, alpha * 0.65);
  ctx.beginPath();
  ctx.moveTo(rx - 26, 10);
  ctx.quadraticCurveTo(rx - 30, 25, rx - 28, 40);
  ctx.lineTo(rx - 20, 65);
  ctx.quadraticCurveTo(rx, 72, rx + 20, 65);
  ctx.lineTo(rx + 28, 40);
  ctx.quadraticCurveTo(rx + 30, 25, rx + 26, 10);
  ctx.stroke();

  // Necklace
  stroke(ctx, col2, 0.8, alpha * 0.4);
  ctx.beginPath();
  ctx.moveTo(rx - 14, 10);
  ctx.quadraticCurveTo(rx, 18, rx + 14, 10);
  ctx.stroke();

  // Left arm (raised, holding bow)
  stroke(ctx, col, 1.3, alpha * 0.6);
  ctx.beginPath();
  ctx.moveTo(rx - 26, 15);
  ctx.quadraticCurveTo(rx - 45, 5, rx - 55, -15);
  ctx.stroke();

  // BOW (Kodanda)
  stroke(ctx, col, 2, alpha * 0.7);
  ctx.beginPath();
  ctx.moveTo(rx - 55, -55);
  ctx.quadraticCurveTo(rx - 70, -15, rx - 55, 25);
  ctx.stroke();
  // Bowstring
  stroke(ctx, col2, 0.8, alpha * 0.5);
  ctx.beginPath();
  ctx.moveTo(rx - 55, -55);
  ctx.lineTo(rx - 55, 25);
  ctx.stroke();

  // Right arm (blessing/on lap)
  stroke(ctx, col, 1.3, alpha * 0.6);
  ctx.beginPath();
  ctx.moveTo(rx + 26, 15);
  ctx.quadraticCurveTo(rx + 38, 30, rx + 30, 50);
  ctx.stroke();
  // Hand — abhaya mudra (raised palm)
  stroke(ctx, col, 1, alpha * 0.5);
  ctx.beginPath();
  ctx.ellipse(rx + 30, 52, 5, 7, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Legs (seated cross-legged)
  stroke(ctx, col, 1.2, alpha * 0.5);
  ctx.beginPath();
  ctx.moveTo(rx - 20, 65);
  ctx.quadraticCurveTo(rx - 35, 68, rx - 30, 60);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(rx + 20, 65);
  ctx.quadraticCurveTo(rx + 35, 68, rx + 30, 60);
  ctx.stroke();

  // ═══ SITA (left of Rama) ═══
  const sx = -45; // Sita center x

  // Tiara / Crown (rounded, smaller)
  stroke(ctx, col, 1.5, alpha * 0.65);
  ctx.beginPath();
  ctx.moveTo(sx - 14, -14);
  ctx.quadraticCurveTo(sx - 10, -38, sx, -44);
  ctx.quadraticCurveTo(sx + 10, -38, sx + 14, -14);
  ctx.stroke();
  // Tiara jewel
  fill(ctx, col, alpha * 0.35);
  ctx.beginPath();
  ctx.arc(sx, -38, 2.5, 0, Math.PI * 2);
  ctx.fill();

  // Head
  stroke(ctx, col, 1.4, alpha * 0.65);
  ctx.beginPath();
  ctx.ellipse(sx, -2, 14, 16, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Eyes
  stroke(ctx, col, 0.8, alpha * 0.45);
  ctx.beginPath();
  ctx.moveTo(sx - 6, -4);
  ctx.quadraticCurveTo(sx - 4, -7, sx - 1, -4);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(sx + 1, -4);
  ctx.quadraticCurveTo(sx + 4, -7, sx + 6, -4);
  ctx.stroke();

  // Bindi
  fill(ctx, '#d45500', alpha * 0.4);
  ctx.beginPath();
  ctx.arc(sx, -12, 2, 0, Math.PI * 2);
  ctx.fill();

  // Earrings
  stroke(ctx, col2, 0.8, alpha * 0.4);
  ctx.beginPath();
  ctx.arc(sx - 14, 4, 3, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(sx + 14, 4, 3, 0, Math.PI * 2);
  ctx.stroke();

  // Body
  stroke(ctx, col, 1.4, alpha * 0.6);
  ctx.beginPath();
  ctx.moveTo(sx - 22, 16);
  ctx.quadraticCurveTo(sx - 24, 30, sx - 22, 45);
  ctx.lineTo(sx - 16, 65);
  ctx.quadraticCurveTo(sx, 70, sx + 16, 65);
  ctx.lineTo(sx + 22, 45);
  ctx.quadraticCurveTo(sx + 24, 30, sx + 22, 16);
  ctx.stroke();

  // Necklace
  stroke(ctx, col2, 0.7, alpha * 0.35);
  ctx.beginPath();
  ctx.moveTo(sx - 12, 16);
  ctx.quadraticCurveTo(sx, 22, sx + 12, 16);
  ctx.stroke();

  // Arms — hands folded in lap holding lotus
  stroke(ctx, col, 1.2, alpha * 0.55);
  ctx.beginPath();
  ctx.moveTo(sx - 22, 20);
  ctx.quadraticCurveTo(sx - 30, 35, sx - 15, 50);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(sx + 22, 20);
  ctx.quadraticCurveTo(sx + 30, 35, sx + 15, 50);
  ctx.stroke();

  // Lotus in hands
  stroke(ctx, col, 1, alpha * 0.45);
  ctx.beginPath();
  ctx.moveTo(sx, 45);
  ctx.lineTo(sx, 35);
  ctx.stroke();
  // Petals
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i - 2) * 0.5;
    ctx.beginPath();
    ctx.moveTo(sx, 35);
    ctx.quadraticCurveTo(
      sx + Math.cos(a - 0.2) * 6, 35 + Math.sin(a - 0.2) * 6,
      sx + Math.cos(a) * 10, 35 + Math.sin(a) * 10
    );
    ctx.quadraticCurveTo(
      sx + Math.cos(a + 0.2) * 6, 35 + Math.sin(a + 0.2) * 6,
      sx, 35
    );
    ctx.stroke();
  }

  // Legs
  stroke(ctx, col, 1, alpha * 0.45);
  ctx.beginPath();
  ctx.moveTo(sx - 16, 65);
  ctx.quadraticCurveTo(sx - 28, 68, sx - 24, 60);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(sx + 16, 65);
  ctx.quadraticCurveTo(sx + 28, 68, sx + 24, 60);
  ctx.stroke();

  // ═══ HANUMAN (front center, kneeling) ═══
  const hx = -5, hy = 110;

  // Head
  stroke(ctx, col, 1.2, alpha * 0.55);
  ctx.beginPath();
  ctx.ellipse(hx, hy - 18, 8, 10, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Crown/headband
  stroke(ctx, col2, 0.8, alpha * 0.35);
  ctx.beginPath();
  ctx.moveTo(hx - 8, hy - 22);
  ctx.quadraticCurveTo(hx, hy - 28, hx + 8, hy - 22);
  ctx.stroke();

  // Body (kneeling)
  stroke(ctx, col, 1.2, alpha * 0.5);
  ctx.beginPath();
  ctx.moveTo(hx - 10, hy - 8);
  ctx.quadraticCurveTo(hx - 12, hy + 5, hx - 8, hy + 15);
  ctx.quadraticCurveTo(hx, hy + 18, hx + 8, hy + 15);
  ctx.quadraticCurveTo(hx + 12, hy + 5, hx + 10, hy - 8);
  ctx.stroke();

  // Hands in namaste
  stroke(ctx, col, 1, alpha * 0.5);
  ctx.beginPath();
  ctx.moveTo(hx - 3, hy);
  ctx.lineTo(hx - 3, hy - 10);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(hx + 3, hy);
  ctx.lineTo(hx + 3, hy - 10);
  ctx.stroke();
  // Joined palms
  ctx.beginPath();
  ctx.moveTo(hx - 3, hy - 10);
  ctx.quadraticCurveTo(hx, hy - 14, hx + 3, hy - 10);
  ctx.stroke();

  // Tail (distinctive, curving up)
  stroke(ctx, col, 1.5, alpha * 0.5);
  ctx.beginPath();
  ctx.moveTo(hx + 8, hy + 10);
  ctx.quadraticCurveTo(hx + 25, hy + 5, hx + 30, hy - 10);
  ctx.quadraticCurveTo(hx + 32, hy - 25, hx + 22, hy - 35);
  ctx.stroke();

  // ═══ DECORATIVE ELEMENTS ═══

  // Flower garland across arch
  stroke(ctx, col2, 0.7, alpha * 0.3);
  ctx.beginPath();
  ctx.moveTo(-165, -30);
  ctx.quadraticCurveTo(-80, -10, 0, -25);
  ctx.quadraticCurveTo(80, -10, 165, -30);
  ctx.stroke();
  // Small flowers on garland
  fill(ctx, col, alpha * 0.25);
  for (let x = -140; x <= 140; x += 35) {
    const gy = -30 + 15 * Math.sin((x + 140) / 280 * Math.PI);
    ctx.beginPath();
    ctx.arc(x, gy, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Diyas on throne base
  const drawMiniDiya = (dx, dy) => {
    stroke(ctx, col, 0.8, alpha * 0.4);
    ctx.beginPath();
    ctx.moveTo(dx - 5, dy + 3);
    ctx.quadraticCurveTo(dx - 6, dy - 1, dx - 4, dy - 3);
    ctx.quadraticCurveTo(dx, dy - 4, dx + 4, dy - 3);
    ctx.quadraticCurveTo(dx + 6, dy - 1, dx + 5, dy + 3);
    ctx.stroke();
    // Flame
    fill(ctx, col, alpha * 0.3);
    ctx.beginPath();
    ctx.moveTo(dx, dy - 3);
    ctx.quadraticCurveTo(dx - 2, dy - 8, dx, dy - 12);
    ctx.quadraticCurveTo(dx + 2, dy - 8, dx, dy - 3);
    ctx.fill();
  };
  drawMiniDiya(-110, 110);
  drawMiniDiya(110, 110);

  ctx.restore();
}

/** Get festival artwork drawing function by name */
export function getFestivalArt(festivalEnglish) {
  if (!festivalEnglish) return null;
  const lower = festivalEnglish.toLowerCase();
  if (lower.includes('rama navami')) return drawRamaPattabhishekam;
  // Future: add more festivals
  return null;
}
