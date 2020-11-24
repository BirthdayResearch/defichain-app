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

interface RouteParams {
  id?: string;
}

interface RemoveLiquidityProps extends RouteComponentProps<RouteParams> {
  fetchPoolpair: (id) => void;
  poolpair: any;
  isErrorRemovingPoolLiquidity: string;
  removePoolLiqudity: (poolID, amount, address, poolpair) => void;
  isLoadingRemovePoolLiquidity: boolean;
  removePoolLiquidityHash: string;
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

  const removeLiquidityAmount = total => {
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
          to={LIQUIDITY_PATH}
          tag={RRNavLink}
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
                  onChange={e => {
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
                  onChange={e => {
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
                  <img
                    src={getIcon(poolpair.tokenA)}
                    height={'26px'}
                    width={'26px'}
                  />
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
                  <img
                    src={getIcon(poolpair.tokenB)}
                    height={'26px'}
                    width={'26px'}
                  />
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
          <UncontrolledDropdown className='w-100'>
            <DropdownToggle
              caret
              color='outline-secondary'
              className={`${styles.divisibilityDropdown}`}
              // disabled={isUpdate}
            >
              {formState.receiveAddress
                ? formState.receiveAddress
                : I18n.t('containers.swap.removeLiquidity.receiveAddress')}
            </DropdownToggle>
            <DropdownMenu className={`${styles.scrollAuto} w-100`}>
              <DropdownItem className='w-100'>
                <Row className='w-100'>
                  <Col md='6'>
                    {I18n.t('containers.swap.removeLiquidity.address')}
                  </Col>
                  <Col md='3'>
                    {I18n.t('containers.swap.removeLiquidity.label')}
                  </Col>
                  <Col md='3'>
                    {I18n.t('containers.swap.removeLiquidity.selected')}
                  </Col>
                </Row>
              </DropdownItem>
              {receiveAddresses.map(data => {
                return (
                  <DropdownItem
                    className='justify-content-between ml-0 w-100'
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
                {I18n.t('containers.swap.removeLiquidity.receiveAddress')}
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
            <div className='text-center'>
              <Spinner />
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

const mapStateToProps = state => {
  const {
    poolpair,
    isErrorRemovingPoolLiquidity,
    removePoolLiquidityHash,
    isLoadingRemovePoolLiquidity,
  } = state.swap;
  return {
    removePoolLiquidityHash,
    isLoadingRemovePoolLiquidity,
    isErrorRemovingPoolLiquidity,
    poolpair,
  };
};

const mapDispatchToProps = {
  fetchPoolpair,
  removePoolLiqudity: (poolID, amount, address, poolpair) =>
    removePoolLiqudityRequest({ poolID, amount, address, poolpair }),
};

export default connect(mapStateToProps, mapDispatchToProps)(RemoveLiquidity);
