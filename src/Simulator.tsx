import { useMemo, useState } from "react";
import { CITIES, DEFAULTS, compute, fmtEUR, type City } from "@/lib/simulator";
import { CityPicker } from "@/components/sim/CityPicker";
import { LabeledSlider } from "@/components/sim/Slider";
import { StatCard } from "@/components/sim/StatCard";
import { EvolutionChart } from "@/components/sim/EvolutionChart";
import { Input } from "@/components/ui/input";
import { ChevronDown } from "lucide-react";

export function Simulator() {
  const [city, setCity] = useState<City>(CITIES[0]);
  const [pricePerM2, setPricePerM2] = useState(city.pricePerM2);
  const [surface, setSurface] = useState(DEFAULTS.surface);
  const [monthlyRent, setMonthlyRent] = useState(Math.round(city.rentPerM2 * DEFAULTS.surface));
  const [apport, setApport] = useState(DEFAULTS.apport);
  const [rate, setRate] = useState(DEFAULTS.rate);
  const [duration, setDuration] = useState(DEFAULTS.durationYears);
  const [charges, setCharges] = useState(DEFAULTS.charges);
  const [maintenance, setMaintenance] = useState(0);
  const [maintenanceAuto, setMaintenanceAuto] = useState(true);
  const [appProperty, setAppProperty] = useState(DEFAULTS.appreciationProperty);
  const [appRent, setAppRent] = useState(DEFAULTS.appreciationRent);
  const [investReturn] = useState(DEFAULTS.investReturn);
  const [showHypo, setShowHypo] = useState(false);

  const handleCity = (c: City) => {
    setCity(c);
    setPricePerM2(c.pricePerM2);
    setMonthlyRent(Math.round(c.rentPerM2 * surface));
  };

  const handleReset = () => {
    setPricePerM2(city.pricePerM2);
    setSurface(DEFAULTS.surface);
    setMonthlyRent(Math.round(city.rentPerM2 * DEFAULTS.surface));
    setApport(DEFAULTS.apport);
    setRate(DEFAULTS.rate);
    setDuration(DEFAULTS.durationYears);
    setCharges(DEFAULTS.charges);
    setMaintenanceAuto(true);
    setAppProperty(DEFAULTS.appreciationProperty);
    setAppRent(DEFAULTS.appreciationRent);
  };

  const propertyPrice = pricePerM2 * surface;
  const autoMaintenance = Math.round(propertyPrice * 0.005);
  const effectiveMaintenance = maintenanceAuto ? autoMaintenance : maintenance;

  const result = useMemo(
    () =>
      compute({
        pricePerM2,
        surface,
        monthlyRent,
        apport,
        rate,
        durationYears: duration,
        notaryRate: DEFAULTS.notaryRate,
        insuranceRate: DEFAULTS.insuranceRate,
        charges,
        maintenance: effectiveMaintenance,
        appreciationProperty: appProperty,
        appreciationRent: appRent,
        horizonYears: DEFAULTS.horizonYears,
        investReturn,
      }),
    [pricePerM2, surface, monthlyRent, apport, rate, duration, charges, effectiveMaintenance, appProperty, appRent, investReturn]
  );

  const equivalentRent = Math.round(result.equivalentRent);
  const diff = Math.round(result.diffVsRent);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Acheter ou louer ?{" "}
            <span className="bg-[var(--gradient-hero)] bg-clip-text text-transparent">Le simulateur</span>
          </h1>
          <p className="mt-2 text-muted-foreground">
            Comparez l'achat et la location de votre résidence principale dans les 10 plus grandes villes françaises.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="space-y-5 lg:col-span-4">
            <CityPicker selected={city.name} onSelect={handleCity} onReset={handleReset} />
            <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <h2 className="mb-4 text-lg font-semibold">Le bien</h2>
              <LabeledSlider
                label="Surface"
                value={surface}
                onChange={(v) => {
                  setSurface(v);
                  setMonthlyRent(Math.round(city.rentPerM2 * v));
                }}
                min={15}
                max={200}
                format={(v) => `${v} m²`}
              />
              <div className="mt-5 space-y-2">
                <span className="text-sm font-medium">Prix au m² (€)</span>
                <Input type="number" value={pricePerM2} onChange={(e) => setPricePerM2(Number(e.target.value) || 0)} />
              </div>
              <div className="mt-5 space-y-2">
                <span className="text-sm font-medium">Loyer mensuel équivalent (€)</span>
                <Input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(Number(e.target.value) || 0)} />
              </div>
              <div className="mt-4 rounded-xl bg-muted/40 p-4">
                <div className="text-xs text-muted-foreground">Prix du bien</div>
                <div className="mt-1 text-2xl font-bold">{fmtEUR(propertyPrice)}</div>
                <div className="mt-1 text-xs text-muted-foreground">Loyer estimé : {fmtEUR(equivalentRent)} / mois</div>
              </div>
            </div>
          </div>

          <div className="space-y-5 lg:col-span-4">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <h2 className="mb-4 text-lg font-semibold">Financement</h2>
              <div className="space-y-5">
                <LabeledSlider label="Apport" value={apport} onChange={setApport} min={0} max={300000} step={1000} format={(v) => fmtEUR(v)} />
                <LabeledSlider label="Taux d'intérêt" value={rate} onChange={setRate} min={0.5} max={8} step={0.1} format={(v) => `${v.toFixed(1)} %`} />
                <LabeledSlider label="Durée du prêt" value={duration} onChange={setDuration} min={5} max={30} format={(v) => `${v} ans`} />
              </div>
            </div>
            <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <h2 className="mb-4 text-lg font-semibold">Charges & hypothèses</h2>
              <div className="space-y-5">
                <LabeledSlider label="Charges annuelles" value={charges} onChange={setCharges} min={0} max={10000} step={50} format={(v) => fmtEUR(v)} />
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">Entretien annuel</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setMaintenanceAuto(!maintenanceAuto)}
                        className={`rounded-full px-2 py-0.5 text-xs ${maintenanceAuto ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                      >
                        auto
                      </button>
                      <span className="text-sm font-semibold tabular-nums">{fmtEUR(effectiveMaintenance)}</span>
                    </div>
                  </div>
                  {!maintenanceAuto && (
                    <input type="range" min={0} max={10000} step={50} value={maintenance} onChange={(e) => setMaintenance(Number(e.target.value))} className="mt-2 w-full" />
                  )}
                </div>
                <LabeledSlider label="Revalorisation bien" value={appProperty} onChange={setAppProperty} min={-2} max={6} step={0.1} format={(v) => `${v.toFixed(1)} % / an`} />
                <LabeledSlider label="Revalorisation loyer" value={appRent} onChange={setAppRent} min={-2} max={6} step={0.1} format={(v) => `${v.toFixed(1)} % / an`} />
              </div>
            </div>
          </div>

          <div className="space-y-5 lg:col-span-4">
            <div className="grid grid-cols-2 gap-4">
              <StatCard label="Coût total achat" value={fmtEUR(result.totalPrice)} sub="prix + 7,5% notaire" />
              <StatCard label="Mensualité totale" value={fmtEUR(Math.round(result.totalMonthly))} sub="crédit + assurance" />
              <StatCard
                label="Écart vs loyer / mois"
                value={`${diff >= 0 ? "+" : ""}${fmtEUR(diff)}`}
                sub={diff >= 0 ? "achat plus cher" : "achat moins cher"}
                tone={diff >= 0 ? "danger" : "success"}
              />
              <StatCard
                label="Seuil de rentabilité"
                value={result.breakEven ? `${result.breakEven} ans` : "—"}
                sub={result.breakEven ? "patrimoine positif" : "non atteint sur 25 ans"}
                tone={result.breakEven ? "success" : "default"}
              />
            </div>
          </div>

          <div className="lg:col-span-12">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
              <h2 className="mb-4 text-lg font-semibold">Évolution sur 25 ans</h2>
              <EvolutionChart data={result.data} />
            </div>
          </div>

          <div className="lg:col-span-12">
            <button
              onClick={() => setShowHypo(!showHypo)}
              className="flex w-full items-center justify-between rounded-2xl border border-border bg-card px-5 py-4 text-left shadow-[var(--shadow-card)] transition-colors hover:bg-muted/40"
            >
              <span className="text-base font-semibold">Hypothèses du calcul</span>
              <ChevronDown className={`h-5 w-5 transition-transform ${showHypo ? "rotate-180" : ""}`} />
            </button>
            {showHypo && (
              <div className="mt-3 rounded-2xl border border-border bg-card p-5 text-sm text-muted-foreground shadow-[var(--shadow-card)]">
                <ul className="list-disc space-y-2 pl-5">
                  <li>Frais de notaire estimés à 7,5 % du prix du bien.</li>
                  <li>Assurance emprunteur : 0,36 % annuel du capital emprunté.</li>
                  <li>Mensualité calculée selon la formule du prêt à mensualités constantes.</li>
                  <li>Entretien auto : 0,5 % annuel de la valeur du bien.</li>
                  <li>
                    Patrimoine net = (valeur bien revalorisée − capital restant dû − coûts cumulés − apport) − (apport + différentiel
                    mensuel investis à {investReturn}% − loyers cumulés).
                  </li>
                  <li>Revalorisation appliquée annuellement, intérêts amortis mensuellement.</li>
                </ul>
              </div>
            )}
          </div>
        </div>

        <footer className="mt-12 text-center text-xs text-muted-foreground">
          Simulateur à but indicatif — les résultats dépendent de nombreuses hypothèses.
        </footer>
      </div>
    </div>
  );
}
