import React, { useState, useEffect } from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MdSearch, MdAdd } from 'react-icons/md';
import {
  Button,
  ButtonGroup,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
} from 'reactstrap';

import classnames from 'classnames';

import SearchBar from '../../components/SearchBar';
import DATTokenCard from '../../components/TokenCard/DAT';
import DCTTokenCard from '../../components/TokenCard/DCT';
import TokensList from './components/TokenList';
import { fetchTokensRequest } from './reducer';
import {
  CREATE_TOKENS_PATH,
  DAT_TOKEN,
  DCT_TOKEN,
  DESTRUCTION_TX,
  TOKENS_PATH,
} from '../../constants';

interface TokensProps {
  tokens: any;
  searchQuery: string;
  history: any;
  fetchTokensRequest: () => void;
}

const TokensPage: React.FunctionComponent<TokensProps> = (
  props: TokensProps
) => {
  const [searching, setSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>(DAT_TOKEN);
  const { tokens, fetchTokensRequest } = props;

  useEffect(() => {
    fetchTokensRequest();
  }, []);

  const toggleSearch = () => {
    if (searching) {
      setSearchQuery('');
    }
    setSearching(!searching);
  };

  const handleCardClick = (symbol: string, hash: string) => {
    return props.history.push(`${TOKENS_PATH}/${symbol}/${hash}`);
  };

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.tokens.tokensPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
        <h1 className={classnames({ 'd-none': searching })}>
          {I18n.t('containers.tokens.tokensPage.tokens')}
        </h1>
        <Nav pills className='justify-content-center'>
          <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === DAT_TOKEN,
              })}
              onClick={() => {
                setActiveTab(DAT_TOKEN);
              }}
            >
              {I18n.t('containers.tokens.tokensPage.dat')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === DCT_TOKEN,
              })}
              onClick={() => {
                setActiveTab(DCT_TOKEN);
              }}
            >
              {I18n.t('containers.tokens.tokensPage.dct')}
            </NavLink>
          </NavItem>
        </Nav>
        <ButtonGroup className={classnames({ 'd-none': searching })}>
          <Button color='link' size='sm' onClick={toggleSearch}>
            <MdSearch />
          </Button>
          <Button to={CREATE_TOKENS_PATH} tag={RRNavLink} color='link'>
            <MdAdd />
            <span className='d-lg-inline'>
              {I18n.t('containers.tokens.tokensPage.createToken')}
            </span>
          </Button>
        </ButtonGroup>
        <SearchBar
          onChange={(e) => setSearchQuery(e.target.value)}
          searching={searching}
          toggleSearch={toggleSearch}
          placeholder={I18n.t('containers.tokens.tokensPage.searchTokens')}
        />
      </header>
      <div className='content'>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={DAT_TOKEN}>
            <TokensList
              tokens={tokens.filter((data) => data.isDAT)}
              history={history}
              searchQuery={searchQuery}
              handleCardClick={handleCardClick}
              component={DATTokenCard}
            />
          </TabPane>
          <TabPane tabId={DCT_TOKEN}>
            <TokensList
              tokens={tokens.filter(
                (data) => !data.isDAT && data.destructionTx === DESTRUCTION_TX
              )}
              history={history}
              searchQuery={searchQuery}
              handleCardClick={handleCardClick}
              component={DCTTokenCard}
            />
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { tokens, isTokensLoaded, isLoadingTokens } = state.tokens;
  return {
    tokens,
    isTokensLoaded,
    isLoadingTokens,
  };
};

const mapDispatchToProps = {
  fetchTokensRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(TokensPage);
