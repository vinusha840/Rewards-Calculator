import { useEffect, useMemo, useState } from 'react';
import { fetchRewardsData } from './data';
import { summarizeRewards } from './rewards';
import './styles.css';

export default function App() {
  const [data, setData] = useState(null);
  const [search, setSearch] = useState('');
  const [month, setMonth] = useState('all');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRewardsData().then(setData).catch(() => setError('Unable to load transactions.'));
  }, []);

  const summary = useMemo(
    () => data ? summarizeRewards(data.customers, data.transactions, data.months) : null,
    [data]
  );

  if (error) return <p className="message">{error}</p>;
  if (!data) return <p className="message">Loading rewards...</p>;

  const { customerRows, enrichedTransactions } = summary;
  const totalPoints = customerRows.reduce((sum, row) => sum + row.totalPoints, 0);
  const totalSales = enrichedTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const filtered = customerRows.filter(row =>
    row.name.toLowerCase().includes(search.toLowerCase())
  );
  const visibleTransactions = enrichedTransactions.filter(tx =>
    (month === 'all' || tx.date.startsWith(month)) &&
    data.customers.find(c => c.id === tx.customerId)?.name.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">✦ Rewardly</div>
        <div className="nav-active">▦ &nbsp; Overview</div>
        <p className="side-note">Rewards analytics dashboard</p>
      </aside>

      <main>
        <header>
          <div>
            <p className="eyebrow">REWARDS PROGRAM</p>
            <h1>Rewards Overview</h1>
            <p className="muted">Track points earned by customers over three months.</p>
          </div>
          <span className="period">Jul – Sep 2026</span>
        </header>

        <section className="stats">
          <article className="stat">
            <span>Total points awarded</span>
            <strong>{totalPoints.toLocaleString()}</strong>
            <small>★ Loyalty rewards</small>
          </article>
          <article className="stat">
            <span>Active customers</span>
            <strong>{customerRows.length}</strong>
            <small>Across 3 months</small>
          </article>
          <article className="stat">
            <span>Total purchases</span>
            <strong>{enrichedTransactions.length}</strong>
            <small>Recorded transactions</small>
          </article>
          <article className="stat">
            <span>Total sales</span>
            <strong>${totalSales.toLocaleString()}</strong>
            <small>Transaction value</small>
          </article>
        </section>

        <section className="panel">
          <div className="panel-title">
            <div>
              <h2>Points by customer</h2>
              <p className="muted">Monthly breakdown and overall totals</p>
            </div>
            <input
              aria-label="Search customers"
              placeholder="Search customers..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Customer</th>
                  {data.months.map(m => <th key={m.key}>{m.label}</th>)}
                  <th>Total points</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(row => (
                  <tr key={row.id}>
                    <td>
                      <strong>{row.name}</strong>
                      <small>{row.email}</small>
                    </td>
                    {data.months.map(m => (
                      <td key={m.key}>{row.monthPoints[m.key]}</td>
                    ))}
                    <td><span className="pill">★ {row.totalPoints}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filtered.length === 0 && <p className="empty">No customers found.</p>}
          </div>
        </section>

        <section className="panel">
          <div className="panel-title">
            <div>
              <h2>Recent transactions</h2>
              <p className="muted">Each purchase earns points independently</p>
            </div>
            <select
              aria-label="Filter by month"
              value={month}
              onChange={e => setMonth(e.target.value)}
            >
              <option value="all">All months</option>
              {data.months.map(m => (
                <option value={m.key} key={m.key}>{m.label}</option>
              ))}
            </select>
          </div>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Purchase</th>
                  <th>Points earned</th>
                </tr>
              </thead>
              <tbody>
                {visibleTransactions.slice(0, 12).map(tx => (
                  <tr key={tx.id}>
                    <td>{tx.date}</td>
                    <td>{data.customers.find(c => c.id === tx.customerId)?.name}</td>
                    <td>${tx.amount.toFixed(2)}</td>
                    <td><span className="pill">+{tx.points}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {visibleTransactions.length === 0 && (
              <p className="empty">No transactions found.</p>
            )}
          </div>
          <p className="footer-note">
            Showing {Math.min(12, visibleTransactions.length)} of{' '}
            {visibleTransactions.length} matching transactions
          </p>
        </section>
      </main>
    </div>
  );
}
