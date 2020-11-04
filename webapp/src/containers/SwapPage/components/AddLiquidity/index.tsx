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
} from '../../reducer';
import styles from './addLiquidity.module.scss';
import { SWAP_PATH } from '../../../../constants';
import { getTokenAndBalanceMap } from '../../../../utils/utility';
import KeyValueLi from '../../../../components/KeyValueLi';
import Spinner from '../../../../components/Svg/Spinner';
import BigNumber from 'bignumber.js';

interface AddLiquidityProps {
  poolPairList: any[];
  tokenBalanceList: string[];
  fetchPoolPairListRequest: () => void;
  fetchTokenBalanceListRequest: () => void;
}

const AddLiquidity: React.FunctionComponent<AddLiquidityProps> = (
  props: AddLiquidityProps
) => {
  const [formState, setFormState] = useState<any>({
    amount1: '',
    hash1: '',
    symbol1: '',
    amount2: '',
    hash2: '',
    symbol2: '',
    balance1: '',
    balance2: '',
  });

  const [addLiquidityStep, setAddLiquidityStep] = useState<string>('default');
  const [allowCalls, setAllowCalls] = useState<boolean>(false);

  const {
    poolPairList,
    fetchPoolPairListRequest,
    tokenBalanceList,
    fetchTokenBalanceListRequest,
  } = props;

  useEffect(() => {
    fetchPoolPairListRequest();
    fetchTokenBalanceListRequest();
  }, []);

  const tokenMap = getTokenAndBalanceMap(poolPairList, tokenBalanceList);

  const handleChange = (e) => {
    setFormState({
      ...formState,
      [e.target.name]: e.target.value,
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
  };

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.swap.swapPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
        <Button
          to={SWAP_PATH}
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
                tokenMap={tokenMap}
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
                tokenMap={tokenMap}
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
                <KeyValueLi
                  label={I18n.t('containers.swap.addLiquidity.price')}
                  value={`10,00000 DOO per DFI
                        0.10000 DFI per DOO`}
                />
                <KeyValueLi
                  label={I18n.t('containers.swap.addLiquidity.shareOfPool')}
                  value={'0.025 %'}
                />
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
                  {I18n.t('containers.swap.addLiquidity.readyToSupply')}
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
                {'9,999 DFI'}
                <br />
                {'99,990 DOO'}
              </dd>
              <dt className='col-sm-4 text-right'>
                {I18n.t('containers.swap.addLiquidity.rates')}
              </dt>
              <dd className='col-sm-8'>
                {'10,00000 DOO per DFI'}
                <br />
                {'0.10000 DFI per DOO'}
              </dd>
              <dt className='col-sm-4 text-right'>
                {I18n.t('containers.swap.addLiquidity.shareOfPool')}
              </dt>
              <dd className='col-sm-8'>{'0.025 %'}</dd>
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
              <Button
                color='link'
                className='mr-3'
                // onClick={mintStepDefault}
              >
                {I18n.t('containers.swap.addLiquidity.viewOnChain')}
              </Button>
              <Button
                to={SWAP_PATH}
                tag={RRNavLink}
                color='primary'
                // onClick={() => handleMintToken()}
                // disabled={wait > 0 ? true : false}
              >
                {I18n.t('containers.swap.addLiquidity.backToPool')}&nbsp;
                {/* <span className='timer'>{wait > 0 ? wait : ''}</span> */}
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
              {/* <p>{isErrorMintingToken}</p> */}
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center'>
            <Button
              color='primary'
              // to={TOKENS_PATH}
              // tag={NavLink}
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
  const { poolPairList, tokenBalanceList } = state.swap;
  return { poolPairList, tokenBalanceList };
};

const mapDispatchToProps = {
  fetchPoolPairListRequest,
  fetchTokenBalanceListRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddLiquidity);
