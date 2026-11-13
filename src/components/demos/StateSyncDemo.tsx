"use client";

import React, { useState } from "react";

export const StateSyncDemo: React.FC = () => {
  const [clientBConnected, setClientBConnected] = useState<boolean>(true);
  const [counter, setCounter] = useState<number>(4);
  const [clientBValue, setClientBValue] = useState<number>(4);
  const [lastAction, setLastAction] = useState<string>("State synchronized across all clients");

  const incrementOnA = () => {
    const nextVal = counter + 1;
    setCounter(nextVal);
    if (clientBConnected) {
      setClientBValue(nextVal);
      setLastAction(`Client A moved -> Server & Client B synchronized to ${nextVal}`);
    } else {
      setLastAction(`Client A moved -> Server updated to ${nextVal}; Client B is offline & stale at ${clientBValue}`);
    }
  };

  const toggleClientB = () => {
    if (!clientBConnected) {
      // Reconnect and reconcile
      setClientBConnected(true);
      setClientBValue(counter);
      setLastAction(`Client B reconnected -> Atomic snapshot reconciled to state ${counter}`);
    } else {
      setClientBConnected(false);
      setLastAction(`Client B dropped connection -> State buffered in RedisJSON`);
    }
  };

  return (
    <div className="space-y-4 font-mono">
      <div className="flex items-center justify-between text-xs text-text-dim border-b border-white/[0.06] pb-2">
        <span>AUTHORITATIVE STATE SYNC</span>
        <span className="text-accent">Test disconnect & reconciliation</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Client A */}
        <div className="p-4 rounded-md border border-accent/40 bg-void/80 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-dim">CLIENT A</span>
              <span className="inline-block w-2 h-2 rounded-full bg-accent animate-pulse" />
            </div>
            <div className="text-2xl font-bold text-accent tabular-nums">
              Pos: {counter}
            </div>
            <div className="text-[10px] text-text-dim mt-1">Socket: CONNECTED</div>
          </div>
          <button
            type="button"
            onClick={incrementOnA}
            className="mt-4 px-3 py-1.5 text-xs bg-accent/10 border border-accent/40 hover:bg-accent/20 text-accent rounded transition-colors cursor-pointer"
          >
            Emit Action (Move +1)
          </button>
        </div>

        {/* Server & RedisJSON */}
        <div className="p-4 rounded-md border border-white/[0.1] bg-surface flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-dim">AUTHORITATIVE SERVER</span>
              <span className="text-[10px] text-accent">RedisJSON</span>
            </div>
            <div className="text-2xl font-bold text-text tabular-nums">
              State: {counter}
            </div>
            <div className="text-[10px] text-text-muted mt-1">Version vector: [v{counter}]</div>
          </div>
          <div className="text-[11px] text-text-dim border-t border-white/[0.06] pt-2">
            Atomic lock &bull; Sub-ms write
          </div>
        </div>

        {/* Client B */}
        <div
          className={`p-4 rounded-md border flex flex-col justify-between transition-colors ${
            clientBConnected
              ? "border-accent/40 bg-void/80"
              : "border-warm/50 bg-warm/5"
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-dim">CLIENT B</span>
              <span
                className={`inline-block w-2 h-2 rounded-full ${
                  clientBConnected ? "bg-accent animate-pulse" : "bg-warm"
                }`}
              />
            </div>
            <div
              className={`text-2xl font-bold tabular-nums ${
                clientBConnected ? "text-accent" : "text-warm"
              }`}
            >
              Pos: {clientBValue}
            </div>
            <div className="text-[10px] text-text-dim mt-1">
              Socket: {clientBConnected ? "CONNECTED" : "OFFLINE (Stale)"}
            </div>
          </div>
          <button
            type="button"
            onClick={toggleClientB}
            className={`mt-4 px-3 py-1.5 text-xs rounded transition-colors cursor-pointer border ${
              clientBConnected
                ? "bg-white/[0.04] border-white/20 text-text-muted hover:border-warm hover:text-warm"
                : "bg-warm/20 border-warm text-warm hover:bg-warm/30 font-semibold"
            }`}
          >
            {clientBConnected ? "Simulate Disconnect" : "Reconnect & Reconcile"}
          </button>
        </div>
      </div>

      <div className="p-3 bg-surface border border-white/[0.06] rounded text-xs text-text-secondary">
        <span className="text-text-dim">EVENT LOG: </span>
        <span className="text-text">{lastAction}</span>
      </div>
    </div>
  );
};

