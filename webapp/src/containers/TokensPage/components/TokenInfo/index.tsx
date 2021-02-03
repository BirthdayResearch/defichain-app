import React, { useEffect, useState } from 'react';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import classnames from 'classnames';
import {
  MdArrowBack,
  MdMoreHoriz,
  MdCheckCircle,
  MdErrorOutline,
  MdAdd,
} from 'react-icons/md';
import {
  Button,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  ButtonGroup,
} from 'reactstrap';

import styles from '../../token.module.scss';
import KeyValueLi from '../../../../components/KeyValueLi';
import { fetchTokenInfo, destroyToken } from '../../reducer';
import {
  CONFIRM_BUTTON_COUNTER,
  CONFIRM_BUTTON_TIMEOUT,
  DELETE,
  DFI_SYMBOL,
  MINT_TOKENS_PATH,
  TOKENS_PATH,
  TOKEN_EDIT_PATH,
  TOKEN_MINT_PATH,
} from '../../../../constants';
import { ITokenResponse } from '../../../../utils/interfaces';
import TokenAvatar from '../../../../components/TokenAvatar';
import { getIcon, getPageTitle } from '../../../../utils/utility';
import Header from '../../../HeaderComponent';
import ViewOnChain from '../../../../components/ViewOnChain';

interface RouteParams {
  id?: string;
  hash?: string;
  address?: string;
}

interface TokenInfoProps extends RouteComponentProps<RouteParams> {
  tokenInfo: any;
  fetchToken: (id: string | undefined) => void;
  destroyToken: (id) => void;
  destroyTokenData: ITokenResponse;
  isErrorDestroyingToken: string;
  isTokenDestroying: boolean;
}

