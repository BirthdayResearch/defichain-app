import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import classnames from 'classnames';

interface SettingsTabsHeaderProps {
  setActiveTab: Function;
  activeTab: string;
}

const SettingsTabsHeader = (props: SettingsTabsHeaderProps) => {
  const { setActiveTab, activeTab } = props;
  return (
    <header className='header-bar'>
      <h1>{I18n.t('containers.settings.settings')}</h1>
      <Nav pills>
        <NavItem>
          <NavLink
            className={classnames({
              active: activeTab === 'general',
            })}
            onClick={() => {
              setActiveTab('general');
            }}
          >
            {I18n.t('containers.settings.general')}
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({
              active: activeTab === 'display',
            })}
            onClick={() => {
              setActiveTab('display');
            }}
          >
            {I18n.t('containers.settings.display')}
          </NavLink>
        </NavItem>
      </Nav>
      <div></div>
    </header>
  );
};

export default SettingsTabsHeader;
