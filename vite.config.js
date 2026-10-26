import fs from "node:fs";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// Normalisasi path di coverage/lcov.info ke "src/..." agar terbaca SonarQube.
process.on("exit", () => {
  try {
    const p = "./coverage/lcov.info";
    if (fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf8");
      fs.writeFileSync(p, raw.replace(/\\/g, "/").replace(/SF:.*\/src\//g, "SF:src/"), "utf8");
    }
  } catch {
    // abaikan jika lcov.info belum ada
  }
});

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // Saat development, request /api diteruskan ke server Express di port 3000.
    proxy: { "/api": "http://localhost:3000" },
  },
  test: {
    globals: true,
    include: ["src/**/*.test.{js,jsx}"],
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
    css: false,
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/main.jsx", "src/setupTests.js", "src/test-utils.jsx", "src/**/*.test.{js,jsx}"],
      thresholds: { statements: 100, branches: 100, functions: 100, lines: 100 },
    },
  },
});
