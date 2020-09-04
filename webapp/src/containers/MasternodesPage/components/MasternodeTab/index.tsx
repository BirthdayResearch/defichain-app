import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import classnames from 'classnames';

interface MasternodeTabsProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
}

const MasternodeTabs = (props: MasternodeTabsProps) => {
  const { setActiveTab, activeTab } = props;
  return (
    <>
      <Nav pills className='justify-content-center'>
        <NavItem>
          <NavLink
            className={classnames({
              active: activeTab === 'myMasternodes',
            })}
            onClick={() => {
              setActiveTab('myMasternodes');
            }}
          >
            {I18n.t('containers.masterNodes.masternodeTab.myMasternodes')}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({
              active: activeTab === 'network',
            })}
            onClick={() => {
              setActiveTab('network');
            }}
          >
            {I18n.t('containers.masterNodes.masternodeTab.network')}
          </NavLink>
        </NavItem>
      </Nav>
    </>
  );
};

export default MasternodeTabs;
