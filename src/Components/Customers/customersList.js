import React, { useMemo } from "react";
import PropTypes from "prop-types";
import Table from "../Table/table";
import { fetchCustomers } from "../../Services/api";
import useFetch from "../../Hooks/useFetchHook";
import { calculateRewardPoints } from "../../Utlis/RewardsUtils";
import { useNavigate } from "react-router-dom";
import { Spinner } from "../../Shared";
import styles from "./customersList.module.scss";
import { CUSTOMER_SUMMARY, CUSTOMER_SUMMARY_TABLE_COLUMNS } from "./constants";

const CustomersList = () => {
  const navigate = useNavigate();

  const { data, loading: loadingSpinner, error } = useFetch(fetchCustomers);

  const customers = useMemo(() => {
    if (!data) return [];
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

  return (
    <div className={styles.wrapper}>
      <h2>{CUSTOMER_SUMMARY.TITLE}</h2>

      {loadingSpinner ? (
        <Spinner />
      ) : error ? (
        <div className={styles.error}>{CUSTOMER_SUMMARY.ERROR_MESSAGE}</div>
      ) : (
        <Table
          data={customers}
          columns={CUSTOMER_SUMMARY_TABLE_COLUMNS}
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
