import React, { useState } from 'react';
import { MOCK_KERNEL_MATRIX, KERNEL_SAMPLE_LABELS } from '../data/mockData';

export const KernelHeatmap: React.FC = () => {
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number; val: number } | null>(null);

  // Generates clean blue monochromatic color based on similarity (0.0 to 1.0)
  const getCellColor = (val: number) => {
    // 0.0 -> #F0F4FA (very light blue), 1.0 -> #3559A6 (primary blue)
    // Interpolating lightness
    if (val < 0.2) return '#F4F6FA';
    if (val < 0.4) return '#D6E2F5';
    if (val < 0.7) return '#A4C0EC';
    if (val < 0.85) return '#6794DC';
    return '#3559A6';
  };

  const getTextColor = (val: number) => {
    return val > 0.65 ? '#FFFFFF' : '#202938';
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
          Pairwise quantum state fidelity matrix: $K(x_i, x_j) = |\langle \phi(x_i) | \phi(x_j) \rangle|^2$
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', color: 'var(--text-secondary)' }}>
          <span>0.0 (Orthogonal)</span>
          <div 
            style={{ 
              width: '100px', 
              height: '10px', 
              borderRadius: '2px',
              background: 'linear-gradient(to right, #F4F6FA, #D6E2F5, #A4C0EC, #6794DC, #3559A6)',
              border: '1px solid var(--color-border)' 
            }} 
          />
          <span>1.0 (Identical)</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
        {/* Heatmap Grid Container */}
        <div style={{ flex: 1, overflowX: 'auto' }}>
          <div style={{ minWidth: '420px', maxWidth: '520px', margin: '0 auto' }}>
            {/* Column Labels */}
            <div style={{ display: 'grid', gridTemplateColumns: '40px repeat(10, 1fr)', gap: '3px', marginBottom: '3px' }}>
              <div />
              {KERNEL_SAMPLE_LABELS.map((item) => (
                <div 
                  key={item.id} 
                  style={{ 
                    fontSize: '10px', 
                    fontWeight: 600, 
                    textAlign: 'center',
                    color: item.type === 'Fraud' ? 'var(--color-red)' : 'var(--text-secondary)' 
                  }}
                  title={`${item.id} (${item.type})`}
                >
                  {item.id}
                </div>
              ))}
            </div>

            {/* Rows */}
            {MOCK_KERNEL_MATRIX.map((rowVals, rowIdx) => {
              const rowLabel = KERNEL_SAMPLE_LABELS[rowIdx];
              return (
                <div 
                  key={rowIdx} 
                  style={{ 
                    display: 'grid', 
                    gridTemplateColumns: '40px repeat(10, 1fr)', 
                    gap: '3px', 
                    marginBottom: '3px' 
                  }}
                >
                  {/* Row Label */}
                  <div 
                    style={{ 
                      fontSize: '10px', 
                      fontWeight: 600, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      color: rowLabel.type === 'Fraud' ? 'var(--color-red)' : 'var(--text-secondary)' 
                    }}
                    title={`${rowLabel.id} (${rowLabel.type})`}
                  >
                    {rowLabel.id}
                  </div>

                  {/* Row Cells */}
                  {rowVals.map((val, colIdx) => (
                    <div
                      key={colIdx}
                      className="heatmap-cell"
                      style={{
                        backgroundColor: getCellColor(val),
                        color: getTextColor(val),
                        border: '1px solid rgba(0,0,0,0.04)'
                      }}
                      onMouseEnter={() => setHoveredCell({ row: rowIdx, col: colIdx, val })}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      {val.toFixed(2)}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Hover Inspector Card */}
        <div 
          style={{ 
            width: '240px', 
            background: '#F8F9FA', 
            border: '1px solid var(--color-border)', 
            borderRadius: '6px', 
            padding: '14px',
            fontSize: '12px' 
          }}
        >
          <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
            Kernel Pair Inspector
          </div>

          {hoveredCell ? (
            <div>
              <div style={{ marginBottom: '8px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Fidelity Value:</span>
                <div style={{ fontSize: '18px', fontWeight: 700, color: 'var(--color-blue)', marginTop: '2px' }}>
                  {hoveredCell.val.toFixed(4)}
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Row ({KERNEL_SAMPLE_LABELS[hoveredCell.row].id}):</span>
                  <strong style={{ color: KERNEL_SAMPLE_LABELS[hoveredCell.row].type === 'Fraud' ? 'var(--color-red)' : 'var(--color-green)' }}>
                    {KERNEL_SAMPLE_LABELS[hoveredCell.row].type}
                  </strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Column ({KERNEL_SAMPLE_LABELS[hoveredCell.col].id}):</span>
                  <strong style={{ color: KERNEL_SAMPLE_LABELS[hoveredCell.col].type === 'Fraud' ? 'var(--color-red)' : 'var(--color-green)' }}>
                    {KERNEL_SAMPLE_LABELS[hoveredCell.col].type}
                  </strong>
                </div>
              </div>

              <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '10px' }}>
                {hoveredCell.row === hoveredCell.col 
                  ? "Self-inner product = 1.0 (exact trace normalization)." 
                  : hoveredCell.val < 0.2 
                    ? "Near-orthogonal Hilbert states (high geometric separability)." 
                    : "High similarity subspace alignment."}
              </p>
            </div>
          ) : (
            <div style={{ color: 'var(--text-secondary)', fontSize: '11px', padding: '12px 0' }}>
              Hover over any matrix coordinate to inspect exact state overlap and sample classes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
