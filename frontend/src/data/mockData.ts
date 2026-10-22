import { Transaction, ConfusionMatrixData, ModelComparisonRow, DatasetStatistics } from '../types';

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "TXN-UPI-984201",
    timestamp: "2026-10-21T21:42:15Z",
    date: "2026-10-21",
    time: "21:42:15",
    amount: 142050.00,
    currency: "INR",
    status: "Suspicious",
    riskScore: 0.94,
    features: {
      v4: 3.82,
      v11: 3.41,
      v12: -4.18,
      v14: -5.92,
      timeSeconds: 78120
    },
    details: {
      channel: "UPI (Google Pay P2M)",
      location: "Jamtara, Jharkhand (IP Mismatch)",
      merchantCategory: "Crypto P2P / Digital Gift Vouchers",
      flagReason: "Midnight high-value UPI drain post SIM-swap alert with critical V14 anomaly"
    }
  },
  {
    id: "TXN-UPI-984200",
    timestamp: "2026-10-21T21:40:02Z",
    date: "2026-10-21",
    time: "21:40:02",
    amount: 340.00,
    currency: "INR",
    status: "Legitimate",
    riskScore: 0.04,
    features: {
      v4: -0.15,
      v11: 0.22,
      v12: 0.45,
      v14: 0.18,
      timeSeconds: 78002
    },
    details: {
      channel: "UPI QR (PhonePe)",
      location: "Koramangala, Bengaluru, Karnataka",
      merchantCategory: "Blinkit Quick Grocery Delivery"
    }
  },
  {
    id: "TXN-IMPS-984199",
    timestamp: "2026-10-21T21:38:44Z",
    date: "2026-10-21",
    time: "21:38:44",
    amount: 28500.00,
    currency: "INR",
    status: "Under Review",
    riskScore: 0.68,
    features: {
      v4: 1.94,
      v11: 1.45,
      v12: -1.82,
      v14: -2.15,
      timeSeconds: 77924
    },
    details: {
      channel: "IMPS Immediate Payment",
      location: "Nariman Point, Mumbai, Maharashtra",
      merchantCategory: "P2P Net Banking Fund Transfer",
      flagReason: "First-time beneficiary transfer above ₹25,000 initiated during off-hours"
    }
  },
  {
    id: "TXN-UPI-984198",
    timestamp: "2026-10-21T21:35:10Z",
    date: "2026-10-21",
    time: "21:35:10",
    amount: 120.00,
    currency: "INR",
    status: "Legitimate",
    riskScore: 0.02,
    features: {
      v4: -0.42,
      v11: -0.18,
      v12: 0.82,
      v14: 0.41,
      timeSeconds: 77710
    },
    details: {
      channel: "UPI Soundbox (Paytm)",
      location: "FC Road, Pune, Maharashtra",
      merchantCategory: "Chai Point Kirana Store"
    }
  },
  {
    id: "TXN-RTGS-984197",
    timestamp: "2026-10-21T21:28:55Z",
    date: "2026-10-21",
    time: "21:28:55",
    amount: 389000.00,
    currency: "INR",
    status: "Suspicious",
    riskScore: 0.98,
    features: {
      v4: 4.12,
      v11: 3.88,
      v12: -5.11,
      v14: -6.44,
      timeSeconds: 77335
    },
    details: {
      channel: "Corporate RTGS Wire",
      location: "Mewat, Haryana (Tor Exit Node)",
      merchantCategory: "Bullion & Gold Jewellery Trading",
      flagReason: "Sudden high-velocity RTGS transfer from dormant current account"
    }
  },
  {
    id: "TXN-RUPAY-984196",
    timestamp: "2026-10-21T21:15:30Z",
    date: "2026-10-21",
    time: "21:15:30",
    amount: 780.00,
    currency: "INR",
    status: "Legitimate",
    riskScore: 0.06,
    features: {
      v4: 0.31,
      v11: -0.55,
      v12: 0.33,
      v14: 0.12,
      timeSeconds: 76530
    },
    details: {
      channel: "RuPay Contactless Card",
      location: "Connaught Place, New Delhi",
      merchantCategory: "Indian Oil Petrol Pump Fuel"
    }
  },
  {
    id: "TXN-ECOM-984195",
    timestamp: "2026-10-21T21:04:12Z",
    date: "2026-10-21",
    time: "21:04:12",
    amount: 51200.00,
    currency: "INR",
    status: "Under Review",
    riskScore: 0.62,
    features: {
      v4: 1.72,
      v11: 1.15,
      v12: -1.34,
      v14: -1.98,
      timeSeconds: 75852
    },
    details: {
      channel: "Razorpay Payment Gateway",
      location: "HITEC City, Hyderabad, Telangana",
      merchantCategory: "Flipkart Big Billion Electronics",
      flagReason: "Amount exceeds customer's 90-day typical UPI spend by 450%"
    }
  },
  {
    id: "TXN-MANDATE-984194",
    timestamp: "2026-10-21T20:55:00Z",
    date: "2026-10-21",
    time: "20:55:00",
    amount: 1450.00,
    currency: "INR",
    status: "Legitimate",
    riskScore: 0.08,
    features: {
      v4: -0.10,
      v11: 0.40,
      v12: 0.15,
      v14: -0.22,
      timeSeconds: 75300
    },
    details: {
      channel: "UPI AutoPay (e-Mandate)",
      location: "Anna Nagar, Chennai, Tamil Nadu",
      merchantCategory: "Jio Fiber Broadband Bill"
    }
  },
  {
    id: "TXN-ATM-984193",
    timestamp: "2026-10-21T20:41:22Z",
    date: "2026-10-21",
    time: "20:41:22",
    amount: 215000.00,
    currency: "INR",
    status: "Suspicious",
    riskScore: 0.91,
    features: {
      v4: 3.55,
      v11: 2.95,
      v12: -3.89,
      v14: -5.12,
      timeSeconds: 74482
    },
    details: {
      channel: "ATM Cash Dispenser (RuPay Card)",
      location: "Navrangpura, Ahmedabad, Gujarat",
      merchantCategory: "Off-Us White Label ATM",
      flagReason: "Cloned magnetic stripe signature following consecutive wrong PIN attempts"
    }
  },
  {
    id: "TXN-UPI-984192",
    timestamp: "2026-10-21T20:30:15Z",
    date: "2026-10-21",
    time: "20:30:15",
    amount: 89.00,
    currency: "INR",
    status: "Legitimate",
    riskScore: 0.01,
    features: {
      v4: -0.65,
      v11: -0.32,
      v12: 0.91,
      v14: 0.65,
      timeSeconds: 73815
    },
    details: {
      channel: "UPI In-App Mandate",
      location: "Salt Lake Sector V, Kolkata, West Bengal",
      merchantCategory: "JioCinema / Hotstar Monthly Pass"
    }
  },
  {
    id: "TXN-UPI-984191",
    timestamp: "2026-10-21T20:12:40Z",
    date: "2026-10-21",
    time: "20:12:40",
    amount: 890.00,
    currency: "INR",
    status: "Legitimate",
    riskScore: 0.05,
    features: {
      v4: 0.08,
      v11: 0.12,
      v12: 0.25,
      v14: 0.10,
      timeSeconds: 72760
    },
    details: {
      channel: "UPI (BHIM App)",
      location: "C-Scheme, Jaipur, Rajasthan",
      merchantCategory: "Swiggy Restaurant Food Delivery"
    }
  },
  {
    id: "TXN-PENNY-984190",
    timestamp: "2026-10-21T19:55:04Z",
    date: "2026-10-21",
    time: "19:55:04",
    amount: 1.00,
    currency: "INR",
    status: "Under Review",
    riskScore: 0.58,
    features: {
      v4: 2.10,
      v11: 0.95,
      v12: -1.15,
      v14: -1.80,
      timeSeconds: 71704
    },
    details: {
      channel: "UPI Penny Drop API",
      location: "Athwa, Surat, Gujarat",
      merchantCategory: "Fintech Account Validation",
      flagReason: "Automated penny-drop bank account probe preceding high-value payout request"
    }
  }
];

