import React from "react";
import PropTypes from "prop-types";
import styles from "./filterBar.module.scss";

const FilterBar = ({
  monthOptions,
  yearOptions,
  selectedMonth,
  selectedYear,
  onFilterChange,
}) => {
  const handleYearChange = (e) => {
    const selected = yearOptions.find((y) => y.value === e.target.value);
    onFilterChange(null, selected, true); // Year change resets month
  };

  const handleMonthChange = (e) => {
    const selected = monthOptions.find((m) => m.value === e.target.value);
    onFilterChange(selected, selectedYear, false);
  };

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterGroup}>
        <label htmlFor="year-select">Select Year</label>
        <select
          id="year-select"
          className={styles.select}
          value={selectedYear?.value || ""}
          onChange={handleYearChange}
        >
          <option value="" disabled>
            -- Select Year --
          </option>
          {yearOptions.map((y) => (
            <option key={y.value} value={y.value}>
              {y.label}
            </option>
          ))}
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="month-select">Select Month</label>
        <select
          id="month-select"
          className={styles.select}
          value={selectedMonth?.value || ""}
          onChange={handleMonthChange}
          disabled={!selectedYear}
        >
          <option value="" disabled>
            -- Select Month --
          </option>
          {monthOptions.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

FilterBar.propTypes = {
  monthOptions: PropTypes.array.isRequired,
  yearOptions: PropTypes.array.isRequired,
  selectedMonth: PropTypes.object,
  selectedYear: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterBar;
