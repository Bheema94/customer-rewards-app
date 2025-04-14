// TransactionDetails.jsx (Step 3)

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import useFetch from "../../Hooks/useFetchHook";
import { fetchCustomer } from "../../Services/api";
import Table from "../Table/Table";
import { calculateRewardPoints } from "../../Utlis/RewardsUtils";
import { Pagination, Spinner, FilterBar } from "../../Shared";
import styles from "./TransactionDetails.module.scss";

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
    return unique.slice(-3).reverse();
  }, [customer]);

  const filteredTransactions = useMemo(() => {
    const filtered =
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
        })) || [];

    return filtered;
  }, [customer, selectedMonth, selectedYear]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = filteredTransactions.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

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
        onFilterChange={(month, year) => {
          setSelectedMonth(month);
          setSelectedYear(year);
          setCurrentPage(1);
          navigate(
            `/rewards/${customerId}/transactions?month=${month}&year=${year}`
          );
        }}
      />

      <h2>
        Transaction Details for {selectedMonth} {selectedYear}
      </h2>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className={styles.error}>Error loading customer data</div>
      ) : (
        <>
          {filteredTransactions.length === 0 ? (
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
        </>
      )}
    </div>
  );
};

export default TransactionDetails;
