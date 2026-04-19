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
    <div className="rounded-2xl border border-border bg-card p-3 shadow-[var(--shadow-card)]">
      <div className="flex items-center gap-2 overflow-x-auto">
        <div className="flex flex-1 flex-wrap gap-1.5">
          {CITIES.map((c) => {
            const active = c.name === selected;
            return (
              <button
                key={c.name}
                onClick={() => onSelect(c)}
                className={cn(
                  "rounded-lg border px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-all",
                  active
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-background text-foreground hover:border-primary/40 hover:bg-muted/40"
                )}
                title={`${c.pricePerM2.toLocaleString("fr-FR")} €/m²`}
              >
                {c.name}
              </button>
            );
          })}
        </div>
        <button
          onClick={onReset}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
          title={`Réinitialiser (${selected})`}
        >
          <RotateCcw className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Réinit.</span>
        </button>
      </div>
    </div>
  );
}
