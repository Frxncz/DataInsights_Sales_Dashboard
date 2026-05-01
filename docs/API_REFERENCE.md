# API Reference & Data Queries

## Table of Contents

- [Supabase Client Setup](#supabase-client-setup)
- [Query Examples](#query-examples)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)
- [Performance Tips](#performance-tips)

---

## Supabase Client Setup

### Initialization

The application uses Supabase JavaScript client for data operations.

**File**: `frontend/src/supabaseClient.js`

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "Missing Supabase environment variables. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env",
  );
}

export const supabase = createClient(supabaseUrl, supabaseKey);
```

### Usage in Components

```javascript
import { supabase } from "./supabaseClient";

// Fetch all data
const { data, error } = await supabase.from("sales").select("*");

// Handle response
if (error) {
  console.error("Query failed:", error);
} else {
  console.log("Data:", data);
}
```

---

## Query Examples

### 1. Fetch All Sales Data

```javascript
// Basic fetch (all records)
const { data, error } = await supabase.from("sales").select("*");

// With limit
const { data, error } = await supabase.from("sales").select("*").limit(100);

// With offset (pagination)
const { data, error } = await supabase.from("sales").select("*").range(0, 99); // First 100 records
```

### 2. Filter Data

```javascript
// Filter by product line
const { data } = await supabase
  .from("sales")
  .select("*")
  .eq("productline", "Motorcycles");

// Filter by date range
const { data } = await supabase
  .from("sales")
  .select("*")
  .gte("orderdate", "2023-01-01")
  .lte("orderdate", "2023-12-31");

// Filter by deal size
const { data } = await supabase
  .from("sales")
  .select("*")
  .in("dealsize", ["Small", "Medium"]);

// Multiple filters (AND logic)
const { data } = await supabase
  .from("sales")
  .select("*")
  .eq("status", "Shipped")
  .gte("sales", 1000);

// OR filter
const { data } = await supabase
  .from("sales")
  .select("*")
  .or("dealsize.eq.Small,dealsize.eq.Medium");
```

### 3. Search Data

```javascript
// Search by text
const { data } = await supabase
  .from("sales")
  .select("*")
  .ilike("customername", "%John%"); // Case-insensitive

// Search by country
const { data } = await supabase.from("sales").select("*").eq("country", "USA");
```

### 4. Sort Data

```javascript
// Sort ascending
const { data } = await supabase
  .from("sales")
  .select("*")
  .order("orderdate", { ascending: true });

// Sort descending
const { data } = await supabase
  .from("sales")
  .select("*")
  .order("sales", { ascending: false })
  .limit(10); // Top 10 by sales
```

### 5. Select Specific Columns

```javascript
// Only certain columns
const { data } = await supabase
  .from("sales")
  .select("ordernumber, sales, orderdate, customername");

// Exclude columns
const { data } = await supabase
  .from("sales")
  .select("*")
  .select("country", { only: false }); // Exclude
```

---

## API Endpoints

### Direct REST API Calls

Supabase exposes a REST API. You can call it directly:

```javascript
const baseUrl = import.meta.env.VITE_SUPABASE_URL;
const apiKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// GET all records
fetch(`${baseUrl}/rest/v1/sales`, {
  headers: {
    apikey: apiKey,
    Authorization: `Bearer ${apiKey}`,
  },
})
  .then((r) => r.json())
  .then((data) => console.log(data));

// GET with filters
const params = new URLSearchParams({
  productline: "eq.Motorcycles",
  sales: "gte.5000",
  limit: "100",
});

fetch(`${baseUrl}/rest/v1/sales?${params}`, {
  headers: { apikey: apiKey },
})
  .then((r) => r.json())
  .then((data) => console.log(data));
```

### Query Operators

| Operator | Meaning               | Example                      |
| -------- | --------------------- | ---------------------------- |
| `eq`     | equals                | `productline.eq.Motorcycles` |
| `neq`    | not equals            | `status.neq.Cancelled`       |
| `gt`     | greater than          | `sales.gt.1000`              |
| `gte`    | greater than or equal | `sales.gte.1000`             |
| `lt`     | less than             | `sales.lt.1000`              |
| `lte`    | less than or equal    | `sales.lte.1000`             |
| `like`   | pattern match         | `name.like.%John%`           |
| `ilike`  | case-insensitive      | `name.ilike.%john%`          |
| `in`     | in list               | `dealsize.in.(Small,Medium)` |
| `is`     | is null               | `status.is.null`             |

---

## Error Handling

### Common Error Scenarios

#### 1. Missing Environment Variables

```javascript
try {
  const { data, error } = await supabase.from("sales").select("*");
  if (error) throw error;
  return data;
} catch (error) {
  console.error("Database error:", error.message);
  // Show user-friendly message
}
```

#### 2. Network Errors

```javascript
const fetchWithRetry = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      // Exponential backoff
      await new Promise((r) => setTimeout(r, Math.pow(2, i) * 1000));
    }
  }
};

// Usage
const data = await fetchWithRetry(async () => {
  const { data, error } = await supabase.from("sales").select("*");
  if (error) throw error;
  return data;
});
```

#### 3. Invalid Credentials

```javascript
// Check if credentials are set
if (!import.meta.env.VITE_SUPABASE_URL) {
  throw new Error("Missing VITE_SUPABASE_URL");
}

