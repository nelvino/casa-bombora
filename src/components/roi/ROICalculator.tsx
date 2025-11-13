"use client";

import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils/cn";

export type ROICalculatorProps = {
  className?: string;
  // USD ranges
  investmentMin: number;
  investmentMax: number;
  defaultInvestment: number;
  rateMin: number;
  rateMax: number;
  defaultRate: number;
  occupancyMin: number; // expressed in 0-1 range when passed in props? We'll accept percent (0-100)
  occupancyMax: number; // percent
  defaultOccupancy: number; // percent
  managementFeeDefault?: number; // percent
  managementFeeMin?: number; // percent
  managementFeeMax?: number; // percent
  taxPercent?: number; // percent
  currency?: string;
  enableCurrencyToggle?: boolean;
  onChange?: (data: {
    annualGross: number;
    managementFee: number;
    tax: number;
    annualNet: number;
    roi: number;
    paybackYears: number;
  }) => void;
};

function formatCurrency(n: number, currency = "USD") {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${Math.round(n).toLocaleString()}`;
  }
}

export function ROICalculator({
  className,
  investmentMin,
  investmentMax,
  defaultInvestment,
  rateMin,
  rateMax,
  defaultRate,
  occupancyMin,
  occupancyMax,
  defaultOccupancy,
  managementFeeDefault = 20,
  managementFeeMin = 15,
  managementFeeMax = 25,
  taxPercent = 10,
  currency = "USD",
  enableCurrencyToggle = true,
  onChange,
}: ROICalculatorProps) {
  const [investment, setInvestment] = useState<number>(defaultInvestment);
  const [rate, setRate] = useState<number>(defaultRate);
  const [occupancy, setOccupancy] = useState<number>(defaultOccupancy); // percent 0-100
  const [mgmtFee, setMgmtFee] = useState<number>(managementFeeDefault); // percent
  const [currencyMode, setCurrencyMode] = useState<"USD" | "AUD">("USD");
  const [usdToAud, setUsdToAud] = useState<number>(1);
  const [fxLoading, setFxLoading] = useState<boolean>(false);
  const [fxError, setFxError] = useState<string | null>(null);
  const [fxUpdatedAt, setFxUpdatedAt] = useState<string | null>(null);

  // For hospitality ROI, we'll assume 30 days/month and 12 months, aligning to provided sheet (360 nights/year)
  const NIGHTS_PER_YEAR = 30 * 12;

  // Fetch live USD->AUD conversion when toggling is enabled
  useEffect(() => {
    if (!enableCurrencyToggle) return;
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
        } catch (e: any) {
          // continue to next provider
        }
      }
      if (!cancelled) {
        setFxLoading(false);
        setFxError("Rate unavailable");
      }
    }
    fetchRate();
    // Optionally refresh every 12h
    const id = setInterval(fetchRate, 12 * 60 * 60 * 1000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [enableCurrencyToggle]);

  const fx = currencyMode === "AUD" ? usdToAud : 1;

  const calc = useMemo(() => {
    const occupancyRatio = Math.max(0, Math.min(1, occupancy / 100));

    const annualGross = rate * occupancyRatio * NIGHTS_PER_YEAR;
    const managementFee = (mgmtFee / 100) * annualGross;
    const tax = (taxPercent / 100) * annualGross;
    const annualNet = annualGross - managementFee - tax;

    const roi = investment > 0 ? (annualNet / investment) * 100 : 0;
    const paybackYears = annualNet > 0 ? investment / annualNet : Infinity;

    return { annualGross, managementFee, tax, annualNet, roi, paybackYears };
  }, [rate, occupancy, mgmtFee, taxPercent, investment]);

  // Notify parent when derived values change
  useEffect(() => {
    if (onChange) onChange(calc);
  }, [calc, onChange]);

  return (
    <div
      className={cn(
        "rounded-xl bg-white shadow border border-gunmetal/10 overflow-hidden", 
        className
      )}
    >
      <div className="p-6 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h3 className="text-2xl font-serif text-gunmetal">ROI Calculator</h3>
            <p className="text-gunmetal/70 mt-1">Adjust the assumptions to project your returns.</p>

            {/* Inputs */}
            <div className="mt-6 space-y-6">
              <LabeledSlider
                label="Total Investment"
                prefix={currencyMode === "USD" ? "$" : "A$"}
                min={Math.round(investmentMin * fx)}
                max={Math.round(investmentMax * fx)}
                step={1000}
                value={Math.round(investment * fx)}
                onChange={(v) => setInvestment(v / fx)}
              />

              <LabeledSlider
                label="Rent per Night"
                prefix={currencyMode === "USD" ? "$" : "A$"}
                min={Math.round(rateMin * fx)}
                max={Math.round(rateMax * fx)}
                step={1}
                value={Math.round(rate * fx)}
                onChange={(v) => setRate(v / fx)}
              />

              <LabeledSlider
                label="Occupancy"
                suffix="%"
                min={occupancyMin}
                max={occupancyMax}
                step={1}
                value={occupancy}
                onChange={setOccupancy}
              />

              <LabeledSlider
                label="Management Fee"
                suffix="%"
                min={managementFeeMin}
                max={managementFeeMax}
                step={1}
                value={mgmtFee}
                onChange={setMgmtFee}
              />

              {enableCurrencyToggle && (
                <div className="flex items-center gap-2 pt-2">
                  <span className="text-sm text-gunmetal/70">Currency</span>
                  <div className="inline-flex rounded-md border border-gunmetal/20 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setCurrencyMode("USD")}
                      className={cn(
                        "px-3 py-1 text-sm",
                        currencyMode === "USD" ? "bg-blue-green text-white" : "bg-white text-gunmetal hover:bg-gunmetal/5"
                      )}
                    >
                      USD
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrencyMode("AUD")}
                      className={cn(
                        "px-3 py-1 text-sm border-l border-gunmetal/20",
                        currencyMode === "AUD" ? "bg-blue-green text-white" : "bg-white text-gunmetal hover:bg-gunmetal/5"
                      )}
                    >
                      AUD
                    </button>
                  </div>
                  {currencyMode === "AUD" && (
                    fxLoading ? (
                      <span className="text-xs text-gunmetal/60">Fetching rate…</span>
                    ) : fxError ? (
                      <span className="text-xs text-brown">{fxError}. Set custom rate:</span>
                    ) : (
                      <span className="text-xs text-gunmetal/60">Live rate: 1 USD = {usdToAud.toFixed(3)} AUD{fxUpdatedAt ? ` · ${new Date(fxUpdatedAt).toLocaleDateString()}` : ''}</span>
                    )
                  )}
                  {currencyMode === "AUD" && fxError && (
                    <input
                      type="number"
                      step="0.001"
                      min={0}
                      value={usdToAud}
                      onChange={(e) => setUsdToAud(Math.max(0, Number(e.target.value) || 0))}
                      className="ml-2 w-24 h-7 rounded border border-gunmetal/20 px-2 text-xs"
                    />
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-alabaster rounded-lg p-5 md:p-6 border border-gunmetal/10">
            <div className="text-center">
              <p className="text-sm tracking-wide uppercase text-gunmetal/60">Annual ROI</p>
              <p className="mt-1 text-4xl md:text-5xl font-serif text-blue-green">{calc.roi.toFixed(2)}%</p>
              <p className="text-xs text-gunmetal/60 mt-1">Payback: {Number.isFinite(calc.paybackYears) ? calc.paybackYears.toFixed(2) + " yrs" : "—"}</p>
            </div>

            <div className="mt-6 space-y-3 text-sm">
              <Row label="Annual Gross Income" value={formatCurrency(calc.annualGross * fx, currencyMode)} />
              <Row label={`Management Fee (${mgmtFee}% )`} value={formatCurrency(calc.managementFee * fx, currencyMode)} negative />
              <Row label={`Tax (${taxPercent}% )`} value={formatCurrency(calc.tax * fx, currencyMode)} negative />
              <div className="h-px bg-gunmetal/10 my-2" />
              <Row label="Annual Net Income" value={formatCurrency(calc.annualNet * fx, currencyMode)} highlight />
            </div>

            <p className="text-[11px] text-gunmetal/60 mt-4">Estimates only. Nights/year assumed at 360 to reflect 30 days × 12 months.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, negative, highlight }: { label: string; value: string; negative?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={cn("text-gunmetal/80", highlight && "text-gunmetal font-medium")}>{label}</span>
      <span className={cn("font-medium", negative ? "text-brown" : highlight ? "text-blue-green" : "text-gunmetal")}>{value}</span>
    </div>
  );
}

function LabeledSlider({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
  prefix,
  suffix,
}: {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (v: number) => void;
  prefix?: string;
  suffix?: string;
}) {
  const pct = max > min ? ((value - min) / (max - min)) * 100 : 0;
  return (
    <div>
      <div className="flex items-end justify-between">
        <label className="block text-sm font-medium text-gunmetal">{label}</label>
        <span className="text-sm text-gunmetal px-2 py-0.5 rounded-full border border-blue-green/30 bg-alabaster/60 font-medium">
          {prefix}{value.toLocaleString()} {suffix}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-green"
        style={{
          background: `linear-gradient(to right, #445464 0%, #445464 ${pct}%, #e5e7eb ${pct}%, #e5e7eb 100%)`,
        }}
      />
      <div className="flex justify-between text-[11px] text-gunmetal/60 mt-1">
        <span>
          {prefix}{min.toLocaleString()} {suffix}
        </span>
        <span>
          {prefix}{max.toLocaleString()} {suffix}
        </span>
      </div>
    </div>
  );
}

export default ROICalculator;
