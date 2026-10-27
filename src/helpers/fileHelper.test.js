import { describe, it, expect, vi } from "vitest";
import { readFileAsDataUrl, validateFile, resizeImage } from "./fileHelper";

const berkas = (name, type, size = 10) => {
  const file = new File(["x"], name, { type });
  Object.defineProperty(file, "size", { value: size });
  return file;
};

describe("fileHelper", () => {
  it("readFileAsDataUrl menghasilkan data URL", async () => {
    expect(await readFileAsDataUrl(berkas("a.png", "image/png"))).toMatch(/^data:image\/png;base64,/);
  });

  it("readFileAsDataUrl menolak bila FileReader gagal", async () => {
    const asli = global.FileReader;
    global.FileReader = class {
      readAsDataURL() { this.onerror(); }
    };
    await expect(readFileAsDataUrl(berkas("a.png", "image/png"))).rejects.toThrow(/gagal membaca/i);
    global.FileReader = asli;
  });

  it("validateFile memeriksa tipe dan ukuran", () => {
    expect(validateFile(berkas("a.pdf", "application/pdf"), { imageOnly: true })).toMatch(/gambar/i);
    expect(validateFile(berkas("a.png", "image/png", 3 * 1024 * 1024), { maxMb: 2 })).toMatch(/2 MB/);
    expect(validateFile(berkas("a.png", "image/png"), { maxMb: 2, imageOnly: true })).toBeNull();
    expect(validateFile(berkas("a.png", "image/png"))).toBeNull();
  });

  it("resizeImage memperkecil gambar ke JPEG", async () => {
    const asliImage = global.Image;
    global.Image = class {
      width = 1024; height = 512;
      set src(_) { setTimeout(() => this.onload(), 0); }
    };
    const ctx = { drawImage: vi.fn() };
    const canvas = { getContext: () => ctx, toDataURL: vi.fn(() => "data:image/jpeg;base64,z") };
    const createEl = vi.spyOn(document, "createElement").mockReturnValue(canvas);
    const hasil = await resizeImage(berkas("a.png", "image/png"), 512);
    expect(hasil).toBe("data:image/jpeg;base64,z");
    expect(canvas.width).toBe(512);
    expect(canvas.height).toBe(256);
    createEl.mockRestore();
    global.Image = asliImage;
  });

  it("resizeImage menolak bila gambar tidak bisa dibaca", async () => {
    const asliImage = global.Image;
    global.Image = class {
      set src(_) { setTimeout(() => this.onerror(), 0); }
    };
    await expect(resizeImage(berkas("a.png", "image/png"), 512)).rejects.toThrow(/gambar/i);
    global.Image = asliImage;
  });
});
