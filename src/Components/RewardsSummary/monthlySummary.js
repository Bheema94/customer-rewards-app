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

  const {
    data: customer,
    loading,
    error,
  } = useFetch(() => fetchCustomer(customerId));

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

  const yearOptions = useMemo(() => {
    const years = allMonthKeys.map((key) => key.split("-")[1]);
    return Array.from(new Set(years))
      .sort((a, b) => Number(b) - Number(a))
      .map((year) => ({ value: year, label: year }));
  }, [allMonthKeys]);

  const latestYear = yearOptions[0]?.value;

  const [selectedYear, setSelectedYear] = useState(null);
  const [monthOptions, setMonthOptions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [initialized, setInitialized] = useState(false);

  // Initial year & month setup
  useEffect(() => {
    if (!initialized && yearOptions.length > 0) {
      const defaultYear = yearOptions[0];
      const monthsForYear = allMonthKeys.filter(
        (key) => key.split("-")[1] === defaultYear.value
      );
      const recentMonths = monthsForYear.slice(0, 3);

      setSelectedYear(defaultYear);
      setMonthOptions([...recentMonths.map((m) => ({ value: m, label: m }))]);
      setSelectedMonth({ value: recentMonths[0], label: recentMonths[0] });
      setInitialized(true);
    }
  }, [yearOptions, allMonthKeys, initialized]);

  const handleFilterChange = useCallback(
    (month, year) => {
      if (year && year.value !== selectedYear?.value) {
        // Year changed
        setSelectedYear(year);
        const months = allMonthKeys.filter(
          (key) => key.split("-")[1] === year.value
        );
        const options = [...months.map((m) => ({ value: m, label: m }))];
        setMonthOptions(options);
        setSelectedMonth(null); // Clear selection for new year
      }

      if (month && month.value !== selectedMonth?.value) {
        // Month changed
        setSelectedMonth(month);
      }

      setCurrentPage(1);
    },
    [allMonthKeys, selectedYear, selectedMonth]
  );

  // Filter transactions
  useEffect(() => {
    if (!customer || !selectedMonth?.value || !selectedYear?.value) return;

    const txns = customer.transactions.filter(
      (t) => dayjs(t.date).format("MMM-YYYY") === selectedMonth.value
    );

    const map = {};
    txns.forEach((t) => {
      const key = dayjs(t.date).format("MMM-YYYY");
      const pts = calculateRewardPoints(t.amount);
      if (!map[key])
        map[key] = { month: key, totalPoints: 0, transactions: [] };
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
        <div className="spinnerWrapper" role="status">
          <div className="loader" />
          <Spinner />
        </div>
      ) : error ? (
        <div className={styles.error}>Error loading customer data.</div>
      ) : !filteredMonthlyRewards.length ? (
        <div className={styles.noData}>
          No transactions found for the selected filter.
        </div>
      ) : selectedYear && !selectedMonth?.value ? (
        <div className={styles.noData}>
          Select a month to check reward points.
        </div>
      ) : (
        <>
          <Table
            data={currentRows}
            columns={[
              { header: "Month", accessor: "month" },
              { header: "Total Points", accessor: "totalPoints" },
            ]}
            onRowClick={handleRowClick}
            getRowTestId={(row) => `summary-row-${row.month}-${row.year}`}
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
