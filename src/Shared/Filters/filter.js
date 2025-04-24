import React from "react";
import PropTypes from "prop-types";
import styles from "./filterBar.module.scss";

const FilterBar = ({
  monthOptions = [],
  yearOptions = [],
  selectedMonth,
  selectedYear,
  onFilterChange,
}) => {
  const handleMonthChange = (e) => {
    const selected = monthOptions.find((m) => m.value === e.target.value);
    onFilterChange(selected, selectedYear);
  };

  const handleYearChange = (e) => {
    const selected = yearOptions.find((y) => y.value === e.target.value);
    onFilterChange(selectedMonth, selected);
  };

  return (
    <div className={styles.filterBar}>
      <label>
        Month:
        <select value={selectedMonth?.value || ""} onChange={handleMonthChange}>
          {monthOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        Year:
        <select value={selectedYear?.value || ""} onChange={handleYearChange}>
          {yearOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

FilterBar.propTypes = {
  monthOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  yearOptions: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  selectedMonth: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
  selectedYear: PropTypes.shape({
    value: PropTypes.string,
    label: PropTypes.string,
  }),
  onFilterChange: PropTypes.func.isRequired,
};

export default FilterBar;
