"use client";

import { useState } from "react";
import { TrendingUp } from "lucide-react";

export type TimeDataPoint = {
  day: string;
  count: number;
};

const DEFAULT_DATA: TimeDataPoint[] = [
  { day: "Mon", count: 12 },
  { day: "Tue", count: 45 },
  { day: "Wed", count: 32 },
  { day: "Thu", count: 62 },
  { day: "Fri", count: 85 },
  { day: "Sat", count: 40 },
  { day: "Sun", count: 10 },
];

type JobsOverTimeChartProps = {
  data?: TimeDataPoint[];
};

export function JobsOverTimeChart({
  data = DEFAULT_DATA,
}: JobsOverTimeChartProps) {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // SVG dimensions
  const vbWidth = 720;
  const vbHeight = 260;
  const plotLeft = 40;
  const plotRight = 700;
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

  // Compute (x, y) coordinates for each data point
  const points = data.map((item, idx) => {
    const x = plotLeft + (idx / Math.max(data.length - 1, 1)) * plotWidth;
    const y = plotBottom - (item.count / maxVal) * plotHeight;
    return { x, y, ...item };
  });

  // Generate smooth cubic bezier curve through points
  const generateSmoothPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let d = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(i - 1, 0)];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = pts[Math.min(i + 2, pts.length - 1)];

      // Tension factor for Catmull-Rom to Cubic Bezier
      const tension = 0.2;
      const cp1x = p1.x + (p2.x - p0.x) * tension;
      const cp1y = p1.y + (p2.y - p0.y) * tension;
      const cp2x = p2.x - (p3.x - p1.x) * tension;
      const cp2y = p2.y - (p3.y - p1.y) * tension;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${p2.x} ${p2.y}`;
    }

    return d;
  };

  const linePath = generateSmoothPath(points);
  const areaPath = `${linePath} L ${points[points.length - 1].x} ${plotBottom} L ${points[0].x} ${plotBottom} Z`;

  return (
    <div className="bg-surface border border-border rounded-2xl p-6 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-text-primary">
          Jobs Found Over Time
        </h3>
        {hoveredIdx !== null && (
          <span className="text-xs font-medium text-accent bg-accent-muted px-2.5 py-0.5 rounded-full border border-accent/20">
            {data[hoveredIdx].day}: {data[hoveredIdx].count} jobs found
          </span>
        )}
      </div>

      {totalCount === 0 ? (
        <div className="relative w-full h-[260px] flex flex-col items-center justify-center text-center">
          <div className="w-10 h-10 rounded-full bg-accent-muted text-accent flex items-center justify-center mb-3">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-sm font-medium text-text-primary">No jobs discovered yet</p>
          <p className="text-xs text-text-muted mt-1 max-w-[260px]">
            Run job discovery to track your matching velocity and pipeline trends over time.
          </p>
        </div>
      ) : (
        <div className="relative w-full h-[260px] select-none">
          <svg
            viewBox={`0 0 ${vbWidth} ${vbHeight}`}
            className="w-full h-full overflow-visible"
          >
          <defs>
            <linearGradient id="jobsCurveGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
              <stop offset="60%" stopColor="var(--color-accent)" stopOpacity="0.08" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

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

          {/* Area fill under curve */}
          <path d={areaPath} fill="url(#jobsCurveGradient)" />

          {/* Smooth curved line */}
          <path
            d={linePath}
            fill="none"
            stroke="var(--color-accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Data points & X-axis labels */}
          {points.map((pt, idx) => {
            const isHovered = hoveredIdx === idx;
            const slotWidth = plotWidth / (points.length - 1);

            return (
              <g
                key={pt.day}
                className="cursor-pointer"
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* Hitbox column for hover detection */}
                <rect
                  x={pt.x - slotWidth / 2}
                  y={plotTop}
                  width={slotWidth}
                  height={plotHeight}
                  fill="transparent"
                />

                {/* Vertical guideline on hover */}
                {isHovered && (
                  <line
                    x1={pt.x}
                    y1={plotTop}
                    x2={pt.x}
                    y2={plotBottom}
                    stroke="var(--color-accent)"
                    strokeDasharray="2 2"
                    strokeWidth="1.5"
                    strokeOpacity="0.5"
                  />
                )}

                {/* Point circle (always rendered when hovered, or subtle) */}
                {isHovered && (
                  <g>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={7}
                      fill="var(--color-accent-light)"
                    />
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={4}
                      fill="var(--color-accent)"
                    />
                  </g>
                )}

                {/* X-axis label */}
                <text
                  x={pt.x}
                  y={plotBottom + 20}
                  textAnchor="middle"
                  className={`text-[12px] transition-colors ${
                    isHovered
                      ? "fill-text-primary font-semibold"
                      : "fill-text-muted font-normal"
                  }`}
                >
                  {pt.day}
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
