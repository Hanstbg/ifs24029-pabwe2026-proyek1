import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import useInput from "../../../hooks/useInput";
import usePhotoUpload from "../../../hooks/usePhotoUpload";
import FormField from "../../../components/FormField";
import AsramaSelect from "../../../components/AsramaSelect";
import PhotoField from "../../../components/PhotoField";
import { ASRAMA_DEFAULT } from "../../../constants/asrama";
import { MIN_PASSWORD_LENGTH, validateAkun } from "../../../helpers/validationHelper";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import { asyncRegisterUser } from "../states/action";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLoading = useSelector((state) => state.auth.isLogin);

  const [nama, onNamaChange] = useInput("");
  const [nim, onNimChange] = useInput("");
  const [password, onPasswordChange] = useInput("");
  const [asrama, onAsramaChange] = useInput(ASRAMA_DEFAULT);
  const [kamar, onKamarChange] = useInput("");
  const { foto, onChange: onFotoChange, clear: clearFoto } = usePhotoUpload();

  async function handleSubmit(event) {
    event.preventDefault();
    const error = validateAkun({ nama, nim, password, kamar });
    if (error) {
      showErrorDialog(error);
      return;
    }
    const success = await dispatch(
      asyncRegisterUser({ nama: nama.trim(), nim: nim.trim(), password, asrama, kamar: kamar.trim(), foto })
    );
    if (success) navigate("/", { replace: true });
  }

  return (
    <div>
      <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Daftar Mahasiswa</h1>
      <p className="text-sm text-slate-600 mb-5">
        Buat akun baru untuk memantau demerit dan mengajukan sanksos.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4" data-testid="register-form">
        <FormField id="register-nama-input" label="Nama Lengkap">
          <input id="register-nama-input" type="text" required value={nama} onChange={onNamaChange}
            className="input-base" placeholder="mis. Budi Santoso" />
        </FormField>

        <FormField id="register-nim-input" label="NIM">
          <input id="register-nim-input" type="text" required value={nim} onChange={onNimChange}
            className="input-base" placeholder="mis. 123456" />
        </FormField>

        <FormField id="register-password-input" label="Kata Sandi">
          <input id="register-password-input" type="password" required minLength={MIN_PASSWORD_LENGTH}
            value={password} onChange={onPasswordChange} className="input-base"
            placeholder={`Minimal ${MIN_PASSWORD_LENGTH} karakter`} />
        </FormField>

        <FormField id="register-asrama-select" label="Nama Asrama">
          <AsramaSelect id="register-asrama-select" required value={asrama} onChange={onAsramaChange} />
        </FormField>

        <FormField id="register-kamar-input" label="Nomor Kamar">
          <input id="register-kamar-input" type="text" required value={kamar} onChange={onKamarChange}
            className="input-base" placeholder="mis. 101" />
        </FormField>

        <PhotoField
          id="register-foto-input"
          label="Foto Profil (Opsional)"
          foto={foto}
          onChange={onFotoChange}
          onClear={clearFoto}
          previewAlt="Pratinjau foto profil"
          previewClassName="w-14 h-14"
        />

        <button id="register-submit-button" type="submit" disabled={isLoading} className="btn-primary w-full py-3">
          {isLoading ? "Mendaftarkan..." : "Daftar Sekarang"}
        </button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-600">
        Sudah memiliki akun?{" "}
        <Link to="/auth/login" className="font-semibold text-slate-900 underline hover:text-slate-700">
          Masuk di sini
        </Link>
      </p>
    </div>
  );
}
