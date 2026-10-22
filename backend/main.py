import sys
import os
import datetime
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List, Dict, Any

# Ensure root directory is on Python path
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

from backend.schemas import (
    ScreenTransactionRequest,
    ScreenTransactionResponse,
    FreezeAccountRequest,
    FreezeAccountResponse,
    QPUTelemetryResponse,
    ModelMetricsResponse
)
from backend.quantum_service import quantum_service

app = FastAPI(
    title="DualQ — Quantum Banking Fraud Detection API",
    description=(
        "Production-grade Quantum Support Vector Machine (QSVM) backend for Indian Payment Rails "
        "(UPI, IMPS, RuPay, Soundbox, RTGS). Built with Qiskit for the VTU-Qiskit Fall Fest 2026."
    ),
    version="2.6.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Cross-Origin Resource Sharing (CORS) setup for React/Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/", tags=["System"])
def root_health_check():
    """Health check endpoint and runtime environment metadata."""
    return {
        "status": "online",
        "service": "DualQ Quantum Fraud Detection API",
        "team": "DualQ",
        "team_id": "VTU-QFF-HC-0079",
        "hackathon": "VTU-QFF Hackathon — VTU-Qiskit Fall Fest 2026",
        "version": "2.6.0-QPU",
        "virtual_qpu_node": "vQPU-01",
        "hardware_target": "IBM FakeManilaV2 5-Qubit Falcon Replica",
        "docs_url": "/docs",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }


@app.post("/api/screen", response_model=ScreenTransactionResponse, tags=["Quantum Screening"])
def screen_transaction(request: ScreenTransactionRequest):
    """
    Screen any incoming transaction through the DualQ 4-Qubit Quantum Support Vector Machine.
    Computes quantum Hilbert state fidelity and returns real-time fraud probability with soundbox audio text.
    """
    try:
        return quantum_service.screen_transaction(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Quantum kernel screening error: {str(e)}"
        )


@app.get("/api/transactions", tags=["Audit Ledger"])
def get_transactions() -> List[Dict[str, Any]]:
    """Retrieve all real-time audited transaction records on Indian payment rails."""
    return quantum_service.get_transactions()


@app.post("/api/transactions/simulate", response_model=ScreenTransactionResponse, tags=["Audit Ledger"])
def simulate_incoming_transaction():
    """Simulate an incoming live Indian payment (UPI/Soundbox/RuPay) and evaluate it through the QPU."""
    import random
    is_fraud = random.random() < 0.35
    channels = [
        "UPI (Google Pay / PhonePe)",
        "UPI Soundbox (Paytm)",
        "RuPay Contactless Card",
        "IMPS Immediate Payment",
        "Corporate RTGS Wire"
    ]
    chosen_channel = random.choice(channels)
    
    if is_fraud:
        amount = round(random.uniform(45000, 185000), 2)
        v4, v11, v12, v14 = 3.6, 3.2, -4.5, -6.1
    else:
        amount = round(random.uniform(25, 1450), 2)
        v4, v11, v12, v14 = -0.3, 0.2, 0.6, 0.3

    req = ScreenTransactionRequest(
        amount=amount,
        channel=chosen_channel,
        vpa="simulated.user@upi",
        merchant="Simulated Vendor",
        v4=v4,
        v11=v11,
        v12=v12,
        v14=v14
    )
    return quantum_service.screen_transaction(req)


@app.patch("/api/transactions/{txn_id}/status", tags=["Audit Ledger"])
def toggle_transaction_status(txn_id: str):
    """Toggle transaction hold/clear status (Bank Risk Officer action)."""
    updated = quantum_service.toggle_status(txn_id)
    if not updated:
        raise HTTPException(status_code=404, detail=f"Transaction {txn_id} not found in active ledger.")
    return {
        "success": True,
        "transaction_id": txn_id,
        "new_status": updated["status"],
        "new_risk_score": updated["riskScore"],
        "message": f"Transaction {txn_id} updated to {updated['status']}"
    }


@app.post("/api/freeze", response_model=FreezeAccountResponse, tags=["Banking Operations"])
def freeze_account(request: FreezeAccountRequest):
    """Issue immediate freeze order for suspect UPI VPA / Account across NPCI central switch."""
    return quantum_service.freeze_account(
        vpa=request.account_or_vpa,
        reason=request.reason,
        officer_badge=request.officer_badge or "HDFC-RISK-4409"
    )


@app.get("/api/qpu/telemetry", response_model=QPUTelemetryResponse, tags=["Quantum Operations"])
def get_qpu_telemetry():
    """Retrieve virtual QPU execution parameters, pulse fidelity, and error mitigation matrix state."""
    return quantum_service.get_qpu_telemetry()


@app.get("/api/benchmarks", response_model=List[ModelMetricsResponse], tags=["Performance & Auditing"])
def get_benchmarks():
    """Empirical comparison metrics of DualQ QSVM against classical baseline models (RBF-SVM, Random Forest)."""
    return quantum_service.get_model_benchmarks()


@app.get("/api/export-sar", tags=["Banking Operations"])
def export_sar_compliance_packet():
    """Generate and return official Reserve Bank of India Suspicious Activity Report (SAR) payload."""
    suspicious = [t for t in quantum_service.get_transactions() if t["status"] == "Suspicious"]
    return {
        "regulatory_standard": "RBI Master Direction - Fraud Risk Management (2026)",
        "platform": "DualQ Quantum Fraud Detection Platform",
        "team": "DualQ (VTU-QFF-HC-0079)",
        "generated_at": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "total_audited_records": len(quantum_service.get_transactions()),
        "frozen_accounts_count": len(quantum_service.frozen_accounts),
        "frozen_accounts": quantum_service.frozen_accounts,
        "suspicious_incidents": suspicious
    }
