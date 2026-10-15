
export const months = [
  { key: '2026-07', label: 'Jul 2026', short: 'Jul' },
  { key: '2026-08', label: 'Aug 2026', short: 'Aug' },
  { key: '2026-09', label: 'Sep 2026', short: 'Sep' },
];

export const customers = [
  { id: 'C001', name: 'Vinusha Reddy', email: 'vinusha.reddy@example.com', initials: 'VR', color: 'purple' },
  { id: 'C002', name: 'Rahul Sharma', email: 'rahul.sharma@example.com', initials: 'RS', color: 'blue' },
  { id: 'C003', name: 'Priya Patel', email: 'priya.patel@example.com', initials: 'PP', color: 'pink' },
  { id: 'C004', name: 'Arjun Kumar', email: 'arjun.kumar@example.com', initials: 'AK', color: 'orange' },
  { id: 'C005', name: 'Sneha Rao', email: 'sneha.rao@example.com', initials: 'SR', color: 'teal' },
  { id: 'C006', name: 'Karthik Naidu', email: 'karthik.naidu@example.com', initials: 'KN', color: 'indigo' },
];

const amountsByCustomer = {
  C001: [[120, 75, 210], [145, 52, 99], [200, 130, 48]],
  C002: [[45, 125, 180], [220, 89, 130], [75, 155, 200]],
  C003: [[99, 105, 250], [70, 165, 120], [310, 55, 85]],
  C004: [[65, 90, 140], [115, 205, 49], [80, 120, 275]],
  C005: [[200, 75, 55], [135, 95, 180], [155, 210, 60]],
  C006: [[150, 110, 95], [60, 230, 125], [99, 160, 190]],
};

export const transactions = Object.entries(amountsByCustomer).flatMap(([customerId, monthAmounts]) =>
  monthAmounts.flatMap((amounts, monthIndex) =>
    amounts.map((amount, txIndex) => ({
      id: `TX-${customerId.slice(1)}-${monthIndex + 1}${txIndex + 1}`,
      customerId,
      amount,
      // ISO dates are stored as strings, avoiding locale/timezone date shifting.
      date: `${months[monthIndex].key}-${String(4 + txIndex * 9 + (Number(customerId.slice(1)) % 3)).padStart(2, '0')}`,
    }))
  )
);

export function fetchRewardsData() {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ customers, transactions, months }), 650);
  });
}
