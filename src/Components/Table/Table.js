import React from "react";
import styles from "./Table.module.scss";

const Table = ({
  data = [],
  columns = [],
  loadingSpinner = false,
  error = null,
  getData = () => null,
  onRowClick = () => null,
}) => {
  return (
    <div className={styles?.tableContainer}>
      <table className={styles?.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.accessor}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} onClick={() => onRowClick(row)}>
              {columns.map((col) => (
                <td key={col.accessor}>
                  {col.Cell
                    ? col.Cell(row[col.accessor], row)
                    : row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
