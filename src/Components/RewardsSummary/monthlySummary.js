import React, { useState, useMemo, useEffect, useCallback } from "react";
import Table from "../Table/table";
import { fetchCustomer } from "../../Services/api";
import useFetch from "../../Hooks/useFetchHook";
import { calculateRewardPoints } from "../../Utlis/RewardsUtils";
import dayjs from "dayjs";
import { useParams, useNavigate } from "react-router-dom";
import { Pagination, Spinner, FilterBar, Button } from "../../Shared";
import styles from "./monthlySummary.module.scss";
import {
  MONTHLY_SUMMARY_LABELS,
  MONTHLY_SUMMARY_TABLE_COLUMNS,
  ROWS_PER_PAGE,
  LATEST_MONTHS_KEY,
} from "./constants";
import { sortMonthKeysDesc } from "../../Utlis/dateHelpers";

const MonthlySummary = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();

  const {
    data: customer,
    loading,
    error,
  } = useFetch(() => fetchCustomer(customerId));

  const [filteredMonthlyRewards, setFilteredMonthlyRewards] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);
  const [monthOptions, setMonthOptions] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [initialized, setInitialized] = useState(false);

  const customerUpdateData = useMemo(() => {
    if (!customer?.transactions) return null;
    const rewardsByMonthMap = {};
    customer.transactions.forEach((txn) => {
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
      monthlyRewards: Object.values(rewardsByMonthMap).sort((a, b) =>
        dayjs(b.month, "MMM-YYYY").diff(dayjs(a.month, "MMM-YYYY"))
      ),
    };
  }, [customer]);

  const allMonthKeys = useMemo(() => {
    return sortMonthKeysDesc(
      customerUpdateData?.monthlyRewards.map((m) => m.month) || []
    );
  }, [customerUpdateData]);

  const yearOptions = useMemo(() => {
    const years = allMonthKeys.map((key) => key.split("-")[1]);
    return Array.from(new Set(years))
      .sort((a, b) => Number(b) - Number(a))
      .map((year) => ({ value: year, label: year }));
  }, [allMonthKeys]);

  // Initialize year & month dropdowns
  useEffect(() => {
    if (!initialized && yearOptions.length > 0) {
      const latestYear = yearOptions[0];
      const monthsForYear = allMonthKeys.filter(
        (key) => key.split("-")[1] === latestYear.value
      );

      const monthNames = monthsForYear.map((key) => key.split("-")[0]);

      const options = [
        {
          value: LATEST_MONTHS_KEY,
          label: MONTHLY_SUMMARY_LABELS.LATEST_THREE_MONTHS_LABEL,
        },
        ...monthNames.map((m) => ({ value: m, label: m })),
      ];

      setSelectedYear(latestYear);
      setMonthOptions(options);
      setSelectedMonth(options[0]);
      setInitialized(true);
    }
  }, [yearOptions, allMonthKeys, initialized]);

  const handleFilterChange = useCallback(
    (month, year) => {
      if (year && year.value !== selectedYear?.value) {
        const monthsInYear = allMonthKeys?.filter(
          (key) => key?.split("-")[1] === year?.value
        );
        const monthNames = monthsInYear?.map((key) => key?.split("-")[0]);
        const options = [
          {
            value: LATEST_MONTHS_KEY,
            label: MONTHLY_SUMMARY_LABELS.LATEST_THREE_MONTHS_LABEL,
          },
          ...monthNames.map((m) => ({ value: m, label: m })),
        ];

        setSelectedYear(year);
        setMonthOptions(options);
        setSelectedMonth(null);
        setFilteredMonthlyRewards([]);
        setCurrentPage(1);
        return;
      }

      if (month && month.value !== selectedMonth?.value) {
        setSelectedMonth(month);
        setCurrentPage(1);
      }
    },
    [selectedYear, selectedMonth, allMonthKeys]
  );

  useEffect(() => {
    if (!customerUpdateData || !selectedYear || !selectedMonth?.value) return;

    const filtered = customerUpdateData.monthlyRewards.filter((r) => {
      const [month, year] = r.month.split("-");
      const isLatest = selectedMonth.value === LATEST_MONTHS_KEY;

      if (isLatest) {
        const yearMonths = allMonthKeys
          .filter((k) => k.endsWith(`-${selectedYear.value}`))
          .slice(0, 3)
          .map((k) => k.split("-")[0]);
        return year === selectedYear.value && yearMonths.includes(month);
      }

      return year === selectedYear.value && month === selectedMonth.value;
    });

    setFilteredMonthlyRewards(filtered);
  }, [selectedMonth, selectedYear, customerUpdateData, allMonthKeys]);

  const indexOfLastRow = currentPage * ROWS_PER_PAGE;
  const indexOfFirstRow = indexOfLastRow - ROWS_PER_PAGE;
  const currentRows = filteredMonthlyRewards.slice(
    indexOfFirstRow,
    indexOfLastRow
  );

  const handleRowClick = useCallback(
    (row) => {
      const [month, year] = row.month.split("-");
      navigate(
        `/rewards/${customerId}/transactions?month=${month}&year=${year}`
      );
    },
    [navigate, customerId]
  );

  return (
    <div className={styles.wrapper}>
      <div className={styles.backButtonWrapper}>
        <Button
          onClick={() => navigate(`/`)}
          label={MONTHLY_SUMMARY_LABELS.BACK}
        />
      </div>

      <FilterBar
        monthOptions={monthOptions}
        yearOptions={yearOptions}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onFilterChange={handleFilterChange}
      />

      <h2>{MONTHLY_SUMMARY_LABELS.TITLE}</h2>

      {loading ? (
        <Spinner />
      ) : error ? (
        <div className={styles.error}>
          {MONTHLY_SUMMARY_LABELS.ERROR_MESSAGE}
        </div>
      ) : !customerUpdateData ? (
        <div className={styles.error}>
          {MONTHLY_SUMMARY_LABELS.CUSTOMER_DATA_NOT_FOUND}
        </div>
      ) : selectedYear && !selectedMonth && monthOptions.length > 0 ? (
        <div className={styles.noData}>
          {MONTHLY_SUMMARY_LABELS.SELECT_MONTH}
        </div>
      ) : filteredMonthlyRewards.length === 0 ? (
        <div className={styles.noData}>{MONTHLY_SUMMARY_LABELS.NO_DATA}</div>
      ) : (
        <>
          <Table
            data={currentRows}
            columns={MONTHLY_SUMMARY_TABLE_COLUMNS}
            onRowClick={handleRowClick}
            getRowTestId={(row) => `summary-row-${row.month}`}
          />
          <Pagination
            totalItems={filteredMonthlyRewards.length}
            itemsPerPage={ROWS_PER_PAGE}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </>
      )}
    </div>
  );
};

export default MonthlySummary;
