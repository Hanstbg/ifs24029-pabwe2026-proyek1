const BYTES_PER_MB = 1024 * 1024;

/** Membaca File menjadi data URL (base64). */
export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error("Gagal membaca file."));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

/**
 * Memeriksa file sebelum diunggah.
 * @returns {string|null} pesan error, atau null bila valid.
 */
export function validateFile(file, { maxMb, imageOnly = false } = {}) {
  if (imageOnly && !file.type.startsWith("image/")) return "File harus berupa gambar.";
  if (maxMb && file.size > maxMb * BYTES_PER_MB) return `Ukuran file maksimal ${maxMb} MB.`;
  return null;
}

/** Memperkecil gambar (sisi terpanjang maks `maxSide` px) dan mengubahnya ke JPEG data URL. */
export async function resizeImage(file, maxSide) {
  const src = await readFileAsDataUrl(file);
  const img = await new Promise((resolve, reject) => {
    const image = new Image();
    image.onerror = () => reject(new Error("Gagal membaca gambar."));
    image.onload = () => resolve(image);
    image.src = src;
  });
  const skala = Math.min(1, maxSide / Math.max(img.width, img.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.width * skala);
  canvas.height = Math.round(img.height * skala);
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL("image/jpeg", 0.85);
}
