"""
Experiment: Imbalance Handling Benchmark for Quantum SVM
Compares Class-Weighted Loss vs SMOTE Oversampling vs Undersampling in Quantum Feature Space.
"""

import sys
import os
import numpy as np

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from src.data_pipeline import FraudDataPipeline
from src.feature_maps import FraudQuantumFeatureMaps
from src.quantum_kernels import QuantumKernelEngine
from src.models import QuantumFraudClassifier
from src.evaluation import FraudEvaluator


def main():
    print("=" * 80, flush=True)
    print("  EXPERIMENT: CLASS IMBALANCE MITIGATION BENCHMARK (QSVM)", flush=True)
    print("=" * 80, flush=True)

    pipeline = FraudDataPipeline(random_state=42)
    df = pipeline.generate_synthetic_data(n_samples=2000, fraud_ratio=0.05)
    data = pipeline.prepare_quantum_data(df, n_qubits=4, n_quantum_train=100, n_quantum_test=40)

    X_train_raw = data["X_train_quantum"]
    y_train_raw = data["y_train_quantum"]
    X_test = data["X_test_quantum"]
    y_test = data["y_test_quantum"]

    feature_map = FraudQuantumFeatureMaps.get_zz_feature_map(feature_dimension=4, reps=1)
    kernel_engine = QuantumKernelEngine(feature_map=feature_map)

    strategies = ["balanced_weights", "smote", "undersample"]
    benchmark_results = {}

    for strat in strategies:
        print(f"\n--- Testing Imbalance Strategy: {strat.upper()} ---", flush=True)
        X_train_strat, y_train_strat = pipeline.apply_imbalance_strategy(X_train_raw, y_train_raw, strategy=strat)

        # Compute Gram matrices
        K_train = kernel_engine.compute_fidelity_matrix(X_train_strat)
        K_test = kernel_engine.compute_fidelity_matrix(X_test, X_train_strat)

        # Fit QSVC
        weight_setting = "balanced" if strat == "balanced_weights" else None
        qsvc = QuantumFraudClassifier(C=1.0, class_weight=weight_setting)
        qsvc.fit(X_train_strat, y_train_strat, precomputed_K=K_train)

        preds = qsvc.predict(X_test, precomputed_K=K_test)
        scores = qsvc.decision_function(X_test, precomputed_K=K_test)

        metrics = FraudEvaluator.evaluate_predictions(y_test, preds, scores)
        benchmark_results[f"Strategy: {strat}"] = metrics
        print(f"  Recall: {metrics['recall']*100:.1f}%, Precision: {metrics['precision']*100:.1f}%, F1: {metrics['f1_score']:.4f}")

    print("\n" + "=" * 80, flush=True)
    print("  IMBALANCE MITIGATION COMPARISON TABLE", flush=True)
    print("=" * 80, flush=True)
    print(FraudEvaluator.format_results_table(benchmark_results), flush=True)


if __name__ == "__main__":
    main()
