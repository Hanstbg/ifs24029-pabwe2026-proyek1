import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";
import PhotoField from "./PhotoField";

function Rusak() {
  throw new Error("boom");
}

describe("ErrorBoundary", () => {
  it("menampilkan fallback saat child error", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    render(<ErrorBoundary><Rusak /></ErrorBoundary>);
    expect(screen.getByText(/terjadi kesalahan/i)).toBeInTheDocument();
    const reload = vi.fn();
    Object.defineProperty(window, "location", { value: { reload }, configurable: true });
    fireEvent.click(screen.getByRole("button", { name: /muat ulang/i }));
    expect(reload).toHaveBeenCalled();
  });

  it("merender child bila aman", () => {
    render(<ErrorBoundary><p>aman</p></ErrorBoundary>);
    expect(screen.getByText("aman")).toBeInTheDocument();
  });
});

describe("PhotoField", () => {
  it("menampilkan pratinjau dan tombol hapus bila ada foto", () => {
    const onClear = vi.fn();
    render(<PhotoField id="f" label="Foto" foto="data:image/png;base64,a" onChange={() => {}} onClear={onClear} />);
    fireEvent.click(screen.getByRole("button", { name: /hapus foto/i }));
    expect(onClear).toHaveBeenCalled();
    expect(screen.getByAltText(/pratinjau/i)).toBeInTheDocument();
  });
});
