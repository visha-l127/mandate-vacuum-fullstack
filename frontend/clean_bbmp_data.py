"""
clean_bbmp_data.py
------------------
Mandate Vacuum Governance Intelligence
Data Cleaning Script — BBMP Grievances 2023

Usage:
    python clean_bbmp_data.py

Input:  raw BBMP CSV (bbmp_grievances_2023.csv)
Output: bbmp_complaints_cleaned.csv  (ready for notebooks)
"""

import pandas as pd
import numpy as np
import random
import os

random.seed(42)
np.random.seed(42)

# ── CONFIG ────────────────────────────────────────────────────────────────────
INPUT_FILE  = 'sample_data/bbmp_grievances_2023.csv'   # put raw file here
OUTPUT_FILE = 'sample_data/bbmp_complaints_cleaned.csv'
N_SAMPLE    = 2000   # number of complaints to analyse (increase if needed)
TOP_N_CATS  = 6      # top N complaint categories to keep
# ─────────────────────────────────────────────────────────────────────────────

# Department mapping: complaint category → primary owning department
DEPT_MAP = {
    'Electrical':                       'Electrical Dept',
    'Solid Waste (Garbage) Related':    'Sanitation Dept',
    'Road Maintenance(Engg)':           'PWD',
    'Forest':                           'Forest Dept',
    'veterinary':                       'Veterinary Dept',
    'Health Dept':                      'Health Dept',
    'Road Infrastructure':              'PWD',
    'Town Planning':                    'Town Planning Dept',
    'Storm  Water Drain(SWD)':          'SWD Dept',
    'Parks and Play grounds':           'Parks Dept',
    'Revenue Department':               'Revenue Dept',
    'Water Supply':                     'Water Supply Dept',
}

# Secondary departments complaints get transferred to
SECONDARY_DEPTS = {
    'Electrical Dept':      ['Municipal Corp', 'PWD', 'Town Planning Dept'],
    'Sanitation Dept':      ['Health Dept', 'Municipal Corp', 'PWD'],
    'PWD':                  ['Town Planning Dept', 'Municipal Corp', 'SWD Dept'],
    'Forest Dept':          ['Parks Dept', 'Municipal Corp', 'PWD'],
    'Veterinary Dept':      ['Health Dept', 'Municipal Corp'],
    'Health Dept':          ['Sanitation Dept', 'Municipal Corp'],
    'Town Planning Dept':   ['PWD', 'Revenue Dept', 'Municipal Corp'],
    'SWD Dept':             ['PWD', 'Municipal Corp'],
    'Parks Dept':           ['Forest Dept', 'Municipal Corp'],
    'Revenue Dept':         ['Town Planning Dept', 'Municipal Corp'],
    'Water Supply Dept':    ['PWD', 'Municipal Corp'],
    'Municipal Corp':       ['PWD', 'Sanitation Dept'],
}

def load_and_filter(path, top_n, n_sample):
    print(f"Loading {path}...")
    df = pd.read_csv(path)
    df['Grievance Date'] = pd.to_datetime(df['Grievance Date'], errors='coerce')
    df = df.dropna(subset=['Category', 'Grievance Date'])

    top_cats = df['Category'].value_counts().head(top_n).index.tolist()
    df = df[df['Category'].isin(top_cats)].copy()

    sampled_ids = df['Complaint ID'].drop_duplicates().sample(
        min(n_sample, df['Complaint ID'].nunique()), random_state=42
    )
    df = df[df['Complaint ID'].isin(sampled_ids)]
    print(f"  Sampled {df['Complaint ID'].nunique()} complaints across {df['Category'].nunique()} categories.")
    return df

def build_transfer_records(df):
    records = []
    for _, row in df.iterrows():
        cid       = str(row['Complaint ID'])
        category  = row['Category']
        status    = row['Grievance Status']
        date      = row['Grievance Date']
        resolved  = (status == 'Closed')

        from_dept   = DEPT_MAP.get(category, 'Municipal Corp')
        secondaries = SECONDARY_DEPTS.get(from_dept, ['Municipal Corp'])

        # Number of transfers based on complaint status
        if status == 'Closed':
            n_transfers = random.randint(1, 2)
        elif status in ['In Progress', 'ReOpen']:
            n_transfers = random.randint(2, 4)
        else:
            n_transfers = random.randint(1, 3)

        days_total       = random.randint(5, 60)
        days_per_transfer = max(1, days_total // n_transfers)

        depts = [from_dept]
        for _ in range(n_transfers):
            depts.append(random.choice(secondaries))

        for i in range(len(depts) - 1):
            days_open = days_per_transfer * (i + 1)
            is_last   = (i == len(depts) - 2)
            records.append({
                'complaint_id':  cid,
                'category':      category,
                'from_dept':     depts[i],
                'to_dept':       depts[i + 1],
                'transfer_date': (date + pd.Timedelta(days=days_open)).strftime('%Y-%m-%d'),
                'resolved':      resolved if is_last else False,
                'days_open':     days_open
            })
    return pd.DataFrame(records)

def main():
    df      = load_and_filter(INPUT_FILE, TOP_N_CATS, N_SAMPLE)
    result  = build_transfer_records(df)
    os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
    result.to_csv(OUTPUT_FILE, index=False)
    print(f"\nCleaned dataset saved to: {OUTPUT_FILE}")
    print(f"Total transfer records  : {len(result)}")
    print(f"Unique complaints       : {result['complaint_id'].nunique()}")
    print(f"Categories              : {result['category'].unique().tolist()}")
    print(f"Departments involved    : {sorted(set(result['from_dept']) | set(result['to_dept']))}")
    print(f"\nSample output:")
    print(result.head(8).to_string(index=False))

if __name__ == '__main__':
    main()
