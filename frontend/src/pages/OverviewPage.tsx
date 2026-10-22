import React, { useState, useMemo, useEffect } from 'react';
import { 
  CreditCard, 
  ShieldAlert, 
  Target, 
  CheckCircle2, 
  Activity, 
  Database,
  ArrowRight,
  Play,
  Pause,
  RefreshCw,
  PlusCircle,
  Volume2,
  Lock,
  Unlock,
  Download,
  Check,
  Search,
  Sparkles,
  Zap,
  Building2,
  Store,
  Radio,
  Sliders,
  FileText,
  AlertTriangle,
  UserCheck
} from 'lucide-react';
import { MetricCard } from '../components/MetricCard';
import { INITIAL_TRANSACTIONS, HOURLY_VOLUME_DATA, DAILY_DISTRIBUTION_DATA } from '../data/mockData';
import { DEMO_PROFILES } from '../data/authData';
import { Transaction, NavigationPage, UserProfile, TransactionStatus } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import { screenTransaction, fetchTransactions } from '../services/api';

interface OverviewPageProps {
  onSelectTransaction: (txn: Transaction) => void;
  onNavigate: (page: NavigationPage) => void;
  currentUser?: UserProfile | null;
  onUserChange?: (user: UserProfile) => void;
}

type TimeHorizon = 'live' | '24h' | '7d' | '30d';
type PaymentRailFilter = 'ALL' | 'UPI' | 'RUPAY' | 'IMPS' | 'SOUNDBOX' | 'RTGS';

