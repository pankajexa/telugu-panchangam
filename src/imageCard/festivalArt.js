/**
 * Festival-specific artwork for wish cards.
 * Loads actual images for rich, beautiful results.
 */

/** Load an image from a URL and return the HTMLImageElement */
function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

// Image paths (served from public/)
const FESTIVAL_IMAGES = {
  'rama navami': '/srirama.jpg',
};

/**
 * Get festival image path by name.
 * Returns null if no custom image exists.
 */
export function getFestivalImagePath(festivalEnglish) {
  if (!festivalEnglish) return null;
  const lower = festivalEnglish.toLowerCase();
  for (const [key, path] of Object.entries(FESTIVAL_IMAGES)) {
    if (lower.includes(key)) return path;
  }
  return null;
}

/**
 * Draw festival artwork image onto canvas, centered and fitted.
 * The image is drawn with a white background removed (composited nicely).
 * Returns true if drawn, false if no image for this festival.
 */
export async function drawFestivalImage(ctx, cx, cy, maxW, maxH, festivalEnglish) {
  const path = getFestivalImagePath(festivalEnglish);
  if (!path) return false;

  try {
    const img = await loadImage(path);

    // Fit image within maxW × maxH while preserving aspect ratio
    const aspect = img.width / img.height;
    let drawW, drawH;
    if (aspect > maxW / maxH) {
      drawW = maxW;
      drawH = maxW / aspect;
    } else {
      drawH = maxH;
      drawW = maxH * aspect;
    }

    const x = cx - drawW / 2;
    const y = cy - drawH / 2;

    ctx.save();
    ctx.drawImage(img, x, y, drawW, drawH);
    ctx.restore();

    return true;
  } catch (_) {
    return false;
  }
}
