import { mockCustomerData } from "../MockData/mockDataGenerator";
import logger from "../Loggers/loggers";
import { API_CONFIG } from "./apiConstants";

const getRandomDelay = () =>
  API_CONFIG.FETCH_DELAY_MIN +
  Math.random() * (API_CONFIG.FETCH_DELAY_MAX - API_CONFIG.FETCH_DELAY_MIN);

// Simulates fetching all transactions
export const fetchCustomers = () => {
  const delay = getRandomDelay();
  const shouldFail = Math.random() < API_CONFIG.FETCH_CUSTOMERS_FAILURE_RATE;

  logger.info("Calling fetchTransactions API");

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        const errorMsg = API_CONFIG.ERROR_MESSAGES.FETCH_TRANSACTIONS;
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
  const delay = getRandomDelay();
  const shouldFail = Math.random() < API_CONFIG.FETCH_CUSTOMER_FAILURE_RATE;

  logger.info("Calling fetchCustomer API", { customerId });

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) {
        const errorMsg = API_CONFIG.ERROR_MESSAGES.FETCH_TRANSACTIONS;
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
          logger.warn("fetchCustomer found no matching customer", {
            customerId,
          });
        }

        resolve(customer);
      }
    }, delay);
  });
};
