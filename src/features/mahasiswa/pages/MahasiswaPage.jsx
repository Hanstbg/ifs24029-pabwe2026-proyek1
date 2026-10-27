import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toArray } from "../../../helpers/dataHelper";
import { DAFTAR_ASRAMA } from "../../../constants/asrama";
import MahasiswaTable from "../components/MahasiswaTable";
import TambahMahasiswaForm from "../components/TambahMahasiswaForm";
import { asyncFetchMahasiswa, asyncUpdateKamar } from "../states/action";

export default function MahasiswaPage() {
  const dispatch = useDispatch();
  const mahasiswa = toArray(useSelector((state) => state.mahasiswa.mahasiswa));
  const isLoading = useSelector((state) => state.mahasiswa.isMahasiswa);
  const [filterAsrama, setFilterAsrama] = useState("");

  useEffect(() => {
    dispatch(asyncFetchMahasiswa());
  }, [dispatch]);

  const filtered = mahasiswa.filter((item) => (filterAsrama ? item.asrama === filterAsrama : true));
  const emptyMessage = filterAsrama ? `Belum ada mahasiswa di ${filterAsrama}` : "Belum ada mahasiswa";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Mahasiswa</h1>
        <div className="flex items-center gap-2">
          <label htmlFor="filter-asrama-select" className="text-sm font-semibold text-slate-700">
            Filter Asrama:
          </label>
          <select
            id="filter-asrama-select"
            value={filterAsrama}
            onChange={(e) => setFilterAsrama(e.target.value)}
            className="input-base py-1.5 px-3 text-sm"
          >
            <option value="">Semua Asrama ({mahasiswa.length})</option>
            {DAFTAR_ASRAMA.map((dorm) => (
              <option key={dorm} value={dorm}>
                {dorm} ({mahasiswa.filter((m) => m.asrama === dorm).length})
              </option>
            ))}
          </select>
        </div>
      </div>

      <section className="card p-4 sm:p-5" aria-labelledby="rekap-heading">
        <h2 id="rekap-heading" className="text-lg font-extrabold text-slate-900 mb-3">
          Rekap Mahasiswa
        </h2>
        {isLoading && (
          <p className="text-sm text-slate-600" role="status">
            Memuat data mahasiswa...
          </p>
        )}
        <MahasiswaTable
          items={filtered}
          isLoading={isLoading}
          emptyMessage={emptyMessage}
          onUpdateKamar={(id, kamar) => dispatch(asyncUpdateKamar(id, kamar))}
        />
      </section>

      <TambahMahasiswaForm />
    </div>
  );
}
