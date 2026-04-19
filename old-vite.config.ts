import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  base: "/achat-ou-location-simulation/",
  define: {
    "import.meta.env.VITE_ROUTER_BASEPATH": JSON.stringify("/achat-ou-location-simulation"),
  },
  plugins: [react(), tailwindcss(), tsconfigPaths()],
  build: {
    outDir: "old-dist",
    emptyOutDir: true,
    sourcemap: true,
  },
});
