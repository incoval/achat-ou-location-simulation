import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SCPI_DEFAULTS, computeScpi } from "@/lib/scpi";
import { fmtEUR } from "@/lib/simulator";
import { LabeledSlider } from "@/components/sim/Slider";
import { StatCard } from "@/components/sim/StatCard";
import { Input } from "@/components/ui/input";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/scpi")({
  head: () => ({
    meta: [
      { title: "Simulateur SCPI — investissement à crédit ou comptant" },
      {
        name: "description",
        content:
          "Simulez un investissement en SCPI, à crédit ou comptant, et comparez le rendement, le cashflow et le patrimoine sur 25 ans.",
      },
      { property: "og:title", content: "Simulateur SCPI — à crédit ou comptant" },
      {
        property: "og:description",
        content: "Simulez un investissement en SCPI et comparez les scénarios.",
      },
    ],
  }),
  component: ScpiPage,
});

function ScpiPage() {
  const [amount, setAmount] = useState(SCPI_DEFAULTS.amount);
  const [financed, setFinanced] = useState(SCPI_DEFAULTS.financed);
  const [apport, setApport] = useState(SCPI_DEFAULTS.apport);
  const [rate, setRate] = useState(SCPI_DEFAULTS.rate);
  const [duration, setDuration] = useState(SCPI_DEFAULTS.durationYears);
  const [yieldRate, setYieldRate] = useState(SCPI_DEFAULTS.yieldRate);
  const [appreciation, setAppreciation] = useState(SCPI_DEFAULTS.appreciation);
  const [fees, setFees] = useState(SCPI_DEFAULTS.fees);
  const [taxRate, setTaxRate] = useState(SCPI_DEFAULTS.taxRate);

  const result = useMemo(
    () =>
      computeScpi({
        amount,
        financed,
        apport,
        rate,
        durationYears: duration,
        yieldRate,
        appreciation,
        fees,
        taxRate,
        horizonYears: SCPI_DEFAULTS.horizonYears,
      }),
    [amount, financed, apport, rate, duration, yieldRate, appreciation, fees, taxRate]
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <Link
            to="/"
            className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au simulateur achat / location
          </Link>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Investir en{" "}
            <span className="bg-[var(--gradient-hero)] bg-clip-text text-transparent">SCPI</span>{" "}
            — à crédit ou comptant ?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Simulez un investissement en parts de SCPI et comparez les scénarios financés ou non, sur 25 ans.
          </p>
        </header>

        <div className="mb-5 inline-flex rounded-xl border border-border bg-card p-1 shadow-[var(--shadow-card)]">
          <button
            onClick={() => setFinanced(true)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              financed ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            À crédit
          </button>
          <button
            onClick={() => setFinanced(false)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
              !financed ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Comptant
          </button>
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <h2 className="mb-4 text-lg font-semibold">L'investissement</h2>
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Montant total (€)</span>
                  <Input type="number" value={amount} onChange={(e) => setAmount(Number(e.target.value) || 0)} />
                </div>
                <LabeledSlider
                  label="Rendement SCPI"
                  value={yieldRate}
                  onChange={setYieldRate}
                  min={2}
                  max={8}
                  step={0.1}
                  format={(v) => `${v.toFixed(1)} % / an`}
                />
                <LabeledSlider
                  label="Revalorisation parts"
                  value={appreciation}
                  onChange={setAppreciation}
                  min={-2}
                  max={4}
                  step={0.1}
                  format={(v) => `${v.toFixed(1)} % / an`}
                />
                <LabeledSlider
                  label="Frais de souscription"
                  value={fees}
                  onChange={setFees}
                  min={0}
                  max={15}
                  step={0.5}
                  format={(v) => `${v.toFixed(1)} %`}
                />
                <LabeledSlider
                  label="Fiscalité sur loyers"
                  value={taxRate}
                  onChange={setTaxRate}
                  min={0}
                  max={60}
                  step={1}
                  format={(v) => `${v} %`}
                />
              </div>
            </div>

            {financed && (
              <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <h2 className="mb-4 text-lg font-semibold">Financement</h2>
                <div className="space-y-5">
                  <LabeledSlider
                    label="Apport"
                    value={apport}
                    onChange={setApport}
                    min={0}
                    max={amount}
                    step={1000}
                    format={(v) => fmtEUR(v)}
                  />
                  <LabeledSlider
                    label="Taux d'intérêt"
                    value={rate}
                    onChange={setRate}
                    min={0.5}
                    max={8}
                    step={0.1}
                    format={(v) => `${v.toFixed(1)} %`}
                  />
                  <LabeledSlider
                    label="Durée du prêt"
                    value={duration}
                    onChange={setDuration}
                    min={5}
                    max={25}
                    format={(v) => `${v} ans`}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="space-y-5 lg:col-span-8">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
              <StatCard
                label={financed ? "Apport initial" : "Capital investi"}
                value={fmtEUR(result.upfront)}
                sub={financed ? `prêt : ${fmtEUR(result.loan)}` : `frais : ${fmtEUR(amount - result.investedNet)}`}
              />
              <StatCard
                label="Mensualité crédit"
                value={financed ? fmtEUR(Math.round(result.monthlyCredit)) : "—"}
                sub={financed ? `sur ${duration} ans` : "comptant"}
              />
              <StatCard
                label="Valeur parts à 25 ans"
                value={fmtEUR(Math.round(result.finalShareValue))}
                sub={`+ ${appreciation.toFixed(1)} % / an`}
                tone="success"
              />
              <StatCard
                label="Seuil de rentabilité"
                value={result.breakEven ? `${result.breakEven} ans` : "—"}
                sub={result.breakEven ? "patrimoine positif" : "non atteint sur 25 ans"}
                tone={result.breakEven ? "success" : "default"}
              />
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <h2 className="mb-4 text-lg font-semibold">Évolution du patrimoine</h2>
              <div className="h-[320px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={result.data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="year" stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${v}a`} />
                    <YAxis stroke="hsl(var(--muted-foreground))" tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                    <Tooltip
                      formatter={(v) => fmtEUR(Number(v))}
                      contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8 }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="netWorth" name="Patrimoine net" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={false} />
                    <Line type="monotone" dataKey="cumulativeRent" name="Loyers nets cumulés" stroke="hsl(var(--chart-2, 142 71% 45%))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Simulateur à but indicatif — les rendements passés ne préjugent pas des rendements futurs.
        </footer>
      </div>
    </div>
  );
}