if (!import.meta.env.VITE_SUPABASE_ANON_KEY) {
  throw new Error("Missing VITE_SUPABASE_ANON_KEY");
}
```

#### 4. Large Response Handling

```javascript
// For large datasets, use pagination
const fetchAllData = async () => {
  let allData = [];
  let page = 0;
  const pageSize = 1000;

  while (true) {
    const { data, error } = await supabase
      .from("sales")
      .select("*")
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) throw error;
    if (data.length === 0) break;

    allData = [...allData, ...data];
    page++;
  }

  return allData;
};
```

---

## Performance Tips

### 1. Optimize Queries

```javascript
// ❌ Bad: Fetch all data then filter
const allData = await supabase.from("sales").select("*");
const filtered = allData.filter((d) => d.sales > 1000);

// ✅ Good: Filter at database level
const { data } = await supabase.from("sales").select("*").gt("sales", 1000);
```

### 2. Limit Columns

```javascript
// ❌ Bad: Fetch all columns
const { data } = await supabase.from("sales").select("*");

// ✅ Good: Only needed columns
const { data } = await supabase
  .from("sales")
  .select("ordernumber, sales, orderdate, productline");
```

### 3. Use Pagination

```javascript
// ❌ Bad: Fetch all 100k records
const { data } = await supabase.from("sales").select("*");

// ✅ Good: Paginate
const pageSize = 100;
const { data } = await supabase
  .from("sales")
  .select("*")
  .limit(pageSize)
  .range(0, pageSize - 1);
```

### 4. Cache Results

```javascript
const queryCache = new Map();

async function getCachedData(key, queryFn) {
  if (queryCache.has(key)) {
    return queryCache.get(key);
  }

  const data = await queryFn();
  queryCache.set(key, data);

  // Clear cache after 5 minutes
  setTimeout(() => queryCache.delete(key), 5 * 60 * 1000);

  return data;
}

// Usage
const data = await getCachedData("all-sales", async () => {
  const { data, error } = await supabase.from("sales").select("*");
  if (error) throw error;
  return data;
});
```

### 5. Real-time Updates (Optional)

```javascript
// Subscribe to changes
const subscription = supabase
  .from("sales")
  .on("*", (payload) => {
    console.log("Change received!", payload);
    // Update state with new data
  })
  .subscribe();

// Cleanup subscription
subscription.unsubscribe();
```

---

## Data Aggregation Examples

### Used in App.jsx

```javascript
// Calculate KPIs
const calculateKPIs = (data) => {
  return {
    totalSales: data.reduce((sum, d) => sum + d.sales, 0),
    totalOrders: data.length,
    avgOrderValue: data.reduce((sum, d) => sum + d.sales, 0) / data.length,
  };
};

// Group by product line
const groupByProductLine = (data) => {
  return data.reduce((acc, item) => {
    const line = item.productline || "Unknown";
    acc[line] = (acc[line] || 0) + item.sales;
    return acc;
  }, {});
};

// Group by month
const groupByMonth = (data) => {
  return data.reduce((acc, item) => {
    const month = new Date(item.orderdate).toLocaleString("en-US", {
      month: "long",
    });
    acc[month] = (acc[month] || 0) + item.sales;
    return acc;
  }, {});
};

// Group by deal size
const groupByDealSize = (data) => {
  return data.reduce((acc, item) => {
    const size = item.dealsize || "Unknown";
    acc[size] = (acc[size] || 0) + 1;
    return acc;
  }, {});
};
```

---

## Rate Limiting

Supabase has built-in rate limiting on the free tier:

| Tier | Requests/second | Monthly Limit    |
| ---- | --------------- | ---------------- |
| Free | 10 req/s        | Unlimited (soft) |
| Pro  | 200 req/s       | Unlimited        |

### Handle Rate Limiting

```javascript
const fetchWithRateLimit = async (fn) => {
  try {
    return await fn();
  } catch (error) {
    if (error.status === 429) {
      // Too Many Requests
      // Wait and retry
      await new Promise((r) => setTimeout(r, 2000));
      return fetchWithRateLimit(fn);
    }
    throw error;
  }
};
```

---

## SQL Queries via Supabase

For complex aggregations, use SQL directly:

```javascript
// Execute SQL query
const { data, error } = await supabase.rpc("get_sales_by_product"); // Call stored function

// Or with raw SQL (requires safe setup)
const { data, error } = await supabase
  .from("sales")
  .select("productline, sum(sales) as total")
  .group_by("productline");
```

---

## Debugging

### Enable Query Logging

```javascript
// In development only
if (import.meta.env.DEV) {
  supabase
    .from("sales")
    .on("*", (payload) => {
      console.log("Supabase event:", payload);
    })
    .subscribe();
}
```

### Monitor Network Traffic

```bash
# In browser DevTools
# 1. Open Network tab
# 2. Filter by XHR
# 3. Watch API calls to supabase.co
# 4. Check request/response payloads
```

### Test Connectivity

```javascript
// Test connection
const testConnection = async () => {
  try {
    const { data, error } = await supabase
      .from("sales")
      .select("count", { count: "exact", head: true });

    if (error) throw error;
    console.log("Connection successful!", data);
  } catch (error) {
    console.error("Connection failed:", error);
  }
};

testConnection();
```

---

## Best Practices

✅ **DO**:

- Filter at database level
- Select only needed columns
- Use pagination for large datasets
- Cache frequently accessed data
- Handle errors gracefully
- Monitor performance
- Keep credentials secure

❌ **DON'T**:

- Fetch all data then filter in JavaScript
- Use `select('*')` unless necessary
- Make multiple queries when one would do
- Store API keys in client code
- Expose database structure
- Ignore error handling
- Make unbounded queries

---

For more information, see:

- [Supabase Docs](https://supabase.com/docs)
- [README.md](../README.md)
- [DATABASE.md](DATABASE.md)
