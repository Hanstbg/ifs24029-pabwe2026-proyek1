import { useState } from "react";
import BadgeComponent from "../../karma/components/BadgeComponent";
import { readFileAsDataUrl, validateFile } from "../../../helpers/fileHelper";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { MAKS_UKURAN_BUKTI_MB } from "../../../constants/upload";
import { AKSI_SANKSOS, STATUS_SANKSOS } from "../../../constants/sanksos";
import LampiranComponent from "./LampiranComponent";

/** Aksi pembina: setujui/tolak (diajukan) dan verifikasi selesai (dikerjakan). */
function PembinaActions({ item, isSubmitting, onAksi }) {
  const [tugas, setTugas] = useState("");
  const [poin, setPoin] = useState("");

  if (item.status === STATUS_SANKSOS.DIAJUKAN) {
    return (
      <>
        <input
          aria-label={`Tugas sanksos untuk ${item.nama}`}
          placeholder="Tugas sanksos (mis. bersihkan selasar)"
          value={tugas}
          onChange={(e) => setTugas(e.target.value)}
          className="input-base"
        />
        <button type="button" disabled={isSubmitting} className="btn-primary"
          onClick={() => onAksi(item.id, AKSI_SANKSOS.SETUJUI, tugas || undefined)}>
          Setujui
        </button>
        <button type="button" disabled={isSubmitting} className="btn-ghost"
          onClick={() => onAksi(item.id, AKSI_SANKSOS.TOLAK, tugas)}>
          Tolak
        </button>
      </>
    );
  }

  if (item.status === STATUS_SANKSOS.DIKERJAKAN) {
    return (
      <div className="flex items-center gap-2">
        <input
          aria-label={`Poin sanksos untuk ${item.nama}`}
          type="number"
          placeholder="+ Poin (mis. 10)"
          value={poin}
          onChange={(e) => setPoin(e.target.value)}
          className="input-base w-32"
        />
        <button type="button" disabled={isSubmitting} className="btn-primary"
          onClick={() => onAksi(item.id, AKSI_SANKSOS.SELESAI, poin || undefined)}>
          Verifikasi selesai
        </button>
      </div>
    );
  }

  return null;
}

/** Aksi mahasiswa: unggah bukti lalu tandai tugas sudah dikerjakan. */
function MahasiswaActions({ item, isSubmitting, onAksi }) {
  const [bukti, setBukti] = useState(null); // { data, nama }
  const perluBukti =
    item.status === STATUS_SANKSOS.DISETUJUI ||
    (item.status === STATUS_SANKSOS.DIKERJAKAN && !item.bukti_selesai);
  if (!perluBukti) return null;

  async function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    const error = validateFile(file, { maxMb: MAKS_UKURAN_BUKTI_MB });
    if (error) {
      showErrorDialog(error);
      event.target.value = "";
      return;
    }
    setBukti({ data: await readFileAsDataUrl(file), nama: file.name });
  }

  function handleKirim() {
    if (!bukti?.data) {
      return showErrorDialog("Upload foto / file bukti pengerjaan dulu sebelum menandai selesai dikerjakan.");
    }
    return onAksi(item.id, AKSI_SANKSOS.DIKERJAKAN, bukti.data);
  }

  const isImage = bukti?.data?.startsWith("data:image");
  return (
    <div className="w-full space-y-2">
      <label className="block text-xs font-semibold text-slate-700">
        Upload foto / file bukti pengerjaan (wajib)
        <input type="file" accept="image/*,application/pdf" onChange={handleFileChange} className="input-base mt-1" />
      </label>
      {isImage && (
        <img src={bukti.data} alt="Pratinjau bukti pengerjaan"
          className="w-20 h-20 rounded-lg object-cover border border-slate-300" />
      )}
      {bukti && !isImage && <p className="text-xs text-slate-600">File: {bukti.nama}</p>}
      <button type="button" disabled={isSubmitting} onClick={handleKirim} className="btn-primary">
        {item.status === STATUS_SANKSOS.DISETUJUI ? "Tandai sudah dikerjakan" : "Kirim bukti pengerjaan"}
      </button>
    </div>
  );
}

export default function SanksosItem({ item, isPembina, isSubmitting, onAksi }) {
  const Actions = isPembina ? PembinaActions : MahasiswaActions;
  return (
    <li className="py-4 flex flex-wrap items-start justify-between gap-3">
      <div className="min-w-0 space-y-1">
        <div className="flex flex-wrap items-center gap-2">
          {isPembina && <b className="text-slate-900">{item.nama}</b>}
          <BadgeComponent value={item.jenis_demerit} />
          <BadgeComponent value={item.status} />
          {item.poin_sekarang !== undefined && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
              Sisa: {item.poin_sekarang} poin
            </span>
          )}
        </div>
        <p className="text-sm text-slate-600">{item.alasan}</p>
        {item.catatan && (
          <p className="text-sm text-slate-700">
            {isPembina ? "Catatan mahasiswa" : "Catatanmu"}: {item.catatan}
          </p>
        )}
        {item.tugas && (
          <p className="text-sm text-slate-700">
            Tugas: <b>{item.tugas}</b>
          </p>
        )}
        <LampiranComponent src={item.bukti_foto} label="Lampiran awal" />
        <LampiranComponent src={item.bukti_selesai} label="Bukti pengerjaan" />
      </div>

      <div className="flex flex-wrap items-center gap-2 sm:min-w-64">
        <Actions item={item} isSubmitting={isSubmitting} onAksi={onAksi} />
      </div>
    </li>
  );
}
