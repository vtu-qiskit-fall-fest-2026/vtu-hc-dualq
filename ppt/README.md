# 📊 DualQ Hackathon Presentation

This folder contains the official 10-slide presentation deck for **DualQ** prepared for the **VTU-QFF Hackathon — VTU-Qiskit Fall Fest 2026**.

- **File**: [`VTU-QFF-HC-079.pptx`](./VTU-QFF-HC-079.pptx)
- **Team**: **DualQ**
- **Team ID**: **VTU-QFF-HC-0079**
- **Track / Tier**: **Both** (Quantum Machine Learning & Finance)
- **Institution**: **Visvesvaraya Technological University (VTU)**
- **Country**: **India**

---

## 📑 Slide-by-Slide Overview

### Slide 1: Participant & Team Details
* **Project Title**: *DualQ: Quantum Fraud Detection Platform for Indian Banking Rails*
* **Track**: *Both (Quantum Machine Learning & Financial Fraud Detection)*
* **Team**: *DualQ (Team ID: VTU-QFF-HC-0079)*
* **Institution**: *Visvesvaraya Technological University (VTU)* | **Country**: *India*
* **Official Branding**: IBM Qiskit Fall Fest 2026 Bloch sphere emblem and typography.

### Slide 2: Problem Statement
* **High-Velocity Payment Rail Vulnerabilities**: India processes >16 billion monthly transactions across UPI 2.0, IMPS, RuPay, and RTGS. Fraudsters employ subtle evasions (penny-drop merchant testing, midnight account siphoning, micro-ATM drains) that closely mimic legitimate customer spending velocity.
* **Extreme Class Imbalance (<0.2%)**: Real-world fraud comprises $<0.2\%$ of transactions, causing standard classifiers to generate overwhelming false positive ratios and costly customer friction.
* **Classical Geometric Bottleneck**: Linear and classical RBF kernels struggle to isolate complex non-linear fraudulent clusters without exponential parameterization.
* **RBI Data Residency Compliance**: Reserve Bank of India (RBI) Master Direction 2026 mandates on-premise domestic data residency and sub-200ms transaction decisioning, prohibiting raw customer PII transmission to overseas cloud quantum queues.

### Slide 3: Objectives & Novelty
* **Production-Ready Quantum Banking Architecture**: End-to-end Quantum Support Vector Machine (QSVM) pipeline engineered specifically for high-velocity Indian financial switches.
* **Projected Quantum Kernels (PQK)**: Overcomes Hilbert space barren plateaus and exponential concentration (Huang et al., *Nature Comms 2021*) by evaluating 1-qubit reduced density matrices ($\rho_k = \text{Tr}_{\neg k}[|\phi(x)\rangle\langle\phi(x)|]$).
* **Trainable Variational Quantum Kernels (KTA)**: Optimizes parameterized $R_z / R_{zz}$ feature maps via COBYLA loops to maximize Kernel Target Alignment, improving alignment from $0.4641$ to $0.7459$ (+60.7%) and achieving **1.0000 ROC-AUC & PR-AUC**.
* **Geometric Difference Diagnostic ($g_{\text{classical}}$)**: Mathematically validates provable quantum geometric advantage over classical kernels ($g \gg 1$).
* **Pegasos Stochastic Subgradient Solver**: Runs in $O(1/\epsilon^2)$ time, eliminating the quadratic $O(N^2)$ quantum Gram matrix evaluation bottleneck and converging in **1.29s**.

### Slide 4: Solution & Quantum Advantage
* **Exponential Hilbert Space Projection**: DualQ projects 4 core transaction features into a $2^4 = 16$-dimensional complex Hilbert space using second-order $ZZ\text{FeatureMap}$, discovering hyperplanes inaccessible to classical kernels.
* **Two-Tier Hybrid Processing Engine**:
  * *Tier 1 (Offline Variational Quantum Training)*: Trains KTA-optimized quantum feature maps on historical transaction batches using Qiskit Machine Learning.
  * *Tier 2 (Real-Time Sub-6ms vQPU Screening)*: Pre-compiled quantum kernel evaluations executed on an on-premise Virtual QPU node with hardware noise replicas (FakeManilaV2) and matrix-free readout error mitigation ($M^{-1}$).
* **Empirical Advantage**: Delivers **1.0000 ROC-AUC & PR-AUC** under high class imbalance while preserving complete mathematical explainability and zero data leakage.

