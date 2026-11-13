import React from "react";
import { Container } from "./Container";
import { ExternalLink } from "@/schemas/content";
import { ArrowUpRight, ArrowUp } from "lucide-react";

interface SiteFooterProps {
  displayName: string;
  coordinates: string;
  links: ExternalLink[];
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  displayName,
  coordinates,
  links,
}) => {
  return (
    <footer className="border-t border-white/[0.08] py-12 text-xs font-mono text-text-muted">
      <Container size="wide">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2.5 text-text">
              <span
                className="w-2 h-2 rounded-full bg-accent"
                aria-hidden="true"
              />
              <span className="font-semibold tracking-widest uppercase">
                {displayName}
              </span>
              <span className="text-text-dim">//</span>
              <span className="text-accent-subtle">DIMENSION-K OBSERVATORY</span>
            </div>
            <p className="text-text-dim">
              Station Coordinates: {coordinates} • NIT Agartala Undergraduate
              Engineering Archive
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-5">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs border border-white/[0.07] bg-white/[0.02] hover:border-accent hover:text-accent transition-colors"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-text-dim" />
              </a>
            ))}
            <a
              href="#about"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xs border border-white/[0.07] text-text-secondary hover:border-white/25 hover:text-white transition-colors"
            >
              <span>Return to Zenith</span>
              <ArrowUp className="w-3.5 h-3.5 text-accent" />
            </a>
          </div>
        </div>
      </Container>
    </footer>
  );
};
