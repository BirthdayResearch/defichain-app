import React, { Component } from "react";
import styles from "./Spinner.module.scss";

interface SpinnerProps {}
interface SpinnerState {}

class Spinner extends Component<SpinnerProps, SpinnerState> {
  render() {
    return (
      <svg className={styles.spinner} viewBox="0 0 48 48">
        <circle
          className={styles.path}
          cx="24"
          cy="24"
          r="16"
          fill="none"
          stroke-width="6"
        ></circle>
      </svg>
    );
  }
}

export default Spinner;
