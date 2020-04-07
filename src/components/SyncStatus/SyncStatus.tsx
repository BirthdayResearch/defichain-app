import React, { Component } from "react";
import { MdDone } from "react-icons/md";
import styles from "./SyncStatus.module.scss";
import Spinner from "../../components/Spinner/Spinner";
import { SyncStatusProps, SyncStatusState } from "./SyncStatus.interface";
import { I18n } from "react-redux-i18n";

function StatusIcon(icon: any) {
  const StatusIcon = icon;
  return <StatusIcon />;
}

class SyncStatus extends Component<SyncStatusProps, SyncStatusState> {
  state = {
    status: "synced",
    syncedAgo: "aMinuteAgo",
    statusAssets: {
      icon: MdDone,
      label: "synchronized",
    },
  };

  toggleStatus = () => {
    this.setState({
      status: this.state.status === "synced" ? "syncing" : "synced",
      syncedAgo: "justNow",
      statusAssets: {
        icon: this.state.statusAssets.icon === MdDone ? Spinner : MdDone,
        label:
          this.state.statusAssets.label === "synchronized"
            ? "syncing"
            : "synchronized",
      },
    } as SyncStatusState);
  };

  render() {
    return (
      <div className={styles.syncStatus}>
        <span onClick={this.toggleStatus}>
          {I18n.t(
            `containers.blockChainPage.blockPage.${this.state.statusAssets.label}`
          )}
          {this.state.status === "synced"
            ? I18n.t(
                `containers.blockChainPage.blockPage.${this.state.syncedAgo}`
              )
            : ``}
        </span>
        {StatusIcon(this.state.statusAssets.icon)}
      </div>
    );
  }
}

export default SyncStatus;
