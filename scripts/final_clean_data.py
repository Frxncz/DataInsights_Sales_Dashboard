import pandas as pd

# Load dataset
df = pd.read_csv("dataset/cleaned_for_supabase.csv", encoding='latin1')

# 1. Remove missing values
df = df.dropna()

# 2. Convert ORDERDATE to proper format
df['orderdate'] = pd.to_datetime(df['orderdate'])

# 3. Normalize SALES column
df['sales'] = (df['sales'] - df['sales'].mean()) / df['sales'].std()

# 4. Remove outliers using IQR
Q1 = df['sales'].quantile(0.25)
Q3 = df['sales'].quantile(0.75)
IQR = Q3 - Q1

df = df[(df['sales'] >= Q1 - 1.5 * IQR) & (df['sales'] <= Q3 + 1.5 * IQR)]

# 5. Save cleaned dataset
df.to_csv("dataset/cleaned_sales.csv", index=False)