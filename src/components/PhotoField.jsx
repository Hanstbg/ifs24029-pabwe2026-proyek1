import FormField from "./FormField";

/** Input foto dengan pratinjau dan tombol hapus. */
export default function PhotoField({
  id,
  label,
  foto,
  onChange,
  onClear,
  previewAlt = "Pratinjau foto",
  previewClassName = "w-12 h-12",
  inputClassName = "",
}) {
  return (
    <FormField id={id} label={label}>
      <input
        id={id}
        type="file"
        accept="image/*"
        onChange={onChange}
        className={`input-base ${inputClassName}`}
      />
      {foto && (
        <div className="mt-2 flex items-center gap-3">
          <img
            src={foto}
            alt={previewAlt}
            className={`${previewClassName} rounded-full object-cover border border-slate-300`}
          />
          <button type="button" onClick={onClear} className="text-xs text-rose-600 hover:underline">
            Hapus foto
          </button>
        </div>
      )}
    </FormField>
  );
}
