"""
Quantum Fraud Detection - Models
Implements:
1. QuantumFraudClassifier (Supervised QSVC with custom kernels, class-weight balancing, and probability scoring)
2. QuantumOneClassDetector (Unsupervised Quantum Support Vector Data Description on legitimate transactions)
3. ClassicalFraudBaselines (Balanced Random Forest, RBF-SVM, Logistic Regression)
"""

import numpy as np
from typing import Optional, Dict, Any, Union
from sklearn.svm import SVC, OneClassSVM
from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV


class QuantumFraudClassifier:
    """
    Supervised Quantum Support Vector Classifier for financial fraud detection.
    Can operate directly on precomputed quantum Gram matrices or feature vectors.
    """

    def __init__(
        self,
        C: float = 1.0,
        class_weight: Union[str, dict] = "balanced",
        kernel_engine=None,
        kernel_type: str = "fidelity",  # 'fidelity' or 'projected'
        gamma: Optional[float] = None,
        probability: bool = False
    ):
        self.C = C
        self.class_weight = class_weight
        self.kernel_engine = kernel_engine
        self.kernel_type = kernel_type
        self.gamma = gamma
        self.probability = probability
        self.svm = SVC(
            C=self.C,
            kernel="precomputed",
            class_weight=self.class_weight,
            random_state=42
        )
        self.X_train_ref = None

    def _compute_kernel(self, X1: np.ndarray, X2: Optional[np.ndarray] = None) -> np.ndarray:
        if self.kernel_engine is None:
            raise ValueError("kernel_engine must be provided to compute quantum kernel matrices.")
        if self.kernel_type == "projected":
            return self.kernel_engine.compute_projected_kernel_matrix(X1, X2, gamma=self.gamma)
        return self.kernel_engine.compute_fidelity_matrix(X1, X2)

    def fit(self, X_train: np.ndarray, y_train: np.ndarray, precomputed_K: Optional[np.ndarray] = None):
        """Fits QSVC using quantum kernel matrix."""
        self.X_train_ref = X_train
        if precomputed_K is not None:
            K_train = precomputed_K
        else:
            K_train = self._compute_kernel(X_train)

        self.svm.fit(K_train, y_train)
        return self

    def predict(self, X_test: np.ndarray, precomputed_K: Optional[np.ndarray] = None) -> np.ndarray:
        """Predicts 0 (legitimate) or 1 (fraud)."""
        if precomputed_K is not None:
            K_test = precomputed_K
        else:
            K_test = self._compute_kernel(X_test, self.X_train_ref)
        return self.svm.predict(K_test)

    def decision_function(self, X_test: np.ndarray, precomputed_K: Optional[np.ndarray] = None) -> np.ndarray:
        """Returns signed distance to separating hyperplane."""
        if precomputed_K is not None:
            K_test = precomputed_K
        else:
            K_test = self._compute_kernel(X_test, self.X_train_ref)
        return self.svm.decision_function(K_test)

    def predict_proba(self, X_test: np.ndarray, precomputed_K: Optional[np.ndarray] = None) -> np.ndarray:
        """Returns calibrated fraud probabilities."""
        if precomputed_K is not None:
            K_test = precomputed_K
        else:
            K_test = self._compute_kernel(X_test, self.X_train_ref)
        return self.svm.predict_proba(K_test)


