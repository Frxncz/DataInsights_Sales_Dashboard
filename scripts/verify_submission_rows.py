"""
Verify that the submission datasets are within the 500-1000 row requirement.

Checks the following files if they exist:
- dataset/submission_raw_sales_1000.csv
- dataset/submission_cleaned_for_supabase_1000.csv
- dataset/submission_cleaned_sales_1000.csv
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd


def check(path: Path) -> None:
    df = pd.read_csv(path, encoding="latin1")
    rows = len(df)
    status = "OK" if 500 <= rows <= 1000 else "FAIL"
    print(f"{status}: {path} -> {rows} rows")
    if status == "FAIL":
        raise SystemExit("One or more submission files are outside 500-1000 rows.")


def main() -> None:
    targets = [
        Path("dataset") / "submission_raw_sales_1000.csv",
        Path("dataset") / "submission_cleaned_for_supabase_1000.csv",
        Path("dataset") / "submission_cleaned_sales_1000.csv",
    ]

    found_any = False
    for target in targets:
        if target.exists():
            found_any = True
            check(target)

    if not found_any:
        raise SystemExit("No submission_* dataset files found. Run the scripts first.")

    print("All checked submission datasets are within 500-1000 rows.")


if __name__ == "__main__":
    main()

