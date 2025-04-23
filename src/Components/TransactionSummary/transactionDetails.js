import React, { useState, useMemo, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import useFetch from "../../Hooks/useFetchHook";
import { fetchCustomer } from "../../Services/api";
import Table from "../Table/table";
import { calculateRewardPoints } from "../../Utlis/RewardsUtils";
import { Pagination, Spinner, FilterBar } from "../../Shared";
import styles from "./transactionDetails.module.scss";
import PropTypes from "prop-types";

const TransactionDetails = () => {
  const { customerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const monthFromQuery = searchParams.get("month");
  const yearFromQuery = searchParams.get("year");

  const [selectedMonth, setSelectedMonth] = useState(monthFromQuery || "Jan");
  const [selectedYear, setSelectedYear] = useState(yearFromQuery || "2025");
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const {
    data: customer,
    loading,
    error,
    refetch,
  } = useFetch(() => fetchCustomer(customerId));

  const allMonths = useMemo(() => {
    const all = customer?.transactions?.map((txn) =>
      dayjs(txn.date).format("MMM-YYYY")
    );
    const unique = [...new Set(all)];
    return unique.reverse();
  }, [customer]);

  const allYears = useMemo(() => {
    const all = customer?.transactions?.map((txn) =>
      dayjs(txn.date).format("YYYY")
    );
    return [...new Set(all)].sort((a, b) => b - a); 
  }, [customer]);

  const filteredTransactions = useMemo(() => {
    return (
      customer?.transactions
        ?.filter((txn) => {
          const txnDate = dayjs(txn.date);
          return (
            txnDate.format("MMM") === selectedMonth &&
            txnDate.format("YYYY") === selectedYear
          );
        })
        ?.map((txn) => ({
          ...txn,
          rewardPoints: calculateRewardPoints(txn.amount),
        })) || []
    );
  }, [customer, selectedMonth, selectedYear]);

  const currentRows = useMemo(() => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return filteredTransactions.slice(indexOfFirstRow, indexOfLastRow);
  }, [filteredTransactions, currentPage, rowsPerPage]);

  const handleFilterChange = useCallback((month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    setCurrentPage(1);
    navigate(`/rewards/${customerId}/transactions?month=${month}&year=${year}`);
  }, [navigate, customerId]);

  const transactionColumns = [
    { header: "Transaction Date", accessor: "date" },
    { header: "Amount", accessor: "amount" },
    { header: "Reward Points", accessor: "rewardPoints" },
  ];

  return (
    <div className={styles.wrapper}>
      <FilterBar
        availableMonths={allMonths}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onFilterChange={handleFilterChange}
        availableYears={allYears}
      />

      <h2>
        Transaction Details for {selectedMonth} {selectedYear}
      </h2>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className={styles.error}>Error loading customer data</div>
      ) : filteredTransactions.length === 0 ? (
        <div className={styles.noData}>
          No transactions found for the selected month and year.
        </div>
      ) : (
        <>
          <Table
            data={currentRows}
            columns={transactionColumns}
            loadingSpinner={loading}
            error={error}
            getData={refetch}
          />
          <Pagination
            totalItems={filteredTransactions.length}
            itemsPerPage={rowsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

TransactionDetails.propTypes = {
  customerId: PropTypes.string,
  defaultMonth: PropTypes.string,
  defaultYear: PropTypes.string,
  initialCustomerData: PropTypes.shape({
    name: PropTypes.string,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        date: PropTypes.string.isRequired,
        amount: PropTypes.number.isRequired,
      })
    ),
  }),
};

export default TransactionDetails;
