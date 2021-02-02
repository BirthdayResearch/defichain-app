import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { MdArrowBack, MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import {
  Button,
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  CustomInput,
} from 'reactstrap';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { LIQUIDITY_PATH } from '../../../../constants';
import { fetchPoolpair, removePoolLiqudityRequest } from '../../reducer';
import styles from './removeLiquidity.module.scss';
import {
  getPageTitle,
  getRatio,
  getTotalAmountPoolShare,
  getTransactionAddressLabel,
} from '../../../../utils/utility';
import Spinner from '../../../../components/Svg/Spinner';
import TokenAvatar from '../../../../components/TokenAvatar';
import Header from '../../../HeaderComponent';
import AddressDropdown from '../../../../components/AddressDropdown';
import { AddressModel } from '../../../../model/address.model';
import { PaymentRequestModel } from '../../../WalletPage/components/ReceivePage/PaymentRequestList';
import NumberMask from '../../../../components/NumberMask';
import ViewOnChain from '../../../../components/ViewOnChain';
import { BigNumber } from 'bignumber.js';

interface RouteParams {
  id?: string;
}

interface RemoveLiquidityProps extends RouteComponentProps<RouteParams> {
  history: any;
  fetchPoolpair: (id) => void;
  poolpair: any;
  isErrorRemovingPoolLiquidity: string;
  removePoolLiqudity: (poolID, amount, address, poolpair) => void;
  isLoadingRemovePoolLiquidity: boolean;
  removePoolLiquidityHash: string;
  isLoadingRefreshUTXOS1: boolean;
  isLoadingLiquidityRemoved: boolean;
  isLoadingRefreshUTXOS2: boolean;
  isLoadingTransferTokens: boolean;
  refreshUTXOS1Loaded: boolean;
  liquidityRemovedLoaded: boolean;
  refreshUTXOS2Loaded: boolean;
  transferTokensLoaded: boolean;
  paymentRequests: PaymentRequestModel[];
}

export interface RemoveLiquidityFormState extends AddressModel {
  [key: string]: any;
}

const RemoveLiquidity: React.FunctionComponent<RemoveLiquidityProps> = (
  props: RemoveLiquidityProps
) => {
  const urlParams = new URLSearchParams(props.location.search);
  const sharePercentage = urlParams.get('sharePercentage');

  const [removeLiquidityStep, setRemoveLiquidityStep] = useState<string>(
    'default'
  );
  const [allowCalls, setAllowCalls] = useState<boolean>(false);
  const [sumAmount, setSumAmount] = useState<number>(0);
  const [formState, setFormState] = useState<RemoveLiquidityFormState>({
    amountPercentage: '0',
    receiveAddress: '',
    receiveLabel: '',
  });

  const { id } = props.match.params;

  const {
    fetchPoolpair,
    poolpair,
    isErrorRemovingPoolLiquidity,
    removePoolLiqudity,
    isLoadingRemovePoolLiquidity,
    removePoolLiquidityHash,
    isLoadingRefreshUTXOS1,
    isLoadingLiquidityRemoved,
    isLoadingRefreshUTXOS2,
    isLoadingTransferTokens,
    refreshUTXOS1Loaded,
    liquidityRemovedLoaded,
    refreshUTXOS2Loaded,
    history,
    paymentRequests,
  } = props;

  useEffect(() => {
    fetchPoolpair({
      id,
    });
  }, []);

  useEffect(() => {
    if (allowCalls && !isLoadingRemovePoolLiquidity) {
      if (!isErrorRemovingPoolLiquidity) {
        setRemoveLiquidityStep('success');
      }
      if (isErrorRemovingPoolLiquidity) {
        setRemoveLiquidityStep('failure');
      }
    }
  }, [
    removePoolLiquidityHash,
    isErrorRemovingPoolLiquidity,
    isLoadingRemovePoolLiquidity,
    allowCalls,
  ]);

  useEffect(() => {
    async function addressAndAmount() {
      setFormState({
        ...formState,
        receiveAddress: (paymentRequests ?? [])[0]?.address,
        receiveLabel: (paymentRequests ?? [])[0]?.label,
      });
    }
    addressAndAmount();
  }, []);

  useEffect(() => {
    async function totalAmountPoolShare() {
      const amount = await getTotalAmountPoolShare(id);
      setSumAmount(amount);
    }
    totalAmountPoolShare();
  }, []);

  const handleRemoveLiquidity = () => {
    setAllowCalls(true);
    setRemoveLiquidityStep('loading');
    removePoolLiqudity(
      id,
      (formState.amountPercentage * sumAmount) / 100,
      formState.receiveAddress,
      poolpair
    );
  };

  const calculateTotal = (total, reserve) => {
    return new BigNumber(total).div(100).times(reserve).toFixed(8);
  };

  const removeLiquidityAmount = (total) => {
    return new BigNumber(formState.amountPercentage)
      .div(100)
      .times(total)
      .toFixed(8);
  };

  const totalA = calculateTotal(sharePercentage, poolpair.reserveA);
  const totalB = calculateTotal(sharePercentage, poolpair.reserveB);

  const getTransactionLabel = (formState: any) => {
    return getTransactionAddressLabel(
      formState.receiveLabel,
      formState.receiveAddress,
      I18n.t('containers.swap.removeLiquidity.receiveAddressDropdown')
    );
  };

  const handleAddressDropdown = (data: any) => {
    setFormState({
      ...formState,
      receiveAddress: data.address,
      receiveLabel: data.label,
    });
  };

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{getPageTitle(I18n.t('containers.swap.swapPage.title'))}</title>
      </Helmet>
      <Header>
        <Button
          // to={LIQUIDITY_PATH}
          // tag={RRNavLink}
          onClick={() => {
            history.goBack();
          }}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span>{I18n.t('containers.swap.removeLiquidity.back')}</span>
        </Button>
        <h1 className={classnames({ 'd-none': false })}>
          {I18n.t('containers.swap.removeLiquidity.removeLiquidity')}
        </h1>
      </Header>
      <div className='content'>
        <section>
          <FormGroup>
            <Label for='removeLiquidityRange'>
              {I18n.t('containers.swap.removeLiquidity.removeLiquidityAmount')}
            </Label>
            <div className={styles.amountRemoveInputRange}>
              <InputGroup className={styles.amountRemoveInputWrapper}>
                <Input
                  type='text'
                  inputMode='decimal'
                  id='amountPercentage'
                  value={formState.amountPercentage}
                  className={styles.amountRemoveInput}
                  onChange={(e) => {
                    if (
                      new BigNumber(0).lte(e?.target?.value || 0) &&
                      new BigNumber(e?.target?.value || 0).lte(100)
                    ) {
                      setFormState({
                        ...formState,
                        amountPercentage: e.target.value,
                      });
                    }
                  }}
                />
                <InputGroupAddon addonType='append'>
                  <InputGroupText className='border-left-0'>
                    {I18n.t(
                      'containers.swap.removeLiquidity.removeLiquidityPercentage'
                    )}
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
              <div className={styles.amountRemoveRangeWrapper}>
                <span
                  className={styles.rangeText}
                  onClick={() => {
                    setFormState({
                      ...formState,
                      amountPercentage: '0',
                    });
                  }}
                >
                  {I18n.t('containers.swap.removeLiquidity.none')}
                </span>
                <CustomInput
                  type='range'
                  name='removeLiquidityRange'
                  id='removeLiquidityRange'
                  value={formState.amountPercentage}
                  className={styles.amountRemoveRange}
                  step='0.1'
                  onChange={(e) => {
                    if (new BigNumber(e?.target?.value || 0).gte(0)) {
                      setFormState({
                        ...formState,
                        amountPercentage: e?.target?.value || 0,
                      });
                    }
                  }}
                />
                <span
                  className={styles.rangeText}
                  onClick={() => {
                    setFormState({
                      ...formState,
                      amountPercentage: '100',
                    });
                  }}
                >
                  {I18n.t('containers.swap.removeLiquidity.all')}
                </span>
              </div>
            </div>
          </FormGroup>
          <Row>
            <Col md='12'>
              <Row className='align-items-center'>
                <Col>
                  <TokenAvatar symbol={poolpair.tokenA} size={'26px'} />
                  <span className={styles.logoText}>{poolpair.tokenA}</span>
                </Col>
                <Col className={styles.colText}>
                  <NumberMask value={removeLiquidityAmount(totalA)} />
                  {` of `}
                  <NumberMask value={new BigNumber(totalA).toFixed(8)} />
                  {` ${poolpair.tokenA}`}
                </Col>
              </Row>
              <hr />
              <Row className='align-items-center'>
                <Col>
                  <TokenAvatar symbol={poolpair.tokenB} size={'26px'} />
                  <span className={styles.logoText}>{poolpair.tokenB}</span>
                </Col>
                <Col className={styles.colText}>
                  <NumberMask value={removeLiquidityAmount(totalB)} />
                  {` of `}
                  <NumberMask value={new BigNumber(totalB).toFixed(8)} />
                  {` ${poolpair.tokenB}`}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>{I18n.t('containers.swap.removeLiquidity.price')}</Col>
                <Col className={styles.colText}>
                  <NumberMask value={getRatio(poolpair)} />
                  {` ${poolpair.tokenA} per ${poolpair.tokenB}`}
                  <br />
                  <NumberMask
                    value={new BigNumber(1)
                      .div(Number(getRatio(poolpair)))
                      .toFixed(8)}
                  />
                  {` ${poolpair.tokenB} per ${poolpair.tokenA}`}
                </Col>
              </Row>
              <hr />
            </Col>
          </Row>
          <FormGroup className='form-row align-items-center'>
            <Col md='4'>
              {I18n.t('containers.swap.removeLiquidity.receiveAddressLabel')}
            </Col>
            <Col md='8'>
              <AddressDropdown
                formState={formState}
                getTransactionLabel={getTransactionLabel}
                onSelectAddress={handleAddressDropdown}
              />
            </Col>
          </FormGroup>
        </section>
      </div>
      <footer className='footer-bar'>
        <div
          className={classnames({
            'd-none': removeLiquidityStep !== 'default',
          })}
        >
          <Row className='justify-content-between align-items-center'>
            <Col className='col-auto'>
              {I18n.t(
                'containers.swap.removeLiquidity.enterRemoveLiquidityAmount'
              )}
            </Col>
            <Col className='d-flex justify-content-end'>
              <Button
                color='primary'
                onClick={() => setRemoveLiquidityStep('confirm')}
                disabled={
                  !Number(formState.amountPercentage) ||
                  !formState.receiveAddress
                }
              >
                {I18n.t('containers.swap.removeLiquidity.continue')}
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': removeLiquidityStep !== 'confirm',
          })}
        >
          <div className='footer-sheet'>
            <dl className='row'>
              <dt className='col-sm-4 text-right'>
                {I18n.t('containers.swap.removeLiquidity.receive')}
              </dt>
              <dd className='col-sm-8'>
                <span>{`${removeLiquidityAmount(totalA)} ${
                  poolpair.tokenA
                }`}</span>
                <br />
                <span>{`${removeLiquidityAmount(totalB)} ${
                  poolpair.tokenB
                }`}</span>
              </dd>
              <dt className='col-sm-4 text-right'>
                {I18n.t('containers.swap.removeLiquidity.receiveAddressLabel')}
              </dt>
              <dd className='col-sm-8'>
                <span>{`${formState.receiveAddress}`}</span>
              </dd>
            </dl>
          </div>
          <Row className='justify-content-between align-items-center'>
            <Col className='col'>
              {I18n.t('containers.swap.removeLiquidity.verifyTransaction')}
            </Col>
            <Col className='d-flex justify-content-end'>
              <Button
                color='link'
                className='mr-3'
                onClick={() => setRemoveLiquidityStep('default')}
              >
                {I18n.t('containers.swap.removeLiquidity.cancel')}
              </Button>
              <Button color='primary' onClick={() => handleRemoveLiquidity()}>
                {I18n.t('containers.swap.removeLiquidity.confirm')}
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': removeLiquidityStep !== 'success',
          })}
        >
          <div className='footer-sheet'>
            <div className='text-center'>
              <MdCheckCircle className='footer-sheet-icon' />
              <p>
                {I18n.t(
                  'containers.swap.removeLiquidity.transactionSuccessMsg'
                )}
              </p>
            </div>
          </div>
          <Row className='justify-content-between align-items-center'>
            <Col className='d-flex justify-content-end'>
              {removePoolLiquidityHash != null && (
                <ViewOnChain txid={removePoolLiquidityHash} />
              )}
              <Button color='primary' to={LIQUIDITY_PATH} tag={NavLink}>
                {I18n.t('containers.swap.removeLiquidity.backToPool')}
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': removeLiquidityStep !== 'loading',
          })}
        >
          <div className='footer-sheet'>
            <div>
              <div className={styles.txProgressLine}>
                {isLoadingRefreshUTXOS1 ? (
                  <>
                    <div className='d-flex'>
                      <div className={styles.txProgressLoader}>
                        <Spinner />
                      </div>
                      <span>
                        {I18n.t(
                          'containers.swap.removeLiquidity.refreshingUTXOS'
                        )}
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <MdCheckCircle className={styles.txProgressSuccess} />
                    <span>
                      {I18n.t('containers.swap.removeLiquidity.UTXOSRefreshed')}
                    </span>
                  </>
                )}
              </div>
              <div className={styles.txProgressLine}>
                {refreshUTXOS1Loaded ? (
                  <>
                    {isLoadingLiquidityRemoved ? (
                      <>
                        <div className='d-flex'>
                          <div className={styles.txProgressLoader}>
                            <Spinner />
                          </div>
                          <span>
                            {I18n.t(
                              'containers.swap.removeLiquidity.removingLiquidity'
                            )}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <MdCheckCircle className={styles.txProgressSuccess} />
                        <span>
                          {I18n.t(
                            'containers.swap.removeLiquidity.liquidityRemoved'
                          )}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span>
                      {I18n.t(
                        'containers.swap.removeLiquidity.removingLiquidity'
                      )}
                    </span>
                  </>
                )}
              </div>
              <div className={styles.txProgressLine}>
                {liquidityRemovedLoaded ? (
                  <>
                    {isLoadingRefreshUTXOS2 ? (
                      <>
                        <div className='d-flex'>
                          <div className={styles.txProgressLoader}>
                            <Spinner />
                          </div>
                          <span>
                            {I18n.t(
                              'containers.swap.removeLiquidity.refreshingUTXOS'
                            )}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <MdCheckCircle className={styles.txProgressSuccess} />
                        <span>
                          {I18n.t(
                            'containers.swap.removeLiquidity.UTXOSRefreshed'
                          )}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span>
                      {I18n.t(
                        'containers.swap.removeLiquidity.refreshingUTXOS'
                      )}
                    </span>
                  </>
                )}
              </div>
              <div className={styles.txProgressLine}>
                {refreshUTXOS2Loaded ? (
                  <>
                    {isLoadingTransferTokens ? (
                      <>
                        <div className={styles.txProgressLoader}>
                          <Spinner />
                        </div>
                        <span>
                          {I18n.t(
                            'containers.swap.removeLiquidity.transferringTokens'
                          )}
                        </span>
                      </>
                    ) : (
                      <>
                        <MdCheckCircle className={styles.txProgressSuccess} />
                        <span>
                          {I18n.t(
                            'containers.swap.removeLiquidity.tokensTransferred'
                          )}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    <span>
                      {I18n.t(
                        'containers.swap.removeLiquidity.transferringTokens'
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <div
          className={classnames({
            'd-none': removeLiquidityStep !== 'failure',
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
              <p>{isErrorRemovingPoolLiquidity}</p>
            </div>
          </div>
          <Row className='justify-content-between align-items-center'>
            <Col className='d-flex justify-content-end'>
              <Button color='primary' to={LIQUIDITY_PATH} tag={NavLink}>
                {I18n.t('containers.swap.removeLiquidity.backToPool')}
              </Button>
            </Col>
          </Row>
        </div>
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => {
  const {
    poolpair,
    isErrorRemovingPoolLiquidity,
    removePoolLiquidityHash,
    isLoadingRemovePoolLiquidity,
    isLoadingRefreshUTXOS1,
    isLoadingLiquidityRemoved,
    isLoadingRefreshUTXOS2,
    isLoadingTransferTokens,
    refreshUTXOS1Loaded,
    liquidityRemovedLoaded,
    refreshUTXOS2Loaded,
    transferTokensLoaded,
  } = state.liquidity;
  const { paymentRequests } = state.wallet;
  return {
    removePoolLiquidityHash,
    isLoadingRemovePoolLiquidity,
    isErrorRemovingPoolLiquidity,
    poolpair,
    isLoadingRefreshUTXOS1,
    isLoadingLiquidityRemoved,
    isLoadingRefreshUTXOS2,
    isLoadingTransferTokens,
    refreshUTXOS1Loaded,
    liquidityRemovedLoaded,
    refreshUTXOS2Loaded,
    transferTokensLoaded,
    paymentRequests,
  };
};

const mapDispatchToProps = {
  fetchPoolpair,
  removePoolLiqudity: (poolID, amount, address, poolpair) =>
    removePoolLiqudityRequest({ poolID, amount, address, poolpair }),
};

export default connect(mapStateToProps, mapDispatchToProps)(RemoveLiquidity);
