import pandas as pd

df = pd.read_csv("raw_sales.csv", encoding='latin1')

# Select only needed columns
df = df[[
    'ORDERNUMBER','QUANTITYORDERED','PRICEEACH','SALES','ORDERDATE',
    'STATUS','QTR_ID','MONTH_ID','YEAR_ID','PRODUCTLINE',
    'CUSTOMERNAME','COUNTRY','TERRITORY','DEALSIZE'
]]

# Convert headers to lowercase
df.columns = [col.lower().strip() for col in df.columns]

# Save cleaned version
df.to_csv("cleaned_for_supabase.csv", index=False)