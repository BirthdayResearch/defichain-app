import React, { useState, useEffect, useRef } from 'react';
import {
  Card,
  Table,
  CardBody,
  FormGroup,
  CustomInput,
  Row,
  Col,
  Button,
} from 'reactstrap';
import { connect } from 'react-redux';
import {
  MdArrowUpward,
  MdArrowDownward,
  MdCompareArrows,
  MdFileDownload,
} from 'react-icons/md';
import styles from './WalletTxns.module.scss';
import { I18n } from 'react-redux-i18n';
import axios from 'axios';
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
  ANY_ACCOUNT_TO_ACCOUNT_LABEL,
  COMMISSION_CATEGORY_LABEL,
  DATE_FORMAT_CSV,
  POOL_SWAP_CATEGORY_LABEL,
  RECIEVEE_CATEGORY_LABEL,
  RECIEVE_CATEGORY_LABEL,
  REMOVE_LIQUIDITY_LABEL,
  REWARDS_CATEGORY_LABEL,
  REWARD_CATEGORY_LABEL,
  SENT_CATEGORY_LABEL,
  UTXOS_TO_ACCOUNT_LABEL,
} from '../../../../constants';
import {
  getErrorMessage,
  getFormattedTime,
  onViewOnChain,
} from '../../../../utils/utility';
import BigNumber from 'bignumber.js';
import ValueLi from '../../../../components/KeyValueLi/ValueLi';
import CustomPaginationComponent from '../../../../components/CustomPagination';
import DownloadCsvModal from './components/DownloadCsvModal';
import { getListAccountHistory } from '../../service';
import { fetchBlockCountRequest } from '../../../BlockchainPage/reducer';
import moment from 'moment';

