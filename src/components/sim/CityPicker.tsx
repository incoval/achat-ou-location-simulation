import { CITIES, type City } from "@/lib/simulator";
import { cn } from "@/lib/utils";
import { RotateCcw } from "lucide-react";

type Props = {
  selected: string;
  onSelect: (c: City) => void;
  onReset: () => void;
};

export function CityPicker({ selected, onSelect, onReset }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <h2 className="mb-4 text-lg font-semibold">Choisir une ville</h2>
      <div className="grid grid-cols-2 gap-2.5">
        {CITIES.map((c) => {
          const active = c.name === selected;
          return (
            <button
              key={c.name}
              onClick={() => onSelect(c)}
              className={cn(
                "rounded-xl border p-3 text-left transition-all",
                active
                  ? "border-primary bg-primary/5 ring-1 ring-primary/40"
                  : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
              )}
            >
              <div className="text-sm font-semibold text-foreground">{c.name}</div>
              <div className="text-xs text-muted-foreground">{c.pricePerM2.toLocaleString("fr-FR")} €/m²</div>
            </button>
          );
        })}
      </div>
      <button
        onClick={onReset}
        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-2.5 text-sm font-medium transition-colors hover:bg-muted"
      >
        <RotateCcw className="h-4 w-4" />
        Réinitialiser ({selected})
      </button>
    </div>
  );
}
