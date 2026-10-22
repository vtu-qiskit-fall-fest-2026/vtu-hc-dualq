export type NavigationPage = 
  | 'home'
  | 'overview'
  | 'transactions'
  | 'detection'
  | 'performance'
  | 'kernel'
  | 'dataset'
  | 'settings';

export type TransactionStatus = 'Legitimate' | 'Suspicious' | 'Under Review';

export interface Transaction {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  amount: number;
  currency: string;
  status: TransactionStatus;
  riskScore: number; // 0.0 to 1.0
  features: {
    v4: number;
    v11: number;
    v12: number;
    v14: number;
    timeSeconds: number;
    [key: string]: number;
  };
  details: {
    channel: string;
    location: string;
    merchantCategory: string;
    flagReason?: string;
  };
}

export interface MetricCardData {
  title: string;
  value: string;
  subValue?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  description?: string;
}

export interface ConfusionMatrixData {
  truePositive: number;
  falsePositive: number;
  trueNegative: number;
  falseNegative: number;
  totalLegit: number;
  totalFraud: number;
}

export interface ModelComparisonRow {
  model: string;
  type: 'Quantum' | 'Classical';
  recall: number;
  precision: number;
  f1Score: number;
  rocAuc: number;
  prAuc: number;
  trainingTime: string;
  qubits?: number;
}

export interface KernelMatrixPoint {
  row: number;
  col: number;
  value: number;
  sampleA: string;
  sampleB: string;
  isFraudA: boolean;
  isFraudB: boolean;
}

export interface DatasetStatistics {
  name: string;
  totalRows: number;
  totalFeatures: number;
  missingValues: number;
  legitimateCount: number;
  fraudulentCount: number;
  fraudRatioPercent: number;
  lastUpdated: string;
}

export interface AppSettings {
  theme: 'light' | 'slate';
  tableDensity: 'compact' | 'normal' | 'spacious';
  defaultMetric: 'pr-auc' | 'recall' | 'f1-score' | 'roc-auc';
  qubitCapacity: number;
  ibmConnectionStatus: 'connected' | 'offline';
  readoutMitigation: boolean;
}

export type UserRole = 
  | 'bank_risk_officer' 
  | 'npci_auditor' 
  | 'merchant_admin' 
  | 'qpu_engineer';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  institution: string;
  institutionType: 'Commercial Bank' | 'Central Regulatory Switch' | 'Enterprise Retailer' | 'Quantum Infrastructure';
  branchCode?: string;
  badgeNumber: string;
  avatarInitials: string;
  permissions: string[];
}

export interface BankInstitution {
  id: string;
  name: string;
  shortName: string;
  category: 'Scheduled Commercial Bank' | 'Payment Switch / Clearing' | 'Retail Conglomerate';
  ifscPrefix: string;
  nodeStatus: 'Active (vQPU Synced)' | 'Active (Secondary Node)' | 'Audit Mode';
}

