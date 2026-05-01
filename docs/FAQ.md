# Frequently Asked Questions (FAQ)

## General Questions

### What is DataInsights Sales Dashboard?

DataInsights Sales Dashboard is a modern, interactive web application that visualizes sales data through charts and KPI cards. It helps businesses understand their sales performance with real-time data from a Supabase database.

### What are the main features?

- **KPI Cards**: Display key metrics like total sales, order count, and average order value
- **Sales Bar Chart**: Shows sales distribution by product line
- **Monthly Line Chart**: Visualizes sales trends over months
- **Pie Chart**: Shows deal size distribution
- **Real-time Data**: Fetches data directly from Supabase
- **Responsive Design**: Works on desktop, tablet, and mobile

### Who should use this project?

- Sales analysts
- Business intelligence professionals
- Organizations wanting a customizable dashboard
- Developers learning React, Vite, and Supabase
- Teams needing to visualize sales metrics

### Is this production-ready?

The dashboard is feature-complete and can be deployed to production. However, for enterprise use, consider:

- Adding user authentication
- Implementing more granular data security
- Setting up monitoring and error tracking
- Adding data backup procedures

---

## Installation & Setup

### Do I need to install anything besides Node.js?

For the frontend, only Node.js is required. For data processing scripts, Python is optional but recommended.

**Required**:

- Node.js (v16+)

**Optional**:

- Python (for data cleaning scripts)
- Git (for version control)

### How long does installation take?

Typically 5-10 minutes:

- Clone repo: 1 min
- Install dependencies: 3-5 min
- Setup Supabase: 2-5 min
- Configure environment: 2-3 min

### Can I run this on Windows/Mac/Linux?

Yes! The project is cross-platform. All commands work on:

- Windows (PowerShell, CMD)
- macOS (Terminal)
- Linux (any terminal)

### What if npm install fails?

Common solutions:

```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json  # macOS/Linux
rmdir /s node_modules                   # Windows

# Reinstall
npm install

# If still failing, try different registry
npm install --registry https://registry.npmmirror.com
```

---

## Supabase & Database

### What is Supabase?

Supabase is a Firebase alternative that provides:

- PostgreSQL database hosting
- Real-time APIs
- Authentication (optional)
- File storage (optional)
- Row-level security

### Is Supabase free?

Yes! Supabase offers a free tier with:

- Up to 500MB database storage
- 2GB file storage
- 50,000 monthly active users
- 10 concurrent connections

Upgrade anytime for higher limits.

### How do I get my Supabase credentials?

1. Create account at supabase.com
2. Create new project
3. Go to Settings → API
4. Copy:
   - Project URL → `VITE_SUPABASE_URL`
   - anon public key → `VITE_SUPABASE_ANON_KEY`

### Can I use a different database?

Currently, the application is designed for Supabase. To use a different database:

1. Create equivalent `sales` table
2. Expose REST API
3. Update `supabaseClient.js` to use your API
4. Adjust queries if needed

### How do I backup my data?

Option 1 - Automatic (Supabase):

- Dashboard → Backups
- Select backup point
- Click "Restore"

Option 2 - Manual Export:

```bash
# Export as CSV
# In Supabase: SQL Editor → COPY query to CSV
# Or use Python script

import pandas as pd
from supabase import create_client

supabase = create_client(url, key)
data = supabase.table('sales').select('*').execute()
df = pd.DataFrame(data.data)
df.to_csv('backup.csv', index=False)
```

---

## Running & Deployment

### How do I start the development server?

```bash
cd frontend
npm run dev
```

Then open http://localhost:5173/ in your browser.

### What if port 5173 is already in use?

```bash
# Use different port
npm run dev -- --port 3000

# Or kill the process using port 5173
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9  # macOS/Linux

# Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173).OwningProcess | Stop-Process
```

### How do I deploy to production?

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions. Quick version:

```bash
# Build
npm run build

# Deploy to Vercel (recommended)
vercel --prod

# Or Netlify
netlify deploy --prod --dir=frontend/dist
```

### How do I update the application?

```bash
# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Restart dev server
npm run dev
```

### Can I run multiple instances?

Yes! You can:

- Deploy to multiple platforms
- Run on multiple servers
- Create multiple Supabase projects
- Use different environment variables per instance

---

## Data & Queries

### How do I load data into Supabase?

Three methods:

**Method 1: Via Supabase Dashboard**

1. Go to Table Editor → sales table
2. Click **Insert** → **Import data**
3. Select CSV file
4. Confirm import

