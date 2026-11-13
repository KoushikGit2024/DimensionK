"use client";

import React, { useState, useEffect } from "react";
import { Container } from "@/components/layout/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { buttonStyles } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { Card } from "@/components/ui/Card";
import { ExternalLink } from "@/schemas/content";
import { EmailEditorModal } from "@/components/contact/EmailEditorModal";
import { Send, Clock, ArrowUpRight, MessageSquareCode, ShieldCheck } from "lucide-react";

interface ContactSectionProps {
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
  links,
}) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [subject, setSubject] = useState(
    "Software Engineering Opportunity — Koushik Kar"
  );
  const [localTime, setLocalTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      try {
        const formatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "Asia/Kolkata",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });
        setLocalTime(formatter.format(new Date()));
      } catch {
        setLocalTime("IST");
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="contact" className="py-24 lg:py-32">
      <Container size="wide">
        <SectionHeading
          index="05"
          eyebrow="Open Transmission"
          title="Establish Communication"
          description="Available for software engineering internships, distributed backend roles, and developer tooling collaborations."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12">
          {/* Left Primary Transmission Channel */}
          <div className="lg:col-span-7">
            <Card className="h-full justify-between space-y-8 p-8 border-white/[0.1] bg-surface/80">
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b border-white/[0.07] pb-4 font-mono text-xs">
                  <span className="text-warm uppercase tracking-wider font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                    <span>DIRECT DISPATCH INTERFACE</span>
                  </span>
                  {localTime && (
                    <span className="flex items-center gap-1.5 text-text-muted">
                      <Clock className="w-3.5 h-3.5 text-warm" />
                      <span>It&apos;s {localTime} for me (IST)</span>
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  <h3 className="font-display text-3xl sm:text-4xl text-text font-normal leading-tight">
                    Let&apos;s build something that holds its{" "}
                    <em className="italic text-warm">invariants</em>.
                  </h3>
                  <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
                    Have an engineering opportunity, an architectural question, or an open-source collaboration idea? Click below to compose and transmit a secure message directly to my station inbox.
                  </p>
                </div>

                {/* Secure Message Trigger Box (Email address is kept completely private) */}
                <div
                  onClick={() => setIsEditorOpen(true)}
                  className="p-5 bg-surface-raised border border-white/[0.08] hover:border-warm/60 rounded-lg cursor-pointer transition-all group flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_0_24px_rgba(0,0,0,0.4)]"
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") setIsEditorOpen(true);
                  }}
                  aria-label="Open secure email editor modal"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-md bg-warm/10 border border-warm/30 flex items-center justify-center shrink-0 text-warm group-hover:scale-105 transition-transform">
                      <MessageSquareCode className="w-5 h-5" />
                    </div>
                    <div className="space-y-0.5 truncate">
                      <div className="font-display text-lg sm:text-xl text-text group-hover:text-warm transition-colors truncate">
                        Compose Transmission
                      </div>
                      <div className="font-mono text-xs text-text-dim flex items-center gap-2">
                        <ShieldCheck className="w-3 h-3 text-accent" />
                        <span>Direct Inbox Delivery &bull; Zero Spam Exposure</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-3 py-1.5 rounded bg-white/[0.04] border border-white/10 group-hover:border-warm group-hover:text-warm font-mono text-xs text-text-muted transition-colors shrink-0">
                    Open Editor &rarr;
                  </span>
                </div>

                {/* Subject Preset Choices */}
                <div className="space-y-3 pt-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-text-dim block">
                    Choose Subject Preset
                  </span>
                  <div
                    role="radiogroup"
                    aria-label="Email subject preset"
                    className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
                  >
                    {TRANSMISSION_TOPICS.map((topic) => {
                      const active = subject === topic.subject;
                      return (
                        <button
                          key={topic.id}
                          type="button"
                          onClick={() => {
                            setSubject(topic.subject);
                            setIsEditorOpen(true);
                          }}
                          className={`p-3 rounded-md font-mono text-xs text-left border transition-all cursor-pointer block ${
                            active
                              ? "bg-warm/15 border-warm text-warm font-medium shadow-[0_0_12px_rgba(240,163,94,0.15)]"
                              : "bg-surface/50 border-white/[0.07] text-text-secondary hover:text-text hover:border-white/20"
                          }`}
                        >
                          <span>{topic.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/[0.07] flex flex-wrap items-center justify-between gap-4">
                <span className="font-mono text-xs text-text-dim truncate max-w-xs sm:max-w-md">
                  TOPIC: {subject}
                </span>
                <Magnetic>
                  <button
                    type="button"
                    onClick={() => setIsEditorOpen(true)}
                    className={buttonStyles("primary", "md")}
                  >
                    <Send className="w-3.5 h-3.5 text-accent" />
                    <span>Open Message Composer</span>
                  </button>
                </Magnetic>
              </div>
            </Card>
          </div>

          {/* Right External Destinations */}
          <div className="lg:col-span-5">
            <Card className="h-full space-y-6 p-8 border-white/[0.1] bg-surface/80">
              <div className="space-y-1 pb-4 border-b border-white/[0.07]">
                <span className="font-mono text-xs uppercase tracking-wider text-text-muted">
                  External Network Registries
                </span>
                <h3 className="font-display text-2xl font-normal text-text">
                  Direct Profile Destinations
                </h3>
              </div>

              <p className="text-sm text-text-secondary leading-relaxed font-sans">
                Connect for technical discussions, code inspection, open-source
                contributions, and verified academic milestones.
              </p>

              <div className="space-y-3 pt-2">
                {links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-md border border-white/[0.08] bg-surface/50 hover:border-warm hover:bg-white/[0.02] transition-all group font-mono text-xs text-text-secondary hover:text-text"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent group-hover:bg-warm transition-colors" />
                      <span className="uppercase tracking-wider">
                        {link.label}
                      </span>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-text-dim group-hover:text-warm group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </a>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Container>

      {/* Interactive Email Composition Modal */}
      <EmailEditorModal
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        defaultSubject={subject}
      />
    </section>
  );
};
