import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRewardPoints, summarizeRewards } from '../src/rewards.js';

test('Reward point boundaries and example', () => {
  for (const [amount, expected] of [[0,0],[25,0],[50,0],[75,25],[100,50],[120,90],[150,150],[200,250]]) {
    assert.equal(calculateRewardPoints(amount), expected, `${amount} should earn ${expected}`);
  }
});
test('Reject negative/invalid amounts', () => {
  for (const amount of [-1, Number.NaN, Infinity, '120']) assert.throws(() => calculateRewardPoints(amount), RangeError);
});
test('Transactions are scored individually, grouped by customer and month', () => {
  const months = [{ key: '2026-07' }, { key: '2026-08' }, { key: '2026-09' }];
  const customers = [{ id: 'a', name: 'Alice' }, { id: 'b', name: 'Bob' }];
  const transactions = [
    { id: '1', customerId: 'a', date: '2026-07-02', amount: 120 },
    { id: '2', customerId: 'a', date: '2026-07-05', amount: 75 },
    { id: '3', customerId: 'a', date: '2026-08-05', amount: 50 },
    { id: '4', customerId: 'b', date: '2026-09-05', amount: 200 },
  ];
  const { customerRows, enrichedTransactions } = summarizeRewards(customers, transactions, months);
  assert.deepEqual(enrichedTransactions.map(t => t.points), [90,25,0,250]);
  assert.deepEqual(customerRows[0].monthPoints, { '2026-07':115, '2026-08':0, '2026-09':0 });
  assert.equal(customerRows[0].totalPoints, 115);
  assert.equal(customerRows[1].totalPoints, 250);
});
