"""
Unit and Integration Tests for Quantum Fraud Detection Backend
"""

import unittest
import numpy as np
from src.data_pipeline import FraudDataPipeline
from src.feature_maps import FraudQuantumFeatureMaps
from src.quantum_kernels import QuantumKernelEngine
from src.models import QuantumFraudClassifier, QuantumOneClassDetector, ClassicalFraudBaselines
from src.evaluation import FraudEvaluator


class TestQuantumFraudBackend(unittest.TestCase):

    def setUp(self):
        self.pipeline = FraudDataPipeline(random_state=42)
        self.df = self.pipeline.generate_synthetic_data(n_samples=200, fraud_ratio=0.1)
        self.data = self.pipeline.prepare_quantum_data(
            self.df,
            n_qubits=4,
            reduction_method="pca",
            n_quantum_train=40,
            n_quantum_test=20
        )

    def test_data_pipeline_shapes(self):
        self.assertEqual(self.data["X_train_quantum"].shape, (40, 4))
        self.assertEqual(self.data["X_test_quantum"].shape, (20, 4))
        # Check angle range within [-pi, pi]
        self.assertTrue(np.all(self.data["X_train_quantum"] >= -np.pi - 1e-5))
        self.assertTrue(np.all(self.data["X_train_quantum"] <= np.pi + 1e-5))

    def test_feature_maps(self):
        zz = FraudQuantumFeatureMaps.get_zz_feature_map(feature_dimension=4, reps=1)
        self.assertEqual(zz.num_qubits, 4)
        pauli = FraudQuantumFeatureMaps.get_pauli_feature_map(feature_dimension=4, reps=1)
        self.assertEqual(pauli.num_qubits, 4)
        reup = FraudQuantumFeatureMaps.get_data_reuploading_map(feature_dimension=4, reps=1)
        self.assertEqual(reup.num_qubits, 4)

    def test_fidelity_kernel(self):
        zz = FraudQuantumFeatureMaps.get_zz_feature_map(feature_dimension=4, reps=1)
        engine = QuantumKernelEngine(feature_map=zz)
        X = self.data["X_train_quantum"][:10]
        K = engine.compute_fidelity_matrix(X)
        self.assertEqual(K.shape, (10, 10))
        # Diagonal elements must be 1.0 (self-overlap)
        np.testing.assert_allclose(np.diag(K), 1.0, atol=1e-5)
        # Symmetry
        np.testing.assert_allclose(K, K.T, atol=1e-5)

    def test_projected_kernel(self):
        zz = FraudQuantumFeatureMaps.get_zz_feature_map(feature_dimension=4, reps=1)
        engine = QuantumKernelEngine(feature_map=zz)
        X = self.data["X_train_quantum"][:10]
        K = engine.compute_projected_kernel_matrix(X)
        self.assertEqual(K.shape, (10, 10))
        np.testing.assert_allclose(np.diag(K), 1.0, atol=1e-5)
        np.testing.assert_allclose(K, K.T, atol=1e-5)

    def test_qsvc_training(self):
        zz = FraudQuantumFeatureMaps.get_zz_feature_map(feature_dimension=4, reps=1)
        engine = QuantumKernelEngine(feature_map=zz)
        X_train = self.data["X_train_quantum"]
        y_train = self.data["y_train_quantum"]
        X_test = self.data["X_test_quantum"]

        K_train = engine.compute_fidelity_matrix(X_train)
        K_test = engine.compute_fidelity_matrix(X_test, X_train)

        qsvc = QuantumFraudClassifier(C=1.0)
        qsvc.fit(X_train, y_train, precomputed_K=K_train)
        preds = qsvc.predict(X_test, precomputed_K=K_test)
        self.assertEqual(len(preds), len(X_test))
        self.assertTrue(set(preds).issubset({0, 1}))

    def test_virtual_qpu_and_runtime(self):
        from src.virtual_qpu import VirtualQPU, QuantumRuntimeEngine, PhysicalNoiseModel
        noise = PhysicalNoiseModel(readout_error=0.02, enable_noise=True)
        vqpu = VirtualQPU(name="test-vQPU", num_qubits=4, noise_model=noise)
        runtime = QuantumRuntimeEngine(backend=vqpu)
        
        # Test health check
        health = runtime.get_system_health()
        self.assertEqual(health["qubits_online"], 4)
        self.assertTrue(health["cloud_independence"])

        # Test job submission
        statevector = np.array([1.0] + [0.0] * 15, dtype=complex)  # |0000>
        job = runtime.submit_job(statevector, shots=500)
        self.assertEqual(job.status.value, "COMPLETED")
        self.assertIn("0000", job.counts)
        self.assertGreater(job.counts["0000"], 400)


if __name__ == "__main__":
    unittest.main()
