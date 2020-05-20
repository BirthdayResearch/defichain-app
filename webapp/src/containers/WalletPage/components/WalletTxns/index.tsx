import React, { Component } from 'react';
import { Card, Table, CardBody } from 'reactstrap';
import { connect } from 'react-redux';
import { MdArrowUpward, MdArrowDownward } from 'react-icons/md';
import styles from './WalletTxns.module.scss';
import { I18n } from 'react-redux-i18n';
import { fetchWalletTxnsRequest } from '../../reducer';
import { WALLET_TXN_PAGE_SIZE } from '../../../../constants/configs';
import Pagination from '../../../../components/Pagination';

interface WalletTxnsProps {
  walletTxns: {
    txnId: string;
    category: string;
    time: string;
    amount: number;
    unit: string;
  }[];
  walletTxnCount: number;
  fetchWalletTxns: (currentPage: number, pageSize: number) => void;
}

interface WalletTxnsState {
  currentPage: number;
  pageSize: number;
}

class WalletTxns extends Component<WalletTxnsProps, WalletTxnsState> {
  state = {
    currentPage: 1,
    pageSize: WALLET_TXN_PAGE_SIZE,
  };

  componentDidMount() {
    this.props.fetchWalletTxns(this.state.currentPage, this.state.pageSize);
  }

  TxnTypeIcon = type => {
    let Icon;
    if (type === 'send') {
      Icon = MdArrowUpward;
    } else {
      Icon = MdArrowDownward;
    }

    return <Icon className={styles.typeIcon} />;
  };

  fetchData = index => {
    this.props.fetchWalletTxns(index, this.state.pageSize);
    this.setState({
      currentPage: index,
    });
  };

  render() {
    const { currentPage, pageSize } = this.state;
    const { walletTxnCount: total } = this.props;
    const pagesCount = Math.ceil(total / pageSize);

    const from = (currentPage - 1) * pageSize;
    const to = Math.min(total, currentPage * pageSize);

    return (
      <section className='mb-5'>
        <h2>{I18n.t('containers.wallet.walletPage.transactions')}</h2>
        {pagesCount ? (
          <>
            <Card className={`${styles.card} table-responsive-md`}>
              <Table className={styles.table}>
                <thead>
                  <tr>
                    <th></th>
                    <th>{I18n.t('containers.wallet.walletTxns.time')}</th>
                    <th className={styles.amount}>
                      {I18n.t('containers.wallet.walletTxns.amount')}
                    </th>
                    <th>{I18n.t('containers.wallet.walletTxns.hash')}</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.walletTxns.map(txn => (
                    <tr key={txn.txnId}>
                      <td className={styles.typeIcon}>
                        {this.TxnTypeIcon(txn.category)}
                      </td>
                      <td>
                        <div className={styles.time}>{txn.time}</div>
                      </td>
                      <td>
                        <div className={styles.amount}>
                          {txn.amount}{' '}
                          <span className={styles.unit}>{txn.unit}</span>
                        </div>
                      </td>
                      <td>
                        <div className={styles.hash}>{txn.txnId}</div>
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
              handlePageClick={this.fetchData}
            />
          </>
        ) : (
          <Card className='table-responsive-md'>
            <CardBody>
              {I18n.t('containers.wallet.walletTxns.noTransactions')}
            </CardBody>
          </Card>
        )}
      </section>
    );
  }
}

const mapStateToProps = state => {
  const { walletTxns, walletTxnCount } = state.wallet;
  return {
    walletTxns,
    walletTxnCount,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchWalletTxns: (currentPage, pageSize) =>
      dispatch(fetchWalletTxnsRequest({ currentPage, pageSize })),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletTxns);
