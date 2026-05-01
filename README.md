# DataInsights Sales Dashboard

A modern, interactive sales analytics dashboard built with React and Vite, powered by real-time data from Supabase. Visualize key sales metrics, trends, and performance indicators with interactive charts and KPI cards.

![Status](https://img.shields.io/badge/Status-Active-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Local Setup & Installation](#local-setup--installation)
- [Environment Configuration](#environment-configuration)
- [Supabase Setup](#supabase-setup)
- [Data Loading Guide](#data-loading-guide)
- [Running the Application](#running-the-application)
- [Building for Production](#building-for-production)
- [Project Architecture](#project-architecture)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 📊 Overview

DataInsights Sales Dashboard is a comprehensive sales analytics platform designed to help businesses visualize and analyze their sales performance. The application provides real-time insights into sales metrics, monthly trends, deal sizes, and product line performance through interactive visualizations.

### Key Capabilities

- **Real-time Data**: Fetch sales data directly from Supabase
- **Interactive Visualizations**: Multiple chart types (bar, line, pie)
- **Key Performance Indicators**: Dashboard KPI cards for quick insights
- **Responsive Design**: Works seamlessly across devices
- **Fast Performance**: Optimized React components with Vite bundling

---

## ✨ Features

### 📈 Dashboard Components

1. **KPI Cards**
   - Total Sales Amount
   - Total Orders
   - Average Order Value
   - Quick snapshot metrics with formatted currency display

2. **Sales by Product Line (Bar Chart)**
   - Visualizes sales distribution across different product lines
   - Interactive legend for category filtering
   - Currency-formatted values

3. **Monthly Sales Trend (Line Chart)**
   - Tracks sales performance over months
   - Identifies seasonal patterns and trends
   - Multiple data point visualization

4. **Deal Size Distribution (Pie Chart)**
   - Shows proportion of Small, Medium, and Large deals
   - Percentage-based breakdown
   - Visual representation of business mix

### 🎨 User Experience Features

- Clean, modern UI with responsive design
- Loading states during data fetching
- Error handling with user-friendly messages
- Currency formatting for all monetary values
- Real-time data synchronization

---

## 🛠 Tech Stack

### Frontend

| Technology          | Purpose                    | Version  |
| ------------------- | -------------------------- | -------- |
| **React**           | UI Library                 | ^19.2.4  |
| **Vite**            | Build Tool & Dev Server    | ^8.0.1   |
| **Chart.js**        | Charting Library           | ^4.5.1   |
| **React-ChartJS-2** | React Wrapper for Chart.js | ^5.3.1   |
| **Supabase JS**     | Backend as a Service       | ^2.101.1 |

### Backend

| Technology     | Purpose                   |
| -------------- | ------------------------- |
| **Supabase**   | PostgreSQL Database & API |
| **PostgreSQL** | Relational Database       |

### Data Processing

| Technology | Purpose                 |
| ---------- | ----------------------- |
| **Python** | Data Processing Scripts |
| **Pandas** | Data Manipulation       |
| **CSV**    | Data Format             |

### Development Tools

| Tool       | Purpose                |
| ---------- | ---------------------- |
| **ESLint** | Code Quality & Linting |
| **Git**    | Version Control        |

---

## 📁 Project Structure

```
DataInsights_Sales_Dashboard/
│
├── frontend/                          # React/Vite Application
│   ├── src/
│   │   ├── components/               # Reusable React Components
│   │   │   ├── DealSizePieChart.jsx  # Deal size distribution chart
│   │   │   ├── KpiCard.jsx           # KPI card component
│   │   │   ├── MonthlyLineChart.jsx  # Monthly sales trend chart
│   │   │   └── SalesBarChart.jsx     # Sales by product line chart
│   │   ├── App.jsx                   # Main application component
│   │   ├── supabaseClient.js         # Supabase configuration
│   │   ├── main.jsx                  # Entry point
│   │   ├── App.css                   # Application styles
│   │   └── index.css                 # Global styles
│   ├── public/                        # Static assets
│   ├── index.html                    # HTML template
│   ├── package.json                  # Dependencies & scripts
│   ├── vite.config.js                # Vite configuration
│   └── eslint.config.js              # ESLint configuration
│
├── scripts/                           # Data Processing Scripts
│   ├── clean_data_for_supabase.py   # Initial data cleaning (CSV selection)
│   └── final_clean_data.py          # Advanced cleaning (normalization, outlier removal)
│
├── dataset/                           # Data Files
│   ├── raw_sales.csv                # Original unprocessed data
│   ├── cleaned_for_supabase.csv     # After initial cleaning
│   └── cleaned_sales.csv             # After advanced cleaning
│
├── docs/                              # Documentation (optional)
│
├── screenshots/                       # UI screenshots
│
├── .git/                              # Git version control
│
└── README.md                          # Project documentation

```

---

## 📋 Prerequisites

Before setting up this project, ensure you have the following installed:

### Required Software

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) - Verify with `npm -v`
- **Python** (v3.7 or higher) - [Download](https://www.python.org/) (optional, for data processing)
- **Git** - [Download](https://git-scm.com/)

### Accounts & Services

- **Supabase Account** - [Sign up free](https://supabase.com/)
- **GitHub Account** (optional, for version control)

### Verification Commands

```bash
# Check Node.js version
node --version
# Output should be v16+

# Check npm version
npm --version
# Output should be 7+

# Check Python version (if using data processing scripts)
python --version
# Output should be 3.7+
```

---

## 🚀 Local Setup & Installation

### Step 1: Clone the Repository

```bash
git clone https://github.com/yourusername/DataInsights_Sales_Dashboard.git
cd DataInsights_Sales_Dashboard
```

### Step 2: Install Frontend Dependencies

Navigate to the frontend directory and install npm dependencies:

```bash
cd frontend
npm install
```

This will install:

- React and React DOM
- Vite (build tool)
- Chart.js and React-ChartJS-2
- Supabase JavaScript client
- ESLint and development tools

### Step 3: Setup Python Environment (For Data Processing)

If you plan to process data using the provided Python scripts:

```bash
# Create a virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install required packages
pip install pandas
```

### Step 4: Configure Environment Variables

Create a `.env.local` file in the `frontend/` directory with your Supabase credentials:

```bash
cd frontend
# Create the environment file
touch .env.local  # macOS/Linux
# or
type nul > .env.local  # Windows
```

Then add your Supabase credentials:

```
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

**⚠️ Important**: Never commit `.env.local` to version control. It contains sensitive credentials.

---

## 🔐 Environment Configuration

### Environment Variables Explained

#### `VITE_SUPABASE_URL`

- **Description**: Your Supabase project URL
- **Where to find**: Supabase Dashboard → Settings → API → Project URL
- **Format**: `https://[project-id].supabase.co`
- **Required**: Yes

#### `VITE_SUPABASE_ANON_KEY`

- **Description**: Anonymous/Public API key for client-side requests
- **Where to find**: Supabase Dashboard → Settings → API → anon public key
- **Format**: Long alphanumeric string
- **Required**: Yes
- **Note**: Safe to expose in client-side code; use Row-Level Security (RLS) for data protection

### Why Vite Prefix?

Variables prefixed with `VITE_` are automatically exposed to the client-side code during build time. Other variables remain private.

### .env.local Structure

```
# Supabase Configuration
VITE_SUPABASE_URL=https://yourproject.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Optional: Additional configuration
# VITE_API_TIMEOUT=30000
```

---

## 🗄️ Supabase Setup

### Step 1: Create a Supabase Project

1. Go to [Supabase](https://supabase.com/)
2. Click "Sign In" (or sign up if new)
3. Click "New Project"
4. Fill in project details:
   - **Name**: `sales-dashboard` (or your choice)
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose closest to your location
5. Click "Create new project" and wait for initialization (2-5 minutes)

### Step 2: Get Your API Credentials

1. In Supabase Dashboard, go to **Settings** → **API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
3. Store these in `.env.local`

### Step 3: Create Database Table

1. Go to **SQL Editor** in Supabase Dashboard
2. Click **New Query**
3. Paste and run this SQL to create the sales table:

```sql
CREATE TABLE public.sales (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    ordernumber TEXT,
    quantityordered INTEGER,
    priceeach DECIMAL(10, 2),
    sales DECIMAL(12, 2),
    orderdate DATE,
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

-- Create index for faster queries
CREATE INDEX idx_sales_orderdate ON public.sales(orderdate);
CREATE INDEX idx_sales_productline ON public.sales(productline);
```

4. Click **Run** to execute the query

### Step 4: Set Row-Level Security (RLS) - Optional but Recommended

1. Go to **Authentication** → **Policies**
2. Select the `sales` table
3. Click **New Policy** → **For queries**
4. Select **USING expression**: `true`
   - This allows public read-only access
5. Click **Review** → **Save**

### Step 5: Load Data into Supabase

See the [Data Loading Guide](#data-loading-guide) section below for detailed instructions.

---

## 📊 Data Loading Guide

### Data Source Information

The project includes sales data with the following columns:

| Column            | Type    | Description                      |
| ----------------- | ------- | -------------------------------- |
| `ordernumber`     | TEXT    | Unique order identifier          |
| `quantityordered` | INTEGER | Number of items ordered          |
| `priceeach`       | DECIMAL | Price per unit                   |
| `sales`           | DECIMAL | Total sales amount               |
| `orderdate`       | DATE    | Order date                       |
| `status`          | TEXT    | Order status                     |
| `qtr_id`          | INTEGER | Quarter ID (1-4)                 |
| `month_id`        | INTEGER | Month ID (1-12)                  |
| `year_id`         | INTEGER | Year                             |
| `productline`     | TEXT    | Product category                 |
| `customername`    | TEXT    | Customer name                    |
| `country`         | TEXT    | Customer country                 |
| `territory`       | TEXT    | Sales territory                  |
| `dealsize`        | TEXT    | Deal size (Small, Medium, Large) |

### Data Processing Workflow

The project includes two Python scripts for data processing:

#### Script 1: `clean_data_for_supabase.py`

**Purpose**: Initial data cleaning and column selection

```python
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
```

**What it does**:

- ✅ Loads raw CSV data
- ✅ Selects relevant columns
- ✅ Normalizes column names to lowercase
- ✅ Exports intermediate cleaned dataset

**Input**: `dataset/raw_sales.csv`
**Output**: `dataset/cleaned_for_supabase.csv`

#### Script 2: `final_clean_data.py`

**Purpose**: Advanced data cleaning, normalization, and outlier removal

```python
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
```

**What it does**:

- ✅ Removes null values
- ✅ Converts dates to proper datetime format
- ✅ Normalizes sales values (z-score normalization)
- ✅ Removes statistical outliers (IQR method)
- ✅ Exports final cleaned dataset

**Input**: `dataset/cleaned_for_supabase.csv`
**Output**: `dataset/cleaned_sales.csv`

### Data Loading Process

#### Option A: Using Python Scripts (Recommended)

1. **Ensure you have the raw data file**

   ```bash
   # Place raw_sales.csv in the dataset folder
   cp /path/to/raw_sales.csv dataset/raw_sales.csv
   ```

2. **Activate Python virtual environment**

   ```bash
   # Windows
   venv\Scripts\activate
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Run the cleaning scripts**

   ```bash
   cd scripts

   # First cleaning pass
   python clean_data_for_supabase.py

   # Advanced cleaning (optional but recommended)
   python final_clean_data.py
   ```

4. **Upload to Supabase**
   - Using Supabase Dashboard:
     1. Go to the `sales` table
     2. Click **Insert** → **Import data**
     3. Select `dataset/cleaned_sales.csv`
     4. Map columns to table fields
     5. Click **Import**

   - Or use Python with Supabase client:

     ```python
     import pandas as pd
     from supabase import create_client, Client

     url = "your_supabase_url"
     key = "your_supabase_key"
     supabase: Client = create_client(url, key)

     df = pd.read_csv("dataset/cleaned_sales.csv")
     data = df.to_dict('records')

     response = supabase.table("sales").insert(data).execute()
     print(f"Inserted {len(response.data)} records")
     ```

#### Option B: Manual CSV Upload

1. Prepare your data (CSV format with required columns)
2. Go to Supabase Dashboard → **SQL Editor**
3. Run:
   ```sql
   COPY public.sales(ordernumber, quantityordered, priceeach, sales,
                     orderdate, status, qtr_id, month_id, year_id,
                     productline, customername, country, territory, dealsize)
   FROM '/path/to/your/file.csv'
   WITH (FORMAT csv, HEADER true, DELIMITER ',');
   ```

#### Option C: Using Supabase UI

1. In Supabase Dashboard, go to **Table Editor**
2. Select the `sales` table
3. Click **Insert** button
4. Click **Insert row**
5. Fill in the data manually (suitable for small datasets)

### Verifying Data Load

After uploading data, verify it in Supabase:

```bash
# In Supabase Dashboard → SQL Editor, run:
SELECT COUNT(*) as total_records FROM public.sales;
SELECT * FROM public.sales LIMIT 5;
```

---

## 🏃 Running the Application

### Development Mode

Start the development server with hot-reload:

```bash
cd frontend
npm run dev
```

**Expected output**:

```
  VITE v8.0.1  ready in 456 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

Open your browser and navigate to `http://localhost:5173/`

### Features in Development Mode

- 🔥 **Hot Module Replacement (HMR)**: Changes automatically reload
- 🐛 **Enhanced debugging**: Full stack traces
- ⚡ **Fast refresh**: Only changed modules are reloaded

### Accessing the Dashboard

Once the server is running:

1. **Open browser**: Navigate to `http://localhost:5173/`
2. **Check loading state**: Initially shows "Loading..." while fetching data
3. **View charts**: Multiple visualizations appear once data loads
4. **Interact**: Charts are interactive - hover for details, click legend items

### Stopping the Server

Press `Ctrl+C` in your terminal to stop the development server

---

## 🏗️ Building for Production

### Step 1: Create Production Build

```bash
cd frontend
npm run build
```

**Output structure**:

```
frontend/dist/
├── index.html          # Production HTML
├── assets/
│   ├── index-xxxxx.js  # Minified JavaScript
│   └── index-xxxxx.css # Minified CSS
└── vite.svg            # Static assets
```

### Step 2: Preview Build Locally

Test your production build before deploying:

```bash
npm run preview
```

Navigate to `http://localhost:4173/` to view

### Step 3: Deploy

#### Option A: Deploy to Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Option B: Deploy to Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod --dir=frontend/dist
```

#### Option C: Deploy to GitHub Pages

1. Update `vite.config.js`:

   ```js
   export default {
     base: "/DataInsights_Sales_Dashboard/",
     // ... rest of config
   };
   ```

2. Deploy:
   ```bash
   npm run build
   git add dist
   git commit -m "Production build"
   git push origin main
   ```

### Build Optimization

The build process automatically:

- ✅ Minifies JavaScript and CSS
- ✅ Creates optimized chunks
- ✅ Generates source maps (optional)
- ✅ Compresses assets
- ✅ Optimizes bundle size

**Check bundle size**:

```bash
npm run build -- --mode analyze
```

---

## 🏛️ Project Architecture

### Application Flow

```
┌─────────────────────────────────────────┐
│      User Opens Dashboard               │
│    (http://localhost:5173/)             │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│    React App Initializes (App.jsx)      │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   useEffect Hook Triggers (page load)   │
│      Calls fetchData() function         │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Supabase Query Executed               │
│   SELECT * FROM sales                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Data Fetched & State Updated          │
│   setSalesData(data)                    │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   Components Render with Data           │
│   ├─ KpiCard (4 cards)                  │
│   ├─ SalesBarChart                      │
│   ├─ MonthlyLineChart                   │
│   └─ DealSizePieChart                   │
└──────────────┬──────────────────────────┘
               │
               ▼
┌─────────────────────────────────────────┐
│   User Views Interactive Dashboard      │
│   Can hover/click charts for details    │
└─────────────────────────────────────────┘
```

### Component Hierarchy

```
App.jsx (Main Container)
│
├─── KpiCard.jsx (4 instances)
│    ├─ Currency Formatter
│    └─ Number Formatter
│
├─── SalesBarChart.jsx
│    └─ Chart.js Bar Chart
│
├─── MonthlyLineChart.jsx
│    └─ Chart.js Line Chart
│
└─── DealSizePieChart.jsx
     └─ Chart.js Pie Chart
```

### Data Flow

```
Supabase Database
       ▲
       │ (SELECT * FROM sales)
       │
Supabase Client (supabaseClient.js)
       ▲
       │ (data)
       │
App.jsx State (salesData)
       │
       ├──► KpiCard (calculates aggregations)
       ├──► SalesBarChart (aggregates by productline)
       ├──► MonthlyLineChart (aggregates by month)
       └──► DealSizePieChart (groups by dealsize)
```

### Key Components

#### **App.jsx** - Main Application

- Fetches data from Supabase on mount
- Manages loading and error states
- Calculates KPI values
- Renders all chart components
- Handles currency formatting

#### **KpiCard.jsx** - Key Performance Indicator Cards

- Displays metric name and value
- Formatted currency display
- Responsive grid layout

#### **SalesBarChart.jsx** - Product Line Sales Analysis

- Bar chart showing sales by product line
- Interactive legend
- Formatted axis labels

#### **MonthlyLineChart.jsx** - Sales Trend Analysis

- Line chart showing monthly trends
- Multiple data points
- Trend visualization

#### **DealSizePieChart.jsx** - Deal Distribution

- Pie chart showing deal size proportions
- Percentage breakdown
- Visual proportion representation

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Issue 1: "Missing Supabase environment variables"

**Error Message**:

```
Error: Missing Supabase environment variables.
Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
```

**Solutions**:

1. ✅ Create `.env.local` file in `frontend/` directory
2. ✅ Add both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
3. ✅ Restart dev server: `npm run dev`
4. ✅ Verify credentials in Supabase Dashboard → Settings → API

**Verification**:

```bash
# Check if .env.local exists
ls -la frontend/.env.local  # macOS/Linux
dir frontend\.env.local     # Windows

# Verify file contents (check for typos)
cat frontend/.env.local
```

---

#### Issue 2: "Cannot find module 'react'"

**Error Message**:

```
Error: Cannot find module 'react'
```

**Solutions**:

1. ✅ Install dependencies: `npm install`
2. ✅ Delete `node_modules` and reinstall:
   ```bash
   rm -rf node_modules package-lock.json  # macOS/Linux
   rmdir /s node_modules                   # Windows
   npm install
   ```
3. ✅ Check Node version: `node --version` (should be v16+)

---

#### Issue 3: "Dashboard shows 'Loading...' indefinitely"

**Causes**:

- Data not loaded in Supabase
- Connection issues
- Invalid credentials

**Solutions**:

1. ✅ **Verify Supabase connection**:

   ```bash
   # In browser console (F12 > Console):
   // Check if supabase client initialized
   fetch('your_supabase_url/rest/v1/sales?select=count')
   ```

2. ✅ **Check if table exists**:
   - Go to Supabase Dashboard → Table Editor
   - Verify `sales` table exists
   - Verify it has data: `SELECT COUNT(*) FROM sales;`

3. ✅ **Check API credentials**:
   - Verify `.env.local` has correct credentials
   - Compare with Supabase Dashboard → Settings → API

4. ✅ **Check browser console**:
   - Press `F12` to open Developer Tools
   - Go to **Console** tab
   - Look for error messages
   - Check **Network** tab for failed requests

---

#### Issue 4: "Charts not displaying data"

**Causes**:

- Data structure mismatch
- Empty dataset
- Component errors

**Solutions**:

1. ✅ Check data in Supabase:

   ```sql
   SELECT * FROM public.sales LIMIT 10;
   ```

2. ✅ Verify data format matches expected columns:

   ```bash
   # Expected columns: ordernumber, quantityordered, priceeach,
   # sales, orderdate, status, qtr_id, month_id, year_id,
   # productline, customername, country, territory, dealsize
   ```

3. ✅ Check component logs:
   ```javascript
   // Add this to App.jsx to debug
   console.log("Sales data:", salesData);
   console.log("Data length:", salesData.length);
   ```

---

#### Issue 5: "CORS or Network Errors"

**Error Message**:

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions**:

1. ✅ Verify Supabase project is public:
   - Supabase Dashboard → Settings → API → RLS disabled for testing

2. ✅ Add CORS headers (if using custom API):

   ```python
   # Python Flask example
   from flask_cors import CORS
   CORS(app)
   ```

3. ✅ Check firewall/network settings

---

#### Issue 6: "npm install hangs or fails"

**Solutions**:

1. ✅ Clear npm cache:

   ```bash
   npm cache clean --force
   npm install
   ```

2. ✅ Use different registry:

   ```bash
   npm install --registry https://registry.npmmirror.com
   ```

3. ✅ Check internet connection and try again

---

#### Issue 7: "Port 5173 already in use"

**Error Message**:

```
Port 5173 is already in use
```

**Solutions**:

1. ✅ Kill existing process:

   ```bash
   # macOS/Linux
   lsof -i :5173
   kill -9 <PID>

   # Windows (PowerShell)
   netstat -ano | findstr :5173
   taskkill /PID <PID> /F
   ```

2. ✅ Use different port:
   ```bash
   npm run dev -- --port 3000
   ```

---

#### Issue 8: "Python script errors during data cleaning"

**Error Message**: Various pandas/encoding errors

**Solutions**:

1. ✅ Verify Python packages installed:

   ```bash
   pip list
   # Should show: pandas
   ```

2. ✅ Check file encoding:

   ```bash
   file dataset/raw_sales.csv
   ```

3. ✅ Run with error handling:
   ```python
   import pandas as pd
   try:
       df = pd.read_csv("dataset/raw_sales.csv", encoding='latin1')
       print(f"Successfully loaded {len(df)} rows")
   except Exception as e:
       print(f"Error: {e}")
   ```

---

### Getting Help

If issues persist:

1. **Check logs**:
   - Browser Console: `F12` → Console tab
   - Terminal output during `npm run dev`
   - Supabase Dashboard → Logs

2. **Verify setup**:
   - Run setup commands again
   - Check all environment variables
   - Verify file permissions

3. **Search existing issues**:
   - GitHub Issues (if public repo)
   - Stack Overflow with error message
   - Supabase Docs & Community

4. **Create detailed bug report**:
   - Steps to reproduce
   - Error messages (with full text)
   - Environment info (Node version, OS, etc.)
   - Console logs

---

## 📝 Important Notes

### Security Considerations

⚠️ **Environment Variables**

- Never commit `.env.local` to git
- Add `.env.local` to `.gitignore`
- Keep credentials confidential
- Rotate keys periodically

✅ **Best Practices**

- Use Row-Level Security (RLS) in Supabase
- Implement authentication for production
- Use service role key only on backend
- Audit data access regularly

### Data Handling

📊 **Data Processing**

- Scripts use z-score normalization
- Outliers removed using IQR method (1.5 × IQR)
- Null values dropped
- Dates converted to datetime format

💾 **Backup**

- Keep original data backed up
- Version control cleaned datasets
- Document any transformations

### Performance Tips

⚡ **Optimization**

- Queries are optimized with indexes
- Charts use efficient rendering
- Data loaded once on mount
- Consider pagination for large datasets (>10k rows)

### Future Enhancements

🚀 **Potential Features**

- User authentication
- Data filtering/search
- Export to PDF/Excel
- Custom date range selection
- Real-time data refresh
- Admin dashboard
- Multiple datasets support

---

## 🤝 Contributing

### Contribution Guidelines

1. **Fork the repository**

   ```bash
   git clone https://github.com/yourusername/DataInsights_Sales_Dashboard.git
   cd DataInsights_Sales_Dashboard
   ```

2. **Create feature branch**

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make changes and commit**

   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

4. **Push and create Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style

- Follow ESLint rules: `npm run lint`
- Use meaningful variable names
- Add comments for complex logic
- Format code consistently

### Commit Convention

```
feat: add new feature
fix: fix bug
docs: update documentation
style: format code
refactor: reorganize code
test: add tests
```

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👨‍💼 Author

DataInsights Sales Dashboard

For questions or support, please open an issue in the repository.

---

## 🔗 Resources

### Official Documentation

- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Supabase Docs](https://supabase.com/docs)
- [Chart.js Docs](https://www.chartjs.org/)
- [Pandas Docs](https://pandas.pydata.org/)

### Tutorials & Guides

- [React Getting Started](https://react.dev/learn)
- [Vite Deployment Guides](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Setup Guide](https://supabase.com/docs/guides/getting-started)

### Tools & Utilities

- [VS Code](https://code.visualstudio.com/) - Code editor
- [GitHub Desktop](https://desktop.github.com/) - Git GUI
- [Postman](https://www.postman.com/) - API testing

---

**Project Version**: 1.0.0
