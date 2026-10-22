"""
Experiment: Trainable Quantum Kernel via Kernel Target Alignment (KTA)
Optimizes circuit parameters theta using classical COBYLA to maximize alignment with fraud labels.
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
from src.quantum_kernels import TrainableQuantumKernel, QuantumKernelEngine
from src.models import QuantumFraudClassifier
from src.evaluation import FraudEvaluator


def main():
    print("=" * 80, flush=True)
    print("  EXPERIMENT: TRAINABLE QUANTUM KERNEL (KTA OPTIMIZATION)", flush=True)
    print("=" * 80, flush=True)

    pipeline = FraudDataPipeline(random_state=42)
    df = pipeline.generate_synthetic_data(n_samples=1500, fraud_ratio=0.06)
    data = pipeline.prepare_quantum_data(df, n_qubits=4, n_quantum_train=80, n_quantum_test=30)

    X_train = data["X_train_quantum"]
    y_train = data["y_train_quantum"]
    X_test = data["X_test_quantum"]
    y_test = data["y_test_quantum"]

    trainable_engine = TrainableQuantumKernel(num_qubits=4, reps=1)

    print("\n[Step 1/3] Optimizing Variational Angles theta...", flush=True)
    opt_results = trainable_engine.train_parameters(X_train, y_train, max_iter=25, verbose=True)

    print("\n[Step 2/3] Evaluating Gram Matrices...", flush=True)
    K_train_opt = trainable_engine.compute_kernel_matrix(X_train)
    K_test_opt = trainable_engine.compute_kernel_matrix(X_test, X_train)

    print("\n[Step 3/3] Training QSVC with Optimized Quantum Kernel...", flush=True)
    qsvc = QuantumFraudClassifier(C=1.0, class_weight="balanced")
    qsvc.fit(X_train, y_train, precomputed_K=K_train_opt)
    preds = qsvc.predict(X_test, precomputed_K=K_test_opt)
    scores = qsvc.decision_function(X_test, precomputed_K=K_test_opt)

    metrics = FraudEvaluator.evaluate_predictions(y_test, preds, scores)

    print("\n" + "=" * 80, flush=True)
    print("  TRAINABLE QUANTUM KERNEL EVALUATION RESULTS", flush=True)
    print("=" * 80, flush=True)
    print(f"Initial KTA:                 {opt_results['initial_kta']:.4f}", flush=True)
    print(f"Optimized KTA:               {opt_results['final_kta']:.4f} (+{opt_results['final_kta'] - opt_results['initial_kta']:.4f})", flush=True)
    print(f"Fraud Detection Recall:      {metrics['recall'] * 100:.1f}%", flush=True)
    print(f"Precision:                   {metrics['precision'] * 100:.1f}%", flush=True)
    print(f"F1-Score:                    {metrics['f1_score']:.4f}", flush=True)
    print(f"ROC-AUC:                     {metrics['roc_auc']:.4f}", flush=True)
    print(f"Average Precision (PR-AUC):  {metrics['pr_auc']:.4f}", flush=True)
    print(f"Confusion Matrix:            {metrics['confusion_matrix']}", flush=True)
    print("=" * 80, flush=True)


if __name__ == "__main__":
    main()
