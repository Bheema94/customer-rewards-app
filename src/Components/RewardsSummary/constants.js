export const MONTHLY_SUMMARY_LABELS = Object.freeze({
  TITLE: "Monthly Summary Reward Points",
  ERROR_MESSAGE: "Error loading customer data.",
  NO_DATA: "No transactions found for the selected filter.",
  SELECT_MONTH: "Select a month to check reward points.",
  LATEST_THREE_MONTHS_LABEL: "Latest 3 Months",
  LATEST: "Latest",
});

export const MONTHLY_SUMMARY_TABLE_COLUMNS = Object.freeze([
  { header: "Month", accessor: "month" },
  { header: "Total Points", accessor: "totalPoints" },
]);

export const ROWS_PER_PAGE = 5;
export const LATEST_MONTHS_KEY = "latest";
