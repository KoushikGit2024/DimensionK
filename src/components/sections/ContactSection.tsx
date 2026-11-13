"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { ExternalLink } from "@/schemas/content";
import { Copy, Check, Mail, ArrowUpRight } from "lucide-react";

interface ContactSectionProps {
  email: string;
  links: ExternalLink[];
}

export const ContactSection: React.FC<ContactSectionProps> = ({
  email,
  links,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <section id="contact" className="py-20 lg:py-28 bg-deep-space-grid">
      <Container size="narrow">
        <SectionHeading
          index="05"
          eyebrow="Open Transmission"
          title="Establish Communication"
          description="Open to software engineering internships, technical collaborations, and discussions on developer tooling and systems architecture."
        />

        <div className="bg-surface/90 border border-border p-6 sm:p-10 rounded-sm space-y-8">
          <div className="space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
              Primary Direct Channel
            </span>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-void border border-border-subtle rounded-xs">
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent" />
                <span className="font-mono text-sm sm:text-base text-text">
                  {email}
                </span>
              </div>
              <Button
                variant="telemetry"
                size="sm"
                onClick={handleCopy}
                className="w-full sm:w-auto"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-accent-strong" />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-text-muted" />
                    <span>Copy Address</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div className="pt-4 border-t border-border-subtle space-y-3">
            <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
              External Registry Links
            </span>
            <div className="flex flex-wrap gap-4">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-mono border border-border px-4 py-2 rounded-sm hover:border-accent hover:text-text transition-colors"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-text-dim" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
};

