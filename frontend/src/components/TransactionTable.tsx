import React, { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ChevronLeft, ChevronRight, Eye, Filter } from 'lucide-react';
import { Transaction, TransactionStatus } from '../types';
import { StatusBadge } from './StatusBadge';
import { EmptyState } from './EmptyState';

interface TransactionTableProps {
  transactions: Transaction[];
  onSelectTransaction: (txn: Transaction) => void;
  showFilters?: boolean;
  defaultPageSize?: number;
}

type SortField = 'date' | 'amount' | 'riskScore' | 'id';
type SortOrder = 'asc' | 'desc';

export const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onSelectTransaction,
  showFilters = true,
  defaultPageSize = 8
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  // Filter & Search Logic
  const filtered = useMemo(() => {
    return transactions.filter((txn) => {
      const matchesSearch = 
        txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.details.merchantCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.details.location.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = 
        statusFilter === 'All' ? true : txn.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [transactions, searchTerm, statusFilter]);

  // Sort Logic
  const sorted = useMemo(() => {
    return [...filtered].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'amount') {
        comparison = a.amount - b.amount;
      } else if (sortField === 'riskScore') {
        comparison = a.riskScore - b.riskScore;
      } else if (sortField === 'id') {
        comparison = a.id.localeCompare(b.id);
      } else {
        comparison = new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filtered, sortField, sortOrder]);

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginated = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPage, pageSize]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('All');
    setCurrentPage(1);
  };

  return (
    <div>
      {/* Controls Bar */}
      {showFilters && (
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            gap: '12px', 
            marginBottom: '16px',
            flexWrap: 'wrap' 
          }}
        >
          {/* Search Input */}
          <div style={{ position: 'relative', width: '280px' }}>
            <Search 
              size={15} 
              color="var(--text-secondary)" 
              style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }} 
            />
            <input
              type="text"
              placeholder="Search by ID, merchant, location..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="form-input"
              style={{ width: '100%', paddingLeft: '32px' }}
            />
          </div>

          {/* Status Filter & Page Size */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Filter size={14} color="var(--text-secondary)" />
              <select
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="form-select"
                style={{ padding: '6px 10px', fontSize: '12px' }}
              >
                <option value="All">All Statuses</option>
                <option value="Legitimate">Legitimate</option>
                <option value="Suspicious">Suspicious</option>
                <option value="Under Review">Under Review</option>
              </select>
            </div>

            <select
              value={pageSize}
              onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
              className="form-select"
              style={{ padding: '6px 8px', fontSize: '12px' }}
            >
              <option value={5}>5 per page</option>
              <option value={8}>8 per page</option>
              <option value={15}>15 per page</option>
            </select>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        {paginated.length === 0 ? (
          <EmptyState 
            title="No matching transactions" 
            description="Try adjusting your search terms or filter selection."
            onAction={resetFilters}
          />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th 
                  onClick={() => handleSort('id')} 
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Transaction ID</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('date')} 
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Date & Time</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th 
                  onClick={() => handleSort('amount')} 
                  style={{ cursor: 'pointer', userSelect: 'none', textAlign: 'right' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                    <span>Amount (₹)</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th>Predicted Status</th>
                <th 
                  onClick={() => handleSort('riskScore')} 
                  style={{ cursor: 'pointer', userSelect: 'none' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Risk Score</span>
                    <ArrowUpDown size={12} />
                  </div>
                </th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((txn) => {
                const isHighRisk = txn.riskScore >= 0.75;
                const isMediumRisk = txn.riskScore >= 0.40 && txn.riskScore < 0.75;
                const scoreColor = isHighRisk 
                  ? 'var(--color-red)' 
                  : isMediumRisk 
                    ? 'var(--color-amber)' 
                    : 'var(--color-green)';

                return (
                  <tr key={txn.id}>
                    <td style={{ fontWeight: 600, color: 'var(--color-blue)', fontFamily: 'monospace' }}>
                      {txn.id}
                    </td>
                    <td>
                      <div>{txn.date}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{txn.time} IST</div>
                    </td>
                    <td style={{ textAlign: 'right', fontWeight: 600 }}>
                      ₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>
                    <td>
                      <StatusBadge status={txn.status} size="sm" />
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 600, fontSize: '12px', color: scoreColor, width: '38px' }}>
                          {(txn.riskScore * 100).toFixed(0)}%
                        </span>
                        <div style={{ width: '60px', height: '4px', backgroundColor: '#E9ECEF', borderRadius: '2px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              width: `${txn.riskScore * 100}%`, 
                              height: '100%', 
                              backgroundColor: scoreColor 
                            }} 
                          />
                        </div>
                      </div>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => onSelectTransaction(txn)}
                        className="btn btn-secondary btn-sm"
                        style={{ padding: '4px 8px' }}
                        title="View transaction breakdown"
                      >
                        <Eye size={12} />
                        <span>View</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination Footer */}
      {sorted.length > 0 && (
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: '12px', 
            fontSize: '12px', 
            color: 'var(--text-secondary)' 
          }}
        >
          <div>
            Showing <strong>{(currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong>{Math.min(currentPage * pageSize, sorted.length)}</strong> of{' '}
            <strong>{sorted.length}</strong> records
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="btn btn-secondary btn-sm"
              style={{ opacity: currentPage === 1 ? 0.5 : 1, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              <ChevronLeft size={14} />
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="btn btn-secondary btn-sm"
              style={{ opacity: currentPage === totalPages ? 0.5 : 1, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
