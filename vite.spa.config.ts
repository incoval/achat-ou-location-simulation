import { defineConfig } from "@lovable.dev/vite-tanstack-config";

export default defineConfig({
  tanstackStart: {
    prerender: {
      enabled: true,
    },
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
