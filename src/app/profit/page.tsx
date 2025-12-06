"use client";

import { useEffect, useMemo, useState } from "react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

const NIGHTS_PER_YEAR = 30 * 12; // align with main ROI calculator
const DEFAULT_MANAGEMENT_FEE_PCT = 20;
const TAX_PCT = 10;

const PUBLIC_PASSWORD = process.env.NEXT_PUBLIC_PROFIT_PASSWORD || "profit";

function formatCurrency(n: number, currency: "USD" | "AUD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}

type Investor = {
  id: number;
  name: string;
  amount: number;
};

export default function ProfitPage() {
  const [passInput, setPassInput] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [totalInvestment, setTotalInvestment] = useState(500_000);
  const [villaQty, setVillaQty] = useState(3);
  const [nightlyRate, setNightlyRate] = useState(200);
  const [occupancy, setOccupancy] = useState(60); // percent 0-100
  const [managementFeePct, setManagementFeePct] = useState(DEFAULT_MANAGEMENT_FEE_PCT);
  const [currencyMode, setCurrencyMode] = useState<"USD" | "AUD">("AUD");
  const [usdToAud, setUsdToAud] = useState(1);
  const [fxLoading, setFxLoading] = useState(false);
  const [fxError, setFxError] = useState<string | null>(null);
  const [fxUpdatedAt, setFxUpdatedAt] = useState<string | null>(null);
  const [investors, setInvestors] = useState<Investor[]>([
    { id: 1, name: "Me", amount: 125_000 },
  ]);

  // Fetch live USD->AUD rate; projections are in USD base and converted for display
  useEffect(() => {
    let cancelled = false;
    async function fetchRate() {
      setFxLoading(true);
      setFxError(null);
      const tryProviders = [
        async () => {
          const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=AUD");
          if (!res.ok) throw new Error("exchangerate.host HTTP");
          const data = await res.json();
          const rate = data?.rates?.AUD;
          if (typeof rate !== "number" || !(rate > 0)) throw new Error("exchangerate.host data");
          return rate as number;
        },
        async () => {
          const res = await fetch("https://api.frankfurter.app/latest?from=USD&to=AUD");
          if (!res.ok) throw new Error("frankfurter HTTP");
          const data = await res.json();
          const rate = data?.rates?.AUD;
          if (typeof rate !== "number" || !(rate > 0)) throw new Error("frankfurter data");
          return rate as number;
        },
        async () => {
          const res = await fetch("https://open.er-api.com/v6/latest/USD");
          if (!res.ok) throw new Error("erapi HTTP");
          const data = await res.json();
          const rate = data?.rates?.AUD;
          if (typeof rate !== "number" || !(rate > 0)) throw new Error("erapi data");
          return rate as number;
        },
      ];

      for (const p of tryProviders) {
        try {
          const rate = await p();
          if (!cancelled) {
            setUsdToAud(rate);
            setFxUpdatedAt(new Date().toISOString());
            setFxLoading(false);
          }
          return;
        } catch (e) {
          // try next provider
        }
      }
      if (!cancelled) {
        setFxLoading(false);
        setFxError("Rate unavailable");
      }
    }
    fetchRate();
    const id = setInterval(fetchRate, 12 * 60 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  const fx = currencyMode === "AUD" ? usdToAud : 1;

  const { project, investorRows, totalInvested, totalPct } = useMemo(() => {
    if (!totalInvestment || totalInvestment <= 0) {
      return {
        project: null,
        investorRows: [] as Array<{
          investor: Investor;
          sharePct: number;
          monthlyNet: number;
          annualNet: number;
        }>,
        totalInvested: 0,
        totalPct: 0,
      };
    }

    const occupancyRatio = Math.max(0, Math.min(1, occupancy / 100));
    const baseAnnualGross = nightlyRate * occupancyRatio * NIGHTS_PER_YEAR;
    const annualGross = baseAnnualGross * Math.max(1, villaQty || 1);
    const managementFee = (managementFeePct / 100) * annualGross;
    const tax = (TAX_PCT / 100) * annualGross;
    const annualNet = annualGross - managementFee - tax;
    const monthlyGross = annualGross / 12;
    const monthlyNet = annualNet / 12;

    const totalInvested = investors.reduce((sum, inv) => sum + (inv.amount || 0), 0);
    const investorRows = investors.map((inv) => {
      const share = Math.max(0, Math.min(1, totalInvestment > 0 ? inv.amount / totalInvestment : 0));
      const sharePct = share * 100;
      const investorAnnualNet = annualNet * share;
      const investorMonthlyNet = monthlyNet * share;
      return {
        investor: inv,
        sharePct,
        monthlyNet: investorMonthlyNet,
        annualNet: investorAnnualNet,
      };
    });

    const totalPct = totalInvestment > 0 ? (totalInvested / totalInvestment) * 100 : 0;

    return {
      project: {
        annualGross,
        annualNet,
        monthlyGross,
        monthlyNet,
      },
      investorRows,
      totalInvested,
      totalPct,
    };
  }, [totalInvestment, nightlyRate, occupancy, managementFeePct, villaQty, investors]);

  function handleUnlock(e: React.FormEvent) {
    e.preventDefault();
    if (passInput.trim() === PUBLIC_PASSWORD) {
      setAuthorized(true);
      setError(null);
    } else {
      setError("Incorrect password");
    }
  }

  return (
    <main className="bg-alabaster min-h-screen">
      <section className="py-10 md:py-16">
        <Container>
          <h1 className="text-3xl md:text-5xl font-serif text-gunmetal mb-2">
            Profit <span className="text-blue-green">Dashboard</span>
          </h1>
          <p className="text-gunmetal/70 max-w-2xl">
            Internal view of projected returns per investor share. This route is not linked from the
            public site. Calculations mirror the main ROI calculator assumptions: 20% management fee
            and 10% tax on gross revenue, based on 360 nights per year.
          </p>
        </Container>
      </section>

      {!authorized ? (
        <section className="pb-16">
          <Container>
            <div className="max-w-md rounded-xl bg-white shadow border border-gunmetal/10 p-6">
              <h2 className="text-xl font-serif text-gunmetal mb-2">Enter access password</h2>
              <p className="text-sm text-gunmetal/70 mb-4">
                This is a lightweight, front-end only gate intended to keep this page obscure. For
                real security, configure password protection at the hosting layer (e.g. Netlify
                password protection or basic auth).
              </p>
              <form onSubmit={handleUnlock} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gunmetal mb-1" htmlFor="profit-pass">
                    Password
                  </label>
                  <input
                    id="profit-pass"
                    type="password"
                    value={passInput}
                    onChange={(e) => setPassInput(e.target.value)}
                    className="w-full rounded-md border border-gunmetal/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-green/60"
                  />
                  {error && <p className="mt-1 text-xs text-brown">{error}</p>}
                </div>
                <Button type="submit" className="w-full">
                  Unlock
                </Button>
              </form>
            </div>
          </Container>
        </section>
      ) : (
        <section className="pb-16">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 rounded-xl bg-white shadow border border-gunmetal/10 p-6 space-y-4">
                <h2 className="text-xl font-serif text-gunmetal mb-1">Assumptions</h2>

                <div>
                  <label className="block text-sm font-medium text-gunmetal mb-1">Total investment</label>
                  <input
                    type="number"
                    min={0}
                    value={totalInvestment}
                    onChange={(e) => setTotalInvestment(Number(e.target.value) || 0)}
                    className="w-full rounded-md border border-gunmetal/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-green/60"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gunmetal mb-1">Nightly rate</label>
                    <input
                      type="number"
                      min={0}
                      value={nightlyRate}
                      onChange={(e) => setNightlyRate(Number(e.target.value) || 0)}
                      className="w-full rounded-md border border-gunmetal/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-green/60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gunmetal mb-1 whitespace-nowrap">
                      Occupancy (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={occupancy}
                      onChange={(e) => setOccupancy(Number(e.target.value) || 0)}
                      className="w-full rounded-md border border-gunmetal/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-green/60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gunmetal mb-1">Villa qty</label>
                    <input
                      type="number"
                      min={1}
                      value={villaQty}
                      onChange={(e) => setVillaQty(Math.max(1, Number(e.target.value) || 1))}
                      className="w-full rounded-md border border-gunmetal/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-green/60"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-3">
                  <div>
                    <label className="block text-sm font-medium text-gunmetal mb-1">Management fee (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={managementFeePct}
                      onChange={(e) => setManagementFeePct(Number(e.target.value) || 0)}
                      className="w-full rounded-md border border-gunmetal/20 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-green/60"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gunmetal mb-1">Currency</label>
                    <div className="inline-flex rounded-md border border-gunmetal/20 overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setCurrencyMode("AUD")}
                        className={
                          "px-3 py-1 text-sm " +
                          (currencyMode === "AUD"
                            ? "bg-blue-green text-white"
                            : "bg-white text-gunmetal hover:bg-gunmetal/5")
                        }
                      >
                        AUD
                      </button>
                      <button
                        type="button"
                        onClick={() => setCurrencyMode("USD")}
                        className={
                          "px-3 py-1 text-sm border-l border-gunmetal/20 " +
                          (currencyMode === "USD"
                            ? "bg-blue-green text-white"
                            : "bg-white text-gunmetal hover:bg-gunmetal/5")
                        }
                      >
                        USD
                      </button>
                    </div>
                    <div className="mt-1 text-[11px] text-gunmetal/60">
                      {fxLoading
                        ? "Fetching FX…"
                        : fxError
                          ? fxError
                          : `1 USD ≈ ${usdToAud.toFixed(3)} AUD`}
                      {fxUpdatedAt && !fxError && (
                        <span> · {new Date(fxUpdatedAt).toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-[11px] text-gunmetal/60 pt-2">
                  Management fee {managementFeePct}% and tax {TAX_PCT}% are applied to gross revenue
                  before distributions. Nights/year assumed at 360. All amounts shown in {currencyMode}.
                </p>
              </div>

              <div className="lg:col-span-2 rounded-xl bg-white shadow border border-gunmetal/10 p-6 overflow-x-auto">
                <h2 className="text-xl font-serif text-gunmetal mb-4">Total projected returns</h2>

                {!project ? (
                  <p className="text-sm text-brown">Enter a positive total investment to see results.</p>
                ) : (
                  <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-stretch md:justify-between gap-4 md:gap-8 text-sm">
                      {/* Gross column */}
                      <div className="flex-1">
                        <div className="h-full rounded-xl bg-white border border-gunmetal/10 px-4 py-3 md:px-6 md:py-4 flex flex-col sm:flex-row sm:items-start sm:gap-10">
                          <div className="mb-3 sm:mb-0">
                            <p className="text-gunmetal/60 text-xs uppercase tracking-wide">Annual gross</p>
                            <p className="text-gunmetal font-medium text-lg md:text-xl">
                              {formatCurrency(project.annualGross * fx, currencyMode)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gunmetal/60 text-xs uppercase tracking-wide">Monthly gross</p>
                            <p className="text-gunmetal font-medium text-lg md:text-xl">
                              {formatCurrency(project.monthlyGross * fx, currencyMode)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Net pill */}
                      <div className="flex-1">
                        <div className="h-full rounded-xl bg-blue-green/5 border border-blue-green/20 px-4 py-3 md:px-6 md:py-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                          <div>
                            <p className="text-gunmetal/60 text-xs uppercase tracking-wide">Annual net</p>
                            <p className="text-blue-green font-semibold text-lg md:text-xl">
                              {formatCurrency(project.annualNet * fx, currencyMode)}
                            </p>
                          </div>
                          <div>
                            <p className="text-gunmetal/60 text-xs uppercase tracking-wide">Monthly net</p>
                            <p className="text-blue-green font-semibold text-lg md:text-xl">
                              {formatCurrency(project.monthlyNet * fx, currencyMode)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gunmetal/10 pt-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-md font-serif text-gunmetal">Investors</h3>
                        <span className="text-xs text-gunmetal/70">
                          Allocated: {totalPct.toFixed(2)}% (
                          {formatCurrency(totalInvested * fx, currencyMode)})
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead>
                            <tr className="border-b border-gunmetal/10 text-left text-xs uppercase tracking-wide text-gunmetal/60">
                              <th className="py-2 pr-4">Name</th>
                              <th className="py-2 pr-4">Investment</th>
                              <th className="py-2 pr-4 whitespace-nowrap">Share %</th>
                              <th className="py-2 pr-4 whitespace-nowrap">Monthly net</th>
                              <th className="py-2 pr-4 whitespace-nowrap">Annual net</th>
                              <th className="py-2 pr-4 whitespace-nowrap">Annual ROI %</th>
                              <th className="py-2"></th>
                            </tr>
                          </thead>
                          <tbody>
                            {investorRows.map((row, idx) => (
                              <tr key={row.investor.id} className="border-b border-gunmetal/5">
                                <td className="py-2 pr-4">
                                  <input
                                    type="text"
                                    value={row.investor.name}
                                    onChange={(e) =>
                                      setInvestors((prev) =>
                                        prev.map((inv) =>
                                          inv.id === row.investor.id ? { ...inv, name: e.target.value } : inv
                                        )
                                      )
                                    }
                                    className="w-full rounded-md border border-gunmetal/20 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-green/60"
                                  />
                                </td>
                                <td className="py-2 pr-4">
                                  <input
                                    type="number"
                                    min={0}
                                    value={row.investor.amount}
                                    onChange={(e) => {
                                      const raw = Number(e.target.value) || 0;
                                      setInvestors((prev) => {
                                        const othersTotal = prev.reduce(
                                          (sum, inv) =>
                                            inv.id === row.investor.id ? sum : sum + (inv.amount || 0),
                                          0
                                        );
                                        const maxForThis = Math.max(0, totalInvestment - othersTotal);
                                        const nextAmount = Math.min(raw, maxForThis);
                                        return prev.map((inv) =>
                                          inv.id === row.investor.id ? { ...inv, amount: nextAmount } : inv
                                        );
                                      });
                                    }}
                                    className="w-full rounded-md border border-gunmetal/20 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-green/60"
                                  />
                                </td>
                                <td className="py-2 pr-4 text-gunmetal/80">
                                  {row.sharePct.toFixed(2)}%
                                </td>
                                <td className="py-2 pr-4 text-gunmetal">
                                  {formatCurrency(row.monthlyNet * fx, currencyMode)}
                                </td>
                                <td className="py-2 pr-4 text-gunmetal">
                                  {formatCurrency(row.annualNet * fx, currencyMode)}
                                </td>
                                <td className="py-2 pr-4 text-gunmetal/80">
                                  {row.investor.amount > 0
                                    ? ((row.annualNet / row.investor.amount) * 100).toFixed(2)
                                    : "—"}
                                  %
                                </td>
                                <td className="py-2 text-right">
                                  {investors.length > 1 && (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setInvestors((prev) => prev.filter((inv) => inv.id !== row.investor.id))
                                      }
                                      className="text-xs text-brown hover:underline"
                                    >
                                      Remove
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <Button
                          type="button"
                          variant="secondary"
                          onClick={() =>
                            setInvestors((prev) => {
                              const nextId = prev.reduce((max, inv) => Math.max(max, inv.id), 0) + 1;
                              return [
                                ...prev,
                                { id: nextId, name: `Investor ${nextId}`, amount: 0 },
                              ];
                            })
                          }
                        >
                          Add investor
                        </Button>
                        <span
                          className={
                            "text-xs " +
                            (totalPct > 100 ? "text-brown" : totalPct === 100 ? "text-blue-green" : "text-gunmetal/70")
                          }
                        >
                          {totalPct.toFixed(2)}% of capital allocated
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Container>
        </section>
      )}
    </main>
  );
}
