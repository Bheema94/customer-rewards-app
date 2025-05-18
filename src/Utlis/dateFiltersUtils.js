import dayjs from "dayjs";

/**
 * Generate a sorted list of unique years from a list of transactions.
 */
export const getYearOptions = (transactions = []) => {
  const years = transactions.map((txn) => dayjs(txn.date).format("YYYY"));
  const uniqueYears = [...new Set(years)].sort((a, b) => b - a);
  return uniqueYears.map((year) => ({ value: year, label: year }));
};

/**
 * Generate a sorted list of unique month options for a given year.
 */
export const getMonthOptionsByYear = (transactions = [], year) => {
  const months = transactions
    .filter((txn) => dayjs(txn.date).format("YYYY") === year)
    .map((txn) => {
      const monthName = dayjs(txn.date).format("MMM");
      return { value: monthName, label: monthName };
    });

  const uniqueMonths = [
    ...new Map(months.map((m) => [m.label, m])).values(),
  ];

  return uniqueMonths.sort(
    (a, b) => dayjs(b.value, "MMM").month() - dayjs(a.value, "MMM").month()
  );
};
