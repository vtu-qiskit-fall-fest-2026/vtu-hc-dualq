"""
Quantum Fraud Detection - Data Pipeline
Handles loading real Kaggle credit card data or generating realistic synthetic transaction data,
preprocessing, dimensionality reduction for qubit mapping, and quantum angle scaling.
"""

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, MinMaxScaler
from sklearn.decomposition import PCA
from sklearn.feature_selection import SelectKBest, f_classif
from typing import Tuple, Dict, Any, Optional
import os


class FraudDataPipeline:
    """End-to-end data pipeline for Quantum Fraud Detection."""

    def __init__(self, random_state: int = 42):
        self.random_state = random_state
        self.scaler = StandardScaler()
        self.reducer = None
        self.angle_scaler = MinMaxScaler(feature_range=(-np.pi, np.pi))
        self.feature_names = []

    def generate_synthetic_data(
        self,
        n_samples: int = 5000,
        fraud_ratio: float = 0.02,
        seed: Optional[int] = None
    ) -> pd.DataFrame:
        """
        Generates realistic credit card transaction data matching Kaggle's schema:
        - Time: Elapsed seconds
        - Amount: Lognormal distribution
        - V1 to V28: Gaussian latent PCA features with nonlinear fraud correlations
        - Class: 0 (legitimate) or 1 (fraud)
        """
        rng = np.random.default_rng(seed if seed is not None else self.random_state)
        n_fraud = int(n_samples * fraud_ratio)
        n_legit = n_samples - n_fraud

        # 1. Time feature (seconds across 2 days: 0 to 172800)
        time_legit = rng.uniform(0, 172800, n_legit)
        # Fraud often clusters at unusual night hours (e.g. 1 AM to 5 AM)
        night_hours = rng.choice([3600 * 2, 3600 * 3, 3600 * 4], size=n_fraud)
        time_fraud = (night_hours + rng.normal(0, 1800, n_fraud)) % 172800

        # 2. Amount feature (₹ INR: Legit typical UPI/POS ₹50 - ₹5,000; Fraud: ₹1-₹10 penny drops or ₹25,000 - ₹3,50,000 drains)
        amount_legit = np.clip(rng.lognormal(mean=6.2, sigma=1.1, size=n_legit), 10.0, 50000.0)
        # Fraud distribution has a bimodal spike: UPI penny drop testing (₹1-₹10) and high-value IMPS/RTGS drains (₹25,000-₹3,50,000)
        amount_fraud = np.where(
            rng.random(n_fraud) > 0.35,
            np.clip(rng.lognormal(mean=10.8, sigma=0.8, size=n_fraud), 5000.0, 500000.0),
            rng.uniform(1.0, 10.0, size=n_fraud)
        )

        # 3. V1 - V28 Latent Features
        # For legitimate transactions, standard multivariate normal
        V_legit = rng.normal(0, 1.0, size=(n_legit, 28))

        # For fraud, inject non-linear cross-feature correlations into specific vectors (e.g. V4, V11, V12, V14, V17)
        V_fraud = rng.normal(0, 1.2, size=(n_fraud, 28))
        # V14 and V12 strongly negative in real Kaggle fraud
        V_fraud[:, 13] -= rng.uniform(2.5, 6.0, size=n_fraud)  # V14
        V_fraud[:, 11] -= rng.uniform(2.0, 5.0, size=n_fraud)  # V12
        # V4 and V11 strongly positive
        V_fraud[:, 3] += rng.uniform(2.0, 5.5, size=n_fraud)   # V4
        V_fraud[:, 10] += rng.uniform(2.0, 4.5, size=n_fraud)  # V11
        # Nonlinear interaction: V17 correlated with amount
        V_fraud[:, 16] = -0.5 * np.log1p(amount_fraud) + rng.normal(0, 0.5, size=n_fraud)

        # Assemble into DataFrame
        data_legit = np.column_stack([time_legit, V_legit, amount_legit, np.zeros(n_legit)])
        data_fraud = np.column_stack([time_fraud, V_fraud, amount_fraud, np.ones(n_fraud)])

        all_data = np.vstack([data_legit, data_fraud])
        columns = ["Time"] + [f"V{i}" for i in range(1, 29)] + ["Amount", "Class"]
        df = pd.DataFrame(all_data, columns=columns)

        # Shuffle
        df = df.sample(frac=1.0, random_state=self.random_state).reset_index(drop=True)
        df["Class"] = df["Class"].astype(int)
        return df

    def load_or_generate_dataset(
        self,
        filepath: Optional[str] = None,
        n_samples_fallback: int = 4000,
        fraud_ratio: float = 0.03
    ) -> pd.DataFrame:
        """Loads Kaggle CSV if present; otherwise generates synthetic transactions."""
        if filepath and os.path.exists(filepath):
            print(f"[DataPipeline] Loading real dataset from {filepath}...")
            df = pd.read_csv(filepath)
            print(f"[DataPipeline] Loaded {len(df)} records. Fraud count: {df['Class'].sum()}")
            return df

        print(f"[DataPipeline] No local file found at '{filepath}'.")
        print(f"[DataPipeline] Generating {n_samples_fallback} realistic synthetic transactions (fraud ratio: {fraud_ratio * 100:.1f}%)...")
        df = self.generate_synthetic_data(n_samples=n_samples_fallback, fraud_ratio=fraud_ratio)
        print(f"[DataPipeline] Synthetic dataset generated. Class distribution: \n{df['Class'].value_counts().to_dict()}")
        return df

    def prepare_quantum_data(
        self,
        df: pd.DataFrame,
        n_qubits: int = 4,
        reduction_method: str = "pca",
        test_size: float = 0.25,
        n_quantum_train: int = 200,
        n_quantum_test: int = 100,
        stratify: bool = True
    ) -> Dict[str, Any]:
        """
        Processes transaction data into quantum-compatible features:
        1. Train/Test split (stratified).
        2. Standardizes numerical values (StandardScaler).
        3. Reduces dimensions to `n_qubits` using PCA or SelectKBest.
        4. Scales reduced features to `[-pi, pi]` for quantum phase encoding.
        5. Extracts balanced/stratified quantum evaluation subsets for QSVC training.
        """
        X = df.drop(columns=["Class"]).values
        y = df["Class"].values.astype(int)

        # 1. Train / Test Split
        stratify_arg = y if stratify else None
        X_train_raw, X_test_raw, y_train_full, y_test_full = train_test_split(
            X, y, test_size=test_size, stratify=stratify_arg, random_state=self.random_state
        )

        # 2. Standardize
        X_train_scaled = self.scaler.fit_transform(X_train_raw)
        X_test_scaled = self.scaler.transform(X_test_raw)

        # 3. Dimensionality Reduction to Qubits
        if reduction_method.lower() == "pca":
            self.reducer = PCA(n_components=n_qubits, random_state=self.random_state)
            X_train_red = self.reducer.fit_transform(X_train_scaled)
            X_test_red = self.reducer.transform(X_test_scaled)
            variance_explained = float(np.sum(self.reducer.explained_variance_ratio_))
            print(f"[DataPipeline] PCA reduced to {n_qubits} components (Variance Explained: {variance_explained * 100:.2f}%)")
        elif reduction_method.lower() == "kbest":
            self.reducer = SelectKBest(score_func=f_classif, k=n_qubits)
            X_train_red = self.reducer.fit_transform(X_train_scaled, y_train_full)
            X_test_red = self.reducer.transform(X_test_scaled)
            print(f"[DataPipeline] SelectKBest selected top {n_qubits} most discriminative features for fraud.")
        else:
            raise ValueError(f"Unknown reduction_method: {reduction_method}")

        # 4. Quantum Angle Scaling to [-pi, pi]
        X_train_quantum = self.angle_scaler.fit_transform(X_train_red)
        X_test_quantum = self.angle_scaler.transform(X_test_red)

        # 5. Extract Stratified Subsets for Quantum Kernel Matrix Computation
        # Quantum kernel computation scales O(N^2), so we select an expressive balanced subset
        def get_balanced_subset(X_arr, y_arr, max_samples):
            if len(y_arr) <= max_samples:
                return X_arr, y_arr
            idx = np.arange(len(y_arr))
            sub_idx, _ = train_test_split(
                idx, train_size=max_samples, stratify=y_arr, random_state=self.random_state
            )
            return X_arr[sub_idx], y_arr[sub_idx]

        X_q_train, y_q_train = get_balanced_subset(X_train_quantum, y_train_full, n_quantum_train)
        X_q_test, y_q_test = get_balanced_subset(X_test_quantum, y_test_full, n_quantum_test)

        print(f"[DataPipeline] Quantum training set: {X_q_train.shape[0]} samples (Fraud: {np.sum(y_q_train)})")
        print(f"[DataPipeline] Quantum test set:     {X_q_test.shape[0]} samples (Fraud: {np.sum(y_q_test)})")

        return {
            "X_train_quantum": X_q_train,
            "y_train_quantum": y_q_train,
            "X_test_quantum": X_q_test,
            "y_test_quantum": y_q_test,
            "X_train_full": X_train_scaled,
            "y_train_full": y_train_full,
            "X_test_full": X_test_scaled,
            "y_test_full": y_test_full,
            "n_qubits": n_qubits,
            "reducer": self.reducer,
            "scaler": self.scaler,
            "angle_scaler": self.angle_scaler
        }

    def apply_imbalance_strategy(
        self,
        X_train: np.ndarray,
        y_train: np.ndarray,
        strategy: str = "smote"
    ) -> Tuple[np.ndarray, np.ndarray]:
        """
        Applies class imbalance mitigation to training data:
        - 'smote': Synthetic Minority Over-sampling Technique
        - 'undersample': Random under-sampling of majority class
        - 'none' or 'balanced_weights': Returns unchanged data
        """
        if strategy.lower() == "smote":
            from imblearn.over_sampling import SMOTE
            n_fraud = np.sum(y_train == 1)
            k_neighbors = min(3, max(1, n_fraud - 1))
            smote = SMOTE(k_neighbors=k_neighbors, random_state=self.random_state)
            X_res, y_res = smote.fit_resample(X_train, y_train)
            print(f"[DataPipeline] Applied SMOTE: Original={len(y_train)} -> Resampled={len(y_res)} (Fraud: {np.sum(y_res)})")
            return X_res, y_res
        elif strategy.lower() == "undersample":
            from imblearn.under_sampling import RandomUnderSampler
            rus = RandomUnderSampler(random_state=self.random_state)
            X_res, y_res = rus.fit_resample(X_train, y_train)
            print(f"[DataPipeline] Applied Undersampling: Original={len(y_train)} -> Resampled={len(y_res)} (Fraud: {np.sum(y_res)})")
            return X_res, y_res
        elif strategy.lower() in ["none", "balanced_weights"]:
            return X_train, y_train
        else:
            raise ValueError(f"Unknown imbalance strategy: {strategy}")
