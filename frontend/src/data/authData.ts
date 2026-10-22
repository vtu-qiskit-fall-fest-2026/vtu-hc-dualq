import { UserProfile, BankInstitution } from '../types';

export const INSTITUTIONS: BankInstitution[] = [
  {
    id: "HDFC",
    name: "HDFC Bank Ltd",
    shortName: "HDFC Bank",
    category: "Scheduled Commercial Bank",
    ifscPrefix: "HDFC000",
    nodeStatus: "Active (vQPU Synced)"
  },
  {
    id: "SBI",
    name: "State Bank of India",
    shortName: "SBI",
    category: "Scheduled Commercial Bank",
    ifscPrefix: "SBIN000",
    nodeStatus: "Active (vQPU Synced)"
  },
  {
    id: "ICICI",
    name: "ICICI Bank Ltd",
    shortName: "ICICI Bank",
    category: "Scheduled Commercial Bank",
    ifscPrefix: "ICIC000",
    nodeStatus: "Active (vQPU Synced)"
  },
  {
    id: "NPCI",
    name: "National Payments Corporation of India",
    shortName: "NPCI Central Switch",
    category: "Payment Switch / Clearing",
    ifscPrefix: "NPCI000",
    nodeStatus: "Active (vQPU Synced)"
  },
  {
    id: "RELIANCE",
    name: "Reliance Retail & JioMart Enterprise",
    shortName: "Reliance Retail",
    category: "Retail Conglomerate",
    ifscPrefix: "RELI000",
    nodeStatus: "Active (Secondary Node)"
  },
  {
    id: "AXIS",
    name: "Axis Bank Ltd",
    shortName: "Axis Bank",
    category: "Scheduled Commercial Bank",
    ifscPrefix: "UTIB000",
    nodeStatus: "Active (vQPU Synced)"
  }
];

export const DEMO_PROFILES: UserProfile[] = [
  {
    id: "USR-HDFC-01",
    name: "Rajesh K. Verma",
    email: "rajesh.verma@hdfcbank.com",
    role: "bank_risk_officer",
    roleLabel: "Senior Fraud Risk Officer",
    institution: "HDFC Bank Ltd",
    institutionType: "Commercial Bank",
    branchCode: "HDFC-MUM-04",
    badgeNumber: "HDFC-RISK-4409",
    avatarInitials: "RV",
    permissions: [
      "Review & Override Suspicious Transactions",
      "Immediate UPI Account Hold & Release",
      "Trigger RBI Suspicious Activity Report (SAR)",
      "Evaluate Quantum Hilbert State Bounds"
    ]
  },
  {
    id: "USR-NPCI-02",
    name: "Dr. Sunita Deshmukh",
    email: "sunita.deshmukh@npci.org.in",
    role: "npci_auditor",
    roleLabel: "Principal Regulatory Auditor",
    institution: "National Payments Corporation of India",
    institutionType: "Central Regulatory Switch",
    branchCode: "NPCI-HQ-BKC",
    badgeNumber: "NPCI-AUD-0108",
    avatarInitials: "SD",
    permissions: [
      "National Inter-Bank Velocity Audit",
      "Cross-Institution Fraud Pattern Tracing",
      "RBI Master Direction Compliance Export",
      "Inspect Supervised QSVC Hyperplanes"
    ]
  },
  {
    id: "USR-RELI-03",
    name: "Vikramaditya Singhania",
    email: "v.singhania@relianceretail.com",
    role: "merchant_admin",
    roleLabel: "Enterprise Loss Prevention Lead",
    institution: "Reliance Retail & JioMart Enterprise",
    institutionType: "Enterprise Retailer",
    branchCode: "RELI-CORP-NAV",
    badgeNumber: "REL-LP-9281",
    avatarInitials: "VS",
    permissions: [
      "Store POS & Soundbox Fraud Monitor",
      "Chargeback Prevention & Dispute Filing",
      "High-Value Order Handover Verification",
      "Merchant Settlement Risk Analytics"
    ]
  },
  {
    id: "USR-AGY-04",
    name: "Ananya Iyer",
    email: "ananya.iyer@qpu.quantum.internal",
    role: "qpu_engineer",
    roleLabel: "Quantum Infrastructure Engineer",
    institution: "On-Premises Quantum Computing Operations",
    institutionType: "Quantum Infrastructure",
    branchCode: "QPU-NODE-PRIMARY",
    badgeNumber: "AGY-QPU-0042",
    avatarInitials: "AI",
    permissions: [
      "Virtual QPU Pulse Calibration & Tuning",
      "M^-1 Readout Error Mitigation Controls",
      "Feature Map Variational Angle Optimizer (KTA)",
      "Barren Plateau Spectral Monitoring"
    ]
  }
];

const AUTH_STORAGE_KEY = "bharatshield_auth_user";

export const getStoredUser = (): UserProfile | null => {
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return DEMO_PROFILES[0]; // Default logged-in as Senior Risk Officer for convenience
    return JSON.parse(raw);
  } catch {
    return DEMO_PROFILES[0];
  }
};

export const setStoredUser = (user: UserProfile | null) => {
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (e) {
    console.error("Failed to update auth storage", e);
  }
};
