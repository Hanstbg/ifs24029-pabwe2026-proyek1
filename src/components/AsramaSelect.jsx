import { DAFTAR_ASRAMA } from "../constants/asrama";

/** Dropdown 7 asrama resmi. */
export default function AsramaSelect({ id, value, onChange, required = false }) {
  return (
    <select id={id} required={required} value={value} onChange={onChange} className="input-base">
      {DAFTAR_ASRAMA.map((dorm) => (
        <option key={dorm} value={dorm}>
          {dorm}
        </option>
      ))}
    </select>
  );
}