class QuantumOneClassDetector:
    """
    Unsupervised Quantum Anomaly Detector (One-Class QSVM / QSVDD).
    Trained strictly on legitimate transactions to enclose normal activity within a minimum
    quantum Hilbert hypersphere. Anomalous/fraud transactions fall outside this sphere.
    """

    def __init__(
        self,
        nu: float = 0.05,
        kernel_engine=None,
        kernel_type: str = "projected",
        gamma: Optional[float] = None
    ):
        self.nu = nu  # Upper bound on training errors / fraction of legitimate anomalies
        self.kernel_engine = kernel_engine
        self.kernel_type = kernel_type
        self.gamma = gamma
        self.oc_svm = OneClassSVM(kernel="precomputed", nu=self.nu)
        self.X_train_legit_ref = None

    def _compute_kernel(self, X1: np.ndarray, X2: Optional[np.ndarray] = None) -> np.ndarray:
        if self.kernel_engine is None:
            raise ValueError("kernel_engine must be provided to compute quantum kernel matrices.")
        if self.kernel_type == "projected":
            return self.kernel_engine.compute_projected_kernel_matrix(X1, X2, gamma=self.gamma)
        return self.kernel_engine.compute_fidelity_matrix(X1, X2)

    def fit(self, X_train_legit: np.ndarray, precomputed_K: Optional[np.ndarray] = None):
        """Fits One-Class model exclusively on legitimate transaction samples."""
        self.X_train_legit_ref = X_train_legit
        if precomputed_K is not None:
            K_train = precomputed_K
        else:
            K_train = self._compute_kernel(X_train_legit)

        self.oc_svm.fit(K_train)
        return self

    def predict(self, X_test: np.ndarray, precomputed_K: Optional[np.ndarray] = None) -> np.ndarray:
        """
        OneClassSVM outputs: +1 for inlier (legitimate), -1 for outlier (fraud).
        We map this to standard fraud detection convention: 0 (legitimate), 1 (fraud).
        """
        if precomputed_K is not None:
            K_test = precomputed_K
        else:
            K_test = self._compute_kernel(X_test, self.X_train_legit_ref)
        raw_pred = self.oc_svm.predict(K_test)
        return np.where(raw_pred == -1, 1, 0)

    def decision_function(self, X_test: np.ndarray, precomputed_K: Optional[np.ndarray] = None) -> np.ndarray:
        """
        Returns fraud anomaly score: higher score = higher risk of fraud (negated distance to boundary).
        """
        if precomputed_K is not None:
            K_test = precomputed_K
        else:
            K_test = self._compute_kernel(X_test, self.X_train_legit_ref)
        return -self.oc_svm.decision_function(K_test)


class PegasosQuantumClassifier:
    """
    Pegasos Quantum Support Vector Classifier (PegasosQSVC).
    Uses stochastic sub-gradient descent to solve SVM primal optimization
    without needing to construct the full N x N Gram matrix upfront.
    Ideal for scaling quantum classification to larger transaction datasets.
    """

    def __init__(
        self,
        quantum_kernel=None,
        C: float = 1.0,
        num_steps: int = 50,
        precomputed_kernel_matrix: bool = False
    ):
        self.C = C
        self.num_steps = num_steps
        self.quantum_kernel = quantum_kernel
        self.precomputed_kernel_matrix = precomputed_kernel_matrix
        self._pegasos = None

    def fit(self, X_train: np.ndarray, y_train: np.ndarray):
        """Fits Pegasos QSVC on training transaction features."""
        from qiskit_machine_learning.algorithms import PegasosQSVC
        # Pegasos expects binary labels in {0, 1} or {-1, 1}
        self._pegasos = PegasosQSVC(
            quantum_kernel=self.quantum_kernel,
            C=self.C,
            num_steps=self.num_steps
        )
        self._pegasos.fit(X_train, y_train)
        return self

    def predict(self, X_test: np.ndarray) -> np.ndarray:
        """Predicts labels for test transactions."""
        return self._pegasos.predict(X_test)

    def decision_function(self, X_test: np.ndarray) -> np.ndarray:
        """Returns signed decision function score."""
        return self._pegasos.decision_function(X_test)


class ClassicalFraudBaselines:
    """Standard classical machine learning benchmarks trained on identical data."""

    @staticmethod
    def get_classical_svm(C: float = 1.0, gamma: str = "scale") -> SVC:
        return SVC(kernel="rbf", C=C, gamma=gamma, class_weight="balanced", random_state=42)

    @staticmethod
    def get_random_forest(n_estimators: int = 150) -> RandomForestClassifier:
        return RandomForestClassifier(
            n_estimators=n_estimators,
            class_weight="balanced",
            max_depth=8,
            random_state=42
        )

    @staticmethod
    def get_logistic_regression() -> LogisticRegression:
        return LogisticRegression(class_weight="balanced", random_state=42)
