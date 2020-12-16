import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  CardBody,
  FormGroup,
  CustomInput,
  Row,
  Col,
} from 'reactstrap';
import { connect } from 'react-redux';
import {
  MdArrowUpward,
  MdArrowDownward,
  MdCompareArrows,
} from 'react-icons/md';
import styles from './WalletTxns.module.scss';
import { I18n } from 'react-redux-i18n';
import {
  fetchWalletTxnsRequest,
  fetchWalletTokenTransactionsListRequestLoading,
  fetchBlockDataForTrxRequestLoading,
  fetchWalletTokenTransactionsListResetRequest,
  accountHistoryCountRequest,
} from '../../reducer';
import {
  ACCOUNT_TO_UTXOS_LABEL,
  DFI_SYMBOL,
  POOL_SWAP_CATEGORY_LABEL,
  RECIEVE_CATEGORY_LABEL,
  REWARDS_CATEEGORY_LABEL,
  REWARD_CATEGORY_LABEL,
  SENT_CATEGORY_LABEL,
  SWAP_CATEGORY_LABEL,
  TRANSFER_CATEGORY_LABEL,
} from '../../../../constants';
import { getAmountInSelectedUnit } from '../../../../utils/utility';
import BigNumber from 'bignumber.js';
import ValueLi from '../../../../components/KeyValueLi/ValueLi';
import CustomPaginationComponent from '../../../../components/CustomPagination';

interface WalletTxnsProps {
  minBlockHeight: number;
  accountHistoryCount: number;
  unit: string;
  walletTxnCount: number;
  walletTxns: {
    txnId: string;
    category: string;
    time: string;
    amount: number;
    unit: string;
    height: number;
  }[];
  fetchWalletTxns: (
    currentPage: number,
    pageSize: number,
    intialLoad?: boolean
  ) => void;
  tokenSymbol: string;
  fetchWalletTokenTransactionsListRequestLoading: (
    symbol: string,
    limit: number,
    includeRewards: boolean,
    minBlockHeight?: number
  ) => void;
  fetchBlockDataForTrxRequestLoading: (trxData: any[]) => void;
  data: any[];
  isLoading: boolean;
  isError: string;
  combineAccountHistoryData: any;
  fetchWalletTokenTransactionsListResetRequest: () => void;
  accountHistoryCountRequest: (no_rewards) => void;
}

