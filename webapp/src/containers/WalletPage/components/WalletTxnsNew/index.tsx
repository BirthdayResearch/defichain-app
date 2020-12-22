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
  ACCOUNT_TO_ACCOUNT_LABEL,
  ACCOUNT_TO_UTXOS_LABEL,
  ADD_POOL_LIQUIDITY_LABEL,
  DFI_SYMBOL,
  POOL_SWAP_CATEGORY_LABEL,
  RECIEVEE_CATEGORY_LABEL,
  RECIEVE_CATEGORY_LABEL,
  REMOVE_LIQUIDITY_LABEL,
  REWARDS_CATEEGORY_LABEL,
  REWARD_CATEGORY_LABEL,
  SENT_CATEGORY_LABEL,
  SWAP_CATEGORY_LABEL,
  TRANSFER_CATEGORY_LABEL,
  UTXOS_TO_ACCOUNT_LABEL,
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
  accountHistoryCountRequest: ({ no_rewards, token }) => void;
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
      no_rewards: !includeRewards,
      token: tokenSymbol,
    });
  }, [includeRewards]);

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
  }, [includeRewards]);

  const getTxnsTypeIcon = (type: string) => {
    if (type === SENT_CATEGORY_LABEL) {
      return <MdArrowUpward className={styles.typeIcon} />;
    }
    if (
      type === RECIEVE_CATEGORY_LABEL ||
      type === REWARDS_CATEEGORY_LABEL ||
      type === REWARD_CATEGORY_LABEL
    ) {
      return <MdArrowDownward className={styles.typeIconDownward} />;
    }
    if (type === POOL_SWAP_CATEGORY_LABEL)
      return <MdCompareArrows className={styles.typeIcon} />;
    if (type === ACCOUNT_TO_UTXOS_LABEL)
      return <MdArrowUpward className={styles.typeIcon} />;
    if (type === 'send') return <MdArrowUpward className={styles.typeIcon} />;
    if (type === 'receive')
      return <MdArrowDownward className={styles.typeIconDownward} />;
    return <MdArrowUpward className={styles.typeIcon} />;
  };

  const getTxnsType = (type: string) => {
    const SEND = 'send';
    const RECEIVE = 'receive';
    const walletTxnsLabel = 'containers.wallet.walletTxns';
    const swapLabel = 'containers.swap';
    const walletLabel = 'containers.wallet.walletPage';
    let label = type;
    switch (type) {
      case SENT_CATEGORY_LABEL:
        label = I18n.t(`${walletTxnsLabel}.sent`);
        break;
      case POOL_SWAP_CATEGORY_LABEL:
        label = I18n.t(`${swapLabel}.swapPage.swap`);
        break;
      case REWARDS_CATEEGORY_LABEL:
      case REWARD_CATEGORY_LABEL:
        label = I18n.t(`${swapLabel}.addLiquidity.reward`);
        break;
      case ACCOUNT_TO_UTXOS_LABEL:
      case ACCOUNT_TO_ACCOUNT_LABEL:
        label = I18n.t(`${walletTxnsLabel}.accountToAccount`);
        break;
      case UTXOS_TO_ACCOUNT_LABEL:
        label = I18n.t(`${walletTxnsLabel}.utxosToAccount`);
        break;
      case ADD_POOL_LIQUIDITY_LABEL:
        label = I18n.t(`${walletTxnsLabel}.addPoolLiquidity`);
        break;
      case REMOVE_LIQUIDITY_LABEL:
        label = I18n.t(`${walletTxnsLabel}.removePoolLiquidity`);
        break;
      case SEND:
        label = I18n.t(`${walletLabel}.send`);
        break;
      case RECEIVE:
        label = I18n.t(`${walletLabel}.receive`);
        break;
      default:
        break;
    }
    return label;
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
                    {item.amountData.map((amountD) => (
                      <div
                        className={
                          item.type === REWARD_CATEGORY_LABEL ||
                          item.type === RECIEVEE_CATEGORY_LABEL ||
                          item.type === REWARDS_CATEEGORY_LABEL ||
                          Number(amountD.amount) > 0
                            ? `${styles.colorGreen} ${styles.amount}`
                            : styles.amount
                        }
                      >
                        {amountD.unit === 'DFI'
                          ? getAmountInSelectedUnit(
                              amountD.amount,
                              amountD.unit
                            )
                          : amountD.amount}
                        &nbsp;
                        <span className={styles.unit}>{amountD.unit}</span>
                      </div>
                    ))}
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
  accountHistoryCountRequest: ({ no_rewards, token }) =>
    accountHistoryCountRequest({ no_rewards, token }),
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletTxns);
