import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  MdAdd,
  MdArrowBack,
  MdCheckCircle,
  MdErrorOutline,
} from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import { Button, Col, FormGroup, Label, Row } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import classnames from 'classnames';

import LiquidityCard from '../../../../components/LiquidityCard';
import {
  fetchPoolPairListRequest,
  fetchTokenBalanceListRequest,
  addPoolLiquidityRequest,
  fetchPoolsharesRequest,
} from '../../reducer';
import styles from './addLiquidity.module.scss';
import { SWAP_PATH } from '../../../../constants';
import {
  calculateInputAddLiquidity,
  conversionRatio,
  countDecimals,
  getTokenAndBalanceMap,
  shareOfPool,
} from '../../../../utils/utility';
import KeyValueLi from '../../../../components/KeyValueLi';
import Spinner from '../../../../components/Svg/Spinner';
import BigNumber from 'bignumber.js';

interface AddLiquidityProps {
  poolshares: any[];
  fetchPoolsharesRequest: () => void;
  poolPairList: any[];
  tokenBalanceList: string[];
  fetchPoolPairListRequest: () => void;
  fetchTokenBalanceListRequest: () => void;
  addPoolLiquidityRequest: (poolData) => void;
  isLoadingAddPoolLiquidity: boolean;
  isAddPoolLiquidityLoaded: boolean;
  addPoolLiquidityHash: string;
  isErrorAddingPoolLiquidity: string;
  walletBalance: number;
}

