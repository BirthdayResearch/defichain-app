import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  MdAdd,
  MdArrowBack,
  MdCheck,
  MdCheckCircle,
  MdErrorOutline,
} from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import {
  Button,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Modal,
  ModalBody,
  Row,
  UncontrolledDropdown,
} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import classnames from 'classnames';
import EllipsisText from 'react-ellipsis-text';

import LiquidityCard from '../../../../components/LiquidityCard';
import {
  fetchPoolPairListRequest,
  fetchTokenBalanceListRequest,
  addPoolLiquidityRequest,
  fetchPoolsharesRequest,
  fetchUtxoDfiRequest,
  fetchMaxAccountDfiRequest,
} from '../../reducer';
import styles from './addLiquidity.module.scss';
import {
  BTC,
  BTC_SYMBOL,
  CREATE_POOL_PAIR_PATH,
  DEFICHAIN_MAINNET_LINK,
  DEFICHAIN_TESTNET_LINK,
  DFI,
  DFI_SYMBOL,
  LIQUIDITY_PATH,
  MAIN,
} from '../../../../constants';
import {
  calculateInputAddLiquidity,
  conversionRatio,
  countDecimals,
  getBalanceAndSymbolMap,
  getNetworkType,
  getTokenAndBalanceMap,
  getTotalPoolValue,
  shareOfPool,
} from '../../../../utils/utility';
import Spinner from '../../../../components/Svg/Spinner';
import BigNumber from 'bignumber.js';
import openNewTab from '../../../../utils/openNewTab';
import Header from '../../../HeaderComponent';
import { getReceivingAddressAndAmountList } from '../../../TokensPage/service';

interface AddLiquidityProps {
  location: any;
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
  isLoadingPreparingUTXO: boolean;
  isLoadingAddingLiquidity: boolean;
  utxoDfi: number;
  fetchUtxoDfiRequest: () => void;
  maxAccountDfi: number;
  fetchMaxAccountDfiRequest: () => void;
}