**Method 2: Via Python**

```python
import pandas as pd
from supabase import create_client

supabase = create_client(url, key)
df = pd.read_csv('data.csv')
data = df.to_dict('records')
supabase.table('sales').insert(data).execute()
```

**Method 3: Via SQL**

```sql
COPY public.sales FROM '/path/to/file.csv' WITH (FORMAT csv, HEADER);
```

### What data format does the dashboard expect?

CSV with these columns:

```
ordernumber, quantityordered, priceeach, sales, orderdate, status,
qtr_id, month_id, year_id, productline, customername, country,
territory, dealsize
```

### Can I modify the data?

Yes, but note:

- Changes in Supabase are reflected immediately in dashboard
- The application is read-only (no edit UI)
- To add edit functionality, you'll need to:
  1. Create a form component
  2. Update Supabase with new data
  3. Refresh dashboard state

### How often is data updated?

By default, data is fetched once when the dashboard loads. To implement real-time updates:

```javascript
// In App.jsx
useEffect(() => {
  // Subscribe to changes
  supabase
    .from("sales")
    .on("*", (payload) => {
      // Refresh data on any change
      fetchData();
    })
    .subscribe();
}, []);
```

### How do I filter or search data?

Currently, all data is fetched and visualized. To add filtering:

1. Add state for filters
2. Add UI controls (dropdown, search box)
3. Filter data before passing to charts
4. Or query Supabase with filters (see [API_REFERENCE.md](API_REFERENCE.md))

---

## Performance & Optimization

### Dashboard is slow. How do I speed it up?

1. **Reduce data size**:

   ```sql
   -- Keep only recent data in main table
   DELETE FROM sales WHERE orderdate < '2020-01-01';
   -- Or archive to separate table
   ```

2. **Add indexes**:

   ```sql
   CREATE INDEX idx_sales_date ON sales(orderdate);
   CREATE INDEX idx_sales_product ON sales(productline);
   ```

3. **Optimize queries**:
   - Fetch only needed columns
   - Filter at database level
   - Use pagination

4. **Check bundle size**:
   ```bash
   npm run build
   # Check dist/ folder size
   ```

### How do I check performance?

```bash
# Browser DevTools
# 1. Open F12
# 2. Go to Performance tab
# 3. Record page load
# 4. Analyze results

# Or use Lighthouse
# 1. DevTools → Lighthouse
# 2. Run audit
# 3. Review recommendations
```

### Can I cache data?

Yes:

```javascript
const cache = new Map();

async function getCachedData(key, fn) {
  if (cache.has(key)) return cache.get(key);
  const data = await fn();
  cache.set(key, data);

  // Clear after 5 minutes
  setTimeout(() => cache.delete(key), 5 * 60 * 1000);
  return data;
}
```

---

## Customization

### How do I change colors?

Edit `frontend/src/App.css` and component CSS files:

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
  --danger-color: #ef4444;
}
```

Or edit Chart.js configuration in each component:

```javascript
const options = {
  plugins: {
    legend: {
      labels: {
        color: "#3b82f6", // Change legend color
      },
    },
  },
};
```

### How do I add new charts?

1. Create new component in `src/components/`:

   ```javascript
   // src/components/NewChart.jsx
   import React, { useMemo } from "react";

   function NewChart({ data }) {
     // Your chart logic
     return <div>{/* Chart */}</div>;
   }

   export default NewChart;
   ```

2. Import in `App.jsx`:

   ```javascript
   import NewChart from "./components/NewChart";
   ```

3. Add to render:
   ```javascript
   <NewChart data={salesData} />
   ```

### How do I add more metrics (KPIs)?

In `App.jsx`, add more KPI Cards:

```javascript
<KpiCard
  title="Total Customers"
  value={numberFormatter.format(
    new Set(salesData.map((d) => d.customername)).size,
  )}
  prefix=""
/>
```

### Can I add authentication?

Yes! Add Supabase Auth:

```javascript
// In App.jsx or separate Auth component
const {
  data: { session },
} = await supabase.auth.getSession();

if (!session) {
  // Show login form
}
```

See [Supabase Auth Docs](https://supabase.com/docs/guides/auth)

---

## Troubleshooting

### Dashboard shows "Loading..." forever

**Causes**: Data not loaded, connection issue, or error

**Solutions**:

1. Open browser console (F12)
2. Check for error messages
3. Verify Supabase credentials in `.env.local`
4. Run in Supabase: `SELECT COUNT(*) FROM sales;`
5. Check network tab for failed requests

### "Cannot find module 'react'" error

```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Charts not displaying

