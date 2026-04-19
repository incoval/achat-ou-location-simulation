import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    prerender: {
      enabled: true,
      crawlLinks: true,
    },
    pages: [
      { path: "/" },
      { path: "/scpi" },
    ],
  },
  vite: {
    base: "/achat-ou-location-simulation/",
    build: {
      outDir: "dist-spa",
      emptyOutDir: true,
    },
    define: {
      "import.meta.env.VITE_ROUTER_BASEPATH": JSON.stringify("/achat-ou-location-simulation"),
    },
  },
});
