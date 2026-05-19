import pandas as pd

"""
Initial cleaning for Supabase:
- Selects only the required columns
- Lowercases headers

Submission mode:
- If dataset/submission_raw_sales_1000.csv exists, it will be used automatically
  so the output stays within the 500-1000 row requirement.
"""

import os

raw_path = "dataset/submission_raw_sales_1000.csv"
if not os.path.exists(raw_path):
    raw_path = "dataset/raw_sales.csv"

df = pd.read_csv(raw_path, encoding="latin1")

# Select only needed columns
df = df[[
    'ORDERNUMBER','QUANTITYORDERED','PRICEEACH','SALES','ORDERDATE',
    'STATUS','QTR_ID','MONTH_ID','YEAR_ID','PRODUCTLINE',
    'CUSTOMERNAME','COUNTRY','TERRITORY','DEALSIZE'
]]

# Convert headers to lowercase
df.columns = [col.lower().strip() for col in df.columns]

# Save cleaned version
output_path = (
    "dataset/submission_cleaned_for_supabase_1000.csv"
    if raw_path.endswith("submission_raw_sales_1000.csv")
    else "dataset/cleaned_for_supabase.csv"
)
df.to_csv(output_path, index=False)
print(f"Wrote {len(df)} rows to {output_path}")