**Check**:

1. Data loaded? (See dashboard "Loading" issue)
2. Console errors? (F12 → Console tab)
3. Data structure correct? (See data format section)

**Fix**:

```javascript
// Add debugging to App.jsx
console.log("Sales data:", salesData);
console.log("Data length:", salesData.length);
```

### CORS or Network errors

**Solutions**:

1. Verify Supabase URL (no typos)
2. Check API key is correct
3. Verify table permissions
4. Try accessing Supabase API directly in browser:
   ```javascript
   fetch("https://yourproject.supabase.co/rest/v1/sales", {
     headers: { apikey: "your-key" },
   })
     .then((r) => r.json())
     .then(console.log);
   ```

### Environment variables not working

**Check**:

1. File is `.env.local` (not `.env`)
2. Located in `frontend/` directory
3. Variables prefixed with `VITE_`
4. Restarted dev server after changes
5. No spaces around `=` sign

### Port already in use

```bash
# Find and kill process
lsof -i :5173 | grep LISTEN | awk '{print $2}' | xargs kill -9

# Or use different port
npm run dev -- --port 3000
```

---

## Contributing & Support

### How do I contribute?

See [CONTRIBUTING.md](CONTRIBUTING.md) for detailed guidelines.

Quick summary:

1. Fork repository
2. Create feature branch
3. Make changes
4. Submit pull request

### How do I report bugs?

Create an issue on GitHub with:

- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Error messages
- Environment info

### How do I request features?

Open a GitHub issue with:

- Clear feature description
- Use case/motivation
- Proposed implementation (optional)
- Screenshots/examples (if applicable)

### How do I get help?

1. Check this FAQ
2. Search existing issues/PRs
3. Read documentation files
4. Ask in GitHub discussions
5. Contact maintainers

---

## Deployment Questions

### Should I use Vercel or Netlify?

Both are excellent. Quick comparison:

| Feature            | Vercel   | Netlify  |
| ------------------ | -------- | -------- |
| React/Vite support | ⭐⭐⭐   | ⭐⭐⭐   |
| Free tier          | Good     | Good     |
| Analytics          | Built-in | Optional |
| Functions          | Yes      | Yes      |
| Edge middleware    | Yes      | (Coming) |

**Recommendation**: Vercel for React apps

### How much does deployment cost?

All platforms have free tier sufficient for small-medium projects:

- **Vercel**: Free tier is generous, $20+/mo for pro
- **Netlify**: Free tier is generous, $19+/mo for pro
- **GitHub Pages**: Free forever (limited features)

### Can I use my own domain?

Yes! All platforms support custom domains:

1. Register domain (namecheap.com, godaddy.com, etc.)
2. Update DNS settings
3. Add domain in platform settings
4. SSL certificate auto-provisioned

### How do I monitor uptime?

Use services like:

- [Uptime Robot](https://uptimerobot.com/) - Free tier
- [Pingdom](https://www.pingdom.com/)
- Platform-provided analytics

---

## Security Questions

### Are my credentials safe?

- ✅ `.env.local` is git-ignored (never committed)
- ✅ Keys only exposed to client-side (use RLS in Supabase)
- ✅ No hardcoded secrets in code

- ⚠️ Client-side keys are visible (this is normal for SPAs)
- ⚠️ Protect sensitive operations with RLS

### How do I rotate API keys?

```bash
# In Supabase Dashboard
# Settings → API → Click rotate icon
# Copy new key
# Update .env.local and deployment settings
```

### Should I use Row-Level Security (RLS)?

**Yes!** RLS ensures only authorized data is returned:

```sql
-- Example: Users can only see their own data
CREATE POLICY "Users see own data" ON sales
  FOR SELECT USING (auth.uid() = user_id);
```

See [DATABASE.md](DATABASE.md#row-level-security-rls)

---

## Still Have Questions?

- 📖 Check all documentation files
- 🔍 Search GitHub issues
- 💬 Open a discussion
- 📧 Contact maintainers

**Documentation Files**:

- [README.md](../README.md) - Main documentation
- [SETUP.md](SETUP.md) - Installation guide
- [DATABASE.md](DATABASE.md) - Database design
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [API_REFERENCE.md](API_REFERENCE.md) - API usage
- [CONTRIBUTING.md](CONTRIBUTING.md) - Contributing guide

Last updated: May 1, 2026
