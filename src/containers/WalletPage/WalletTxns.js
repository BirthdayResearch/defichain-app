import React, { Component } from 'react'
import {
  Card,
  Table
} from 'reactstrap';
import {
  MdArrowUpward,
  MdArrowDownward
} from "react-icons/md";
import styles from './WalletTxns.module.scss';

function TxnTypeIcon(type) {
  let Icon;
  if (type === 'Received') {
    Icon = MdArrowDownward;
  } else {
    Icon = MdArrowUpward;
  }

  return <Icon className={styles.typeIcon} />;
}

class WalletTxns extends Component {
  state = {
    txns: [
      { id: 0, type: 'Received', time: 'Feb 19, 2:03 pm', hash: 'c9a59be5d9f453229f519ab3c5289c', value: 100, unit: 'DFI' },
      { id: 1, type: 'Received', time: 'Feb 19, 2:03 pm', hash: 'c9a59be5d9f453229f519ab3c5289c', value: 100, unit: 'DFI' },
      { id: 2, type: 'Received', time: 'Feb 19, 2:03 pm', hash: 'c9a59be5d9f453229f519ab3c5289c', value: 100, unit: 'DFI' },
      { id: 3, type: 'Sent', time: 'Feb 19, 2:03 pm', hash: 'c9a59be5d9f453229f519ab3c5289c', value: 100, unit: 'DFI' },
      { id: 4, type: 'Received', time: 'Feb 19, 2:03 pm', hash: 'c9a59be5d9f453229f519ab3c5289c', value: 100, unit: 'DFI' },
      { id: 5, type: 'Received', time: 'Feb 19, 2:03 pm', hash: 'c9a59be5d9f453229f519ab3c5289c', value: 100, unit: 'DFI' },
      { id: 6, type: 'Sent', time: 'Feb 19, 2:03 pm', hash: 'c9a59be5d9f453229f519ab3c5289c', value: 100, unit: 'DFI' },
      { id: 7, type: 'Received', time: 'Feb 19, 2:03 pm', hash: 'c9a59be5d9f453229f519ab3c5289c', value: 100, unit: 'DFI' }
    ]
  };

  render() {
    return (
      <Card className="table-responsive-md">
        <Table className={styles.table}>
          <tbody>
            {this.state.txns.map((txn) => (
              <tr key={txn.id}>
                <td className={styles.typeIcon}>
                  {TxnTypeIcon(txn.type)}
                </td>
                <td>
                  <div className={styles.type}>
                    {txn.type}
                  </div>
                  <div className={styles.time}>
                    {txn.time}
                  </div>
                </td>
                <td>
                  <div className={styles.hash}>
                    {txn.hash}
                  </div>
                </td>
                <td>
                  <div className={styles.value}>
                    {txn.value} <span className={styles.unit}>{txn.unit}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card>
    )
  }
}

export default WalletTxns;