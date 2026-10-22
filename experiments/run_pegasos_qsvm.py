"""
Experiment: Pegasos QSVC (Primal Estimated Subgradient Solver)
Trains quantum support vector machine iteratively without full Gram matrix precomputation.
"""

import sys
import os
import time
import numpy as np

current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
if project_root not in sys.path:
    sys.path.insert(0, project_root)

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8")

from src.data_pipeline import FraudDataPipeline
from src.feature_maps import FraudQuantumFeatureMaps
from src.models import PegasosQuantumClassifier, QuantumFraudClassifier
from src.evaluation import FraudEvaluator
from qiskit_machine_learning.kernels import FidelityQuantumKernel


def main():
    print("=" * 80, flush=True)
    print("  EXPERIMENT: PEGASOS QSVC (SUB-GRADIENT STOCHASTIC QUANTUM SVM)", flush=True)
    print("=" * 80, flush=True)

    pipeline = FraudDataPipeline(random_state=42)
    df = pipeline.generate_synthetic_data(n_samples=1000, fraud_ratio=0.08)
    data = pipeline.prepare_quantum_data(df, n_qubits=4, n_quantum_train=60, n_quantum_test=25)

    X_train = data["X_train_quantum"]
    y_train = data["y_train_quantum"]
    X_test = data["X_test_quantum"]
    y_test = data["y_test_quantum"]

    feature_map = FraudQuantumFeatureMaps.get_zz_feature_map(feature_dimension=4, reps=1)
    fidelity_kernel = FidelityQuantumKernel(feature_map=feature_map)

    print("\n[Step 1/2] Training Pegasos QSVC (T=30 stochastic sub-gradient steps)...", flush=True)
    t0 = time.perf_counter()
    pegasos = PegasosQuantumClassifier(quantum_kernel=fidelity_kernel, C=1.0, num_steps=30)
    pegasos.fit(X_train, y_train)
    t_train = time.perf_counter() - t0
    print(f"  Training finished in {t_train:.2f}s", flush=True)

    print("\n[Step 2/2] Evaluating Model on Validation Partition...", flush=True)
    preds = pegasos.predict(X_test)
    scores = pegasos.decision_function(X_test)
    metrics = FraudEvaluator.evaluate_predictions(y_test, preds, scores)

    print("\n" + "=" * 80, flush=True)
    print("  PEGASOS QSVC BENCHMARK RESULTS", flush=True)
    print("=" * 80, flush=True)
    print(f"Algorithm:                   Pegasos Subgradient Descent (T=30)", flush=True)
    print(f"Training Time:               {t_train:.2f}s", flush=True)
    print(f"Fraud Detection Recall:      {metrics['recall'] * 100:.1f}%", flush=True)
    print(f"Precision:                   {metrics['precision'] * 100:.1f}%", flush=True)
    print(f"F1-Score:                    {metrics['f1_score']:.4f}", flush=True)
    print(f"ROC-AUC:                     {metrics['roc_auc']:.4f}", flush=True)
    print(f"Average Precision (PR-AUC):  {metrics['pr_auc']:.4f}", flush=True)
    print(f"Confusion Matrix:            {metrics['confusion_matrix']}", flush=True)
    print("=" * 80, flush=True)


if __name__ == "__main__":
    main()