export const HOURLY_VOLUME_DATA = [
  { hour: "00:00", legitimate: 120, fraud: 4, total: 124 },
  { hour: "02:00", legitimate: 85, fraud: 7, total: 92 },
  { hour: "04:00", legitimate: 62, fraud: 9, total: 71 },
  { hour: "06:00", legitimate: 190, fraud: 5, total: 195 },
  { hour: "08:00", legitimate: 420, fraud: 3, total: 423 },
  { hour: "10:00", legitimate: 780, fraud: 6, total: 786 },
  { hour: "12:00", legitimate: 940, fraud: 8, total: 948 },
  { hour: "14:00", legitimate: 890, fraud: 5, total: 895 },
  { hour: "16:00", legitimate: 830, fraud: 7, total: 837 },
  { hour: "18:00", legitimate: 710, fraud: 6, total: 716 },
  { hour: "20:00", legitimate: 560, fraud: 11, total: 571 },
  { hour: "22:00", legitimate: 340, fraud: 8, total: 348 },
];

export const DAILY_DISTRIBUTION_DATA = [
  { day: "Mon", legitimate: 14200, fraud: 68 },
  { day: "Tue", legitimate: 15100, fraud: 72 },
  { day: "Wed", legitimate: 14850, fraud: 64 },
  { day: "Thu", legitimate: 15900, fraud: 85 },
  { day: "Fri", legitimate: 17200, fraud: 94 },
  { day: "Sat", legitimate: 13400, fraud: 58 },
  { day: "Sun", legitimate: 11200, fraud: 51 },
];

