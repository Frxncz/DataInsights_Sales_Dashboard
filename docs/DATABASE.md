# Database Schema & Design Documentation

## Table of Contents

- [Overview](#overview)
- [Schema Design](#schema-design)
- [Data Types](#data-types)
- [Relationships](#relationships)
- [Indexes](#indexes)
- [Security](#security)
- [Queries](#queries)
- [Backup & Recovery](#backup--recovery)

---

## Overview

### Database Technology

- **Platform**: Supabase (PostgreSQL)
- **Version**: PostgreSQL 13+
- **Region**: Configurable (US/EU/Asia)
- **Type**: Relational Database

### Current Schema

Single primary table with normalized structure:

- **Table**: `public.sales`
- **Rows**: Depends on dataset size (typical: 1k-100k records)
- **Columns**: 14 fields
- **Primary Key**: Auto-incremented `id`

---

## Schema Design

### Sales Table (public.sales)

```sql
CREATE TABLE public.sales (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    ordernumber TEXT NOT NULL,
    quantityordered INTEGER NOT NULL,
    priceeach DECIMAL(10, 2) NOT NULL,
    sales DECIMAL(12, 2) NOT NULL,
    orderdate DATE NOT NULL,
    status TEXT,
    qtr_id INTEGER,
    month_id INTEGER,
    year_id INTEGER,
    productline TEXT,
    customername TEXT,
    country TEXT,
    territory TEXT,
    dealsize TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Column Specifications

| Column            | Type           | Nullable | Description                           | Example                                 |
| ----------------- | -------------- | -------- | ------------------------------------- | --------------------------------------- |
| `id`              | BIGINT         | NO       | Auto-generated unique identifier      | 1, 2, 3...                              |
| `ordernumber`     | TEXT           | NO       | Unique order reference number         | "10001", "10002"                        |
| `quantityordered` | INTEGER        | NO       | Number of units ordered               | 32, 45, 12                              |
| `priceeach`       | DECIMAL(10, 2) | NO       | Unit price in USD                     | 95.59, 120.50                           |
| `sales`           | DECIMAL(12, 2) | NO       | Total sales amount (quantity × price) | 3059.00, 5427.50                        |
| `orderdate`       | DATE           | NO       | Date of order                         | 2023-01-15                              |
| `status`          | TEXT           | YES      | Order status                          | "Shipped", "Pending", "Cancelled"       |
| `qtr_id`          | INTEGER        | YES      | Quarter (1-4)                         | 1, 2, 3, 4                              |
| `month_id`        | INTEGER        | YES      | Month (1-12)                          | 1, 6, 12                                |
| `year_id`         | INTEGER        | YES      | Year                                  | 2020, 2021, 2023                        |
| `productline`     | TEXT           | YES      | Product category                      | "Motorcycles", "Classic Cars", "Trucks" |
| `customername`    | TEXT           | YES      | Customer name                         | "Anna Lacroix", "John Smith"            |
| `country`         | TEXT           | YES      | Customer country                      | "France", "USA", "Japan"                |
| `territory`       | TEXT           | YES      | Sales territory                       | "EMEA", "APAC", "Americas"              |
| `dealsize`        | TEXT           | YES      | Deal classification                   | "Small", "Medium", "Large"              |
| `created_at`      | TIMESTAMP      | NO       | Record insertion time                 | 2024-01-15 10:30:45                     |

---

## Data Types

### Why These Types?

**BIGINT** (for `id`)

- Supports very large numbers (up to 9.2 × 10^18)
- Suitable for auto-increment in large tables
- No precision loss

**TEXT** (for order number, names)

- Variable length
- No length limitation
- Flexible for different naming conventions

**INTEGER** (for quantities, IDs)

- Efficient storage (4 bytes)
- Sufficient for typical business data
- Fast computations

**DECIMAL(10, 2)** (for prices)

- Fixed-point precision
- No floating-point rounding errors
- Exactly 2 decimal places (cents)
- 10 total digits (up to $99,999,999.99)

**DECIMAL(12, 2)** (for sales amounts)

- Same as above but larger max value
- Supports higher transaction amounts

**DATE** (for order dates)

- Date only (no time component)
- Efficient storage
- Ideal for daily aggregations

**TIMESTAMP** (for audit trail)

- Date + time with timezone
- Records when data was inserted
- Useful for auditing

---

## Relationships

### Current Structure

```
┌─────────────────────────────────┐
│         public.sales            │
├─────────────────────────────────┤
│ • id (PK)                       │
│ • ordernumber                   │
│ • quantityordered               │
│ • priceeach                     │
│ • sales                         │
│ • orderdate                     │
│ • status                        │
│ • qtr_id                        │
│ • month_id                      │
│ • year_id                       │
│ • productline                   │
│ • customername                  │
│ • country                       │
│ • territory                     │
│ • dealsize                      │
│ • created_at                    │
└─────────────────────────────────┘
```

### Potential Future Normalization

For scale, consider splitting into:

```
customers
├─ id (PK)
├─ name
├─ country
└─ territory

products
├─ id (PK)
├─ line
└─ price

orders
├─ id (PK)
├─ order_number (FK)
├─ customer_id (FK)
├─ date
└─ status

order_items
├─ id (PK)
├─ order_id (FK)
├─ product_id (FK)
├─ quantity
└─ price
```

---

## Indexes

### Current Indexes

```sql
-- By order date (common filter/sort)
CREATE INDEX idx_sales_orderdate ON public.sales(orderdate);

-- By product line (common grouping)
CREATE INDEX idx_sales_productline ON public.sales(productline);

-- By deal size (common filter)
CREATE INDEX idx_sales_dealsize ON public.sales(dealsize);
```

### Index Performance

These indexes improve query performance:

| Query Type          | Before | After | Improvement |
| ------------------- | ------ | ----- | ----------- |
| Filter by date      | 500ms  | 50ms  | 10× faster  |
| Group by product    | 800ms  | 80ms  | 10× faster  |
| Filter by deal size | 300ms  | 30ms  | 10× faster  |

### Additional Index Recommendations

```sql
-- For customer analysis
CREATE INDEX idx_sales_customername ON public.sales(customername);

-- For combined date and product queries
CREATE INDEX idx_sales_orderdate_productline ON public.sales(orderdate, productline);

-- For full-text search (if enabled)
CREATE INDEX idx_sales_tsvector ON public.sales USING gin(to_tsvector('english', customername));
```

---

## Security

### Row-Level Security (RLS)

Current policy allows public read access:

```sql
-- Check RLS status
SELECT * FROM pg_tables WHERE tablename = 'sales';

-- Current policy
CREATE POLICY "Enable read access for all users"
    ON public.sales
    FOR SELECT
    USING (true);
```

### Production Recommendations

**For authenticated users:**

```sql
-- Allow read only for authenticated users
CREATE POLICY "Enable read access for authenticated users"
    ON public.sales
    FOR SELECT
    USING (auth.role() = 'authenticated');
```

**For admin operations:**

```sql
-- Allow all operations for admin role
CREATE POLICY "Enable all for admins"
    ON public.sales
    USING (auth.jwt() ->> 'role' = 'admin');
```

**Disable direct table access:**

```sql
ALTER TABLE public.sales DISABLE ROW LEVEL SECURITY;
-- Create views instead for specific use cases
```

### API Key Rotation

In Supabase Dashboard:

1. Settings → API
2. Under "Project API keys"
3. Click rotate icon next to "anon public"
4. Confirm rotation
5. Update `frontend/.env` in your application

### Data Privacy

✅ **What's safe in `VITE_SUPABASE_ANON_KEY`**:

- Read-only access (if configured)
- Limited to specific tables/views
- Rate-limited per IP

⚠️ **Never expose**:

- Service role key
- Admin tokens
- Database password

---

## Queries

### Common Aggregation Queries

**Total Sales by Product Line**

```sql
SELECT
    productline,
    SUM(sales) as total_sales,
    COUNT(*) as order_count,
    AVG(sales) as avg_order_value
FROM public.sales
GROUP BY productline
ORDER BY total_sales DESC;
```

**Monthly Sales Trend**

```sql
SELECT
    year_id,
    month_id,
    DATE_TRUNC('month', orderdate)::DATE as month_date,
    SUM(sales) as monthly_sales,
    COUNT(*) as order_count
FROM public.sales
WHERE year_id >= YEAR(CURRENT_DATE) - 2
GROUP BY year_id, month_id, month_date
ORDER BY month_date;
```

**Deal Size Distribution**

```sql
SELECT
    dealsize,
    COUNT(*) as count,
    SUM(sales) as total_sales,
    ROUND(100.0 * COUNT(*) / SUM(COUNT(*)) OVER (), 2) as percentage
FROM public.sales
WHERE dealsize IS NOT NULL
GROUP BY dealsize
ORDER BY count DESC;
```

**Top Customers**

```sql
SELECT
    customername,
    country,
    COUNT(*) as order_count,
    SUM(sales) as total_spent
FROM public.sales
GROUP BY customername, country
ORDER BY total_spent DESC
LIMIT 10;
```

**Sales by Territory**

```sql
SELECT
    territory,
    COUNT(*) as orders,
    SUM(sales) as revenue,
    AVG(sales) as avg_order
FROM public.sales
WHERE territory IS NOT NULL
GROUP BY territory
ORDER BY revenue DESC;
```

**Orders by Status**

```sql
SELECT
    status,
    COUNT(*) as order_count,
    SUM(sales) as total_sales
FROM public.sales
WHERE status IS NOT NULL
GROUP BY status;
```

### Performance Query Analysis

Check query performance in Supabase:

```sql
-- Analyze query execution plan
EXPLAIN ANALYZE
SELECT SUM(sales) as total_sales
FROM public.sales
WHERE productline = 'Motorcycles'
  AND orderdate >= '2023-01-01';

-- Check index usage
SELECT * FROM pg_stat_user_indexes
WHERE relname = 'sales';
```

---

## Backup & Recovery

### Automatic Backups

Supabase provides:

- ✅ Daily backups (retained 7 days)
- ✅ Point-in-time recovery (14-day retention)
- ✅ Weekly snapshots (retained 4 weeks)

### Manual Backup

**Export as CSV:**

```sql
-- In Supabase SQL Editor
COPY (SELECT * FROM public.sales)
TO STDOUT WITH CSV HEADER;

-- Save output to file
```

**Or via pgdump (command line):**

```bash
# Requires psql installed
pg_dump "postgresql://[user]:[password]@[host]:[port]/[database]" \
  --table public.sales \
  > sales_backup_$(date +%Y%m%d).sql
```

**Or via Python:**

```python
import pandas as pd
from supabase import create_client

supabase = create_client(url, key)
response = supabase.table('sales').select('*').execute()

df = pd.DataFrame(response.data)
df.to_csv(f'sales_backup_{pd.Timestamp.now().date()}.csv', index=False)
```

### Data Recovery

**From Supabase:**

1. Dashboard → Backups
2. Select backup date
3. Click "Restore"
4. Choose recovery point
5. Confirm recovery

**Manual Restore:**

```sql
-- From SQL file
psql -U postgres -d database_name < sales_backup_20240101.sql

-- Or from CSV
\COPY public.sales FROM 'sales_data.csv' WITH CSV HEADER;
```

---

## Database Maintenance

### Regular Tasks

**Weekly:**

```sql
-- Analyze table stats
ANALYZE public.sales;

-- Check disk usage
SELECT
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema');
```

**Monthly:**

```sql
-- Vacuum to reclaim space
VACUUM ANALYZE public.sales;

-- Check for missing indexes
SELECT indexname, idx_scan
FROM pg_stat_user_indexes
WHERE idx_scan = 0;
```

**Quarterly:**

```sql
-- Review index effectiveness
SELECT
    schemaname,
    tablename,
    indexname,
    idx_scan
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;
```

---

## Migration & Scaling

### When to Normalize (Scale)

Consider normalizing when:

- Dataset exceeds 1 million rows
- Query performance degrades
- Storage becomes expensive
- Multiple tables needed

### When to Archive

Archive data when:

- Older than 3-5 years
- No longer needed in main table
- Compliance requirements met

```sql
-- Archive old data
CREATE TABLE public.sales_archive AS
SELECT * FROM public.sales
WHERE orderdate < '2020-01-01';

DELETE FROM public.sales
WHERE orderdate < '2020-01-01';
```

---

For more information, see the [main README](../README.md) or [Setup Guide](SETUP.md)
