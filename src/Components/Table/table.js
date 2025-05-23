import React from "react";
import styles from "./table.module.scss";
import PropTypes from "prop-types";

const Table = ({
  data = [],
  columns = [],
  onRowClick = () => null,
  getRowTestId = () => undefined,
}) => {
  return (
    <div className={styles?.tableContainer}>
      <table className={styles?.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col?.accessor}>{col?.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              onClick={() => onRowClick(row)}
              data-testid={getRowTestId?.(row, rowIndex)}
            >
              {columns.map((col) => (
                <td key={col?.accessor}>
                  {col?.Cell
                    ? col?.Cell(row[col?.accessor], row)
                    : row[col?.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      accessor: PropTypes.string.isRequired,
      Cell: PropTypes.func,
    })
  ).isRequired,
  onRowClick: PropTypes.func,
  getRowTestId: PropTypes.func,
};

export default Table;
