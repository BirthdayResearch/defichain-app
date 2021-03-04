import React, { useState, useEffect } from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MdSearch, MdAdd } from 'react-icons/md';
import {
  Button,
  ButtonGroup,
  // Nav,
  // NavItem,
  // NavLink,
  TabContent,
  TabPane,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
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
  DFI,
  TOKENS_PATH,
} from '../../constants';
import Header from '../HeaderComponent';
import { RootState } from '@/app/rootTypes';
import { StatusLedger } from '@/typings/models';
import { getPageTitle } from '@/utils/utility';

interface TokensProps {
  tokens: any;
  searchQuery: string;
  history: any;
  fetchTokensRequest: () => void;
  isLoadingTokens: boolean;
  statusLedger: StatusLedger;
}

const TokensPage: React.FunctionComponent<TokensProps> = (
  props: TokensProps
) => {
  const [searching, setSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>(DCT_TOKEN);
  const [isOpenMenuCreate, setIsOpenMenuCreate] = useState(false);
  const { tokens, fetchTokensRequest, isLoadingTokens } = props;

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

  const toggleMenuCreate = () => setIsOpenMenuCreate(!isOpenMenuCreate);

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {getPageTitle(I18n.t('containers.tokens.tokensPage.title'))}
        </title>
      </Helmet>
      <Header>
        <h1 className={classnames({ 'd-none': searching })}>
          {I18n.t('containers.tokens.tokensPage.tokens')}
        </h1>
        {/* <Nav pills className='justify-content-center'>
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
        </Nav> */}
        <ButtonGroup className={classnames({ 'd-none': searching })}>
          <Button color='link' size='sm' onClick={toggleSearch}>
            <MdSearch />
          </Button>
          <ButtonDropdown isOpen={isOpenMenuCreate} toggle={toggleMenuCreate}>
            <DropdownToggle color='link'>
              <MdAdd />
              <span className='d-lg-inline'>
                {I18n.t('containers.tokens.tokensPage.createToken')}
              </span>
            </DropdownToggle>
            <DropdownMenu>
              <DropdownItem
                to={{
                  pathname: CREATE_TOKENS_PATH,
                  search: 'typeWallet=wallet',
                }}
                tag={RRNavLink}
                color='link'
              >
                Use wallet
              </DropdownItem>
              <DropdownItem
                to={{
                  pathname: CREATE_TOKENS_PATH,
                  search: 'typeWallet=ledger',
                }}
                tag={RRNavLink}
                color='link'
                disabled={props.statusLedger !== 'connected'}
              >
                Use ledger
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </ButtonGroup>
        <SearchBar
          onChange={(e) => setSearchQuery(e.target.value)}
          searching={searching}
          toggleSearch={toggleSearch}
          placeholder={I18n.t('containers.tokens.tokensPage.searchTokens')}
        />
      </Header>
      <div className='content'>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={DAT_TOKEN}>
            <TokensList
              tokens={tokens.filter((data) => data.isDAT)}
              history={history}
              searchQuery={searchQuery}
              handleCardClick={handleCardClick}
              component={DATTokenCard}
              isLoadingTokens={isLoadingTokens}
            />
          </TabPane>
          <TabPane tabId={DCT_TOKEN}>
            <TokensList
              tokens={tokens.filter(
                (data) =>
                  data.destructionTx === DESTRUCTION_TX &&
                  data.symbolKey !== DFI
              )}
              history={history}
              searchQuery={searchQuery}
              handleCardClick={handleCardClick}
              component={DCTTokenCard}
              isLoadingTokens={isLoadingTokens}
            />
          </TabPane>
        </TabContent>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { tokens, isTokensLoaded, isLoadingTokens } = state.tokens;
  const { connect } = state.ledgerWallet;
  return {
    tokens,
    isTokensLoaded,
    isLoadingTokens,
    statusLedger: connect.status,
  };
};

const mapDispatchToProps = {
  fetchTokensRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(TokensPage);
