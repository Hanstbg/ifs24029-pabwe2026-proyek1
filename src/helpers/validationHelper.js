export const MIN_PASSWORD_LENGTH = 6;

const NIM_PATTERN = /^[A-Za-z0-9]+$/;

/**
 * Validasi form akun (registrasi / tambah mahasiswa).
 * @returns {string|null} pesan error pertama, atau null bila valid.
 */
export function validateAkun({ nama, nim, password, kamar }, { kamarWajib = true } = {}) {
  if (!nama?.trim()) return "Nama wajib diisi.";
  if (!nim?.trim()) return "NIM wajib diisi.";
  if (!NIM_PATTERN.test(nim.trim())) return "NIM hanya boleh berisi huruf dan angka.";
  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return `Kata sandi minimal ${MIN_PASSWORD_LENGTH} karakter.`;
  }
  if (kamarWajib && !kamar?.trim()) return "Nomor kamar wajib diisi.";
  return null;
}