const TokenInfo: React.FunctionComponent<TokenInfoProps> = (
  props: TokenInfoProps
) => {
  const { id, hash } = props.match.params;

  const tokenInfoMenu = [
    // {
    //   label: I18n.t('containers.tokens.tokenInfo.deleteToken'),
    //   value: 'delete',
    // },
    // {
    //   label: I18n.t('containers.tokens.tokenInfo.editToken'),
    //   value: 'edit',
    // },
    {
      label: I18n.t('containers.tokens.tokenInfo.mint'),
      value: 'mint',
    },
  ];

  const [
    isConfirmationModalOpen,
    setIsConfirmationModalOpen,
  ] = useState<string>('default');
  const [allowCalls, setAllowCalls] = useState(false);
  const [wait, setWait] = useState<number>(5);

  const {
    tokenInfo,
    destroyToken,
    destroyTokenData,
    isErrorDestroyingToken,
    isTokenDestroying,
    history,
  } = props;

  useEffect(() => {
    if (allowCalls) {
      if (destroyTokenData && !isTokenDestroying && !isErrorDestroyingToken) {
        setIsConfirmationModalOpen('success');
      }
      if (!destroyTokenData && !isTokenDestroying && isErrorDestroyingToken) {
        setIsConfirmationModalOpen('failure');
      }
    }
  }, [isTokenDestroying, destroyTokenData, isErrorDestroyingToken, allowCalls]);

  useEffect(() => {
    let waitToSendInterval;
    if (isConfirmationModalOpen === 'confirm') {
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
  }, [isConfirmationModalOpen]);

  useEffect(() => {
    props.fetchToken(`${hash}`);
  }, []);

  const handleDropDowns = (data: string) => {
    if (data === DELETE) {
      setIsConfirmationModalOpen('confirm');
    } else {
      // history.push(`${TOKEN_EDIT_PATH}/${id}`);
      history.push(
        `${TOKEN_MINT_PATH}/${id}/${hash}/${tokenInfo.collateralAddress}`
      );
    }
  };

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {getPageTitle(I18n.t('containers.tokens.tokensPage.title'))}
        </title>
      </Helmet>
      <Header>
        <Button
          to={TOKENS_PATH}
          tag={RRNavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.tokens.tokenInfo.back')}
          </span>
        </Button>
        <h1>{tokenInfo.symbolKey}</h1>
        {/* {tokenInfo.hash !== '0' && <ButtonGroup>
          <Button to={MINT_TOKENS_PATH} tag={RRNavLink} color='link'>
            <MdAdd />
            <span className='d-lg-inline'>
              {I18n.t('containers.tokens.tokenInfo.mint')}
            </span>
          </Button>
        </ButtonGroup>} */}
        {tokenInfo.hash !== DFI_SYMBOL && tokenInfo.ismine && (
          <UncontrolledDropdown>
            <DropdownToggle color='link' size='md'>
              <MdMoreHoriz />
            </DropdownToggle>
            <DropdownMenu right>
              {tokenInfoMenu.map((data) => {
                return (
                  <DropdownItem
                    className='justify-content-between'
                    key={data.value}
                    name='collateralAddress'
                    value={data.value}
                    onClick={() => handleDropDowns(data.value)}
                  >
                    <span>{I18n.t(data.label)}</span>
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
        )}
      </Header>
      {tokenInfo.minted === 0 &&
        tokenInfo.hash !== DFI_SYMBOL &&
        tokenInfo.ismine && (
          <div className={`${styles.mintAlert} m-5`}>
            <span>{I18n.t('containers.tokens.tokenInfo.notMintedAlert')}</span>
            <Button
              to={`${TOKEN_MINT_PATH}/${id}/${hash}/${tokenInfo.collateralAddress}`}
              tag={RRNavLink}
              color='link'
              className='text-right'
            >
              <span className='d-lg-inline'>
                {I18n.t('containers.tokens.tokenInfo.mint')}
              </span>
            </Button>
          </div>
        )}
      <div className='content'>
        <section className='mb-5'>
          <Row className='mb-4'>
            <Col md='6'>
              <TokenAvatar
                symbol={tokenInfo.symbolKey}
                size='64px'
                textSizeRatio={2}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.name')}
                value={(tokenInfo.name || '').toString()}
              />
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.symbol')}
                value={(tokenInfo.symbolKey || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.decimals')}
                value={(tokenInfo.decimal || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.limit')}
                value={(tokenInfo.limit || '0').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.minitingSupport')}
                value={(tokenInfo.mintable || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.tradeable')}
                value={(tokenInfo.tradeable || '').toString()}
              />
            </Col>
            {/* <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.marketCap')}
                value={(tokenInfo.marketCap || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.officialSite')}
                value={(tokenInfo.officialSite || '').toString()}
              />
            </Col> */}
          </Row>
        </section>
        {/* <Tabs
          activeTab={activeTab} i
          d={id}
          history={history}
          setActiveTab={setActiveTab}
        /> */}
      </div>
      <footer className='footer-bar'>
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== 'confirm',
          })}
        >
          <div className='footer-sheet'>
            <dl className='row'>
              <dd className='col-12'>
                <span className='h2 mb-0'>
                  {I18n.t('containers.tokens.tokenInfo.confirmation')}
                </span>
              </dd>
            </dl>
          </div>
          <Row className='justify-content-between align-items-center'>
            <Col className='d-flex justify-content-end'>
              <Button
                color='link'
                className='mr-3'
                onClick={() => setIsConfirmationModalOpen('default')}
              >
                {I18n.t('containers.tokens.tokenInfo.noButtonText')}
              </Button>
              <Button
                color='primary'
                onClick={() => {
                  setAllowCalls(true);
                  destroyToken(`${id}#${hash}`);
                }}
                disabled={wait > 0 ? true : false}
              >
                {I18n.t('containers.tokens.tokenInfo.yesButtonText')}
                &nbsp;
                <span className='timer'>{wait > 0 ? wait : ''}</span>
              </Button>
            </Col>
          </Row>
        </div>
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== 'success',
          })}
        >
          <div className='footer-sheet'>
            <div className='text-center'>
              <MdCheckCircle className='footer-sheet-icon' />
              <p>{`${I18n.t('containers.tokens.tokenInfo.successText')}`}</p>
              <p>{destroyTokenData}</p>
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center'>
            {destroyTokenData?.hash && (
              <ViewOnChain txid={destroyTokenData.hash} />
            )}
            <Button color='primary' to={TOKENS_PATH} tag={RRNavLink}>
              {I18n.t('containers.tokens.tokenInfo.backToTokenPage')}
            </Button>
          </div>
        </div>
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== 'failure',
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
              <p>{isErrorDestroyingToken}</p>
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center'>
            <Button color='primary' to={TOKENS_PATH} tag={RRNavLink}>
              {I18n.t('containers.tokens.tokenInfo.backToTokenPage')}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { tokens } = state;
  const {
    tokenInfo,
    isTokenDestroying,
    destroyTokenData,
    isErrorDestroyingToken,
  } = tokens;
  return {
    tokenInfo,
    isTokenDestroying,
    destroyTokenData,
    isErrorDestroyingToken,
  };
};

const mapDispatchToProps = {
  fetchToken: (id) => fetchTokenInfo({ id }),
  destroyToken: (id: string) => destroyToken({ id }),
};

export default connect(mapStateToProps, mapDispatchToProps)(TokenInfo);
