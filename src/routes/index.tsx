import { createFileRoute } from "@tanstack/react-router";
import { Simulator } from "@/Simulator";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Acheter ou louer ? Le simulateur" },
      {
        name: "description",
        content: "Comparez l'achat et la location de votre résidence principale dans les 10 plus grandes villes françaises.",
      },
      { property: "og:title", content: "Acheter ou louer ? Le simulateur" },
      { property: "og:description", content: "Simulateur dynamique pour comparer achat vs location en France." },
    ],
  }),
  component: Simulator,
});
