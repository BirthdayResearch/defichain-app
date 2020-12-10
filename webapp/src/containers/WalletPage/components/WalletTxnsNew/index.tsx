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
} from '../../reducer';
import {
  ACCOUNT_TO_UTXOS_LABEL,
  POOL_SWAP_CATEGORY_LABEL,
  RECIEVE_CATEGORY_LABEL,
  REWARDS_CATEEGORY_LABEL,
  REWARD_CATEGORY_LABEL,
  SENT_CATEGORY_LABEL,
  SWAP_CATEGORY_LABEL,
  TRANSFER_CATEGORY_LABEL,
  WALLET_TXN_PAGE_FETCH_SIZE,
  WALLET_TXN_PAGE_SIZE,
} from '../../../../constants';
import Pagination from '../../../../components/Pagination';
import {
  getAmountInSelectedUnit,
  numberWithCommas,
} from '../../../../utils/utility';
import cloneDeep from 'lodash/cloneDeep';
import { prepareTxDataRows } from '../../service';
import BigNumber from 'bignumber.js';
import ValueLi from '../../../../components/KeyValueLi/ValueLi';

interface WalletTxnsProps {
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
    includeRewards: boolean
  ) => void;
  fetchBlockDataForTrxRequestLoading: (trxData: any[]) => void;
  data: any[];
  isLoading: boolean;
  isError: string;
  combineAccountHistoryData: any;
  fetchWalletTokenTransactionsListResetRequest: () => void;
}

const WalletTxns: React.FunctionComponent<WalletTxnsProps> = (
  props: WalletTxnsProps
) => {
  const {
    walletTxnCount,
    fetchWalletTxns,
    walletTxns,
    fetchWalletTokenTransactionsListRequestLoading,
    fetchBlockDataForTrxRequestLoading,
    tokenSymbol,
    data,
    isLoading,
    isError,
    combineAccountHistoryData,
  } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [includeRewards, setIncludeRewards] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [pageSizeForFetch, setPageSizeForFetch] = useState(5);
  const total = data || walletTxnCount ? data.length + walletTxnCount : 0;
  const pagesCount = Math.ceil(total / pageSize);
  const textLimit = 26;
  // const to = (currentPage - 1) * pageSize + 1;
  // const from = Math.min(total, currentPage * pageSize);

  // useEffect(() => {
  //   if (!walletTxns.length || !combineAccountHistoryData.data) {
  //     setPageSizeForFetch(5);
  //   } else {
  //     setPageSizeForFetch(10);
  //   }
  // }, [walletTxns, combineAccountHistoryData.data]);

  useEffect(() => {
    fetchWalletTokenTransactionsListRequestLoading(
      tokenSymbol || '',
      WALLET_TXN_PAGE_FETCH_SIZE,
      includeRewards
    );
    fetchWalletTxns(currentPage, pageSize, true);
    return () => {
      fetchWalletTokenTransactionsListResetRequest();
    };
  }, [includeRewards]);

  const fetchDataTxns = (pageNumber: number) => {
    fetchWalletTxns(pageNumber, pageSizeForFetch);
    setCurrentPage(pageNumber);
  };

  const fetchData = (pageNum) => {
    fetchDataTxns(pageNum);
    const newCloneTableData = cloneDeep(data);
    let updatedPageNum = pageNum;
    let rows = newCloneTableData.slice(
      (pageNum - 1) * pageSizeForFetch,
      pageNum * pageSizeForFetch
    );
    if (newCloneTableData.length > 0 && !rows.length) {
      const lastPage = Math.ceil(newCloneTableData.length / pageSizeForFetch);
      rows = newCloneTableData.slice(
        (lastPage - 1) * pageSizeForFetch,
        lastPage * pageSizeForFetch
      );
      updatedPageNum = lastPage;
    }
    setCurrentPage(updatedPageNum);
    const updatedRows = prepareTxDataRows(rows);
    fetchBlockDataForTrxRequestLoading(updatedRows);
  };

  useEffect(() => {
    setTableRows([...combineAccountHistoryData.data, ...walletTxns]);
  }, [combineAccountHistoryData, walletTxns]);

  useEffect(() => {
    fetchData(currentPage);
  }, [data, walletTxnCount]);

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
    return '';
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
              {tableRows
                .sort(
                  (a, b) =>
                    new Date(b.time || b.blockData.time).getTime() -
                    new Date(a.time || a.blockData.time).getTime()
                )
                .map((item, id) => (
                  <tr key={`${currentPage}-${id}`}>
                    <td>{getTxnsTypeIcon(item.category)}</td>
                    <td>
                      <div>{getTxnsType(item.category)}</div>
                      <div className={styles.unit}>
                        {item.time || item.blockData.time}
                      </div>
                    </td>
                    {item.unit ? (
                      <td>
                        <div className={styles.amount}>
                          {getAmountInSelectedUnit(
                            item.amount,
                            item.unit,
                            item.unit
                          )}
                          &nbsp;
                          <span className={styles.unit}>{item.unit}</span>
                        </div>
                      </td>
                    ) : (
                      <td
                        className={`text-right ${getAmountClass(
                          item.category
                        )}`}
                      >
                        <div
                          className={getPoolSwapClass(
                            item.category,
                            item.amounts[0].value
                          )}
                        >
                          {`${numberWithCommas(item.amounts[0].value)} ${
                            item.amounts[0].symbolKey
                          }`}
                        </div>
                        {item.amounts[1] && (
                          <div>
                            {`${numberWithCommas(item.amounts[1].value)} ${
                              item.amounts[1].symbolKey
                            }`}
                          </div>
                        )}
                      </td>
                    )}
                    {item.txid ? (
                      <td>
                        <div
                          className={`${styles.txidvalue} ${styles.copyIcon}`}
                        >
                          <ValueLi
                            value={item.txid}
                            copyable={true}
                            textLimit={textLimit}
                          />
                        </div>
                      </td>
                    ) : (
                      <td className={`${styles.txid__na}`}>
                        {I18n.t(
                          'containers.wallet.walletPage.txidNotApplicable'
                        )}
                      </td>
                    )}
                  </tr>
                ))}
            </tbody>
          </Table>
        </Card>
        <Pagination
          // label={I18n.t('containers.wallet.walletPage.paginationRange', {
          //   to,
          //   total,
          //   from,
          // })}
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
  };
};

const mapDispatchToProps = {
  fetchWalletTxns: (currentPage, pageSize, intialLoad) =>
    fetchWalletTxnsRequest({ currentPage, pageSize, intialLoad }),
  fetchWalletTokenTransactionsListRequestLoading: (
    symbol: string,
    limit: number,
    includeRewards: boolean
  ) =>
    fetchWalletTokenTransactionsListRequestLoading({
      symbol,
      limit,
      includeRewards,
    }),
  fetchBlockDataForTrxRequestLoading: (trxArray) =>
    fetchBlockDataForTrxRequestLoading(trxArray),
  fetchWalletTokenTransactionsListResetRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletTxns);
