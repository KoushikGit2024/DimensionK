"use client";

import React, { useState } from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ExternalLink } from "@/schemas/content";
import { Copy, Check, Mail, ArrowUpRight, Send, Radio } from "lucide-react";

interface ContactSectionProps {
  email: string;
  links: ExternalLink[];
}

const TRANSMISSION_TOPICS = [
  {
    id: "internship",
    label: "SDE Internship / Role",
    subject: "Software Engineering Opportunity — Koushik Kar",
  },
  {
    id: "collaboration",
    label: "Systems & Tooling Collaboration",
    subject: "Engineering Collaboration // Developer Tools & Systems",
  },
  {
    id: "general",
    label: "General Technical Inquiry",
    subject: "Direct Transmission via Observatory Portfolio",
  },
];

export const ContactSection: React.FC<ContactSectionProps> = ({
  email,
  links,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState(TRANSMISSION_TOPICS[0]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopied(false);
    }
  };

  const mailtoHref = `mailto:${email}?subject=${encodeURIComponent(
    selectedTopic.subject
  )}`;

  return (
    <section id="contact" className="py-20 lg:py-28 bg-deep-space-grid">
      <Container size="wide">
        <SectionHeading
          index="06"
          eyebrow="Open Transmission"
          title="Establish Communication"
          description="Available for software engineering internships, full-stack & systems engineering roles, and technical collaborations on developer tooling."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          {/* Primary Direct Channel Card */}
          <div className="lg:col-span-7">
            <Card className="h-full justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-white/[0.07] pb-3 font-mono text-xs">
                  <span className="text-accent uppercase tracking-wider flex items-center gap-2">
                    <Radio className="w-3.5 h-3.5 animate-pulse" />
                    <span>Primary Direct Channel</span>
                  </span>
                  <span className="text-text-dim">SIGNAL: ACTIVE</span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 bg-void border border-white/[0.1] rounded-xs">
                  <div className="flex items-center gap-3 min-w-0">
                    <Mail className="w-5 h-5 text-accent shrink-0" />
                    <span className="font-mono text-sm sm:text-base text-white truncate">
                      {email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="telemetry"
                      size="sm"
                      onClick={handleCopy}
                      aria-label="Copy email address to clipboard"
                    >
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-accent" />
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

                <div aria-live="polite" className="sr-only">
                  {copied ? "Email address copied to clipboard" : ""}
                </div>

                {/* Subject Preset Selector */}
                <div className="space-y-2.5 pt-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-text-muted block">
                    Select Transmission Protocol (Subject Preset)
                  </span>
                  <div
                    role="radiogroup"
                    aria-label="Email subject preset"
                    className="grid grid-cols-1 sm:grid-cols-3 gap-2"
                  >
                    {TRANSMISSION_TOPICS.map((topic) => {
                      const active = selectedTopic.id === topic.id;
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          role="radio"
                          aria-checked={active}
                          onClick={() => setSelectedTopic(topic)}
                          className={`p-2.5 rounded-xs font-mono text-xs text-left border transition-all cursor-pointer ${
                            active
                              ? "bg-accent/15 border-accent text-accent font-medium"
                              : "bg-void/60 border-white/[0.07] text-text-secondary hover:text-white hover:border-white/20"
                          }`}
                        >
                          {topic.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-4">
                <span className="font-mono text-xs text-text-dim truncate max-w-xs sm:max-w-md">
                  HEADER: {selectedTopic.subject}
                </span>
                <a href={mailtoHref}>
                  <Button variant="primary" size="md">
                    <Send className="w-3.5 h-3.5 text-accent" />
                    <span>Launch Mail Client</span>
                  </Button>
                </a>
              </div>
            </Card>
          </div>

          {/* Right External Registry Links */}
          <div className="lg:col-span-5">
            <Card className="h-full justify-between space-y-6">
              <div className="space-y-4">
                <div className="border-b border-white/[0.07] pb-3 font-mono text-xs text-text-muted uppercase tracking-wider">
                  // External Verification Registries
                </div>
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed">
                  Inspect open-source repositories, commit histories, architectural
                  documentation, and professional credentials across verified
                  networks.
                </p>

                <div className="space-y-3 pt-1">
                  {links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-4 rounded-xs bg-void border border-white/[0.08] hover:border-accent group transition-colors"
                    >
                      <div className="space-y-0.5">
                        <div className="font-mono text-sm text-white group-hover:text-accent transition-colors font-medium">
                          {link.label}
                        </div>
                        <div className="font-mono text-[11px] text-text-dim uppercase">
                          {link.kind} // {link.href.replace("https://", "")}
                        </div>
                      </div>
                      <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                    </a>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-white/[0.07] font-mono text-[11px] text-text-dim flex items-center justify-between">
                <span>BASE: SERAMPORE / AGARTALA, IN</span>
                <span className="text-accent">UTC+05:30 IST</span>
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
};
