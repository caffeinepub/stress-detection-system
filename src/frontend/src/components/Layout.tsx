import { Link, useRouterState } from "@tanstack/react-router";
import { BarChart3, Brain, Camera, FileText, Menu, Mic, X } from "lucide-react";
import type { ReactNode } from "react";
import { useState } from "react";

interface LayoutProps {
  children: ReactNode;
}

const navLinks = [
  { to: "/", label: "Home", icon: null },
  { to: "/text-detection", label: "Text", icon: FileText },
  { to: "/facial-detection", label: "Facial", icon: Camera },
  { to: "/voice-detection", label: "Voice", icon: Mic },
  { to: "/evaluation", label: "Evaluation", icon: BarChart3 },
];

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-surface/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              data-ocid="nav.home.link"
              className="flex items-center gap-3 group"
            >
              <div className="relative w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-primary-glow/60 group-hover:scale-105 transition-transform">
                <Brain className="w-[18px] h-[18px] text-primary-foreground" />
              </div>
              <div className="hidden sm:block leading-tight">
                <span className="font-display font-bold text-[15px] text-foreground block">
                  StressDetect
                </span>
                <span className="text-[10px] text-muted-foreground font-medium tracking-wide">
                  ML-Powered Analysis
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav
              className="hidden md:flex items-center gap-0.5"
              aria-label="Main navigation"
            >
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = currentPath === link.to;
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    data-ocid={`nav.${link.label.toLowerCase()}.link`}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    }`}
                  >
                    {Icon && <Icon className="w-3.5 h-3.5 flex-shrink-0" />}
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Mobile menu button */}
            <button
              type="button"
              data-ocid="nav.mobile_menu.toggle"
              className="md:hidden p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
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
          <div
            data-ocid="nav.mobile_menu.panel"
            className="md:hidden border-t border-border/60 bg-surface/95 backdrop-blur-xl px-4 py-3 space-y-1"
          >
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = currentPath === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {Icon && <Icon className="w-4 h-4 flex-shrink-0" />}
                  {link.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      {/* ── Main Content ──────────────────────────────────── */}
      <main className="flex-1">{children}</main>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="border-t border-border bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center shadow-sm">
                <Brain className="w-4 h-4 text-primary-foreground" />
              </div>
              <div className="leading-tight">
                <p className="font-display font-bold text-sm text-foreground">
                  Stress Detection System
                </p>
                <p className="text-xs text-muted-foreground">
                  ML-Powered Logistic Regression Analysis
                </p>
              </div>
            </div>

            {/* Links */}
            <nav
              className="flex items-center gap-1 flex-wrap justify-center"
              aria-label="Footer navigation"
            >
              {navLinks.slice(1).map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Credit */}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
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
