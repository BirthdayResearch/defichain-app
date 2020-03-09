import React, { Component } from 'react';
import {
  MdDone
} from "react-icons/md";
import styles from './SyncStatus.module.scss';

function StatusIcon(icon) {
  const StatusIcon = icon;
  return <StatusIcon />;
}

class SyncStatus extends Component {
  state = {
    status: {
      icon: MdDone,
      label: 'Up-to-date'
    }
  };

  render() {
    return (
      <div className={styles.syncStatus}>
        {this.state.status.label}
        {StatusIcon(this.state.status.icon)}
      </div>
    );
  }
}

export default SyncStatus;