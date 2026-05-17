import pandas as pd
import os

# Set paths
base_dir = os.path.dirname(__file__)
input_path = os.path.join(base_dir, "../dataset/raw_sales.csv")
output_path = os.path.join(base_dir, "../dataset/cleaned_for_supabase.csv")

# Read CSV
df = pd.read_csv(input_path, encoding="latin1")

# Normalize column names
df.columns = df.columns.str.strip().str.upper()

# Select only needed columns
df = df[[
    'ORDERNUMBER','QUANTITYORDERED','PRICEEACH','SALES','ORDERDATE',
    'STATUS','QTR_ID','MONTH_ID','YEAR_ID','PRODUCTLINE',
    'CUSTOMERNAME','COUNTRY','TERRITORY','DEALSIZE'
]]

# Convert column names to lowercase
df.columns = df.columns.str.lower()

# Convert ORDERDATE to datetime
df['orderdate'] = pd.to_datetime(df['orderdate'])

# 🔥 ADD PRIMARY KEY COLUMN (IMPORTANT)
df.insert(0, 'id', range(1, len(df) + 1))

# Ensure output folder exists
os.makedirs(os.path.dirname(output_path), exist_ok=True)

# Save cleaned version
df.to_csv(output_path, index=False)

print("Cleaned dataset with primary key 'id' created successfully!")