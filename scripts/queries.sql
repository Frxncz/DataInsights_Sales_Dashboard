-- Analytical Queries (run in Supabase SQL Editor)
-- Table name: change if your table differs (e.g., public.cleaned_for_supabase)

-- Q1: What are the top 5 product lines by total revenue?
SELECT
  productline,
  SUM(sales) AS total_revenue
FROM public.cleaned_for_supabase
GROUP BY productline
ORDER BY total_revenue DESC
LIMIT 5;

-- Q2: What is the monthly revenue trend (by year + month)?
SELECT
  year_id,
  month_id,
  SUM(sales) AS monthly_revenue
FROM public.cleaned_for_supabase
GROUP BY year_id, month_id
ORDER BY year_id, month_id;

-- Q3: How many orders are in each deal size bucket?
SELECT
  dealsize,
  COUNT(*) AS order_count
FROM public.cleaned_for_supabase
GROUP BY dealsize
ORDER BY order_count DESC;

