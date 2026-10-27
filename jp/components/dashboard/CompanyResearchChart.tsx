"use client";

import { useState } from "react";
import { Building2 } from "lucide-react";

export type DayActivity = {
  day: string;
  count: number;
};

const DEFAULT_DATA: DayActivity[] = [
  { day: "Mon", count: 2 },
  { day: "Tue", count: 5 },
  { day: "Wed", count: 3 },
  { day: "Thu", count: 8 },
  { day: "Fri", count: 12 },
  { day: "Sat", count: 4 },
  { day: "Sun", count: 1 },
];

type CompanyResearchChartProps = {
  data?: DayActivity[];
};

export function CompanyResearchChart({
  data = DEFAULT_DATA,
}: CompanyResearchChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG ViewBox dimensions
  const vbWidth = 520;
  const vbHeight = 240;
  const plotLeft = 32;
  const plotRight = 500;
  const plotTop = 20;
  const plotBottom = 200;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  const totalCount = data.reduce((acc, d) => acc + d.count, 0);
  const computedMax = Math.max(...data.map((d) => d.count), 0);
  const maxVal = computedMax > 0 ? Math.max(Math.ceil(computedMax * 1.25), 4) : 12;
  const yTicks = [
    maxVal,
    Math.round(maxVal * 0.75),
    Math.round(maxVal * 0.5),
    Math.round(maxVal * 0.25),
    0,
  ];

  const daySlotWidth = plotWidth / (data.length || 1);
  const barWidth = 28;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text-primary">
          Company Research Activity
        </h3>
        {hoveredIdx !== null && (
          <span className="text-xs font-medium text-info bg-info-lightest px-2.5 py-0.5 rounded-full border border-info-light">
            {data[hoveredIdx].day}: {data[hoveredIdx].count} researched
          </span>
        )}
      </div>

      {totalCount === 0 ? (
        <div className="relative w-full h-[240px] flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-info-lightest text-info flex items-center justify-center mb-3">
            <Building2 className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-text-primary">No company research yet</p>
          <p className="text-xs text-text-muted mt-1 max-w-[240px]">
            Research companies from your job details to see your weekly activity breakdown.
          </p>
        </div>
      ) : (
        <div className="relative w-full h-[240px] select-none">
          <svg
            viewBox={`0 0 ${vbWidth} ${vbHeight}`}
            className="w-full h-full overflow-visible"
          >
          {/* Dashed horizontal gridlines & Y-axis labels */}
          {yTicks.map((val) => {
            const yPos = plotTop + (1 - val / maxVal) * plotHeight;
            return (
              <g key={val}>
                <text
                  x={plotLeft - 10}
                  y={yPos + 4}
                  textAnchor="end"
                  className="fill-text-muted text-[12px] font-normal"
                >
                  {val}
                </text>
                <line
                  x1={plotLeft}
                  y1={yPos}
                  x2={plotRight}
                  y2={yPos}
                  stroke="var(--color-border)"
                  strokeDasharray="4 4"
                  strokeWidth="1"
                />
              </g>
            );
          })}

          {/* Bars */}
          {data.map((item, idx) => {
            const barHeight = (item.count / maxVal) * plotHeight;
            const xCenter = plotLeft + idx * daySlotWidth + daySlotWidth / 2;
            const xPos = xCenter - barWidth / 2;
            const yPos = plotBottom - barHeight;
            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={item.day}
                className="cursor-pointer transition-transform"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Invisible hover hitbox */}
                <rect
                  x={plotLeft + idx * daySlotWidth}
                  y={plotTop}
                  width={daySlotWidth}
                  height={plotHeight}
                  fill="transparent"
                />

                {/* Visible bar with rounded top */}
                <rect
                  x={xPos}
                  y={yPos}
                  width={barWidth}
                  height={Math.max(barHeight, 3)}
                  rx={4}
                  ry={4}
                  fill={isHovered ? "var(--color-info-medium)" : "var(--color-info)"}
                  className="transition-all duration-200"
                />

                {/* X-axis label */}
                <text
                  x={xCenter}
                  y={plotBottom + 20}
                  textAnchor="middle"
                  className={`text-[12px] transition-colors ${
                    isHovered
                      ? "fill-text-primary font-semibold"
                      : "fill-text-muted font-normal"
                  }`}
                >
                  {item.day}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    )}
  </div>
);
}
