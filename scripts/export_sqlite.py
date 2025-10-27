#!/usr/bin/env python3
"""
Export tables from prisma/dev-reset.db into JSON files under scripts/data/
Run: python scripts/export_sqlite.py
"""
import sqlite3
import json
import os
from pathlib import Path

BASE = Path(__file__).resolve().parent
DB = BASE.parent / 'prisma' / 'dev-reset.db'
OUT = BASE / 'data'

tables = [
    'users',
    'accounts',
    'Account',
    'sessions',
    'Session',
    'password_reset_tokens',
    'PasswordResetToken',
    'VerificationToken',
    'verification_tokens',
    'products',
    'warehouses',
    'inventory',
    'suppliers',
    'orders',
    'order_items',
    'order_items',
    'stock_movements',
    'audit_logs'
]

OUT.mkdir(parents=True, exist_ok=True)

def dump_table(conn, name):
    cur = conn.cursor()
    try:
        cur.execute(f"SELECT * FROM {name}")
    except Exception as e:
        print(f"Skipping {name}: {e}")
        return
    cols = [d[0] for d in cur.description]
    rows = [dict(zip(cols, row)) for row in cur.fetchall()]
    if not rows:
        print(f"{name}: 0 rows")
        return
    out_file = OUT / f"{name}.json"
    with open(out_file, 'w', encoding='utf-8') as f:
        json.dump(rows, f, default=str, ensure_ascii=False, indent=2)
    print(f"Wrote {len(rows)} rows to {out_file}")

def main():
    if not DB.exists():
        print(f"SQLite DB not found at {DB}")
        return
    conn = sqlite3.connect(str(DB))
    for t in tables:
        dump_table(conn, t)
    conn.close()

if __name__ == '__main__':
    main()
