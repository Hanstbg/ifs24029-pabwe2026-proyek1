import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getInitial, getRoleLabel } from "../../../helpers/dataHelper";
import usePhotoUpload from "../../../hooks/usePhotoUpload";
import FormField from "../../../components/FormField";
import AsramaSelect from "../../../components/AsramaSelect";
import { ASRAMA_DEFAULT } from "../../../constants/asrama";
import { ROLE } from "../../../constants/roles";
import { asyncUpdateProfil } from "../../auth/states/action";

const MAKS_BIO = 300;

export default function ProfilPage() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const isMahasiswa = user?.role === ROLE.MAHASISWA;

  const [nama, setNama] = useState(user?.nama ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [asrama, setAsrama] = useState(user?.asrama ?? ASRAMA_DEFAULT);
  const [kamar, setKamar] = useState(user?.kamar ?? "");
  const { foto, onChange: onFotoChange, clear: clearFoto } = usePhotoUpload(user?.foto ?? "", { resize: true });
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSaving(true);
    const payload = { nama: nama.trim(), bio, foto: foto || null };
    if (isMahasiswa) {
      payload.asrama = asrama;
      payload.kamar = kamar.trim();
    }
    await dispatch(asyncUpdateProfil(payload));
    setIsSaving(false);
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Profil Saya</h1>

      <form onSubmit={handleSubmit} className="card p-4 sm:p-5 space-y-5" data-testid="profil-form">
        <div className="flex items-center gap-4">
          {foto ? (
            <img src={foto} alt="Foto profil" className="w-24 h-24 rounded-full object-cover border border-slate-300" />
          ) : (
            <span className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-800 to-slate-600 text-white flex items-center justify-center text-3xl font-bold">
              {getInitial(nama)}
            </span>
          )}
          <div className="space-y-2">
            <label htmlFor="profil-foto-input" className="block text-sm font-semibold text-slate-700">
              Ganti foto profil
            </label>
            <input id="profil-foto-input" type="file" accept="image/*" onChange={onFotoChange}
              className="input-base max-w-xs" />
            {foto && (
              <button type="button" onClick={clearFoto} className="text-xs text-rose-600 hover:underline">
                Hapus foto
              </button>
            )}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <FormField id="profil-nama-input" label="Nama">
            <input id="profil-nama-input" required value={nama} onChange={(e) => setNama(e.target.value)}
              className="input-base" />
          </FormField>
          <div>
            <span className="block text-sm font-semibold text-slate-700 mb-1.5">NIM / Peran</span>
            <p className="input-base bg-slate-50 text-slate-600">
              {user?.nim} · {getRoleLabel(user?.role)}
            </p>
          </div>
        </div>

        {isMahasiswa && (
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField id="profil-asrama-select" label="Asrama">
              <AsramaSelect id="profil-asrama-select" value={asrama} onChange={(e) => setAsrama(e.target.value)} />
            </FormField>
            <FormField id="profil-kamar-input" label="Nomor Kamar">
              <input id="profil-kamar-input" required value={kamar} onChange={(e) => setKamar(e.target.value)}
                className="input-base" placeholder="mis. 101" />
            </FormField>
          </div>
        )}

        <FormField id="profil-bio-input" label="Bio">
          <textarea id="profil-bio-input" rows={3} maxLength={MAKS_BIO} value={bio}
            onChange={(e) => setBio(e.target.value)} className="input-base"
            placeholder="Ceritakan sedikit tentang dirimu..." />
          <p className="text-xs text-slate-500 mt-1">{bio.length} / {MAKS_BIO}</p>
        </FormField>

        <button type="submit" disabled={isSaving} className="btn-primary">
          {isSaving ? "Menyimpan..." : "Simpan Profil"}
        </button>
      </form>
    </div>
  );
}
