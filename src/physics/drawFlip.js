/**
 * Deterministic page-flip renderer.
 *
 * Everything is a pure function of `progress` (0 → 1) and `direction`.
 *
 * Forward (swipe up → next day):
 *   Fold line sweeps bottom → top. Current page peels away upward.
 *
 * Backward (swipe down → previous day):
 *   Fold line sweeps top → bottom. Previous page descends from above.
 */

const FRONT = [240, 195, 50];
const BACK  = [210, 165, 35];
const SHADOW_COLOR = '50, 20, 5';
const HIGHLIGHT_COLOR = '250, 232, 130';

/**
 * Compute clip-path for the current page DOM element.
 *
 * Forward:  clip grows from bottom → shows top portion only
 * Backward: clip grows from top → shows bottom portion only
 */
export function computeClipPath(progress, pageHeight, direction) {
  if (progress < 0.005) return 'none';

  const bowPct = Math.min(1.5, progress * 3) * (1 - Math.abs(progress - 0.5));

  if (direction === 'backward') {
    // Fold descends from top: show only below the fold
    const sepPct = progress * 100; // 0% → 100% from top
    return `polygon(
      0% ${Math.min(100, sepPct + bowPct * 0.5).toFixed(2)}%,
      25% ${Math.min(100, sepPct + bowPct * 0.2).toFixed(2)}%,
      50% ${Math.min(100, sepPct).toFixed(2)}%,
      75% ${Math.min(100, sepPct + bowPct * 0.2).toFixed(2)}%,
      100% ${Math.min(100, sepPct + bowPct * 0.5).toFixed(2)}%,
      100% 100%,
      0% 100%
    )`;
  }

  // Forward: fold sweeps from bottom to top: show only above the fold
  const sepPct = (1 - progress) * 100;
  return `polygon(
    0% 0%,
    100% 0%,
    100% ${Math.max(0, sepPct - bowPct * 0.5).toFixed(2)}%,
    75% ${Math.max(0, sepPct - bowPct * 0.2).toFixed(2)}%,
    50% ${Math.max(0, sepPct).toFixed(2)}%,
    25% ${Math.max(0, sepPct - bowPct * 0.2).toFixed(2)}%,
    0% ${Math.max(0, sepPct - bowPct * 0.5).toFixed(2)}%
  )`;
}

/**
 * Draw the curl, shadow, and highlight onto the canvas.
 */
