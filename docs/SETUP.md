# Setup & Configuration Guide

## Table of Contents

- [System Requirements](#system-requirements)
- [Installation Steps](#installation-steps)
- [Environment Variables](#environment-variables)
- [Supabase Setup](#supabase-setup)
- [Data Loading](#data-loading)
- [Verification](#verification)

---

## System Requirements

### Minimum Requirements

| Component      | Minimum        | Recommended |
| -------------- | -------------- | ----------- |
| **RAM**        | 2 GB           | 4 GB        |
| **Disk Space** | 500 MB         | 2 GB        |
| **Node.js**    | 16.0.0         | 18+         |
| **npm**        | 7.0.0          | 9+          |
| **Python**     | 3.7 (optional) | 3.9+        |

### Operating System

- ✅ Windows 10+ (64-bit)
- ✅ macOS 10.13+ (Intel or Apple Silicon)
- ✅ Linux (Ubuntu 18.04+, Debian 10+, CentOS 7+)

### Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

---

## Installation Steps

### 1. Install Node.js

#### Windows

1. Download from [nodejs.org](https://nodejs.org/)
2. Run installer (.msi)
3. Follow installation wizard
4. Restart your computer

#### macOS

```bash
# Using Homebrew (recommended)
brew install node

# Or download installer from nodejs.org
```

#### Linux (Ubuntu/Debian)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Verify Installation

```bash
node --version
# Output: v18.x.x or higher

npm --version
# Output: 9.x.x or higher
```

### 3. Clone Repository

```bash
# Using HTTPS
git clone https://github.com/yourusername/DataInsights_Sales_Dashboard.git
cd DataInsights_Sales_Dashboard

# Or using SSH
git clone git@github.com:yourusername/DataInsights_Sales_Dashboard.git
cd DataInsights_Sales_Dashboard
```

### 4. Install Frontend Dependencies

```bash
cd frontend
npm install
```

**Troubleshooting**:

- If installation hangs: `npm cache clean --force`
- If permission denied: Use `sudo npm install` (not recommended)

### 5. Install Python (Optional - for data processing)

#### Windows

1. Download from [python.org](https://www.python.org/)
2. Run installer
3. ✅ Check "Add Python to PATH"
4. Click "Install Now"

#### macOS

```bash
# Using Homebrew
brew install python3
```

#### Linux

```bash
# Ubuntu/Debian
sudo apt-get install python3 python3-pip

# CentOS
sudo yum install python3 python3-pip
```

### 6. Setup Python Virtual Environment

```bash
# Navigate to project root
cd DataInsights_Sales_Dashboard

# Create virtual environment
python -m venv venv

# Activate environment
# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

# Install pandas
pip install pandas
```

---

## Environment Variables

### Create .env.local

```bash
# Navigate to frontend directory
cd frontend

# Create environment file
touch .env.local  # macOS/Linux
# or
type nul > .env.local  # Windows (PowerShell)
```

### Add Configuration

```env
# Supabase Configuration (Required)
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Custom Configuration
# VITE_API_TIMEOUT=30000
# VITE_DEBUG=false
```

### Add to .gitignore

```bash
# Create .gitignore in frontend (if not exists)
echo ".env.local" >> .gitignore
echo ".env.*.local" >> .gitignore
echo "node_modules/" >> .gitignore
echo "dist/" >> .gitignore
```

---

## Supabase Setup

### Step 1: Create Supabase Account

1. Visit [supabase.com](https://supabase.com/)
2. Click "Start your project"
3. Sign up with email or GitHub
4. Verify email address

### Step 2: Create Project

1. Click **New Project**
2. Fill in details:
   ```
   Project Name: sales-dashboard
   Database Password: [strong_password_here]
   Region: [closest_to_you]
   Organization: (default or select)
   ```
3. Click **Create new project**
4. Wait for initialization (2-5 minutes)

### Step 3: Get API Credentials

1. Go to **Settings** → **API**
2. Under **Project API keys**:
   - Copy **Project URL** → `VITE_SUPABASE_URL`
   - Copy **anon public** → `VITE_SUPABASE_ANON_KEY`

### Step 4: Create Database Table

1. Go to **SQL Editor**
2. Click **New Query**
3. Paste this SQL:

```sql
-- Create sales table
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

-- Create indexes for performance
CREATE INDEX idx_sales_orderdate ON public.sales(orderdate);
CREATE INDEX idx_sales_productline ON public.sales(productline);
CREATE INDEX idx_sales_dealsize ON public.sales(dealsize);

-- Enable RLS (Row-Level Security)
ALTER TABLE public.sales ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for public read access
CREATE POLICY "Enable read access for all users"
    ON public.sales
    FOR SELECT
    USING (true);

-- Add table description
COMMENT ON TABLE public.sales IS 'Sales transactions data for analytics dashboard';
```

4. Click **Run**

### Step 5: Verify Table Creation

```sql
-- Check table exists
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';

-- Check columns
SELECT column_name, data_type FROM information_schema.columns
WHERE table_name = 'sales';
```

---

## Data Loading

### Method 1: Using Python Scripts (Recommended)

#### Step 1: Prepare Raw Data

```bash
# Place your raw_sales.csv in dataset folder
cp /path/to/raw_sales.csv dataset/raw_sales.csv
```

#### Step 2: Run Cleaning Scripts

```bash
# Navigate to project root
cd DataInsights_Sales_Dashboard

# Activate Python environment
venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

# Run initial cleaning
python scripts/clean_data_for_supabase.py

# Run advanced cleaning (optional)
python scripts/final_clean_data.py
```

**Expected Output**:

```
Cleaned data saved to dataset/cleaned_for_supabase.csv
Cleaned data saved to dataset/cleaned_sales.csv
```

#### Step 3: Upload to Supabase

**Using Supabase Dashboard**:

1. Go to Table Editor → `sales` table
2. Click **Insert** → **Import data**
3. Select `dataset/cleaned_sales.csv`
4. Review column mapping
5. Click **Import**

**Using Python**:

```python
import pandas as pd
from supabase import create_client, Client

# Initialize Supabase
url = "your_supabase_url"
key = "your_supabase_anon_key"
supabase = create_client(url, key)

# Load data
df = pd.read_csv("dataset/cleaned_sales.csv")
data = df.to_dict('records')

# Upload to Supabase
for i in range(0, len(data), 1000):
    batch = data[i:i+1000]
    response = supabase.table("sales").insert(batch).execute()
    print(f"Inserted {len(response.data)} records (batch {i//1000 + 1})")
```

### Method 2: Manual Upload via SQL

```sql
-- Copy CSV data directly (if using managed database)
COPY public.sales(
    ordernumber, quantityordered, priceeach, sales,
    orderdate, status, qtr_id, month_id, year_id,
    productline, customername, country, territory, dealsize
)
FROM PROGRAM 'cat /path/to/cleaned_sales.csv'
WITH (FORMAT csv, HEADER true, DELIMITER ',');
```

### Method 3: Using Supabase API

```javascript
// Using Supabase JS client
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(url, key);

const csvData = [
  { ordernumber: "ORD-001", sales: 5000 /* ... */ },
  { ordernumber: "ORD-002", sales: 7500 /* ... */ },
];

const { data, error } = await supabase.from("sales").insert(csvData);

if (error) console.error("Upload failed:", error);
else console.log(`Uploaded ${data.length} records`);
```

---

## Verification

### 1. Verify Node.js Setup

```bash
npm --version
npm ls
# Should show all installed packages
```

### 2. Verify Frontend Installation

```bash
cd frontend
npm install
npm run build
# Should complete without errors
```

### 3. Verify Supabase Connection

```bash
# Start dev server
npm run dev

# Open browser console (F12)
# In console, run:
fetch('https://yourproject.supabase.co/rest/v1/sales?limit=1', {
  headers: {
    'apikey': 'your-anon-key',
    'Authorization': 'Bearer your-anon-key'
  }
})
.then(r => r.json())
.then(d => console.log('Connection successful:', d))
.catch(e => console.error('Connection failed:', e))
```

### 4. Verify Data Loading

```sql
-- In Supabase SQL Editor
SELECT COUNT(*) as total_records FROM public.sales;
-- Should return > 0

SELECT * FROM public.sales LIMIT 1;
-- Should show sample data
```

### 5. Test Application

1. Start dev server: `npm run dev`
2. Open `http://localhost:5173/`
3. Should see loading state
4. Verify charts appear with data
5. Check browser console for errors (F12)

### Common Setup Issues

| Issue                        | Solution                                    |
| ---------------------------- | ------------------------------------------- |
| "npm not found"              | Reinstall Node.js, restart terminal         |
| "Port 5173 in use"           | Kill process: `lsof -i :5173 \| kill -9`    |
| "Module not found"           | Run `npm install` in frontend directory     |
| "Env variables error"        | Verify `.env.local` path and format         |
| "Supabase connection failed" | Check URL and API key in Supabase Dashboard |

---

## Quick Start Command Reference

```bash
# Clone repo
git clone [repo-url]
cd DataInsights_Sales_Dashboard

# Install dependencies
cd frontend && npm install && cd ..

# Setup Python (optional)
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install pandas

# Setup environment
cd frontend
echo 'VITE_SUPABASE_URL=...' > .env.local
echo 'VITE_SUPABASE_ANON_KEY=...' >> .env.local

# Start development server
npm run dev

# Access application
# Open http://localhost:5173/ in browser
```

---

For more details, see [main README.md](../README.md)
