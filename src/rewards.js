/**
 * Reward calculation is applied to EACH purchase independently.
 * $0–$50: 0 pts/dollar; >$50–$100: 1 pt/dollar;
 * >$100: 2 pts/dollar. Example $120 = 50 + (20 * 2) = 90.
 * Money is rounded to integer cents to avoid floating-point surprises.
 */
export function calculateRewardPoints(amount) {
  if (typeof amount !== 'number' || !Number.isFinite(amount) || amount < 0) {
    throw new RangeError('Transaction amount must be a non-negative finite number.');
  }
  const cents = Math.round(amount * 100);
  const middleCents = Math.max(0, Math.min(cents - 5000, 5000));
  const upperCents = Math.max(0, cents - 10000);
  return Math.round((middleCents + 2 * upperCents) / 100);
}

export function summarizeRewards(customers, transactions, months) {
  const monthKeys = new Set(months.map((month) => month.key));
  const records = new Map(customers.map((customer) => [customer.id, {
    ...customer,
    monthPoints: Object.fromEntries(months.map(({ key }) => [key, 0])),
    totalPoints: 0,
    spent: 0,
    purchases: 0,
  }]));

  const enrichedTransactions = transactions.map((transaction) => {
    const points = calculateRewardPoints(transaction.amount);
    const customer = records.get(transaction.customerId);
    const month = transaction.date.slice(0, 7);
    if (customer && monthKeys.has(month)) {
      customer.monthPoints[month] += points;
      customer.totalPoints += points;
      customer.spent += transaction.amount;
      customer.purchases += 1;
    }
    return { ...transaction, points };
  });
  return { customerRows: [...records.values()], enrichedTransactions };
}
