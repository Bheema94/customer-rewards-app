import React, { useMemo } from "react";
import Table from "../Table/Table";
import { fetchTransactions } from "../../Services/api";
import useFetch from "../../Hooks/useFetchHook";
import { calculateRewardPoints } from "../../Utlis/RewardsUtils";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../Shared";

import styles from "./CustomersList.module.scss";

const CustomersList = () => {
  const navigate = useNavigate();

  const {
    data,
    loading: loadingSpinner,
    error,
    refetch: fetchData,
  } = useFetch(fetchTransactions, []);

  const customers = useMemo(() => {
    return data?.map((customer) => {
      const totalRewardPoints = customer?.transactions?.reduce((acc, txn) => {
        return acc + calculateRewardPoints(txn.amount);
      }, 0);

      return {
        ...customer,
        totalRewardPoints,
      };
    });
  }, [data]);

  const customerColumns = [
    { header: "First Name", accessor: "firstName" },
    { header: "Last Name", accessor: "lastName" },
    { header: "Email", accessor: "email" },
    { header: "Total Reward Points", accessor: "totalRewardPoints" },
  ];

  return (
    <div className={styles.wrapper}>
      <h2>Customer Rewards Summary</h2>

      {loadingSpinner ? (
        <Spinner />
      ) : error ? (
        <div className={styles.error}>
          Failed to load customers. Please try again later.
        </div>
      ) : (
        <Table
          data={customers}
          columns={customerColumns}
          onRowClick={(row) => navigate(`/rewards/${row.customerId}`)}
        />
      )}
    </div>
  );
};

export default CustomersList;
