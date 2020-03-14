import React, { Component } from 'react'
import {
  Card,
  Table
} from 'reactstrap';
import styles from './PaymentRequests.module.scss';

class PaymentRequests extends Component {
  state = {
    requests: [
      { id: 0, time: 'Feb 19, 2:03 pm', amount: 0.123, message: 'I need money!', unit: 'DFI' },
      { id: 1, time: 'Feb 19, 2:03 pm', amount: 0.123, message: 'I need money!', unit: 'DFI' }
    ]
  };

  render() {
    return (
      <Card className="table-responsive-md mb-5">
        <Table className={styles.table}>
          <thead>
            <tr>
              <th>Time</th>
              <th className={styles.amount}>Amount</th>
              <th>Message</th>
            </tr>
          </thead>
          <tbody>
            {this.state.requests.map((request) => (
              <tr key={request.id}>
                <td>
                  <div className={styles.time}>
                    {request.time}
                  </div>
                </td>
                <td>
                  <div className={styles.amount}>
                    {request.amount} <span className={styles.unit}>{request.unit}</span>
                  </div>
                </td>
                <td>
                  <div className={styles.message}>
                    {request.message}
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

export default PaymentRequests;