export const CONFUSION_MATRIX_DATA: ConfusionMatrixData = {
  truePositive: 87,
  falsePositive: 16,
  trueNegative: 56840,
  falseNegative: 11,
  totalLegit: 56856,
  totalFraud: 98
};

export const MODEL_COMPARISON_DATA: ModelComparisonRow[] = [
  {
    model: "QSVC (Projected Quantum Kernel)",
    type: "Quantum",
    recall: 88.77,
    precision: 84.47,
    f1Score: 0.8656,
    rocAuc: 0.9438,
    prAuc: 0.8240,
    trainingTime: "24.5s",
    qubits: 4
  },
  {
    model: "QSVC (Fidelity ZZFeatureMap)",
    type: "Quantum",
    recall: 85.71,
    precision: 81.55,
    f1Score: 0.8358,
    rocAuc: 0.9285,
    prAuc: 0.7915,
    trainingTime: "31.2s",
    qubits: 4
  },
  {
    model: "Quantum One-Class SVM",
    type: "Quantum",
    recall: 82.65,
    precision: 78.64,
    f1Score: 0.8059,
    rocAuc: 0.8920,
    prAuc: 0.7412,
    trainingTime: "18.8s",
    qubits: 4
  },
  {
    model: "Classical Support Vector Machine (RBF)",
    type: "Classical",
    recall: 81.63,
    precision: 80.00,
    f1Score: 0.8081,
    rocAuc: 0.9082,
    prAuc: 0.7630,
    trainingTime: "12.4s"
  },
  {
    model: "Balanced Random Forest (100 Trees)",
    type: "Classical",
    recall: 83.67,
    precision: 82.83,
    f1Score: 0.8325,
    rocAuc: 0.9320,
    prAuc: 0.8010,
    trainingTime: "8.1s"
  },
  {
    model: "Logistic Regression (Balanced Weights)",
    type: "Classical",
    recall: 74.49,
    precision: 71.57,
    f1Score: 0.7300,
    rocAuc: 0.8640,
    prAuc: 0.6820,
    trainingTime: "2.3s"
  }
];

