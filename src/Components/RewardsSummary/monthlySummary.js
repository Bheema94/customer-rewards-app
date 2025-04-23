import React, { useState, useMemo, useEffect, useCallback } from "react";
import Table from "../Table/table";
import { fetchCustomer } from "../../Services/api";
import useFetch from "../../Hooks/useFetchHook";
import { calculateRewardPoints } from "../../Utlis/RewardsUtils";
import dayjs from "dayjs";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Pagination, Spinner, FilterBar } from "../../Shared";
import styles from "./monthlySummary.module.scss";
import PropTypes from "prop-types";

const MonthlySummary = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const monthFromQuery = searchParams.get("month");
  const yearFromQuery = searchParams.get("year");

  const {
    data: customer,
    loading,
    error
  } = useFetch(() => fetchCustomer(customerId));

  const customerUpdateData = useMemo(() => {
    const rewardsByMonthMap = {};
    customer?.transactions?.forEach((txn) => {
      const monthKey = dayjs(txn.date).format("MMM-YYYY");
      const points = calculateRewardPoints(txn.amount);
      if (!rewardsByMonthMap[monthKey]) {
        rewardsByMonthMap[monthKey] = {
          month: monthKey,
          totalPoints: 0,
          transactions: [],
        };
      }
      rewardsByMonthMap[monthKey].totalPoints += points;
      rewardsByMonthMap[monthKey].transactions.push({
        ...txn,
        rewardPoints: points,
      });
    });
    const monthlyRewards = Object.values(rewardsByMonthMap);
    return {
      ...customer,
      monthlyRewards,
    };
  }, [customer]);

  const allMonths = useMemo(() => {
    return (customerUpdateData?.monthlyRewards?.map((item) => item.month)).reverse();
  }, [customerUpdateData]);

  const allYears = useMemo(() => {
    return customerUpdateData?.monthlyRewards?.reduce((accumulator, item) => {
      const year = item.month.split("-")[1];
      if (!accumulator.includes(year)) {
        accumulator.push(year);
      }
      return accumulator;
    }, []).reverse();
  }, [customerUpdateData]);

  const defaultMonth = allMonths?.[0];
  const [selectedMonth, setSelectedMonth] = useState(monthFromQuery || defaultMonth);
  const [selectedYear, setSelectedYear] = useState(yearFromQuery || "2025");

  useEffect(() => {
    if (allMonths?.length && !monthFromQuery) {
      setSelectedMonth(allMonths[0]);
    }
  }, [allMonths, monthFromQuery]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = useMemo(() => {
    return (
      customerUpdateData?.monthlyRewards?.slice(
        indexOfFirstRow,
        indexOfLastRow
      ) || []
    );
  }, [customerUpdateData, indexOfFirstRow, indexOfLastRow]);

  const handleFilterChange = useCallback((month, year) => {
    setSelectedMonth(month);
    setSelectedYear(year);
    navigate(`/rewards/${customerId}/transactions?month=${month}&year=${year}`);
  }, [navigate, customerId]);

  const handleRowClick = useCallback((row) => {
    const [month, year] = row.month.split("-");
    navigate(`/rewards/${customerId}/transactions?month=${month}&year=${year}`);
  }, [navigate, customerId]);

  const monthlyRewardsColumns = [
    { header: "Month", accessor: "month" },
    { header: "Total Points", accessor: "totalPoints" },
  ];

  return (
    <div className={styles.wrapper}>
      <FilterBar
        availableMonths={allMonths}
        availableYears={allYears}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onFilterChange={handleFilterChange}
      />

      <h2>
        Monthly Summary Reward Points
      </h2>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className={styles.error}>Error loading customer data.</div>
      ) : !customerUpdateData?.monthlyRewards?.length ? (
        <div className={styles.noData}>No monthly reward data available.</div>
      ) : (
        <>
          <Table
            data={currentRows}
            columns={monthlyRewardsColumns}
            onRowClick={handleRowClick}
          />
          <Pagination
            totalItems={customerUpdateData?.monthlyRewards?.length || 0}
            itemsPerPage={rowsPerPage}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

MonthlySummary.propTypes = {
  customerId: PropTypes.string,
  defaultMonth: PropTypes.string,
  defaultYear: PropTypes.string,
  initialCustomerData: PropTypes.shape({
    name: PropTypes.string,
    transactions: PropTypes.arrayOf(
      PropTypes.shape({
        amount: PropTypes.number.isRequired,
        date: PropTypes.string.isRequired,
      })
    ),
  }),
};

export default MonthlySummary;
