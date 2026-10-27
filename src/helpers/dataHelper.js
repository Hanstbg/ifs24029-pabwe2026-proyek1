import { ROLE_LABEL } from "../constants/roles";
import { SANKSOS_BERJALAN } from "../constants/sanksos";

/** Memastikan nilai yang dirender sebagai daftar selalu berupa array. */
export function toArray(value) {
  return Array.isArray(value) ? value : [];
}

/** Huruf pertama nama dalam huruf besar, "?" bila kosong. */
export function getInitial(name) {
  return name ? String(name).trim().charAt(0).toUpperCase() || "?" : "?";
}

export function getRoleLabel(role) {
  return ROLE_LABEL[role] ?? "Pengguna";
}

/** True bila demerit tersebut masih punya request Sanksos yang berjalan. */
export function hasOpenSanksos(sanksosList, demeritId) {
  return toArray(sanksosList).some(
    (item) => item.demerit_id === demeritId && SANKSOS_BERJALAN.includes(item.status)
  );
}
