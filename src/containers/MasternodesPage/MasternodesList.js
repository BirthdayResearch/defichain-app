import React, { Component } from 'react'
import {
  Card,
  Table
} from 'reactstrap';
import styles from './MasternodesList.module.scss';

class MasternodesList extends Component {
  state = {
    masternodes: [
      { id: 0, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 1, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 2, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 3, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 4, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 5, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 6, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 7, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 8, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 9, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 10, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 11, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 12, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 13, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 14, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 15, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 16, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 17, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 18, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 19, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 20, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' },
      { id: 21, status: 'confirmed', address: 'c9a59be5d9f453229f519ab3c5289c', pose: '0', registered: '1201065', lastPaid: '1201065', nextPayment: '1201065', payee: 'XitNe4kuhgmvn7eKn6orLrnbg6h6JUaSvG' }
    ]
  };

  render() {
    return (
      <Card className={styles.card}>
        <div className="table-responsive-xl">
          <Table className={styles.table}>
            <thead>
              <tr>
                <th></th>
                <th>Address</th>
                <th>PoSe score</th>
                <th>Registered</th>
                <th>Last paid</th>
                <th>Next payment</th>
                <th>Payee</th>
              </tr>
            </thead>
            <tbody>
              {this.state.masternodes.map((masternode) => (
                <tr key={masternode.id}>
                  <td className={styles.status}>
                    <span className={`txn-status-${masternode.status}`}>{masternode.status}</span>
                  </td>
                  <td>
                    <div className={styles.address}>
                      {masternode.address}
                    </div>
                  </td>
                  <td>
                    <div className={styles.pose}>
                      {masternode.pose}
                    </div>
                  </td>
                  <td>
                    <div className={styles.registered}>
                      {masternode.registered}
                    </div>
                  </td>
                  <td>
                    <div className={styles.lastPaid}>
                      {masternode.lastPaid}
                    </div>
                  </td>
                  <td>
                    <div className={styles.nextPayment}>
                      {masternode.nextPayment}
                    </div>
                  </td>
                  <td>
                    <div className={styles.payee}>
                      {masternode.payee}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </Card>
    )
  }
}

export default MasternodesList;