const AddLiquidity: React.FunctionComponent<AddLiquidityProps> = (
  props: AddLiquidityProps
) => {
  const urlParams = new URLSearchParams(props.location.search);
  const idTokenA = urlParams.get('idTokenA');
  const idTokenB = urlParams.get('idTokenB');
  const tokenA = urlParams.get('tokenA');
  const tokenB = urlParams.get('tokenB');

  const [addLiquidityStep, setAddLiquidityStep] = useState<string>('default');
  const [allowCalls, setAllowCalls] = useState<boolean>(false);
  const [liquidityChanged, setLiquidityChanged] = useState<boolean>(false);
  const [liquidityChangedMsg, setLiquidityChangedMsg] = useState<string>('');
  const [receiveAddresses, setReceiveAddresses] = useState<any>([]);

  const [formState, setFormState] = useState<any>({
    amount1: '',
    hash1: '',
    symbol1: '',
    amount2: '0',
    hash2: '',
    symbol2: '',
    balance1: '',
    balance2: '',
    receiveAddress: '',
  });
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
    isLoadingPreparingUTXO,
    isLoadingAddingLiquidity,
    utxoDfi,
    fetchUtxoDfiRequest,
    maxAccountDfi,
    fetchMaxAccountDfiRequest,
  } = props;

  useEffect(() => {
    fetchPoolPairListRequest();
    fetchTokenBalanceListRequest();
    fetchPoolsharesRequest();
    fetchUtxoDfiRequest();
    fetchMaxAccountDfiRequest();
  }, []);

  useEffect(() => {
    async function addressAndAmount() {
      const data = await getReceivingAddressAndAmountList();
      setReceiveAddresses(data.addressAndAmountList);
      const balanceSymbolMap: any = getBalanceAndSymbolMap(tokenBalanceList);
      if (idTokenA && idTokenB) {
        let balanceA;
        let balanceB;
        if (idTokenA === DFI_SYMBOL) {
          balanceA = new BigNumber(walletBalance).toNumber().toFixed(8);
        } else {
          balanceA = balanceSymbolMap.get(idTokenA);
        }
        if (idTokenB === DFI_SYMBOL) {
          balanceB = new BigNumber(walletBalance).toNumber().toFixed(8);
        } else {
          balanceB = balanceSymbolMap.get(idTokenB);
        }

        if (!balanceB) {
          setFormState({
            ...formState,
            hash1: idTokenA,
            symbol1: tokenA,
            balance1: balanceA,
            receiveAddress: data.addressAndAmountList[0]?.address,
          });
        } else if (!balanceA) {
          setFormState({
            ...formState,
            hash2: idTokenB,
            symbol2: tokenB,
            balance2: balanceB,
            receiveAddress: data.addressAndAmountList[0]?.address,
          });
        } else {
          setFormState({
            ...formState,
            hash1: idTokenA,
            symbol1: tokenA,
            hash2: idTokenB,
            symbol2: tokenB,
            balance1: balanceA,
            balance2: balanceB,
            receiveAddress: data.addressAndAmountList[0]?.address,
          });
        }
      } else {
        const balanceA = new BigNumber(walletBalance).toNumber().toFixed(8);
        const balanceB = balanceSymbolMap.get(BTC_SYMBOL);
        if (!balanceB) {
          setFormState({
            ...formState,
            hash1: DFI_SYMBOL,
            symbol1: DFI,
            balance1: balanceA,
            receiveAddress: data.addressAndAmountList[0]?.address,
          });
        } else {
          setFormState({
            ...formState,
            hash1: DFI_SYMBOL,
            symbol1: DFI,
            hash2: BTC_SYMBOL,
            symbol2: BTC,
            balance1: balanceA,
            balance2: balanceB,
            receiveAddress: data.addressAndAmountList[0]?.address,
          });
        }
      }
    }
    addressAndAmount();
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
      [field]: formState.hash1 === '0' ? Math.max(Number(value) - 1, 0) : value,
    });
  };

  const difference = (a, b) => {
    return Math.abs(a - b);
  };

  const AddLiquidityStepConfirm = () => {
    fetchPoolPairListRequest();
    const oldAmount = formState.amount2;
    const newAmount = calculateInputAddLiquidity(
      formState.amount1,
      formState,
      poolPairList
    );
    const diff = difference(oldAmount, newAmount);
    const percentageChange = (diff / oldAmount) * 100;

    if (Number(percentageChange) >= 1) {
      setLiquidityChangedMsg(
        I18n.t('containers.swap.addLiquidity.ratioMoreThan1')
      );
      setLiquidityChanged(true);
    } else if (Number(newAmount) > Number(formState.balance2)) {
      setLiquidityChangedMsg(
        I18n.t('containers.swap.addLiquidity.ratioChanged')
      );
      setLiquidityChanged(true);
    } else {
      setAddLiquidityStep('confirm');
    }
  };

  const liquidityChangedModal = () => (
    <Modal
      isOpen={liquidityChanged}
      centered
      contentClassName={styles.onContentModal}
    >
      <ModalBody>
        <div className={styles.errorModal}>
          <p>{liquidityChangedMsg}</p>
          <div className='text-right'>
            <Button
              to={CREATE_POOL_PAIR_PATH}
              tag={RRNavLink}
              color='link'
              className='header-bar-back'
            >
              {I18n.t('containers.swap.addLiquidity.ok')}
            </Button>
          </div>
        </div>
      </ModalBody>
    </Modal>
  );

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

  const isAmountInsufficient = () => {
    if (
      formState[`amount1`] &&
      formState[`balance1`] &&
      formState[`amount2`] &&
      formState[`balance2`] &&
      (new BigNumber(formState[`amount2`]).isGreaterThan(
        formState[`balance2`]
      ) ||
        new BigNumber(formState[`amount1`]).isGreaterThan(
          formState[`balance1`]
        ))
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
      shareAddress: formState.receiveAddress,
    });
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

  const handleDropDowns = (data: any, field: any) => {
    setFormState({
      ...formState,
      [field]: data,
    });
  };

  return (
    <div className='main-wrapper'>
      {liquidityChangedModal()}
      <Helmet>
        <title>{I18n.t('containers.swap.swapPage.title')}</title>
      </Helmet>
      <Header>
        <Button
          to={LIQUIDITY_PATH}
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
      </Header>
      <div className='content'>
        <section>
          <div className={styles.addLiquidityRow}>
            <LiquidityCard
              label={I18n.t('containers.swap.addLiquidity.input')}
              tokenMap={filterBySymbol(`symbol${2}`, !!formState.symbol2)}
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
            <div className={styles.addLiquiditySwapDirection}>
              <MdAdd />
            </div>
            <LiquidityCard
              label={I18n.t('containers.swap.addLiquidity.input')}
              tokenMap={filterBySymbol(`symbol${1}`, !!formState.symbol1)}
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
          </div>
          <UncontrolledDropdown className='w-100'>
            <DropdownToggle
              caret
              color='outline-secondary'
              className={`${styles.divisibilityDropdown}`}
            >
              {formState.receiveAddress
                ? formState.receiveAddress
                : I18n.t('containers.swap.addLiquidity.receiveAddress')}
            </DropdownToggle>
            <DropdownMenu className={`${styles.scrollAuto} w-100`}>
              <DropdownItem className='w-100'>
                <Row className='w-100'>
                  <Col md='6'>
                    {I18n.t('containers.swap.addLiquidity.address')}
                  </Col>
                  <Col md='3'>
                    {I18n.t('containers.swap.addLiquidity.label')}
                  </Col>
                  <Col md='3'>
                    {I18n.t('containers.swap.addLiquidity.selected')}
                  </Col>
                </Row>
              </DropdownItem>
              {receiveAddresses.map((data) => {
                return (
                  <DropdownItem
                    className='justify-content-between ml-0 w-100'
                    key={data.address}
                    name='receiveAddress'
                    onClick={() =>
                      handleDropDowns(data.address, 'receiveAddress')
                    }
                    value={data.address}
                  >
                    <Row className='w-100'>
                      <Col md='6'>
                        <EllipsisText text={data.address} length={'42'} />
                      </Col>
                      <Col md='3'>
                        <EllipsisText
                          text={data.label ? data.label : '---'}
                          length={'20'}
                        />
                      </Col>
                      <Col md='3'>
                        {formState.receiveAddress === data.address && (
                          <MdCheck />
                        )}
                      </Col>
                    </Row>
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
          <br />
          {isValid() && (
            <div>
              <Row>
                <Col className={styles.keyValueLiKey}>
                  <span>{I18n.t('containers.swap.addLiquidity.price')}</span>
                </Col>
                <Col className={styles.keyValueLiValue}>
                  {`${Number(conversionRatio(formState, poolPairList)).toFixed(
                    8
                  )} ${formState.symbol2} per ${formState.symbol1}`}
                  <br />
                  {`${(
                    1 / Number(conversionRatio(formState, poolPairList))
                  ).toFixed(8)} ${formState.symbol1} per ${formState.symbol2}`}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col className={styles.keyValueLiKey}>
                  <span>
                    {I18n.t('containers.swap.addLiquidity.shareOfPool')}
                  </span>
                </Col>
                <Col className={styles.keyValueLiValue}>
                  {shareOfPool(formState, poolPairList)}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col className={styles.keyValueLiKey}>
                  <span>
                    {I18n.t('containers.swap.addLiquidity.totalPooled')}&nbsp;
                    {formState.symbol1}
                  </span>
                </Col>
                <Col className={styles.keyValueLiValue}>
                  {getTotalPoolValue(formState, poolPairList, formState.hash1)}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col className={styles.keyValueLiKey}>
                  <span>
                    {I18n.t('containers.swap.addLiquidity.totalPooled')}&nbsp;
                    {formState.symbol2}
                  </span>
                </Col>
                <Col className={styles.keyValueLiValue}>
                  {getTotalPoolValue(formState, poolPairList, formState.hash2)}
                </Col>
              </Row>
            </div>
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
            {!isAmountInsufficient() ? (
              <Col className='col-auto'>
                {isValid()
                  ? I18n.t('containers.swap.addLiquidity.readyToSupply')
                  : I18n.t('containers.swap.addLiquidity.selectInputTokens')}
              </Col>
            ) : (
              <Col className='col-auto'>
                <span className='text-danger'>
                  {I18n.t('containers.swap.addLiquidity.amountInsufficient')}
                </span>
              </Col>
            )}
            <Col className='d-flex justify-content-end'>
              <Button
                color='primary'
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
              {/* For future purpose, don't remove */}
              {/* <dt className='col-sm-4 text-right'>
                {I18n.t('containers.swap.addLiquidity.reward')}
              </dt>
              <dd className='col-sm-8'>{'99,00000 DFI'}</dd> */}
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
                  `${1 / Number(conversionRatio(formState, poolPairList))} ${
                    formState.symbol2
                  } per ${formState.symbol1}`}{' '}
              </dd>
              <dt className='col-sm-4 text-right'>
                {I18n.t('containers.swap.addLiquidity.shareOfPool')}
              </dt>
              <dd className='col-sm-8'>
                {isValid() && shareOfPool(formState, poolPairList)}
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
              <div>
                <b>{I18n.t('containers.liquidity.liquidityPage.txHash')}</b> :
                &nbsp;
                <span>{addPoolLiquidityHash}</span>
              </div>
            </div>
          </div>
          <Row className='justify-content-between align-items-center'>
            <Col className='d-flex justify-content-end'>
              <Button
                onClick={() => {
                  openNewTab(
                    getNetworkType() === MAIN
                      ? DEFICHAIN_MAINNET_LINK
                      : DEFICHAIN_TESTNET_LINK
                  );
                }}
                color='link'
                className='mr-3'
              >
                {I18n.t('containers.swap.addLiquidity.viewOnChain')}
              </Button>
              <Button to={LIQUIDITY_PATH} tag={RRNavLink} color='primary'>
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
            <div>
              <div className='text-center position-relative'>
                {isLoadingPreparingUTXO ? (
                  <>
                    <div className='d-flex'>
                      <div className={styles.txProgressLoader}>
                        <Spinner />
                      </div>
                      <b>
                        {I18n.t('containers.swap.addLiquidity.preparingUTXO')}
                      </b>
                    </div>
                  </>
                ) : (
                  <>
                    <MdCheckCircle className={styles.txProgressSuccess} />
                    <b>{I18n.t('containers.swap.addLiquidity.UTXOPrepared')}</b>
                  </>
                )}
              </div>
              <br />
              <div className='text-center position-relative'>
                {!isLoadingPreparingUTXO && (
                  <>
                    {isLoadingAddingLiquidity ? (
                      <div className={styles.txProgressLoader}>
                        <Spinner />
                      </div>
                    ) : (
                      <MdCheckCircle className={styles.txProgressSuccess} />
                    )}
                  </>
                )}
                {isLoadingPreparingUTXO ? (
                  <span>
                    {I18n.t('containers.swap.addLiquidity.addingLiquidity')}
                  </span>
                ) : (
                  <b>
                    {I18n.t('containers.swap.addLiquidity.addingLiquidity')}
                  </b>
                )}
              </div>
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
                  [styles[`error-dialog`]]: true,
                })}
              />
              <p>{isErrorAddingPoolLiquidity}</p>
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center'>
            <Button color='primary' to={LIQUIDITY_PATH} tag={RRNavLink}>
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
    isLoadingPreparingUTXO,
    isLoadingAddingLiquidity,
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
    walletBalance,
    isLoadingPreparingUTXO,
    isLoadingAddingLiquidity,
    utxoDfi,
    maxAccountDfi,
  };
};

const mapDispatchToProps = {
  fetchPoolPairListRequest,
  fetchTokenBalanceListRequest,
  addPoolLiquidityRequest,
  fetchPoolsharesRequest,
  fetchUtxoDfiRequest,
  fetchMaxAccountDfiRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddLiquidity);
