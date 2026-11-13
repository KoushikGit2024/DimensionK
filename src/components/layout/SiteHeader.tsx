"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Container } from "./Container";
import { TelemetryHUD } from "@/components/visual/TelemetryHUD";
import { Menu, X } from "lucide-react";

const NAV_LINKS = [
  { id: "about", label: "Station", href: "/#about" },
  { id: "work", label: "Projects", href: "/#work" },
  { id: "capabilities", label: "Capabilities", href: "/#capabilities" },
  { id: "methodology", label: "Methodology", href: "/#methodology" },
  { id: "logbook", label: "Logbook", href: "/#logbook" },
  { id: "contact", label: "Contact", href: "/#contact" },
];

export const SiteHeader: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("about");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    const sectionElements = NAV_LINKS.map((item) =>
      document.getElementById(item.id)
    ).filter((el): el is HTMLElement => el !== null);

    let observer: IntersectionObserver | null = null;
    if (sectionElements.length > 0 && "IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(entry.target.id);
            }
          });
        },
        { rootMargin: "-25% 0px -60% 0px", threshold: 0.05 }
      );
      sectionElements.forEach((el) => observer?.observe(el));
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKeyDown);
      if (observer) observer.disconnect();
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 border-b ${
        scrolled
          ? "bg-void/90 backdrop-blur-xl border-white/[0.1]"
          : "bg-void/70 backdrop-blur-md border-white/[0.06]"
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
                <span className="font-mono text-[9px] tracking-widest text-text-muted uppercase mt-0.5 hidden sm:inline">
                  OBS // 22.75°N
                </span>
              </div>
            </Link>

            <div className="hidden xl:block pl-5 border-l border-white/[0.08]">
              <TelemetryHUD />
            </div>
          </div>

          <nav
            aria-label="Primary navigation"
            className="hidden md:flex items-center gap-1 lg:gap-2 text-xs font-mono tracking-wider"
          >
            {NAV_LINKS.map((item, idx) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`px-3 py-1.5 rounded-xs transition-all relative outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                    isActive
                      ? "text-accent bg-accent/[0.08] border border-accent/30"
                      : "text-text-secondary hover:text-text border border-transparent hover:border-white/[0.08]"
                  }`}
                >
                  <span className="text-text-dim mr-1 hidden lg:inline">
                    0{idx + 1}.
                  </span>
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>

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
      </Container>

      {mobileMenuOpen && (
        <div
          id="mobile-nav-drawer"
          className="md:hidden absolute top-full left-0 right-0 bg-void/95 backdrop-blur-2xl border-b border-white/[0.12] px-4 pt-4 pb-6 space-y-4 shadow-2xl"
        >
          <div className="pb-3 border-b border-white/[0.08]">
            <TelemetryHUD />
          </div>
          <nav
            aria-label="Mobile navigation"
            className="grid grid-cols-2 gap-2"
          >
            {NAV_LINKS.map((item, idx) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xs text-xs font-mono border transition-colors ${
                    isActive
                      ? "border-accent/40 bg-accent/10 text-accent font-medium"
                      : "border-white/[0.06] bg-surface/60 text-text hover:border-white/20"
                  }`}
                >
                  <span className="text-text-dim">0{idx + 1}</span>
                  <span>{item.label}</span>
                </a>
              );
            })}
          </nav>
        </div>
      )}
    </header>
  );
};
