from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class ScreenTransactionRequest(BaseModel):
    amount: float = Field(..., description="Transaction amount in Indian Rupees (₹ INR)")
    channel: str = Field(default="UPI (Google Pay / PhonePe)", description="Payment rail (UPI, RuPay, IMPS, Soundbox, RTGS)")
    vpa: Optional[str] = Field(default="user@upi", description="Sender VPA or Bank Account ID")
    merchant: Optional[str] = Field(default="Retail Merchant", description="Merchant category or receiver identity")
    location: Optional[str] = Field(default="Mumbai, Maharashtra", description="Geo-location or IP location")
    v4: Optional[float] = Field(default=None, description="PCA feature V4 anomaly level")
    v11: Optional[float] = Field(default=None, description="PCA feature V11 anomaly level")
    v12: Optional[float] = Field(default=None, description="PCA feature V12 anomaly level")
    v14: Optional[float] = Field(default=None, description="PCA feature V14 anomaly level")
    shots: Optional[int] = Field(default=4096, description="Virtual QPU shots count")

class ScreenTransactionResponse(BaseModel):
    transaction_id: str
    amount: float
    currency: str = "INR"
    channel: str
    status: str  # "Legitimate", "Suspicious", "Under Review"
    risk_score: float  # 0.0 to 1.0
    classical_score: float
    fidelity: float
    hilbert_distance: float
    qubits_used: int = 4
    circuit_reps: int = 2
    entanglement: str = "linear"
    explanation: str
    recommended_action: str
    soundbox_announcement: str
    execution_time_ms: float

class TransactionRecord(BaseModel):
    id: str
    timestamp: str
    date: str
    time: str
    amount: float
    currency: str = "INR"
    status: str
    riskScore: float
    features: Dict[str, Any]
    details: Dict[str, Any]

class FreezeAccountRequest(BaseModel):
    account_or_vpa: str = Field(..., description="VPA handle or Account number to freeze")
    reason: str = Field(default="Suspected fraud by DualQ Quantum Boundary Engine", description="Reason for freeze")
    officer_badge: Optional[str] = Field(default="HDFC-RISK-4409", description="Officer issuing freeze")

class FreezeAccountResponse(BaseModel):
    success: bool
    account_or_vpa: str
    status: str = "FROZEN"
    sar_ticket_id: str
    npci_switch_ack: str
    message: str

class QPUTelemetryResponse(BaseModel):
    node_id: str = "vQPU-01"
    status: str = "Operational"
    backend_type: str = "Qiskit AerSimulator (Linear Nearest-Neighbor)"
    target_hardware: str = "IBM FakeManilaV2 5-Qubit Falcon Replica"
    qubits_active: int = 4
    default_shots: int = 4096
    fidelity_confidence: float = 0.9942
    mean_gate_error_cx: float = 0.0078
    readout_error_mitigation: bool = True
    coherence_t1_us: float = 142.5
    coherence_t2_us: float = 118.2
    hilbert_space_dim: int = 16  # 2^4

class ModelMetricsResponse(BaseModel):
    model_name: str
    quantum_type: str
    recall: float
    precision: float
    f1_score: float
    roc_auc: float
    pr_auc: float
    geometric_difference: float
    kta_score: float
