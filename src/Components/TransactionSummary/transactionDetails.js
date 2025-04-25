import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import useFetch from "../../Hooks/useFetchHook";
import { fetchCustomer } from "../../Services/api";
import Table from "../Table/table";
import { calculateRewardPoints } from "../../Utlis/RewardsUtils";
import { Pagination, Spinner, FilterBar } from "../../Shared";
import styles from "./transactionDetails.module.scss";

const TransactionDetails = () => {
  const { customerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const monthFromQuery = searchParams.get("month");
  const yearFromQuery = searchParams.get("year");

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const {
    data: customer,
    loading,
    error,
    refetch,
  } = useFetch(() => fetchCustomer(customerId));

  const monthOptions = useMemo(() => {
    const all = customer?.transactions?.map((txn) =>
      dayjs(txn.date).format("MMM-YYYY")
    );
    const unique = [...new Set(all)];
    return unique.reverse().map((entry) => {
      const [month, year] = entry.split("-");
      return { value: month, label: entry };
    });
  }, [customer]);

  const yearOptions = useMemo(() => {
    const all = customer?.transactions?.map((txn) =>
      dayjs(txn.date).format("YYYY")
    );
    return [...new Set(all)].sort((a, b) => b - a).map((y) => ({
      value: y,
      label: y,
    }));
  }, [customer]);

  useEffect(() => {
    if (!selectedMonth && monthOptions.length) {
      const found = monthOptions.find((m) => m.value === monthFromQuery) || monthOptions[0];
      setSelectedMonth(found);
    }
    if (!selectedYear && yearOptions.length) {
      const found = yearOptions.find((y) => y.value === yearFromQuery) || yearOptions[0];
      setSelectedYear(found);
    }
  }, [monthOptions, yearOptions, monthFromQuery, yearFromQuery, selectedMonth, selectedYear]);

  const handleFilterChange = useCallback((monthObj, yearObj) => {
    setSelectedMonth(monthObj);
    setSelectedYear(yearObj);
    setCurrentPage(1);
    navigate(`/rewards/${customerId}/transactions?month=${monthObj.value}&year=${yearObj.value}`);
  }, [navigate, customerId]);

  const filteredTransactions = useMemo(() => {
    if (!customer || !selectedMonth || !selectedYear) return [];
    return (
      customer.transactions
        .filter((txn) => {
          const txnDate = dayjs(txn.date);
          return (
            txnDate.format("MMM") === selectedMonth.value &&
            txnDate.format("YYYY") === selectedYear.value
          );
        })
        .map((txn) => ({
          ...txn,
          rewardPoints: calculateRewardPoints(txn.amount),
        })) || []
    );
  }, [customer, selectedMonth, selectedYear]);

  const currentRows = useMemo(() => {
    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    return filteredTransactions.slice(indexOfFirstRow, indexOfLastRow);
  }, [filteredTransactions, currentPage]);

  const transactionColumns = [
    { header: "Transaction Date", accessor: "date" },
    { header: "Amount", accessor: "amount" },
    { header: "Reward Points", accessor: "rewardPoints" },
  ];

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className={styles.wrapper}>
      <FilterBar
        monthOptions={monthOptions}
        yearOptions={yearOptions}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onFilterChange={handleFilterChange}
      />

      <h2>
        Transaction Details for {selectedMonth?.label} {selectedYear?.label}
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
            getData={() => {
              refetch();
            }}
          />
          <Pagination
            totalItems={filteredTransactions.length}
            itemsPerPage={rowsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default TransactionDetails;
