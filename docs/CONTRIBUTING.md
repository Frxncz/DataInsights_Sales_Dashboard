# Contributing Guide

Thank you for your interest in contributing to DataInsights Sales Dashboard! This guide will help you get started.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Standards](#code-standards)
- [Commit Guidelines](#commit-guidelines)
- [Pull Requests](#pull-requests)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)
- [Code Review Process](#code-review-process)

---

## Getting Started

### 1. Fork the Repository

```bash
# Visit GitHub and click "Fork"
# Then clone your fork
git clone https://github.com/yourusername/DataInsights_Sales_Dashboard.git
cd DataInsights_Sales_Dashboard
```

### 2. Create a Feature Branch

```bash
# Create branch from main
git checkout -b feature/your-feature-name

# Branch naming convention:
# feature/add-export-functionality
# fix/dashboard-loading-error
# docs/update-readme
# refactor/optimize-queries
```

### 3. Setup Development Environment

```bash
# Install dependencies
cd frontend
npm install

# Create .env.local
cp .env.local.example .env.local  # Or create manually
echo "VITE_SUPABASE_URL=your_url" >> .env.local
echo "VITE_SUPABASE_ANON_KEY=your_key" >> .env.local

# Start development server
npm run dev
```

---

## Development Workflow

### 1. Make Changes

```bash
# Edit files in your feature branch
# Make small, focused commits

# Check for linting errors
npm run lint

# Fix linting issues
npm run lint -- --fix
```

### 2. Test Locally

```bash
# Ensure development server runs without errors
npm run dev

# Test in browser
# 1. Open http://localhost:5173/
# 2. Verify your changes work
# 3. Check console for errors (F12)
# 4. Test on multiple browsers

# Build and preview production
npm run build
npm run preview
# Open http://localhost:4173/
```

### 3. Commit Changes

```bash
# Stage your changes
git add .

# Commit with descriptive message
git commit -m "feat: add export to CSV functionality"

# See Commit Guidelines section for format
```

### 4. Push to Your Fork

```bash
# Push to your fork
git push origin feature/your-feature-name
```

### 5. Create Pull Request

```bash
# Go to GitHub
# Click "New Pull Request"
# Select your feature branch
# Add title and description
# Submit PR
```

---

## Code Standards

### JavaScript/React

**File Structure**:

```
components/
├── ComponentName.jsx      # Main component
├── componentName.module.css  # Scoped styles (optional)
└── index.js            # Re-export (optional)
```

**Naming Convention**:

- Components: `PascalCase` (e.g., `SalesBarChart`)
- Variables/functions: `camelCase` (e.g., `calculateKPIs`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `API_TIMEOUT`)
- CSS classes: `kebab-case` (e.g., `chart-container`)

**Component Template**:

```javascript
import React, { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import "./ComponentName.css";

/**
 * ComponentName - Brief description
 * @returns {JSX.Element}
 */
function ComponentName() {
  const [state, setState] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from("sales").select("*");

      if (error) throw error;
      setState(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div className="component-name">{/* JSX here */}</div>;
}

export default ComponentName;
```

**Code Quality**:

- ✅ Use functional components with hooks
- ✅ Add error handling
- ✅ Use descriptive variable names
- ✅ Comment complex logic
- ✅ Avoid hardcoded values
- ✅ Keep functions under 50 lines
- ✅ DRY (Don't Repeat Yourself)

❌ **Avoid**:

- Hardcoded API keys or credentials
- Console.log in production code
- Nested ternary operators (> 2 levels)
- Commented-out code
- Var keyword (use let/const)

### CSS

**Best Practices**:

```css
/* Use semantic naming */
.chart-container {
  display: flex;
  gap: 1rem;
}

/* Use variables for consistency */
:root {
  --color-primary: #3b82f6;
  --spacing-unit: 0.5rem;
}

/* Mobile-first approach */
.responsive-grid {
  display: grid;
  grid-template-columns: 1fr; /* Mobile */
}

@media (min-width: 768px) {
  .responsive-grid {
    grid-template-columns: repeat(2, 1fr); /* Tablet */
  }
}

@media (min-width: 1024px) {
  .responsive-grid {
    grid-template-columns: repeat(3, 1fr); /* Desktop */
  }
}
```

### Python Data Scripts

**File Structure**:

```python
"""
Module docstring explaining purpose.
"""

import pandas as pd
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def main():
    """Main function - brief description."""
    try:
        # Load data
        df = pd.read_csv('data.csv', encoding='latin1')
        logger.info(f'Loaded {len(df)} records')

        # Process data
        df = clean_data(df)

        # Save output
        df.to_csv('cleaned_data.csv', index=False)
        logger.info('Data saved successfully')

    except Exception as e:
        logger.error(f'Error: {e}')
        raise

def clean_data(df):
    """
    Clean dataframe.

    Args:
        df (pd.DataFrame): Input dataframe

    Returns:
        pd.DataFrame: Cleaned dataframe
    """
    # Remove nulls
    df = df.dropna()
    return df

if __name__ == '__main__':
    main()
```

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, semicolons, etc)
- **refactor**: Code refactoring without feature change
- **perf**: Performance improvement
- **test**: Add or update tests
- **chore**: Build process, dependencies

### Examples

```bash
# Good commits
git commit -m "feat(dashboard): add monthly sales trend visualization"
git commit -m "fix(charts): resolve pie chart label overflow issue"
git commit -m "docs: add deployment guide to README"
git commit -m "refactor(api): optimize Supabase queries with pagination"
git commit -m "perf: reduce bundle size by 15%"

# Bad commits (avoid)
git commit -m "fixed stuff"
git commit -m "update"
git commit -m "asdfghjkl"
git commit -m "WIP: trying this out"
```

### Commit Body

If needed, explain WHY not WHAT:

```bash
git commit -m "fix: add null check before rendering chart

Previously, the chart component would crash if data was empty.
This fix adds a loading state and null checks before rendering.

Fixes #123"
```

---

## Pull Requests

### PR Checklist

Before submitting, ensure:

- [ ] Branch is up-to-date with main
- [ ] All tests pass
- [ ] Linting passes: `npm run lint`
- [ ] Changes are documented
- [ ] No console errors/warnings
- [ ] Responsive design tested
- [ ] `.env.local` not committed
- [ ] No hardcoded credentials

### PR Title Format

```
[TYPE] Short description

Examples:
[FEATURE] Add data export functionality
[FIX] Resolve dashboard loading error
[DOCS] Update API reference documentation
[REFACTOR] Optimize database queries
```

### PR Description Template

```markdown
## Description

Brief explanation of what this PR does.

## Motivation & Context

Why is this change needed? What problem does it solve?

## Type of Change

- [ ] New feature
- [ ] Bug fix
- [ ] Documentation update
- [ ] Code refactoring
- [ ] Performance improvement

## Testing

How was this tested? Steps to verify:

1. Go to...
2. Click...
3. Verify...

## Screenshots (if applicable)

Include before/after screenshots for UI changes.

## Related Issues

Closes #123

## Checklist

- [ ] Code follows style guidelines
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
```

---

## Reporting Issues

### Issue Template

```markdown
## Description

Clear description of the issue.

## Steps to Reproduce

1. Start the development server
2. Click on chart
3. Observe the error

## Expected Behavior

What should happen?

## Actual Behavior

What actually happened?

## Error Message (if applicable)
```

Error: Cannot read property 'map' of undefined
at DealSizePieChart.jsx:45

```

```

## Environment

- OS: Windows 10
- Node version: v18.12.0
- npm version: 9.2.0
- Browser: Chrome 110

## Screenshots

Attach relevant screenshots showing the issue.

````

### Issue Severity

- 🔴 **Critical**: App crashes or is completely broken
- 🟠 **High**: Major feature not working
- 🟡 **Medium**: Feature partially broken or confusing
- 🟢 **Low**: Minor issue or cosmetic problem

---

## Feature Requests

### Feature Request Template

```markdown
## Summary
What feature would you like?

## Motivation
Why would this be useful? What problem does it solve?

## Proposed Solution
How should this feature work?

## Alternatives
Are there other approaches?

## Example Use Case
Walk through a real scenario where this helps.
````

---

## Code Review Process

### What Reviewers Look For

✅ **Code Quality**:

- Does it follow project conventions?
- Is it readable and maintainable?
- Are there any obvious bugs?
- Is error handling adequate?

✅ **Functionality**:

- Does it solve the stated problem?
- Are edge cases handled?
- Is it backwards compatible?

✅ **Performance**:

- Does it introduce performance regressions?
- Are queries optimized?
- Is the bundle size acceptable?

✅ **Security**:

- No credentials exposed?
- No security vulnerabilities?
- Input properly validated?

### Responding to Feedback

- Be open to criticism
- Ask for clarification if unclear
- Explain your reasoning
- Make requested changes
- Request re-review

---

## Development Tips

### Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build          # Production build
npm run preview        # Preview production build
npm run lint           # Check linting
npm run lint -- --fix  # Auto-fix linting

# Git
git status             # Check changes
git diff               # View changes
git log --oneline      # View commits
git rebase main        # Rebase on main
git push origin -f     # Force push (use carefully!)

# Testing
npm test               # Run tests (when available)
npm run coverage       # Coverage report
```

### VS Code Extensions (Recommended)

- ESLint
- Prettier
- React Extensions Pack
- Thunder Client (API testing)
- GitLens

### Debugging

```javascript
// Use debugger in VS Code
debugger; // Execution pauses here when debug mode active

// Or use console methods
console.log("Value:", value);
console.table(arrayOfObjects);
console.error("Error:", error);
console.time("operation");
// ... code ...
console.timeEnd("operation"); // Logs elapsed time
```

---

## Project Structure

```
DataInsights_Sales_Dashboard/
├── frontend/              # React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── App.jsx       # Main app
│   │   └── main.jsx      # Entry point
│   └── package.json
├── scripts/               # Python data processing
├── dataset/               # Data files
├── docs/                  # Documentation (like this!)
└── README.md
```

---

## Resources

### Learning

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Supabase Docs](https://supabase.com/docs)
- [MDN Web Docs](https://developer.mozilla.org)

### Tools

- [VS Code](https://code.visualstudio.com)
- [Git Documentation](https://git-scm.com/doc)
- [GitHub CLI](https://cli.github.com)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what's best for the community
- Report issues responsibly

### Unacceptable Behavior

- Harassment or discrimination
- Offensive language
- Spam or self-promotion
- Sharing others' private information

---

## Questions?

- Check existing issues and PRs
- Review documentation
- Ask in comments respectfully
- Reach out to maintainers

---

Thank you for contributing! 🚀

Last updated: May 1, 2026
