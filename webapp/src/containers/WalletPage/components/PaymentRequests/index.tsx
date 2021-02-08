import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  Table,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import EllipsisText from 'react-ellipsis-text';
import { MdMoreHoriz, MdDelete, MdAccessTime } from 'react-icons/md';
import styles from './PaymentRequests.module.scss';
import { fetchPaymentRequest, removeReceiveTxnsRequest } from '../../reducer';
import {
  DATE_FORMAT,
  WALLET_PAYMENT_REQ_BASE_PATH,
  PAYMENT_REQ_PAGE_SIZE,
} from '../../../../constants';
import Pagination from '../../../../components/Pagination';

interface PaymentRequestsProps {
  unit: string;
  paymentRequests: {
    id: number;
    time: string;
    amount: number;
    message: string;
    unit: string;
  }[];
  fetchPaymentRequest: () => void;
  removeReceiveTxns: (id: string | number) => void;
}

const PaymentRequests: React.FunctionComponent<PaymentRequestsProps> = (
  props: PaymentRequestsProps
) => {
  const [currentPage, handlePageClick] = useState(1);
  const pageSize = PAYMENT_REQ_PAGE_SIZE;
  const total = props.paymentRequests.length;
  const pagesCount = Math.ceil(total / pageSize);
  const from = (currentPage - 1) * pageSize;
  const to = Math.min(total, currentPage * pageSize);
  const data = props.paymentRequests.slice(from, to);

  useEffect(() => {
    props.fetchPaymentRequest();
  }, [total]);

  return (
    <section className='mb-5'>
      <h2>{I18n.t('containers.wallet.walletPage.paymentRequests')}</h2>
      {total ? (
        <>
          <Card className='table-responsive-md'>
            <Table className={styles.table}>
              <thead>
                <tr>
                  <th></th>
                  <th>{I18n.t('containers.wallet.paymentRequests.time')}</th>
                  <th className={styles.amount}>
                    {I18n.t('containers.wallet.paymentRequests.amount')}
                  </th>
                  <th>{I18n.t('containers.wallet.paymentRequests.message')}</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.map((request) => (
                  <tr key={request.id}>
                    <td className={styles.icon}>
                      <MdAccessTime className={styles.icon} />
                    </td>
                    <td>
                      <div className={styles.time}>
                        <Link
                          to={`${WALLET_PAYMENT_REQ_BASE_PATH}/${request.id}`}
                        >
                          {moment(request.time).format(DATE_FORMAT)}
                        </Link>
                      </div>
                    </td>
                    <td>
                      <div className={styles.amount}>
                        {request.amount ? (
                          <>
                            {request.amount}
                            &nbsp;
                            <span className={styles.unit}>{props.unit}</span>
                          </>
                        ) : (
                          ''
                        )}
                      </div>
                    </td>
                    <td>
                      <div className={styles.message}>
                        <EllipsisText
                          text={request.message || ''}
                          length={'50'}
                        />
                      </div>
                    </td>
                    <td className={styles.actionCell}>
                      <UncontrolledDropdown>
                        <DropdownToggle className='padless' color='link'>
                          <MdMoreHoriz />
                        </DropdownToggle>
                        <DropdownMenu right>
                          <DropdownItem
                            onClick={() => props.removeReceiveTxns(request.id)}
                          >
                            <MdDelete />
                            <span>
                              {I18n.t(
                                'containers.wallet.paymentRequests.cancelRequest'
                              )}
                            </span>
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card>
          <Pagination
            label={I18n.t('containers.wallet.walletPage.paginationRange', {
              to,
              total,
              from: from + 1,
            })}
            currentPage={currentPage}
            pagesCount={pagesCount}
            handlePageClick={handlePageClick}
          />
        </>
      ) : (
        <Card className='table-responsive-md'>
          <CardBody>
            {I18n.t('containers.wallet.walletPage.noPaymentRequests')}
          </CardBody>
        </Card>
      )}
    </section>
  );
};

const mapStateToProps = (state) => {
  const { wallet, settings } = state;
  return {
    unit: settings.appConfig.unit,
    paymentRequests: wallet.paymentRequests,
  };
};

const mapDispatchToProps = {
  fetchPaymentRequest,
  removeReceiveTxns: (id: string | number) => removeReceiveTxnsRequest(id),
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentRequests);
