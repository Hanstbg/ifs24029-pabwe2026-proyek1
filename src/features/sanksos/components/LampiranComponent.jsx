import { showImageDialog } from "../../../helpers/toolsHelper";

/** Lampiran: gambar tampil sebagai thumbnail (klik untuk perbesar), file lain sebagai link unduh. */
export default function LampiranComponent({ src, label }) {
  if (!src) return null;
  const isImage = src.startsWith("data:image");
  return (
    <div className="mt-2">
      <p className="text-xs text-slate-500 mb-1">{label}:</p>
      {isImage ? (
        <button type="button" onClick={() => showImageDialog(src, label)} title="Klik untuk memperbesar">
          <img src={src} alt={label} className="w-24 h-24 rounded-lg object-cover border border-slate-300 hover:opacity-80" />
        </button>
      ) : (
        <a href={src} download="bukti-sanksos" className="text-sm font-semibold text-sky-700 underline">
          Unduh / lihat file
        </a>
      )}
    </div>
  );
}
