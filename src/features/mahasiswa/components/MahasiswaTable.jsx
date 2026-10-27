import { getInitial } from "../../../helpers/dataHelper";

const KOLOM = ["Mahasiswa", "NIM", "Asrama", "Kamar", "Peringatan", "Kuning", "Merah", "Poin Aktif"];

function Avatar({ foto, nama }) {
  if (foto) {
    return (
      <img src={foto} alt="" className="w-8 h-8 rounded-full object-cover border border-slate-200 shrink-0" />
    );
  }
  return (
    <span className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold shrink-0">
      {getInitial(nama)}
    </span>
  );
}

/** Tabel rekap mahasiswa; kamar bisa diedit langsung (disimpan saat kehilangan fokus). */
export default function MahasiswaTable({ items, isLoading, emptyMessage, onUpdateKamar }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-600 border-b border-slate-200">
            {KOLOM.map((kolom) => (
              <th key={kolom} className="py-2 pr-3 font-semibold">{kolom}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id} className="border-b border-slate-100 last:border-0 align-middle">
              <td className="py-2.5 pr-3 font-semibold text-slate-900">
                <div className="flex items-center gap-2.5">
                  <Avatar foto={item.foto} nama={item.nama} />
                  <span>{item.nama}</span>
                </div>
              </td>
              <td className="py-2.5 pr-3">{item.nim}</td>
              <td className="py-2.5 pr-3">
                <span className="inline-block rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700">
                  {item.asrama || "Belum ditentukan"}
                </span>
              </td>
              <td className="py-2.5 pr-3">
                <input
                  aria-label={`Kamar ${item.nama}`}
                  defaultValue={item.kamar ?? ""}
                  placeholder="-"
                  onBlur={(e) => {
                    if (e.target.value.trim() !== (item.kamar ?? "")) {
                      onUpdateKamar(item.id, e.target.value);
                    }
                  }}
                  className="input-base w-20 py-1 px-2 text-sm"
                />
              </td>
              <td className="py-2.5 pr-3">{item.peringatan_berjalan} / 3</td>
              <td className="py-2.5 pr-3">{item.kuning_aktif} / 2</td>
              <td className="py-2.5 pr-3">{item.merah_aktif}</td>
              <td className="py-2.5 font-semibold text-rose-600">{item.total_poin_demerit ?? 0} poin</td>
            </tr>
          ))}
          {!isLoading && items.length === 0 && (
            <tr>
              <td colSpan={KOLOM.length} className="py-6 text-center text-slate-600">{emptyMessage}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
