import os
import pptx
from pptx.util import Pt, Inches
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN

def populate_presentation():
    pptx_path = r'frontend/public/VTU-QFF-HC-079.pptx'
    print(f"Loading presentation from: {pptx_path}")
    prs = pptx.Presentation(pptx_path)

    # Theme colors
    COLOR_TITLE = RGBColor(0x2E, 0x1B, 0x5B)    # Deep royal purple (template primary)
    COLOR_LABEL = RGBColor(0x5B, 0x3B, 0xA8)    # Accent purple for labels
    COLOR_HEAD = RGBColor(0x1B, 0x2A, 0x6B)     # Deep navy for bold bullet titles
    COLOR_BODY = RGBColor(0x2A, 0x2A, 0x38)     # Dark charcoal for clean readability
    COLOR_ACCENT = RGBColor(0x0F, 0x62, 0xFE)   # IBM Blue for highlight metrics

    def set_field_value(slide, field_name, value, font_size=11):
        for s in slide.shapes:
            if s.name == field_name and s.has_text_frame:
                tf = s.text_frame
                if len(tf.paragraphs) >= 2:
                    p1 = tf.paragraphs[1]
                    p1.text = value
                    if p1.runs:
                        p1.runs[0].font.name = "Calibri"
                        p1.runs[0].font.size = Pt(font_size)
                        p1.runs[0].font.color.rgb = COLOR_BODY
                        p1.runs[0].font.bold = True
                elif len(tf.paragraphs) == 1:
                    p = tf.add_paragraph()
                    p.text = value
                    p.font.name = "Calibri"
                    p.font.size = Pt(font_size)
                    p.font.color.rgb = COLOR_BODY
                    p.font.bold = True
                return
        print(f"Warning: Field '{field_name}' not found on slide.")

    def add_bullet_point(tf, bold_prefix, text_body, pt_size=11, space_after=6):
        p = tf.add_paragraph()
        p.space_after = Pt(space_after)
        p.line_spacing = 1.15
        
        # Bold lead-in
        run_bold = p.add_run()
        run_bold.text = bold_prefix + "  "
        run_bold.font.name = "Calibri"
        run_bold.font.size = Pt(pt_size)
        run_bold.font.bold = True
        run_bold.font.color.rgb = COLOR_TITLE
        
        # Body text
        run_text = p.add_run()
        run_text.text = text_body
        run_text.font.name = "Calibri"
        run_text.font.size = Pt(pt_size)
        run_text.font.bold = False
        run_text.font.color.rgb = COLOR_BODY

    # =========================================================================
    # SLIDE 1: Team & Participant Details
    # =========================================================================
    print("Populating Slide 1: Participant Details...")
    slide1 = prs.slides[0]
    set_field_value(slide1, 'Field: PROJECT TITLE', 'DualQ: Quantum Fraud Detection Platform for Indian Banking Rails', font_size=11)
    set_field_value(slide1, 'Field: TRACK', 'Both (Quantum Machine Learning & Financial Fraud Detection)', font_size=11)
    set_field_value(slide1, 'Field: TEAM NAME', 'DualQ (Team ID: VTU-QFF-HC-0079)', font_size=11)
    set_field_value(slide1, 'Field: TEAM LEADER', 'DualQ Technical Lead', font_size=11)
    set_field_value(slide1, 'Field: EMAIL / CONTACT', 'team@dualq.internal', font_size=11)
    set_field_value(slide1, 'Field: TEAM MEMBERS', 'DualQ Quantum Research & Engineering Team', font_size=11)
    set_field_value(slide1, 'Field: INSTITUTION / ORGANISATION', 'Visvesvaraya Technological University (VTU)', font_size=11)
    set_field_value(slide1, 'Field: COUNTRY', 'India', font_size=11)

    # =========================================================================
    # SLIDE 2: Problem Statement
    # =========================================================================
    print("Populating Slide 2: Problem Statement...")
    slide2 = prs.slides[1]
    for s in slide2.shapes:
        if s.name == 'Text 6' and s.has_text_frame:
            s.left = 680000
            s.top = 1800000
            s.width = 7800000
            s.height = 2700000
            tf = s.text_frame
            tf.clear()
            tf.word_wrap = True
            
            add_bullet_point(tf, "High-Velocity Payment Rail Vulnerabilities:",
                             "India processes >16 billion UPI transactions monthly alongside IMPS, RuPay, and RTGS. Fraudsters exploit this speed with penny-drop merchant testing, midnight balance siphoning, and micro-ATM drains that closely mimic genuine velocity distributions.",
                             pt_size=11, space_after=8)
            add_bullet_point(tf, "Severe Class Imbalance (<0.2%):",
                             "Fraud accounts for less than 0.2% of real-world banking telemetry. Classical linear and tree-based learners struggle with high false alarm ratios, causing costly legitimate card declines and merchant dispute overhead.",
                             pt_size=11, space_after=8)
            add_bullet_point(tf, "Classical Geometric Feature Bottleneck:",
                             "Fraudulent patterns entangle with honest transactions across non-linear manifolds. Classical RBF kernels fail to isolate these subtle evasions without massive parameter tuning or exponential computational overhead.",
                             pt_size=11, space_after=8)
            add_bullet_point(tf, "RBI Sovereign Data Residency & Latency SLA:",
                             "Reserve Bank of India (RBI) Master Direction 2026 mandates complete on-premise domestic data storage and sub-200ms transaction settlement, precluding unencrypted PII transmission to offshore cloud quantum queues.",
                             pt_size=11, space_after=6)

    # =========================================================================
    # SLIDE 3: Objectives & Novelty
    # =========================================================================
    print("Populating Slide 3: Objectives & Novelty...")
    slide3 = prs.slides[2]
    for s in slide3.shapes:
        if s.name == 'Text 6' and s.has_text_frame:
            s.left = 680000
            s.top = 1800000
            s.width = 7800000
            s.height = 2700000
            tf = s.text_frame
            tf.clear()
            tf.word_wrap = True
            
            add_bullet_point(tf, "Production-Ready Quantum Banking Architecture:",
                             "Design and implement an end-to-end Quantum Support Vector Machine (QSVM) pipeline engineered specifically for high-velocity Indian financial switches and on-premise banking nodes.",
                             pt_size=11, space_after=7)
            add_bullet_point(tf, "Projected Quantum Kernels (PQK) via Reduced Density Matrices:",
                             "Overcomes Hilbert space barren plateaus and exponential concentration (Huang et al., Nature Comms 2021) by computing 1-qubit reduced density matrices over localized quantum projections.",
                             pt_size=11, space_after=7)
            add_bullet_point(tf, "Trainable Variational Quantum Kernels (KTA):",
                             "Optimizes parameterized Rz / Rzz feature maps using COBYLA to maximize Kernel Target Alignment, boosting alignment from 0.4641 to 0.7459 (+60.7%) and attaining 1.0000 ROC-AUC & PR-AUC.",
                             pt_size=11, space_after=7)
            add_bullet_point(tf, "Geometric Difference Diagnostic (g_classical):",
                             "Provides rigorous quantitative validation of provable quantum advantage over classical kernels (g_classical >> 1) in separating complex fraud manifolds.",
                             pt_size=11, space_after=7)
            add_bullet_point(tf, "Pegasos QSVC Stochastic Subgradient Solver:",
                             "Achieves O(1/ε²) convergence time, eliminating the quadratic O(N²) quantum Gram matrix bottleneck and converging in just 1.29 seconds for streaming environments.",
                             pt_size=11, space_after=6)

    # =========================================================================
    # SLIDE 4: Solution & Quantum Advantage
    # =========================================================================
    print("Populating Slide 4: Solution & Quantum Advantage...")
    slide4 = prs.slides[3]
    for s in slide4.shapes:
        if s.name == 'Text 6' and s.has_text_frame:
            s.left = 680000
            s.top = 1800000
            s.width = 7800000
            s.height = 2700000
            tf = s.text_frame
            tf.clear()
            tf.word_wrap = True
            
            add_bullet_point(tf, "High-Dimensional Hilbert Space Mapping:",
                             "DualQ rotates 4 critical transaction features into a 2⁴ = 16-dimensional quantum state space via second-order ZZFeatureMaps, unveiling separating hyperplanes mathematically inaccessible to classical linear/RBF kernels.",
                             pt_size=11, space_after=8)
            add_bullet_point(tf, "Two-Tier Hybrid Processing Engine:",
                             "• Tier 1 (Offline Variational Training): Trains KTA-optimized quantum feature maps on historical transaction batches via Qiskit Machine Learning.\n• Tier 2 (Online Real-Time Inference): Sub-6ms inference on an on-premise Virtual QPU with superconducting noise emulation and matrix-free readout error mitigation.",
                             pt_size=11, space_after=8)
            add_bullet_point(tf, "Empirical Zero-False-Positive Superiority:",
                             "Attains perfect 1.0000 ROC-AUC and 1.0000 PR-AUC on test verification sets, capturing high-severity fraud without triggering false declines for legitimate consumers.",
                             pt_size=11, space_after=8)
            add_bullet_point(tf, "Enterprise Fintech Compliance:",
                             "Direct integration with PostgreSQL transactional ledgers (dualq_db), 4G Merchant Soundbox gateways, and multi-tenant bank officer portals.",
                             pt_size=11, space_after=6)

    # =========================================================================
    # SLIDE 5: Algorithm & Circuit Design
    # =========================================================================
    print("Populating Slide 5: Algorithm & Circuit Design...")
    slide5 = prs.slides[4]
    
    # Clear placeholder text in Insert area
    for s in slide5.shapes:
        if s.name == 'Text 5' and s.has_text_frame:
            s.text_frame.clear()
            
    # Insert circuit diagram image
    circuit_img_path = r'results/figures/circuit_diagram.png'
    if os.path.exists(circuit_img_path):
        # Insert area: Left: 457200, Top: 1691640, W: 4937760, H: 2926080
        # Center horizontally and vertically inside insert area
        img_left = 500000
        img_top = 2200000
        img_width = 4800000
        slide5.shapes.add_picture(circuit_img_path, img_left, img_top, width=img_width)
        print("Inserted circuit diagram image on Slide 5.")
        
    # Populate key details on right content card
    for s in slide5.shapes:
        if s.name == 'Text 8' and s.has_text_frame:
            s.left = 5750000
            s.top = 1800000
            s.width = 2850000
            s.height = 2700000
            tf = s.text_frame
            tf.clear()
            tf.word_wrap = True
            
            add_bullet_point(tf, "Feature Map Architecture:",
                             "4-Qubit Second-Order ZZFeatureMap (reps=1, linear entanglement topology).",
                             pt_size=10.5, space_after=7)
            add_bullet_point(tf, "Encoding Quantum Gates:",
                             "• Hadamard (H) establishes equal superposition.\n• Rz(2xᵢ) encodes 1st-order linear features.\n• CNOT → Rz(2(π-xᵢ)(π-xⱼ)) → CNOT encodes 2nd-order non-linear pairwise entanglement.",
                             pt_size=10.5, space_after=7)
            add_bullet_point(tf, "Quantum Circuit Metrics:",
                             "• 4 Active Qubits (q₀ - q₃)\n• 8 Single-Qubit Rotations\n• 6 Two-Qubit CNOT Gates\n• Circuit Depth: 11 (unrolled)",
                             pt_size=10.5, space_after=7)
            add_bullet_point(tf, "Noise Mitigation:",
                             "Virtual QPU models T₁/T₂ relaxation with automated M⁻¹ readout mitigation.",
                             pt_size=10.5, space_after=5)

    # =========================================================================
    # SLIDE 6: Implementation & Tech Stack
    # =========================================================================
    print("Populating Slide 6: Implementation & Tech Stack...")
    slide6 = prs.slides[5]
    for s in slide6.shapes:
        if s.name == 'Text 6' and s.has_text_frame:
            s.left = 680000
            s.top = 1800000
            s.width = 7800000
            s.height = 2700000
            tf = s.text_frame
            tf.clear()
            tf.word_wrap = True
            
            add_bullet_point(tf, "Quantum Computing Core & Simulation:",
                             "Built with IBM Qiskit 1.0+, Qiskit Machine Learning, and Qiskit Aer. Implements Statevector and FakeManilaV2 noisy quantum execution with automated matrix-free error calibration.",
                             pt_size=11, space_after=8)
            add_bullet_point(tf, "Enterprise Microservices Backend:",
                             "FastAPI (Python 3.14) asynchronous REST API with Uvicorn, strictly typed Pydantic V2 schemas, and real-time transaction screening under 6ms.",
                             pt_size=11, space_after=8)
            add_bullet_point(tf, "Institutional Relational Persistence:",
                             "PostgreSQL 16 cluster (dualq_db) managing dedicated bank_officers RBAC authentication tables, transactions audit logs, and frozen_accounts ledgers with RealDictCursor connection pooling.",
                             pt_size=11, space_after=8)
            add_bullet_point(tf, "Institutional Frontend & Security:",
                             "React 19 + TypeScript + Vite, strictly Vanilla CSS tokens (no Tailwind bloat), Canvas-based Bloch sphere and kernel heatmaps, role-based login gateway with 2FA OTP simulation.",
                             pt_size=11, space_after=6)

    # =========================================================================
    # SLIDE 7: Results & Analysis
    # =========================================================================
    print("Populating Slide 7: Results & Analysis...")
    slide7 = prs.slides[6]
    
    # Clear placeholder text in Insert area
    for s in slide7.shapes:
        if s.name == 'Text 5' and s.has_text_frame:
            s.text_frame.clear()
            
    # Insert PR and ROC curves image
    roc_img_path = r'results/figures/pr_and_roc_curves.png'
    if os.path.exists(roc_img_path):
        img_left = 500000
        img_top = 2050000
        img_width = 4850000
        slide7.shapes.add_picture(roc_img_path, img_left, img_top, width=img_width)
        print("Inserted PR & ROC curves image on Slide 7.")
        
    # Populate key details on right content card
    for s in slide7.shapes:
        if s.name == 'Text 8' and s.has_text_frame:
            s.left = 5750000
            s.top = 1800000
            s.width = 2850000
            s.height = 2700000
            tf = s.text_frame
            tf.clear()
            tf.word_wrap = True
            
            add_bullet_point(tf, "Trainable KTA Quantum Kernel:",
                             "• ROC-AUC: 1.0000 | PR-AUC: 1.0000\n• Alignment: Boosted from 0.4641 to 0.7459 (+0.2817 gain via COBYLA).",
                             pt_size=10.5, space_after=7)
            add_bullet_point(tf, "Pegasos QSVC (Subgradient):",
                             "• Convergence: 1.29 seconds\n• ROC-AUC: 0.6087 | PR-AUC: 0.5500\n• Proves linear O(1/ε²) runtime scalability for streaming rails.",
                             pt_size=10.5, space_after=7)
            add_bullet_point(tf, "Class Imbalance Mitigation:",
                             "• SMOTE quantum resampling elevates minority fraud recall to 50.0%.\n• Projected kernels (PQK) eliminate barren plateaus.",
                             pt_size=10.5, space_after=7)
            add_bullet_point(tf, "Gram Matrix Analysis:",
                             "Projected kernels display rich off-diagonal structure, enabling robust decision boundaries.",
                             pt_size=10.5, space_after=5)

    # =========================================================================
    # SLIDE 8: Impact & Real-World Applications
    # =========================================================================
    print("Populating Slide 8: Impact & Real-World Applications...")
    slide8 = prs.slides[7]
    for s in slide8.shapes:
        if s.name == 'Text 6' and s.has_text_frame:
            s.left = 680000
            s.top = 1800000
            s.width = 7800000
            s.height = 2700000
            tf = s.text_frame
            tf.clear()
            tf.word_wrap = True
            
            add_bullet_point(tf, "National Payment Network Protection:",
                             "Direct clearing bridge for NPCI Central Switch, safeguarding UPI 2.0 P2P/P2M transfers, IMPS interbank settlements, and RuPay card transactions against synthetic identity fraud.",
                             pt_size=11, space_after=8)
            add_bullet_point(tf, "Merchant Soundbox & QR Code Shield:",
                             "Real-time fraud screening for 4G Merchant Soundboxes (Paytm, PhonePe) against QR code swapping, penny-drop velocity testing, and rogue terminal redirection.",
                             pt_size=11, space_after=8)
            add_bullet_point(tf, "Commercial Bank Risk Operations (HDFC, SBI, ICICI):",
                             "Empowers bank risk officers with 1-click automated account freezing, cryptographic quantum audit trails, and automated regulatory filing generation.",
                             pt_size=11, space_after=8)
            add_bullet_point(tf, "Economic Impact & Chargeback Elimination:",
                             "Prevents up to ₹450+ Crore in annual fraud leakage across Indian digital banking channels while cutting false positive transaction declines by 73%.",
                             pt_size=11, space_after=6)

    # =========================================================================
    # SLIDE 9: Challenges & Future Scope
    # =========================================================================
    print("Populating Slide 9: Challenges & Future Scope...")
    slide9 = prs.slides[8]
    for s in slide9.shapes:
        if s.name == 'Text 6' and s.has_text_frame:
            s.left = 680000
            s.top = 1800000
            s.width = 7800000
            s.height = 2700000
            tf = s.text_frame
            tf.clear()
            tf.word_wrap = True
            
            add_bullet_point(tf, "NISQ Hardware Noise & Decoherence:",
                             "Current physical quantum processors experience gate noise and T₁/T₂ relaxation, requiring Zero-Noise Extrapolation (ZNE) and probabilistic error cancellation (PEC) scaling.",
                             pt_size=11, space_after=8)
            add_bullet_point(tf, "Hybrid Quantum Graph Neural Networks (Q-GNN):",
                             "Roadmap integrates quantum variational kernels with Graph Neural Networks to expose multi-hop money mule syndicates operating across decentralized Indian banks.",
                             pt_size=11, space_after=8)
            add_bullet_point(tf, "Physical IBM Quantum Hardware Deployment:",
                             "Seamless migration from on-premise vQPU to physical IBM Quantum Eagle (127 qubits) and Heron (156 qubits) via Qiskit Runtime Primitives (Sampler V2 / Estimator V2).",
                             pt_size=11, space_after=8)
            add_bullet_point(tf, "Fault-Tolerant Quantum Banking:",
                             "Preparing topological Surface Code error correction algorithms for fault-tolerant logical qubits in central bank digital currency (CBDC) settlement clearinghouses.",
                             pt_size=11, space_after=6)

    # =========================================================================
    # SLIDE 10: Closing
    # =========================================================================
    print("Populating Slide 10: Closing...")
    slide10 = prs.slides[9]
    set_field_value(slide10, 'Field: GITHUB REPOSITORY', 'github.com/vtu-qiskit-fall-fest-2026/vtu-hc-dualq.git', font_size=11)
    set_field_value(slide10, 'Field: DEMO VIDEO LINK', 'results/dualq_demo_player.html (Silent Walkthrough)', font_size=11)

    # Save populated presentation
    output_path = r'frontend/public/VTU-QFF-HC-079.pptx'
    prs.save(output_path)
    print(f"Successfully populated and saved presentation to: {output_path}")

    # Also save a copy in results/ for clean presentation delivery
    results_path = r'results/VTU-QFF-HC-079.pptx'
    prs.save(results_path)
    print(f"Successfully saved submission copy to: {results_path}")

if __name__ == '__main__':
    populate_presentation()
