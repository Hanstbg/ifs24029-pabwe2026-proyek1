export const STATUS_SANKSOS = {
  DIAJUKAN: "diajukan",
  DISETUJUI: "disetujui",
  DIKERJAKAN: "dikerjakan",
  SELESAI: "selesai",
  DITOLAK: "ditolak",
};

/** Request Sanksos yang masih berjalan (belum selesai / ditolak). */
export const SANKSOS_BERJALAN = [
  STATUS_SANKSOS.DIAJUKAN,
  STATUS_SANKSOS.DISETUJUI,
  STATUS_SANKSOS.DIKERJAKAN,
];

export const AKSI_SANKSOS = {
  SETUJUI: "setujui",
  TOLAK: "tolak",
  SELESAI: "selesai",
  DIKERJAKAN: "dikerjakan",
};
