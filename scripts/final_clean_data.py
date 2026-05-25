"""
Advanced cleaning pipeline for the dashboard:

Meets course requirements (Task 2A):
- Handle missing values (drop rows with nulls after selecting required columns)
- Normalize 1 numeric column (z-score standardization on `sales`)
- Filter outliers (IQR method on normalized `sales`)
- Export cleaned dataset

Submission mode:
- If dataset/submission_cleaned_for_supabase_1000.csv exists, it will be used as input
  and outputs will be written as submission_* files, staying within <= 1000 rows.
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd

base_dir = Path(__file__).resolve().parent
dataset_dir = (base_dir / ".." / "dataset").resolve()

submission_input = dataset_dir / "submission_cleaned_for_supabase_1000.csv"
default_input = dataset_dir / "cleaned_for_supabase.csv"

input_path = submission_input if submission_input.exists() else default_input

output_path = (
    dataset_dir / "submission_cleaned_sales_1000.csv"
    if input_path.name.startswith("submission_")
    else dataset_dir / "cleaned_sales.csv"
)

df = pd.read_csv(input_path, encoding="latin1")

# Ensure lowercase columns for consistency across tools (Python + JS + Supabase CSV import).
df.columns = [c.strip().lower() for c in df.columns]

required_cols = [
    "ordernumber",
    "quantityordered",
    "priceeach",
    "sales",
    "orderdate",
    "status",
    "qtr_id",
    "month_id",
    "year_id",
    "productline",
    "customername",
    "country",
    "territory",
    "dealsize",
]

missing_required = [c for c in required_cols if c not in df.columns]
if missing_required:
    raise SystemExit(f"Missing required columns: {missing_required}")

df = df[required_cols].copy()

# 1) Handle missing values:
# Strategy: drop rows that contain nulls in any required column.
# (This is easy to explain and avoids imputing incorrect business values.)
before = len(df)
df = df.dropna()
after_dropna = len(df)

# 2) Type conversions:
# Coerce invalid values to NaN, then drop rows that cannot be parsed.
df["orderdate"] = pd.to_datetime(df["orderdate"], errors="coerce")
df["sales"] = pd.to_numeric(df["sales"], errors="coerce")
df["priceeach"] = pd.to_numeric(df["priceeach"], errors="coerce")
df["quantityordered"] = pd.to_numeric(df["quantityordered"], errors="coerce")
df = df.dropna(subset=["orderdate", "sales"])

# 3) Normalize SALES using z-score standardization:
# Adds a new column `sales_zscore` (keeps the original `sales` intact).
sales_mean = df["sales"].mean()
sales_std = df["sales"].std()
if not sales_std or sales_std == 0:
    raise SystemExit("Cannot standardize sales: standard deviation is zero.")

df["sales_zscore"] = (df["sales"] - sales_mean) / sales_std

# 4) Outlier filtering using IQR on z-score values:
# This removes extreme rows while keeping typical sales behavior.
q1 = df["sales_zscore"].quantile(0.25)
q3 = df["sales_zscore"].quantile(0.75)
iqr = q3 - q1
lower = q1 - 1.5 * iqr
upper = q3 + 1.5 * iqr
df = df[(df["sales_zscore"] >= lower) & (df["sales_zscore"] <= upper)]

# Add a simple primary key column for easier Supabase loading.
# Note: This id is stable only within this exported file (not globally unique across different exports).
df.insert(0, "id", range(1, len(df) + 1))

dataset_dir.mkdir(parents=True, exist_ok=True)
df.to_csv(output_path, index=False)

print(f"Input: {input_path}")
print(f"Rows before dropna: {before}")
print(f"Rows after dropna: {after_dropna}")
print(f"Rows after outlier filter: {len(df)}")
print(f"Wrote cleaned dataset to: {output_path}")
