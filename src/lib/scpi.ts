export type ScpiInputs = {
  amount: number; // total invested
  financed: boolean;
  apport: number; // only if financed
  rate: number; // loan rate %
  durationYears: number; // loan duration
  yieldRate: number; // SCPI distribution yield %/year
  appreciation: number; // share value revaluation %/year
  fees: number; // subscription fees %
  taxRate: number; // marginal tax + social on rents %
  horizonYears: number;
};

export const SCPI_DEFAULTS: ScpiInputs = {
  amount: 100000,
  financed: true,
  apport: 10000,
  rate: 4.0,
  durationYears: 20,
  yieldRate: 4.5,
  appreciation: 1.0,
  fees: 10,
  taxRate: 30,
  horizonYears: 25,
};

function monthlyPayment(capital: number, annualRate: number, years: number) {
  const r = annualRate / 100 / 12;
  const n = years * 12;
  if (r === 0) return capital / n;
  return (capital * r) / (1 - Math.pow(1 + r, -n));
}

export function computeScpi(inputs: ScpiInputs) {
  const investedNet = inputs.amount * (1 - inputs.fees / 100); // capital effectively invested in shares
  const loan = inputs.financed ? Math.max(0, inputs.amount - inputs.apport) : 0;
  const monthlyCredit = inputs.financed ? monthlyPayment(loan, inputs.rate, inputs.durationYears) : 0;
  const upfront = inputs.financed ? inputs.apport : inputs.amount;

  const monthlyRate = inputs.rate / 100 / 12;
  let remainingCapital = loan;
  let shareValue = investedNet;
  let cumulativeRent = 0;
  let cumulativeInterest = 0;
  let cumulativeCredit = 0;
  let cumulativeNetCashflow = -upfront;

  const data: Array<{
    year: number;
    netWorth: number;
    cumulativeRent: number;
    cumulativeCost: number;
  }> = [];

  for (let y = 1; y <= inputs.horizonYears; y++) {
    // Rents (gross), then taxed
    const grossRent = shareValue * (inputs.yieldRate / 100);
    const netRent = grossRent * (1 - inputs.taxRate / 100);
    cumulativeRent += netRent;

    // Loan amortization
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
    const yearCredit = inputs.financed && y <= inputs.durationYears ? monthlyCredit * 12 : 0;
    cumulativeInterest += yearInterest;
    cumulativeCredit += yearCredit;

    // Net cashflow over the year: rents - credit
    cumulativeNetCashflow += netRent - yearCredit;

    // Revalorisation
    shareValue *= 1 + inputs.appreciation / 100;

    // Patrimoine net = valeur parts - capital restant + cashflow cumulé
    const netWorth = shareValue - Math.max(0, remainingCapital) + cumulativeNetCashflow;

    data.push({
      year: y,
      netWorth: Math.round(netWorth),
      cumulativeRent: Math.round(cumulativeRent),
      cumulativeCost: Math.round(cumulativeCredit + (inputs.amount - investedNet)),
    });
  }

  const finalShareValue = shareValue;
  const totalEffort = upfront + (inputs.financed ? cumulativeCredit - cumulativeRent : -cumulativeRent);
  const breakEven = data.find((d) => d.netWorth >= 0)?.year ?? null;

  return {
    investedNet,
    loan,
    monthlyCredit,
    upfront,
    finalShareValue,
    totalEffort,
    breakEven,
    data,
  };
}
