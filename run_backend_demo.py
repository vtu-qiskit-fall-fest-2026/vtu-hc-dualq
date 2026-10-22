"""
Quantum Fraud Detection - Backend Demonstration Script
Executes the end-to-end quantum fraud detection pipeline:
1. Ingestion & Preprocessing (PCA reduction to 4 qubits, [-pi, pi] angle scaling)
2. Quantum Circuit Construction & Visual Inspection (ZZFeatureMap)
3. Quantum Kernel Calculation (Fidelity vs Projected Quantum Kernel)
4. Kernel Target Alignment (KTA) & Geometric Difference Diagnostics
5. QSVC Model Training (Supervised QSVC & Unsupervised One-Class QSVM)
6. Classical Baseline Training (RBF-SVM, Balanced Random Forest)
7. Full Metric Benchmarking (Recall, Precision, F1, ROC-AUC, PR-AUC, Confusion Matrix)
"""

import sys
import os
import time
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
from src.models import QuantumFraudClassifier, QuantumOneClassDetector, ClassicalFraudBaselines
from src.evaluation import FraudEvaluator
from sklearn.metrics.pairwise import rbf_kernel


def run_pipeline():
    print("=" * 80, flush=True)
    print("  FINANCIAL FRAUD DETECTION: QUANTUM SUPPORT VECTOR MACHINE (QSVM) BACKEND", flush=True)
    print("=" * 80, flush=True)

    # ---------------------------------------------------------
    # 1. Data Pipeline
    # ---------------------------------------------------------
    print("\n[Step 1/6] Ingesting & Preprocessing Transaction Data...", flush=True)
    pipeline = FraudDataPipeline(random_state=42)
    # Check if creditcard.csv exists in data/raw or current dir
    csv_candidates = [
        os.path.join(current_dir, "data", "raw", "creditcard.csv"),
        os.path.join(current_dir, "creditcard.csv")
    ]
    csv_path = next((p for p in csv_candidates if os.path.exists(p)), None)

    df = pipeline.load_or_generate_dataset(filepath=csv_path, n_samples_fallback=2500, fraud_ratio=0.05)
    data = pipeline.prepare_quantum_data(
        df,
        n_qubits=4,
        reduction_method="pca",
        n_quantum_train=160,
        n_quantum_test=60,
        stratify=True
    )

    X_train_q = data["X_train_quantum"]
    y_train_q = data["y_train_quantum"]
    X_test_q = data["X_test_quantum"]
    y_test_q = data["y_test_quantum"]

    # ---------------------------------------------------------
    # 2. Quantum Feature Map Construction
    # ---------------------------------------------------------
    print("\n[Step 2/6] Building Quantum Feature Maps...", flush=True)
    zz_map = FraudQuantumFeatureMaps.get_zz_feature_map(feature_dimension=4, reps=2, entanglement="linear")
    print(FraudQuantumFeatureMaps.inspect_circuit(zz_map), flush=True)

    # ---------------------------------------------------------
    # 3. Quantum Kernel Calculation & Novel Diagnostics
    # ---------------------------------------------------------
    print("\n[Step 3/6] Computing Quantum Gram Matrices & Metrics...", flush=True)
    kernel_engine = QuantumKernelEngine(feature_map=zz_map)

    # A. Fidelity Quantum Kernel
    t0 = time.time()
    print("  -> Evaluating Fidelity Quantum Kernel (K_fidelity)...", flush=True)
    K_train_fid = kernel_engine.compute_fidelity_matrix(X_train_q)
    K_test_fid = kernel_engine.compute_fidelity_matrix(X_test_q, X_train_q)
    fid_time = time.time() - t0
    print(f"     Computed {K_train_fid.shape[0]}x{K_train_fid.shape[1]} Fidelity matrix in {fid_time:.2f}s", flush=True)

    # B. Projected Quantum Kernel (PQK - Huang et al. 2021)
    t0 = time.time()
    print("  -> Evaluating Projected Quantum Kernel (PQK)...", flush=True)
    K_train_pqk = kernel_engine.compute_projected_kernel_matrix(X_train_q)
    K_test_pqk = kernel_engine.compute_projected_kernel_matrix(X_test_q, X_train_q)
    pqk_time = time.time() - t0
    print(f"     Computed {K_train_pqk.shape[0]}x{K_train_pqk.shape[1]} PQK matrix in {pqk_time:.2f}s", flush=True)

    # C. Classical RBF Kernel for comparison
    gamma_rbf = 1.0 / X_train_q.shape[1]
    K_train_classical = rbf_kernel(X_train_q, X_train_q, gamma=gamma_rbf)
    K_test_classical = rbf_kernel(X_test_q, X_train_q, gamma=gamma_rbf)

    # Kernel Target Alignment (KTA) Scores
    kta_fid = QuantumKernelEngine.kernel_target_alignment(K_train_fid, y_train_q)
    kta_pqk = QuantumKernelEngine.kernel_target_alignment(K_train_pqk, y_train_q)
    kta_classic = QuantumKernelEngine.kernel_target_alignment(K_train_classical, y_train_q)

    # Geometric Difference g_classical(K_Q)
    g_diff_fid = FraudEvaluator.compute_geometric_difference(K_train_fid, K_train_classical)
    g_diff_pqk = FraudEvaluator.compute_geometric_difference(K_train_pqk, K_train_classical)

    print("\n  --- Quantum Kernel Diagnostics ---", flush=True)
    print(f"  Kernel Target Alignment (KTA):", flush=True)
    print(f"    - Classical RBF:     {kta_classic:.4f}", flush=True)
    print(f"    - Fidelity Quantum:  {kta_fid:.4f}", flush=True)
    print(f"    - Projected Quantum: {kta_pqk:.4f}", flush=True)
    print(f"  Geometric Difference g_classical(K_Q):", flush=True)
    print(f"    - Fidelity vs RBF:   {g_diff_fid:.4f}", flush=True)
    print(f"    - Projected vs RBF:  {g_diff_pqk:.4f}", flush=True)

    # ---------------------------------------------------------
    # 4. Supervised QSVC Training
    # ---------------------------------------------------------
    print("\n[Step 4/6] Training Supervised Quantum Classifiers (QSVC)...", flush=True)
    
    # Model 1: Baseline QSVC (Fidelity)
    qsvc_fid = QuantumFraudClassifier(C=1.0, class_weight="balanced")
    qsvc_fid.fit(X_train_q, y_train_q, precomputed_K=K_train_fid)
    pred_fid = qsvc_fid.predict(X_test_q, precomputed_K=K_test_fid)
    score_fid = qsvc_fid.decision_function(X_test_q, precomputed_K=K_test_fid)

    # Model 2: Projected QSVC (PQK)
    qsvc_pqk = QuantumFraudClassifier(C=1.0, class_weight="balanced")
    qsvc_pqk.fit(X_train_q, y_train_q, precomputed_K=K_train_pqk)
    pred_pqk = qsvc_pqk.predict(X_test_q, precomputed_K=K_test_pqk)
    score_pqk = qsvc_pqk.decision_function(X_test_q, precomputed_K=K_test_pqk)

    # ---------------------------------------------------------
    # 5. Unsupervised Quantum Anomaly Detection (One-Class QSVM)
    # ---------------------------------------------------------
    print("\n[Step 5/6] Training Quantum One-Class Anomaly Detector...", flush=True)
    # Train only on legitimate transactions (y == 0)
    legit_mask = (y_train_q == 0)
    X_train_legit = X_train_q[legit_mask]
    K_train_legit_pqk = K_train_pqk[np.ix_(legit_mask, legit_mask)]
    K_test_legit_pqk = K_test_pqk[:, legit_mask]

    oc_qsvm = QuantumOneClassDetector(nu=0.08)
    oc_qsvm.fit(X_train_legit, precomputed_K=K_train_legit_pqk)
    pred_oc = oc_qsvm.predict(X_test_q, precomputed_K=K_test_legit_pqk)
    score_oc = oc_qsvm.decision_function(X_test_q, precomputed_K=K_test_legit_pqk)

    # ---------------------------------------------------------
    # 6. Classical Baselines & Final Benchmarking
    # ---------------------------------------------------------
    print("\n[Step 6/6] Training Classical Baselines & Benchmarking...", flush=True)

    # Classical SVM with RBF Kernel
    svm_rbf = ClassicalFraudBaselines.get_classical_svm(C=1.0)
    svm_rbf.fit(X_train_q, y_train_q)
    pred_svm = svm_rbf.predict(X_test_q)
    score_svm = svm_rbf.decision_function(X_test_q)

    # Classical Balanced Random Forest
    rf = ClassicalFraudBaselines.get_random_forest(n_estimators=100)
    rf.fit(X_train_q, y_train_q)
    pred_rf = rf.predict(X_test_q)
    score_rf = rf.predict_proba(X_test_q)[:, 1]

    # Evaluate all models
    results = {
        "Classical RBF-SVM": FraudEvaluator.evaluate_predictions(y_test_q, pred_svm, score_svm),
        "Classical Balanced RF": FraudEvaluator.evaluate_predictions(y_test_q, pred_rf, score_rf),
        "Baseline QSVC (Fidelity)": FraudEvaluator.evaluate_predictions(y_test_q, pred_fid, score_fid),
        "Projected QSVC (PQK)": FraudEvaluator.evaluate_predictions(y_test_q, pred_pqk, score_pqk),
        "One-Class QSVM (Anomaly)": FraudEvaluator.evaluate_predictions(y_test_q, pred_oc, score_oc)
    }

    print("\n" + "=" * 80, flush=True)
    print("  COMPREHENSIVE FRAUD DETECTION BENCHMARK RESULTS", flush=True)
    print("=" * 80, flush=True)
    print(FraudEvaluator.format_results_table(results), flush=True)
    print("\nPipeline execution completed successfully!", flush=True)


if __name__ == "__main__":
    run_pipeline()
