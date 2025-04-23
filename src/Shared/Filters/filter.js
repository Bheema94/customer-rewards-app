import React, { useState } from "react";
import styles from "./filterBar.module.scss";
import PropTypes from "prop-types";

const FilterBar = ({
  availableMonths,
  onFilterChange,
  selectedMonth,
  selectedYear,
  availableYears
}) => {
  const [month, setMonth] = useState(
    selectedMonth || availableMonths?.[0] || ""
  );
  const [year, setYear] = useState(availableYears?.[0] || "2025");

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
          {availableYears?.map((y) => (
            <option key={y} value={y}>
              {y}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

FilterBar.propTypes = {
  availableMonths: PropTypes.arrayOf(PropTypes.string),
  availableYears: PropTypes.arrayOf(PropTypes.string),
  selectedMonth: PropTypes.string.isRequired,
  selectedYear: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterBar;
