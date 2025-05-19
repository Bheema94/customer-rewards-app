import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import useFetch from "../../Hooks/useFetchHook";
import { fetchCustomer } from "../../Services/api";
import Table from "../Table/table";
import { calculateRewardPoints } from "../../Utlis/RewardsUtils";
import { Pagination, Spinner, FilterBar, Button } from "../../Shared";
import styles from "./transactionDetails.module.scss";
import {
  ROWS_PER_PAGE,
  TRANSACTION_COLUMNS,
  TRANSACTION_DETAILS,
} from "./constants";
import {
  getYearOptions,
  getMonthOptionsByYear,
} from "../../Utlis/dateFiltersUtils";

const TransactionDetails = () => {
  const { customerId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [initialized, setInitialized] = useState(false);

  const monthFromQuery = searchParams.get(TRANSACTION_DETAILS.MONTH);
  const yearFromQuery = searchParams.get(TRANSACTION_DETAILS.YEAR);

  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const {
    data: customer,
    loading,
    error,
    refetch,
  } = useFetch(() => fetchCustomer(customerId));

  const yearOptions = useMemo(
    () => getYearOptions(customer?.transactions),
    [customer]
  );

  const monthOptions = useMemo(() => {
    if (!customer || !selectedYear) return [];
    return getMonthOptionsByYear(customer?.transactions, selectedYear?.value);
  }, [customer, selectedYear]);

  // Set default year from query or first available
  useEffect(() => {
    if (customer && yearOptions?.length && !selectedYear) {
      const defaultYear =
        yearOptions.find((y) => y.value === yearFromQuery) || yearOptions[0];
      setSelectedYear(defaultYear);
    }
  }, [customer, yearOptions, selectedYear, yearFromQuery]);

  useEffect(() => {
    if (customer) {
      setInitialized(true);
    }
  }, [customer]);

  // Set default month from query if present
  useEffect(() => {
    if (
      monthOptions.length &&
      !selectedMonth &&
      monthFromQuery &&
      selectedYear
    ) {
      const defaultMonth = monthOptions?.find(
        (m) => m.value === monthFromQuery
      );
      setSelectedMonth(defaultMonth || null);
    }
  }, [monthOptions, selectedMonth, monthFromQuery, selectedYear]);

  // Handle dropdown selection
  const handleFilterChange = useCallback(
    (monthObj, yearObj, fromYearChange = false) => {
      setSelectedYear(yearObj);

      if (fromYearChange) {
        setSelectedMonth(null);
        setCurrentPage(1);
        navigate(`/rewards/${customerId}/transactions?year=${yearObj.value}`);
      } else {
        setSelectedMonth(monthObj);
        setCurrentPage(1);
        navigate(
          `/rewards/${customerId}/transactions?month=${monthObj.value}&year=${yearObj.value}`
        );
      }
    },
    [navigate, customerId]
  );

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    if (!customer || !selectedMonth || !selectedYear) return [];

    return customer.transactions
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
      }));
  }, [customer, selectedMonth, selectedYear]);

  // Paginated transactions
  const currentRows = useMemo(() => {
    const indexOfLastRow = currentPage * ROWS_PER_PAGE;
    const indexOfFirstRow = indexOfLastRow - ROWS_PER_PAGE;
    return filteredTransactions.slice(indexOfFirstRow, indexOfLastRow);
  }, [filteredTransactions, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const toMonthlySummaryPage = () => {
    navigate(`/rewards/${customerId}`);
  };
  return (
    <div className={styles.wrapper}>
      <div className={styles.backButtonWrapper}>
        <Button
          onClick={toMonthlySummaryPage}
          label={TRANSACTION_DETAILS.BACK}
        />
      </div>

      <FilterBar
        monthOptions={monthOptions}
        yearOptions={yearOptions}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onFilterChange={handleFilterChange}
      />

      <h2>
        {TRANSACTION_DETAILS.TITLE}{" "}
        {selectedMonth?.label && selectedYear?.label
          ? `for ${selectedMonth.label}`
          : ""}
      </h2>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className={styles.error}>{TRANSACTION_DETAILS.ERROR_MESSAGE}</div>
      ) : customer &&
        selectedYear &&
        !selectedMonth &&
        monthOptions.length > 0 &&
        filteredTransactions.length > 0 ? (
        <div className={styles.noData}>{TRANSACTION_DETAILS.SELECT_MONTH}</div>
      ) : !customer && filteredTransactions.length === 0 && initialized ? (
        <div className={styles.noData}>{TRANSACTION_DETAILS.NO_DATA}</div>
      ) : (
        <>
          <Table
            data={currentRows}
            columns={TRANSACTION_COLUMNS}
            loadingSpinner={loading}
            error={error}
            getData={() => {
              refetch();
            }}
          />
          <Pagination
            totalItems={filteredTransactions.length}
            itemsPerPage={ROWS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};

export default TransactionDetails;
