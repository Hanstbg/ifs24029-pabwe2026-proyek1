import { useState, useCallback } from "react";
import { readFileAsDataUrl, resizeImage, validateFile } from "../helpers/fileHelper";
import { showErrorDialog } from "../helpers/toolsHelper";
import { MAKS_UKURAN_FOTO_MB, MAKS_SISI_FOTO_PX } from "../constants/upload";

/**
 * State + handler untuk unggah foto profil.
 * @param {string} [initial] foto awal (data URL)
 * @param {{resize?: boolean}} [options] resize=true memperkecil gambar sebelum disimpan
 */
export default function usePhotoUpload(initial = "", { resize = false } = {}) {
  const [foto, setFoto] = useState(initial);

  const onChange = useCallback(
    async (event) => {
      const file = event.target.files?.[0];
      if (!file) return;
      const error = validateFile(file, { maxMb: MAKS_UKURAN_FOTO_MB, imageOnly: true });
      if (error) {
        showErrorDialog(error);
        event.target.value = "";
        return;
      }
      try {
        setFoto(resize ? await resizeImage(file, MAKS_SISI_FOTO_PX) : await readFileAsDataUrl(file));
      } catch {
        showErrorDialog("Gagal membaca gambar. Coba file lain.");
      }
    },
    [resize]
  );

  const clear = useCallback(() => setFoto(""), []);

  return { foto, onChange, clear };
}
