import { useDispatch, useSelector } from "react-redux";
import useInput from "../../../hooks/useInput";
import usePhotoUpload from "../../../hooks/usePhotoUpload";
import FormField from "../../../components/FormField";
import AsramaSelect from "../../../components/AsramaSelect";
import PhotoField from "../../../components/PhotoField";
import { ASRAMA_DEFAULT } from "../../../constants/asrama";
import { validateAkun } from "../../../helpers/validationHelper";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { asyncAddMahasiswa } from "../states/action";

export default function TambahMahasiswaForm() {
  const dispatch = useDispatch();
  const isAdding = useSelector((state) => state.mahasiswa.isMahasiswaAdd);

  const [nama, onNamaChange, , resetNama] = useInput("");
  const [nim, onNimChange, , resetNim] = useInput("");
  const [password, onPasswordChange, , resetPassword] = useInput("");
  const [asrama, onAsramaChange, , resetAsrama] = useInput(ASRAMA_DEFAULT);
  const [kamar, onKamarChange, , resetKamar] = useInput("");
  const { foto, onChange: onFotoChange, clear: clearFoto } = usePhotoUpload();

  async function handleSubmit(event) {
    event.preventDefault();
    const error = validateAkun({ nama, nim, password }, { kamarWajib: false });
    if (error) {
      showErrorDialog(error);
      return;
    }
    const success = await dispatch(
      asyncAddMahasiswa({ nama: nama.trim(), nim: nim.trim(), password, asrama, kamar: kamar.trim(), foto })
    );
    if (success) {
      [resetNama, resetNim, resetPassword, resetAsrama, resetKamar, clearFoto].forEach((reset) => reset());
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card p-4 sm:p-5 space-y-4" data-testid="mahasiswa-form">
      <h2 className="text-lg font-extrabold text-slate-900">Tambah Mahasiswa</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-5 gap-4">
        <FormField id="mahasiswa-nama-input" label="Nama">
          <input id="mahasiswa-nama-input" required value={nama} onChange={onNamaChange} className="input-base" />
        </FormField>
        <FormField id="mahasiswa-nim-input" label="NIM">
          <input id="mahasiswa-nim-input" required value={nim} onChange={onNimChange} className="input-base" />
        </FormField>
        <FormField id="mahasiswa-password-input" label="Password awal">
          <input id="mahasiswa-password-input" required value={password} onChange={onPasswordChange}
            className="input-base" />
        </FormField>
        <FormField id="mahasiswa-asrama-select" label="Asrama">
          <AsramaSelect id="mahasiswa-asrama-select" value={asrama} onChange={onAsramaChange} />
        </FormField>
        <FormField id="mahasiswa-kamar-input" label="Kamar">
          <input id="mahasiswa-kamar-input" value={kamar} onChange={onKamarChange} className="input-base"
            placeholder="mis. 101" />
        </FormField>
      </div>

      <PhotoField
        id="mahasiswa-foto-input"
        label="Foto Mahasiswa (Opsional)"
        foto={foto}
        onChange={onFotoChange}
        onClear={clearFoto}
        previewAlt="Pratinjau foto"
        inputClassName="max-w-md"
      />

      <button type="submit" disabled={isAdding} className="btn-primary">
        {isAdding ? "Menyimpan..." : "Simpan"}
      </button>
    </form>
  );
}
