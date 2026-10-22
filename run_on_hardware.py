"""
Quantum Fraud Detection - Real Hardware Execution Script
Tests the quantum fraud detection circuit on physical IBM Quantum Hardware (or the 127-qubit FakeBrisbane QPU replica).
Compares ideal simulation similarity vs physical hardware shot-based measurement.

Usage:
  # 1. Run using local 127-qubit hardware replica (no token required):
  python run_on_hardware.py

  # 2. Run on real IBM Quantum Cloud QPU:
  python run_on_hardware.py --token YOUR_IBM_QUANTUM_API_TOKEN
"""

import sys
import os
import argparse
import numpy as np

# Ensure src is importable
current_dir = os.path.dirname(os.path.abspath(__file__))
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from src.data_pipeline import FraudDataPipeline
from src.feature_maps import FraudQuantumFeatureMaps
from src.quantum_kernels import QuantumKernelEngine
from src.hardware import IBMHardwareManager


def main():
    parser = argparse.ArgumentParser(description="Run Quantum Fraud Detection on IBM Hardware")
    parser.add_argument("--token", type=str, default=None, help="IBM Quantum Platform API Token")
    parser.add_argument("--shots", type=int, default=2048, help="Number of measurement shots")
    parser.add_argument("--qubits", type=int, default=4, help="Number of transaction qubits")
    args = parser.parse_args()

    print("=" * 80, flush=True)
    print("  QUANTUM FRAUD DETECTION: REAL IBM HARDWARE PIPELINE", flush=True)
    print("=" * 80, flush=True)

    # 1. Prepare transactions
    print("\n[Step 1/4] Preparing Test Transactions...", flush=True)
    pipeline = FraudDataPipeline(random_state=42)
    df = pipeline.generate_synthetic_data(n_samples=500, fraud_ratio=0.1)
    data = pipeline.prepare_quantum_data(df, n_qubits=args.qubits, n_quantum_train=20, n_quantum_test=10)

    X_test = data["X_test_quantum"]
    y_test = data["y_test_quantum"]

    # Pick 1 legitimate sample and 1 fraudulent sample
    legit_indices = np.where(y_test == 0)[0]
    fraud_indices = np.where(y_test == 1)[0]

    x_legit_1 = X_test[legit_indices[0]]
    x_legit_2 = X_test[legit_indices[1]]
    x_fraud = X_test[fraud_indices[0]]

    print(f"  Sample A (Legitimate #1): angles = {np.round(x_legit_1, 3)}", flush=True)
    print(f"  Sample B (Legitimate #2): angles = {np.round(x_legit_2, 3)}", flush=True)
    print(f"  Sample C (Fraudulent):    angles = {np.round(x_fraud, 3)}", flush=True)

    # 2. Build Feature Map
    print("\n[Step 2/4] Constructing Quantum Circuit Feature Map...", flush=True)
    feature_map = FraudQuantumFeatureMaps.get_zz_feature_map(feature_dimension=args.qubits, reps=1)
    kernel_engine = QuantumKernelEngine(feature_map=feature_map)

    # Calculate Ideal Simulation Similarities
    ideal_sim_legit = kernel_engine.compute_fidelity_matrix(x_legit_1.reshape(1, -1), x_legit_2.reshape(1, -1))[0, 0]
    ideal_sim_fraud = kernel_engine.compute_fidelity_matrix(x_legit_1.reshape(1, -1), x_fraud.reshape(1, -1))[0, 0]

    print(f"  [Ideal Simulation] Similarity(Legit_1, Legit_2): {ideal_sim_legit:.4f}", flush=True)
    print(f"  [Ideal Simulation] Similarity(Legit_1, Fraud):   {ideal_sim_fraud:.4f}", flush=True)

    # 3. Initialize Hardware Backend
    print("\n[Step 3/4] Initializing IBM Quantum Backend...", flush=True)
    hw = IBMHardwareManager(token=args.token)
    backend = hw.initialize_backend()

    # 4. Execute on Hardware
    print(f"\n[Step 4/4] Executing Physical Pulse Circuits ({args.shots} shots)...", flush=True)
    print("\n--- Test 1: Legitimate vs. Legitimate Transaction Overlap ---", flush=True)
    hw_sim_legit = hw.evaluate_overlap_on_hardware(feature_map, x_legit_1, x_legit_2, shots=args.shots)

    print("\n--- Test 2: Legitimate vs. Fraudulent Transaction Overlap ---", flush=True)
    hw_sim_fraud = hw.evaluate_overlap_on_hardware(feature_map, x_legit_1, x_fraud, shots=args.shots)

    # Summary
    print("\n" + "=" * 80, flush=True)
    print("  HARDWARE EXECUTION SUMMARY & COMPARISON", flush=True)
    print("=" * 80, flush=True)
    target_name = backend.name
    print(f"Target Backend: {target_name} ({'Real Cloud QPU' if hw.is_real_cloud else 'IBM QPU Hardware Replica with Physical Noise'})", flush=True)
    print("-" * 80, flush=True)
    print(f"Pair                          | Ideal (Simulator) | Physical Hardware ({args.shots} shots)", flush=True)
    print("-" * 80, flush=True)
    print(f"Legitimate vs. Legitimate     | {ideal_sim_legit:.4f}            | {hw_sim_legit:.4f}", flush=True)
    print(f"Legitimate vs. Fraudulent     | {ideal_sim_fraud:.4f}            | {hw_sim_fraud:.4f}", flush=True)
    print("=" * 80, flush=True)

    if not hw.is_real_cloud:
        print("\nNote: You ran using an IBM QPU calibration replica with real physical noise.", flush=True)
        print("To run on a live cloud QPU, provide your free IBM Quantum token:", flush=True)
        print("  python run_on_hardware.py --token YOUR_TOKEN", flush=True)
        print("Get your token free at: https://quantum.ibm.com/", flush=True)


if __name__ == "__main__":
    main()
