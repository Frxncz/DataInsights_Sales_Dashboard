"""
Run 3 analytical queries on the cleaned dataset and print results.

This satisfies the course requirement for:
- 3 meaningful analytical queries
- printed outputs

Default input: dataset/cleaned_for_supabase.csv
Optional: set INPUT_CSV env var or pass --csv.
"""

from __future__ import annotations

import argparse
import os
from pathlib import Path

import pandas as pd


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Run analytical queries on cleaned data.")
    parser.add_argument(
        "--csv",
        default=os.environ.get(
            "INPUT_CSV",
            str(
                Path("dataset")
                / (
                    "submission_cleaned_for_supabase_1000.csv"
                    if (Path("dataset") / "submission_cleaned_for_supabase_1000.csv").exists()
                    else "cleaned_for_supabase.csv"
                )
            ),
        ),
        help="Path to cleaned CSV (default: dataset/cleaned_for_supabase.csv).",
    )
    parser.add_argument(
        "--outdir",
        default=str(Path("docs") / "query_outputs"),
        help="Directory to write CSV outputs (default: docs/query_outputs).",
    )
    return parser


def main() -> None:
    args = build_parser().parse_args()

    csv_path = Path(args.csv)
    if not csv_path.exists():
        raise SystemExit(f"CSV not found: {csv_path}")

    df = pd.read_csv(csv_path, encoding="latin1")
    df.columns = [c.lower().strip() for c in df.columns]

    outdir = Path(args.outdir)
    outdir.mkdir(parents=True, exist_ok=True)

    # Ensure numeric columns are numeric (coerce invalid values to NaN).
    # We keep NaN as-is; pandas will ignore NaNs in sums by default.
    for col in ["sales", "priceeach", "quantityordered", "month_id", "year_id"]:
        if col in df.columns:
            df[col] = pd.to_numeric(df[col], errors="coerce")

    # Query 1 (business question):
    # "Which product lines contribute the most total revenue?"
    q1 = (
        df.groupby("productline", dropna=False)["sales"]
        .sum(min_count=1)
        .sort_values(ascending=False)
        .head(5)
        .reset_index(name="total_revenue")
    )
    print("\nQ1) Top 5 product lines by total revenue")
    print(q1.to_string(index=False))
    q1.to_csv(outdir / "q1_top_productlines.csv", index=False)

    # Query 2 (business question):
    # "How does revenue change over time (monthly trend)?"
    q2 = (
        df.groupby(["year_id", "month_id"], dropna=False)["sales"]
        .sum(min_count=1)
        .reset_index(name="monthly_revenue")
        .sort_values(["year_id", "month_id"])
    )
    print("\nQ2) Monthly revenue trend (year_id, month_id)")
    print(q2.head(20).to_string(index=False))
    if len(q2) > 20:
        print(f"... ({len(q2)} rows total; full CSV written to {outdir / 'q2_monthly_revenue.csv'})")
    q2.to_csv(outdir / "q2_monthly_revenue.csv", index=False)

    # Query 3 (business question):
    # "What is the distribution of deals by deal size category?"
    q3 = (
        df.groupby("dealsize", dropna=False)
        .size()
        .reset_index(name="order_count")
        .sort_values("order_count", ascending=False)
    )
    print("\nQ3) Order count by deal size")
    print(q3.to_string(index=False))
    q3.to_csv(outdir / "q3_dealsize_distribution.csv", index=False)

    print("\nDone. CSV outputs written to:", outdir)


if __name__ == "__main__":
    main()
