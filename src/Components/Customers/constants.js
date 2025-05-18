export const CUSTOMER_SUMMARY = Object.freeze({
  FIRSTNAME: "First Name",
  LASTNAME: "Last Name",
  EMAIL: "Email",
  TITLE: "Customer Rewards Summary",
  ERROR_MESSAGE: "Failed to load customers please try again later.",
});

export const CUSTOMER_SUMMARY_TABLE_COLUMNS = Object.freeze([
  { header: "First Name", accessor: "firstName" },
  { header: "Last Name", accessor: "lastName" },
  { header: "Email", accessor: "email" },
  { header: "Total Reward Points", accessor: "totalRewardPoints" },
]);
