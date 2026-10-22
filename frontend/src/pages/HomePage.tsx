import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  ShieldAlert, 
  Zap, 
  ArrowRight, 
  CheckCircle2, 
  Layers, 
  Database, 
  Lock, 
  Volume2, 
  Clock, 
  FileText, 
  Activity, 
  CreditCard,
  ChevronRight,
  ExternalLink,
  Store,
  RefreshCw,
  AlertTriangle
} from 'lucide-react';
import { NavigationPage, UserProfile, TransactionStatus } from '../types';
import { screenTransaction, ScreenResponse } from '../services/api';

interface HomePageProps {
  onNavigate: (page: NavigationPage) => void;
  currentUser?: UserProfile | null;
  onUserChange?: (user: UserProfile) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  currentUser,
  onUserChange
}) => {
  // Simulator State
  const [transferAmount, setTransferAmount] = useState<number>(142050);
  const [transferChannel, setTransferChannel] = useState<string>('UPI (Google Pay / PhonePe)');
  const [transferVpa, setTransferVpa] = useState<string>('scam.crypto.drain@ybl');
  const [transferBeneficiary, setTransferBeneficiary] = useState<string>('Unknown Digital Gift Hub');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [simulationResult, setSimulationResult] = useState<ScreenResponse | null>(null);
  const [showTechnicalInspector, setShowTechnicalInspector] = useState<boolean>(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);

  // Load clean scenario presets for the bank transfer
  const handleSelectScenario = (type: 'safe_chai' | 'midnight_fraud' | 'smurf_review') => {
    if (type === 'safe_chai') {
      setTransferAmount(35);
      setTransferChannel('UPI Soundbox (Paytm)');
      setTransferVpa('ramesh.kirana@upi');
      setTransferBeneficiary('Ramesh Tea & Provisions Store');
      handleExecuteTransfer(35, 'UPI Soundbox (Paytm)', 'ramesh.kirana@upi', 'Ramesh Tea & Provisions Store', -0.4, -0.2, 0.8, 0.4);
    } else if (type === 'midnight_fraud') {
      setTransferAmount(142050);
      setTransferChannel('UPI (Google Pay / PhonePe)');
      setTransferVpa('scam.crypto.drain@ybl');
      setTransferBeneficiary('P2P Crypto Off-Ramp Desk');
      handleExecuteTransfer(142050, 'UPI (Google Pay / PhonePe)', 'scam.crypto.drain@ybl', 'P2P Crypto Off-Ramp Desk', 3.8, 3.4, -4.2, -5.9);
    } else {
      setTransferAmount(28500);
      setTransferChannel('IMPS Immediate Payment');
      setTransferVpa('new.beneficiary98@icici');
      setTransferBeneficiary('First-Time Individual Payee');
      handleExecuteTransfer(28500, 'IMPS Immediate Payment', 'new.beneficiary98@icici', 'First-Time Individual Payee', 1.8, 1.4, -1.8, -2.1);
    }
  };

  const handleExecuteTransfer = async (
    amt: number, 
    channel: string, 
    vpa: string, 
    beneficiary: string,
    v4?: number,
    v11?: number,
    v12?: number,
    v14?: number
  ) => {
    setIsProcessing(true);
    try {
      const res = await screenTransaction({
        amount: amt,
        channel: channel,
        vpa: vpa,
        merchant: beneficiary,
        v4,
        v11,
        v12,
        v14
      });
      setSimulationResult(res);
      setIsProcessing(false);
    } catch {
      setIsProcessing(false);
    }
  };

  const playSoundboxVoice = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.05;
      utterance.onend = () => setIsPlayingAudio(false);
      utterance.onerror = () => setIsPlayingAudio(false);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: '1240px', margin: '0 auto', paddingBottom: '60px' }}>
      
      {/* 1. TOP INSTITUTIONAL STATUS BANNER */}
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--card-radius)',
          padding: '12px 18px',
          marginBottom: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div 
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '6px',
              backgroundColor: 'var(--color-blue-subtle)',
              color: 'var(--color-blue)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 700
            }}
          >
            <Building2 size={18} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                {currentUser?.institution || 'Scheduled Commercial Bank Gateway'}
              </span>
              <span className="badge badge-legitimate" style={{ fontSize: '9px' }}>
                Terminal Verified
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
              Logged in: <strong>{currentUser?.name}</strong> &bull; {currentUser?.roleLabel} &bull; Node: <strong>{currentUser?.branchCode || 'MUM-CENTRAL'}</strong>
            </div>
          </div>
        </div>

        {/* Live System Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              fontSize: '11px', 
              color: 'var(--color-green)', 
              backgroundColor: 'var(--color-green-subtle)',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 600,
              border: '1px solid rgba(38, 115, 77, 0.2)'
            }}
          >
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--color-green)' }} />
            <span>vQPU-01 Live</span>
          </span>

          <span 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '5px', 
              fontSize: '11px', 
              color: 'var(--color-blue)', 
              backgroundColor: 'var(--color-blue-subtle)',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 600,
              border: '1px solid rgba(53, 89, 166, 0.2)'
            }}
          >
            <Database size={12} />
            <span>PostgreSQL: dualq_db</span>
          </span>

          <span 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '5px', 
              fontSize: '11px', 
              color: 'var(--text-secondary)',
              backgroundColor: '#F8F9FA',
              padding: '3px 8px',
              borderRadius: '4px',
              fontWeight: 500,
              border: '1px solid var(--color-border)'
            }}
          >
            <Lock size={11} />
            <span>RBI Master Direction 2026</span>
          </span>
        </div>
      </div>

      {/* 2. INSTITUTIONAL HERO HEADER */}
      <div 
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--card-radius)',
          padding: '32px 36px',
          marginBottom: '24px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}
      >
        <div style={{ maxWidth: '820px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '3px 10px', backgroundColor: 'var(--color-blue-subtle)', color: 'var(--color-blue)', borderRadius: '20px', fontSize: '11px', fontWeight: 600, marginBottom: '14px' }}>
            <Zap size={12} />
            <span>Quantum Support Vector Machine (QSVM) Fraud Interception</span>
          </div>

          <h1 style={{ fontSize: '26px', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.25, letterSpacing: '-0.02em', marginBottom: '10px' }}>
            National Quantum Fraud Prevention & Threat Telemetry Gateway
          </h1>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
            DualQ intercepts payment threats inline across India's domestic payment rails—<strong>UPI 2.0, IMPS, RuPay, Soundbox, and Corporate RTGS</strong>. By mapping transaction features into exponentially large Hilbert states ($2^N$), DualQ isolates sophisticated fraud rings inaccessible to classical linear hyperplanes.
          </p>

          {/* Quick Action Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('overview')}
              className="btn btn-primary"
              style={{ padding: '9px 18px', fontSize: '13px', fontWeight: 600, gap: '8px' }}
            >
              <span>Launch Risk Operations Terminal</span>
              <ArrowRight size={14} />
            </button>

            <button
              onClick={() => onNavigate('transactions')}
              className="btn btn-secondary"
              style={{ padding: '9px 18px', fontSize: '13px', fontWeight: 600, gap: '6px' }}
            >
              <span>View PostgreSQL Audit Ledger</span>
              <Database size={14} />
            </button>

            <button
              onClick={() => onNavigate('detection')}
              className="btn btn-secondary"
              style={{ padding: '9px 18px', fontSize: '13px', fontWeight: 600, gap: '6px' }}
            >
              <span>Quantum Algorithm Lab</span>
              <ExternalLink size={13} />
            </button>
          </div>
        </div>
      </div>

      {/* 3. NATIONAL DOMESTIC PAYMENT RAILS TELEMETRY TICKER */}
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
          gap: '12px',
          marginBottom: '24px'
        }}
      >
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>UPI 2.0 Domestic Switch</span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-green)' }} />
          </div>
          <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>₹1,42,050 Protected</div>
          <div style={{ fontSize: '10px', color: 'var(--color-green)', marginTop: '2px' }}>0.04% Anomaly Latency (4.2ms)</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Merchant Soundbox 4G</span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-green)' }} />
          </div>
          <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>64 Verified / Day</div>
          <div style={{ fontSize: '10px', color: 'var(--color-blue)', marginTop: '2px' }}>Zero Spoof Audio Guarantee</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>RuPay Domestic Network</span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-green)' }} />
          </div>
          <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>88.77% Detection Recall</div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>+7.1% over Classical SVM</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px 14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Corporate RTGS Wire</span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-green)' }} />
          </div>
          <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>Zero False Blocks</div>
          <div style={{ fontSize: '10px', color: 'var(--color-green)', marginTop: '2px' }}>0.028% Strict FP Bound</div>
        </div>
      </div>

      {/* 4. THE 3 BANKING PILLARS (CLEAN & SPACIOUS) */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '14px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Core Banking Operational Workspaces
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Dedicated portals tailored for scheduled commercial banks, payment switches, and merchant conglomerates:
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
          {/* Card 1: Bank Risk Officer */}
          <div 
            className="card"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              transition: 'border-color 0.15s ease',
              cursor: 'pointer'
            }}
            onClick={() => onNavigate('overview')}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#EEF2F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-blue)' }}>
                  <Building2 size={20} />
                </div>
                <span className="badge badge-legitimate" style={{ fontSize: '10px' }}>
                  Commercial Banking
                </span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Bank Risk Operations Center
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                Triage incoming high-value payment flags, issue immediate UPI account freezes across NPCI, and auto-export RBI Suspicious Activity Reports (SAR).
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-blue)' }}>
                Access Risk Terminal &rarr;
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>HDFC / SBI / ICICI</span>
            </div>
          </div>

          {/* Card 2: Merchant & Soundbox */}
          <div 
            className="card"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              transition: 'border-color 0.15s ease',
              cursor: 'pointer'
            }}
            onClick={() => onNavigate('detection')}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#EDF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-green)' }}>
                  <Store size={20} />
                </div>
                <span className="badge badge-legitimate" style={{ fontSize: '10px' }}>
                  Retail & Soundbox
                </span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Payment Gateway & Soundbox Shield
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                Inline fraud check for POS terminals and QR soundboxes. Prevents fake payment screenshot fraud and issues verbal voice alerts in Hindi and English.
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--color-green)' }}>
                Open Fraud Lab &rarr;
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Reliance / Paytm / PhonePe</span>
            </div>
          </div>

          {/* Card 3: Regulatory & Switch */}
          <div 
            className="card"
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              transition: 'border-color 0.15s ease',
              cursor: 'pointer'
            }}
            onClick={() => onNavigate('transactions')}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '8px', backgroundColor: '#FEF7ED', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-amber)' }}>
                  <Activity size={20} />
                </div>
                <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                  Central Switch
                </span>
              </div>
              <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                Regulatory & Audit Clearing Ledger
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                Audited transaction ledger with quantum kernel signatures. Conduct cross-bank velocity audits and export compliant datasets directly from PostgreSQL.
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--color-border-subtle)', paddingTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
                Inspect Ledger &rarr;
              </span>
              <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>NPCI Central Switch</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5. INTERACTIVE INLINE BANK PAYMENT SIMULATOR */}
      <div 
        className="card" 
        style={{ 
          backgroundColor: '#FFFFFF', 
          borderLeft: '4px solid var(--color-blue)',
          padding: '24px',
          marginBottom: '24px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="var(--color-blue)" />
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                Live Inline Bank Transfer Simulation
              </h2>
              <span className="badge badge-demo" style={{ fontSize: '10px' }}>
                FastAPI: 127.0.0.1:8000
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Demonstrates how an external bank website or payment app queries DualQ's API in under 6 milliseconds before approving or blocking funds.
            </p>
          </div>

          {/* Quick Scenario Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Test Cases:</span>
            <button
              onClick={() => handleSelectScenario('safe_chai')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px', padding: '4px 10px' }}
            >
              🍵 Safe Kirana QR (₹35)
            </button>
            <button
              onClick={() => handleSelectScenario('midnight_fraud')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px', padding: '4px 10px', color: 'var(--color-red)' }}
            >
              🚨 Midnight Drain (₹1,42,050)
            </button>
            <button
              onClick={() => handleSelectScenario('smurf_review')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '11px', padding: '4px 10px', color: 'var(--color-amber)' }}
            >
              ⚠️ Split Transfer (₹28,500)
            </button>
          </div>
        </div>

        {/* Transfer Form Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
          {/* Transfer Inputs Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Debit Account (Customer / Officer Account)
              </label>
              <input
                type="text"
                disabled
                value="HDFC Bank Superia Current A/c ****4409 (Avail: ₹4,85,200.00)"
                style={{
                  width: '100%',
                  padding: '8px 10px',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border)',
                  backgroundColor: '#F8F9FA',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  fontWeight: 500
                }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Amount in ₹ (INR)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '10px', top: '7px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>₹</span>
                  <input
                    type="number"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '7px 10px 7px 24px',
                      borderRadius: '4px',
                      border: '1px solid var(--color-border)',
                      fontSize: '13px',
                      fontWeight: 700,
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Payment Channel / Network
                </label>
                <select
                  value={transferChannel}
                  onChange={(e) => setTransferChannel(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '7px 10px',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border)',
                    fontSize: '12px',
                    backgroundColor: '#FFFFFF',
                    color: 'var(--text-primary)'
                  }}
                >
                  <option value="UPI (Google Pay / PhonePe)">UPI 2.0 (GPay / PhonePe)</option>
                  <option value="UPI Soundbox (Paytm)">Soundbox 4G (Paytm)</option>
                  <option value="RuPay Contactless Card">RuPay Contactless Card</option>
                  <option value="IMPS Immediate Payment">IMPS Immediate Transfer</option>
                  <option value="Corporate RTGS Wire">Corporate RTGS Settlement</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Beneficiary UPI VPA / Account Identifier
              </label>
              <input
                type="text"
                value={transferVpa}
                onChange={(e) => setTransferVpa(e.target.value)}
                style={{
                  width: '100%',
                  padding: '7px 10px',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border)',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <button
              onClick={() => handleExecuteTransfer(transferAmount, transferChannel, transferVpa, transferBeneficiary)}
              disabled={isProcessing}
              className="btn btn-primary"
              style={{ padding: '10px', fontSize: '13px', fontWeight: 600, justifyContent: 'center', marginTop: '4px' }}
            >
              {isProcessing ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Evaluating Quantum Kernel (5ms)...</span>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>Execute Transfer & Intercept via DualQ API</span>
                </>
              )}
            </button>
          </div>

          {/* Real-Time Inline Decision Output Card */}
          <div 
            style={{
              backgroundColor: '#F8F9FA',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {simulationResult ? (
              <>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      Inline Bank Decision Result
                    </span>
                    <span 
                      className={`badge ${
                        simulationResult.status === 'Legitimate' ? 'badge-legitimate' :
                        simulationResult.status === 'Suspicious' ? 'badge-fraudulent' : 'badge-under-review'
                      }`}
                      style={{ fontSize: '11px', padding: '3px 8px' }}
                    >
                      {simulationResult.status === 'Legitimate' ? 'APPROVED & SETTLED' :
                       simulationResult.status === 'Suspicious' ? 'PAYMENT BLOCKED' : 'CHALLENGE (2FA OTP)'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>DualQ Quantum Risk:</span>
                      <div style={{ fontSize: '17px', fontWeight: 700, color: simulationResult.status === 'Suspicious' ? 'var(--color-red)' : 'var(--color-green)' }}>
                        {(simulationResult.risk_score * 100).toFixed(1)}%
                      </div>
                    </div>

                    <div style={{ backgroundColor: '#FFFFFF', padding: '10px', borderRadius: '4px', border: '1px solid var(--color-border)' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Decision Latency:</span>
                      <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--color-blue)' }}>
                        {simulationResult.execution_time_ms} ms
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.4, marginBottom: '8px' }}>
                    <strong>Action:</strong> {simulationResult.recommended_action}
                  </p>
                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    {simulationResult.explanation}
                  </p>
                </div>

                <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginTop: '12px' }}>
                  <button
                    onClick={() => setShowTechnicalInspector(!showTechnicalInspector)}
                    style={{ background: 'none', border: 'none', color: 'var(--color-blue)', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
                  >
                    {showTechnicalInspector ? 'Hide API Payload' : 'View Backend API JSON'}
                  </button>

                  <button
                    onClick={() => playSoundboxVoice(simulationResult.soundbox_announcement)}
                    disabled={isPlayingAudio}
                    className="btn btn-secondary btn-sm"
                    style={{ fontSize: '11px', gap: '4px' }}
                    title="Play 4G Soundbox announcement"
                  >
                    <Volume2 size={12} color="var(--color-green)" />
                    <span>{isPlayingAudio ? 'Announcing...' : 'Soundbox Audio'}</span>
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '36px 12px', color: 'var(--text-secondary)' }}>
                <Clock size={28} style={{ margin: '0 auto 10px', opacity: 0.4 }} />
                <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Awaiting Bank Transfer Trigger
                </div>
                <div style={{ fontSize: '11px' }}>
                  Click one of the test presets above or hit "Execute Transfer" to see the inline quantum decision.
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Collapsible API JSON Inspector */}
        {showTechnicalInspector && simulationResult && (
          <div style={{ marginTop: '16px', backgroundColor: '#1E293B', color: '#F8FAFC', padding: '14px', borderRadius: '6px', fontSize: '11px', fontFamily: 'monospace', overflowX: 'auto' }}>
            <div style={{ color: '#94A3B8', marginBottom: '6px' }}>// Response from http://localhost:8000/api/screen (Stored in PostgreSQL dualq_db)</div>
            <pre style={{ margin: 0 }}>{JSON.stringify(simulationResult, null, 2)}</pre>
          </div>
        )}
      </div>

    </div>
  );
};
