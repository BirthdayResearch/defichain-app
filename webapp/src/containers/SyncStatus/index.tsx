import React, { Component } from 'react';
import { MdDone } from 'react-icons/md';
import styles from './SyncStatus.module.scss';
import Spinner from '../../components/Svg/Spinner';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';

interface SyncStatusState {
  status: string;
  syncedAgo: string;
  statusAssets: {
    icon: typeof MdDone;
    label: string;
  };
}

function StatusIcon(icon: any) {
  const StatusIcon = icon;
  return <StatusIcon />;
}

class SyncStatus extends Component<{}, SyncStatusState> {
  state = {
    status: 'synced',
    syncedAgo: 'aMinuteAgo',
    statusAssets: {
      icon: MdDone,
      label: 'synchronized',
    },
  };

  toggleStatus = () => {
    this.setState({
      status: this.state.status === 'synced' ? 'syncing' : 'synced',
      syncedAgo: 'justNow',
      statusAssets: {
        icon: this.state.statusAssets.icon === MdDone ? Spinner : MdDone,
        label:
          this.state.statusAssets.label === 'synchronized'
            ? 'syncing'
            : 'synchronized',
      },
    } as SyncStatusState);
  };

  render() {
    return (
      <div className={styles.syncStatus}>
        <span onClick={this.toggleStatus}>
          {I18n.t(`components.syncStatus.${this.state.statusAssets.label}`)}
          &nbsp;
          {this.state.status === 'synced'
            ? I18n.t(`components.syncStatus.${this.state.syncedAgo}`)
            : ``}
        </span>
        {StatusIcon(this.state.statusAssets.icon)}
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { locale } = state.i18n;
  return {
    locale,
  };
};
export default connect(mapStateToProps)(SyncStatus);
