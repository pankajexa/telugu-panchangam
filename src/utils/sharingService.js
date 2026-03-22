/**
 * Sharing service — handles exporting canvas blobs to files
 * and triggering native share sheets.
 *
 * Uses Capacitor Share + Filesystem on native,
 * falls back to Web Share API / WhatsApp deep link on web.
 */

const isNative = typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.();

/** Convert Blob to base64 string */
function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Share a greeting image via native share sheet or web fallback.
 * @param {Blob} blob - Image blob
 * @param {string} fileName - File name (e.g. 'rama-navami-greeting.jpg')
 * @param {string} [shareText] - Text to accompany the image
 */
export async function shareImage(blob, fileName, shareText = '') {
  if (isNative) {
    try {
      const { Filesystem, Directory } = await import('@capacitor/filesystem');
      const { Share } = await import('@capacitor/share');

      const base64 = await blobToBase64(blob);

      await Filesystem.writeFile({
        path: fileName,
        data: base64,
        directory: Directory.Cache,
      });

      const fileUri = await Filesystem.getUri({
        path: fileName,
        directory: Directory.Cache,
      });

      await Share.share({
        title: shareText,
        text: shareText,
        url: fileUri.uri,
        dialogTitle: 'Share',
      });
      return;
    } catch (e) {
      if (e.message?.includes('canceled') || e.message?.includes('cancelled')) return;
      // Fall through to web
    }
  }

  // Web: try Web Share API with file
  const file = new File([blob], fileName, { type: blob.type || 'image/jpeg' });
  try {
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({ files: [file] });
      return;
    }
  } catch (e) {
    if (e.name === 'AbortError') return;
  }

  // Fallback: text-only share
  try {
    if (navigator.share && shareText) {
      await navigator.share({ text: shareText });
      return;
    }
  } catch (e) {
    if (e.name === 'AbortError') return;
  }

  // Last resort: WhatsApp deep link
  if (shareText) {
    window.location.href = `whatsapp://send?text=${encodeURIComponent(shareText)}`;
  }
}

/**
 * Save image to device gallery/documents.
 * @param {Blob} blob - Image blob
 * @param {string} fileName - File name
 * @returns {Promise<string>} File URI
 */
export async function saveToGallery(blob, fileName) {
  if (!isNative) {
    // Web fallback: download
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    return url;
  }

  const { Filesystem, Directory } = await import('@capacitor/filesystem');
  const base64 = await blobToBase64(blob);

  const result = await Filesystem.writeFile({
    path: `ManaCalendar/${fileName}`,
    data: base64,
    directory: Directory.Documents,
    recursive: true,
  });

  return result.uri;
}
