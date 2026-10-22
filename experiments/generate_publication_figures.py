"""
Generate Publication-Grade Figures & Artifacts
Exports 300 DPI high-resolution figures and JSON metrics to results/
"""

import sys
import os
import time
import numpy as np
from sklearn.metrics.pairwise import rbf_kernel

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from src.data_pipeline import FraudDataPipeline
from src.feature_maps import FraudQuantumFeatureMaps
from src.quantum_kernels import QuantumKernelEngine
from src.models import QuantumFraudClassifier, ClassicalFraudBaselines
from src.evaluation import FraudEvaluator
from src.visualization import FraudVisualizer


def main():
    print("=" * 80, flush=True)
    print("  GENERATING PUBLICATION-GRADE FIGURES & METRICS ARTIFACTS", flush=True)
    print("=" * 80, flush=True)

    pipeline = FraudDataPipeline(random_state=42)
    df = pipeline.generate_synthetic_data(n_samples=2000, fraud_ratio=0.06)
    
    # 4-qubit dataset for main models
    data = pipeline.prepare_quantum_data(df, n_qubits=4, n_quantum_train=120, n_quantum_test=50)
    X_train = data["X_train_quantum"]
    y_train = data["y_train_quantum"]
    X_test = data["X_test_quantum"]
    y_test = data["y_test_quantum"]

    # 1. Feature Map & Kernels
    print("\n[Step 1/4] Calculating Quantum & Classical Gram Matrices...", flush=True)
    feature_map = FraudQuantumFeatureMaps.get_zz_feature_map(feature_dimension=4, reps=2)
    kernel_engine = QuantumKernelEngine(feature_map=feature_map)

    K_train_fid = kernel_engine.compute_fidelity_matrix(X_train)
    K_test_fid = kernel_engine.compute_fidelity_matrix(X_test, X_train)

    K_train_pqk = kernel_engine.compute_projected_kernel_matrix(X_train)
    K_test_pqk = kernel_engine.compute_projected_kernel_matrix(X_test, X_train)

    gamma_rbf = 1.0 / X_train.shape[1]
    K_train_rbf = rbf_kernel(X_train, X_train, gamma=gamma_rbf)
    K_test_rbf = rbf_kernel(X_test, X_train, gamma=gamma_rbf)

    # Figure 1: Kernel Heatmaps Comparison
    print("\n[Step 2/4] Exporting Figure 1: Kernel Heatmaps Comparison (300 DPI)...", flush=True)
    heatmaps_path = os.path.join(project_root, "results", "figures", "kernel_heatmaps_comparison.png")
    FraudVisualizer.plot_kernel_heatmaps_comparison(
        K_train_rbf,
        K_train_fid,
        K_train_pqk,
        save_path=heatmaps_path
    )

    # 2. Train Models & Predict
    print("\n[Step 3/4] Training Classifier Benchmark Suite...", flush=True)
    # QSVC Fidelity
    qsvc_fid = QuantumFraudClassifier(C=1.0, class_weight="balanced")
    qsvc_fid.fit(X_train, y_train, precomputed_K=K_train_fid)
    pred_fid = qsvc_fid.predict(X_test, precomputed_K=K_test_fid)
    score_fid = qsvc_fid.decision_function(X_test, precomputed_K=K_test_fid)

    # QSVC PQK
    qsvc_pqk = QuantumFraudClassifier(C=1.0, class_weight="balanced")
    qsvc_pqk.fit(X_train, y_train, precomputed_K=K_train_pqk)
    pred_pqk = qsvc_pqk.predict(X_test, precomputed_K=K_test_pqk)
    score_pqk = qsvc_pqk.decision_function(X_test, precomputed_K=K_test_pqk)

    # Classical SVM
    svm_rbf = ClassicalFraudBaselines.get_classical_svm(C=1.0)
    svm_rbf.fit(X_train, y_train)
    pred_svm = svm_rbf.predict(X_test)
    score_svm = svm_rbf.decision_function(X_test)

    # Balanced RF
    rf = ClassicalFraudBaselines.get_random_forest(n_estimators=100)
    rf.fit(X_train, y_train)
    pred_rf = rf.predict(X_test)
    score_rf = rf.predict_proba(X_test)[:, 1]

    # Evaluate
    results = {
        "Classical RBF-SVM": FraudEvaluator.evaluate_predictions(y_test, pred_svm, score_svm),
        "Classical Balanced RF": FraudEvaluator.evaluate_predictions(y_test, pred_rf, score_rf),
        "Baseline QSVC (Fidelity)": FraudEvaluator.evaluate_predictions(y_test, pred_fid, score_fid),
        "Projected QSVC (PQK)": FraudEvaluator.evaluate_predictions(y_test, pred_pqk, score_pqk)
    }

    scores_dict = {
        "Classical RBF-SVM": score_svm,
        "Balanced RF": score_rf,
        "QSVC (Fidelity)": score_fid,
        "Projected QSVC (PQK)": score_pqk
    }

    # Figure 2: PR & ROC Curves
    print("\n[Step 4/4] Exporting Figure 2: PR & ROC Curves (300 DPI)...", flush=True)
    curves_path = os.path.join(project_root, "results", "figures", "pr_and_roc_curves.png")
    FraudVisualizer.plot_pr_and_roc_curves(results, y_test, scores_dict, save_path=curves_path)

    # Figure 3: 2D Decision Boundaries
    data_2d = pipeline.prepare_quantum_data(df, n_qubits=2, n_quantum_train=100, n_quantum_test=40)
    X_train_2d = data_2d["X_train_quantum"]
    y_train_2d = data_2d["y_train_quantum"]

    svm_2d = ClassicalFraudBaselines.get_classical_svm(C=1.0).fit(X_train_2d, y_train_2d)
    rf_2d = ClassicalFraudBaselines.get_random_forest(n_estimators=60).fit(X_train_2d, y_train_2d)

    boundaries_path = os.path.join(project_root, "results", "figures", "decision_boundaries_2d.png")
    FraudVisualizer.plot_decision_boundaries_2d(
        X_train_2d,
        y_train_2d,
        {"Classical RBF-SVM": svm_2d, "Balanced Random Forest": rf_2d},
        save_path=boundaries_path
    )

    # Export JSON metrics
    json_path = os.path.join(project_root, "results", "metrics_summary.json")
    FraudVisualizer.export_metrics_json(results, save_path=json_path)

    print("\n" + "=" * 80, flush=True)
    print("  ALL PUBLICATION FIGURES & JSON EXPORTS GENERATED")
    print("=" * 80, flush=True)
    print(f"Figures Directory: {os.path.join(project_root, 'results', 'figures')}", flush=True)
    print(f"Metrics JSON:      {json_path}", flush=True)
    print(FraudEvaluator.format_results_table(results), flush=True)


if __name__ == "__main__":
    main()
