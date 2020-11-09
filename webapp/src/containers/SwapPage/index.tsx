import React, { useState, useEffect } from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MdAdd, MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import {
  Button,
  ButtonGroup,
  Col,
  FormGroup,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';

import classnames from 'classnames';
import {
  fetchPoolPairListRequest,
  fetchTokenBalanceListRequest,
  addPoolLiquidityRequest,
  fetchPoolsharesRequest,
  fetchTestPoolSwapRequest,
  poolSwapRequest,
} from './reducer';
import {
  conversionRatio,
  getTokenAndBalanceMap,
  selectedPoolPair,
} from '../../utils/utility';
import {
  SWAP,
  POOL,
  CREATE_POOL_PAIR_PATH,
  WALLET_TOKENS_PATH,
  SWAP_PATH,
} from '../../constants';
import SwapTab from './components/SwapTab';
import PoolTab from './components/PoolTab';
import { BigNumber } from 'bignumber.js';
import Spinner from '../../components/Svg/Spinner';
import styles from './swap.module.scss';
import KeyValueLi from '../../components/KeyValueLi';

interface SwapPageProps {
  poolshares: any[];
  fetchTestPoolSwapRequest: (formState) => void;
  fetchPoolsharesRequest: () => void;
  poolPairList: any[];
  tokenBalanceList: string[];
  testPoolSwap: string;
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
}

const SwapPage: React.FunctionComponent<SwapPageProps> = (
  props: SwapPageProps
) => {
  const [activeTab, setActiveTab] = useState<string>(SWAP);
  const [swapStep, setSwapStep] = useState<string>('default');
  const [allowCalls, setAllowCalls] = useState<boolean>(false);
  const [formState, setFormState] = useState<any>({
    amount1: '',
    hash1: '',
    symbol1: '',
    amount2: '-',
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
    isLoadingPoolSwap,
    isErrorPoolSwap,
    poolSwapHash,
  } = props;

  useEffect(() => {
    fetchPoolPairListRequest();
    fetchTokenBalanceListRequest();
  }, []);

  useEffect(() => {
    fetchTestPoolSwapRequest({
      formState,
    });
  }, [formState.amount1]);

  useEffect(() => {
    setFormState({
      ...formState,
      amount2: testPoolSwap,
    });
  }, [testPoolSwap]);

  useEffect(() => {
    setFormState({
      ...formState,
      amount2: '-',
    });
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

  const tokenMap = getTokenAndBalanceMap(poolPairList, tokenBalanceList);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
      amount2: testPoolSwap,
    });
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
      formState[`amount2`] &&
      formState[`balance2`] &&
      new BigNumber(formState[`amount2`]).lte(formState[`balance2`])
    ) {
      return true;
    } else {
      return false;
    }
  };

  const filterBySymbol = (symbolKey: string) => {
    const filterMap: Map<string, any> = new Map();
    if (formState.hash1 ^ formState.hash2) {
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

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.swap.swapPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
        <h1>{I18n.t('containers.swap.swapPage.swap')}</h1>
        <Nav pills className='justify-content-center'>
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
        </Nav>
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
      </header>
      <div className='content'>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={SWAP}>
            <SwapTab
              label={I18n.t('containers.swap.swapTab.from')}
              tokenMap={tokenMap}
              filterBySymbol={filterBySymbol}
              name={1}
              formState={formState}
              handleChange={handleChange}
              handleDropdown={handleDropDown}
              setMaxValue={setMaxValue}
              dropdownLabel={
                formState.symbol1
                  ? formState.symbol1
                  : I18n.t('components.swapCard.selectAToken')
              }
            />
          </TabPane>
          <TabPane tabId={POOL}>
            <PoolTab />
          </TabPane>
        </TabContent>
        {isValid() && activeTab === SWAP && (
          <Row>
            <Col md='12'>
              <KeyValueLi
                label={I18n.t('containers.swap.swapPage.price')}
                value={`${conversionRatio(formState, poolPairList)} ${
                  formState.symbol1
                } per ${formState.symbol2}
                    ${1 / conversionRatio(formState, poolPairList)} ${
                  formState.symbol2
                } per ${formState.symbol1}`}
              />
              <KeyValueLi
                label={I18n.t('containers.swap.swapPage.minimumReceived')}
                value={`${formState.amount2} ${formState.symbol2}`}
              />
              <KeyValueLi
                label={I18n.t('containers.swap.swapPage.liquidityProviderFee')}
                value={(
                  selectedPoolPair(formState, poolPairList)[0].commission * 100
                ).toString()}
              />
            </Col>
          </Row>
        )}
      </div>
      {activeTab === SWAP && (
        <footer className='footer-bar'>
          <div
            className={classnames({
              'd-none': swapStep !== 'default',
            })}
          >
            <Row className='justify-content-between align-items-center'>
              <Col className='col-auto'>
                <FormGroup check>
                  <Label check>
                    {isValid()
                      ? I18n.t('containers.swap.swapPage.readySwap')
                      : I18n.t('containers.swap.swapPage.enterAnAmount')}
                  </Label>
                </FormGroup>
              </Col>
              <Col className='d-flex justify-content-end'>
                <Button
                  color='link'
                  className='mr-3'
                  disabled={!isValid()}
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
                  {isValid() &&
                    (
                      selectedPoolPair(formState, poolPairList)[0].commission *
                      100
                    ).toString()}
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
                <p>
                  {I18n.t('containers.swap.swapPage.transactionSuccessMsg')}
                </p>
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
              <Button color='primary' to={SWAP_PATH} tag={NavLink}>
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
    isLoadingPoolSwap,
    isErrorPoolSwap,
    isPoolSwapLoaded,
    poolSwapHash,
  } = state.swap;
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
    isLoadingPoolSwap,
    isErrorPoolSwap,
    isPoolSwapLoaded,
    poolSwapHash,
  };
};

const mapDispatchToProps = {
  fetchTestPoolSwapRequest,
  fetchPoolPairListRequest,
  fetchTokenBalanceListRequest,
  addPoolLiquidityRequest,
  fetchPoolsharesRequest,
  poolSwapRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(SwapPage);
