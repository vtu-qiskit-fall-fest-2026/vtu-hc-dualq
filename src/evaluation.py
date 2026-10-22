"""
Quantum Fraud Detection - Evaluation & Diagnostics
Calculates complete fraud detection metrics:
- Precision, Recall, F1, Balanced Accuracy, ROC-AUC, Average Precision (PR-AUC)
- Confusion Matrix (TP, FP, TN, FN)
- Quantum Geometric Difference g_classical(K_Q) (Huang et al., Nature Communications 2021)
- Formats comparison benchmarks
"""

import numpy as np
from typing import Dict, Any, Optional
from sklearn.metrics import (
    confusion_matrix,
    classification_report,
    precision_score,
    recall_score,
    f1_score,
    balanced_accuracy_score,
    roc_auc_score,
    average_precision_score,
    accuracy_score
)


class FraudEvaluator:
    """Evaluates fraud detection models and computes quantum diagnostics."""

    @staticmethod
    def evaluate_predictions(
        y_true: np.ndarray,
        y_pred: np.ndarray,
        y_score: Optional[np.ndarray] = None
    ) -> Dict[str, Any]:
        """Calculates comprehensive fraud metrics."""
        cm = confusion_matrix(y_true, y_pred)
        # Handle cases where confusion matrix might have 1 class
        if cm.shape == (2, 2):
            tn, fp, fn, tp = cm.ravel()
        elif cm.shape == (1, 1):
            if y_true[0] == 0:
                tn, fp, fn, tp = cm[0, 0], 0, 0, 0
            else:
                tn, fp, fn, tp = 0, 0, 0, cm[0, 0]
        else:
            tn, fp, fn, tp = 0, 0, 0, 0

        prec = float(precision_score(y_true, y_pred, zero_division=0))
        rec = float(recall_score(y_true, y_pred, zero_division=0))
        f1 = float(f1_score(y_true, y_pred, zero_division=0))
        acc = float(accuracy_score(y_true, y_pred))
        b_acc = float(balanced_accuracy_score(y_true, y_pred))

        roc_auc = None
        pr_auc = None
        if y_score is not None and len(np.unique(y_true)) > 1:
            try:
                roc_auc = float(roc_auc_score(y_true, y_score))
                pr_auc = float(average_precision_score(y_true, y_score))
            except Exception:
                pass

        return {
            "accuracy": acc,
            "balanced_accuracy": b_acc,
            "precision": prec,
            "recall": rec,
            "f1_score": f1,
            "roc_auc": roc_auc,
            "pr_auc": pr_auc,
            "confusion_matrix": {
                "TP": int(tp),
                "FP": int(fp),
                "TN": int(tn),
                "FN": int(fn)
            }
        }

    @staticmethod
    def compute_geometric_difference(
        K_quantum: np.ndarray,
        K_classical: np.ndarray,
        epsilon: float = 1e-4
    ) -> float:
        """
        Computes the Geometric Difference g_classical(K_Q) from Huang et al. (2021):
        g = sqrt( || K_Q^{1/2} (K_C + epsilon * I)^{-1} K_Q^{1/2} ||_inf )
        A large g indicates the quantum feature space accesses geometry difficult for the classical kernel to model.
        """
        n = K_quantum.shape[0]
        # Regularize
        K_c_reg = K_classical + epsilon * np.eye(n)
        
        # SVD / Eigendecomposition of K_quantum for square root
        eigenvals_q, eigenvecs_q = np.linalg.eigh(K_quantum)
        eigenvals_q = np.maximum(eigenvals_q, 0.0)
        sqrt_K_q = eigenvecs_q @ np.diag(np.sqrt(eigenvals_q)) @ eigenvecs_q.T

        # Inverse of classical kernel
        try:
            inv_K_c = np.linalg.inv(K_c_reg)
            M = sqrt_K_q @ inv_K_c @ sqrt_K_q
            # Infinity norm (maximum absolute row sum)
            norm_inf = float(np.max(np.sum(np.abs(M), axis=1)))
            return float(np.sqrt(max(norm_inf, 0.0)))
        except np.linalg.LinAlgError:
            return 1.0

    @staticmethod
    def format_results_table(results_dict: Dict[str, Dict[str, Any]]) -> str:
        """Formats model comparison into a clean markdown table."""
        headers = ["Model", "Recall (Fraud)", "Precision", "F1-Score", "ROC-AUC", "PR-AUC (AvgPrec)", "TP", "FP", "FN"]
        rows = []
        for model_name, res in results_dict.items():
            cm = res.get("confusion_matrix", {})
            roc_str = f"{res['roc_auc']:.4f}" if res.get('roc_auc') is not None else "N/A"
            pr_str = f"{res['pr_auc']:.4f}" if res.get('pr_auc') is not None else "N/A"
            row = [
                model_name,
                f"{res['recall'] * 100:.1f}%",
                f"{res['precision'] * 100:.1f}%",
                f"{res['f1_score']:.4f}",
                roc_str,
                pr_str,
                str(cm.get("TP", 0)),
                str(cm.get("FP", 0)),
                str(cm.get("FN", 0))
            ]
            rows.append(row)

        col_widths = [max(len(row[i]) for row in [headers] + rows) for i in range(len(headers))]
        header_line = "| " + " | ".join(headers[i].ljust(col_widths[i]) for i in range(len(headers))) + " |"
        sep_line = "| " + " | ".join("-" * col_widths[i] for i in range(len(headers))) + " |"
        data_lines = [
            "| " + " | ".join(row[i].ljust(col_widths[i]) for i in range(len(headers))) + " |"
            for row in rows
        ]

        return "\n".join([header_line, sep_line] + data_lines)
