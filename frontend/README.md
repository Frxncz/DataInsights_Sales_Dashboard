# DataInsights Frontend

React + Vite dashboard that reads sales data from Supabase.

## Setup

1. Open the terminal in `frontend`.
2. Install dependencies:

```bash
npm install
```

3. Create your env file from the example and set your values:

```bash
copy .env.example .env
```

Required keys in `.env`:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Run

```bash
npm run dev
```

If port 5173 is busy, Vite will automatically use another port (for example 5174). Open the exact URL shown in the terminal.

## Build

```bash
npm run build
```
