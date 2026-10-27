import { Component } from "react";

/** Menangkap error render agar satu halaman rusak tidak mematikan seluruh aplikasi. */
export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-xl font-extrabold text-slate-900">Terjadi kesalahan</h1>
        <p className="text-sm text-slate-600 mt-1">Muat ulang halaman untuk mencoba lagi.</p>
        <button
          type="button"
          className="btn-primary mt-4"
          onClick={() => window.location.reload()}
        >
          Muat ulang
        </button>
      </main>
    );
  }
}
