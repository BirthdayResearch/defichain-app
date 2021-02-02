import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
  MdAdd,
  MdArrowBack,
  MdCheckCircle,
  MdErrorOutline,
} from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import { Button, Col, Modal, ModalBody, Row } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import { connect } from 'react-redux';
import classnames from 'classnames';

import LiquidityCard from '../../../../components/LiquidityCard';
import {
  fetchPoolPairListRequest,
  fetchTokenBalanceListRequest,
  addPoolLiquidityRequest,
  fetchPoolsharesRequest,
  fetchUtxoDfiRequest,
  fetchMaxAccountDfiRequest,
} from '../../reducer';
import AddressDropdown from '../../../../components/AddressDropdown';
import styles from './addLiquidity.module.scss';
import {
  BTC,
  BTC_SYMBOL,
  CREATE_POOL_PAIR_PATH,
  DFI,
  DFI_SYMBOL,
  LIQUIDITY_PATH,
} from '../../../../constants';
import {
  calculateInputAddLiquidity,
  calculateInputAddLiquidityLeftCard,
  conversionRatio,
  countDecimals,
  getBalanceAndSymbolMap,
  getMaxNumberOfAmount,
  getPageTitle,
  getTokenAndBalanceMap,
  getTotalPoolValue,
  getTransactionAddressLabel,
  shareOfPool,
} from '../../../../utils/utility';
import Spinner from '../../../../components/Svg/Spinner';
import BigNumber from 'bignumber.js';
import Header from '../../../HeaderComponent';
import { PaymentRequestModel } from '../../../WalletPage/components/ReceivePage/PaymentRequestList';
import { AddressModel } from '../../../../model/address.model';
import NumberMask from '../../../../components/NumberMask';
import ViewOnChain from '../../../../components/ViewOnChain';

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
  paymentRequests: PaymentRequestModel[];
}
export interface AddLiquidityFormState extends AddressModel {
  [key: string]: any;
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

