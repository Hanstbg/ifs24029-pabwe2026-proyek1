/** Pembungkus label + kontrol form agar gaya label konsisten di semua halaman. */
export default function FormField({ id, label, children, className = "" }) {
  return (
    <div className={className}>
      <label htmlFor={id} className="block text-sm font-semibold text-slate-700 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
