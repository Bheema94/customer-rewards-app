import dayjs from "dayjs";

export const calculateRewardPoints = (amount) => {
  let points = 0;
  if (amount > 100) {
    points += (amount - 100) * 2 + 50; // $50–$100 → 1pt each = 50pts
  } else if (amount > 50) {
    points += amount - 50;
  }
  return Math.floor(points); // handle fractions
};

export const getCustomerWithRewards = (customer) => {
  let totalRewards = 0;
  const monthlyRewards = {};

  const enhancedTransactions = customer.transactions.map((txn) => {
    const rewardPoints = calculateRewardPoints(txn.amount);
    totalRewards += rewardPoints;

    const monthKey = dayjs(txn.date).format("MMM-YYYY");
    if (!monthlyRewards[monthKey]) {
      monthlyRewards[monthKey] = 0;
    }
    monthlyRewards[monthKey] += rewardPoints;

    return {
      ...txn,
      rewardPoints,
    };
  });

  return {
    ...customer,
    totalRewards,
    monthlyRewards,
    transactions: enhancedTransactions,
  };
};
