import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";

vi.mock("../helpers/toolsHelper", () => ({ showErrorDialog: vi.fn() }));
vi.mock("../helpers/fileHelper", async (orig) => ({
  ...(await orig()),
  resizeImage: vi.fn().mockResolvedValue("data:image/jpeg;base64,kecil"),
}));

import usePhotoUpload from "./usePhotoUpload";
import { showErrorDialog } from "../helpers/toolsHelper";
import { resizeImage } from "../helpers/fileHelper";

const event = (file) => ({ target: { files: file ? [file] : [], value: "x" } });

describe("usePhotoUpload", () => {
  beforeEach(() => vi.clearAllMocks());

  it("membaca gambar menjadi data URL lalu bisa dihapus", async () => {
    const { result } = renderHook(() => usePhotoUpload());
    await act(() => result.current.onChange(event(new File(["x"], "a.png", { type: "image/png" }))));
    await waitFor(() => expect(result.current.foto).toMatch(/^data:image\/png/));
    act(() => result.current.clear());
    expect(result.current.foto).toBe("");
  });

  it("memperkecil gambar bila resize aktif", async () => {
    const { result } = renderHook(() => usePhotoUpload("", { resize: true }));
    await act(() => result.current.onChange(event(new File(["x"], "a.png", { type: "image/png" }))));
    expect(resizeImage).toHaveBeenCalled();
    expect(result.current.foto).toBe("data:image/jpeg;base64,kecil");
  });

  it("menolak file non-gambar", async () => {
    const { result } = renderHook(() => usePhotoUpload());
    await act(() => result.current.onChange(event(new File(["x"], "a.pdf", { type: "application/pdf" }))));
    expect(showErrorDialog).toHaveBeenCalledWith(expect.stringMatching(/gambar/i));
    expect(result.current.foto).toBe("");
  });

  it("mengabaikan bila tidak ada file", async () => {
    const { result } = renderHook(() => usePhotoUpload("awal"));
    await act(() => result.current.onChange(event(null)));
    expect(result.current.foto).toBe("awal");
  });

  it("menampilkan error bila gambar gagal diproses", async () => {
    resizeImage.mockRejectedValueOnce(new Error("x"));
    const { result } = renderHook(() => usePhotoUpload("", { resize: true }));
    await act(() => result.current.onChange(event(new File(["x"], "a.png", { type: "image/png" }))));
    expect(showErrorDialog).toHaveBeenCalledWith(expect.stringMatching(/gagal membaca/i));
  });
});
