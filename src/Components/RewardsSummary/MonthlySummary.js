import React, { useState, useMemo, useEffect } from "react";
import Table from "../Table/Table";
import { fetchCustomer } from "../../Services/api";
import useFetch from "../../Hooks/useFetchHook";
import { calculateRewardPoints } from "../../Utlis/RewardsUtils";
import dayjs from "dayjs";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { Pagination, Spinner,FilterBar } from "../../Shared";
import styles from "./MonthlySummary.module.scss";

const MonthlySummary = () => {
  const { customerId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const monthFromQuery = searchParams.get("month");
  const yearFromQuery = searchParams.get("year");

  const {
    data: customer,
    loading,
    error,
    refetch,
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
    const all = customerUpdateData?.monthlyRewards?.map((item) => item.month);
    return all?.slice(-3).reverse();
  }, [customerUpdateData]);

  const defaultMonth = allMonths?.[0];
  const [selectedMonth, setSelectedMonth] = useState(
    monthFromQuery || defaultMonth
  );
  const [selectedYear, setSelectedYear] = useState(yearFromQuery || "2025");

  useEffect(() => {
    if (allMonths?.length && !monthFromQuery) {
      setSelectedMonth(allMonths[0]);
    }
  }, [allMonths, monthFromQuery]);

  const filteredMonthData = useMemo(() => {
    return customerUpdateData?.monthlyRewards?.find((item) => {
      const [month, year] = item.month.split("-");
      return item.month === selectedMonth && year === selectedYear;
    });
  }, [selectedMonth, selectedYear, customerUpdateData]);

  const monthlyRewardsColumns = [
    { header: "Month", accessor: "month" },
    { header: "Total Points", accessor: "totalPoints" },
  ];

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

  return (
    <div className={styles.wrapper}>
      <FilterBar
        availableMonths={allMonths}
        selectedMonth={selectedMonth}
        selectedYear={selectedYear}
        onFilterChange={(month, year) => {
          setSelectedMonth(month);
          setSelectedYear(year);
          navigate(
            `/rewards/${customerId}/transactions?month=${month}&year=${year}`
          );
        }}
      />

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
            onRowClick={(row) => {
              const [month, year] = row.month.split("-");
              navigate(
                `/rewards/${customerId}/transactions?month=${month}&year=${year}`
              );
            }}
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

export default MonthlySummary;
