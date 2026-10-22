import React from 'react';

export const CircuitDiagram: React.FC = () => {
  return (
    <div className="circuit-canvas">
      <div style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
          Decomposed Circuit Architecture (ZZFeatureMap, 4 Qubits, Depth 22)
        </div>
        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Entanglement: Linear | Basis: {'{H, Rz, CX, P}'}
        </div>
      </div>

      <svg viewBox="0 0 860 210" style={{ width: '100%', minWidth: '700px', height: 'auto', display: 'block' }}>
        {/* Wire Lines */}
        <g stroke="#CBD5E1" strokeWidth="1.5">
          <line x1="50" y1="35" x2="820" y2="35" />
          <line x1="50" y1="80" x2="820" y2="80" />
          <line x1="50" y1="125" x2="820" y2="125" />
          <line x1="50" y1="170" x2="820" y2="170" />
        </g>

        {/* Qubit Labels */}
        <g fill="#202938" fontSize="12" fontWeight="600" fontFamily="monospace">
          <text x="15" y="39">q_0</text>
          <text x="15" y="84">q_1</text>
          <text x="15" y="129">q_2</text>
          <text x="15" y="174">q_3</text>
        </g>

        {/* --- LAYER 1: Hadamard Gates (Superposition) --- */}
        <g fill="#FFFFFF" stroke="#3559A6" strokeWidth="1.5">
          <rect x="70" y="23" width="24" height="24" rx="3" />
          <rect x="70" y="68" width="24" height="24" rx="3" />
          <rect x="70" y="113" width="24" height="24" rx="3" />
          <rect x="70" y="158" width="24" height="24" rx="3" />
        </g>
        <g fill="#3559A6" fontSize="11" fontWeight="700" textAnchor="middle" fontFamily="sans-serif">
          <text x="82" y="39">H</text>
          <text x="82" y="84">H</text>
          <text x="82" y="129">H</text>
          <text x="82" y="174">H</text>
        </g>

        {/* Barrier 1 */}
        <line x1="112" y1="15" x2="112" y2="190" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />

        {/* --- LAYER 2: 1-Qubit Phase Rotations P(2*x[i]) --- */}
        <g fill="#F8FAFC" stroke="#64748B" strokeWidth="1.2">
          <rect x="128" y="23" width="56" height="24" rx="3" />
          <rect x="128" y="68" width="56" height="24" rx="3" />
          <rect x="128" y="113" width="56" height="24" rx="3" />
          <rect x="128" y="158" width="56" height="24" rx="3" />
        </g>
        <g fill="#334155" fontSize="10" fontWeight="600" textAnchor="middle" fontFamily="monospace">
          <text x="156" y="39">P(2x₀)</text>
          <text x="156" y="84">P(2x₁)</text>
          <text x="156" y="129">P(2x₂)</text>
          <text x="156" y="174">P(2x₃)</text>
        </g>

        {/* --- LAYER 3: 2-Qubit Entangling ZZ Interaction (q0 - q1) --- */}
        {/* CNOT 1 */}
        <circle cx="210" cy="35" r="4" fill="#3559A6" />
        <line x1="210" y1="35" x2="210" y2="80" stroke="#3559A6" strokeWidth="1.5" />
        <circle cx="210" cy="80" r="7" fill="#FFFFFF" stroke="#3559A6" strokeWidth="1.5" />
        <line x1="205" y1="80" x2="215" y2="80" stroke="#3559A6" strokeWidth="1.5" />
        <line x1="210" y1="75" x2="210" y2="85" stroke="#3559A6" strokeWidth="1.5" />

        {/* Phase on target */}
        <rect x="230" y="68" width="80" height="24" rx="3" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.2" />
        <text x="270" y="84" fill="#334155" fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="monospace">
          P(2(π-x₀)(π-x₁))
        </text>

        {/* CNOT 2 */}
        <circle cx="330" cy="35" r="4" fill="#3559A6" />
        <line x1="330" y1="35" x2="330" y2="80" stroke="#3559A6" strokeWidth="1.5" />
        <circle cx="330" cy="80" r="7" fill="#FFFFFF" stroke="#3559A6" strokeWidth="1.5" />
        <line x1="325" y1="80" x2="335" y2="80" stroke="#3559A6" strokeWidth="1.5" />
        <line x1="330" y1="75" x2="330" y2="85" stroke="#3559A6" strokeWidth="1.5" />

        {/* --- LAYER 4: 2-Qubit Entangling ZZ Interaction (q1 - q2) --- */}
        <circle cx="370" cy="80" r="4" fill="#3559A6" />
        <line x1="370" y1="80" x2="370" y2="125" stroke="#3559A6" strokeWidth="1.5" />
        <circle cx="370" cy="125" r="7" fill="#FFFFFF" stroke="#3559A6" strokeWidth="1.5" />
        <line x1="365" y1="125" x2="375" y2="125" stroke="#3559A6" strokeWidth="1.5" />
        <line x1="370" y1="120" x2="370" y2="130" stroke="#3559A6" strokeWidth="1.5" />

        <rect x="390" y="113" width="80" height="24" rx="3" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.2" />
        <text x="430" y="129" fill="#334155" fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="monospace">
          P(2(π-x₁)(π-x₂))
        </text>

        <circle cx="490" cy="80" r="4" fill="#3559A6" />
        <line x1="490" y1="80" x2="490" y2="125" stroke="#3559A6" strokeWidth="1.5" />
        <circle cx="490" cy="125" r="7" fill="#FFFFFF" stroke="#3559A6" strokeWidth="1.5" />
        <line x1="485" y1="125" x2="495" y2="125" stroke="#3559A6" strokeWidth="1.5" />
        <line x1="490" y1="120" x2="490" y2="130" stroke="#3559A6" strokeWidth="1.5" />

        {/* --- LAYER 5: 2-Qubit Entangling ZZ Interaction (q2 - q3) --- */}
        <circle cx="530" cy="125" r="4" fill="#3559A6" />
        <line x1="530" y1="125" x2="530" y2="170" stroke="#3559A6" strokeWidth="1.5" />
        <circle cx="530" cy="170" r="7" fill="#FFFFFF" stroke="#3559A6" strokeWidth="1.5" />
        <line x1="525" y1="170" x2="535" y2="170" stroke="#3559A6" strokeWidth="1.5" />
        <line x1="530" y1="165" x2="530" y2="175" stroke="#3559A6" strokeWidth="1.5" />

        <rect x="550" y="158" width="80" height="24" rx="3" fill="#F8FAFC" stroke="#64748B" strokeWidth="1.2" />
        <text x="590" y="174" fill="#334155" fontSize="9" fontWeight="600" textAnchor="middle" fontFamily="monospace">
          P(2(π-x₂)(π-x₃))
        </text>

        <circle cx="650" cy="125" r="4" fill="#3559A6" />
        <line x1="650" y1="125" x2="650" y2="170" stroke="#3559A6" strokeWidth="1.5" />
        <circle cx="650" cy="170" r="7" fill="#FFFFFF" stroke="#3559A6" strokeWidth="1.5" />
        <line x1="645" y1="170" x2="655" y2="170" stroke="#3559A6" strokeWidth="1.5" />
        <line x1="650" y1="165" x2="650" y2="175" stroke="#3559A6" strokeWidth="1.5" />

        {/* Barrier 2 (End of Repetition 1) */}
        <line x1="680" y1="15" x2="680" y2="190" stroke="#94A3B8" strokeWidth="1" strokeDasharray="3 3" />

        {/* Repetition Indicator */}
        <g fill="#64748B" fontSize="11" fontFamily="sans-serif">
          <text x="700" y="105">[Rep 2 Layer Repeats]</text>
        </g>
      </svg>
    </div>
  );
};