const AddLiquidity: React.FunctionComponent<AddLiquidityProps> = (
  props: AddLiquidityProps
) => {
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

  const [addLiquidityStep, setAddLiquidityStep] = useState<string>('default');
  const [allowCalls, setAllowCalls] = useState<boolean>(false);

  const {
    poolshares,
    poolPairList,
    fetchPoolPairListRequest,
    tokenBalanceList,
    fetchTokenBalanceListRequest,
    addPoolLiquidityRequest,
    isLoadingAddPoolLiquidity,
    addPoolLiquidityHash,
    isErrorAddingPoolLiquidity,
    fetchPoolsharesRequest,
    walletBalance,
  } = props;

  useEffect(() => {
    fetchPoolPairListRequest();
    fetchTokenBalanceListRequest();
    fetchPoolsharesRequest();
  }, []);

  useEffect(() => {
    if (allowCalls && !isLoadingAddPoolLiquidity) {
      if (!isErrorAddingPoolLiquidity && addPoolLiquidityHash) {
        setAddLiquidityStep('success');
      }
      if (isErrorAddingPoolLiquidity && !addPoolLiquidityHash) {
        setAddLiquidityStep('failure');
      }
    }
  }, [
    addPoolLiquidityHash,
    isErrorAddingPoolLiquidity,
    isLoadingAddPoolLiquidity,
    allowCalls,
  ]);

  useEffect(() => {
    isValidAmount() &&
      setFormState({
        ...formState,
        amount2: calculateInputAddLiquidity(
          formState.amount1,
          formState,
          poolPairList
        ),
      });
  }, [formState.amount1, formState.hash1, formState.hash2]);

  const isValidAmount = () => {
    if (
      formState[`balance1`] &&
      formState[`amount2`] &&
      formState[`balance2`]
    ) {
      return true;
    } else {
      return false;
    }
  };

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
    });
  };

  const AddLiquidityStepConfirm = () => {
    setAddLiquidityStep('confirm');
  };

  const AddLiquidityStepDefault = () => {
    setAddLiquidityStep('default');
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

  const handleAddLiquidity = async () => {
    setAllowCalls(true);
    setAddLiquidityStep('loading');
    addPoolLiquidityRequest({
      hash1: formState.hash1,
      amount1: formState.amount1,
      hash2: formState.hash2,
      amount2: formState.amount2,
    });
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

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.swap.swapPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
        <Button
          to={`${SWAP_PATH}?tab=pool`}
          tag={RRNavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span>{I18n.t('containers.swap.addLiquidity.back')}</span>
        </Button>
        <h1 className={classnames({ 'd-none': false })}>
          {I18n.t('containers.swap.addLiquidity.addLiquidity')}
        </h1>
      </header>
      <div className='content'>
        <section>
          <Row>
            <Col md='5'>
              <LiquidityCard
                label={I18n.t('containers.swap.addLiquidity.input')}
                tokenMap={filterBySymbol(`symbol${2}`)}
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
            </Col>
            <Col md='2' className={styles.colSvg}>
              <MdAdd className={styles.svg} />
            </Col>
            <Col md='5'>
              <LiquidityCard
                label={I18n.t('containers.swap.addLiquidity.input')}
                tokenMap={filterBySymbol(`symbol${1}`)}
                name={2}
                formState={formState}
                handleChange={handleChange}
                handleDropdown={handleDropDown}
                setMaxValue={setMaxValue}
                dropdownLabel={
                  formState.symbol2
                    ? formState.symbol2
                    : I18n.t('components.swapCard.selectAToken')
                }
              />
            </Col>
          </Row>
          {isValid() && (
            <Row>
              <Col md='12'>
                <Row className='align-items-center'>
                  <Col>
                    <span>{I18n.t('containers.swap.addLiquidity.price')}</span>
                  </Col>
                  <Col className='text-right'>
                    {`${conversionRatio(formState, poolPairList)} ${
                      formState.symbol1
                    } per ${formState.symbol2}`}
                    <br />
                    {`${1 / conversionRatio(formState, poolPairList)} ${
                      formState.symbol2
                    } per ${formState.symbol1}`}
                  </Col>
                </Row>
                <hr />
                <Row className='align-items-center'>
                  <Col>
                    <span>
                      {I18n.t('containers.swap.addLiquidity.shareOfPool')}
                    </span>
                  </Col>
                  <Col className='text-right'>
                    {shareOfPool(formState, poolPairList, poolshares)}
                  </Col>
                </Row>
                <hr />
              </Col>
            </Row>
          )}
        </section>
      </div>
      <footer className='footer-bar'>
        <div
          className={classnames({
            'd-none': addLiquidityStep !== 'default',
          })}
        >
          <Row className='justify-content-between align-items-center'>
            <Col className='col-auto'>
              <FormGroup check>
                <Label check>
                  {isValid()
                    ? I18n.t('containers.swap.addLiquidity.readyToSupply')
                    : I18n.t('containers.swap.addLiquidity.selectInputTokens')}
                </Label>
              </FormGroup>
            </Col>
            <Col className='d-flex justify-content-end'>
              <Button
                color='link'
                className='mr-3'
                disabled={!isValid()}
                onClick={AddLiquidityStepConfirm}
              >
                {I18n.t('containers.swap.addLiquidity.continue')}
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': addLiquidityStep !== 'confirm',
          })}
        >
          <div className='footer-sheet'>
            <dl className='row'>
              <dt className='col-sm-4 text-right'>
                {I18n.t('containers.swap.addLiquidity.reward')}
              </dt>
              <dd className='col-sm-8'>{'99,00000 DFI'}</dd>
              <dt className='col-sm-4 text-right'>
                {I18n.t('containers.swap.addLiquidity.deposits')}
              </dt>
              <dd className='col-sm-8'>
                {`${formState.amount1} ${formState.symbol1}`}
                <br />
                {`${formState.amount2} ${formState.symbol2}`}
              </dd>
              <dt className='col-sm-4 text-right'>
                {I18n.t('containers.swap.addLiquidity.rates')}
              </dt>
              <dd className='col-sm-8'>
                {isValid() &&
                  `${conversionRatio(formState, poolPairList)} ${
                    formState.symbol1
                  } per ${formState.symbol2}`}
                <br />
                {isValid() &&
                  `${1 / conversionRatio(formState, poolPairList)} ${
                    formState.symbol2
                  } per ${formState.symbol1}`}{' '}
              </dd>
              <dt className='col-sm-4 text-right'>
                {I18n.t('containers.swap.addLiquidity.shareOfPool')}
              </dt>
              <dd className='col-sm-8'>
                {isValid() && shareOfPool(formState, poolPairList, poolshares)}
              </dd>
            </dl>
          </div>
          <Row className='justify-content-between align-items-center'>
            <Col className='col'>
              {I18n.t('containers.swap.addLiquidity.verifyTransactionSupply')}
            </Col>
            <Col className='d-flex justify-content-end'>
              <Button
                color='link'
                className='mr-3'
                onClick={AddLiquidityStepDefault}
              >
                {I18n.t('containers.swap.addLiquidity.cancel')}
              </Button>
              <Button
                color='primary'
                onClick={() => handleAddLiquidity()}
                // disabled={wait > 0 ? true : false}
              >
                {I18n.t('containers.swap.addLiquidity.supply')}&nbsp;
                {/* <span className='timer'>{wait > 0 ? wait : ''}</span> */}
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': addLiquidityStep !== 'success',
          })}
        >
          <div className='footer-sheet'>
            <div className='text-center'>
              <MdCheckCircle className='footer-sheet-icon' />
              <p>
                {I18n.t('containers.swap.addLiquidity.transactionSuccessMsg')}
              </p>
            </div>
          </div>
          <Row className='justify-content-between align-items-center'>
            <Col className='d-flex justify-content-end'>
              <Button color='link' className='mr-3'>
                {I18n.t('containers.swap.addLiquidity.viewOnChain')}
              </Button>
              <Button
                to={`${SWAP_PATH}?tab=pool`}
                tag={RRNavLink}
                color='primary'
              >
                {I18n.t('containers.swap.addLiquidity.backToPool')}&nbsp;
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': addLiquidityStep !== 'loading',
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
            'd-none': addLiquidityStep !== 'failure',
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
              <p>{isErrorAddingPoolLiquidity}</p>
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center'>
            <Button
              color='primary'
              to={`${SWAP_PATH}?tab=pool`}
              tag={RRNavLink}
            >
              {I18n.t('containers.swap.addLiquidity.backToPool')}
            </Button>
          </div>
        </div>
      </footer>
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
    walletBalance,
  };
};

const mapDispatchToProps = {
  fetchPoolPairListRequest,
  fetchTokenBalanceListRequest,
  addPoolLiquidityRequest,
  fetchPoolsharesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddLiquidity);
