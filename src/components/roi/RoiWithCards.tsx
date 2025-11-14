"use client";

import { useState } from "react";
import ROICalculator, { ROICalculatorProps } from "./ROICalculator";

export type RoiWithCardsProps = Omit<ROICalculatorProps,
  | "className"
  | "onChange"
> & {
  className?: string;
  location: string;
  configuration: string;
  leaseYears?: number;
};

export default function RoiWithCards({
  className,
  location,
  configuration,
  leaseYears = 25,
  ...calcProps
}: RoiWithCardsProps) {
  const [roi, setRoi] = useState<number | null>(null);

  return (
    <div className={className}>
      <ROICalculator
        {...calcProps}
        onChange={(d) => setRoi(d.roi)}
      />

      <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-serif text-lg text-gunmetal mb-1">Annual ROI</h3>
          <p className="text-blue-green font-medium">{roi !== null ? `${roi.toFixed(2)}%` : `—`}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-serif text-lg text-gunmetal mb-1">Lease Hold</h3>
          <p className="text-gunmetal/80">{leaseYears} years</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-serif text-lg text-gunmetal mb-1">Location</h3>
          <p className="text-gunmetal/80">{location}</p>
        </div>
        <div className="bg-white rounded-lg p-6 shadow">
          <h3 className="font-serif text-lg text-gunmetal mb-1">Configuration</h3>
          <p className="text-gunmetal/80">{configuration}</p>
        </div>
      </div>
    </div>
  );
}
