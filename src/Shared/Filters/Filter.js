import React, { useState } from "react";
import styles from "./FilterBar.module.scss";

const FilterBar = ({
  availableMonths,
  onFilterChange,
  selectedMonth,
  selectedYear,
}) => {
  const [month, setMonth] = useState(
    selectedMonth || availableMonths?.[0] || ""
  );
  const [year, setYear] = useState(selectedYear || "2025");

  const handleMonthChange = (e) => {
    const selected = e.target.value;
    setMonth(selected);
    const [m, y] = selected.split("-");
    onFilterChange(m, year);
  };

  const handleYearChange = (e) => {
    const selected = e.target.value;
    setYear(selected);
    const [m] = month.split("-");
    onFilterChange(m, selected);
  };

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <label htmlFor="month-select">Month</label>
        <select id="month-select" value={month} onChange={handleMonthChange}>
          {availableMonths?.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="year-select">Year</label>
        <select id="year-select" value={year} onChange={handleYearChange}>
          <option value="2025">2025</option>
          <option value="2024">2024</option>
        </select>
      </div>
    </div>
  );
};

export default FilterBar;