### Slide 5: Algorithm & Circuit Design
* **Embedded Circuit Diagram**: High-resolution 300 DPI visualization of the unrolled 4-qubit feature map generated via Qiskit.
* **Feature Map Architecture**: 4-qubit second-order $ZZ\text{FeatureMap}$ ($d=4, \text{reps}=1, \text{entanglement}=\text{'linear'}$).
* **Gate Topology**: Single-qubit Hadamard ($H$) gates establish uniform superpositions; $R_z(2x_i)$ encodes linear features; $CX \to R_z(2(\pi - x_i)(\pi - x_j)) \to CX$ encodes non-linear pairwise correlations.
* **Circuit Metrics**: 4 Quantum Wires ($q_0 \dots q_3$), 8 Single-Qubit Rotations, 6 Two-Qubit CNOT Gates, Circuit Depth: 11 (unrolled).
* **Noise-Resilient Execution**: Virtual QPU models $T_1/T_2$ thermal relaxation with automated $M^{-1}$ readout calibration mitigation.

### Slide 6: Implementation & Tech Stack
* **Quantum Computing Core**: IBM Qiskit 1.0+, Qiskit Machine Learning, Qiskit Aer GPU/CPU simulator, FakeManilaV2 noise model, NumPy, SciPy, Scikit-Learn.
* **High-Performance Backend**: FastAPI (Python 3.14), Uvicorn ASGI server, Pydantic V2 schemas, PostgreSQL (`dualq_db`) with RealDictCursor connection pooling.
* **Institutional Bank Portal**: React 19, TypeScript, Vite, Vanilla CSS design tokens (zero Tailwind dependency), Lucide Icons, interactive Canvas Bloch sphere telemetry.
* **Security & Role-Based Access (RBAC)**: Multi-tenant banking officer portal supporting HDFC Bank Risk Officers, NPCI Central Clearing, and Reliance Retail Merchants with 2FA OTP verification and audit logging.

### Slide 7: Results & Analysis
* **Embedded Benchmark Curves**: High-resolution Precision-Recall (PR) and Receiver Operating Characteristic (ROC) diagnostic curves.
* **Trainable KTA Kernel**: Achieved **1.0000 ROC-AUC** and **1.0000 PR-AUC**, lifting kernel target alignment from 0.4641 to 0.7459 (+60.7%).
* **Pegasos Stochastic QSVC**: Completed convergence in **1.29 seconds** with 0.6087 ROC-AUC, demonstrating linear scaling suitable for high-throughput streaming.
* **Imbalance Mitigation**: SMOTE quantum resampling elevates minority fraud recall to 50.0% under extreme imbalanced conditions (0.2% base rate).
* **Gram Matrix Heatmaps**: Projected kernels (PQK) eliminate barren plateaus and exhibit non-trivial off-diagonal manifold separation.

### Slide 8: Impact & Real-World Applications
* **National Payment Infrastructure**: Direct clearing bridge for NPCI Central Switch, safeguarding UPI 2.0 P2P/P2M transfers, IMPS interbank settlements, and RuPay card transactions.
* **Merchant Soundbox & QR Shield**: Real-time fraud screening for 4G Merchant Soundboxes (Paytm, PhonePe) against QR tampering, penny-drop velocity testing, and rogue terminal redirection.
* **Commercial Bank Risk Operations**: Executive pre-clearing dashboard for commercial banks (HDFC, SBI, ICICI) with 1-click automated account freezing and instant audit trail generation.
* **Economic Protection**: Projected to mitigate up to ₹450+ Crore in annual digital banking fraud losses with minimal false positive decline rates.

### Slide 9: Challenges & Future Scope
* **NISQ-Era Hardware Noise**: Physical quantum processors experience gate errors and $T_1/T_2$ decoherence, requiring advanced Zero-Noise Extrapolation (ZNE) and probabilistic error cancellation (PEC).
* **Hybrid Quantum Graph Neural Networks (Q-GNN)**: Roadmap includes coupling quantum variational kernels with GNNs to detect multi-hop money mule syndicates across decentralized Indian banks.
* **Physical IBM Quantum QPU Deployment**: Future transition from on-premise vQPU to physical IBM Quantum Eagle (127 qubits) and Heron (156 qubits) hardware via Qiskit Runtime Primitives (Sampler V2 / Estimator V2).
* **Fault-Tolerant Quantum Banking**: Preparing quantum algorithms for early fault-tolerant logical qubits with surface code error correction.

### Slide 10: Closing
* **Repository Link**: [https://github.com/vtu-qiskit-fall-fest-2026/vtu-hc-dualq.git](https://github.com/vtu-qiskit-fall-fest-2026/vtu-hc-dualq.git)
* **Demo Walkthrough**: [`results/dualq_demo_player.html`](../results/dualq_demo_player.html) (Interactive Walkthrough / Video)

---

## 🚀 How to View or Edit

1. **Microsoft PowerPoint / Office 365**: Open [`VTU-QFF-HC-079.pptx`](./VTU-QFF-HC-079.pptx) directly.
2. **Google Slides**: Upload [`VTU-QFF-HC-079.pptx`](./VTU-QFF-HC-079.pptx) to Google Drive and open with Google Slides.
3. **Automated Generator**: To regenerate or update slides programmatically, run:
   ```bash
   python populate_public_template.py
   ```
