"""
Quantum Fraud Detection - Publication-Grade Visualization Suite
Generates 300 DPI publication-ready figures:
1. Kernel Heatmap Comparison (Classical RBF vs Fidelity Quantum vs Projected Quantum)
2. 2D Decision Boundaries (Quantum vs Classical Hyperplanes)
3. Precision-Recall & ROC Curve Diagnostics
4. Exports structured JSON metrics summary
"""

import os
import json
import numpy as np
import matplotlib
matplotlib.use("Agg")  # Non-interactive backend for headless figure generation
import matplotlib.pyplot as plt
from typing import Dict, Any, Optional


class FraudVisualizer:
    """Generates publication-quality figures and plots for research presentations."""

    @staticmethod
    def ensure_dir(path: str):
        directory = os.path.dirname(path)
        if directory and not os.path.exists(directory):
            os.makedirs(directory, exist_ok=True)

    @classmethod
    def plot_kernel_heatmaps_comparison(
        cls,
        K_classical: np.ndarray,
        K_fidelity: np.ndarray,
        K_projected: np.ndarray,
        save_path: str = "results/figures/kernel_heatmaps_comparison.png",
        max_dim: int = 25
    ):
        """Generates 3-panel side-by-side comparison of Gram matrices."""
        cls.ensure_dir(save_path)
        k_c = K_classical[:max_dim, :max_dim]
        k_f = K_fidelity[:max_dim, :max_dim]
        k_p = K_projected[:max_dim, :max_dim]

        fig, axes = plt.subplots(1, 3, figsize=(15, 4.5), dpi=300)

        im0 = axes[0].imshow(k_c, cmap="Blues", vmin=0, vmax=1)
        axes[0].set_title("(a) Classical RBF Kernel", fontsize=11, fontweight="bold", pad=8)
        axes[0].set_xlabel("Sample Index", fontsize=9)
        axes[0].set_ylabel("Sample Index", fontsize=9)
        plt.colorbar(im0, ax=axes[0], fraction=0.046, pad=0.04)

        im1 = axes[1].imshow(k_f, cmap="Blues", vmin=0, vmax=1)
        axes[1].set_title("(b) Fidelity Quantum Kernel", fontsize=11, fontweight="bold", pad=8)
        axes[1].set_xlabel("Sample Index", fontsize=9)
        plt.colorbar(im1, ax=axes[1], fraction=0.046, pad=0.04)

        im2 = axes[2].imshow(k_p, cmap="Blues", vmin=0, vmax=1)
        axes[2].set_title("(c) Projected Quantum Kernel (PQK)", fontsize=11, fontweight="bold", pad=8)
        axes[2].set_xlabel("Sample Index", fontsize=9)
        plt.colorbar(im2, ax=axes[2], fraction=0.046, pad=0.04)

        plt.tight_layout()
        plt.savefig(save_path, dpi=300)
        plt.close(fig)
        print(f"[Visualizer] Saved Kernel Heatmaps to: {save_path}")

    @classmethod
    def plot_decision_boundaries_2d(
        cls,
        X_2d: np.ndarray,
        y: np.ndarray,
        models_dict: Dict[str, Any],
        save_path: str = "results/figures/decision_boundaries_2d.png"
    ):
        """Plots 2D decision boundary contours for Quantum and Classical models."""
        cls.ensure_dir(save_path)
        n_models = len(models_dict)
        fig, axes = plt.subplots(1, n_models, figsize=(5.5 * n_models, 4.5), dpi=300)
        if n_models == 1:
            axes = [axes]

        # Mesh grid for contour
        x_min, x_max = X_2d[:, 0].min() - 0.5, X_2d[:, 0].max() + 0.5
        y_min, y_max = X_2d[:, 1].min() - 0.5, X_2d[:, 1].max() + 0.5
        xx, yy = np.meshgrid(np.linspace(x_min, x_max, 100), np.linspace(y_min, y_max, 100))
        grid_points = np.c_[xx.ravel(), yy.ravel()]

        for idx, (name, model) in enumerate(models_dict.items()):
            ax = axes[idx]
            try:
                if hasattr(model, "decision_function"):
                    Z = model.decision_function(grid_points)
                else:
                    Z = model.predict(grid_points)
                Z = Z.reshape(xx.shape)
                
                # Decision boundary contour
                ax.contourf(xx, yy, Z, levels=[-100, 0, 100], alpha=0.15, colors=["#26734D", "#B93838"])
                ax.contour(xx, yy, Z, levels=[0], linewidths=1.8, colors="#3559A6")
            except Exception:
                pass

            # Scatter samples
            legit = (y == 0)
            fraud = (y == 1)
            ax.scatter(X_2d[legit, 0], X_2d[legit, 1], c="#26734D", s=20, alpha=0.6, label="Legitimate")
            ax.scatter(X_2d[fraud, 0], X_2d[fraud, 1], c="#B93838", s=35, marker="^", edgecolors="black", linewidth=0.5, label="Fraud")
            
            ax.set_title(name, fontsize=11, fontweight="bold", pad=8)
            ax.set_xlabel("Principal Component 1", fontsize=9)
            if idx == 0:
                ax.set_ylabel("Principal Component 2", fontsize=9)
            ax.legend(loc="upper right", fontsize=8)
            ax.grid(True, linestyle="--", alpha=0.3)

        plt.tight_layout()
        plt.savefig(save_path, dpi=300)
        plt.close(fig)
        print(f"[Visualizer] Saved Decision Boundaries to: {save_path}")

    @classmethod
    def plot_pr_and_roc_curves(
        cls,
        eval_dict: Dict[str, Dict[str, Any]],
        y_test: np.ndarray,
        scores_dict: Dict[str, np.ndarray],
        save_path: str = "results/figures/pr_and_roc_curves.png"
    ):
        """Generates publication-quality PR-AUC and ROC-AUC curves."""
        from sklearn.metrics import precision_recall_curve, roc_curve, auc
        cls.ensure_dir(save_path)

        fig, (ax_pr, ax_roc) = plt.subplots(1, 2, figsize=(11, 4.8), dpi=300)
        colors = ["#3559A6", "#26734D", "#A86B16", "#B93838", "#64748B"]

        color_idx = 0
        for name, scores in scores_dict.items():
            if scores is None or len(np.unique(y_test)) < 2:
                continue
            c = colors[color_idx % len(colors)]
            color_idx += 1

            # PR Curve
            precision, recall, _ = precision_recall_curve(y_test, scores)
            pr_auc_val = auc(recall, precision)
            ax_pr.plot(recall, precision, label=f"{name} (PR-AUC = {pr_auc_val:.3f})", color=c, linewidth=1.8)

            # ROC Curve
            fpr, tpr, _ = roc_curve(y_test, scores)
            roc_auc_val = auc(fpr, tpr)
            ax_roc.plot(fpr, tpr, label=f"{name} (ROC-AUC = {roc_auc_val:.3f})", color=c, linewidth=1.8)

        ax_pr.set_title("Precision-Recall Curves", fontsize=11, fontweight="bold", pad=8)
        ax_pr.set_xlabel("Recall", fontsize=9)
        ax_pr.set_ylabel("Precision", fontsize=9)
        ax_pr.set_ylim([0, 1.05])
        ax_pr.legend(loc="lower left", fontsize=8)
        ax_pr.grid(True, linestyle="--", alpha=0.3)

        ax_roc.plot([0, 1], [0, 1], linestyle="--", color="#94A3B8", label="Random Chance")
        ax_roc.set_title("ROC Curves", fontsize=11, fontweight="bold", pad=8)
        ax_roc.set_xlabel("False Positive Rate", fontsize=9)
        ax_roc.set_ylabel("True Positive Rate (Recall)", fontsize=9)
        ax_roc.set_ylim([0, 1.05])
        ax_roc.legend(loc="lower right", fontsize=8)
        ax_roc.grid(True, linestyle="--", alpha=0.3)

        plt.tight_layout()
        plt.savefig(save_path, dpi=300)
        plt.close(fig)
        print(f"[Visualizer] Saved PR & ROC Curves to: {save_path}")

    @classmethod
    def export_metrics_json(
        cls,
        results_dict: Dict[str, Any],
        save_path: str = "results/metrics_summary.json"
    ):
        """Exports evaluation results to JSON."""
        cls.ensure_dir(save_path)
        with open(save_path, "w", encoding="utf-8") as f:
            json.dump(results_dict, f, indent=2)
        print(f"[Visualizer] Exported metrics summary JSON to: {save_path}")
