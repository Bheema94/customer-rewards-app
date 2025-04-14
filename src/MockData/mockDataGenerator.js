const getRandomDate = (start, end) => {
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date.toISOString().split("T")[0];
};

const generateRandomTransaction = (customerId, index) => {
  const date = getRandomDate(new Date(2024, 9, 1), new Date(2025, 3, 30)); // Oct 2024 – April 2025
  return {
    transactionId: `TX${customerId.slice(-3)}${index
      .toString()
      .padStart(3, "0")}`,
    customerId,
    amount: parseFloat((Math.random() * 200 + 10).toFixed(2)), // 10 to 210
    date,
  };
};

const generateMockCustomer = (id) => {
  const customerId = `CUST${id.toString().padStart(3, "0")}`;
  const firstNames = ["Alice", "Bob", "Charlie", "Diana", "Eve", "Frank"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones"];

  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;

  const numberOfTransactions = Math.floor(Math.random() * 20 + 15); // Between 15 and 35
  const transactions = Array.from({ length: numberOfTransactions }, (_, idx) =>
    generateRandomTransaction(customerId, idx)
  );

  return {
    customerId,
    firstName,
    lastName,
    email,
    transactions,
  };
};

export const generateMockCustomers = (count = 10) => {
  return Array.from({ length: count }, (_, i) => generateMockCustomer(i + 1));
};
