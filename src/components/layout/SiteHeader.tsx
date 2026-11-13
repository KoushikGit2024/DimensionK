"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "./Container";
import { TelemetryHUD } from "@/components/visual/TelemetryHUD";
import { useActiveSection } from "@/hooks/useActiveSection";
import { Menu, X, Command } from "lucide-react";

const NAV_LINKS = [
  { id: "about", label: "Horizon", href: "/#about" },
  { id: "work", label: "Projects", href: "/#work" },
  { id: "capabilities", label: "Capabilities", href: "/#capabilities" },
  { id: "methodology", label: "Methodology", href: "/#methodology" },
  { id: "logbook", label: "Logbook", href: "/#logbook" },
  { id: "contact", label: "Transmission", href: "/#contact" },
];

export const SiteHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeSection = useActiveSection(NAV_LINKS.map((n) => n.id));

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-200 border-b ${
        scrolled
          ? "bg-surface-raised/95 backdrop-blur-xl border-white/[0.1] shadow-lg shadow-black/40"
          : "bg-surface-raised/60 backdrop-blur-md border-white/[0.06]"
      } h-16 sm:h-20 flex items-center`}
    >
      <Container size="wide" className="w-full">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="flex items-center gap-2.5 group outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-xs"
            >
              <div className="w-7 h-7 rounded-xs border border-accent/45 bg-accent/[0.08] flex items-center justify-center font-mono text-xs font-bold text-accent group-hover:border-accent group-hover:bg-accent/15 transition-colors">
                DK
              </div>
              <div className="flex flex-col">
                <span className="font-mono text-xs sm:text-sm tracking-widest uppercase font-semibold text-text group-hover:text-white transition-colors leading-none">
                  DIMENSION-K
                </span>
              </div>
            </Link>

            <div className="hidden xl:block pl-5 border-l border-white/[0.08]">
              <TelemetryHUD />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <nav
              aria-label="Primary navigation"
              className="hidden md:flex items-center gap-1 text-xs font-mono tracking-wider"
            >
              {NAV_LINKS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    aria-current={isActive ? "location" : undefined}
                    className={`px-3 py-1.5 rounded-xs transition-all outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                      isActive
                        ? "text-warm bg-warm/10 border border-warm/30 font-medium"
                        : "text-text-secondary hover:text-text border border-transparent hover:border-white/[0.08]"
                    }`}
                  >
                    <span>{item.label}</span>
                  </a>
                );
              })}
            </nav>

            {/* Quick Command Palette Launcher Indicator */}
            <button
              type="button"
              onClick={() => {
                const paletteDialog = document.querySelector("dialog");
                if (paletteDialog && !paletteDialog.open) {
                  paletteDialog.showModal();
                }
              }}
              className="hidden sm:inline-flex items-center gap-1.5 px-2 py-1 rounded bg-white/[0.03] border border-white/10 hover:border-white/20 text-text-dim text-[11px] font-mono transition-colors cursor-pointer"
              title="Open Command Palette (Ctrl+K)"
            >
              <Command className="w-3 h-3 text-accent" />
              <span>K</span>
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              aria-label={
                mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xs border border-white/[0.1] bg-surface text-text-secondary hover:text-white focus-visible:ring-2 focus-visible:ring-accent outline-none"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-accent" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* Full-Height Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden fixed inset-0 top-16 bg-surface-raised/95 backdrop-blur-2xl z-50 p-6 flex flex-col justify-between"
        >
          <div className="space-y-6">
            <div className="pb-4 border-b border-white/[0.08]">
              <TelemetryHUD />
            </div>

            <nav aria-label="Mobile navigation" className="space-y-3">
              {NAV_LINKS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <a
                    key={item.id}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-3 px-4 rounded-md font-display text-2xl transition-colors ${
                      isActive
                        ? "text-warm bg-warm/10 border-l-2 border-warm"
                        : "text-text-secondary hover:text-text"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </div>

          <div className="pt-6 border-t border-white/[0.08] font-mono text-xs text-text-dim flex items-center justify-between">
            <span>DIMENSION-K OBSERVATORY</span>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="text-accent underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
