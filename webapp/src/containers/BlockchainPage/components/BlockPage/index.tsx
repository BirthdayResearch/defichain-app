import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { connect } from 'react-redux';
import { Button, Row, Col, Card, CardBody, ButtonGroup } from 'reactstrap';
import {
  MdArrowBack,
  MdChevronLeft,
  MdChevronRight,
  MdLaunch,
} from 'react-icons/md';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import KeyValueLi from '../../../../components/KeyValueLi';
import BlockTxn from '../BlockTxn';
import { I18n } from 'react-redux-i18n';
import {
  fetchTxnsRequest,
  fetchBlockDataRequest,
  fetchBlockCountRequest,
} from '../../reducer';
import {
  BLOCKCHAIN_BASE_PATH,
  BLOCKCHAIN_BLOCK_BASE_PATH,
  BLOCK_TXN_PAGE_SIZE,
  DEFICHAIN_BLOCKS,
  MAIN,
} from '../../../../constants';
import Pagination from '../../../../components/Pagination';
import { ITxn, IBlockData } from '../../interfaces';
import {
  getNetworkType,
  getPageTitle,
  toSha256,
} from '../../../../utils/utility';
import LruCache from '../../../../utils/lruCache';
import Header from '../../../HeaderComponent';
import openNewTab from '../../../../utils/openNewTab';

interface RouteParams {
  id?: string;
  height: string;
}

interface BlockPageProps extends RouteComponentProps<RouteParams> {
  blockData: IBlockData;
  unit: string;
  txns: ITxn[];
  blockCount: number;
  txnCount: number;
  isLoadingTxns: boolean;
  fetchTxns: (blockNumber: number, pageNo: number, pageSize: number) => void;
  fetchBlockData: (blockNumber: number) => void;
  fetchBlockCountRequest: () => void;
}

const BlockPage: React.FunctionComponent<BlockPageProps> = (
  props: BlockPageProps
) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = BLOCK_TXN_PAGE_SIZE;

  const { txnCount: total } = props;
  const pagesCount = Math.ceil(total / pageSize);
  const to = Math.min(currentPage * pageSize, total);
  const from = (currentPage - 1) * pageSize;

  const { height } = props.match.params;
  const {
    nTxns,
    difficulty,
    bits,
    version,
    nonce,
    hash,
    merkleRoot,
  } = props.blockData;

  const blockNumber = Number(height);

  const fetchData = (pageNumber) => {
    setCurrentPage(pageNumber);
    props.fetchBlockCountRequest();
    const key = toSha256(`${blockNumber} ${pageNumber} ${pageSize}`);
    if (!LruCache.get(key)) props.fetchTxns(blockNumber, pageNumber, pageSize);
  };

  useEffect(() => {
    props.fetchBlockCountRequest();
    props.fetchBlockData(blockNumber);
    props.fetchTxns(blockNumber, currentPage, pageSize);
  }, []);

  const key = toSha256(`${blockNumber} ${currentPage} ${pageSize}`);
  const txns: ITxn[] = LruCache.get(key) || props.txns;

  const network = getNetworkType();

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {getPageTitle(
            I18n.t('containers.blockChainPage.blockPage.title', {
              blockNo: blockNumber,
            })
          )}
        </title>
      </Helmet>
      <Header>
        <Button
          to={BLOCKCHAIN_BASE_PATH}
          tag={NavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.blockChainPage.blockPage.blockchain')}
          </span>
        </Button>
        <h1>
          {I18n.t('containers.blockChainPage.blockPage.block')}&nbsp;
          {blockNumber}
        </h1>
        <ButtonGroup>
          <Button
            color='link'
            onClick={() =>
              openNewTab(`${DEFICHAIN_BLOCKS}/${hash}${ getNetworkType() !== MAIN ? `?network=TestNet` : '' }`)
            }
          >
            <MdLaunch />
            <span className='d-lg-inline'>
              {I18n.t('containers.blockChainPage.blockChainPage.explorer')}
            </span>
          </Button>
        </ButtonGroup>
      </Header>
      <div className='content'>
        <section className='mb-5'>
          <Row className='mb-4'>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t(
                  'containers.blockChainPage.blockPage.noOfTransactions'
                )}
                value={(nTxns || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.blockChainPage.blockPage.difficulty')}
                value={(difficulty || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.blockChainPage.blockPage.height')}
                value={(blockNumber || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.blockChainPage.blockPage.bits')}
                value={bits}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.blockChainPage.blockPage.version')}
                value={(version || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.blockChainPage.blockPage.nonce')}
                value={(nonce || '').toString()}
              />
            </Col>
            <Col>
              <KeyValueLi
                label={I18n.t('containers.blockChainPage.blockPage.blockHash')}
                value={hash}
                copyable='true'
              />
            </Col>
            <Col>
              <KeyValueLi
                label={I18n.t('containers.blockChainPage.blockPage.merkleRoot')}
                value={merkleRoot}
                copyable='true'
              />
            </Col>
          </Row>
          <div className='d-flex justify-content-between'>
            {blockNumber - 1 > 0 ? (
              <Button
                to={`${BLOCKCHAIN_BLOCK_BASE_PATH}/${blockNumber - 1}`}
                tag={NavLink}
                color='outline-primary'
                className='header-bar-back'
              >
                <MdChevronLeft />
                <span className='d-lg-inline'>{blockNumber - 1}</span>
              </Button>
            ) : (
              <a></a>
            )}
            {blockNumber + 1 <= props.blockCount && (
              <Button
                to={`${BLOCKCHAIN_BLOCK_BASE_PATH}/${blockNumber + 1}`}
                tag={NavLink}
                color='outline-primary'
                className='header-bar-back'
              >
                <span className='d-lg-inline'>{blockNumber + 1}</span>
                <MdChevronRight />
              </Button>
            )}
          </div>
        </section>
        <section>
          <h2>{I18n.t('containers.blockChainPage.blockPage.transactions')}</h2>
          {props.isLoadingTxns ? (
            <>{I18n.t('containers.blockChainPage.blockTxn.loading')}</>
          ) : total ? (
            <>
              {txns.map((txn, index) => (
                <BlockTxn
                  txn={txn}
                  key={`${txn.hash}${index}`}
                  unit={props.unit}
                />
              ))}
              <Pagination
                label={I18n.t(
                  'containers.blockChainPage.blockTxn.paginationRange',
                  {
                    to,
                    total,
                    from: from + 1,
                  }
                )}
                currentPage={currentPage}
                pagesCount={pagesCount}
                handlePageClick={fetchData}
              />
            </>
          ) : (
            <Card className='table-responsive-md'>
              <CardBody>
                {I18n.t('containers.blockChainPage.blockTxn.noTransactions')}
              </CardBody>
            </Card>
          )}
        </section>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { blockchain, settings } = state;
  const { unit } = settings.appConfig;
  const {
    txns,
    isTxnsLoaded,
    isLoadingTxns,
    txnsLoadError,
    txnCount,
    blockData,
    blockCount,
  } = blockchain;
  return {
    unit,
    txns,
    txnCount,
    blockData,
    blockCount,
    isTxnsLoaded,
    isLoadingTxns,
    txnsLoadError,
  };
};

const mapDispatchToProps = {
  fetchTxns: (blockNumber, pageNo, pageSize) =>
    fetchTxnsRequest({ blockNumber, pageNo, pageSize }),
  fetchBlockData: (blockNumber) => fetchBlockDataRequest({ blockNumber }),
  fetchBlockCountRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(BlockPage);
