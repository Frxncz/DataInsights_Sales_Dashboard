"""
Initial cleaning for Supabase.

What this script does (Task 2A - partial):
- Reads the raw CSV (submission file if present, otherwise the full dataset).
- Selects only the columns needed by the dashboard.
- Normalizes headers to lowercase for consistency.
- Exports a cleaned CSV ready for upload to Supabase.

Submission mode:
- If `dataset/submission_raw_sales_1000.csv` exists, it is used automatically so the
  exported file stays within the 500–1000 row requirement.
"""

import os

import pandas as pd

# Prefer the submission dataset if it exists (ensures <= 1000 rows).
raw_path = "dataset/submission_raw_sales_1000.csv"
if not os.path.exists(raw_path):
    raw_path = "dataset/raw_sales.csv"

df = pd.read_csv(raw_path, encoding="latin1")

# Select only the columns used for analytics + charts.
df = df[[
    'ORDERNUMBER','QUANTITYORDERED','PRICEEACH','SALES','ORDERDATE',
    'STATUS','QTR_ID','MONTH_ID','YEAR_ID','PRODUCTLINE',
    'CUSTOMERNAME','COUNTRY','TERRITORY','DEALSIZE'
]]

# Normalize headers for easier downstream processing in Python/JS.
df.columns = [col.lower().strip() for col in df.columns]

# Save cleaned version (submission vs full dataset output name).
output_path = (
    "dataset/submission_cleaned_for_supabase_1000.csv"
    if raw_path.endswith("submission_raw_sales_1000.csv")
    else "dataset/cleaned_for_supabase.csv"
)
df.to_csv(output_path, index=False)
print(f"Wrote {len(df)} rows to {output_path}")
