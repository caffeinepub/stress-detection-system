import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { jsPDF } from "jspdf";
import { Download, FileText } from "lucide-react";

export interface StressReportProps {
  detectionMethod: string;
  detectedEmotion: string;
  stressLevel: "Low" | "Medium" | "High";
  confidenceScore: number;
  possibleCauses: string[];
  recommendedActions: string[];
  timestamp?: Date;
}

interface HistoryEntry {
  day: string;
  level: "Low" | "Medium" | "High";
}

const stressLevelColors = {
  Low: "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700",
  Medium:
    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-700",
  High: "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700",
};

function generateSimulatedHistory(
  currentLevel: "Low" | "Medium" | "High",
): HistoryEntry[] {
  const levels: ("Low" | "Medium" | "High")[] = ["Low", "Medium", "High"];
  const data: HistoryEntry[] = [];
  for (let i = 1; i <= 7; i++) {
    if (i === 7) {
      data.push({ day: `Day ${i}`, level: currentLevel });
    } else {
      data.push({
        day: `Day ${i}`,
        level: levels[Math.floor(Math.random() * levels.length)],
      });
    }
  }
  return data;
}

export default function StressReport({
  detectionMethod,
  detectedEmotion,
  stressLevel,
  confidenceScore,
  possibleCauses,
  recommendedActions,
  timestamp,
}: StressReportProps) {
  const ts = timestamp ?? new Date();
  const formattedDate = ts.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const formattedTime = ts.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const history = generateSimulatedHistory(stressLevel);

    // Header
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text("Stress Analysis Report", 20, 20);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated: ${formattedDate} at ${formattedTime}`, 20, 30);

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);

    let y = 45;
    const lineH = 8;

    const addRow = (label: string, value: string) => {
      doc.setFont("helvetica", "bold");
      doc.text(`${label}:`, 20, y);
      doc.setFont("helvetica", "normal");
      doc.text(value, 80, y);
      y += lineH;
    };

    addRow("Detection Method", detectionMethod);
    addRow("Detected Emotion", detectedEmotion);
    addRow("Stress Level", stressLevel);
    addRow("Confidence Score", `${Math.round(confidenceScore * 100)}%`);

    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Possible Causes:", 20, y);
    y += lineH;
    doc.setFont("helvetica", "normal");
    for (const cause of possibleCauses) {
      doc.text(`\u2022 ${cause}`, 25, y);
      y += lineH;
    }

    y += 4;
    doc.setFont("helvetica", "bold");
    doc.text("Suggested Actions:", 20, y);
    y += lineH;
    doc.setFont("helvetica", "normal");
    for (const action of recommendedActions) {
      doc.text(`\u2022 ${action}`, 25, y);
      y += lineH;
    }

    // Graph data
    y += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.text("Stress Level Over Time (7-Day History)", 20, y);
    y += 10;

    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Day", 20, y);
    doc.text("Stress Level", 60, y);
    y += 6;
    doc.setLineWidth(0.3);
    doc.line(20, y, 150, y);
    y += 6;

    doc.setFont("helvetica", "normal");
    for (const entry of history) {
      doc.text(entry.day, 20, y);
      doc.text(entry.level, 60, y);
      y += 7;
    }

    const filename = `stress-report-${ts.getTime()}.pdf`;
    doc.save(filename);
  };

  return (
    <div
      data-ocid="report.section"
      className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden"
    >
      {/* Report Header */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              Stress Analysis Report
            </h2>
            <p className="text-teal-100 text-xs mt-0.5">
              {formattedDate} · {formattedTime}
            </p>
          </div>
        </div>
      </div>

      <div className="px-6 py-5 space-y-5">
        {/* Key Metrics */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/40 rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">
              Detection Method
            </p>
            <p className="text-sm font-semibold text-foreground">
              {detectionMethod}
            </p>
          </div>
          <div className="bg-muted/40 rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">
              Detected Emotion
            </p>
            <p className="text-sm font-semibold text-foreground capitalize">
              {detectedEmotion}
            </p>
          </div>
          <div className="bg-muted/40 rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-medium mb-2">
              Stress Level
            </p>
            <span
              className={`inline-block px-3 py-1 rounded-full text-xs font-bold border ${stressLevelColors[stressLevel]}`}
            >
              {stressLevel}
            </span>
          </div>
          <div className="bg-muted/40 rounded-xl p-4">
            <p className="text-xs text-muted-foreground font-medium mb-1">
              Confidence Score
            </p>
            <p className="text-2xl font-extrabold text-teal-600 dark:text-teal-400">
              {Math.round(confidenceScore * 100)}%
            </p>
          </div>
        </div>

        <Separator />

        {/* Possible Causes */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Possible Causes
          </h3>
          <ul className="space-y-2">
            {possibleCauses.map((cause) => (
              <li
                key={cause}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="text-teal-500 mt-0.5 flex-shrink-0">•</span>
                <span>{cause}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Recommended Actions */}
        <div>
          <h3 className="text-sm font-semibold text-foreground mb-3">
            Suggested Actions
          </h3>
          <ul className="space-y-2">
            {recommendedActions.map((action) => (
              <li
                key={action}
                className="flex items-start gap-2 text-sm text-muted-foreground"
              >
                <span className="text-teal-500 mt-0.5 flex-shrink-0">→</span>
                <span>{action}</span>
              </li>
            ))}
          </ul>
        </div>

        <Separator />

        {/* Download Button */}
        <Button
          data-ocid="report.download_button"
          onClick={handleDownloadPDF}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white gap-2"
        >
          <Download className="w-4 h-4" />
          Download Stress Report (PDF)
        </Button>
      </div>
    </div>
  );
}
