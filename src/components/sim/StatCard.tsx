import { cn } from "@/lib/utils";

type Props = {
  label: string;
  value: string;
  sub?: string;
  tone?: "default" | "success" | "danger";
};

export function StatCard({ label, value, sub, tone = "default" }: Props) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
      <div className="text-sm text-muted-foreground">{label}</div>
      <div
        className={cn(
          "mt-2 text-3xl font-bold tabular-nums",
          tone === "danger" && "text-[oklch(0.62_0.24_25)]",
          tone === "success" && "text-[oklch(0.55_0.18_155)]",
          tone === "default" && "text-foreground"
        )}
      >
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-muted-foreground">{sub}</div>}
    </div>
  );
}
