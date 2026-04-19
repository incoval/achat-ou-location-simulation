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
  // Hypothèses éditables
  const [notaryRate, setNotaryRate] = useState(DEFAULTS.notaryRate * 100); // en %
  const [insuranceRate, setInsuranceRate] = useState(DEFAULTS.insuranceRate * 100); // en %
  const [maintenanceAutoRate, setMaintenanceAutoRate] = useState(0.5); // % du bien / an
  const [investReturn, setInvestReturn] = useState(DEFAULTS.investReturn);
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
    setNotaryRate(DEFAULTS.notaryRate * 100);
    setInsuranceRate(DEFAULTS.insuranceRate * 100);
    setMaintenanceAutoRate(0.5);
    setInvestReturn(DEFAULTS.investReturn);
  };

  const propertyPrice = pricePerM2 * surface;
  const autoMaintenance = Math.round(propertyPrice * (maintenanceAutoRate / 100));
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
        notaryRate: notaryRate / 100,
        insuranceRate: insuranceRate / 100,
        charges,
        maintenance: effectiveMaintenance,
        appreciationProperty: appProperty,
        appreciationRent: appRent,
        horizonYears: DEFAULTS.horizonYears,
        investReturn,
      }),
    [pricePerM2, surface, monthlyRent, apport, rate, duration, charges, effectiveMaintenance, appProperty, appRent, investReturn, notaryRate, insuranceRate]
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

        <div className="mb-5">
          <CityPicker selected={city.name} onSelect={handleCity} onReset={handleReset} />
        </div>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          {/* Colonne gauche : paramètres compacts */}
          <div className="space-y-5 lg:col-span-4">
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
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Prix au m² (€)</span>
                  <Input type="number" value={pricePerM2} onChange={(e) => setPricePerM2(Number(e.target.value) || 0)} />
                </div>
                <div className="space-y-1.5">
                  <span className="text-xs font-medium text-muted-foreground">Loyer / mois (€)</span>
                  <Input type="number" value={monthlyRent} onChange={(e) => setMonthlyRent(Number(e.target.value) || 0)} />
                </div>
              </div>
              <div className="mt-4 rounded-xl bg-muted/40 p-3">
                <div className="text-xs text-muted-foreground">Prix du bien</div>
                <div className="mt-0.5 text-xl font-bold">{fmtEUR(propertyPrice)}</div>
              </div>
            </div>

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

          {/* Colonne droite : résultats + graphique above the fold */}
          <div className="space-y-5 lg:col-span-8">
            <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
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
              <div className="mt-3 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]">
                <p className="mb-4 text-sm text-muted-foreground">
                  Ajustez les paramètres avancés du calcul. Les valeurs par défaut correspondent aux moyennes du marché français.
                </p>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Frais de notaire (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      min={0}
                      max={20}
                      value={notaryRate}
                      onChange={(e) => setNotaryRate(Math.max(0, Math.min(20, Number(e.target.value) || 0)))}
                    />
                    <p className="text-xs text-muted-foreground">% du prix du bien</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Assurance emprunteur (%)</label>
                    <Input
                      type="number"
                      step="0.01"
                      min={0}
                      max={5}
                      value={insuranceRate}
                      onChange={(e) => setInsuranceRate(Math.max(0, Math.min(5, Number(e.target.value) || 0)))}
                    />
                    <p className="text-xs text-muted-foreground">% annuel du capital emprunté</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Entretien auto (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      min={0}
                      max={5}
                      value={maintenanceAutoRate}
                      onChange={(e) => setMaintenanceAutoRate(Math.max(0, Math.min(5, Number(e.target.value) || 0)))}
                      disabled={!maintenanceAuto}
                    />
                    <p className="text-xs text-muted-foreground">% annuel de la valeur du bien</p>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Rendement placement (%)</label>
                    <Input
                      type="number"
                      step="0.1"
                      min={0}
                      max={20}
                      value={investReturn}
                      onChange={(e) => setInvestReturn(Math.max(0, Math.min(20, Number(e.target.value) || 0)))}
                    />
                    <p className="text-xs text-muted-foreground">% annuel du capital investi par le locataire</p>
                  </div>
                </div>
                <div className="mt-5 rounded-xl bg-muted/40 p-4 text-xs text-muted-foreground">
                  <p className="mb-2 font-medium text-foreground">Formules utilisées</p>
                  <ul className="list-disc space-y-1 pl-5">
                    <li>Mensualité calculée selon la formule du prêt à mensualités constantes.</li>
                    <li>
                      Patrimoine net = (valeur bien revalorisée − capital restant dû − coûts cumulés − apport) − (apport + différentiel
                      mensuel investis au rendement placement − loyers cumulés).
                    </li>
                    <li>Revalorisation appliquée annuellement, intérêts amortis mensuellement.</li>
                  </ul>
                </div>
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
