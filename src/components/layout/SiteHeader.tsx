"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "./Container";
import { TelemetryHUD } from "@/components/visual/TelemetryHUD";
import { Menu, X } from "lucide-react";

export const SiteHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "#about" },
    { label: "Projects", href: "#work" },
    { label: "Skills", href: "#capabilities" },
    { label: "Logbook", href: "#logbook" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-void/80 backdrop-blur-xl border-b border-white/[0.08] h-16 sm:h-20 flex items-center">
      <Container size="wide" className="w-full">
        <div className="flex items-center justify-between">
          {/* DimensionK Brand Emblem & Functional Telemetry */}
          <div className="flex items-center gap-4 sm:gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 group outline-none"
            >
              <div className="w-7 h-7 rounded-md border border-accent/40 bg-accent/10 flex items-center justify-center font-mono text-xs font-bold text-accent group-hover:border-accent transition-colors">
                DK
              </div>
              <span className="font-mono text-xs sm:text-sm tracking-widest uppercase font-semibold text-text group-hover:text-white transition-colors">
                DIMENSION-K
              </span>
            </Link>

            {/* Live Functional Mission Telemetry */}
            <div className="hidden lg:block pl-4 border-l border-white/[0.08]">
              <TelemetryHUD />
            </div>
          </div>

          {/* Desktop Links with Sleek Hover States */}
          <nav className="hidden md:flex items-center gap-6 sm:gap-8 text-xs font-mono tracking-wider text-text-secondary">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:text-accent transition-colors relative py-1 focus-visible:text-accent outline-none"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-text-secondary hover:text-white focus-visible:text-accent outline-none"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-void/95 backdrop-blur-2xl border-b border-white/[0.1] p-6 space-y-4">
          <div className="pb-3 border-b border-white/[0.08]">
            <TelemetryHUD />
          </div>
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-text hover:text-accent font-mono py-1.5"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
