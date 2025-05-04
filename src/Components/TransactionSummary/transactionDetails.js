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

  const yearOptions = useMemo(() => {
    const all = customer?.transactions?.map((txn) =>
      dayjs(txn.date).format("YYYY")
    );
    return [...new Set(all)]
      .sort((a, b) => b - a)
      .map((y) => ({
        value: y,
        label: y,
      }));
  }, [customer]);

  const monthOptions = useMemo(() => {
    if (!customer || !selectedYear) return [];
    const monthsForYear = customer.transactions
      .filter((txn) => dayjs(txn.date).format("YYYY") === selectedYear.value)
      .map((txn) => {
        const formatted = dayjs(txn.date).format("MMM-YYYY");
        const [month] = formatted.split("-");
        return { value: month, label: formatted };
      });

    const unique = [
      ...new Map(monthsForYear.map((m) => [m.label, m])).values(),
    ];
    return unique.sort((a, b) =>
      dayjs(b.label, "MMM-YYYY").diff(dayjs(a.label, "MMM-YYYY"))
    );
  }, [customer, selectedYear]);

  useEffect(() => {
    if (customer && yearOptions.length && !selectedYear) {
      const defaultYear =
        yearOptions.find((y) => y.value === yearFromQuery) || yearOptions[0];
      setSelectedYear(defaultYear);
    }
  }, [customer, yearOptions, selectedYear, yearFromQuery]);

  useEffect(() => {
    if (
      monthOptions.length &&
      !selectedMonth &&
      monthFromQuery &&
      selectedYear
    ) {
      const defaultMonth = monthOptions.find((m) => m.value === monthFromQuery);
      setSelectedMonth(defaultMonth || null);
    }
  }, [monthOptions, selectedMonth, monthFromQuery, selectedYear]);

  const handleFilterChange = useCallback(
    (monthObj, yearObj, fromYearChange = false) => {
      setSelectedYear(yearObj);

      if (fromYearChange) {
        setSelectedMonth(null); // Reset month
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
        Transaction Details{" "}
        {selectedMonth?.label && selectedYear?.label
          ? `for ${selectedMonth.label}`
          : ""}
      </h2>

      {selectedYear && !selectedMonth ? (
        <div className={styles.noData}>
          Select Month to check reward points.
        </div>
      ) : loading ? (
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
