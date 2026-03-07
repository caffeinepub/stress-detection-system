import {
  Brain,
  Dumbbell,
  HeartHandshake,
  Leaf,
  Moon,
  Smile,
  Star,
  Users,
  Wind,
} from "lucide-react";

interface Suggestion {
  icon: React.ElementType;
  category: string;
  tip: string;
  iconClass: string;
}

const STRESSED_SUGGESTIONS: Suggestion[] = [
  {
    icon: Wind,
    category: "Breathing Exercise",
    tip: "Try the 4-7-8 technique: inhale for 4 seconds, hold for 7, exhale slowly for 8. Repeat 3–4 times to activate your parasympathetic nervous system.",
    iconClass: "bg-sky-100 text-sky-600 dark:bg-sky-900/30 dark:text-sky-300",
  },
  {
    icon: Dumbbell,
    category: "Physical Activity",
    tip: "A 10-minute brisk walk or light stretching can lower cortisol levels significantly. Even standing up and moving helps reset your nervous system.",
    iconClass:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    icon: Brain,
    category: "Mindfulness & Grounding",
    tip: "Use the 5-4-3-2-1 technique: name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste. This anchors you in the present.",
    iconClass:
      "bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-300",
  },
  {
    icon: Moon,
    category: "Rest & Sleep",
    tip: "Avoid screens 30 minutes before bed. Keep a consistent sleep schedule — even on weekends. Quality sleep is the most effective stress recovery tool.",
    iconClass:
      "bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300",
  },
  {
    icon: Users,
    category: "Social Support",
    tip: "Share what you're feeling with someone you trust. Social connection is one of the strongest buffers against chronic stress.",
    iconClass:
      "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-300",
  },
  {
    icon: HeartHandshake,
    category: "Professional Support",
    tip: "If stress feels persistent, consider speaking with a counselor or mental health professional. Seeking help is a sign of strength.",
    iconClass:
      "bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300",
  },
];

const NOT_STRESSED_SUGGESTIONS: Suggestion[] = [
  {
    icon: Smile,
    category: "Keep It Up",
    tip: "Your current state looks calm and balanced. Maintain this by continuing regular physical activity, good sleep habits, and moments of mindfulness throughout your day.",
    iconClass:
      "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    icon: Leaf,
    category: "Preventive Wellness",
    tip: "Even when stress-free, short daily mindfulness sessions (5–10 minutes) build resilience so your nervous system handles future stressors more effectively.",
    iconClass:
      "bg-teal-100 text-teal-600 dark:bg-teal-900/30 dark:text-teal-300",
  },
  {
    icon: Star,
    category: "Sustain Your Balance",
    tip: "Journaling, gratitude practices, and regular social connection are proven habits that help maintain low stress. Consider incorporating one new habit this week.",
    iconClass:
      "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300",
  },
];

interface Props {
  isStressed: boolean;
  method: "text" | "facial" | "voice";
  confidence: number;
}

export default function StressManagementSuggestions({
  isStressed,
  confidence,
}: Props) {
  const suggestions = isStressed
    ? STRESSED_SUGGESTIONS
    : NOT_STRESSED_SUGGESTIONS;
  const confidencePercent = Math.round(confidence * 100);

  return (
    <div
      data-ocid="stress-suggestions.panel"
      className={`rounded-2xl border-2 p-6 ${
        isStressed
          ? "bg-amber-50/80 dark:bg-amber-950/15 border-amber-200 dark:border-amber-800"
          : "bg-emerald-50/80 dark:bg-emerald-950/15 border-emerald-200 dark:border-emerald-800"
      }`}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm ${
              isStressed
                ? "bg-amber-100 dark:bg-amber-900/30"
                : "bg-emerald-100 dark:bg-emerald-900/30"
            }`}
          >
            {isStressed ? "⚠" : "✓"}
          </div>
          <h3
            className={`font-display text-lg font-bold ${
              isStressed
                ? "text-amber-800 dark:text-amber-300"
                : "text-emerald-800 dark:text-emerald-300"
            }`}
          >
            {isStressed
              ? "Stress Management Suggestions"
              : "Wellness Maintenance Tips"}
          </h3>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {isStressed
            ? `Stress detected with ${confidencePercent}% confidence. Here are evidence-based strategies to help you feel better:`
            : "No stress detected. Here are tips to maintain your current balanced state:"}
        </p>
      </div>

      {/* Suggestions Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {suggestions.map((s, i) => {
          const Icon = s.icon;
          return (
            <div
              // biome-ignore lint/suspicious/noArrayIndexKey: static list, order never changes
              key={i}
              data-ocid={`stress-suggestions.item.${i + 1}`}
              className="bg-white/80 dark:bg-card/80 border border-border/60 rounded-xl p-4 flex gap-3 hover:shadow-xs transition-shadow"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${s.iconClass}`}
              >
                <Icon className="w-[18px] h-[18px]" />
              </div>
              <div>
                <p className="text-xs font-bold text-foreground mb-1">
                  {s.category}
                </p>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {s.tip}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {isStressed && (
        <p className="text-xs text-muted-foreground mt-5 text-center italic border-t border-border/50 pt-4">
          These suggestions are for informational purposes only and do not
          replace professional medical advice.
        </p>
      )}
    </div>
  );
}
