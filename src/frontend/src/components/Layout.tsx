import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, Brain, Menu, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/text-detection", label: "Text Analysis" },
  { to: "/facial-detection", label: "Facial Analysis" },
  { to: "/voice-detection", label: "Voice Analysis" },
  { to: "/evaluation", label: "ML Evaluation" },
];

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-lg text-foreground leading-tight">
                  StressDetect
                </span>
                <span className="block text-xs text-muted-foreground leading-tight">
                  ML-Powered Analysis
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentPath === link.to
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border bg-surface px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  currentPath === link.to
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm text-foreground">
                  Stress Detection System
                </p>
                <p className="text-xs text-muted-foreground">
                  ML-Powered Logistic Regression Analysis
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} Built with</span>
              <span className="text-rose-500">♥</span>
              <span>using</span>
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(window.location.hostname || "stress-detection-system")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-primary hover:underline"
              >
                caffeine.ai
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
