import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

// Standalone SPA build for GitHub Pages.
// Used by .github/workflows/deploy.yml — does NOT affect Lovable preview.
// Deployed at: https://incoval.github.io/achat-ou-location-simulation/
export default defineConfig({
  base: "/achat-ou-location-simulation/",
  define: {
    "import.meta.env.VITE_ROUTER_BASEPATH": JSON.stringify("/achat-ou-location-simulation"),
  },
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    outDir: "dist-spa",
    emptyOutDir: true,
  },
});