  const [formState, setFormState] = useState<AddLiquidityFormState>({
    amount1: '',
    hash1: '',
    symbol1: '',
    amount2: '0',
    hash2: '',
    symbol2: '',
    balance1: '',
    balance2: '',
    receiveAddress: '',
    receiveLabel: '',
  });
  const {
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
    fetchUtxoDfiRequest,
    fetchMaxAccountDfiRequest,
    paymentRequests,
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
            receiveAddress: (paymentRequests ?? [])[0]?.address,
            receiveLabel: (paymentRequests ?? [])[0]?.label,
          });
        } else if (!balanceA) {
          setFormState({
            ...formState,
            hash2: idTokenB,
            symbol2: tokenB,
            balance2: balanceB,
            receiveAddress: (paymentRequests ?? [])[0]?.address,
            receiveLabel: (paymentRequests ?? [])[0]?.label,
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
            receiveAddress: (paymentRequests ?? [])[0]?.address,
            receiveLabel: (paymentRequests ?? [])[0]?.label,
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
            receiveAddress: (paymentRequests ?? [])[0]?.address,
            receiveLabel: (paymentRequests ?? [])[0]?.label,
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
            receiveAddress: (paymentRequests ?? [])[0]?.address,
            receiveLabel: (paymentRequests ?? [])[0]?.label,
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
  }, [formState.hash1, formState.hash2]);

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
      if (formState.hash1 === DFI_SYMBOL) {
        if (
          new BigNumber(e.target.value).lte(
            BigNumber.maximum(new BigNumber(formState.balance1).minus(1), 0)
          ) ||
          !e.target.value
        ) {
          setFormState({
            ...formState,
            [e.target.name]: e.target.value,
            amount2: calculateInputAddLiquidity(
              e.target.value,
              formState,
              poolPairList
            ),
          });
        }
      } else {
        setFormState({
          ...formState,
          [e.target.name]: e.target.value,
          amount2: calculateInputAddLiquidity(
            e.target.value,
            formState,
            poolPairList
          ),
        });
      }
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
    if (field === 'amount1') {
      const amount = getMaxNumberOfAmount(value, formState.hash1);
      setFormState({
        ...formState,
        [field]: amount,
        amount2: calculateInputAddLiquidity(
          amount.toString(),
          formState,
          poolPairList
        ),
      });
    } else {
      const amount = getMaxNumberOfAmount(value, formState.hash2);
      setFormState({
        ...formState,
        [field]: amount,
        amount1: calculateInputAddLiquidityLeftCard(
          amount.toString(),
          formState,
          poolPairList
        ),
      });
    }
  };

  const difference = (a, b) => {
    return new BigNumber(a || 0).minus(b || 0).absoluteValue();
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
    const percentageChange = diff.div(oldAmount).times(100);

    if (percentageChange.gte(1)) {
      setLiquidityChangedMsg(
        I18n.t('containers.swap.addLiquidity.ratioMoreThan1')
      );
      setLiquidityChanged(true);
    } else if (new BigNumber(newAmount).gt(formState.balance2)) {
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
      shareAddress:
        formState.receiveAddress == null || formState.receiveAddress == ''
          ? (paymentRequests ?? [])[0]?.address
          : formState.receiveAddress,
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

  const handleAddressDropdown = (data: any) => {
    setFormState({
      ...formState,
      receiveAddress: data.address,
      receiveLabel: data.label,
    });
  };

  const getTransactionLabel = (formState: any) => {
    return getTransactionAddressLabel(
      formState.receiveLabel,
      formState.receiveAddress,
      I18n.t('containers.swap.addLiquidity.receiveAddress')
    );
  };

  return (
    <div className='main-wrapper'>
      {liquidityChangedModal()}
      <Helmet>
        <title>{getPageTitle(I18n.t('containers.swap.swapPage.title'))}</title>
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
          <Row>
            <Col md='4' className={styles.keyValueLiKey}>
              <span>
                {I18n.t('containers.swap.addLiquidity.receiveSharesAt')}
              </span>
            </Col>
            <Col md='8'>
              <AddressDropdown
                formState={formState}
                getTransactionLabel={getTransactionLabel}
                onSelectAddress={handleAddressDropdown}
              />
            </Col>
          </Row>
          <br />
          {isValid() && (
            <div>
              <Row>
                <Col className={styles.keyValueLiKey}>
                  <span>{I18n.t('containers.swap.addLiquidity.price')}</span>
                </Col>
                <Col className={styles.keyValueLiValue}>
                  <NumberMask
                    value={conversionRatio(formState, poolPairList)}
                  />
                  {` ${formState.symbol2} per ${formState.symbol1}`}
                  <br />
                  <NumberMask
                    value={new BigNumber(1)
                      .div(conversionRatio(formState, poolPairList))
                      .toFixed(8)}
                  />
                  {` ${formState.symbol1} per ${formState.symbol2}`}
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
                  <NumberMask
                    value={getTotalPoolValue(
                      formState,
                      poolPairList,
                      formState.hash1
                    )}
                  />
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
                  <NumberMask
                    value={getTotalPoolValue(
                      formState,
                      poolPairList,
                      formState.hash2
                    )}
                  />
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
            <>
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
            </>
            <Col className='d-flex justify-content-end'>
              <Button
                color='primary'
                disabled={
                  !Number(formState.amount1) ||
                  !isValid() ||
                  formState.receiveAddress == null ||
                  formState.receiveAddress == ''
                }
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
                    formState.symbol2
                  } per ${formState.symbol1}`}
                <br />
                {isValid() &&
                  `${new BigNumber(1)
                    .div(conversionRatio(formState, poolPairList))
                    .toFixed(8)} ${formState.symbol1} per ${
                    formState.symbol2
                  }`}{' '}
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
              <ViewOnChain txid={addPoolLiquidityHash} />
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
              <div className={styles.txProgressLine}>
                {isLoadingPreparingUTXO ? (
                  <>
                    <div className='d-flex'>
                      <div className={styles.txProgressLoader}>
                        <Spinner />
                      </div>
                      <span>
                        {I18n.t('containers.swap.addLiquidity.preparingUTXO')}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <MdCheckCircle className={styles.txProgressSuccess} />
                    <span>
                      {I18n.t('containers.swap.addLiquidity.UTXOPrepared')}
                    </span>
                  </>
                )}
              </div>
              <div className={styles.txProgressLine}>
                <div className='d-flex'>
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
                    <span>
                      {I18n.t('containers.swap.addLiquidity.addingLiquidity')}
                    </span>
                  )}
                </div>
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
  } = state.liquidity;
  const { walletBalance, paymentRequests } = state.wallet;
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
    paymentRequests,
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
