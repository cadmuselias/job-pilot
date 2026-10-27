"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";

export type DistributionBucket = {
  range: string;
  count: number;
};

const DEFAULT_DISTRIBUTION: DistributionBucket[] = [
  { range: "50-60%", count: 5 },
  { range: "60-70%", count: 15 },
  { range: "70-80%", count: 45 },
  { range: "80-90%", count: 85 },
  { range: "90-100%", count: 35 },
];

type ScoreDistributionChartProps = {
  data?: DistributionBucket[];
};

export function ScoreDistributionChart({
  data = DEFAULT_DISTRIBUTION,
}: ScoreDistributionChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG viewBox dimensions
  const vbWidth = 440;
  const vbHeight = 260;
  const plotLeft = 32;
  const plotRight = 420;
  const plotTop = 20;
  const plotBottom = 220;
  const plotWidth = plotRight - plotLeft;
  const plotHeight = plotBottom - plotTop;

  const totalCount = data.reduce((acc, d) => acc + d.count, 0);
  const computedMax = Math.max(...data.map((d) => d.count), 0);
  const maxVal = computedMax > 0 ? Math.max(Math.ceil(computedMax * 1.25), 4) : 100;
  const yTicks = [
    maxVal,
    Math.round(maxVal * 0.75),
    Math.round(maxVal * 0.5),
    Math.round(maxVal * 0.25),
    0,
  ];

  const slotWidth = plotWidth / (data.length || 1);
  const barWidth = 26;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text-primary">
          Match Score Distribution
        </h3>
        {hoveredIdx !== null && (
          <span className="text-xs font-medium text-success bg-success-lightest px-2.5 py-0.5 rounded-full border border-success-light">
            {data[hoveredIdx].range}: {data[hoveredIdx].count} jobs
          </span>
        )}
      </div>

      {totalCount === 0 ? (
        <div className="relative w-full h-[260px] flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-success-lightest text-success flex items-center justify-center mb-3">
            <BarChart3 className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-text-primary">No match scores yet</p>
          <p className="text-xs text-text-muted mt-1 max-w-[240px]">
            Scored roles from your job discovery runs will appear in this distribution.
          </p>
        </div>
      ) : (
        <div className="relative w-full h-[260px] select-none">
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
                  x={plotLeft - 8}
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
            const xCenter = plotLeft + idx * slotWidth + slotWidth / 2;
            const xPos = xCenter - barWidth / 2;
            const yPos = plotBottom - barHeight;
            const isHovered = hoveredIdx === idx;

            return (
              <g
                key={item.range}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Hitbox */}
                <rect
                  x={plotLeft + idx * slotWidth}
                  y={plotTop}
                  width={slotWidth}
                  height={plotHeight}
                  fill="transparent"
                />

                {/* Visible Bar */}
                <rect
                  x={xPos}
                  y={yPos}
                  width={barWidth}
                  height={Math.max(barHeight, 3)}
                  rx={4}
                  ry={4}
                  fill={isHovered ? "var(--color-success-alt)" : "var(--color-success)"}
                  className="transition-all duration-200"
                />

                {/* X-axis Label */}
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
                  {item.range}
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
