import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { tanstackRouter } from "@tanstack/router-plugin/vite";

// Pure SPA build for GitHub Pages — no TanStack Start SSR/prerender.
// The app mounts via src/main.tsx -> RouterProvider in the browser.
export default defineConfig({
  base: "/achat-ou-location-simulation/",
  define: {
    "import.meta.env.VITE_ROUTER_BASEPATH": JSON.stringify("/achat-ou-location-simulation"),
  },
  plugins: [
    tanstackRouter({ target: "react", autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
  build: {
    outDir: "dist-spa",
    emptyOutDir: true,
  },
});
