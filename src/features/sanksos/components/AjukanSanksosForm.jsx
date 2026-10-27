import { IconCheck, IconAlertCircle } from "@tabler/icons-react";

function InfoBox({ tone, icon: Icon, children }) {
  const warna = tone === "warn"
    ? "text-amber-800 bg-amber-50 border-amber-200"
    : "text-emerald-800 bg-emerald-50 border-emerald-200";
  return (
    <div className={`flex items-center gap-2 text-sm p-3 rounded-xl border ${warna}`}>
      <Icon size={20} className="shrink-0" />
      <span>{children}</span>
    </div>
  );
}

/** Form mahasiswa untuk mengajukan Sanksos atas satu demerit aktif. */
export default function AjukanSanksosForm({
  demeritBisaDiajukan,
  adaDemeritAktif,
  selectedId,
  onSelectedChange,
  catatan,
  onCatatanChange,
  isSubmitting,
  onSubmit,
}) {
  return (
    <section className="card p-4 sm:p-5 space-y-4" aria-labelledby="ajukan-heading">
      <h2 id="ajukan-heading" className="text-lg font-extrabold text-slate-900">
        Ajukan Permohonan Sanksos
      </h2>

      {demeritBisaDiajukan.length > 0 ? (
        <form onSubmit={onSubmit} className="space-y-4" data-testid="form-ajukan-sanksos">
          <div>
            <label htmlFor="sanksos-demerit-select" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Pilih Demerit yang Ingin Diselesaikan
            </label>
            <select id="sanksos-demerit-select" required value={selectedId}
              onChange={(e) => onSelectedChange(e.target.value)} className="input-base">
              {demeritBisaDiajukan.map((d) => (
                <option key={d.id} value={d.id}>
                  [{d.jenis.toUpperCase()}] {d.alasan} (Sisa poin: {d.poin_sekarang ?? -20})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="sanksos-catatan-input" className="block text-sm font-semibold text-slate-700 mb-1.5">
              Rencana / Catatan Tugas (Opsional)
            </label>
            <textarea id="sanksos-catatan-input" rows={2} value={catatan}
              onChange={(e) => onCatatanChange(e.target.value)} className="input-base"
              placeholder="mis. Saya bersedia membersihkan lorong asrama atau ruang komunal..." />
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? "Mengajukan..." : "Kirim Request Sanksos"}
          </button>
        </form>
      ) : adaDemeritAktif ? (
        <InfoBox tone="warn" icon={IconAlertCircle}>
          Kamu memiliki request Sanksos yang sedang diproses. Mohon selesaikan tugas yang telah disetujui.
        </InfoBox>
      ) : (
        <InfoBox tone="ok" icon={IconCheck}>
          Kamu tidak memiliki kartu demerit aktif saat ini. Pertahankan perilaku baikmu!
        </InfoBox>
      )}
    </section>
  );
}
