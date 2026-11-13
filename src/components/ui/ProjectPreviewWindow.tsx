"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  ExternalLink,
  Globe,
  RotateCcw,
  Terminal,
  Layers,
  ArrowUpRight,
  ShieldAlert,
} from "lucide-react";

interface ProjectPreviewWindowProps {
  title: string;
  tagline?: string;
  summary?: string;
  technologies?: string[];
  previewUrl?: string | null;
  pageUrl?: string | null;
  githubUrl?: string | null;
  previewImage?: string | null;
  className?: string;
  aspectRatio?: "video" | "wide";
}

export const ProjectPreviewWindow: React.FC<ProjectPreviewWindowProps> = ({
  title,
  tagline,
  summary,
  technologies = [],
  previewUrl,
  pageUrl,
  githubUrl,
  previewImage,
  className = "",
  aspectRatio = "video",
}) => {
  const [iframeFailed, setIframeFailed] = useState<boolean>(false);
  const [imageFailed, setImageFailed] = useState<boolean>(false);
  const [iframeLoaded, setIframeLoaded] = useState<boolean>(false);
  const [key, setKey] = useState<number>(0);

  const reloadIframe = () => {
    setIframeLoaded(false);
    setIframeFailed(false);
    setKey((prev) => prev + 1);
  };

  // Determine current display state
  const canShowIframe = Boolean(previewUrl) && !iframeFailed;
  const canShowImage = Boolean(previewImage) && !imageFailed && (!previewUrl || iframeFailed);
  const isFallback = !canShowIframe && !canShowImage;

  // The displayed URL string in the address bar (custom pageUrl if provided, else previewUrl or local simulator)
  const displayAddress =
    pageUrl ||
    (previewUrl
      ? previewUrl.replace(/^https?:\/\//, "")
      : `preview://${title.toLowerCase().replace(/[^a-z0-9]/g, "")}.local`);

  return (
    <div
      className={`rounded-lg border border-white/[0.12] bg-surface-raised overflow-hidden shadow-2xl flex flex-col ${className}`}
    >
      {/* Universal Browser Window Bar */}
      <div className="px-4 py-2.5 bg-surface border-b border-white/[0.08] flex items-center justify-between gap-4 font-mono text-xs">
        {/* Window controls */}
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          <div className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/70" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-500/70" />
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-md mx-auto flex items-center justify-between px-3 py-1 rounded bg-void/80 border border-white/[0.08] text-text-dim text-[11px] truncate">
          {pageUrl || previewUrl ? (
            <a
              href={pageUrl || previewUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 truncate hover:text-accent transition-colors cursor-pointer"
              title={`Visit ${displayAddress}`}
            >
              <Globe className="w-3 h-3 text-accent shrink-0" />
              <span className="truncate">{displayAddress}</span>
            </a>
          ) : (
            <div className="flex items-center gap-1.5 truncate">
              <Globe className="w-3 h-3 text-accent shrink-0" />
              <span className="truncate">{displayAddress}</span>
            </div>
          )}

          {previewUrl && (
            <button
              type="button"
              onClick={reloadIframe}
              title="Reload preview"
              className="hover:text-text transition-colors ml-2 cursor-pointer"
            >
              <RotateCcw className="w-2.5 h-2.5" />
            </button>
          )}
        </div>

        {/* External Jump Action */}
        <div className="flex items-center gap-2 shrink-0">
          {pageUrl || previewUrl ? (
            <a
              href={pageUrl || previewUrl!}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-dim hover:text-warm transition-colors inline-flex items-center gap-1 text-[11px]"
              title="Open site in new tab"
            >
              <span>Visit</span>
              <ExternalLink className="w-3 h-3 text-accent" />
            </a>
          ) : githubUrl ? (
            <a
              href={githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-dim hover:text-text transition-colors inline-flex items-center gap-1 text-[11px]"
              title="Inspect repository on GitHub"
            >
              <span>Repo</span>
              <ArrowUpRight className="w-3 h-3 text-accent" />
            </a>
          ) : (
            <span className="text-[10px] text-text-dim">STATION</span>
          )}
        </div>
      </div>

      {/* Screen Frame */}
      <div
        className={`relative w-full ${
          aspectRatio === "video" ? "aspect-video" : "aspect-[16/10]"
        } bg-void flex items-center justify-center overflow-hidden`}
      >
        {/* Mode 1: Live IFrame */}
        {canShowIframe && (
          <>
            {!iframeLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center font-mono text-xs text-text-dim gap-2 bg-void z-10">
                <div className="w-5 h-5 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                <span>Connecting to live preview...</span>
              </div>
            )}
            <iframe
              key={key}
              src={previewUrl!}
              title={`${title} live deployment preview`}
              className="w-full h-full border-none"
              onLoad={() => setIframeLoaded(true)}
              onError={() => setIframeFailed(true)}
              sandbox="allow-scripts allow-same-origin allow-forms"
              loading="lazy"
            />
          </>
        )}

        {/* Mode 2: Screenshot Image */}
        {canShowImage && (
          <div className="relative w-full h-full group bg-surface/50 overflow-hidden">
            <Image
              src={previewImage!}
              alt={`${title} interface preview screenshot`}
              fill
              className="object-contain p-2 transition-transform duration-500 group-hover:scale-[1.02]"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 70vw, 900px"
              onError={() => setImageFailed(true)}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-void/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4 font-mono text-xs pointer-events-none">
              <span className="text-text bg-surface/90 px-2.5 py-1 rounded border border-white/10 pointer-events-auto">
                Static Capture
              </span>
              {previewUrl && (
                <a
                  href={previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-warm bg-surface/90 px-2.5 py-1 rounded border border-white/10 inline-flex items-center gap-1 pointer-events-auto"
                >
                  <span>Launch Preview</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        )}

        {/* Mode 3: Universal Systematic Fallback (when iframe/image fail or aren't provided) */}
        {isFallback && (
          <div className="w-full h-full p-8 flex flex-col justify-between bg-surface/70 border border-white/[0.04]">
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono text-xs pb-3 border-b border-white/[0.06]">
                <span className="text-accent flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-accent" />
                  <span>PREVIEW TELEMETRY TERMINAL</span>
                </span>
                <span className="text-text-dim flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5 text-warm" />
                  <span>SANDBOX FALLBACK</span>
                </span>
              </div>

              <div className="space-y-1">
                <h4 className="font-display text-2xl sm:text-3xl text-text font-normal">
                  {title}
                </h4>
                {tagline && (
                  <p className="font-mono text-xs sm:text-sm text-warm">
                    {tagline}
                  </p>
                )}
              </div>

              {summary && (
                <p className="text-xs sm:text-sm text-text-secondary leading-relaxed max-w-xl font-sans">
                  {summary}
                </p>
              )}
            </div>

            <div className="pt-4 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-text-dim" />
                {technologies.slice(0, 4).map((tech) => (
                  <span
                    key={tech}
                    className="px-2 py-0.5 rounded bg-white/[0.03] border border-white/[0.08] text-text-muted text-[11px]"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex items-center gap-3">
                {githubUrl && (
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-text hover:text-accent link-draw inline-flex items-center gap-1 text-[11px]"
                  >
                    <span>Inspect Code</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
