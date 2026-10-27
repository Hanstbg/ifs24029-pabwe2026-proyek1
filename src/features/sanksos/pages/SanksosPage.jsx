import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconInbox } from "@tabler/icons-react";
import { toArray, hasOpenSanksos } from "../../../helpers/dataHelper";
import { ROLE } from "../../../constants/roles";
import { AKSI_SANKSOS } from "../../../constants/sanksos";
import AjukanSanksosForm from "../components/AjukanSanksosForm";
import SanksosItem from "../components/SanksosItem";
import { asyncFetchSanksos, asyncAksiSanksos, asyncAjukanSanksos } from "../states/action";
import { asyncFetchDemerit } from "../../demerit/states/action";

export default function SanksosPage() {
  const dispatch = useDispatch();
  const role = useSelector((state) => state.auth.user?.role);
  const sanksos = toArray(useSelector((state) => state.sanksos.sanksos));
  const demerit = toArray(useSelector((state) => state.demerit.demerit));
  const isLoading = useSelector((state) => state.sanksos.isSanksos);
  const isSubmitting = useSelector((state) => state.sanksos.isSanksosSubmit);

  const [selectedDemeritId, setSelectedDemeritId] = useState("");
  const [catatan, setCatatan] = useState("");

  const isPembina = role === ROLE.PEMBINA;
  const demeritAktif = demerit.filter((d) => d.status === "aktif");
  const demeritBisaDiajukan = demeritAktif.filter((d) => !hasOpenSanksos(sanksos, d.id));

  useEffect(() => {
    dispatch(asyncFetchSanksos());
    if (!isPembina) dispatch(asyncFetchDemerit());
  }, [dispatch, isPembina]);

  useEffect(() => {
    if (demeritBisaDiajukan.length > 0 && !selectedDemeritId) {
      setSelectedDemeritId(String(demeritBisaDiajukan[0].id));
    }
  }, [demeritBisaDiajukan, selectedDemeritId]);

  async function handleAjukan(event) {
    event.preventDefault();
    if (!selectedDemeritId) return;
    const success = await dispatch(asyncAjukanSanksos(Number(selectedDemeritId), catatan));
    if (success) {
      setCatatan("");
      setSelectedDemeritId("");
    }
  }

  function handleAksi(id, aksi, extra) {
    // Tolak tidak membawa data tambahan.
    return dispatch(asyncAksiSanksos(id, aksi, aksi === AKSI_SANKSOS.TOLAK ? undefined : extra));
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
        {isPembina ? "Request Sanksos" : "Sanksos Saya"}
      </h1>

      {!isPembina && (
        <AjukanSanksosForm
          demeritBisaDiajukan={demeritBisaDiajukan}
          adaDemeritAktif={demeritAktif.length > 0}
          selectedId={selectedDemeritId}
          onSelectedChange={setSelectedDemeritId}
          catatan={catatan}
          onCatatanChange={setCatatan}
          isSubmitting={isSubmitting}
          onSubmit={handleAjukan}
        />
      )}

      <div className="card p-4 sm:p-5">
        <h2 className="text-lg font-extrabold text-slate-900 mb-3">
          {isPembina ? "Daftar Permohonan" : "Riwayat Sanksos"}
        </h2>

        {isLoading && (
          <p className="text-sm text-slate-600" role="status">
            Memuat data Sanksos...
          </p>
        )}

        {!isLoading && sanksos.length === 0 && (
          <div className="flex flex-col items-center text-center py-10 text-slate-600">
            <IconInbox size={40} stroke={1.3} />
            <p className="text-sm mt-2">Belum ada request Sanksos.</p>
          </div>
        )}

        <ul className="divide-y divide-slate-100">
          {sanksos.map((item) => (
            <SanksosItem key={item.id} item={item} isPembina={isPembina}
              isSubmitting={isSubmitting} onAksi={handleAksi} />
          ))}
        </ul>
      </div>
    </div>
  );
}
