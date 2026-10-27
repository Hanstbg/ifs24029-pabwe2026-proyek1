import { describe, it, expect } from "vitest";
import { validateAkun } from "./validationHelper";

const valid = { nama: "Budi", nim: "123abc", password: "rahasia1", kamar: "101" };

describe("validateAkun", () => {
  it("lolos untuk data valid", () => {
    expect(validateAkun(valid)).toBeNull();
  });

  it("menolak field kosong atau tidak valid", () => {
    expect(validateAkun({ ...valid, nama: " " })).toMatch(/nama/i);
    expect(validateAkun({ ...valid, nim: "" })).toMatch(/nim wajib/i);
    expect(validateAkun({ ...valid, nim: "12 3!" })).toMatch(/huruf dan angka/i);
    expect(validateAkun({ ...valid, password: "123" })).toMatch(/minimal 6/i);
    expect(validateAkun({ ...valid, kamar: "" })).toMatch(/kamar/i);
  });

  it("kamar boleh kosong bila tidak wajib", () => {
    expect(validateAkun({ ...valid, kamar: "" }, { kamarWajib: false })).toBeNull();
  });
});
