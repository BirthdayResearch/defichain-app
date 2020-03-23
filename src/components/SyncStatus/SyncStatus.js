import React, { Component } from 'react';
import {
  MdDone
} from "react-icons/md";
import styles from './SyncStatus.module.scss';
import Spinner from '../../components/Spinner/Spinner';

function StatusIcon(icon) {
  const StatusIcon = icon;
  return <StatusIcon />;
}

class SyncStatus extends Component {
  state = {
    status: "Synced",
    syncedAgo: "a minute ago",
    statusAssets: {
      icon: MdDone,
      label: "Synchronized"
    }
  };

  toggleStatus = () => {
    this.setState({
      status: this.state.status === "Synced" ? "Syncing" : "Synced",
      syncedAgo: "just now",
      statusAssets: {
        icon: this.state.statusAssets.icon === MdDone ? Spinner : MdDone,
        label: this.state.statusAssets.label === "Synchronized" ? "Syncing" : "Synchronized"
      }
    });
  };

  render() {
    return (
      <div className={styles.syncStatus}>
        <span onClick={this.toggleStatus}>
          {this.state.statusAssets.label}
          {this.state.status === "Synced" ? ` ${this.state.syncedAgo}` : ``}
        </span>
        {StatusIcon(this.state.statusAssets.icon)}
      </div>
    );
  }
}

export default SyncStatus;