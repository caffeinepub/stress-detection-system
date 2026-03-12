import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface StressPredictionGraphProps {
  currentStressLevel: "Low" | "Medium" | "High";
}

interface DayEntry {
  day: string;
  value: number;
  level: "Low" | "Medium" | "High";
}

const levelToNum: Record<string, number> = { Low: 0, Medium: 1, High: 2 };
const numToLabel: Record<number, string> = { 0: "Low", 1: "Medium", 2: "High" };

const barColors: Record<string, string> = {
  Low: "#22c55e",
  Medium: "#f59e0b",
  High: "#ef4444",
};

const LEVELS: ("Low" | "Medium" | "High")[] = ["Low", "Medium", "High"];

function CustomTooltip({
  active,
  payload,
  label,
}: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (active && payload && payload.length) {
    const level = numToLabel[payload[0].value];
    return (
      <div className="bg-card border border-border rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs font-semibold text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground mt-0.5">
          Stress Level:{" "}
          <span className="font-bold text-foreground">{level}</span>
        </p>
      </div>
    );
  }
  return null;
}

export default function StressPredictionGraph({
  currentStressLevel,
}: StressPredictionGraphProps) {
  const data = useMemo<DayEntry[]>(() => {
    const entries: DayEntry[] = [];
    for (let i = 1; i <= 7; i++) {
      let level: "Low" | "Medium" | "High";
      if (i === 7) {
        level = currentStressLevel;
      } else {
        level = LEVELS[Math.floor(Math.random() * LEVELS.length)];
      }
      entries.push({ day: `Day ${i}`, value: levelToNum[level], level });
    }
    return entries;
  }, [currentStressLevel]);

  return (
    <div
      data-ocid="graph.section"
      className="bg-card border border-border rounded-2xl shadow-sm p-6"
    >
      <div className="mb-5">
        <h2 className="text-base font-bold text-foreground">
          Stress Level Over Time
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          7-day stress prediction history
        </p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          margin={{ top: 5, right: 10, left: 0, bottom: 5 }}
        >
          <XAxis
            dataKey="day"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 2]}
            ticks={[0, 1, 2]}
            tickFormatter={(v) => numToLabel[v]}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            axisLine={false}
            tickLine={false}
            width={52}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: "var(--muted)", opacity: 0.5 }}
          />
          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            maxBarSize={40}
            data-ocid="graph.chart_point"
          >
            {data.map((entry) => (
              <Cell key={entry.day} fill={barColors[entry.level]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Legend */}
      <div className="flex items-center gap-4 mt-3 justify-center">
        {(["Low", "Medium", "High"] as const).map((level) => (
          <div key={level} className="flex items-center gap-1.5">
            <span
              className="w-2.5 h-2.5 rounded-full inline-block"
              style={{ backgroundColor: barColors[level] }}
            />
            <span className="text-xs text-muted-foreground">{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
