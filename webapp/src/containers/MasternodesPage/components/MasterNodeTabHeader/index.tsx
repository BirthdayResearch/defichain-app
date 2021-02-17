import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import classnames from 'classnames';

interface MasterNodeTabsHeaderProps {
  setTab: (tab: string) => void;
  tab: string;
}

const MasterNodeTabsHeader = (props: MasterNodeTabsHeaderProps) => {
  const { setTab, tab } = props;
  return (
    <Nav pills>
      <NavItem>
        <NavLink
          className={classnames({
            active: tab === 'mine',
          })}
          onClick={() => {
            setTab('mine');
          }}
        >
          {I18n.t('containers.masterNodes.masterNodesPage.mine')}
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          className={classnames({
            active: tab === 'all',
          })}
          onClick={() => {
            setTab('all');
          }}
        >
          {I18n.t('containers.masterNodes.masterNodesPage.all')}
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default MasterNodeTabsHeader;
