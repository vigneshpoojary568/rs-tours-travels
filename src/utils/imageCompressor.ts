/**
 * Client-side image compression and responsive resizing.
 * Automatically compresses large client photos before saving to avoid memory bloat.
 */
export async function compressImage(
  fileOrDataUrl: File | string,
  maxWidth = 1600,
  maxHeight = 1200,
  quality = 0.82
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();

    const processImage = () => {
      let width = img.width;
      let height = img.height;

      // Calculate aspect ratio preserving resize
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas context unavailable'));
        return;
      }

      // Smooth resizing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      // Export as webp if supported, or jpeg
      try {
        const dataUrl = canvas.toDataURL('image/webp', quality);
        if (dataUrl.startsWith('data:image/webp')) {
          resolve(dataUrl);
          return;
        }
      } catch {
        // fallback to jpeg
      }

      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    img.onload = processImage;
    img.onerror = (err) => reject(err);

    if (typeof fileOrDataUrl === 'string') {
      img.src = fileOrDataUrl;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          img.src = e.target.result as string;
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(fileOrDataUrl);
    }
  });
}
