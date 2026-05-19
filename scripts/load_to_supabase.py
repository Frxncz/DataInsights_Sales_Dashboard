"""
Load a CSV into a Supabase table using the REST (PostgREST) endpoint.

FREE tooling only:
- Uses Python stdlib + pandas (already in requirements.txt).
- Requires no paid SDKs.

Required environment variables:
  SUPABASE_URL=https://<project-ref>.supabase.co
  SUPABASE_KEY=<anon key OR service role key>

Optional environment variables:
  SUPABASE_TABLE=cleaned_for_supabase
  SUPABASE_SCHEMA=public
  SUPABASE_BATCH_SIZE=500

Usage examples (PowerShell):
  $env:SUPABASE_URL="https://xxxxx.supabase.co"
  $env:SUPABASE_KEY="your_key"
  python scripts/load_to_supabase.py --csv dataset/cleaned_for_supabase.csv

Notes:
- If Row Level Security (RLS) is enabled, the key must have INSERT permission
  (service role key) OR you must create an INSERT policy for your client role.
"""

from __future__ import annotations

import argparse
import json
import os
from pathlib import Path
from typing import Any, Dict, List
from urllib.error import HTTPError
from urllib.request import Request, urlopen

import pandas as pd


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description="Load a CSV into Supabase via REST.")
    parser.add_argument(
        "--csv",
        default=str(Path("dataset") / "cleaned_for_supabase.csv"),
        help="Path to the CSV to upload.",
    )
    parser.add_argument(
        "--table",
        default=os.environ.get("SUPABASE_TABLE", "cleaned_for_supabase"),
        help="Target table name.",
    )
    parser.add_argument(
        "--schema",
        default=os.environ.get("SUPABASE_SCHEMA", "public"),
        help="Target schema (default: public).",
    )
    parser.add_argument(
        "--mode",
        choices=["insert", "upsert"],
        default="insert",
        help="insert=POST, upsert=POST with resolution on primary key (requires PK).",
    )
    return parser


def chunk_list(items: List[Dict[str, Any]], size: int) -> List[List[Dict[str, Any]]]:
    """
    Split a list of row-dicts into fixed-size chunks.

    Supabase REST inserts accept an array payload, but very large arrays may fail,
    so we upload in batches (default: 500 rows).
    """
    return [items[i : i + size] for i in range(0, len(items), size)]


def post_json(url: str, api_key: str, payload: Any, prefer: str) -> None:
    """
    POST JSON to Supabase PostgREST.

    Auth:
    - `apikey` header is required by Supabase.
    - `Authorization: Bearer <key>` is required for PostgREST auth.

    Prefer header:
    - `return=minimal` avoids returning the inserted rows (faster).
    - upsert mode uses `resolution=merge-duplicates` but requires a unique key.
    """
    body = json.dumps(payload).encode("utf-8")
    request = Request(
        url,
        data=body,
        method="POST",
        headers={
            "Content-Type": "application/json",
            "apikey": api_key,
            "Authorization": f"Bearer {api_key}",
            "Prefer": prefer,
        },
    )

    try:
        with urlopen(request, timeout=60) as response:
            _ = response.read()
    except HTTPError as exc:
        details = exc.read().decode("utf-8", errors="replace")
        raise SystemExit(f"Upload failed ({exc.code}): {details}") from exc


def main() -> None:
    args = build_parser().parse_args()

    supabase_url = os.environ.get("SUPABASE_URL", "").strip()
    supabase_key = os.environ.get("SUPABASE_KEY", "").strip()
    if not supabase_url or not supabase_key:
        raise SystemExit("Missing SUPABASE_URL or SUPABASE_KEY environment variables.")

    batch_size = int(os.environ.get("SUPABASE_BATCH_SIZE", "500"))
    if batch_size <= 0:
        raise SystemExit("SUPABASE_BATCH_SIZE must be a positive integer.")

    csv_path = Path(args.csv)
    if not csv_path.exists():
        raise SystemExit(f"CSV not found: {csv_path}")

    df = pd.read_csv(csv_path, encoding="latin1")

    # Ensure JSON-serializable values:
    # - Convert NaN/NaT to None so json.dumps works and PostgREST accepts nulls.
    df = df.where(pd.notnull(df), None)
    records: List[Dict[str, Any]] = df.to_dict(orient="records")

    table = args.table
    schema = args.schema  # for logging only (PostgREST uses the default schema via URL)
    endpoint = f"{supabase_url}/rest/v1/{table}"

    prefer = "return=minimal"
    if args.mode == "upsert":
        # Upsert requires the table to have a primary key or unique constraint.
        prefer = "resolution=merge-duplicates,return=minimal"

    batches = chunk_list(records, batch_size)
    for index, batch in enumerate(batches, start=1):
        post_json(endpoint, supabase_key, batch, prefer=prefer)
        print(f"Uploaded batch {index}/{len(batches)} ({len(batch)} rows) to {schema}.{table}")

    print("Done.")


if __name__ == "__main__":
    main()
