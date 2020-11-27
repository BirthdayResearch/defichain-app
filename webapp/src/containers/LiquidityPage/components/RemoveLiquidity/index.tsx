import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import {
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
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  UncontrolledDropdown,
  CustomInput,
} from 'reactstrap';
import {
  NavLink,
  NavLink as RRNavLink,
  RouteComponentProps,
} from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux';
import EllipsisText from 'react-ellipsis-text';

import {
  CONFIRM_BUTTON_COUNTER,
  CONFIRM_BUTTON_TIMEOUT,
  LIQUIDITY_PATH,
} from '../../../../constants';
import { fetchPoolpair, removePoolLiqudityRequest } from '../../reducer';
import styles from './removeLiquidity.module.scss';
import {
  getIcon,
  getRatio,
  getTotalAmountPoolShare,
} from '../../../../utils/utility';
import { getReceivingAddressAndAmountList } from '../../../TokensPage/service';
import Spinner from '../../../../components/Svg/Spinner';
import TokenAvatar from '../../../../components/TokenAvatar';

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
}

const RemoveLiquidity: React.FunctionComponent<RemoveLiquidityProps> = (
  props: RemoveLiquidityProps
) => {
  const urlParams = new URLSearchParams(props.location.search);
  const sharePercentage = urlParams.get('sharePercentage');

  const [formState, setFormState] = useState<any>({
    amountPercentage: '0',
    receiveAddress: '',
  });
  const [removeLiquidityStep, setRemoveLiquidityStep] = useState<string>(
    'default'
  );
  const [receiveAddresses, setReceiveAddresses] = useState<any>([]);
  const [wait, setWait] = useState<number>(5);
  const [allowCalls, setAllowCalls] = useState<boolean>(false);
  const [sumAmount, setSumAmount] = useState<number>(0);

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
  } = props;

  useEffect(() => {
    let waitToSendInterval;
    if (removeLiquidityStep === 'confirm') {
      let counter = CONFIRM_BUTTON_COUNTER;
      waitToSendInterval = setInterval(() => {
        counter -= 1;
        setWait(counter);
        if (counter === 0) {
          clearInterval(waitToSendInterval);
        }
      }, CONFIRM_BUTTON_TIMEOUT);
    }
    return () => {
      clearInterval(waitToSendInterval);
    };
  }, [removeLiquidityStep]);

  useEffect(() => {
    fetchPoolpair({
      id,
    });
  }, []);

  useEffect(() => {
    if (allowCalls && !isLoadingRemovePoolLiquidity) {
      if (!isErrorRemovingPoolLiquidity && removePoolLiquidityHash) {
        setRemoveLiquidityStep('success');
      }
      if (isErrorRemovingPoolLiquidity && !removePoolLiquidityHash) {
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
      const data = await getReceivingAddressAndAmountList();
      setReceiveAddresses(data.addressAndAmountList);
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
    return ((total / 100) * reserve).toFixed(8);
  };

  const removeLiquidityAmount = (total) => {
    const liquidityAmount = (Number(formState.amountPercentage) / 100) * total;
    return liquidityAmount.toFixed(8);
  };

  const totalA = calculateTotal(sharePercentage, poolpair.reserveA);
  const totalB = calculateTotal(sharePercentage, poolpair.reserveB);

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.swap.swapPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
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
      </header>
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
                  inputmode='decimal'
                  id='amountPercentage'
                  value={formState.amountPercentage}
                  className={styles.amountRemoveInput}
                  onChange={(e) => {
                    if (
                      0 <= Number(e.target.value) &&
                      Number(e.target.value) <= 100
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
                    if (Number(e.target.value) >= 0) {
                      setFormState({
                        ...formState,
                        amountPercentage: e.target.value,
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
                  {`${Number(removeLiquidityAmount(totalA)).toFixed(
                    6
                  )} of ${Number(totalA).toFixed(6)} ${poolpair.tokenA}`}
                </Col>
              </Row>
              <hr />
              <Row className='align-items-center'>
                <Col>
                  <TokenAvatar symbol={poolpair.tokenB} size={'26px'} />
                  <span className={styles.logoText}>{poolpair.tokenB}</span>
                </Col>
                <Col className={styles.colText}>
                  {`${Number(removeLiquidityAmount(totalB)).toFixed(
                    6
                  )} of ${Number(totalB).toFixed(6)} ${poolpair.tokenB}`}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>{I18n.t('containers.swap.removeLiquidity.price')}</Col>
                <Col className={styles.colText}>
                  {`${Number(getRatio(poolpair)).toFixed(6)} ${
                    poolpair.tokenA
                  } per ${poolpair.tokenB}`}
                  <br />
                  {`${(1 / Number(getRatio(poolpair))).toFixed(6)} ${
                    poolpair.tokenB
                  } per ${poolpair.tokenA}`}
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
              <UncontrolledDropdown>
                <DropdownToggle
                  caret
                  color='outline-secondary'
                  className={`${styles.receiveAddressDropdown}`}
                  // disabled={isUpdate}
                >
                  {formState.receiveAddress
                    ? formState.receiveAddress
                    : I18n.t(
                        'containers.swap.removeLiquidity.receiveAddressDropdown'
                      )}
                </DropdownToggle>
                <DropdownMenu className={`${styles.receiveAddressMenu}`}>
                  {receiveAddresses.map((data) => {
                    return (
                      <DropdownItem
                        key={data.address}
                        name='receiveAddress'
                        onClick={() =>
                          setFormState({
                            ...formState,
                            receiveAddress: data.address,
                          })
                        }
                        value={data.address}
                      >
                        <EllipsisText text={data.address} length={'42'} />
                        <EllipsisText
                          className={styles.receiveAddressMenuLabel}
                          text={data.label ? `${data.label}` : ''}
                          length={'20'}
                        />
                        {formState.receiveAddress === data.address && (
                          <MdCheck className={styles.receiveAddressMenuCheck} />
                        )}
                      </DropdownItem>
                    );
                  })}
                </DropdownMenu>
              </UncontrolledDropdown>
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
                <span>{`${Number(removeLiquidityAmount(totalA)).toFixed(6)} ${
                  poolpair.tokenA
                }`}</span>
                <br />
                <span>{`${Number(removeLiquidityAmount(totalB)).toFixed(6)} ${
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
              <Button
                color='primary'
                onClick={() => handleRemoveLiquidity()}
                disabled={wait > 0 ? true : false}
              >
                {I18n.t('containers.swap.removeLiquidity.confirm')}&nbsp;
                <span className='timer'>{wait > 0 ? wait : ''}</span>
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
          <div className='d-flex align-items-center justify-content-center'>
            <Button color='primary' to={LIQUIDITY_PATH} tag={NavLink}>
              {I18n.t('containers.swap.removeLiquidity.backToPool')}
            </Button>
          </div>
        </div>
        <div
          className={classnames({
            'd-none': removeLiquidityStep !== 'loading',
          })}
        >
          <div className='footer-sheet'>
            <div>
              <div className='text-center position-relative'>
                {isLoadingRefreshUTXOS1 ? (
                  <>
                    <div className='d-flex'>
                      <div className={styles.loaderInline}>
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
                    <MdCheckCircle className={styles.successColor} />
                    <b>
                      {I18n.t('containers.swap.removeLiquidity.UTXOSRefreshed')}
                    </b>
                  </>
                )}
              </div>
              <br />
              <div className='text-center position-relative'>
                {refreshUTXOS1Loaded ? (
                  <>
                    {isLoadingLiquidityRemoved ? (
                      <>
                        <div className='d-flex'>
                          <div className={styles.loaderInline}>
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
                        <MdCheckCircle className={styles.successColor} />
                        <b>
                          {I18n.t(
                            'containers.swap.removeLiquidity.liquidityRemoved'
                          )}
                        </b>
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
              <br />
              <div className='text-center position-relative'>
                {liquidityRemovedLoaded ? (
                  <>
                    {isLoadingRefreshUTXOS2 ? (
                      <>
                        <div className='d-flex'>
                          <div className={styles.loaderInline}>
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
                        <MdCheckCircle className={styles.successColor} />
                        <b>
                          {I18n.t(
                            'containers.swap.removeLiquidity.UTXOSRefreshed'
                          )}
                        </b>
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
              <br />
              <div className='text-center position-relative'>
                {refreshUTXOS2Loaded ? (
                  <>
                    {isLoadingTransferTokens ? (
                      <>
                        <div className='d-flex'>
                          <div className={styles.loaderInline}>
                            <Spinner />
                          </div>
                          <span>
                            {I18n.t(
                              'containers.swap.removeLiquidity.transferringTokens'
                            )}
                          </span>
                        </div>
                      </>
                    ) : (
                      <>
                        <MdCheckCircle className={styles.successColor} />
                        <b>
                          {I18n.t(
                            'containers.swap.removeLiquidity.tokensTransferred'
                          )}
                        </b>
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
                  [styles[`error-dailog`]]: true,
                })}
              />
              <p>{isErrorRemovingPoolLiquidity}</p>
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center'>
            <Button color='primary' to={LIQUIDITY_PATH} tag={NavLink}>
              {I18n.t('containers.swap.removeLiquidity.backToPool')}
            </Button>
          </div>
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
  } = state.swap;
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
  };
};

const mapDispatchToProps = {
  fetchPoolpair,
  removePoolLiqudity: (poolID, amount, address, poolpair) =>
    removePoolLiqudityRequest({ poolID, amount, address, poolpair }),
};

export default connect(mapStateToProps, mapDispatchToProps)(RemoveLiquidity);