const WalletTxns: React.FunctionComponent<WalletTxnsProps> = (
  props: WalletTxnsProps
) => {
  const {
    minBlockHeight,
    accountHistoryCount,
    accountHistoryCountRequest,
    fetchWalletTokenTransactionsListRequestLoading,
    tokenSymbol,
    data,
    isLoading,
    isError,
    combineAccountHistoryData,
  } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [includeRewards, setIncludeRewards] = useState(false);
  const pageSize = 10;
  const total = accountHistoryCount;
  const pagesCount = Math.ceil(total / pageSize);
  const textLimit = 26;
  const to = (currentPage - 1) * pageSize + 1;
  const from = Math.min(total, currentPage * pageSize);

  useEffect(() => {
    accountHistoryCountRequest({
      no_rewards: includeRewards,
    });
  }, []);

  const fetchData = (pageNum) => {
    setCurrentPage(pageNum);
    if (pageNum === 1) {
      fetchWalletTokenTransactionsListRequestLoading(
        tokenSymbol,
        pageSize,
        includeRewards
      );
    } else {
      fetchWalletTokenTransactionsListRequestLoading(
        tokenSymbol,
        pageSize,
        includeRewards,
        minBlockHeight
      );
    }
  };

  useEffect(() => {
    setTableRows([...data]);
  }, [data]);

  useEffect(() => {
    fetchData(currentPage);
  }, []);

  const getTxnsTypeIcon = (type: string) => {
    if (type === SENT_CATEGORY_LABEL) {
      return <MdArrowUpward className={styles.typeIcon} />;
    }
    if (type === RECIEVE_CATEGORY_LABEL || type === REWARDS_CATEEGORY_LABEL) {
      return <MdArrowDownward className={styles.typeIconDownward} />;
    }
    if (type === POOL_SWAP_CATEGORY_LABEL)
      return <MdCompareArrows className={styles.typeIcon} />;
    if (type === ACCOUNT_TO_UTXOS_LABEL)
      return <MdArrowUpward className={styles.typeIcon} />;
    if (type === 'send') return <MdArrowUpward className={styles.typeIcon} />;
    if (type === 'receive')
      return <MdArrowDownward className={styles.typeIcon} />;
    return <MdArrowUpward className={styles.typeIcon} />;
  };

  const getTxnsType = (type: string) => {
    if (type === SENT_CATEGORY_LABEL) {
      return TRANSFER_CATEGORY_LABEL;
    }
    if (type === POOL_SWAP_CATEGORY_LABEL) {
      return SWAP_CATEGORY_LABEL;
    }
    if (type === REWARDS_CATEEGORY_LABEL) {
      return REWARD_CATEGORY_LABEL;
    }
    if (type === 'send') {
      return 'Send';
    }
    if (type === 'receive') {
      return 'Receive';
    }
    return type;
  };

  const getAmountClass = (type: string) => {
    if (type === RECIEVE_CATEGORY_LABEL || type === REWARDS_CATEEGORY_LABEL) {
      return styles.colorGreen;
    }
    return '';
  };

  const getPoolSwapClass = (type: string, amount) => {
    if (type === POOL_SWAP_CATEGORY_LABEL && new BigNumber(amount).gt(0)) {
      return styles.colorGreen;
    }
    return '';
  };

  const walletTxnList = () => {
    if (isLoading || combineAccountHistoryData.isLoading)
      return <div>{I18n.t('containers.wallet.walletPage.loading')}</div>;
    if (isError || combineAccountHistoryData.isError)
      return <div>{isError || combineAccountHistoryData.isError}</div>;
    if (!data.length)
      return (
        <Card className='table-responsive-md'>
          <CardBody>
            {I18n.t('containers.wallet.walletTxns.noTransactions')}
          </CardBody>
        </Card>
      );

    return (
      <>
        <Card className={`${styles.card} table-responsive-md`}>
          <Table className={styles.table}>
            <tbody>
              {tableRows.map((item, id) => (
                <tr key={`${currentPage}-${id}`}>
                  <td>{getTxnsTypeIcon(item.type)}</td>
                  <td>
                    <div>{getTxnsType(item.type)}</div>
                    <div className={styles.unit}>{item.blockTime}</div>
                  </td>
                  <td>
                    <div className={styles.amount}>
                      {item.unit === 'DFI'
                        ? getAmountInSelectedUnit(item.amount, item.unit)
                        : item.amount}
                      &nbsp;
                      <span className={styles.unit}>{item.unit}</span>
                    </div>
                  </td>
                  {item.txid ? (
                    <td>
                      <div className={`${styles.txidvalue} ${styles.copyIcon}`}>
                        <ValueLi
                          value={item.txid}
                          copyable={true}
                          textLimit={textLimit}
                        />
                      </div>
                    </td>
                  ) : (
                    <td className={`${styles.txid__na}`}>
                      {I18n.t('containers.wallet.walletPage.txidNotApplicable')}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
        <CustomPaginationComponent
          label={I18n.t('containers.wallet.walletPage.paginationRange', {
            to,
            total,
            from,
          })}
          data={data}
          currentPage={currentPage}
          pagesCount={pagesCount}
          handlePageClick={fetchData}
        />
      </>
    );
  };

  return (
    <section className='mb-5'>
      <div className={styles.container}>
        <h2>{I18n.t('containers.wallet.walletPage.transactions')}</h2>
        <FormGroup>
          <CustomInput
            type='checkbox'
            id='includeRewards'
            label={I18n.t('containers.wallet.walletPage.includeRewards')}
            checked={includeRewards}
            onChange={() => {
              setIncludeRewards(!includeRewards);
            }}
          />
        </FormGroup>
      </div>
      <Row>
        <Col xs='12'>{walletTxnList()}</Col>
      </Row>
    </section>
  );
};

const mapStateToProps = (state) => {
  const {
    settings,
    wallet: {
      listAccountHistoryData: { isLoading, data, isError },
      combineAccountHistoryData,
      walletTxns,
      walletTxnCount,
      accountHistoryCount,
      minBlockHeight,
    },
  } = state;
  return {
    walletTxns,
    walletTxnCount,
    unit: settings.appConfig.unit,
    combineAccountHistoryData,
    isLoading,
    data,
    isError,
    accountHistoryCount,
    minBlockHeight,
  };
};

const mapDispatchToProps = {
  fetchWalletTxns: (currentPage, pageSize, intialLoad) =>
    fetchWalletTxnsRequest({ currentPage, pageSize, intialLoad }),
  fetchWalletTokenTransactionsListRequestLoading: (
    symbol: string,
    limit: number,
    includeRewards: boolean,
    minBlockHeight?: number
  ) =>
    fetchWalletTokenTransactionsListRequestLoading({
      symbol,
      limit,
      includeRewards,
      minBlockHeight,
    }),
  fetchBlockDataForTrxRequestLoading: (trxArray) =>
    fetchBlockDataForTrxRequestLoading(trxArray),
  fetchWalletTokenTransactionsListResetRequest,
  accountHistoryCountRequest: (no_rewards) =>
    accountHistoryCountRequest(no_rewards),
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletTxns);