interface WalletTxnsProps {
  minBlockHeight: number;
  blockCount: number;
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
    pageNum: number,
    cancelToken?: string,
    minBlockHeight?: number
  ) => void;
  fetchBlockDataForTrxRequestLoading: (trxData: any[]) => void;
  data: any[];
  isLoading: boolean;
  isError: string;
  combineAccountHistoryData: any;
  fetchWalletTokenTransactionsListResetRequest: () => void;
  accountHistoryCountRequest: ({ no_rewards, token }) => void;
  fetchBlockCount: () => void;
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
    blockCount,
    fetchBlockCount,
  } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [CsvModalOpen, setCsvModalOpen] = useState(false);
  const [transactionData, setTransationData] = useState<any>([]);
  const [includeRewards, setIncludeRewards] = useState(false);
  const [downloadDisable, setDownloadDisable] = useState(false);
  const pageSize = 10;
  const total = accountHistoryCount;
  const pagesCount = Math.ceil(total / pageSize);
  const textLimit = 26;
  const from = (currentPage - 1) * pageSize + 1;
  const to = Math.min(total, currentPage * pageSize);
  const [modal, setModal] = useState(true);
  const [error, setError] = useState('');
  const [reqData, setData] = useState({
    blockHeight: blockCount,
    limit: 100,
    token: tokenSymbol,
    no_rewards: true,
  });

  useEffect(() => {
    fetchBlockCount();
  }, [CsvModalOpen]);

  useEffect(() => {
    const getData = async () => {
      let txns;
      try {
        setDownloadDisable(true);
        txns = await getListAccountHistory(reqData);
        if (txns.length != 0 && blockCount != 0) {
          setDownloadDisable(false);
        }
        txns = txns.map((txn) => {
          return {
            ...txn,
            blockTime: moment.unix(txn.blockTime).format(DATE_FORMAT_CSV),
          };
        });
        setTransationData(txns);
      } catch (err) {
        const errorMessage = getErrorMessage(err);
        setError(errorMessage);
      }
    };
    getData();
  }, [reqData.limit, reqData.no_rewards, reqData.blockHeight]);

  const handleRegularNumInputs = (
    event: { target: { name: string; value: any } },
    field: string
  ) => {
    setData({
      ...reqData,
      [field]: Number(event.target.value),
    });
    setError('');
  };

  const toggle = async () => {
    setModal(!modal);
    setData({
      blockHeight: blockCount,
      limit: 100,
      token: tokenSymbol,
      no_rewards: false,
    });
    handleCsvButtonClick();
  };

  const handleCheckBox = () => {
    setData({
      ...reqData,
      no_rewards: !reqData.no_rewards,
    });
  };

  const handleDownloadWindow = () => {
    if (!error) {
      handleCsvButtonClick();
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    setError('');
    setData({
      ...reqData,
      blockHeight: blockCount,
      token: tokenSymbol,
      no_rewards: true,
      limit: 100,
    });
  }, [CsvModalOpen]);

  const fileName = `${I18n.t(
    'containers.wallet.walletPage.transactions'
  )}_${getFormattedTime()}.csv`;

  const sourceArray: any = useRef([]);
  let source;

  useEffect(() => {
    accountHistoryCountRequest({
      no_rewards: !includeRewards,
      token: tokenSymbol,
    });
  }, [includeRewards]);

  const fetchData = (pageNum, cancelToken) => {
    setCurrentPage(pageNum);
    if (pageNum === 1) {
      fetchWalletTokenTransactionsListRequestLoading(
        tokenSymbol,
        pageSize,
        includeRewards,
        pageNum,
        cancelToken
      );
    } else {
      fetchWalletTokenTransactionsListRequestLoading(
        tokenSymbol,
        pageSize,
        includeRewards,
        pageNum,
        cancelToken,
        minBlockHeight
      );
    }
  };

  useEffect(() => {
    return () => {
      sourceArray.current.map((source) => {
        source.cancel('reqest cancel');
      });
    };
  }, []);

  useEffect(() => {
    setTableRows([...data]);
  }, [data]);

  useEffect(() => {
    source = axios.CancelToken.source();
    sourceArray.current.push(source);
    fetchData(currentPage, source.token);
  }, [includeRewards]);

  useEffect(() => {
    setData({
      ...reqData,
      blockHeight: blockCount,
    });
  }, [blockCount]);

  const maxBlock = () => {
    setData({
      ...reqData,
      blockHeight: blockCount,
    });
  };

  const getTxnsTypeIcon = (type: string) => {
    const RECEIVE = 'receive';
    const SEND = 'send';
    if ([SENT_CATEGORY_LABEL, ACCOUNT_TO_UTXOS_LABEL, SEND].includes(type)) {
      return <MdArrowUpward className={styles.typeIcon} />;
    }
    if (
      [
        COMMISSION_CATEGORY_LABEL,
        RECIEVE_CATEGORY_LABEL,
        REWARDS_CATEGORY_LABEL,
        REWARD_CATEGORY_LABEL,
        RECEIVE,
        REMOVE_LIQUIDITY_LABEL,
      ].includes(type)
    ) {
      return <MdArrowDownward className={styles.typeIconDownward} />;
    }
    if (type === POOL_SWAP_CATEGORY_LABEL) {
      return <MdCompareArrows className={styles.typeIcon} />;
    }
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
      case REWARDS_CATEGORY_LABEL:
      case REWARD_CATEGORY_LABEL:
        label = I18n.t(`${swapLabel}.addLiquidity.reward`);
        break;
      case ACCOUNT_TO_UTXOS_LABEL:
        label = I18n.t(`${walletTxnsLabel}.accountToUtxos`);
        break;
      case ANY_ACCOUNT_TO_ACCOUNT_LABEL:
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
      case COMMISSION_CATEGORY_LABEL:
        label = I18n.t(`${walletLabel}.commission`);
        break;
      default:
        break;
    }
    return label;
  };

  const handleCsvButtonClick = () => {
    const isOpen = !CsvModalOpen;
    setCsvModalOpen(isOpen);
  };

  const walletTxnList = () => {
    if (isLoading || combineAccountHistoryData.isLoading)
      return <div>{I18n.t('containers.wallet.walletPage.loading')}</div>;
    if (isError || combineAccountHistoryData.isError)
      return <div>{isError || combineAccountHistoryData.isError}</div>;
    if (!data.length || !tableRows.length)
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
                    {item.amountData.map((amountD, amountId) => (
                      <div
                        key={`${amountD.unit}-${amountId}`}
                        className={
                          item.type === REWARD_CATEGORY_LABEL ||
                          item.type === RECIEVEE_CATEGORY_LABEL ||
                          item.type === REWARDS_CATEGORY_LABEL ||
                          new BigNumber(amountD.amount).gt(0)
                            ? `${styles.colorGreen} ${styles.amount}`
                            : styles.amount
                        }
                      >
                        {amountD.amount}
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
          label={I18n.t('containers.wallet.walletPage.txPaginationRange', {
            to,
            total,
            from,
          })}
          data={data}
          currentPage={currentPage}
          pagesCount={pagesCount}
          handlePageClick={fetchData}
          cancelToken={source?.token}
        />
      </>
    );
  };

  return (
    <section className='mb-5'>
      <div className={styles.container}>
        <h2>{I18n.t('containers.wallet.walletPage.transactions')}</h2>
        <div className='btn-group'>
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
          <Button
            className={styles.includeReward}
            color='link'
            size='sm'
            onClick={handleCsvButtonClick}
          >
            <MdFileDownload />
            <span className='d-lg-inline'>
              {I18n.t('containers.wallet.walletPage.exportData')}
            </span>
          </Button>
          <DownloadCsvModal
            downloadDisable={downloadDisable}
            reqData={reqData}
            transactionData={transactionData}
            handleDownloadWindow={handleDownloadWindow}
            filename={fileName}
            error={error}
            handleCheckBox={handleCheckBox}
            handleRegularNumInputs={handleRegularNumInputs}
            toggle={toggle}
            tokenSymbol={tokenSymbol}
            CsvModalOpen={CsvModalOpen}
            handleCsvButtonClick={handleCsvButtonClick}
            maxBlock={maxBlock}
          />
        </div>
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
    blockchain,
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
    blockCount: blockchain.blockCount,
  };
};

const mapDispatchToProps = {
  fetchWalletTxns: (currentPage, pageSize, intialLoad) =>
    fetchWalletTxnsRequest({ currentPage, pageSize, intialLoad }),
  fetchWalletTokenTransactionsListRequestLoading: (
    symbol: string,
    limit: number,
    includeRewards: boolean,
    pageNum: number,
    cancelToken?: string,
    minBlockHeight?: number
  ) =>
    fetchWalletTokenTransactionsListRequestLoading({
      symbol,
      limit,
      includeRewards,
      pageNum,
      cancelToken,
      minBlockHeight,
    }),
  fetchBlockDataForTrxRequestLoading: (trxArray) =>
    fetchBlockDataForTrxRequestLoading(trxArray),
  fetchWalletTokenTransactionsListResetRequest,
  accountHistoryCountRequest: ({ no_rewards, token }) =>
    accountHistoryCountRequest({ no_rewards, token }),
  fetchBlockCount: () => fetchBlockCountRequest(),
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletTxns);