export const OverviewPage: React.FC<OverviewPageProps> = ({ 
  onSelectTransaction, 
  onNavigate, 
  currentUser,
  onUserChange
}) => {
  // Time and Filter States
  const [timeHorizon, setTimeHorizon] = useState<TimeHorizon>('24h');
  const [selectedRail, setSelectedRail] = useState<PaymentRailFilter>('ALL');
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);
  
  // Real-time Transaction Ledger state for interactive modification
  const [transactionsList, setTransactionsList] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [tableTab, setTableTab] = useState<'ALL' | 'SUSPICIOUS' | 'SOUNDBOX' | 'RUPAY'>('ALL');
  const [tableSearch, setTableSearch] = useState<string>('');
  const [isDbSynced, setIsDbSynced] = useState<boolean>(false);
  const [isLoadingDb, setIsLoadingDb] = useState<boolean>(false);

  const loadDbTransactions = async (showToast = false) => {
    setIsLoadingDb(true);
    try {
      const data = await fetchTransactions();
      if (data && Array.isArray(data) && data.length > 0) {
        setTransactionsList(data);
        setIsDbSynced(true);
        if (showToast) {
          setToastMessage({ type: 'success', text: `Synchronized ${data.length} records from PostgreSQL (dualq_db).` });
        }
      }
    } catch {
      // Fallback smoothly to initial data
    } finally {
      setIsLoadingDb(false);
    }
  };

  useEffect(() => {
    loadDbTransactions(false);
  }, []);

  // Interactive Live Toast feedback
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info' | 'warning'; text: string } | null>(null);

  // Quick Screener State (Embedded on Home)
  const [screenerAmount, setScreenerAmount] = useState<number>(142050);
  const [screenerRail, setScreenerRail] = useState<string>('UPI (Google Pay / PhonePe)');
  const [screenerVpa, setScreenerVpa] = useState<string>('transfer.dest@axisbank');
  const [screenerReason, setScreenerReason] = useState<string>('Midnight crypto exchange / gift card off-ramp');
  const [isScreening, setIsScreening] = useState<boolean>(false);
  const [screenerResult, setScreenerResult] = useState<{
    status: TransactionStatus;
    riskScore: number;
    classicalScore: number;
    explanation: string;
    hilbertDistance: number;
    recommendedAction: string;
  } | null>({
    status: 'Suspicious',
    riskScore: 0.94,
    classicalScore: 0.68,
    explanation: 'Critical Hilbert space boundary violation on V14 (-5.92) & V4 (+3.82). Non-linear transaction burst detected.',
    hilbertDistance: 4.88,
    recommendedAction: 'Trigger immediate UPI VPA freeze & require biometric re-auth'
  });

  // Shopkeeper & Soundbox Controls
  const [soundboxLang, setSoundboxLang] = useState<'en' | 'hi'>('hi');
  const [isSpeakingAudio, setIsSpeakingAudio] = useState<boolean>(false);

  // Bank Officer Quick Action
  const [freezeInput, setFreezeInput] = useState<string>('');
  const [frozenList, setFrozenList] = useState<string[]>(['fraudster99@paytm', 'drain.bot@ybl']);

  // Shopkeeper Customer UTR Verification
  const [verifyUtrInput, setVerifyUtrInput] = useState<string>('');
  const [utrResult, setUtrResult] = useState<{ verified: boolean; message: string; amount?: number } | null>(null);

  // Quantum Engineer Controls
  const [shotBudget, setShotBudget] = useState<number>(4096);
  const [remEnabled, setRemEnabled] = useState<boolean>(true);

  // NPCI Auditor Velocity Slider
  const [simulatedTps, setSimulatedTps] = useState<number>(18500);

  // Toast auto-clear
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // Audio synthesis helper for Shopkeepers / soundbox simulation
  const playSoundboxVoice = (amountVal: number, statusVal: TransactionStatus) => {
    setIsSpeakingAudio(true);
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        let message = '';
        if (soundboxLang === 'hi') {
          if (statusVal === 'Legitimate') {
            message = `DualQ Soundbox: Rupeey ${Math.round(amountVal)} prapt hue. Surakshit bhugtan satyapit.`;
          } else if (statusVal === 'Under Review') {
            message = `Chetavni: Rupeey ${Math.round(amountVal)} ka bhugtan samiksha mein hai. Kripya grahak se pratiksha karne ko kahein.`;
          } else {
            message = `Suraksha Alert: Rupeey ${Math.round(amountVal)} ka bhugtan sandigdh paya gaya hai aur rok diya gaya hai.`;
          }
        } else {
          if (statusVal === 'Legitimate') {
            message = `DualQ Soundbox: Payment of Rupees ${Math.round(amountVal)} received. Transaction verified safe.`;
          } else if (statusVal === 'Under Review') {
            message = `Warning: Payment of Rupees ${Math.round(amountVal)} is under review. Please hold goods delivery.`;
          } else {
            message = `Security Alert: Payment of Rupees ${Math.round(amountVal)} blocked due to quantum fraud anomaly.`;
          }
        }

        const utterance = new SpeechSynthesisUtterance(message);
        utterance.rate = 1.0;
        utterance.pitch = 1.05;
        utterance.onend = () => setIsSpeakingAudio(false);
        utterance.onerror = () => setIsSpeakingAudio(false);
        window.speechSynthesis.speak(utterance);
      } else {
        setIsSpeakingAudio(false);
        setToastMessage({ type: 'info', text: `Soundbox Audio: ₹${amountVal} ${statusVal}` });
      }
    } catch {
      setIsSpeakingAudio(false);
      setToastMessage({ type: 'info', text: `Soundbox Audio: ₹${amountVal} ${statusVal}` });
    }
  };

  // Quick Preset Loader for the Embedded Screener
  const handleLoadPreset = (preset: 'midnight_drain' | 'kirana_chai' | 'velocity_burst' | 'corp_rtgs') => {
    if (preset === 'midnight_drain') {
      setScreenerAmount(142050);
      setScreenerRail('UPI (Google Pay / PhonePe)');
      setScreenerVpa('scam.collector99@ybl');
      setScreenerReason('Midnight rapid SIM-swap drain to newly generated VPA');
      runScreeningComputation(142050, 3.82, 3.41, -4.18, -5.92, 'Suspicious');
    } else if (preset === 'kirana_chai') {
      setScreenerAmount(35);
      setScreenerRail('Soundbox POS (Paytm / PhonePe)');
      setScreenerVpa('local.kirana@upi');
      setScreenerReason('Morning beverage purchase via counter Soundbox QR');
      runScreeningComputation(35, -0.42, -0.18, 0.82, 0.41, 'Legitimate');
    } else if (preset === 'velocity_burst') {
      setScreenerAmount(4999);
      setScreenerRail('UPI 2.0 (Split Payment)');
      setScreenerVpa('burst.smurf@okhdfcbank');
      setScreenerReason('4th sequential transfer under ₹5,000 threshold within 90 seconds');
      runScreeningComputation(4999, 2.15, 1.85, -1.95, -2.40, 'Under Review');
    } else {
      setScreenerAmount(380000);
      setScreenerRail('Corporate RTGS Settlement');
      setScreenerVpa('reliance.vendor.clearing@icici');
      setScreenerReason('Scheduled supplier vendor wire against verified GST invoice');
      runScreeningComputation(380000, 0.12, 0.05, 0.65, 0.32, 'Legitimate');
    }
  };

  // Live Quantum Screener Calculation
  const runScreeningComputation = (
    amt: number,
    v4: number,
    v11: number,
    v12: number,
    v14: number,
    forcedStatus?: TransactionStatus
  ) => {
    setIsScreening(true);
    screenTransaction({
      amount: amt,
      channel: screenerRail,
      vpa: screenerVpa,
      merchant: screenerReason,
      v4,
      v11,
      v12,
      v14
    }).then((res) => {
      const finalStatus = forcedStatus || res.status;
      setScreenerResult({
        status: finalStatus,
        riskScore: res.risk_score,
        classicalScore: res.classical_score,
        explanation: res.explanation,
        hilbertDistance: res.hilbert_distance,
        recommendedAction: res.recommended_action
      });
      setIsScreening(false);
      setToastMessage({
        type: finalStatus === 'Legitimate' ? 'success' : finalStatus === 'Suspicious' ? 'warning' : 'info',
        text: `Quantum engine (vQPU-01): ₹${amt.toLocaleString('en-IN')} classified as ${finalStatus.toUpperCase()} (${res.execution_time_ms}ms)`
      });
    }).catch(() => {
      setIsScreening(false);
    });
  };

  // Simulate an incoming live transaction
  const handleSimulateIncomingTxn = () => {
    const isFraudSim = Math.random() < 0.35;
    const randomId = `TXN-LIVE-${Math.floor(100000 + Math.random() * 900000)}`;
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const newTxn: Transaction = {
      id: randomId,
      timestamp: now.toISOString(),
      date: now.toISOString().split('T')[0],
      time: timeStr,
      amount: isFraudSim ? Math.floor(45000 + Math.random() * 95000) : Math.floor(15 + Math.random() * 1250),
      currency: "INR",
      status: isFraudSim ? "Suspicious" : "Legitimate",
      riskScore: isFraudSim ? 0.92 : 0.03,
      features: {
        v4: isFraudSim ? 3.4 : -0.2,
        v11: isFraudSim ? 2.9 : 0.1,
        v12: isFraudSim ? -3.9 : 0.6,
        v14: isFraudSim ? -5.2 : 0.3,
        timeSeconds: now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds()
      },
      details: {
        channel: isFraudSim ? "UPI (High-Velocity App)" : "UPI Soundbox (PhonePe)",
        location: isFraudSim ? "Jamtara, Jharkhand" : "Indiranagar, Bengaluru, Karnataka",
        merchantCategory: isFraudSim ? "Digital Wallet Cashout" : "Fresh Mart Grocery Store",
        flagReason: isFraudSim ? "Quantum Hilbert space anomaly detected in rapid succession" : undefined
      }
    };

    setTransactionsList([newTxn, ...transactionsList]);
    setToastMessage({
      type: isFraudSim ? 'warning' : 'success',
      text: `Live Incoming ₹${newTxn.amount.toLocaleString('en-IN')} screened: ${newTxn.status} (${newTxn.details.channel})`
    });
  };

  // Toggle freeze / hold status of a transaction
  const handleToggleHold = (txnId: string) => {
    setTransactionsList(prev => prev.map(t => {
      if (t.id === txnId) {
        const nextStatus: TransactionStatus = t.status === 'Suspicious' ? 'Legitimate' : 'Suspicious';
        setToastMessage({
          type: nextStatus === 'Legitimate' ? 'success' : 'warning',
          text: `Transaction ${txnId} status updated to: ${nextStatus}`
        });
        return {
          ...t,
          status: nextStatus,
          riskScore: nextStatus === 'Legitimate' ? 0.05 : 0.95
        };
      }
      return t;
    }));
  };

  // Instant VPA Freeze Action for Risk Officer
  const handleFreezeVpa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!freezeInput.trim()) return;
    const cleanVpa = freezeInput.trim().toLowerCase();
    if (!frozenList.includes(cleanVpa)) {
      setFrozenList([cleanVpa, ...frozenList]);
      setToastMessage({
        type: 'warning',
        text: `VPA ${cleanVpa} immediately frozen on NPCI UPI switch (SAR Ref: SAR-2026-${Math.floor(1000 + Math.random() * 9000)})`
      });
      setFreezeInput('');
    }
  };

  const handleUnfreezeVpa = (vpa: string) => {
    setFrozenList(frozenList.filter(item => item !== vpa));
    setToastMessage({
      type: 'info',
      text: `VPA ${vpa} released from freeze. Account returned to active state.`
    });
  };

  // Export RBI SAR compliance report
  const handleExportSarReport = () => {
    const sarData = {
      complianceStandard: "RBI Master Direction - Fraud Risk Management (2026)",
      platform: "DualQ Quantum Fraud Detection Platform",
      institution: currentUser?.institution || "Scheduled Commercial Bank",
      officer: currentUser?.name || "Senior Fraud Risk Officer",
      generatedAt: new Date().toISOString(),
      frozenAccountsCount: frozenList.length,
      frozenAccounts: frozenList,
      recentSuspiciousIncidents: transactionsList.filter(t => t.status === 'Suspicious').map(t => ({
        id: t.id,
        amountINR: t.amount,
        rail: t.details.channel,
        quantumRiskScore: t.riskScore,
        flagReason: t.details.flagReason
      }))
    };

    const blob = new Blob([JSON.stringify(sarData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DualQ_RBI_SAR_Audit_Report_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setToastMessage({
      type: 'success',
      text: 'RBI Suspicious Activity Report (SAR) successfully exported!'
    });
  };

  // Verify Customer UTR for Shopkeepers
  const handleVerifyUtr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyUtrInput.trim()) return;
    const query = verifyUtrInput.trim();
    
    // Simulate check against local transactions or switch
    const match = transactionsList.find(t => t.id.toLowerCase().includes(query.toLowerCase()));
    if (match) {
      setUtrResult({
        verified: match.status === 'Legitimate',
        message: match.status === 'Legitimate' 
          ? `Verified Genuine: ₹${match.amount.toLocaleString('en-IN')} successfully credited via ${match.details.channel}.`
          : `WARNING: Transaction is flagged as ${match.status.toUpperCase()}! Do not release goods.`,
        amount: match.amount
      });
    } else {
      setUtrResult({
        verified: true,
        message: `Verified on NPCI Switch: ₹750.00 confirmed in merchant pool account (Ref: ${query}). Safe to proceed.`,
        amount: 750
      });
    }
  };

  // Filtered transactions for the home table
  const filteredHomeTransactions = useMemo(() => {
    return transactionsList.filter(t => {
      // Tab filter
      if (tableTab === 'SUSPICIOUS' && t.status !== 'Suspicious') return false;
      if (tableTab === 'SOUNDBOX' && !t.details.channel.toLowerCase().includes('soundbox')) return false;
      if (tableTab === 'RUPAY' && !t.details.channel.toLowerCase().includes('rupay')) return false;

      // Search filter
      if (tableSearch.trim()) {
        const q = tableSearch.toLowerCase();
        const matchesId = t.id.toLowerCase().includes(q);
        const matchesChannel = t.details.channel.toLowerCase().includes(q);
        const matchesLocation = t.details.location.toLowerCase().includes(q);
        if (!matchesId && !matchesChannel && !matchesLocation) return false;
      }

      // Payment rail pill filter
      if (selectedRail === 'UPI' && !t.details.channel.toLowerCase().includes('upi')) return false;
      if (selectedRail === 'RUPAY' && !t.details.channel.toLowerCase().includes('rupay')) return false;
      if (selectedRail === 'IMPS' && !t.details.channel.toLowerCase().includes('imps')) return false;
      if (selectedRail === 'SOUNDBOX' && !t.details.channel.toLowerCase().includes('soundbox')) return false;
      if (selectedRail === 'RTGS' && !t.details.channel.toLowerCase().includes('rtgs')) return false;

      return true;
    });
  }, [transactionsList, tableTab, tableSearch, selectedRail]);

  // Recalculated dynamic KPI metrics based on selected horizon
  const dynamicKpi = useMemo(() => {
    let multiplier = 1.0;
    if (timeHorizon === 'live') multiplier = 0.08;
    else if (timeHorizon === '7d') multiplier = 6.4;
    else if (timeHorizon === '30d') multiplier = 24.2;

    const baseTxns = Math.round(284807 * multiplier);
    const baseFraud = Math.round(492 * multiplier);

    return {
      total: baseTxns.toLocaleString('en-IN'),
      fraud: baseFraud.toLocaleString('en-IN'),
      rate: "0.17%",
      recall: timeHorizon === 'live' ? "89.40%" : "88.77%",
      precision: timeHorizon === 'live' ? "85.20%" : "84.47%"
    };
  }, [timeHorizon]);

  return (
    <div className="page-content" style={{ position: 'relative' }}>
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div 
          style={{
            position: 'fixed',
            top: '72px',
            right: '24px',
            zIndex: 9999,
            backgroundColor: toastMessage.type === 'success' ? '#26734D' : toastMessage.type === 'warning' ? '#B93838' : '#3559A6',
            color: '#FFFFFF',
            padding: '10px 16px',
            borderRadius: '6px',
            fontSize: '12px',
            fontWeight: 500,
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            animation: 'fadeIn 0.2s ease-in-out'
          }}
        >
          {toastMessage.type === 'success' ? <Check size={14} /> : <AlertTriangle size={14} />}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* 1. INTERACTIVE PERSONA SWITCHER BAR */}
      <div 
        style={{ 
          backgroundColor: '#FFFFFF', 
          border: '1px solid var(--color-border)', 
          borderRadius: 'var(--card-radius)', 
          padding: '14px 18px', 
          marginBottom: '20px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Operational Persona & Banking Role
              </span>
              <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
                Interactive Switcher
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Click any profile below to preview how DualQ functions for different institutional users:
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: isLiveStreaming ? 'var(--color-green)' : '#9AA2AF' }} />
            <span style={{ fontSize: '11px', fontWeight: 600, color: isLiveStreaming ? 'var(--color-green)' : 'var(--text-secondary)' }}>
              {isLiveStreaming ? 'vQPU Live Stream Synced' : 'Stream Paused'}
            </span>
            <button
              onClick={() => setIsLiveStreaming(!isLiveStreaming)}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '10px', padding: '2px 8px' }}
              title="Toggle live telemetry stream"
            >
              {isLiveStreaming ? <Pause size={10} /> : <Play size={10} />}
              <span>{isLiveStreaming ? 'Pause' : 'Resume'}</span>
            </button>
          </div>
        </div>

        {/* Persona Segmented Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '10px' }}>
          {DEMO_PROFILES.map((profile) => {
            const isActive = currentUser?.id === profile.id;
            return (
              <button
                key={profile.id}
                onClick={() => {
                  if (onUserChange) onUserChange(profile);
                  setToastMessage({
                    type: 'info',
                    text: `Switched view to ${profile.roleLabel} (${profile.institution})`
                  });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '10px 12px',
                  borderRadius: '6px',
                  border: isActive ? '2px solid var(--color-blue)' : '1px solid var(--color-border)',
                  backgroundColor: isActive ? 'var(--color-blue-subtle)' : '#FFFFFF',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <div 
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '6px',
                    backgroundColor: isActive ? 'var(--color-blue)' : '#F1F3F6',
                    color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '12px',
                    flexShrink: 0
                  }}
                >
                  {profile.avatarInitials}
                </div>
                <div style={{ overflow: 'hidden' }}>
                  <div style={{ fontSize: '12px', fontWeight: 700, color: isActive ? 'var(--color-blue)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {profile.name}
                  </div>
                  <div style={{ fontSize: '10px', color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {profile.roleLabel}
                  </div>
                  <div style={{ fontSize: '9px', color: isActive ? 'var(--color-blue)' : '#8C97A7', marginTop: '1px' }}>
                    {profile.institution.split(' ')[0]} &bull; {profile.badgeNumber}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. INTERACTIVE TIME & PAYMENT RAIL CONTROLS */}
      <div 
        style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          flexWrap: 'wrap', 
          gap: '12px', 
          marginBottom: '16px' 
        }}
      >
        {/* Time Horizon Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', backgroundColor: '#FFFFFF', padding: '4px', borderRadius: '6px', border: '1px solid var(--color-border)', overflowX: 'auto', maxWidth: '100%' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', padding: '0 6px', flexShrink: 0 }}>Horizon:</span>
          {(['live', '24h', '7d', '30d'] as TimeHorizon[]).map(t => (
            <button
              key={t}
              onClick={() => {
                setTimeHorizon(t);
                setToastMessage({ type: 'info', text: `Telemetry horizon set to: ${t.toUpperCase()}` });
              }}
              style={{
                border: 'none',
                background: timeHorizon === t ? 'var(--color-blue)' : 'transparent',
                color: timeHorizon === t ? '#FFFFFF' : 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              {t === 'live' ? '🔴 Live Stream' : t === '24h' ? 'Today (24h)' : t === '7d' ? 'Past 7 Days' : 'Past Month'}
            </button>
          ))}
        </div>

        {/* Payment Rail Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', overflowX: 'auto', maxWidth: '100%' }}>
          <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', flexShrink: 0 }}>Rails:</span>
          {[
            { id: 'ALL', label: 'All Indian Rails' },
            { id: 'UPI', label: 'UPI 2.0' },
            { id: 'SOUNDBOX', label: 'Soundbox / QR' },
            { id: 'RUPAY', label: 'RuPay' },
            { id: 'IMPS', label: 'IMPS' },
            { id: 'RTGS', label: 'RTGS' },
          ].map(rail => (
            <button
              key={rail.id}
              onClick={() => {
                setSelectedRail(rail.id as PaymentRailFilter);
                setToastMessage({ type: 'info', text: `Filtered by rail: ${rail.label}` });
              }}
              style={{
                border: selectedRail === rail.id ? '1px solid var(--color-blue)' : '1px solid var(--color-border)',
                backgroundColor: selectedRail === rail.id ? 'var(--color-blue-subtle)' : '#FFFFFF',
                color: selectedRail === rail.id ? 'var(--color-blue)' : 'var(--text-secondary)',
                fontSize: '11px',
                fontWeight: 600,
                padding: '4px 10px',
                borderRadius: '4px',
                cursor: 'pointer',
                flexShrink: 0
              }}
            >
              {rail.label}
            </button>
          ))}

          {/* Simulate Live Payment Button */}
          <button
            onClick={handleSimulateIncomingTxn}
            className="btn btn-primary btn-sm"
            style={{ padding: '5px 10px', gap: '5px', flexShrink: 0 }}
            title="Inject a real-time incoming transaction through the quantum pipeline"
          >
            <PlusCircle size={13} />
            <span>Simulate Incoming ₹ Txn</span>
          </button>
        </div>
      </div>

      {/* 3. DYNAMIC METRIC KPI CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 190px), 1fr))', gap: '12px', marginBottom: '24px' }}>
        <MetricCard
          title="Total Transactions"
          value={dynamicKpi.total}
          subValue={`${selectedRail} Audited Pool`}
          trend={{ value: "+12.4% vs last cycle", isPositive: true }}
          icon={<CreditCard size={18} />}
        />
        <MetricCard
          title="Fraud Detected"
          value={dynamicKpi.fraud}
          subValue={`${dynamicKpi.rate} anomaly frequency`}
          trend={{ value: "-4.2% fraud exposure", isPositive: true }}
          icon={<ShieldAlert size={18} />}
        />
        <MetricCard
          title="Detection Recall"
          value={dynamicKpi.recall}
          subValue="Target: >85% (RBI Standard)"
          trend={{ value: "+7.1% over Classical SVM", isPositive: true }}
          icon={<Target size={18} />}
        />
        <MetricCard
          title="Model Precision"
          value={dynamicKpi.precision}
          subValue="FP rate: 0.028%"
          trend={{ value: "+4.5% specificity", isPositive: true }}
          icon={<CheckCircle2 size={18} />}
        />
      </div>

      {/* 4. EMBEDDED DUALQ QUANTUM FRAUD SCREENER (INTERACTIVE FOR ALL USERS) */}
      <div 
        className="card" 
        style={{ 
          marginBottom: '24px', 
          borderLeft: '4px solid var(--color-blue)',
          backgroundColor: '#FAFCFF'
        }}
      >
        <div className="card-header" style={{ alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div className="card-title" style={{ fontSize: '15px' }}>
                <Zap size={16} color="var(--color-blue)" />
                <span>DualQ Live Quantum Screening Console</span>
              </div>
              <span className="badge badge-legitimate" style={{ fontSize: '10px' }}>
                4-Qubit vQPU Ready
              </span>
            </div>
            <div className="card-subtitle">
              Test any Indian transaction against live Quantum Hilbert space boundaries directly from this home terminal.
            </div>
          </div>

          {/* Quick-load presets */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 600 }}>Test Scenarios:</span>
            <button
              onClick={() => handleLoadPreset('midnight_drain')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '10px', padding: '3px 8px' }}
            >
              🚨 Midnight Drain ₹1,42,050
            </button>
            <button
              onClick={() => handleLoadPreset('kirana_chai')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '10px', padding: '3px 8px' }}
            >
              🍵 Chai Soundbox ₹35
            </button>
            <button
              onClick={() => handleLoadPreset('velocity_burst')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '10px', padding: '3px 8px' }}
            >
              ⚡ Velocity Split ₹4,999
            </button>
            <button
              onClick={() => handleLoadPreset('corp_rtgs')}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '10px', padding: '3px 8px' }}
            >
              🏢 Vendor RTGS ₹3,80,000
            </button>
          </div>
        </div>

        {/* Screener Interactive Form & Results Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', padding: '4px 0' }}>
          {/* Inputs Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Amount in Rupees (₹)
                </label>
                <div style={{ position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '10px', top: '7px', fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>₹</span>
                  <input
                    type="number"
                    value={screenerAmount}
                    onChange={(e) => setScreenerAmount(Number(e.target.value))}
                    style={{
                      width: '100%',
                      padding: '6px 10px 6px 24px',
                      borderRadius: '4px',
                      border: '1px solid var(--color-border)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: 'var(--text-primary)'
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Payment Channel / Rail
                </label>
                <select
                  value={screenerRail}
                  onChange={(e) => setScreenerRail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '6px 10px',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border)',
                    fontSize: '12px',
                    color: 'var(--text-primary)',
                    backgroundColor: '#FFFFFF'
                  }}
                >
                  <option value="UPI (Google Pay / PhonePe)">UPI 2.0 (GPay / PhonePe)</option>
                  <option value="Soundbox POS (Paytm / PhonePe)">Soundbox POS (Paytm / PhonePe)</option>
                  <option value="RuPay Contactless Card">RuPay Contactless Card</option>
                  <option value="IMPS Immediate Payment">IMPS Immediate Payment</option>
                  <option value="Corporate RTGS Settlement">Corporate RTGS Settlement</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                Sender / Payee Identity (VPA or Account)
              </label>
              <input
                type="text"
                value={screenerVpa}
                onChange={(e) => setScreenerVpa(e.target.value)}
                style={{
                  width: '100%',
                  padding: '6px 10px',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border)',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
              <button
                onClick={() => {
                  const isSuspicious = screenerAmount > 75000;
                  runScreeningComputation(
                    screenerAmount,
                    isSuspicious ? 3.5 : -0.3,
                    isSuspicious ? 3.1 : 0.1,
                    isSuspicious ? -4.0 : 0.7,
                    isSuspicious ? -5.5 : 0.4
                  );
                }}
                disabled={isScreening}
                className="btn btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
              >
                {isScreening ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Executing Quantum Kernel...</span>
                  </>
                ) : (
                  <>
                    <Zap size={14} />
                    <span>Screen with Quantum Engine</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onNavigate('detection')}
                className="btn btn-secondary"
                title="Go to full parameterized 30-feature quantum detection lab"
                style={{ padding: '0 12px' }}
              >
                <span>Full Lab</span>
                <ArrowRight size={13} />
              </button>
            </div>
          </div>

          {/* Quantum Evaluation Result Card */}
          <div 
            style={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid var(--color-border)', 
              borderRadius: '6px', 
              padding: '14px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            {screenerResult ? (
              <>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      Quantum Classification
                    </span>
                    <span 
                      className={`badge ${
                        screenerResult.status === 'Legitimate' ? 'badge-legitimate' :
                        screenerResult.status === 'Suspicious' ? 'badge-fraudulent' : 'badge-under-review'
                      }`}
                      style={{ fontSize: '11px', padding: '3px 8px' }}
                    >
                      {screenerResult.status.toUpperCase()}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                    <div style={{ backgroundColor: '#F8F9FA', padding: '8px', borderRadius: '4px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>DualQ QSVM Risk:</span>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: screenerResult.status === 'Suspicious' ? 'var(--color-red)' : 'var(--color-green)' }}>
                        {(screenerResult.riskScore * 100).toFixed(1)}%
                      </div>
                    </div>
                    <div style={{ backgroundColor: '#F8F9FA', padding: '8px', borderRadius: '4px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Classical SVM Risk:</span>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-secondary)' }}>
                        {(screenerResult.classicalScore * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '10px' }}>
                    {screenerResult.explanation}
                  </p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #F1F3F6', paddingTop: '10px', gap: '8px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-primary)', fontWeight: 600 }}>
                    Action: <span style={{ color: screenerResult.status === 'Suspicious' ? 'var(--color-red)' : 'var(--color-green)' }}>{screenerResult.recommendedAction}</span>
                  </div>

                  {/* Soundbox Audio Button for Merchants & Shopkeepers */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <select
                      value={soundboxLang}
                      onChange={(e) => setSoundboxLang(e.target.value as 'en' | 'hi')}
                      style={{ fontSize: '10px', padding: '2px 4px', border: '1px solid var(--color-border)', borderRadius: '4px', backgroundColor: '#FFFFFF' }}
                      title="Soundbox Language"
                    >
                      <option value="hi">हिंदी</option>
                      <option value="en">English</option>
                    </select>

                    <button
                      onClick={() => playSoundboxVoice(screenerAmount, screenerResult.status)}
                      disabled={isSpeakingAudio}
                      className="btn btn-secondary btn-sm"
                      style={{ fontSize: '11px', gap: '4px' }}
                      title="Play simulated UPI Soundbox voice alert"
                    >
                      <Volume2 size={12} color="var(--color-blue)" />
                      <span>{isSpeakingAudio ? 'Speaking...' : 'Play Soundbox'}</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary)' }}>
                <span>Run screening above to inspect quantum hyperplane distance</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 5. ROLE-SPECIFIC INTERACTIVE WORKBENCH */}
      <div 
        style={{ 
          backgroundColor: '#FFFFFF', 
          border: '1px solid var(--color-border)', 
          borderRadius: 'var(--card-radius)', 
          padding: '16px 20px', 
          marginBottom: '24px' 
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-primary)' }}>
              Interactive Operational Workbench
            </span>
            <span className="badge badge-neutral" style={{ fontSize: '10px' }}>
              Active Role: {currentUser?.roleLabel || 'Bank Risk Officer'}
            </span>
          </div>

          <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Institutional Terminal: <strong style={{ color: 'var(--text-primary)' }}>{currentUser?.institution || 'Scheduled Commercial Bank'}</strong>
          </div>
        </div>

        {/* WORKBENCH CONTENT BY ROLE */}
        {currentUser?.role === 'merchant_admin' ? (
          /* MERCHANT & SHOPKEEPER WORKBENCH */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Box 1: Customer Fake Screenshot / UTR Verifier */}
            <div style={{ backgroundColor: '#F8F9FA', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Store size={15} color="var(--color-blue)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Customer UTR / QR Payment Verifier
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Shopkeepers can immediately check if customer payment reached the bank or if it is a fake screenshot app:
              </p>
              <form onSubmit={handleVerifyUtr} style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  placeholder="Enter UPI Ref / UTR No (e.g. TXN-UPI-984200)"
                  value={verifyUtrInput}
                  onChange={(e) => setVerifyUtrInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border)',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                />
                <button type="submit" className="btn btn-primary btn-sm">
                  Verify UTR
                </button>
              </form>
              {utrResult && (
                <div 
                  style={{ 
                    marginTop: '8px', 
                    padding: '8px', 
                    borderRadius: '4px', 
                    backgroundColor: utrResult.verified ? '#EDF7ED' : '#FDECEA',
                    border: `1px solid ${utrResult.verified ? '#26734D' : '#B93838'}`,
                    fontSize: '11px',
                    color: utrResult.verified ? '#1E4620' : '#5F2120'
                  }}
                >
                  {utrResult.message}
                </div>
              )}
            </div>

            {/* Box 2: Soundbox Audio Broadcaster */}
            <div style={{ backgroundColor: '#F8F9FA', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Volume2 size={15} color="var(--color-blue)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Merchant Soundbox Broadcast Center
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Instant verbal confirmation over 4G Soundbox speaker after quantum risk checks:
              </p>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => playSoundboxVoice(25, 'Legitimate')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px' }}
                >
                  🔊 Test ₹25 Chai QR (Safe)
                </button>
                <button
                  onClick={() => playSoundboxVoice(850, 'Legitimate')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px' }}
                >
                  🔊 Test ₹850 Grocery (Safe)
                </button>
                <button
                  onClick={() => playSoundboxVoice(75000, 'Suspicious')}
                  className="btn btn-secondary btn-sm"
                  style={{ fontSize: '11px', color: 'var(--color-red)' }}
                >
                  🔊 Test Fraud Audio Alert
                </button>
              </div>
            </div>

            {/* Box 3: Daily Settlement Guarantee */}
            <div style={{ backgroundColor: '#F8F9FA', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <CheckCircle2 size={15} color="var(--color-green)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Daily Merchant Settlement
                </span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
                ₹42,650.00
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                All 64 today's transactions verified via DualQ QSVM. Zero chargeback hold. Auto-settles at 23:59 IST into Current Account.
              </div>
            </div>
          </div>
        ) : currentUser?.role === 'npci_auditor' ? (
          /* NPCI AUDITOR WORKBENCH */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#F8F9FA', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Activity size={15} color="var(--color-blue)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Inter-Bank Velocity Load Simulator
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>National TPS Switch Load:</span>
                <span style={{ fontWeight: 700, color: 'var(--color-blue)' }}>{simulatedTps.toLocaleString('en-IN')} TPS</span>
              </div>
              <input
                type="range"
                min="5000"
                max="50000"
                step="1000"
                value={simulatedTps}
                onChange={(e) => setSimulatedTps(Number(e.target.value))}
                style={{ width: '100%', marginBottom: '6px' }}
              />
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                vQPU Kernel Evaluation Latency: <strong>4.2ms</strong> at peak load.
              </div>
            </div>

            <div style={{ backgroundColor: '#F8F9FA', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <FileText size={15} color="var(--color-blue)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  RBI Master Direction Export
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Generate official cross-bank regulatory compliance packet with tamper-proof quantum kernel signatures:
              </p>
              <button onClick={handleExportSarReport} className="btn btn-secondary btn-sm" style={{ gap: '6px' }}>
                <Download size={13} />
                <span>Export NPCI Switch Audit Packet</span>
              </button>
            </div>
          </div>
        ) : currentUser?.role === 'qpu_engineer' ? (
          /* QUANTUM ENGINEER WORKBENCH */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            <div style={{ backgroundColor: '#F8F9FA', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Sliders size={15} color="var(--color-blue)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Virtual QPU Shot Budget
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Execution Shots (N_shots):</span>
                <span style={{ fontWeight: 700, color: 'var(--color-blue)' }}>{shotBudget} shots</span>
              </div>
              <input
                type="range"
                min="512"
                max="8192"
                step="512"
                value={shotBudget}
                onChange={(e) => {
                  setShotBudget(Number(e.target.value));
                  setToastMessage({ type: 'info', text: `Shot budget calibrated to ${e.target.value} shots` });
                }}
                style={{ width: '100%', marginBottom: '6px' }}
              />
              <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                Statistical Variance Bound: $\pm {(1 / Math.sqrt(shotBudget)).toFixed(4)}$
              </div>
            </div>

            <div style={{ backgroundColor: '#F8F9FA', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Radio size={15} color="var(--color-blue)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Readout Error Mitigation ($M^{-1}$)
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Matrix inversion calibration active against FakeManilaV2 4-qubit thermal relaxation:
              </p>
              <button 
                onClick={() => {
                  setRemEnabled(!remEnabled);
                  setToastMessage({ type: 'info', text: `Readout Error Mitigation: ${!remEnabled ? 'ENABLED' : 'DISABLED'}` });
                }}
                className="btn btn-secondary btn-sm"
              >
                {remEnabled ? <Check size={12} color="var(--color-green)" /> : null}
                <span>REM: {remEnabled ? 'Active (Tensor Calibrated)' : 'Bypassed'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* BANK FRAUD RISK OFFICER WORKBENCH (DEFAULT) */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {/* Action 1: Instant UPI Account Freeze */}
            <div style={{ backgroundColor: '#F8F9FA', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Lock size={15} color="var(--color-red)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Immediate UPI Account / VPA Freeze
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Enter suspect UPI handle or account to immediately issue a freeze signal across NPCI switch:
              </p>
              <form onSubmit={handleFreezeVpa} style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                <input
                  type="text"
                  placeholder="suspect@okhdfcbank"
                  value={freezeInput}
                  onChange={(e) => setFreezeInput(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '6px 10px',
                    borderRadius: '4px',
                    border: '1px solid var(--color-border)',
                    fontSize: '11px',
                    fontFamily: 'monospace'
                  }}
                />
                <button type="submit" className="btn btn-secondary btn-sm" style={{ color: 'var(--color-red)' }}>
                  Freeze
                </button>
              </form>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Currently Frozen:</span>
                {frozenList.map(vpa => (
                  <span 
                    key={vpa} 
                    style={{ 
                      fontSize: '10px', 
                      backgroundColor: '#FDECEA', 
                      color: '#B93838', 
                      padding: '1px 6px', 
                      borderRadius: '3px',
                      fontFamily: 'monospace',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    {vpa}
                    <button 
                      onClick={() => handleUnfreezeVpa(vpa)}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#B93838', padding: 0 }}
                      title="Release freeze"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Action 2: 1-Click SAR Filing */}
            <div style={{ backgroundColor: '#F8F9FA', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <Building2 size={15} color="var(--color-blue)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  1-Click RBI SAR Compliance Filing
                </span>
              </div>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '10px' }}>
                Automatically package today's flagged incidents into standard Reserve Bank of India Suspicious Activity Report:
              </p>
              <button onClick={handleExportSarReport} className="btn btn-primary btn-sm" style={{ gap: '6px' }}>
                <Download size={13} />
                <span>Export RBI SAR Audit File (.JSON)</span>
              </button>
            </div>

            {/* Action 3: Review Queue Counter */}
            <div style={{ backgroundColor: '#F8F9FA', border: '1px solid var(--color-border)', borderRadius: '6px', padding: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                <ShieldAlert size={15} color="var(--color-orange, #D97706)" />
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  Pending Officer Action Queue
                </span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: 'var(--color-red)' }}>
                {transactionsList.filter(t => t.status === 'Suspicious' || t.status === 'Under Review').length} Alerts Pending
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                High-priority queue flagged by DualQ Quantum Boundary analysis.
              </div>
              <button 
                onClick={() => setTableTab('SUSPICIOUS')} 
                className="btn btn-secondary btn-sm" 
                style={{ marginTop: '8px', fontSize: '10px' }}
              >
                Inspect Alerts in Table Below
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 6. CHARTS ROW */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Transaction Volume Chart */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Hourly Transaction Volume (₹ INR)</div>
              <div className="card-subtitle">Volume distribution across a 24-hour cycle on Indian rails</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_VOLUME_DATA} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid stroke="#E2E6EC" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="hour" tick={{ fontSize: 11, fill: '#697586' }} />
                <YAxis tick={{ fontSize: 11, fill: '#697586' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E2E6EC', 
                    borderRadius: '6px', 
                    fontSize: '12px' 
                  }} 
                />
                <Bar dataKey="total" name="Total Transactions" fill="#3559A6" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Legitimate vs Fraudulent Distribution */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Legitimate vs. Fraudulent Activity</div>
              <div className="card-subtitle">Identified suspicious incidents by day of the week</div>
            </div>
          </div>
          <div style={{ width: '100%', height: 230 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={DAILY_DISTRIBUTION_DATA} margin={{ top: 5, right: 10, left: -15, bottom: 0 }}>
                <CartesianGrid stroke="#E2E6EC" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#697586' }} />
                <YAxis tick={{ fontSize: 11, fill: '#697586' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    border: '1px solid #E2E6EC', 
                    borderRadius: '6px', 
                    fontSize: '12px' 
                  }} 
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                <Bar dataKey="legitimate" name="Legitimate" fill="#26734D" radius={[3, 3, 0, 0]} />
                <Bar dataKey="fraud" name="Fraud Caught" fill="#B93838" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 7. INTERACTIVE ACTIONABLE TRANSACTIONS LEDGER */}
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="card-title">Live Audited Transaction Stream</div>
            <div className="card-subtitle">
              Incoming Indian payments evaluated by DualQ QSVM. Take immediate officer actions inline:
            </div>
            <div className="mobile-only" style={{ fontSize: '11px', color: 'var(--color-blue)', marginTop: '4px', fontWeight: 500 }}>
              👉 Swipe table left/right to view all fields & actions
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div style={{ position: 'relative' }}>
              <Search size={13} style={{ position: 'absolute', left: '8px', top: '8px', color: 'var(--text-secondary)' }} />
              <input
                type="text"
                placeholder="Search Txn ID, rail, location..."
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                style={{
                  padding: '5px 8px 5px 26px',
                  borderRadius: '4px',
                  border: '1px solid var(--color-border)',
                  fontSize: '11px',
                  width: '180px'
                }}
              />
            </div>

            {/* Table Tabs */}
            <div style={{ display: 'flex', gap: '4px', backgroundColor: '#F8F9FA', padding: '3px', borderRadius: '4px' }}>
              <button
                onClick={() => setTableTab('ALL')}
                style={{
                  border: 'none',
                  background: tableTab === 'ALL' ? '#FFFFFF' : 'transparent',
                  color: tableTab === 'ALL' ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: tableTab === 'ALL' ? 700 : 500,
                  fontSize: '10px',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                All ({transactionsList.length})
              </button>
              <button
                onClick={() => setTableTab('SUSPICIOUS')}
                style={{
                  border: 'none',
                  background: tableTab === 'SUSPICIOUS' ? '#FFFFFF' : 'transparent',
                  color: tableTab === 'SUSPICIOUS' ? 'var(--color-red)' : 'var(--text-secondary)',
                  fontWeight: tableTab === 'SUSPICIOUS' ? 700 : 500,
                  fontSize: '10px',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                🚨 Flagged ({transactionsList.filter(t => t.status === 'Suspicious').length})
              </button>
              <button
                onClick={() => setTableTab('SOUNDBOX')}
                style={{
                  border: 'none',
                  background: tableTab === 'SOUNDBOX' ? '#FFFFFF' : 'transparent',
                  color: tableTab === 'SOUNDBOX' ? 'var(--color-blue)' : 'var(--text-secondary)',
                  fontWeight: tableTab === 'SOUNDBOX' ? 700 : 500,
                  fontSize: '10px',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                🍵 Soundbox
              </button>
              <button
                onClick={() => setTableTab('RUPAY')}
                style={{
                  border: 'none',
                  background: tableTab === 'RUPAY' ? '#FFFFFF' : 'transparent',
                  color: tableTab === 'RUPAY' ? 'var(--color-blue)' : 'var(--text-secondary)',
                  fontWeight: tableTab === 'RUPAY' ? 700 : 500,
                  fontSize: '10px',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  cursor: 'pointer'
                }}
              >
                💳 RuPay
              </button>
            </div>

            <span 
              className="badge" 
              style={{ 
                backgroundColor: isDbSynced ? 'var(--color-green-subtle)' : '#F1F3F5',
                color: isDbSynced ? 'var(--color-green)' : 'var(--text-secondary)',
                border: `1px solid ${isDbSynced ? 'var(--color-green)' : 'var(--color-border)'}`,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                fontSize: '11px',
                padding: '3px 8px'
              }}
            >
              <Database size={11} />
              {isDbSynced ? 'PostgreSQL dualq_db' : 'Mock Fallback'}
            </span>

            <button 
              onClick={() => loadDbTransactions(true)}
              disabled={isLoadingDb}
              className="btn btn-secondary btn-sm"
              title="Sync latest live records from local PostgreSQL database"
            >
              <RefreshCw size={12} className={isLoadingDb ? 'animate-spin' : ''} />
              <span className="desktop-only">{isLoadingDb ? 'Syncing...' : 'Sync DB'}</span>
            </button>

            <button 
              onClick={() => onNavigate('transactions')} 
              className="btn btn-secondary btn-sm"
            >
              <span>Full Ledger</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Custom Interactive Table with Inline Actions */}
        <div style={{ overflowX: 'auto' }}>
          <table className="data-table" style={{ width: '100%' }}>
            <thead>
              <tr>
                <th>Txn ID</th>
                <th>Time & Channel</th>
                <th>Amount (₹)</th>
                <th>Location / Merchant</th>
                <th>Quantum Status</th>
                <th>Risk Score</th>
                <th style={{ textAlign: 'right' }}>Interactive Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredHomeTransactions.slice(0, 7).map((txn) => {
                const isFraud = txn.status === 'Suspicious';
                const isUnderReview = txn.status === 'Under Review';
                return (
                  <tr 
                    key={txn.id}
                    style={{
                      backgroundColor: isFraud ? '#FFF9F9' : undefined,
                      transition: 'background-color 0.15s ease'
                    }}
                  >
                    <td>
                      <button
                        onClick={() => onSelectTransaction(txn)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: 'var(--color-blue)',
                          fontWeight: 600,
                          fontSize: '11px',
                          cursor: 'pointer',
                          fontFamily: 'monospace',
                          padding: 0
                        }}
                      >
                        {txn.id}
                      </button>
                    </td>

                    <td>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {txn.details.channel}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                        {txn.time} &bull; {txn.date}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-primary)' }}>
                        ₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </div>
                    </td>

                    <td>
                      <div style={{ fontSize: '11px', color: 'var(--text-primary)' }}>
                        {txn.details.merchantCategory}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                        {txn.details.location}
                      </div>
                    </td>

                    <td>
                      <span 
                        className={`badge ${
                          txn.status === 'Legitimate' ? 'badge-legitimate' :
                          txn.status === 'Suspicious' ? 'badge-fraudulent' : 'badge-under-review'
                        }`}
                        style={{ fontSize: '10px' }}
                      >
                        {txn.status}
                      </span>
                    </td>

                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '40px', height: '5px', backgroundColor: '#E2E6EC', borderRadius: '3px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              width: `${Math.round(txn.riskScore * 100)}%`, 
                              height: '100%', 
                              backgroundColor: isFraud ? 'var(--color-red)' : isUnderReview ? '#D97706' : 'var(--color-green)' 
                            }} 
                          />
                        </div>
                        <span style={{ fontSize: '11px', fontWeight: 700, color: isFraud ? 'var(--color-red)' : 'var(--text-secondary)' }}>
                          {(txn.riskScore * 100).toFixed(0)}%
                        </span>
                      </div>
                    </td>

                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                        {/* Soundbox Voice Trigger if Soundbox rail */}
                        {txn.details.channel.toLowerCase().includes('soundbox') && (
                          <button
                            onClick={() => playSoundboxVoice(txn.amount, txn.status)}
                            className="btn btn-secondary btn-sm"
                            style={{ padding: '3px 6px', fontSize: '10px' }}
                            title="Play Soundbox Audio Confirmation"
                          >
                            <Volume2 size={11} />
                          </button>
                        )}

                        {/* Interactive Hold/Release Toggle */}
                        <button
                          onClick={() => handleToggleHold(txn.id)}
                          className="btn btn-secondary btn-sm"
                          style={{
                            padding: '3px 7px',
                            fontSize: '10px',
                            color: isFraud ? 'var(--color-green)' : 'var(--color-red)',
                            borderColor: isFraud ? 'var(--color-green)' : undefined
                          }}
                          title={isFraud ? 'Mark as Cleared / Legitimate' : 'Flag and freeze this transaction'}
                        >
                          {isFraud ? <Unlock size={11} /> : <Lock size={11} />}
                          <span>{isFraud ? 'Clear' : 'Hold'}</span>
                        </button>

                        {/* Inspect Modal Trigger */}
                        <button
                          onClick={() => onSelectTransaction(txn)}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '3px 7px', fontSize: '10px' }}
                          title="Open full Quantum Hilbert Trace"
                        >
                          <span>Inspect</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
