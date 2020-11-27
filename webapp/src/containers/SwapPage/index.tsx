import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { NavLink as RRNavLink } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import {
  MdAdd,
  MdCheckCircle,
  MdComputer,
  MdErrorOutline,
  MdPerson,
  MdPieChart,
  MdVpnKey,
} from 'react-icons/md';
import {
  Button,
  ButtonGroup,
  Col,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';

import {
  fetchPoolPairListRequest,
  fetchTokenBalanceListRequest,
  addPoolLiquidityRequest,
  fetchPoolsharesRequest,
  fetchTestPoolSwapRequest,
  poolSwapRequest,
  fetchUtxoDfiRequest,
  fetchMaxAccountDfiRequest,
  resetTestPoolSwapError,
} from './reducer';
import {
  calculateLPFee,
  conversionRatio,
  countDecimals,
  getTokenAndBalanceMap,
  selectedPoolPair,
} from '../../utils/utility';
import {
  SWAP,
  POOL,
  CREATE_POOL_PAIR_PATH,
  WALLET_TOKENS_PATH,
  SWAP_PATH,
  IS_DEX_INTRO_SEEN,
} from '../../constants';
import SwapTab from './components/SwapTab';
import { BigNumber } from 'bignumber.js';
import Spinner from '../../components/Svg/Spinner';
import styles from './swap.module.scss';
import PersistentStore from '../../utils/persistentStore';
import Header from '../HeaderComponent';

interface SwapPageProps {
  history?: any;
  location?: any;
  poolshares: any[];
  fetchTestPoolSwapRequest: (formState) => void;
  fetchPoolsharesRequest: () => void;
  poolPairList: any[];
  tokenBalanceList: string[];
  testPoolSwap: string;
  isLoadingTestPoolSwap: boolean;
  isErrorTestPoolSwap: string;
  poolSwapRequest: (formState) => void;
  isLoadingPoolSwap: boolean;
  isErrorPoolSwap: string;
  isPoolSwapLoaded: boolean;
  poolSwapHash: string;
  fetchPoolPairListRequest: () => void;
  fetchTokenBalanceListRequest: () => void;
  addPoolLiquidityRequest: (poolData) => void;
  isLoadingAddPoolLiquidity: boolean;
  isAddPoolLiquidityLoaded: boolean;
  addPoolLiquidityHash: string;
  isErrorAddingPoolLiquidity: string;
  walletBalance: number;
  utxoDfi: number;
  fetchUtxoDfiRequest: () => void;
  maxAccountDfi: number;
  fetchMaxAccountDfiRequest: () => void;
  resetTestPoolSwapError: () => void;
}

const SwapPage: React.FunctionComponent<SwapPageProps> = (
  props: SwapPageProps
) => {
  const urlParams = new URLSearchParams(props.location.search);
  const tab = urlParams.get('tab');
  const [activeTab, setActiveTab] = useState<string>(tab ? tab : SWAP);
  const [swapStep, setSwapStep] = useState<string>(
    !PersistentStore.get(IS_DEX_INTRO_SEEN) ? 'first' : 'default'
  );
  const [allowCalls, setAllowCalls] = useState<boolean>(false);
  const [formState, setFormState] = useState<any>({
    amount1: '',
    hash1: '',
    symbol1: '',
    amount2: '0',
    hash2: '',
    symbol2: '',
    balance1: '',
    balance2: '',
  });

  const {
    poolPairList,
    fetchPoolPairListRequest,
    tokenBalanceList,
    fetchTokenBalanceListRequest,
    fetchTestPoolSwapRequest,
    testPoolSwap,
    poolSwapRequest,
    isErrorTestPoolSwap,
    isLoadingTestPoolSwap,
    isLoadingPoolSwap,
    isErrorPoolSwap,
    poolSwapHash,
    walletBalance,
    utxoDfi,
    fetchUtxoDfiRequest,
    maxAccountDfi,
    fetchMaxAccountDfiRequest,
    resetTestPoolSwapError,
  } = props;

  useEffect(() => {
    fetchPoolPairListRequest();
    fetchTokenBalanceListRequest();
    fetchUtxoDfiRequest();
    fetchMaxAccountDfiRequest();
    resetTestPoolSwapError();
  }, []);

  useEffect(() => {
    isValidAmount() &&
      fetchTestPoolSwapRequest({
        formState,
      });
  }, [formState.amount1, formState.hash1, formState.hash2]);

  const isValidAmount = () => {
    if (formState[`balance1`] && formState[`balance2`]) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    setFormState({
      ...formState,
      amount2: testPoolSwap,
    });
  }, [testPoolSwap]);

  useEffect(() => {
    if (!testPoolSwap) {
      setFormState({
        ...formState,
        amount2: '-',
      });
    }
  }, [isErrorTestPoolSwap]);

  useEffect(() => {
    if (allowCalls && !isLoadingPoolSwap) {
      if (!isErrorPoolSwap && poolSwapHash) {
        setSwapStep('success');
      }
      if (isErrorPoolSwap && !poolSwapHash) {
        setSwapStep('failure');
      }
    }
  }, [poolSwapHash, isErrorPoolSwap, isLoadingPoolSwap, allowCalls]);

  const tokenMap = getTokenAndBalanceMap(
    poolPairList,
    tokenBalanceList,
    walletBalance
  );

  const handleChange = (e) => {
    if (countDecimals(e.target.value) <= 8) {
      setFormState({
        ...formState,
        [e.target.name]: e.target.value,
        amount2: testPoolSwap,
      });
    }
  };

  const handleDropDown = (
    hash: string,
    field1: string,
    symbol: string,
    field2: string,
    balance: string,
    field3: string
  ) => {
    setFormState({
      ...formState,
      [field1]: hash,
      [field2]: symbol,
      [field3]: balance,
    });
  };

  const setMaxValue = (field: string, value: string) => {
    setFormState({
      ...formState,
      [field]: value,
      amount2: testPoolSwap,
    });
  };

  const isValid = () => {
    if (
      formState[`amount1`] &&
      formState[`balance1`] &&
      new BigNumber(formState[`amount1`]).lte(formState[`balance1`]) &&
      // formState[`amount2`] &&
      formState[`balance2`]
      // new BigNumber(formState[`amount2`]).lte(formState[`balance2`])
    ) {
      return true;
    } else {
      return false;
    }
  };

  const isAmountInsufficient = () => {
    if (
      formState[`amount1`] &&
      formState[`balance1`] &&
      new BigNumber(formState[`amount1`]).isGreaterThan(
        formState[`balance1`]
      ) &&
      formState[`balance2`]
    ) {
      return true;
    } else {
      return false;
    }
  };

  const filterBySymbol = (symbolKey: string, isSelected: boolean) => {
    const filterMap: Map<string, any> = new Map();
    if (isSelected && formState.hash1 ^ formState.hash2) {
      const filterArray = filterByPoolPairs(symbolKey);
      const tokenArray = Array.from(tokenMap.keys());
      const finalArray = filterArray.filter((value) =>
        tokenArray.includes(value)
      );
      finalArray.map((symbol: string) => {
        if (symbol !== formState[symbolKey] && tokenMap.has(symbol)) {
          filterMap.set(symbol, tokenMap.get(symbol));
        }
      });
    } else {
      const tokenArray = Array.from(tokenMap.keys());
      tokenArray.map((symbol: string) => {
        if (symbol !== formState[symbolKey] && tokenMap.has(symbol)) {
          filterMap.set(symbol, tokenMap.get(symbol));
        }
      });
    }
    return filterMap;
  };

  const filterByPoolPairs = (symbolKey: string) => {
    const filterArray = poolPairList.reduce((tokenArray, poolPair) => {
      if (poolPair.tokenA === formState[symbolKey]) {
        tokenArray.push(poolPair.tokenB);
      } else if (poolPair.tokenB === formState[symbolKey]) {
        tokenArray.push(poolPair.tokenA);
      }
      return tokenArray;
    }, []);
    return filterArray;
  };

  const swapStepConfirm = () => {
    setSwapStep('confirm');
  };

  const swapStepDefault = () => {
    setSwapStep('default');
  };

  const handleSwap = () => {
    setAllowCalls(true);
    setSwapStep('loading');
    poolSwapRequest({
      formState,
    });
  };

  const handleInterchange = () => {
    setFormState({
      amount1: formState.amount2,
      hash1: formState.hash2,
      symbol1: formState.symbol2,
      amount2: formState.amount1,
      hash2: formState.hash1,
      symbol2: formState.symbol1,
      balance1: formState.balance2,
      balance2: formState.balance1,
    });
  };

  const handleChangeSwap = () => {
    PersistentStore.set(IS_DEX_INTRO_SEEN, true);
    setSwapStep('default');
  };

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.swap.swapPage.title')}</title>
      </Helmet>
      <Header>
        <h1>{I18n.t('containers.swap.swapPage.decentralizedExchange')}</h1>
        {/* <Nav pills className='justify-content-center'>
          <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === SWAP,
              })}
              onClick={() => {
                setActiveTab(SWAP);
              }}
            >
              {I18n.t('containers.swap.swapPage.swap')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === POOL,
              })}
              onClick={() => {
                setActiveTab(POOL);
              }}
            >
              {I18n.t('containers.swap.swapPage.pool')}
            </NavLink>
          </NavItem>
        </Nav> */}
        <ButtonGroup
          style={{
            visibility: activeTab !== POOL ? 'hidden' : 'visible',
          }}
        >
          <Button to={CREATE_POOL_PAIR_PATH} tag={RRNavLink} color='link'>
            <MdAdd />
            <span className='d-lg-inline'>
              {I18n.t('containers.swap.swapPage.liquidity')}
            </span>
          </Button>
        </ButtonGroup>
      </Header>
      {PersistentStore.get(IS_DEX_INTRO_SEEN) ? (
        <div className='content'>
          <TabContent activeTab={activeTab}>
            <TabPane tabId={SWAP}>
              <SwapTab
                label={I18n.t('containers.swap.swapTab.from')}
                tokenMap={tokenMap}
                filterBySymbol={filterBySymbol}
                name={1}
                isLoadingTestPoolSwap={isLoadingTestPoolSwap}
                formState={formState}
                handleChange={handleChange}
                handleDropdown={handleDropDown}
                setMaxValue={setMaxValue}
                handleInterchange={handleInterchange}
                dropdownLabel={
                  formState.symbol1
                    ? formState.symbol1
                    : I18n.t('components.swapCard.selectAToken')
                }
              />
            </TabPane>
            <TabPane tabId={POOL}>
              {/* <PoolTab history={props.history} /> */}
            </TabPane>
          </TabContent>
          {isValid() &&
            activeTab === SWAP &&
            !isAmountInsufficient() &&
            !isErrorTestPoolSwap && (
              <Row>
                <Col md='12'>
                  <Row className='align-items-center'>
                    <Col>
                      <span>{I18n.t('containers.swap.swapPage.price')}</span>
                    </Col>
                    <Col className={`${styles.valueTxt}`}>
                      {`${Number(
                        conversionRatio(formState, poolPairList)
                      ).toFixed(8)} ${formState.symbol2} per ${
                        formState.symbol1
                      }`}
                      <br />
                      {`${(
                        1 / Number(conversionRatio(formState, poolPairList))
                      ).toFixed(8)} ${formState.symbol1} per ${
                        formState.symbol2
                      }`}
                    </Col>
                  </Row>
                  <hr />
                  <Row className='align-items-center'>
                    <Col>
                      <span>
                        {I18n.t('containers.swap.swapPage.minimumReceived')}
                      </span>
                    </Col>
                    <Col
                      className={`${styles.valueTxt}`}
                    >{`${formState.amount2} ${formState.symbol2}`}</Col>
                  </Row>
                  <hr />
                  <Row className='align-items-center'>
                    <Col>
                      <span>
                        {I18n.t(
                          'containers.swap.swapPage.liquidityProviderFee'
                        )}
                      </span>
                    </Col>
                    <Col className={`${styles.valueTxt}`}>
                      {calculateLPFee(formState, poolPairList)}
                    </Col>
                  </Row>
                  <hr />
                </Col>
              </Row>
            )}
        </div>
      ) : (
        <div className='content'>
          <>
            <section>
              {I18n.t('containers.swap.swapPage.decentralizedExchangeInfo')}
            </section>
            <div className='m-5 '>
              <Row>
                <Col xs='12' md='12' className='my-3'>
                  <Row className={`${styles.buttonLink} p-0`}>
                    <Col xs='1' md='1' className='vertical-middle'>
                      <MdVpnKey />
                    </Col>
                    <Col xs='11' md='11' className='text-left'>
                      <h4 className='m-0'>
                        {I18n.t('containers.swap.swapPage.yourPrivateKey')}
                      </h4>
                      <span>
                        {I18n.t('containers.swap.swapPage.yourPrivateKeyInfo')}
                      </span>
                    </Col>
                  </Row>
                </Col>
                <Col xs='12' md='12' className='my-3'>
                  <Row className={`${styles.buttonLink} p-0`}>
                    <Col xs='1' md='1' className='vertical-middle'>
                      <MdPerson />
                    </Col>
                    <Col xs='11' md='11' className='text-left'>
                      <h4 className='m-0'>
                        {I18n.t('containers.swap.swapPage.nonCustodial')}
                      </h4>
                      <span>
                        {I18n.t('containers.swap.swapPage.nonCustodialInfo')}
                      </span>
                    </Col>
                  </Row>
                </Col>
                <Col xs='12' md='12' className='my-3'>
                  <Row className={`${styles.buttonLink} p-0`}>
                    <Col xs='1' md='1' className='vertical-middle'>
                      <MdComputer />
                    </Col>
                    <Col xs='11' md='11' className='text-left'>
                      <h4 className='m-0'>
                        {I18n.t(
                          'containers.swap.swapPage.decentralizedInterface'
                        )}
                      </h4>
                      <span>
                        {I18n.t(
                          'containers.swap.swapPage.decentralizedInterfaceInfo'
                        )}
                      </span>
                    </Col>
                  </Row>
                </Col>
                <Col xs='12' md='12' className='my-3'>
                  <Row className={`${styles.buttonLink} p-0`}>
                    <Col xs='1' md='1' className='vertical-top'>
                      <MdPieChart />
                    </Col>
                    <Col xs='11' md='11' className='text-left '>
                      <h4 className='m-0'>
                        {I18n.t(
                          'containers.swap.swapPage.poweredLiquidityPools'
                        )}
                      </h4>
                      <span>
                        {I18n.t(
                          'containers.swap.swapPage.poweredLiquidityPoolsInfo'
                        )}
                      </span>
                    </Col>
                  </Row>
                </Col>
              </Row>
              {/* <div
                  className={`${styles.cursorPointer} justify-content-center m-2`}
                  onClick={() => openNewTab(LIQUIDITY_MINING_YOUTUBE_LINK)}
                >
                  <img src={LiquidityMining} height='96px' width='171px' />
                  <div className={`${styles.txtColor} text-center`}>
                    {I18n.t('containers.liquidity.liquidityPage.watchVideo')}
                  </div>
                </div>
                <div
                  className={`${styles.cursorPointer} justify-content-center m-2`}
                  onClick={() => openNewTab(DEFICHAIN_DEX_YOUTUBE_LINK)}
                >
                  <img src={DefichainDEX} height='96px' width='171px' />
                  <div className={`${styles.txtColor} text-center`}>
                    {I18n.t('containers.liquidity.liquidityPage.watchVideo')}
                  </div>
                </div>
                <div
                  className={`${styles.cursorPointer} justify-content-center m-2`}
                  onClick={() => openNewTab(DEFICHAIN_IMPERMANENT_YOUTUBE_LINK)}
                >
                  <img src={DefichainImpermanent} height='96px' width='171px' />
                  <div className={`${styles.txtColor} text-center`}>
                    {I18n.t('containers.liquidity.liquidityPage.watchVideo')}
                  </div>
                </div> */}
            </div>
          </>
        </div>
      )}
      {activeTab === SWAP && (
        <footer className='footer-bar'>
          <div
            className={classnames({
              'd-none': swapStep !== 'first',
            })}
          >
            <Row>
              <Col className='text-center w-100'>
                <Button
                  color='primary'
                  className={styles.width40}
                  onClick={handleChangeSwap}
                >
                  {I18n.t('containers.swap.swapPage.continue')}
                </Button>
              </Col>
            </Row>
          </div>
          <div
            className={classnames({
              'd-none': swapStep !== 'default',
            })}
          >
            <Row className='justify-content-between align-items-center'>
              {!isAmountInsufficient() && !isErrorTestPoolSwap ? (
                <Col className='col-auto'>
                  {isValid()
                    ? I18n.t('containers.swap.swapPage.readySwap')
                    : I18n.t('containers.swap.swapPage.enterAnAmount')}
                </Col>
              ) : (
                <Col className='col-auto'>
                  <span className='text-danger'>
                    {I18n.t('containers.swap.swapPage.somethingWentWrong')}
                  </span>
                </Col>
              )}
              <Col className='d-flex justify-content-end'>
                <Button
                  color='primary'
                  disabled={!isValid() || !!isErrorTestPoolSwap}
                  onClick={swapStepConfirm}
                >
                  {I18n.t('containers.swap.swapPage.continue')}
                </Button>
              </Col>
            </Row>
          </div>
          <div
            className={classnames({
              'd-none': swapStep !== 'confirm',
            })}
          >
            <div className='footer-sheet'>
              <dl className='row'>
                <dt className='col-sm-4 text-right'>
                  {I18n.t('containers.swap.swapPage.from')}
                </dt>
                <dd className='col-sm-8'>
                  {`${formState.amount1} ${formState.symbol1}`}
                </dd>
                <dt className='col-sm-4 text-right'>
                  {I18n.t('containers.swap.swapPage.to')}
                </dt>
                <dd className='col-sm-8'>
                  {`${formState.amount2} ${formState.symbol2}`}
                </dd>
                <dt className='col-sm-4 text-right'>
                  {I18n.t('containers.swap.swapPage.minimumReceived')}
                </dt>
                <dd className='col-sm-8'>
                  {`${formState.amount2} ${formState.symbol2}`}
                </dd>
                <dt className='col-sm-4 text-right'>
                  {I18n.t('containers.swap.swapPage.liquidityProviderFee')}
                </dt>
                <dd className='col-sm-8'>
                  {isValid() && calculateLPFee(formState, poolPairList)}
                </dd>
              </dl>
            </div>
            <Row className='justify-content-between align-items-center'>
              <Col className='col'>
                {I18n.t('containers.swap.swapPage.verifyTransactionSwap')}
              </Col>
              <Col className='d-flex justify-content-end'>
                <Button color='link' className='mr-3' onClick={swapStepDefault}>
                  {I18n.t('containers.swap.swapPage.cancel')}
                </Button>
                <Button color='primary' onClick={() => handleSwap()}>
                  {I18n.t('containers.swap.swapPage.swap')}&nbsp;
                </Button>
              </Col>
            </Row>
          </div>
          <div
            className={classnames({
              'd-none': swapStep !== 'success',
            })}
          >
            <div className='footer-sheet'>
              <div className='text-center'>
                <MdCheckCircle className='footer-sheet-icon' />
                <h2>
                  {I18n.t('containers.swap.swapPage.transactionComplete')}
                </h2>
                <p>
                  {I18n.t('containers.swap.swapPage.transactionSuccessMsg')}
                </p>
                <div>
                  <b>{I18n.t('containers.swap.swapPage.txHash')}</b> : &nbsp;
                  <span>{poolSwapHash}</span>
                </div>
              </div>
            </div>
            <Row className='justify-content-between align-items-center'>
              <Col className='d-flex justify-content-end'>
                <Button
                  to={WALLET_TOKENS_PATH}
                  color='link'
                  tag={RRNavLink}
                  className='mr-3'
                >
                  {I18n.t('containers.swap.swapPage.goToWallet')}
                </Button>
                <Button to={SWAP_PATH} tag={RRNavLink} color='primary'>
                  {I18n.t('containers.swap.swapPage.ok')}&nbsp;
                </Button>
              </Col>
            </Row>
          </div>
          <div
            className={classnames({
              'd-none': swapStep !== 'loading',
            })}
          >
            <div className='footer-sheet'>
              <div className='text-center'>
                <Spinner />
                &nbsp;
                {I18n.t('containers.swap.swapPage.swaping')}
              </div>
            </div>
          </div>
          <div
            className={classnames({
              'd-none': swapStep !== 'failure',
            })}
          >
            <div className='footer-sheet'>
              <div className='text-center'>
                <MdErrorOutline
                  className={classnames({
                    'footer-sheet-icon': true,
                    [styles[`error-dailog`]]: true,
                  })}
                />
                <p>{isErrorPoolSwap}</p>
              </div>
            </div>
            <div className='d-flex align-items-center justify-content-center'>
              <Button
                color='primary'
                to={`${SWAP_PATH}?tab=pool`}
                tag={NavLink}
              >
                {I18n.t('containers.swap.addLiquidity.backToPool')}
              </Button>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  const {
    poolPairList,
    tokenBalanceList,
    isLoadingAddPoolLiquidity,
    isAddPoolLiquidityLoaded,
    addPoolLiquidityHash,
    isErrorAddingPoolLiquidity,
    poolshares,
    testPoolSwap,
    isErrorTestPoolSwap,
    isLoadingTestPoolSwap,
    isLoadingPoolSwap,
    isErrorPoolSwap,
    isPoolSwapLoaded,
    poolSwapHash,
    utxoDfi,
    maxAccountDfi,
  } = state.swap;
  const { walletBalance } = state.wallet;
  return {
    poolPairList,
    tokenBalanceList,
    isLoadingAddPoolLiquidity,
    isAddPoolLiquidityLoaded,
    addPoolLiquidityHash,
    isErrorAddingPoolLiquidity,
    poolshares,
    testPoolSwap,
    isErrorTestPoolSwap,
    isLoadingTestPoolSwap,
    isLoadingPoolSwap,
    isErrorPoolSwap,
    isPoolSwapLoaded,
    poolSwapHash,
    walletBalance,
    utxoDfi,
    maxAccountDfi,
  };
};

const mapDispatchToProps = {
  fetchTestPoolSwapRequest,
  fetchPoolPairListRequest,
  fetchTokenBalanceListRequest,
  addPoolLiquidityRequest,
  fetchPoolsharesRequest,
  poolSwapRequest,
  fetchUtxoDfiRequest,
  fetchMaxAccountDfiRequest,
  resetTestPoolSwapError,
};

export default connect(mapStateToProps, mapDispatchToProps)(SwapPage);
