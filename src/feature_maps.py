"""
Quantum Fraud Detection - Feature Maps
Defines quantum circuits for mapping classical transaction features into quantum Hilbert space.
Supports standard ZZFeatureMap, custom PauliFeatureMap, and Data Re-uploading architectures.
"""

from typing import Optional, List, Union
import warnings
import numpy as np
from qiskit import QuantumCircuit
from qiskit.circuit import ParameterVector
from qiskit.circuit.library import ZZFeatureMap, PauliFeatureMap, ZFeatureMap

warnings.filterwarnings("ignore", category=DeprecationWarning)


class FraudQuantumFeatureMaps:
    """Factory and manager for quantum feature maps customized for fraud detection."""

    @staticmethod
    def get_zz_feature_map(
        feature_dimension: int = 4,
        reps: int = 2,
        entanglement: str = "linear"
    ) -> ZZFeatureMap:
        """
        Standard ZZFeatureMap:
        Applies Hadamard -> Rz(x_i) -> Rzz(x_i * x_j).
        Entanglement options: 'linear', 'circular', 'full'.
        """
        return ZZFeatureMap(
            feature_dimension=feature_dimension,
            reps=reps,
            entanglement=entanglement,
            insert_barriers=True
        )

    @staticmethod
    def get_pauli_feature_map(
        feature_dimension: int = 4,
        reps: int = 2,
        paulis: Optional[List[str]] = None,
        entanglement: str = "linear"
    ) -> PauliFeatureMap:
        """
        Custom PauliFeatureMap with higher non-linear expressibility.
        Default paulis: ['Z', 'ZZ', 'X'] to capture both longitudinal phase
        correlations and transverse spin shifts.
        """
        if paulis is None:
            paulis = ["Z", "ZZ", "X"]
        return PauliFeatureMap(
            feature_dimension=feature_dimension,
            reps=reps,
            paulis=paulis,
            entanglement=entanglement,
            insert_barriers=True
        )

    @staticmethod
    def get_data_reuploading_map(
        feature_dimension: int = 4,
        reps: int = 2,
        entanglement: str = "linear"
    ) -> QuantumCircuit:
        """
        Data Re-uploading Feature Map (Perez-Salinas et al.):
        Alternates data encoding rotations R_y(x), R_z(x) with entangling CNOT layers
        and variational phases to maximize expressibility on shallow circuits.
        """
        qc = QuantumCircuit(feature_dimension, name="DataReuploadingMap")
        x_params = ParameterVector("x", length=feature_dimension)

        for r in range(reps):
            # 1. Hadamard layer
            for i in range(feature_dimension):
                qc.h(i)

            # 2. Re-upload data into Ry and Rz rotations
            for i in range(feature_dimension):
                qc.ry(x_params[i], i)
                qc.rz(x_params[i] * (r + 1), i)

            # 3. Entangling layer
            if entanglement == "linear":
                for i in range(feature_dimension - 1):
                    qc.cx(i, i + 1)
            elif entanglement == "circular":
                for i in range(feature_dimension):
                    qc.cx(i, (i + 1) % feature_dimension)
            elif entanglement == "full":
                for i in range(feature_dimension):
                    for j in range(i + 1, feature_dimension):
                        qc.cx(i, j)

            qc.barrier()

        return qc

    @staticmethod
    def inspect_circuit(circuit: QuantumCircuit) -> str:
        """Returns circuit depth, qubit count, gate count, and text diagram."""
        decomp = circuit.decompose()
        try:
            diagram = decomp.draw(output="text", encoding="ascii")
        except Exception:
            try:
                diagram = decomp.draw(output="text")
            except Exception:
                diagram = f"QuantumCircuit({circuit.num_qubits} qubits, depth={decomp.depth()})"

        summary = (
            f"--- Quantum Feature Map: {circuit.name} ---\n"
            f"Qubits:          {circuit.num_qubits}\n"
            f"Transpiled Depth: {decomp.depth()}\n"
            f"Gate Breakdown:   {dict(decomp.count_ops())}\n\n"
            f"Decomposed Circuit Diagram:\n"
            f"{diagram}\n"
        )
        return summary
