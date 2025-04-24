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
import {
  getRecent3MonthsKeys,
  sortMonthKeysDesc,
} from "../../Utlis/dateHelpers";

const MonthlySummary = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const monthFromQuery = searchParams.get("month");
  const yearFromQuery = searchParams.get("year");

  const { data: customer, loading, error } = useFetch(() =>
    fetchCustomer(customerId)
  );

  const monthlyRewardsColumns = [
    { header: "Month", accessor: "month" },
    { header: "Total Points", accessor: "totalPoints" },
  ];

  const [filteredMonthlyRewards, setFilteredMonthlyRewards] = useState([]);

  const customerUpdateData = useMemo(() => {
    const rewardsByMonthMap = {};
    customer?.transactions?.forEach((txn) => {
      const monthKey = dayjs(txn.date).format("MMM-YYYY");
      const pts = calculateRewardPoints(txn.amount);
      if (!rewardsByMonthMap[monthKey]) {
        rewardsByMonthMap[monthKey] = {
          month: monthKey,
          totalPoints: 0,
          transactions: [],
        };
      }
      rewardsByMonthMap[monthKey].totalPoints += pts;
      rewardsByMonthMap[monthKey].transactions.push({
        ...txn,
        rewardPoints: pts,
      });
    });
    return {
      ...customer,
      monthlyRewards: Object.values(rewardsByMonthMap),
    };
  }, [customer]);

  const allMonthKeys = useMemo(
    () =>
      sortMonthKeysDesc(
        customerUpdateData?.monthlyRewards.map((m) => m.month) || []
      ),
    [customerUpdateData]
  );

  const monthOptions = useMemo(() => {
    return [
      { value: "recent3", label: "Recent 3 Months" },
      ...allMonthKeys.map((key) => ({ value: key, label: key })),
    ];
  }, [allMonthKeys]);

  const yearOptions = useMemo(() => {
    const years = allMonthKeys.map((key) => key.split("-")[1]);
    return Array.from(new Set(years))
      .sort((a, b) => Number(b) - Number(a))
      .map((year) => ({ value: year, label: year }));
  }, [allMonthKeys]);

  const [selectedMonth, setSelectedMonth] = useState(() =>
    monthOptions.find((opt) => opt.value === monthFromQuery) || monthOptions[0]
  );
  const [selectedYear, setSelectedYear] = useState(() =>
    yearOptions.find((opt) => opt.value === yearFromQuery) || yearOptions[0]
  );

  useEffect(() => {
    if (!monthFromQuery && monthOptions[0]) {
      setSelectedMonth(monthOptions[0]);
    }
    if (!yearFromQuery && yearOptions[0]) {
      setSelectedYear(yearOptions[0]);
    }
  }, [monthFromQuery, yearFromQuery, monthOptions, yearOptions]);

  useEffect(() => {
    if (!customer || !selectedMonth?.value || !selectedYear?.value) return;

    let txns = customer.transactions.filter(
      (t) => dayjs(t.date).year().toString() === selectedYear.value
    );

    if (selectedMonth.value === "recent3") {
      const recentKeys = getRecent3MonthsKeys();
      txns = txns.filter((t) =>
        recentKeys.includes(dayjs(t.date).format("MMM-YYYY"))
      );
    } else {
      txns = txns.filter(
        (t) => dayjs(t.date).format("MMM-YYYY") === selectedMonth.value
      );
    }

    const map = {};
    txns.forEach((t) => {
      const key = dayjs(t.date).format("MMM-YYYY");
      const pts = calculateRewardPoints(t.amount);
      if (!map[key]) map[key] = { month: key, totalPoints: 0, transactions: [] };
      map[key].totalPoints += pts;
      map[key].transactions.push({ ...t, rewardPoints: pts });
    });

    const newMonthly = Object.values(map).sort((a, b) =>
      dayjs(b.month, "MMM-YYYY").diff(dayjs(a.month, "MMM-YYYY"))
    );
    setFilteredMonthlyRewards(newMonthly);
  }, [customer, selectedMonth, selectedYear]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;
  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = filteredMonthlyRewards.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  const handleFilterChange = useCallback(
    (month, year) => {
      setSelectedMonth(month);
      setSelectedYear(year);
      setCurrentPage(1);
    },
    []
  );

  const handleRowClick = useCallback(
    (row) => {
      const [m, y] = row.month.split("-");
      navigate(`/rewards/${customerId}/transactions?month=${m}&year=${y}`);
    },
    [navigate, customerId]
  );

  return (
    <div className={styles.wrapper}>
      <FilterBar
        monthOptions={monthOptions}
        yearOptions={yearOptions}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onFilterChange={handleFilterChange}
      />

      <h2>Monthly Summary Reward Points</h2>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className={styles.error}>Error loading customer data.</div>
      ) : !filteredMonthlyRewards.length ? (
        <div className={styles.noData}>
          No transactions found for the selected filter.
        </div>
      ) : (
        <>
          <Table
            data={currentRows}
            columns={monthlyRewardsColumns}
            onRowClick={handleRowClick}
          />
          <Pagination
            totalItems={filteredMonthlyRewards.length}
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
};

export default MonthlySummary;
