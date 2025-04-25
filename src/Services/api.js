import { mockCustomerData } from "../MockData/mockDataGenerator";
import logger from "../Loggers/loggers";

// Simulates fetching all transactions
export const fetchTransactions = () => {
  const delay = 1000 + Math.random() * 500;
  const shouldFail = Math.random() < 0.1;

  logger.info("Calling fetchTransactions API");

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        const errorMsg = "Failed to fetch transactions.";
        logger.error("fetchTransactions failed", { error: errorMsg });
        reject(errorMsg);
      } else {
        logger.info("fetchTransactions success", {
          transactionCount: mockCustomerData.length,
        });
        resolve(mockCustomerData);
      }
    }, delay);
  });
};

// Simulates fetching a customer by ID
export const fetchCustomer = (customerId) => {
  const delay = 1000 + Math.random() * 500;
  const shouldFail = Math.random() < 0.1;

  logger.info("Calling fetchCustomer API", { customerId });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        const errorMsg = "Failed to fetch transactions.";
        logger.error("fetchCustomer failed", { customerId, error: errorMsg });
        reject(errorMsg);
      } else {
        const customer = mockCustomerData?.find(
          (customer) => customer.customerId === customerId
        );

        if (customer) {
          logger.info("fetchCustomer success", {
            customerId,
            transactionCount: customer.transactions?.length,
          });
        } else {
          logger.warn("fetchCustomer found no matching customer", { customerId });
        }

        resolve(customer);
      }
    }, delay);
  });
};
