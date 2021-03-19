import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import classnames from 'classnames';
import Header from '../../../HeaderComponent';
import styles from './SettingsTabHeader.module.scss';

interface SettingsTabsHeaderProps {
  setActiveTab: (tab: string) => void;
  activeTab: string;
  displaySecurityTab?: boolean;
}

export enum SettingsTabs {
  general = 'general',
  security = 'security',
  display = 'display',
}

const SettingsTabsHeader = (props: SettingsTabsHeaderProps) => {
  const { setActiveTab, activeTab, displaySecurityTab } = props;
  return (
    <Header>
      <h1>{I18n.t('containers.settings.settings')}</h1>
      <Nav pills className={styles.absoluteCenter}>
        <NavItem>
          <NavLink
            className={classnames({
              active: activeTab === SettingsTabs.general,
            })}
            onClick={() => {
              setActiveTab(SettingsTabs.general);
            }}
          >
            {I18n.t('containers.settings.general')}
          </NavLink>
        </NavItem>
        {displaySecurityTab && (
          <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === SettingsTabs.security,
              })}
              onClick={() => {
                setActiveTab(SettingsTabs.security);
              }}
            >
              {I18n.t('containers.settings.security')}
            </NavLink>
          </NavItem>
        )}

        <NavItem>
          <NavLink
            className={classnames({
              active: activeTab === SettingsTabs.display,
            })}
            onClick={() => {
              setActiveTab(SettingsTabs.display);
            }}
          >
            {I18n.t('containers.settings.display')}
          </NavLink>
        </NavItem>
      </Nav>
      <div></div>
    </Header>
  );
};

export default SettingsTabsHeader;
