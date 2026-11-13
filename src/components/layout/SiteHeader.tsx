"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Container } from "./Container";
import { Menu, X } from "lucide-react";

interface SiteHeaderProps {
  coordinates: string;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({ coordinates }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "#about" },
    { label: "Project", href: "#work" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-void/80 backdrop-blur-md border-b border-border/30 h-16 sm:h-20 flex items-center">
      <Container size="wide" className="w-full">
        <div className="flex items-center justify-between">
          {/* Telemetry Coordinate Label matching mockup */}
          <div className="font-mono text-xs sm:text-sm tracking-wider text-text-secondary uppercase">
            OBS // {coordinates}
          </div>

          {/* Desktop Links matching mockup */}
          <nav className="hidden md:flex items-center gap-8 text-sm text-text-secondary">
            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="hover:text-white transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 text-text-secondary hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </Container>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-void border-b border-border p-6 space-y-4">
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block text-sm text-text hover:text-accent font-mono py-1"
            >
              {item.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
