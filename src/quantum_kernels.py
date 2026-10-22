"""
Quantum Fraud Detection - Quantum Kernel Engine
Implements:
1. Fidelity Quantum Kernel (FidelityQuantumKernel via Qiskit Machine Learning)
2. Projected Quantum Kernel (PQK - Huang et al., 2021) for exponential concentration mitigation
3. Trainable Quantum Kernel via Kernel Target Alignment (KTA) optimization
"""

import numpy as np
from typing import Optional, Tuple, Callable
from scipy.optimize import minimize
from qiskit import QuantumCircuit
from qiskit.quantum_info import Statevector, SparsePauliOp
from qiskit_machine_learning.kernels import FidelityQuantumKernel


class QuantumKernelEngine:
    """Computes quantum Gram similarity matrices for transaction vectors."""

    def __init__(self, feature_map: QuantumCircuit):
        self.feature_map = feature_map
        self.num_features = feature_map.num_qubits
        self._fidelity_kernel = None

    def get_fidelity_kernel(self) -> FidelityQuantumKernel:
        """Initializes or returns Qiskit's FidelityQuantumKernel."""
        if self._fidelity_kernel is None:
            self._fidelity_kernel = FidelityQuantumKernel(feature_map=self.feature_map)
        return self._fidelity_kernel

    def compute_statevectors(self, X: np.ndarray) -> np.ndarray:
        """
        Computes the quantum statevector |phi(x)> for each transaction in X.
        Returns a matrix of shape (n_samples, 2^n_qubits).
        """
        n_samples = X.shape[0]
        dim = 2 ** self.num_features
        statevectors = np.zeros((n_samples, dim), dtype=complex)
        
        for i in range(n_samples):
            bound_qc = self.feature_map.assign_parameters(X[i])
            sv = Statevector.from_instruction(bound_qc)
            statevectors[i] = sv.data
            
        return statevectors

    def compute_fidelity_matrix(
        self,
        X_1: np.ndarray,
        X_2: Optional[np.ndarray] = None,
        use_hardware: bool = False
    ) -> np.ndarray:
        """
        Computes pairwise quantum state fidelity:
        K(x_i, x_j) = |<phi(x_i) | phi(x_j)>|^2
        For simulation, uses fast exact statevector inner products.
        For hardware execution, falls back to Qiskit's FidelityQuantumKernel.
        """
        if use_hardware:
            kernel = self.get_fidelity_kernel()
            return kernel.evaluate(x_vec=X_1, y_vec=X_2)
            
        # Fast exact statevector inner product: K_ij = |<psi_i | psi_j>|^2
        V_1 = self.compute_statevectors(X_1)
        V_2 = V_1 if X_2 is None else self.compute_statevectors(X_2)
        
        # Inner products: V_1 @ V_2^dagger
        inner_products = np.dot(V_1, np.conjugate(V_2).T)
        fidelity_matrix = np.abs(inner_products) ** 2
        return np.clip(fidelity_matrix, 0.0, 1.0)

    def extract_projected_quantum_features(self, X: np.ndarray) -> np.ndarray:
        """
        Projected Quantum Kernel (PQK - Huang et al., 2021):
        For each transaction x, projects the quantum state |phi(x)> down to 1-qubit
        reduced density matrix expectation values: <X_k>, <Y_k>, <Z_k> for each qubit k.
        Returns a feature matrix of shape (n_samples, 3 * num_qubits).
        """
        n_samples = X.shape[0]
        n_qubits = self.num_features
        pq_features = np.zeros((n_samples, n_qubits * 3))

        # Pre-construct 1-qubit Pauli observables for each qubit
        pauli_ops = []
        for k in range(n_qubits):
            for pauli_char in ["X", "Y", "Z"]:
                # SparsePauliOp with pauli_char at index k and 'I' elsewhere
                op_str = ["I"] * n_qubits
                op_str[k] = pauli_char
                pauli_ops.append(SparsePauliOp("".join(reversed(op_str))))

        for i in range(n_samples):
            # Bind transaction parameters into circuit
            bound_qc = self.feature_map.assign_parameters(X[i])
            sv = Statevector.from_instruction(bound_qc)
            
            # Compute expectation values for each Pauli operator
            for op_idx, op in enumerate(pauli_ops):
                pq_features[i, op_idx] = float(np.real(sv.expectation_value(op)))

        return pq_features

    def compute_projected_kernel_matrix(
        self,
        X_1: np.ndarray,
        X_2: Optional[np.ndarray] = None,
        gamma: Optional[float] = None
    ) -> np.ndarray:
        """
        Computes the Projected Quantum Kernel:
        K_PQ(x, x') = exp( - gamma * sum_k ||rho_k(x) - rho_k(x')||_F^2 )
        This mitigates exponential concentration (barren plateaus in kernel space).
        """
        phi_1 = self.extract_projected_quantum_features(X_1)
        phi_2 = phi_1 if X_2 is None else self.extract_projected_quantum_features(X_2)

        if gamma is None:
            gamma = 1.0 / phi_1.shape[1]

        # Pairwise squared Euclidean distance over projected quantum features
        # ||phi_1 - phi_2||^2 = ||phi_1||^2 + ||phi_2||^2 - 2 * phi_1 . phi_2^T
        sq_dists = (
            np.sum(phi_1**2, axis=1, keepdims=True)
            + np.sum(phi_2**2, axis=1, keepdims=True).T
            - 2.0 * np.dot(phi_1, phi_2.T)
        )
        sq_dists = np.maximum(sq_dists, 0.0)
        return np.exp(-gamma * sq_dists)

    @staticmethod
    def kernel_target_alignment(K: np.ndarray, y: np.ndarray) -> float:
        """
        Computes Kernel Target Alignment (KTA):
        T(K, y) = (y^T K y) / (n * ||K||_F)
        where y in {-1, +1}^n. Higher alignment indicates the kernel aligns with fraud labels.
        """
        # Map labels to {-1, +1}
        y_signed = np.where(y == 0, -1, 1).astype(float)
        y_matrix = np.outer(y_signed, y_signed)
        
        frobenius_norm_K = np.linalg.norm(K, "fro")
        frobenius_norm_Y = np.linalg.norm(y_matrix, "fro")
        
        if frobenius_norm_K == 0 or frobenius_norm_Y == 0:
            return 0.0
            
        alignment = np.sum(K * y_matrix) / (frobenius_norm_K * frobenius_norm_Y)
        return float(alignment)


