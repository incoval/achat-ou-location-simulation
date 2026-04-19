export type City = {
  name: string;
  pricePerM2: number;
  rentPerM2: number; // monthly rent per m²
};

export const CITIES: City[] = [
  { name: "Paris", pricePerM2: 10200, rentPerM2: 32 },
  { name: "Lyon", pricePerM2: 5200, rentPerM2: 16 },
  { name: "Marseille", pricePerM2: 3400, rentPerM2: 14 },
  { name: "Toulouse", pricePerM2: 3800, rentPerM2: 13 },
  { name: "Bordeaux", pricePerM2: 4500, rentPerM2: 15 },
  { name: "Nantes", pricePerM2: 4200, rentPerM2: 14 },
  { name: "Nice", pricePerM2: 5100, rentPerM2: 18 },
  { name: "Strasbourg", pricePerM2: 3600, rentPerM2: 13 },
  { name: "Rennes", pricePerM2: 4000, rentPerM2: 13 },
  { name: "Montpellier", pricePerM2: 3700, rentPerM2: 14 },
];

export type SimInputs = {
  pricePerM2: number;
  surface: number;
  monthlyRent: number;
  apport: number;
  rate: number; // % annual
  durationYears: number;
  notaryRate: number; // 0.075
  insuranceRate: number; // annual % of capital
  charges: number; // annual co-ownership charges
  maintenance: number; // annual maintenance
  appreciationProperty: number; // %/year
  appreciationRent: number; // %/year
  horizonYears: number;
  investReturn: number; // %/year for invested differential
};

export const DEFAULTS = {
  apport: 30000,
  rate: 3.7,
  durationYears: 20,
  notaryRate: 0.075,
  insuranceRate: 0.0036,
  charges: 2500,
  appreciationProperty: 1.5,
  appreciationRent: 1.5,
  horizonYears: 25,
  investReturn: 4,
  surface: 45,
};

export function monthlyPayment(capital: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return capital / n;
  return (capital * r) / (1 - Math.pow(1 + r, -n));
}

export function compute(inputs: SimInputs) {
  const propertyPrice = inputs.pricePerM2 * inputs.surface;
  const totalPrice = propertyPrice * (1 + inputs.notaryRate);
  const loan = Math.max(0, totalPrice - inputs.apport);
  const monthlyCredit = monthlyPayment(loan, inputs.rate, inputs.durationYears);
  const monthlyInsurance = (loan * inputs.insuranceRate) / 12;
  const totalMonthly = monthlyCredit + monthlyInsurance;
  const equivalentRent = propertyPrice * 0.0035; // ~3.5/1000 monthly

  // Year-by-year evolution
  const years = inputs.horizonYears;
  const data: Array<{
    year: number;
    ownerCost: number; // cumulative cost as owner (interest + insurance + charges + maintenance + notary)
    renterCost: number; // cumulative rent paid
    netWorth: number; // property value - remaining loan + invested differential
  }> = [];

  let remainingCapital = loan;
  let cumulativeOwnerCost = inputs.apport * 0 + propertyPrice * inputs.notaryRate; // notary is sunk
  let cumulativeRent = 0;
  let propertyValue = propertyPrice;
  let currentRent = inputs.monthlyRent;
  let invested = 0; // renter invests apport + monthly differential

  // Renter starts with apport invested
  invested = inputs.apport;

  const monthlyRate = inputs.rate / 100 / 12;

  for (let y = 1; y <= years; y++) {
    let yearInterest = 0;
    let yearPrincipal = 0;
    for (let m = 0; m < 12; m++) {
      if (y <= inputs.durationYears && remainingCapital > 0) {
        const interest = remainingCapital * monthlyRate;
        const principal = Math.min(monthlyCredit - interest, remainingCapital);
        remainingCapital -= principal;
        yearInterest += interest;
        yearPrincipal += principal;
      }
    }
    const yearInsurance = y <= inputs.durationYears ? monthlyInsurance * 12 : 0;
    const yearCharges = inputs.charges + inputs.maintenance;
    const ownerYearCost = yearInterest + yearInsurance + yearCharges;
    cumulativeOwnerCost += ownerYearCost;

    // Renter side
    const renterYear = currentRent * 12;
    cumulativeRent += renterYear;

    // Differential invested by renter (owner monthly outflow vs renter)
    const ownerMonthly = (y <= inputs.durationYears ? totalMonthly : 0) + yearCharges / 12;
    const monthlyDiff = ownerMonthly - currentRent;
    // grow invested at investReturn, then add monthly diff (if positive)
    invested = invested * (1 + inputs.investReturn / 100);
    if (monthlyDiff > 0) invested += monthlyDiff * 12;

    propertyValue *= 1 + inputs.appreciationProperty / 100;
    currentRent *= 1 + inputs.appreciationRent / 100;

    const ownerNet = propertyValue - Math.max(0, remainingCapital) - cumulativeOwnerCost - inputs.apport;
    const renterNet = invested - cumulativeRent;
    const netWorth = ownerNet - renterNet;

    data.push({
      year: y,
      ownerCost: Math.round(cumulativeOwnerCost + inputs.apport),
      renterCost: Math.round(cumulativeRent),
      netWorth: Math.round(netWorth),
    });
  }

  // Find break-even year (netWorth crosses 0 going positive)
  const breakEven = data.find((d) => d.netWorth >= 0)?.year ?? null;

  return {
    propertyPrice,
    totalPrice,
    loan,
    monthlyCredit,
    monthlyInsurance,
    totalMonthly,
    equivalentRent,
    diffVsRent: totalMonthly - inputs.monthlyRent,
    breakEven,
    data,
  };
}

export const fmtEUR = (n: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(n);
export const fmtEURk = (n: number) => `${Math.round(n / 1000)} k€`;
