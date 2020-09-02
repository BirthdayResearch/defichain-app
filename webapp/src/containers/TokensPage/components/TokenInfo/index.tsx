import React, { useEffect, useState } from 'react';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MdArrowBack } from 'react-icons/md';
import {
  Button,
  Row,
  Col,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';

import classnames from 'classnames';

import KeyValueLi from '../../../../components/KeyValueLi';
import TransfersList from './TransfersList';
import DeefIcon from '../../../../assets/svg/icon-coin-deef-lapis.svg';
import { fetchTokenInfo } from '../../reducer';
import {
  TOKENS_PATH,
  TOKEN_TRANSFERS,
  TOKEN_HOLDERS,
  TOKEN_INFO,
  TOKEN_EXCHANGE,
  TOKEN_DEX,
  TOKEN_READ_CONTRACT,
  TOKEN_WRITE_CONTRACT,
  TOKEN_ANALYSIS,
  TOKEN_COMMENTS,
} from '../../../../constants';

interface RouteParams {
  id?: string;
}

interface TokenInfoProps extends RouteComponentProps<RouteParams> {
  tokenInfo: any;
  fetchToken: (id: string | undefined) => void;
}

const TokenInfo: React.FunctionComponent<TokenInfoProps> = (
  props: TokenInfoProps
) => {
  const { id } = props.match.params;
  const [activeTab, setActiveTab] = useState<string>(TOKEN_TRANSFERS);

  const { tokenInfo } = props;

  useEffect(() => {
    props.fetchToken(id);
  }, []);

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.tokens.tokensPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
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
        <h1>{tokenInfo.name}</h1>
      </header>
      <div className='content'>
        <section className='mb-5'>
          <Row className='mb-4'>
            <Col md='6'>
              <img src={DeefIcon} height={'64px'} width={'64px'} />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.name')}
                value={(tokenInfo.name || '').toString()}
              />
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.symbol')}
                value={(tokenInfo.symbol || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.id')}
                value={(tokenInfo.id || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.decimals')}
                value={(tokenInfo.decimals || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.type')}
                value={(tokenInfo.type || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.holders')}
                value={(tokenInfo.holders || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.price')}
                value={(tokenInfo.price || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.volume')}
                value={(tokenInfo.volume || '').toString()}
              />
            </Col>
            <Col md='6'>
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
            </Col>
          </Row>
        </section>
        <section>
          <Nav pills>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === TOKEN_TRANSFERS,
                })}
                onClick={() => {
                  setActiveTab(TOKEN_TRANSFERS);
                }}
              >
                {I18n.t('containers.tokens.tokenInfo.transfers')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === TOKEN_HOLDERS,
                })}
                onClick={() => {
                  setActiveTab(TOKEN_HOLDERS);
                }}
              >
                {I18n.t('containers.tokens.tokenInfo.holders')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === TOKEN_INFO,
                })}
                onClick={() => {
                  setActiveTab(TOKEN_INFO);
                }}
              >
                {I18n.t('containers.tokens.tokenInfo.info')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === TOKEN_EXCHANGE,
                })}
                onClick={() => {
                  setActiveTab(TOKEN_EXCHANGE);
                }}
              >
                {I18n.t('containers.tokens.tokenInfo.exchange')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === TOKEN_DEX,
                })}
                onClick={() => {
                  setActiveTab(TOKEN_DEX);
                }}
              >
                {I18n.t('containers.tokens.tokenInfo.dex')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === TOKEN_READ_CONTRACT,
                })}
                onClick={() => {
                  setActiveTab(TOKEN_READ_CONTRACT);
                }}
              >
                {I18n.t('containers.tokens.tokenInfo.readContract')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === TOKEN_WRITE_CONTRACT,
                })}
                onClick={() => {
                  setActiveTab(TOKEN_WRITE_CONTRACT);
                }}
              >
                {I18n.t('containers.tokens.tokenInfo.writeContract')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === TOKEN_ANALYSIS,
                })}
                onClick={() => {
                  setActiveTab(TOKEN_ANALYSIS);
                }}
              >
                {I18n.t('containers.tokens.tokenInfo.analysis')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: activeTab === TOKEN_COMMENTS,
                })}
                onClick={() => {
                  setActiveTab(TOKEN_COMMENTS);
                }}
              >
                {I18n.t('containers.tokens.tokenInfo.comments')}
              </NavLink>
            </NavItem>
          </Nav>
        </section>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={TOKEN_TRANSFERS}>
            <section>
              <TransfersList history={props.history} symbol={id} />
            </section>
          </TabPane>
          <TabPane tabId={TOKEN_HOLDERS}>
            <section>
              <p>{TOKEN_HOLDERS}</p>
            </section>
          </TabPane>
          <TabPane tabId={TOKEN_INFO}>
            <section>
              <p>{TOKEN_INFO}</p>
            </section>
          </TabPane>
          <TabPane tabId={TOKEN_EXCHANGE}>
            <section>
              <p>{TOKEN_EXCHANGE}</p>
            </section>
          </TabPane>
          <TabPane tabId={TOKEN_DEX}>
            <section>
              <p>{TOKEN_DEX}</p>
            </section>
          </TabPane>
          <TabPane tabId={TOKEN_READ_CONTRACT}>
            <section>
              <p>{TOKEN_READ_CONTRACT}</p>
            </section>
          </TabPane>
          <TabPane tabId={TOKEN_WRITE_CONTRACT}>
            <section>
              <p>{TOKEN_WRITE_CONTRACT}</p>
            </section>
          </TabPane>
          <TabPane tabId={TOKEN_ANALYSIS}>
            <section>
              <p>{TOKEN_ANALYSIS}</p>
            </section>
          </TabPane>
          <TabPane tabId={TOKEN_COMMENTS}>
            <section>
              <p>{TOKEN_COMMENTS}</p>
            </section>
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { tokens } = state;
  const { tokenInfo } = tokens;
  return {
    tokenInfo,
  };
};

const mapDispatchToProps = {
  fetchToken: (id) => fetchTokenInfo({ id }),
};

export default connect(mapStateToProps, mapDispatchToProps)(TokenInfo);
