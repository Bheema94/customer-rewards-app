import React from "react";
import styles from "./Spinner.module.scss";

const Spinner = () => {
  return (
    <div className={styles.spinnerWrapper}>
      <div className={styles.loader}></div>
      <span>Loading...</span>
    </div>
  );
};

export default Spinner;
