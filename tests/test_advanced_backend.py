"""
Advanced Unit Tests for Quantum Fraud Detection
Tests:
- TrainableQuantumKernel KTA optimization
- PegasosQuantumClassifier training and inference
- Imbalance strategy handling in DataPipeline
- FraudVisualizer figure generation
"""

import unittest
import numpy as np
from src.data_pipeline import FraudDataPipeline
from src.feature_maps import FraudQuantumFeatureMaps
from src.quantum_kernels import QuantumKernelEngine, TrainableQuantumKernel
from src.models import PegasosQuantumClassifier


class TestAdvancedBackend(unittest.TestCase):

    def setUp(self):
        self.pipeline = FraudDataPipeline(random_state=42)
        self.df = self.pipeline.generate_synthetic_data(n_samples=200, fraud_ratio=0.1)
        self.data = self.pipeline.prepare_quantum_data(
            self.df, n_qubits=2, n_quantum_train=30, n_quantum_test=15
        )

    def test_imbalance_strategies(self):
        X = self.data["X_train_quantum"]
        y = self.data["y_train_quantum"]

        # SMOTE
        X_smote, y_smote = self.pipeline.apply_imbalance_strategy(X, y, strategy="smote")
        self.assertGreaterEqual(len(y_smote), len(y))

        # Undersample
        X_under, y_under = self.pipeline.apply_imbalance_strategy(X, y, strategy="undersample")
        self.assertLessEqual(len(y_under), len(y))

        # Balanced weights / None
        X_same, y_same = self.pipeline.apply_imbalance_strategy(X, y, strategy="none")
        self.assertEqual(len(X_same), len(X))

    def test_pegasos_qsvc(self):
        from qiskit_machine_learning.kernels import FidelityQuantumKernel
        X_train = self.data["X_train_quantum"]
        y_train = self.data["y_train_quantum"]
        X_test = self.data["X_test_quantum"]

        feature_map = FraudQuantumFeatureMaps.get_zz_feature_map(feature_dimension=2, reps=1)
        qiskit_kernel = FidelityQuantumKernel(feature_map=feature_map)

        pegasos = PegasosQuantumClassifier(quantum_kernel=qiskit_kernel, C=10.0, num_steps=10)
        pegasos.fit(X_train, y_train)

        preds = pegasos.predict(X_test)
        self.assertEqual(len(preds), len(X_test))
        self.assertTrue(set(preds).issubset({0, 1}))

    def test_trainable_quantum_kernel(self):
        X_train = self.data["X_train_quantum"][:10]
        y_train = self.data["y_train_quantum"][:10]

        trainable = TrainableQuantumKernel(num_qubits=2, reps=1)
        res = trainable.train_parameters(X_train, y_train, max_iter=5, verbose=False)

        self.assertIn("initial_kta", res)
        self.assertIn("final_kta", res)
        self.assertEqual(len(trainable.optimal_theta), trainable.num_params)


if __name__ == "__main__":
    unittest.main()
