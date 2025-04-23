import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Table from "../Table/table";
import { fetchTransactions } from "../../Services/api";
import useFetch from "../../Hooks/useFetchHook";
import { calculateRewardPoints } from "../../Utlis/RewardsUtils";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../Shared";
import styles from "./customersList.module.scss";

const CustomersList = () => {
  const navigate = useNavigate();

  const {
    data,
    loading: loadingSpinner,
    error,
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


CustomersList.propTypes = {
  customers: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      transactions: PropTypes.arrayOf(
        PropTypes.shape({
          transactionId: PropTypes.string.isRequired,
          amount: PropTypes.number.isRequired,
          date: PropTypes.string.isRequired,
        })
      ).isRequired,
    })
  ),
};

export default CustomersList;
