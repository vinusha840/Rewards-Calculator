# Rewards Calculator — React JS

A small assessment app with a responsive rewards dashboard, customer totals, and transaction history.

## Run locally

Requires Node.js 20.19+ (or 22.12+).

```bash
npm install
npm run dev
```

Open the localhost URL printed by Vite (normally http://localhost:5173).

## Run tests

```bash
npm test
npm run build
```

## Reward rule

Each transaction earns 1 point per dollar over $50 up to $100, plus 2 points per dollar over $100. A $120 purchase earns 90 points. Monthly and overall totals are calculated separately for each customer.

## Structure

- `src/App.jsx` — dashboard, search, month filtering
- `src/styles.css` — responsive styling
- `src/data.js` — sample dataset and asynchronous API simulation
- `src/rewards.js` — reward calculation and aggregation
- `tests/rewards.test.js` — tests

Built in React JavaScript, without TypeScript or Redux.
