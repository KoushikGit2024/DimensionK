"use client";

import React, { useState } from "react";

export const LogicGateDemo: React.FC = () => {
  const [inputA, setInputA] = useState<boolean>(true);
  const [inputB, setInputB] = useState<boolean>(false);

  // Half-Adder logic: Sum = A XOR B, Carry = A AND B
  const sum = (inputA && !inputB) || (!inputA && inputB);
  const carry = inputA && inputB;

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between text-xs text-text-dim border-b border-white/[0.06] pb-2">
        <span>HARDWARE CIRCUIT INVARIANT // HALF-ADDER</span>
        <span className="text-accent">Toggle discrete logic inputs</span>
      </div>

      <div className="p-4 rounded-md border border-white/[0.08] bg-void/80 space-y-6">
        {/* Toggle Inputs */}
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted">INPUT A:</span>
            <button
              type="button"
              onClick={() => setInputA(!inputA)}
              className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer border ${
                inputA
                  ? "bg-accent/20 border-accent justify-end"
                  : "bg-surface border-white/20 justify-start"
              } flex items-center`}
              aria-label={`Toggle input A, currently ${inputA ? "1" : "0"}`}
            >
              <div
                className={`w-5 h-5 rounded-full transition-transform ${
                  inputA ? "bg-accent shadow-[0_0_8px_rgba(56,242,230,0.6)] translate-x-5" : "bg-text-dim translate-x-0"
                }`}
              />
            </button>
            <span className={`text-sm font-bold ${inputA ? "text-accent" : "text-text-dim"}`}>
              {inputA ? "1" : "0"}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted">INPUT B:</span>
            <button
              type="button"
              onClick={() => setInputB(!inputB)}
              className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer border ${
                inputB
                  ? "bg-accent/20 border-accent justify-end"
                  : "bg-surface border-white/20 justify-start"
              } flex items-center`}
              aria-label={`Toggle input B, currently ${inputB ? "1" : "0"}`}
            >
              <div
                className={`w-5 h-5 rounded-full transition-transform ${
                  inputB ? "bg-accent shadow-[0_0_8px_rgba(56,242,230,0.6)] translate-x-5" : "bg-text-dim translate-x-0"
                }`}
              />
            </button>
            <span className={`text-sm font-bold ${inputB ? "text-accent" : "text-text-dim"}`}>
              {inputB ? "1" : "0"}
            </span>
          </div>
        </div>

        {/* Schematic Block Flow */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-3 bg-surface border border-white/[0.08] rounded flex items-center justify-between">
            <div>
              <div className="text-[10px] text-text-dim uppercase tracking-wider">XOR GATE</div>
              <div className="text-xs text-text mt-0.5">Sum Output (S)</div>
            </div>
            <div
              className={`text-xl font-bold px-3 py-1 rounded border ${
                sum
                  ? "bg-accent/10 border-accent text-accent shadow-[0_0_12px_rgba(56,242,230,0.3)]"
                  : "bg-white/[0.02] border-white/10 text-text-dim"
              }`}
            >
              {sum ? "1" : "0"}
            </div>
          </div>

          <div className="p-3 bg-surface border border-white/[0.08] rounded flex items-center justify-between">
            <div>
              <div className="text-[10px] text-text-dim uppercase tracking-wider">AND GATE</div>
              <div className="text-xs text-text mt-0.5">Carry Output (C)</div>
            </div>
            <div
              className={`text-xl font-bold px-3 py-1 rounded border ${
                carry
                  ? "bg-warm/20 border-warm text-warm shadow-[0_0_12px_rgba(240,163,94,0.3)]"
                  : "bg-white/[0.02] border-white/10 text-text-dim"
              }`}
            >
              {carry ? "1" : "0"}
            </div>
          </div>
        </div>
      </div>

      <div className="text-xs p-3 bg-surface border border-white/[0.06] rounded flex items-center justify-between text-text-secondary">
        <span>BINARY RESULT: [{carry ? "1" : "0"}{sum ? "1" : "0"}]₂</span>
        <span className="text-accent">DECIMAL SUM: {(carry ? 2 : 0) + (sum ? 1 : 0)}</span>
      </div>
    </div>
  );
};

