import React from 'react';
import classNames from 'classnames';
import Loader from '../Loader';
import style from './StatusLedgerConnect.module.scss';

interface StatusLedgerConnectProps {
  status: 'connected' | 'notConnected' | 'connecting';
}

const StatusLedgerConnect: React.FC<StatusLedgerConnectProps> = ({
  status,
}: StatusLedgerConnectProps) => (
  <div className={style['status-ledger-connect']}>
    {status === 'connecting' ? (
      <Loader size={11} borderSize={2} />
    ) : (
      <div
        className={classNames(
          'rounded-circle',
          style.size,
          style[`status-ledger-connect--${status}`]
        )}
      />
    )}
  </div>
);

export default StatusLedgerConnect;