export function drawFlip(ctx, progress, pageWidth, pageHeight, direction) {
  ctx.clearRect(0, 0, pageWidth, pageHeight + 100);
  if (progress < 0.005) return;

  const isBackward = direction === 'backward';

  // Fold line Y position
  const sepY = isBackward
    ? pageHeight * progress        // descends from top
    : pageHeight * (1 - progress); // ascends from bottom

  const curlIntensity = Math.sin(Math.PI * progress);
  const curlHeight = 8 + curlIntensity * 40;
  const liftZ = curlIntensity * 80;

  // =================================================================
  // 1. SHADOW on the revealed page
  // =================================================================
  const shadowAlpha = Math.min(0.3, liftZ / 150);
  const shadowDepth = Math.min(50, liftZ * 0.55);

  if (shadowDepth > 1) {
    for (let layer = 0; layer < 5; layer++) {
      const t = layer / 5;
      const h = shadowDepth * (1 - t) * 0.5;
      const a = shadowAlpha * (1 - t * t);
      const inset = 3 + layer * 3;

      ctx.fillStyle = `rgba(${SHADOW_COLOR}, ${a.toFixed(3)})`;
      ctx.beginPath();
      if (isBackward) {
        // Shadow falls ABOVE the fold (onto the revealed previous page)
        const y = sepY - t * shadowDepth - h;
        ctx.rect(inset, y, pageWidth - inset * 2, h);
      } else {
        // Shadow falls BELOW the fold (onto the revealed next page)
        const y = sepY + t * shadowDepth;
        ctx.rect(inset, y, pageWidth - inset * 2, h);
      }
      ctx.fill();
    }
  }

  // =================================================================
  // 2. CURL STRIP
  // =================================================================
  const numStrips = 12;
  const stripH = curlHeight / numStrips;

  for (let s = 0; s < numStrips; s++) {
    const t = s / numStrips; // 0 = outer edge of curl, 1 = fold line
    let y;

    if (isBackward) {
      // Curl sits BELOW the fold, extending downward
      y = sepY + s * stripH;
    } else {
      // Curl sits ABOVE the fold, extending upward
      y = (sepY - curlHeight) + s * stripH;
    }

    if (y < -5 || y > pageHeight + 10) continue;

    let shade;
    if (t < 0.3) {
      const bt = t / 0.3;
      shade = lerpColor(BACK, [BACK[0] + 15, BACK[1] + 15, BACK[2] + 10], bt);
    } else if (t < 0.5) {
      const et = (t - 0.3) / 0.2;
      shade = lerpColor([BACK[0] + 15, BACK[1] + 15, BACK[2] + 10], FRONT, et);
    } else if (t < 0.85) {
      const ft = (t - 0.5) / 0.35;
      shade = lerpColor(FRONT, [FRONT[0] - 20, FRONT[1] - 20, FRONT[2] - 10], ft);
    } else {
      const dt = (t - 0.85) / 0.15;
      shade = lerpColor([FRONT[0] - 20, FRONT[1] - 20, FRONT[2] - 10],
                        [FRONT[0] - 45, FRONT[1] - 45, FRONT[2] - 20], dt);
    }

    const bow = curlIntensity * 3;
    const bowOffset = bow * Math.sin(Math.PI * t);

    ctx.fillStyle = `rgb(${clamp(shade[0])}, ${clamp(shade[1])}, ${clamp(shade[2])})`;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.quadraticCurveTo(pageWidth * 0.5, y + bowOffset, pageWidth, y);
    ctx.lineTo(pageWidth, y + stripH);
    ctx.quadraticCurveTo(pageWidth * 0.5, y + stripH + bowOffset, 0, y + stripH);
    ctx.closePath();
    ctx.fill();
  }

  // =================================================================
  // 3. HIGHLIGHT
  // =================================================================
  if (curlIntensity > 0.1) {
    const hlY = isBackward
      ? sepY + curlHeight * 0.35
      : (sepY - curlHeight) + curlHeight * 0.35;
    const hlAlpha = Math.min(0.5, curlIntensity * 0.6);

    const grad = ctx.createLinearGradient(pageWidth * 0.1, 0, pageWidth * 0.9, 0);
    grad.addColorStop(0, `rgba(${HIGHLIGHT_COLOR}, 0)`);
    grad.addColorStop(0.25, `rgba(${HIGHLIGHT_COLOR}, ${hlAlpha})`);
    grad.addColorStop(0.5, `rgba(${HIGHLIGHT_COLOR}, ${hlAlpha * 1.2})`);
    grad.addColorStop(0.75, `rgba(${HIGHLIGHT_COLOR}, ${hlAlpha})`);
    grad.addColorStop(1, `rgba(${HIGHLIGHT_COLOR}, 0)`);

    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const hlBow = curlIntensity * 2;
    ctx.moveTo(pageWidth * 0.05, hlY);
    ctx.quadraticCurveTo(pageWidth * 0.5, hlY + hlBow, pageWidth * 0.95, hlY);
    ctx.stroke();
  }

  // =================================================================
  // 4. FOLD CREASE
  // =================================================================
  if (progress > 0.02) {
    const creaseAlpha = Math.min(0.2, curlIntensity * 0.25);
    ctx.strokeStyle = `rgba(60, 25, 5, ${creaseAlpha})`;
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    const cBow = curlIntensity * 2;
    ctx.moveTo(pageWidth * 0.02, sepY);
    ctx.quadraticCurveTo(pageWidth * 0.5, sepY + cBow, pageWidth * 0.98, sepY);
    ctx.stroke();
  }
}

// --- Helpers ---

function clamp(v) {
  return Math.max(0, Math.min(255, Math.round(v)));
}

function lerpColor(a, b, t) {
  return [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ];
}
