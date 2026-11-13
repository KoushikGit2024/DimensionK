"use client";

import React, { useState } from "react";
import { Play, Pause, RotateCcw, ChevronLeft, ChevronRight } from "lucide-react";

interface Step {
  array: number[];
  comparing: [number, number];
  swapped: boolean;
  description: string;
}

// Pre-computed bubble sort steps for deterministic scrub playback
const INITIAL_ARRAY = [48, 16, 74, 32, 90, 24, 60];

function generateBubbleSortSteps(initial: number[]): Step[] {
  const steps: Step[] = [];
  const arr = [...initial];
  const n = arr.length;

  steps.push({
    array: [...arr],
    comparing: [-1, -1],
    swapped: false,
    description: "Initial state buffer loaded. Ready to trace.",
  });

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapped: false,
        description: `Comparing index ${j} (${arr[j]}) with index ${j + 1} (${arr[j + 1]}).`,
      });

      if (arr[j] > arr[j + 1]) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        steps.push({
          array: [...arr],
          comparing: [j, j + 1],
          swapped: true,
          description: `Swap invariant triggered: ${arr[j + 1]} < ${arr[j]}. Elements exchanged.`,
        });
      }
    }
  }

  steps.push({
    array: [...arr],
    comparing: [-1, -1],
    swapped: false,
    description: "Array sorted deterministically. Zero comparison violations.",
  });

  return steps;
}

const SORT_STEPS = generateBubbleSortSteps(INITIAL_ARRAY);

export const StepScrubberDemo: React.FC = () => {
  const [currentStepIdx, setCurrentStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= SORT_STEPS.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlaying]);

  const step = SORT_STEPS[currentStepIdx];

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between text-xs text-text-dim border-b border-white/[0.06] pb-2">
        <span>DECOUPLED SNAPSHOT SCRUBBER</span>
        <span className="text-accent">
          FRAME {currentStepIdx + 1} / {SORT_STEPS.length}
        </span>
      </div>

      {/* Bar Visualizer */}
      <div className="h-40 rounded-md border border-white/[0.08] bg-void/80 p-4 flex items-end justify-center gap-3">
        {step.array.map((val, idx) => {
          const isComparing = step.comparing.includes(idx);
          const isSwapped = isComparing && step.swapped;

          let barColor = "bg-surface-raised border-white/20";
          if (isSwapped) {
            barColor = "bg-warm border-warm shadow-[0_0_12px_rgba(240,163,94,0.4)]";
          } else if (isComparing) {
            barColor = "bg-accent border-accent shadow-[0_0_12px_rgba(56,242,230,0.3)]";
          }

          return (
            <div key={idx} className="flex-1 max-w-[48px] flex flex-col items-center gap-1.5 h-full justify-end">
              <span className="text-[10px] text-text-dim">{val}</span>
              <div
                className={`w-full rounded-t-xs border transition-all duration-200 ${barColor}`}
                style={{ height: `${(val / 100) * 85}%` }}
              />
              <span className="text-[9px] text-text-dim">[{idx}]</span>
            </div>
          );
        })}
      </div>

      {/* Scrubber Range & Controls */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <input
            type="range"
            min="0"
            max={SORT_STEPS.length - 1}
            value={currentStepIdx}
            onChange={(e) => {
              setIsPlaying(false);
              setCurrentStepIdx(Number(e.target.value));
            }}
            className="w-full accent-[#38f2e6] bg-surface h-1.5 rounded-lg cursor-pointer"
            aria-label="Timeline step scrubber"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="p-2 bg-accent/10 border border-accent/40 text-accent rounded hover:bg-accent/20 transition-colors cursor-pointer"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            </button>
            <button
              type="button"
              disabled={currentStepIdx === 0}
              onClick={() => setCurrentStepIdx((p) => Math.max(0, p - 1))}
              className="p-2 bg-white/[0.03] border border-white/10 text-text-muted rounded hover:text-text disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Previous step"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              disabled={currentStepIdx === SORT_STEPS.length - 1}
              onClick={() => setCurrentStepIdx((p) => Math.min(SORT_STEPS.length - 1, p + 1))}
              className="p-2 bg-white/[0.03] border border-white/10 text-text-muted rounded hover:text-text disabled:opacity-40 transition-colors cursor-pointer"
              aria-label="Next step"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setCurrentStepIdx(0);
              }}
              className="p-2 bg-white/[0.03] border border-white/10 text-text-muted rounded hover:text-text transition-colors cursor-pointer"
              aria-label="Reset"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <span className="text-xs text-text-secondary">
            {step.description}
          </span>
        </div>
      </div>
    </div>
  );
};

