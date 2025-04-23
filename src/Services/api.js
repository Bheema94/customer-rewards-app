import { generateMockCustomers } from "../MockData/mockDataGenerator";

import {mockCustomerData } from "../MockData/mockDataGenerator";

export const fetchTransactions = () => {
  return new Promise((resolve, reject) => {
    const delay = 1000 + Math.random() * 500;
    const shouldFail = Math.random() < 0.1;
    setTimeout(() => {
      if (shouldFail) {
        reject("Failed to fetch transactions.");
      } else {
        console.log("mockCustomerData / ",mockCustomerData)
        resolve(mockCustomerData);
      }
    }, delay);
  });
};

export const fetchCustomer = (customerId) => {
  return new Promise((resolve, reject) => {
    const delay = 1000 + Math.random() * 500;
    const shouldFail = Math.random() < 0.1;

    setTimeout(() => {
      if (shouldFail) {
        reject("Failed to fetch transactions.");
      } else {
        resolve(
          mockCustomerData?.find(
            (customer) => customer.customerId === customerId
          )
        );
      }
    }, delay);
  });
};
