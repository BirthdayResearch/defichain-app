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
} from 'reactstrap';
import {
  NavLink,
  NavLink as RRNavLink,
  RouteComponentProps,
} from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux';

import {
  CONFIRM_BUTTON_COUNTER,
  CONFIRM_BUTTON_TIMEOUT,
  SWAP_PATH,
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
  removePoolLiqudityRequest: (formState) => void;
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
    removePoolLiqudityRequest,
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
    removePoolLiqudityRequest({
      poolID: id,
      amount: (formState.amountPercentage * sumAmount) / 100,
    });
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
          to={`${SWAP_PATH}?tab=pool`}
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
            <Row className='align-items-center'>
              <Col sm={2}>
                <InputGroup className='m-2'>
                  <Input
                    type='number'
                    id='amountPercentage'
                    value={formState.amountPercentage}
                    className='border-right-0'
                    onChange={(e) => {
                      if (Number(e.target.value) <= 100) {
                        setFormState({
                          ...formState,
                          amountPercentage: e.target.value,
                        });
                      }
                    }}
                  />
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText className='border-left-0'>
                      {I18n.t(
                        'containers.swap.removeLiquidity.removeLiquidityPercentage'
                      )}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
              <Col
                sm={10}
                className='d-flex align-items-center justify-content-center'
              >
                <span className={styles.rangeText}>
                  {I18n.t('containers.swap.removeLiquidity.none')}
                </span>
                <input
                  type='range'
                  name='removeLiquidityRange'
                  id='removeLiquidityRange'
                  value={formState.amountPercentage}
                  className='custom-range ml-5 mr-5'
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      amountPercentage: e.target.value,
                    });
                  }}
                />
                <span className={styles.rangeText}>
                  {I18n.t('containers.swap.removeLiquidity.all')}
                </span>
              </Col>
            </Row>
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
                  {`${removeLiquidityAmount(totalA)} of ${totalA} ${
                    poolpair.tokenA
                  }`}
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
                  {`${removeLiquidityAmount(totalB)} of ${totalB} ${
                    poolpair.tokenB
                  }`}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col>{I18n.t('containers.swap.removeLiquidity.price')}</Col>
                <Col className={styles.colText}>
                  {`${getRatio(poolpair)} ${poolpair.tokenA} per ${
                    poolpair.tokenB
                  }`}
                  <br />
                  {`${(1 / Number(getRatio(poolpair))).toFixed(8)} ${
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
            <DropdownMenu className='overflow-auto'>
              {receiveAddresses.map((data) => {
                return (
                  <DropdownItem
                    className='d-flex justify-content-between ml-0'
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
                    <span>{I18n.t(data.address)}</span>
                    &nbsp;
                    {formState.receiveAddress === data.address && <MdCheck />}
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
              <FormGroup check>
                <Label check>
                  {I18n.t(
                    'containers.swap.removeLiquidity.enterRemoveLiquidityAmount'
                  )}
                </Label>
              </FormGroup>
            </Col>
            <Col className='d-flex justify-content-end'>
              <Button
                color='link'
                className='mr-3'
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
              <dt className='col-sm-3 text-right'>
                {I18n.t('containers.swap.removeLiquidity.receive')}
              </dt>
              &nbsp;
              <dd className='col-sm-9'>
                <span>{`${removeLiquidityAmount(totalA)} ${
                  poolpair.tokenA
                }`}</span>
                <br />
                <span>{`${removeLiquidityAmount(totalB)} ${
                  poolpair.tokenB
                }`}</span>
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
            <Button color='primary' to={`${SWAP_PATH}?tab=pool`} tag={NavLink}>
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
            <Button color='primary' to={`${SWAP_PATH}?tab=pool`} tag={NavLink}>
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
  removePoolLiqudityRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(RemoveLiquidity);
