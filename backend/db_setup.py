"""
DualQ PostgreSQL Database Initialization Script
Connects to local PostgreSQL instance, provisions dualq_db,
creates tables for transactions and frozen_accounts, and seeds initial data.
"""

import sys
import os
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT_DIR not in sys.path:
    sys.path.insert(0, ROOT_DIR)

import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import json
import datetime

DB_CONFIG = {
    "host": "127.0.0.1",
    "port": 5432,
    "user": "postgres",
    "password": "Marunch@18",
    "dbname": "dualq_db"
}

def init_postgres():
    # 1. Connect to default 'postgres' database to ensure 'dualq_db' exists
    print("[1/4] Connecting to local PostgreSQL cluster...", flush=True)
    try:
        conn = psycopg2.connect(
            host=DB_CONFIG["host"],
            port=DB_CONFIG["port"],
            user=DB_CONFIG["user"],
            password=DB_CONFIG["password"],
            dbname="postgres",
            connect_timeout=4
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cur = conn.cursor()
        
        cur.execute("SELECT 1 FROM pg_database WHERE datname='dualq_db'")
        exists = cur.fetchone()
        if not exists:
            cur.execute("CREATE DATABASE dualq_db;")
            print("  -> Created database 'dualq_db' successfully!", flush=True)
        else:
            print("  -> Database 'dualq_db' already exists.", flush=True)
            
        cur.close()
        conn.close()
    except Exception as e:
        print(f"Error connecting to postgres root: {e}", flush=True)
        raise

    # 2. Connect to dualq_db and create schema tables
    print("[2/4] Connecting to 'dualq_db'...", flush=True)
    conn = psycopg2.connect(
        host=DB_CONFIG["host"],
        port=DB_CONFIG["port"],
        user=DB_CONFIG["user"],
        password=DB_CONFIG["password"],
        dbname="dualq_db",
        connect_timeout=4
    )
    cur = conn.cursor()

    print("[3/4] Creating tables: transactions and frozen_accounts...", flush=True)
    
    # Transactions table
    cur.execute("""
    CREATE TABLE IF NOT EXISTS transactions (
        id VARCHAR(64) PRIMARY KEY,
        timestamp TIMESTAMPTZ NOT NULL,
        date VARCHAR(32) NOT NULL,
        time VARCHAR(32) NOT NULL,
        amount NUMERIC(14, 2) NOT NULL,
        currency VARCHAR(8) DEFAULT 'INR',
        status VARCHAR(32) NOT NULL,
        risk_score NUMERIC(6, 4) NOT NULL,
        classical_score NUMERIC(6, 4),
        fidelity NUMERIC(6, 4),
        channel VARCHAR(128) NOT NULL,
        location VARCHAR(256),
        merchant VARCHAR(256),
        flag_reason TEXT,
        features JSONB,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );
    """)

    # Frozen Accounts table (RBI SAR)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS frozen_accounts (
        account_or_vpa VARCHAR(128) PRIMARY KEY,
        frozen_at TIMESTAMPTZ DEFAULT NOW(),
        reason TEXT,
        officer_badge VARCHAR(64),
        sar_ticket_id VARCHAR(64)
    );
    """)

    # Bank Officers table (Institutional login details & credentials)
    cur.execute("""
    CREATE TABLE IF NOT EXISTS bank_officers (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(128) NOT NULL,
        email VARCHAR(128) UNIQUE NOT NULL,
        password_hash VARCHAR(256) NOT NULL,
        pin_code VARCHAR(16) DEFAULT '849201',
        role VARCHAR(64) NOT NULL,
        role_label VARCHAR(128) NOT NULL,
        institution VARCHAR(128) NOT NULL,
        institution_type VARCHAR(128) NOT NULL,
        branch_code VARCHAR(64),
        badge_number VARCHAR(64) UNIQUE NOT NULL,
        avatar_initials VARCHAR(8) NOT NULL,
        permissions JSONB DEFAULT '[]',
        is_active BOOLEAN DEFAULT TRUE,
        last_login TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
    );
    """)

    conn.commit()

    # 3. Seed initial Indian payment records
    print("[4/4] Seeding initial banking ledger records...", flush=True)
    from backend.quantum_service import INITIAL_TRANSACTIONS

    for txn in INITIAL_TRANSACTIONS:
        features_json = json.dumps(txn["features"])
        cur.execute("""
        INSERT INTO transactions (
            id, timestamp, date, time, amount, currency, status,
            risk_score, channel, location, merchant, flag_reason, features
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) DO UPDATE SET
            status = EXCLUDED.status,
            risk_score = EXCLUDED.risk_score;
        """, (
            txn["id"],
            txn["timestamp"],
            txn["date"],
            txn["time"],
            txn["amount"],
            txn["currency"],
            txn["status"],
            txn["riskScore"],
            txn["details"]["channel"],
            txn["details"]["location"],
            txn["details"]["merchantCategory"],
            txn["details"].get("flagReason"),
            features_json
        ))

    # Seed demo frozen accounts
    demo_frozen = [
        ("fraudster99@paytm", "Midnight high-value drain SIM-swap", "HDFC-RISK-4409", "SAR-RBI-2026-4409"),
        ("drain.bot@ybl", "Rapid sub-threshold UPI smurfing", "NPCI-AUD-0108", "SAR-RBI-2026-0108")
    ]
    for vpa, reason, badge, ticket in demo_frozen:
        cur.execute("""
        INSERT INTO frozen_accounts (account_or_vpa, reason, officer_badge, sar_ticket_id)
        VALUES (%s, %s, %s, %s)
        ON CONFLICT (account_or_vpa) DO NOTHING;
        """, (vpa, reason, badge, ticket))

    # Seed authorized bank officers (Login details)
    bank_officers_seed = [
        (
            "USR-HDFC-01",
            "Rajesh K. Verma",
            "rajesh.verma@hdfcbank.com",
            "sha256:4409:f9c8d20e7a119e992b8c56",
            "849201",
            "bank_risk_officer",
            "Senior Fraud Risk Officer",
            "HDFC Bank Ltd",
            "Commercial Bank",
            "HDFC-MUM-04",
            "HDFC-RISK-4409",
            "RV",
            json.dumps([
                "Review & Override Suspicious Transactions",
                "Immediate UPI Account Hold & Release",
                "Trigger RBI Suspicious Activity Report (SAR)",
                "Evaluate Quantum Hilbert State Bounds"
            ])
        ),
        (
            "USR-NPCI-02",
            "Dr. Sunita Deshmukh",
            "sunita.deshmukh@npci.org.in",
            "sha256:0108:a2d8e4f10928b57102e3b1",
            "849201",
            "npci_auditor",
            "Principal Regulatory Auditor",
            "National Payments Corporation of India",
            "Central Regulatory Switch",
            "NPCI-HQ-BKC",
            "NPCI-AUD-0108",
            "SD",
            json.dumps([
                "National Inter-Bank Velocity Audit",
                "Cross-Institution Fraud Pattern Tracing",
                "RBI Master Direction Compliance Export",
                "Inspect Supervised QSVC Hyperplanes"
            ])
        ),
        (
            "USR-RELI-03",
            "Vikramaditya Singhania",
            "v.singhania@relianceretail.com",
            "sha256:9281:b4e10982df0912a88471c2",
            "849201",
            "merchant_admin",
            "Enterprise Loss Prevention Lead",
            "Reliance Retail & JioMart Enterprise",
            "Enterprise Retailer",
            "RELI-CORP-NAV",
            "REL-LP-9281",
            "VS",
            json.dumps([
                "Store POS & Soundbox Fraud Monitor",
                "Chargeback Prevention & Dispute Filing",
                "High-Value Order Handover Verification",
                "Merchant Settlement Risk Analytics"
            ])
        ),
        (
            "USR-AGY-04",
            "Ananya Iyer",
            "ananya.iyer@qpu.quantum.internal",
            "sha256:0042:c7e89120938b812a01948d",
            "849201",
            "qpu_engineer",
            "Quantum Infrastructure Engineer",
            "On-Premises Quantum Computing Operations",
            "Quantum Infrastructure",
            "QPU-NODE-PRIMARY",
            "AGY-QPU-0042",
            "AI",
            json.dumps([
                "Virtual QPU Pulse Calibration & Tuning",
                "M^-1 Readout Error Mitigation Controls",
                "Feature Map Variational Angle Optimizer (KTA)",
                "Barren Plateau Spectral Monitoring"
            ])
        )
    ]

    for off in bank_officers_seed:
        cur.execute("""
        INSERT INTO bank_officers (
            id, name, email, password_hash, pin_code, role, role_label,
            institution, institution_type, branch_code, badge_number,
            avatar_initials, permissions
        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            email = EXCLUDED.email,
            institution = EXCLUDED.institution,
            badge_number = EXCLUDED.badge_number,
            permissions = EXCLUDED.permissions;
        """, off)

    conn.commit()
    cur.close()
    conn.close()
    print("SUCCESS: PostgreSQL 'dualq_db' is fully provisioned and seeded with transactions, frozen accounts, and bank officers!", flush=True)

if __name__ == "__main__":
    init_postgres()
