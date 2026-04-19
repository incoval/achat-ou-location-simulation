import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fmtEUR, fmtEURk } from "@/lib/simulator";

type Point = { year: number; ownerCost: number; renterCost: number; netWorth: number };

export function EvolutionChart({ data }: { data: Point[] }) {
  return (
    <div className="h-[360px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 16, left: 8, bottom: 8 }}>
          <defs>
            <linearGradient id="ownerGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.62 0.24 25)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="oklch(0.62 0.24 25)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="renterGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.78 0.16 75)" stopOpacity={0.35} />
              <stop offset="100%" stopColor="oklch(0.78 0.16 75)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="netGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.6 0.2 250)" stopOpacity={0.45} />
              <stop offset="100%" stopColor="oklch(0.6 0.2 250)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.9 0.01 260)" />
          <XAxis
            dataKey="year"
            tick={{ fill: "oklch(0.45 0.03 260)", fontSize: 12 }}
            label={{ value: "Années", position: "insideBottom", offset: -2, fill: "oklch(0.45 0.03 260)", fontSize: 12 }}
          />
          <YAxis
            tickFormatter={(v) => fmtEURk(Number(v))}
            tick={{ fill: "oklch(0.45 0.03 260)", fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "oklch(1 0 0)",
              border: "1px solid oklch(0.9 0.01 260)",
              borderRadius: 12,
              fontSize: 12,
            }}
            formatter={(value: number, name: string) => [fmtEUR(Number(value)), name]}
            labelFormatter={(l) => `Année ${l}`}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Area
            type="monotone"
            dataKey="ownerCost"
            name="Cumul coûts propriétaire"
            stroke="oklch(0.62 0.24 25)"
            strokeWidth={2.5}
            fill="url(#ownerGrad)"
          />
          <Area
            type="monotone"
            dataKey="renterCost"
            name="Cumul loyers locataire"
            stroke="oklch(0.78 0.16 75)"
            strokeWidth={2.5}
            fill="url(#renterGrad)"
          />
          <Area
            type="monotone"
            dataKey="netWorth"
            name="Patrimoine net"
            stroke="oklch(0.6 0.2 250)"
            strokeWidth={2.5}
            fill="url(#netGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