class TrainableQuantumKernel:
    """
    Trainable Quantum Kernel via Kernel Target Alignment (KTA).
    Parameterizes single-qubit rotations and entangling phases with variational angles theta.
    Uses classical optimization (COBYLA) to align the quantum Gram matrix with fraud labels.
    """

    def __init__(self, num_qubits: int = 4, reps: int = 1):
        self.num_qubits = num_qubits
        self.reps = reps
        # Parameters: single-qubit weights (n_qubits) + two-qubit entangling weights (n_qubits - 1)
        self.num_params = num_qubits + (num_qubits - 1)
        self.optimal_theta = np.ones(self.num_params)
        self.loss_history = []

    def build_parameterized_circuit(self, x: np.ndarray, theta: np.ndarray) -> QuantumCircuit:
        """Constructs U(x, theta) with variational scaling."""
        qc = QuantumCircuit(self.num_qubits)
        
        # 1. Hadamards
        for i in range(self.num_qubits):
            qc.h(i)
            
        # 2. Parameterized feature encoding: Rz(theta_i * x_i)
        for i in range(self.num_qubits):
            qc.rz(theta[i] * x[i], i)
            
        # 3. Parameterized entangling interaction: Rzz(theta_ij * x_i * x_{i+1})
        param_offset = self.num_qubits
        for i in range(self.num_qubits - 1):
            qc.cx(i, i + 1)
            qc.rz(theta[param_offset + i] * (np.pi - x[i]) * (np.pi - x[i + 1]), i + 1)
            qc.cx(i, i + 1)
            
        return qc

    def compute_statevectors(self, X: np.ndarray, theta: np.ndarray) -> np.ndarray:
        """Computes statevectors under parameters theta."""
        n_samples = X.shape[0]
        dim = 2 ** self.num_qubits
        statevectors = np.zeros((n_samples, dim), dtype=complex)
        
        for i in range(n_samples):
            qc = self.build_parameterized_circuit(X[i], theta)
            sv = Statevector.from_instruction(qc)
            statevectors[i] = sv.data
            
        return statevectors

    def compute_kernel_matrix(self, X_1: np.ndarray, X_2: Optional[np.ndarray] = None, theta: Optional[np.ndarray] = None) -> np.ndarray:
        """Evaluates Gram matrix K(x_i, x_j) under parameters theta."""
        params = self.optimal_theta if theta is None else theta
        V_1 = self.compute_statevectors(X_1, params)
        V_2 = V_1 if X_2 is None else self.compute_statevectors(X_2, params)
        
        inner_prods = np.dot(V_1, np.conjugate(V_2).T)
        return np.clip(np.abs(inner_prods) ** 2, 0.0, 1.0)

    def train_parameters(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        max_iter: int = 25,
        verbose: bool = True
    ) -> Dict[str, Any]:
        """
        Optimizes theta to maximize Kernel Target Alignment T(K_theta, y).
        Objective: minimize -T(K_theta, y) via COBYLA.
        """
        init_theta = np.ones(self.num_params)
        self.loss_history = []

        def objective(theta):
            K = self.compute_kernel_matrix(X_train, theta=theta)
            kta = QuantumKernelEngine.kernel_target_alignment(K, y_train)
            loss = -kta  # Minimize negative KTA
            self.loss_history.append(kta)
            return loss

        init_kta = -objective(init_theta)
        if verbose:
            print(f"[TrainableKernel] Initial KTA: {init_kta:.4f}. Optimizing {self.num_params} variational parameters...")

        res = minimize(
            objective,
            init_theta,
            method="COBYLA",
            options={"maxiter": max_iter, "rhobeg": 0.5}
        )

        self.optimal_theta = res.x
        final_kta = -res.fun

        if verbose:
            print(f"[TrainableKernel] Optimization Finished. Optimal KTA: {final_kta:.4f} (Delta: +{final_kta - init_kta:.4f})")
            print(f"  Optimal Theta: {np.round(self.optimal_theta, 3)}")

        return {
            "initial_kta": init_kta,
            "final_kta": final_kta,
            "optimal_theta": self.optimal_theta,
            "loss_history": self.loss_history
        }

