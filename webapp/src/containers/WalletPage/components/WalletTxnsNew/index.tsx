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
} from '../../reducer';
import {
  RECIEVE_CATEGORY_LABEL,
  SENT_CATEGORY_LABEL,
  WALLET_TXN_PAGE_SIZE,
} from '../../../../constants';
import Pagination from '../../../../components/Pagination';
import { numberWithCommas } from '../../../../utils/utility';
import cloneDeep from 'lodash/cloneDeep';
import EllipsisText from 'react-ellipsis-text';

interface WalletTxnsProps {
  unit: string;
  walletTxns: {
    txnId: string;
    category: string;
    time: string;
    amount: number;
    unit: string;
    height: number;
  }[];
  walletTxnCount: number;
  fetchWalletTxns: (
    currentPage: number,
    pageSize: number,
    intialLoad?: boolean
  ) => void;
  stopPagination: boolean;
  tokenSymbol?: string;
  tokenAddress?: string;
  fetchWalletTokenTransactionsListRequestLoading: (
    symbol?: string,
    owner?: string
  ) => void;
  data: any[];
  isLoading: boolean;
  isError: string;
}

const WalletTxns: React.FunctionComponent<WalletTxnsProps> = (
  props: WalletTxnsProps
) => {
  const {
    fetchWalletTokenTransactionsListRequestLoading,
    tokenAddress,
    tokenSymbol,
    data,
    isLoading,
    isError,
  } = props;
  const [currentPage, setCurrentPage] = useState(1);
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [includeRewards, setIncludeRewards] = useState(false);
  const pageSize = WALLET_TXN_PAGE_SIZE;
  const total = data.length;
  const pagesCount = Math.ceil(total / pageSize);
  const to = (currentPage - 1) * pageSize + 1;
  const from = Math.min(total, currentPage * pageSize);

  useEffect(() => {
    fetchWalletTokenTransactionsListRequestLoading(tokenSymbol, tokenAddress);
  }, []);

  const fetchData = (pageNum) => {
    const newCloneTableData = cloneDeep(data);
    setCurrentPage(pageNum);
    const rows = newCloneTableData
      .slice((pageNum - 1) * pageSize, pageNum * pageSize)
      .filter((item) => {
        if (!includeRewards) return item.category !== 'Rewards';
        return !!item.category;
      });
    setTableRows(rows);
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [data, includeRewards]);

  const getTxnsTypeIcon = (type: string) => {
    if (type === SENT_CATEGORY_LABEL) {
      return <MdArrowUpward className={styles.typeIcon} />;
    }
    if (type === RECIEVE_CATEGORY_LABEL) {
      return <MdArrowDownward className={styles.typeIconDownward} />;
    }
    return <MdCompareArrows className={styles.typeIcon} />;
  };

  const getAmountClass = (type: string) => {
    if (type === RECIEVE_CATEGORY_LABEL) {
      return styles.colorGreen;
    }
    return '';
  };

  const walletTxnList = () => {
    if (isLoading)
      return <div>{I18n.t('containers.wallet.walletPage.loading')}</div>;
    if (isError) return <div>{isError}</div>;
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
                  <td>{getTxnsTypeIcon(item.category)}</td>
                  <td>
                    <div>{item.category}</div>
                    <div className={styles.unit}>{item.blockData.time}</div>
                  </td>
                  <td>
                    <div className={styles.txidvalue}>
                      <EllipsisText text={item.txid} length={60} />
                    </div>
                  </td>
                  <td
                    className={`text-right ${getAmountClass(item.category)}`}
                  >{`${numberWithCommas(item.amount)} ${item.symbolKey}`}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
        <Pagination
          label={I18n.t('containers.wallet.walletPage.paginationRange', {
            to,
            total,
            from,
          })}
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
    },
  } = state;
  return {
    unit: settings.appConfig.unit,
    isLoading,
    data,
    isError,
  };
};

const mapDispatchToProps = {
  fetchWalletTxns: (currentPage, pageSize, intialLoad) =>
    fetchWalletTxnsRequest({ currentPage, pageSize, intialLoad }),
  fetchWalletTokenTransactionsListRequestLoading: (
    symbol?: string,
    owner?: string
  ) => fetchWalletTokenTransactionsListRequestLoading({ symbol, owner }),
};

export default connect(mapStateToProps, mapDispatchToProps)(WalletTxns);
