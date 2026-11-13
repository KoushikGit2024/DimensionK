import React from "react";

export const LudoNeoDiagram: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`p-6 rounded-lg border border-white/[0.08] bg-surface/50 font-mono text-xs ${className}`}>
      <div className="flex items-center justify-between text-text-dim text-[11px] mb-4 pb-2 border-b border-white/[0.06]">
        <span>REAL-TIME ENGINE // AUTHORITATIVE TOPOLOGY</span>
        <span className="text-accent">SOCKET.IO &bull; REDISJSON &bull; BOT FALLBACK</span>
      </div>
      <svg
        viewBox="0 0 680 190"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto text-text"
        role="img"
        aria-label="Ludo Neo state synchronization architecture showing clients, Socket.IO gateway, authoritative Node server, RedisJSON persistence, and algorithmic bot fallback."
      >
        <defs>
          <marker id="arrow-ludo" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="rgba(56, 242, 230, 0.6)" />
          </marker>
          <marker id="arrow-warn" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
            <path d="M 0 1 L 8 5 L 0 9 z" fill="rgba(240, 163, 94, 0.7)" />
          </marker>
        </defs>

        {/* Lines */}
        <line x1="130" y1="65" x2="190" y2="85" stroke="rgba(56, 242, 230, 0.5)" strokeWidth="1.5" markerEnd="url(#arrow-ludo)" />
        <line x1="130" y1="125" x2="190" y2="105" stroke="rgba(56, 242, 230, 0.5)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow-ludo)" />
        <line x1="330" y1="95" x2="385" y2="95" stroke="rgba(56, 242, 230, 0.6)" strokeWidth="1.5" markerEnd="url(#arrow-ludo)" />
        <line x1="450" y1="50" x2="450" y2="25" stroke="rgba(240, 163, 94, 0.5)" strokeWidth="1.5" strokeDasharray="3 3" />
        <line x1="450" y1="25" x2="550" y2="25" stroke="rgba(240, 163, 94, 0.5)" strokeWidth="1.5" strokeDasharray="3 3" markerEnd="url(#arrow-warn)" />
        <line x1="515" y1="95" x2="550" y2="95" stroke="rgba(56, 242, 230, 0.6)" strokeWidth="1.5" markerEnd="url(#arrow-ludo)" />

        {/* Clients */}
        <g>
          <rect x="10" y="35" width="120" height="50" rx="5" fill="#0c1018" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
          <text x="22" y="55" fill="#ece7dc" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)">Player Client A</text>
          <text x="22" y="70" fill="#38f2e6" fontSize="9">Active Web Socket</text>
        </g>
        <g>
          <rect x="10" y="105" width="120" height="50" rx="5" fill="#0c1018" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
          <text x="22" y="125" fill="#a3a8b3" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)">Player Client B</text>
          <text x="22" y="140" fill="#f0a35e" fontSize="9">Unstable Network</text>
        </g>

        {/* Gateway & Node Server */}
        <g>
          <rect x="190" y="50" width="140" height="90" rx="6" fill="#0c1018" stroke="rgba(56, 242, 230, 0.3)" strokeWidth="1" />
          <circle cx="206" cy="68" r="3.5" fill="#38f2e6" />
          <text x="216" y="72" fill="#38f2e6" fontSize="10">GATEWAY</text>
          <text x="206" y="98" fill="#ece7dc" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Socket.IO Server</text>
          <text x="206" y="118" fill="#747c8e" fontSize="9">Turn Sync & Validation</text>
        </g>

        {/* Authoritative State Machine */}
        <g>
          <rect x="385" y="50" width="130" height="90" rx="6" fill="#0c1018" stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
          <circle cx="401" cy="68" r="3.5" fill="#38f2e6" />
          <text x="411" y="72" fill="#8c93a3" fontSize="10">STATE MACHINE</text>
          <text x="401" y="98" fill="#ece7dc" fontSize="13" fontWeight="600" fontFamily="var(--font-sans)">Game Rules</text>
          <text x="401" y="118" fill="#747c8e" fontSize="9">Authoritative Logic</text>
        </g>

        {/* Redis Persistence */}
        <g>
          <rect x="550" y="65" width="120" height="60" rx="5" fill="#0c1018" stroke="rgba(56, 242, 230, 0.4)" strokeWidth="1" />
          <text x="562" y="88" fill="#ece7dc" fontSize="12" fontWeight="600" fontFamily="var(--font-sans)">RedisJSON</text>
          <text x="562" y="104" fill="#38f2e6" fontSize="9">&lt;1ms State Store</text>
        </g>

        {/* Fallback Bot */}
        <g>
          <rect x="550" y="5" width="120" height="42" rx="5" fill="#0c1018" stroke="rgba(240, 163, 94, 0.4)" strokeWidth="1" />
          <text x="562" y="24" fill="#f0a35e" fontSize="11" fontWeight="600" fontFamily="var(--font-sans)">Bot Engine</text>
          <text x="562" y="37" fill="#747c8e" fontSize="9">Auto Disconnect Fallback</text>
        </g>
      </svg>
    </div>
  );
};

