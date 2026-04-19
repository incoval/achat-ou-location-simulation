import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Standalone SPA build for GitHub Pages.
// Used by .github/workflows/deploy.yml — does NOT affect Lovable preview.
export default defineConfig({
  base: "/dynamic-finance-simulator/",
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    outDir: "dist-spa",
    emptyOutDir: true,
  },
});
