"""
Create a deterministic 1,000-row subset for submission requirements.

Why this exists:
- The coursework requires datasets between 500 and 1,000 rows.
- Our original dataset has more than 1,000 rows.

Default input:  dataset/raw_sales.csv
Default output: dataset/submission_raw_sales_1000.csv
"""

from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Create a deterministic N-row subset of the raw sales CSV."
    )
    parser.add_argument(
        "--input",
        default=str(Path("dataset") / "raw_sales.csv"),
        help="Path to the raw CSV.",
    )
    parser.add_argument(
        "--output",
        default=str(Path("dataset") / "submission_raw_sales_1000.csv"),
        help="Path to write the subset CSV.",
    )
    parser.add_argument(
        "--rows",
        type=int,
        default=1000,
        help="Number of rows to keep (must be <= row count).",
    )
    return parser


def main() -> None:
    args = build_parser().parse_args()

    input_path = Path(args.input)
    output_path = Path(args.output)
    rows = int(args.rows)

    df = pd.read_csv(input_path, encoding="latin1")
    if rows <= 0:
        raise SystemExit("--rows must be a positive integer.")
    if len(df) < rows:
        raise SystemExit(
            f"Requested {rows} rows but input only has {len(df)} rows. "
            "Choose a smaller --rows value."
        )

    # Deterministic selection strategy:
    # Sort by stable business keys (date/year/month/order) then take the first N.
    sort_columns = [c for c in ["YEAR_ID", "MONTH_ID", "ORDERDATE", "ORDERNUMBER"] if c in df.columns]
    if sort_columns:
        df = df.sort_values(sort_columns, kind="mergesort")
    subset = df.head(rows).copy()

    output_path.parent.mkdir(parents=True, exist_ok=True)
    subset.to_csv(output_path, index=False)

    print(f"Wrote {len(subset)} rows to {output_path}")


if __name__ == "__main__":
    main()

