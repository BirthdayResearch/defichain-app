import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import classnames from 'classnames';
import { MdArrowBack, MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
} from 'reactstrap';

import styles from '../../token.module.scss';
import {
  CONFIRM_BUTTON_COUNTER,
  CONFIRM_BUTTON_TIMEOUT,
  DFI_SYMBOL,
  TOKENS_PATH,
} from '../../../../constants';
import { ITokenResponse } from '../../../../utils/interfaces';
import Spinner from '../../../../components/Svg/Spinner';
import { connect } from 'react-redux';
import { mintToken } from '../../reducer';
import { isEmpty } from 'lodash';
import Header from '../../../HeaderComponent';
import { getPageTitle, getSymbolKey } from '../../../../utils/utility';
import ViewOnChain from '../../../../components/ViewOnChain';

interface RouteParams {
  id?: string;
  hash?: string;
  address?: string;
}

interface MintTokenProps extends RouteComponentProps<RouteParams> {
  mintToken: (tokenData) => void;
  mintedTokenData: ITokenResponse;
  isTokenMinting: boolean;
  isErrorMintingToken: string;
}

const MintToken: React.FunctionComponent<MintTokenProps> = (
  props: MintTokenProps
) => {
  const { id, hash, address } = props.match.params;

  const {
    mintToken,
    mintedTokenData,
    isTokenMinting,
    isErrorMintingToken,
  } = props;

  const [amountToMint, setAmountToMint] = useState<any>(0);
  const [mintStep, setMintStep] = useState<string>('default');
  const [wait, setWait] = useState<number>(5);
  const [allowCalls, setAllowCalls] = useState<boolean>(false);

  useEffect(() => {
    let waitToSendInterval;
    if (mintStep === 'confirm') {
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
  }, [mintStep]);

  const mintStepConfirm = () => {
    setMintStep('confirm');
  };

  const mintStepDefault = () => {
    setMintStep('default');
  };

  useEffect(() => {
    if (allowCalls && !isTokenMinting) {
      if (!isErrorMintingToken && !isEmpty(mintedTokenData)) {
        setMintStep('success');
      }
      if (isErrorMintingToken && isEmpty(mintedTokenData)) {
        setMintStep('failure');
      }
    }
  }, [mintedTokenData, isErrorMintingToken, isErrorMintingToken, allowCalls]);

  const handleMintToken = async () => {
    setAllowCalls(true);
    setMintStep('loading');
    mintToken({
      tokenData: {
        address,
        amount: amountToMint,
        hash,
      },
    });
  };

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {getPageTitle(I18n.t('containers.tokens.mintToken.title'))}
        </title>
      </Helmet>
      <Header>
        <Button
          to={`${TOKENS_PATH}/${id}/${hash}`}
          tag={NavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.tokens.mintToken.back')}
          </span>
        </Button>
        <h1>
          {I18n.t('containers.tokens.mintToken.title')}
          &nbsp;
          {getSymbolKey(id || '', hash || DFI_SYMBOL)}
        </h1>
      </Header>
      <div className='content'>
        <section>
          <Form>
            <FormGroup className='form-label-group form-row'>
              <InputGroup>
                <Input
                  type='number'
                  placeholder={I18n.t(
                    'containers.tokens.mintToken.amountToMint'
                  )}
                  name='amountToMint'
                  id='amountToMint'
                  value={amountToMint}
                  onChange={(e) => setAmountToMint(e.target.value)}
                />
                <Label for='amountToMint'>
                  {I18n.t('containers.tokens.mintToken.amount')}
                </Label>
                <InputGroupAddon addonType='append'>
                  <InputGroupText>
                    {getSymbolKey(id || '', hash || DFI_SYMBOL)}
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>
          </Form>
        </section>
      </div>
      <footer className='footer-bar'>
        <div
          className={classnames({
            'd-none': mintStep !== 'default',
          })}
        >
          <Row className='justify-content-between align-items-center'>
            <Col className='col-auto'>
              <div className='caption-secondary'>
                {I18n.t('containers.tokens.mintToken.amountToMint')}
              </div>
              <div>
                {amountToMint}&nbsp;
                {getSymbolKey(id || '', hash || DFI_SYMBOL)}
              </div>
            </Col>
            <Col className='d-flex justify-content-end'>
              <Button
                to={TOKENS_PATH}
                tag={NavLink}
                color='link'
                className='mr-3'
              >
                {I18n.t('containers.tokens.mintToken.cancel')}
              </Button>
              <Button
                color='primary'
                disabled={!amountToMint}
                onClick={mintStepConfirm}
              >
                {I18n.t('containers.tokens.mintToken.continue')}
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': mintStep !== 'confirm',
          })}
        >
          <div className='footer-sheet'>
            <dl className='row'>
              <dt className='col-sm-3 text-right'>
                {I18n.t('containers.tokens.mintToken.amount')}
              </dt>
              &nbsp;
              <dd className='col-sm-9'>
                {amountToMint}&nbsp;
                {getSymbolKey(id || '', hash || DFI_SYMBOL)}
              </dd>
            </dl>
          </div>
          <Row className='justify-content-between align-items-center'>
            <Col className='col'>
              {I18n.t('containers.tokens.mintToken.pleaseVerifyAmount')}
            </Col>
            <Col className='d-flex justify-content-end'>
              <Button color='link' className='mr-3' onClick={mintStepDefault}>
                {I18n.t('containers.tokens.mintToken.cancel')}
              </Button>
              <Button
                color='primary'
                onClick={() => handleMintToken()}
                disabled={wait > 0 ? true : false}
              >
                {I18n.t('containers.tokens.mintToken.completeMint')}&nbsp;
                <span className='timer'>{wait > 0 ? wait : ''}</span>
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': mintStep !== 'success',
          })}
        >
          <div className='footer-sheet'>
            <div className='text-center'>
              <MdCheckCircle className='footer-sheet-icon' />
              <p>
                {I18n.t('containers.tokens.mintToken.transactionSuccessMsg')}
              </p>
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center'>
            {mintedTokenData?.hash && (
              <ViewOnChain txid={mintedTokenData.hash} />
            )}
            <Button color='primary' to={TOKENS_PATH} tag={NavLink}>
              {I18n.t('containers.tokens.mintToken.backToToken')}
            </Button>
          </div>
        </div>
        <div
          className={classnames({
            'd-none': mintStep !== 'loading',
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
            'd-none': mintStep !== 'failure',
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
              <p>{isErrorMintingToken}</p>
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center'>
            <Button color='primary' to={TOKENS_PATH} tag={NavLink}>
              {I18n.t('containers.tokens.mintToken.backToToken')}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { tokens } = state;
  const { isTokenMinting, mintedTokenData, isErrorMintingToken } = tokens;
  return {
    isTokenMinting,
    mintedTokenData,
    isErrorMintingToken,
  };
};

const mapDispatchToProps = {
  mintToken,
};

export default connect(mapStateToProps, mapDispatchToProps)(MintToken);
