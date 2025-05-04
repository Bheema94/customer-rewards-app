import dayjs from "dayjs";

export const calculateRewardPoints = (amount) => {
  let points = 0;
  const wholeAmount = Math.floor(amount);
  if (wholeAmount > 100) {
    points += (wholeAmount - 100) * 2 + 50;
  } else if (wholeAmount > 50) {
    points += wholeAmount - 50;
  }
  return points;
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
