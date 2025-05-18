export const ROWS_PER_PAGE = 5;

export const TRANSACTION_DETAILS = Object.freeze({
  TITLE: "Transaction Details",
  ERROR_MESSAGE: "Error loading customer data.",
  NO_DATA: "No transactions found for the selected filter.",
  SELECT_MONTH: "Select a month to check transactions details.",
  MONTH : "month",
  YEAR : "year"
});

export const TRANSACTION_COLUMNS = Object.freeze([
  { header: "Transaction Date", accessor: "date" },
  { header: "Amount", accessor: "amount" },
  { header: "Reward Points", accessor: "rewardPoints" },
]);
