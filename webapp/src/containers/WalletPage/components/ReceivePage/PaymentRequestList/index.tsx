import React, { useEffect, useState } from 'react';
import moment from 'moment';
import { uid } from 'uid';
import {
  Card,
  CardBody,
  Table,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from 'reactstrap';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { MdMoreHoriz, MdDelete } from 'react-icons/md';
import styles from './PaymentRequestList.module.scss';
import { removeReceiveTxnsRequest } from '../../../reducer';
import {
  DEFICHAIN_ADDRESS,
  MAIN,
  PAYMENT_REQ_LIST_SIZE,
} from '../../../../../constants';
import QrCode from '../../../../../components/QrCode';
import CopyToClipboard from '../../../../../components/CopyToClipboard';
import Pagination from '../../../../../components/Pagination';
import { addHdSeedCheck } from '../../../saga';
import { PaymentRequestModel } from '@defi_types/rpcConfig';
import openNewTab from '../../../../../utils/openNewTab';
import { getNetworkType } from '../../../../../utils/utility';
interface PaymentRequestsProps {
  paymentRequests: PaymentRequestModel[];
  removeReceiveTxns: (id: string | number) => void;
  spvPaymentRequests?: PaymentRequestModel[];
  isSPV?: boolean;
}

const PaymentRequestList: React.FunctionComponent<PaymentRequestsProps> = (
  props: PaymentRequestsProps
) => {
  const addresses =
    (props.isSPV ? props.spvPaymentRequests : props.paymentRequests) || [];
  const [currentPage, handlePageClick] = useState(1);
  const pageSize = PAYMENT_REQ_LIST_SIZE;
  const total = addresses.length;
  const pagesCount = Math.ceil(total / pageSize);
  const from = (currentPage - 1) * pageSize;
  const to = Math.min(total, currentPage * pageSize);
  const data = addresses.slice(from, to);
  const [copied, changeCopied] = useState(false);

  useEffect(() => {
    if (!props.isSPV) {
      addHdSeedCheck(data);
    }
  }, [data]);

  const handleCopy = () => {
    changeCopied(true);
    setTimeout(() => {
      changeCopied(false);
    }, 600);
  };
  return (
    <section className='mb-5'>
      {total ? (
        <>
          <Card className='table-responsive-md'>
            <Table className={styles.table}>
              <thead>
                <tr>
                  <th></th>
                  <th>
                    {I18n.t('containers.wallet.paymentRequestList.label')}
                  </th>
                  <th>
                    {I18n.t('containers.wallet.paymentRequestList.address')}
                  </th>
                  <th>
                    {I18n.t('containers.wallet.paymentRequestList.created')}
                  </th>
                  <th></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {data.map((request) => {
                  const transactionURI = request.address;
                  return (
                    <tr key={request.id}>
                      <td></td>
                      <td>{request.label}</td>
                      <td
                        onClick={() =>
                          openNewTab(
                            `${`${DEFICHAIN_ADDRESS}`}/${request.address}${
                              getNetworkType() !== MAIN
                                ? `?network=TestNet`
                                : ''
                            }`
                          )
                        }
                        className={styles.addressContainer}
                      >
                        <div className={styles.ellipsisValue}>
                          {request.address}
                        </div>
                      </td>
                      <td>{moment(request.time).fromNow()}</td>
                      <td>
                        <div className={styles.qrCc}>
                          <span>
                            <QrCode
                              value={transactionURI}
                              uid={`request-${uid()}`}
                              qrClass={styles.qrCc}
                            />
                          </span>
                          <span>
                            <CopyToClipboard
                              value={transactionURI}
                              handleCopy={handleCopy}
                            />
                          </span>
                        </div>
                      </td>
                      <td className={`${styles.actionCell} ${styles.qrCc}`}>
                        <UncontrolledDropdown
                          className={` ${
                            props.isSPV ? styles.visibilityNone : ''
                          }`}
                        >
                          <DropdownToggle className='padless' color='link'>
                            <MdMoreHoriz />
                          </DropdownToggle>
                          <DropdownMenu right>
                            <DropdownItem
                              onClick={() =>
                                props.removeReceiveTxns(request.id)
                              }
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
                  );
                })}
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
  const { wallet } = state;
  return {
    paymentRequests: wallet.paymentRequests,
    spvPaymentRequests: wallet.spvPaymentRequests,
  };
};

const mapDispatchToProps = {
  removeReceiveTxns: (id: string | number) => removeReceiveTxnsRequest(id),
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentRequestList);