export const PR_CURVE_DATA = [
  { recall: 0.0, quantumPrecision: 1.0, classicalPrecision: 1.0 },
  { recall: 0.1, quantumPrecision: 0.98, classicalPrecision: 0.96 },
  { recall: 0.2, quantumPrecision: 0.96, classicalPrecision: 0.94 },
  { recall: 0.3, quantumPrecision: 0.95, classicalPrecision: 0.92 },
  { recall: 0.4, quantumPrecision: 0.94, classicalPrecision: 0.89 },
  { recall: 0.5, quantumPrecision: 0.92, classicalPrecision: 0.86 },
  { recall: 0.6, quantumPrecision: 0.89, classicalPrecision: 0.83 },
  { recall: 0.7, quantumPrecision: 0.87, classicalPrecision: 0.80 },
  { recall: 0.8, quantumPrecision: 0.85, classicalPrecision: 0.77 },
  { recall: 0.88, quantumPrecision: 0.84, classicalPrecision: 0.72 },
  { recall: 0.95, quantumPrecision: 0.74, classicalPrecision: 0.61 },
  { recall: 1.0, quantumPrecision: 0.52, classicalPrecision: 0.42 },
];

export const ROC_CURVE_DATA = [
  { fpr: 0.000, quantumTpr: 0.00, classicalTpr: 0.00 },
  { fpr: 0.0001, quantumTpr: 0.45, classicalTpr: 0.38 },
  { fpr: 0.0003, quantumTpr: 0.72, classicalTpr: 0.65 },
  { fpr: 0.0005, quantumTpr: 0.84, classicalTpr: 0.78 },
  { fpr: 0.0010, quantumTpr: 0.89, classicalTpr: 0.82 },
  { fpr: 0.0020, quantumTpr: 0.93, classicalTpr: 0.88 },
  { fpr: 0.0050, quantumTpr: 0.96, classicalTpr: 0.92 },
  { fpr: 0.0100, quantumTpr: 0.98, classicalTpr: 0.95 },
  { fpr: 0.0500, quantumTpr: 0.99, classicalTpr: 0.98 },
  { fpr: 0.1000, quantumTpr: 1.00, classicalTpr: 1.00 },
];

export const MOCK_KERNEL_MATRIX = [
  [1.00, 0.88, 0.91, 0.85, 0.12, 0.09, 0.89, 0.92, 0.14, 0.87],
  [0.88, 1.00, 0.86, 0.90, 0.08, 0.11, 0.87, 0.89, 0.10, 0.84],
  [0.91, 0.86, 1.00, 0.87, 0.15, 0.10, 0.93, 0.95, 0.16, 0.89],
  [0.85, 0.90, 0.87, 1.00, 0.11, 0.08, 0.86, 0.88, 0.09, 0.82],
  [0.12, 0.08, 0.15, 0.11, 1.00, 0.92, 0.10, 0.13, 0.89, 0.11],
  [0.09, 0.11, 0.10, 0.08, 0.92, 1.00, 0.08, 0.09, 0.94, 0.07],
  [0.89, 0.87, 0.93, 0.86, 0.10, 0.08, 1.00, 0.94, 0.12, 0.91],
  [0.92, 0.89, 0.95, 0.88, 0.13, 0.09, 0.94, 1.00, 0.15, 0.90],
  [0.14, 0.10, 0.16, 0.09, 0.89, 0.94, 0.12, 0.15, 1.00, 0.10],
  [0.87, 0.84, 0.89, 0.82, 0.11, 0.07, 0.91, 0.90, 0.10, 1.00],
];

export const KERNEL_SAMPLE_LABELS = [
  { id: "S1", type: "Legitimate" },
  { id: "S2", type: "Legitimate" },
  { id: "S3", type: "Legitimate" },
  { id: "S4", type: "Legitimate" },
  { id: "S5", type: "Fraud" },
  { id: "S6", type: "Fraud" },
  { id: "S7", type: "Legitimate" },
  { id: "S8", type: "Legitimate" },
  { id: "S9", type: "Fraud" },
  { id: "S10", type: "Legitimate" },
];

export const MOCK_DATASET_STATS: DatasetStatistics = {
  name: "npci_upi_fraud_ledger_2026.csv",
  totalRows: 284807,
  totalFeatures: 30,
  missingValues: 0,
  legitimateCount: 284315,
  fraudulentCount: 492,
  fraudRatioPercent: 0.173,
  lastUpdated: "2026-10-21 21:30 IST"
};
