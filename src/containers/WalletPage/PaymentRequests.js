import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import {
  Card,
  Table,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from 'reactstrap';
import {
  MdMoreHoriz,
  MdDelete,
  MdAccessTime
} from "react-icons/md";
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
              <th></th>
              <th>Time</th>
              <th className={styles.amount}>Amount</th>
              <th>Message</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {this.state.requests.map((request) => (
              <tr key={request.id}>
                <td className={styles.icon}>
                  <MdAccessTime className={styles.icon} />
                </td>
                <td>
                  <div className={styles.time}>
                    <Link to={`/wallet/paymentrequest/${request.id}`}>{request.time}</Link>
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
                <td className={styles.actionCell}>
                  <UncontrolledDropdown>
                    <DropdownToggle className="padless" color="link">
                      <MdMoreHoriz />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem>
                        <MdDelete />
                        <span>Cancel request</span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
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





