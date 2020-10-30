// Not in use component. Don't delete it for future purposes

import React from 'react';
import { TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap';
import { I18n } from 'react-redux-i18n';

import classnames from 'classnames';

import TransfersList from './../TransfersList';
import {
  TOKEN_TRANSFERS,
  TOKEN_HOLDERS,
  TOKEN_INFO,
  TOKEN_EXCHANGE,
  TOKEN_DEX,
  TOKEN_READ_CONTRACT,
  TOKEN_WRITE_CONTRACT,
  TOKEN_ANALYSIS,
  TOKEN_COMMENTS,
} from '../../../../../constants';

interface TokenInfoTabsProps {
  activeTab: string;
  id: string | undefined;
  history: any;
  setActiveTab: (tab: string) => void;
}

const Tabs: React.FunctionComponent<TokenInfoTabsProps> = (
  props: TokenInfoTabsProps
) => {
  const { activeTab, id, setActiveTab } = props;

  return (
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
    </section>
  );
};

export default Tabs;
