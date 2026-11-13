import React from "react";
import { Container } from "./Container";
import { ExternalLink } from "@/schemas/content";
import { ArrowUpRight } from "lucide-react";

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
    <footer className="border-t border-border bg-void py-12 text-xs font-mono text-text-muted">
      <Container size="wide">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-text">
              <span className="w-2 h-2 rounded-full bg-accent" />
              <span className="font-semibold tracking-wider uppercase">
                {displayName}
              </span>
            </div>
            <p className="text-text-dim">
              The Observatory // Station Coordinates: {coordinates}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 hover:text-accent transition-colors"
              >
                <span>{link.label}</span>
                <ArrowUpRight className="w-3 h-3 text-text-dim" />
              </a>
            ))}
          </div>

          <div className="text-text-dim text-[11px]">
            Content-First Observatory Architecture • Zero Fabrications
          </div>
        </div>
      </Container>
    </footer>
  );
};

