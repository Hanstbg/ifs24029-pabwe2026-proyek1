import { describe, it, expect, vi, afterEach } from "vitest";
import userEvent from "@testing-library/user-event";
import { renderWithProviders, screen, waitFor } from "../../../tests/test-utils";
import { showErrorDialog } from "../../../helpers/toolsHelper";
import SanksosPage from "./SanksosPage";

const mockAksi = vi.fn();
vi.mock("../states/action", () => ({
  asyncFetchSanksos: vi.fn(() => () => Promise.resolve()),
  asyncAjukanSanksos: vi.fn(() => () => Promise.resolve(true)),
  asyncAksiSanksos: (...args) => {
    mockAksi(...args);
    return () => Promise.resolve(true);
  },
}));
vi.mock("../../../helpers/toolsHelper", () => ({
  showErrorDialog: vi.fn(),
  showImageDialog: vi.fn(),
}));
vi.mock("../../demerit/states/action", () => ({
  asyncFetchDemerit: vi.fn(() => () => Promise.resolve()),
}));

const pembina = { id: 1, nama: "Bapak Asrama", role: "pembina" };
const mahasiswaUser = { id: 2, nama: "Budi", role: "mahasiswa" };

function stateWith(user, item) {
  return {
    auth: { user, isLogin: false },
    sanksos: { sanksos: [item], isSanksos: false, isSanksosSubmit: false },
  };
}

const base = { id: 5, nama: "Budi", jenis_demerit: "kuning", alasan: "Akumulasi 3 peringatan" };

describe("SanksosPage", () => {
  afterEach(() => {
    mockAksi.mockClear();
    vi.clearAllMocks();
  });

  it("pembina: request diajukan bisa disetujui dengan tugas", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SanksosPage />, {
      preloadedState: stateWith(pembina, { ...base, status: "diajukan", catatan: "Mohon dibantu" }),
    });
    expect(screen.getByText(/catatan mahasiswa: mohon dibantu/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText(/tugas sanksos untuk budi/i), "bersihkan selasar");
    await user.click(screen.getByRole("button", { name: /setujui/i }));
    expect(mockAksi).toHaveBeenCalledWith(5, "setujui", "bersihkan selasar");
  });

  it("pembina: request diajukan bisa ditolak", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SanksosPage />, {
      preloadedState: stateWith(pembina, { ...base, status: "diajukan" }),
    });
    await user.click(screen.getByRole("button", { name: /tolak/i }));
    expect(mockAksi).toHaveBeenCalledWith(5, "tolak", undefined);
  });

  it("pembina: request dikerjakan bisa diverifikasi selesai", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SanksosPage />, {
      preloadedState: stateWith(pembina, { ...base, status: "dikerjakan", tugas: "Bersihkan selasar" }),
    });
    expect(screen.getByText("Bersihkan selasar")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /verifikasi selesai/i }));
    expect(mockAksi).toHaveBeenCalledWith(5, "selesai", undefined);
  });

  it("pembina: request selesai tidak punya tombol aksi", () => {
    renderWithProviders(<SanksosPage />, {
      preloadedState: stateWith(pembina, { ...base, status: "selesai" }),
    });
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  const disetujui = () =>
    stateWith(mahasiswaUser, { ...base, status: "disetujui", tugas: "Sapu halaman", catatan: "Siap" });
  const berkas = (nama, tipe, ukuran) => {
    const file = new File(["isi"], nama, { type: tipe });
    if (ukuran) Object.defineProperty(file, "size", { value: ukuran });
    return file;
  };

  it("mahasiswa: tugas disetujui bisa ditandai sudah dikerjakan setelah upload bukti", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SanksosPage />, { preloadedState: disetujui() });
    expect(screen.getByRole("heading", { name: /sanksos saya/i })).toBeInTheDocument();
    expect(screen.getByText(/catatanmu: siap/i)).toBeInTheDocument();

    await user.upload(screen.getByLabelText(/upload foto \/ file bukti pengerjaan/i), berkas("bukti.png", "image/png"));
    expect(await screen.findByAltText(/pratinjau bukti pengerjaan/i)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /tandai sudah dikerjakan/i }));
    expect(mockAksi).toHaveBeenCalledWith(5, "dikerjakan", expect.stringMatching(/^data:image\/png;base64,/));
  });

  it("mahasiswa: tanpa bukti, tugas tidak bisa ditandai dikerjakan", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SanksosPage />, { preloadedState: disetujui() });

    await user.click(screen.getByRole("button", { name: /tandai sudah dikerjakan/i }));
    expect(showErrorDialog).toHaveBeenCalledWith(expect.stringMatching(/upload foto \/ file bukti/i));
    expect(mockAksi).not.toHaveBeenCalled();
  });

  it("mahasiswa: file bukti PDF menampilkan nama file, bukan pratinjau gambar", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SanksosPage />, { preloadedState: disetujui() });

    await user.upload(screen.getByLabelText(/upload foto \/ file bukti pengerjaan/i), berkas("laporan.pdf", "application/pdf"));
    await waitFor(() => expect(screen.getByText(/file: laporan\.pdf/i)).toBeInTheDocument());
    expect(screen.queryByAltText(/pratinjau bukti pengerjaan/i)).not.toBeInTheDocument();
  });

  it("mahasiswa: file bukti lebih dari 5 MB ditolak", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SanksosPage />, { preloadedState: disetujui() });

    await user.upload(
      screen.getByLabelText(/upload foto \/ file bukti pengerjaan/i),
      berkas("besar.png", "image/png", 6 * 1024 * 1024)
    );
    expect(showErrorDialog).toHaveBeenCalledWith(expect.stringMatching(/maksimal 5 mb/i));
    expect(screen.queryByAltText(/pratinjau bukti pengerjaan/i)).not.toBeInTheDocument();
  });

  it("mahasiswa: status lain tidak punya tombol aksi", () => {
    renderWithProviders(<SanksosPage />, {
      preloadedState: stateWith(mahasiswaUser, { ...base, status: "diajukan" }),
    });
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("menampilkan status memuat dan pesan kosong", () => {
    const { unmount } = renderWithProviders(<SanksosPage />, {
      preloadedState: {
        auth: { user: pembina, isLogin: false },
        sanksos: { sanksos: [], isSanksos: true, isSanksosSubmit: false },
      },
    });
    expect(screen.getByRole("status")).toHaveTextContent(/memuat data sanksos/i);
    unmount();

    renderWithProviders(<SanksosPage />, { preloadedState: { auth: { user: pembina, isLogin: false } } });
    expect(screen.getByText(/belum ada request sanksos/i)).toBeInTheDocument();
  });
});
