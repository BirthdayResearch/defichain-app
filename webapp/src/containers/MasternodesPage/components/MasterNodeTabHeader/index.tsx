import React from 'react';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { I18n } from 'react-redux-i18n';
import classnames from 'classnames';
import style from './MasterNodeTabHeader.module.scss';
import { ALL, MINE } from '../../../../constants';

interface MasterNodeTabsHeaderProps {
  setTab: (tab: string) => void;
  tab: string;
}

const MasterNodeTabsHeader: React.FunctionComponent<MasterNodeTabsHeaderProps> = (
  props: MasterNodeTabsHeaderProps
) => {
  const { setTab, tab } = props;
  return (
    <Nav pills className={style.navPosition}>
      <NavItem>
        <NavLink
          className={classnames({
            active: tab === MINE,
          })}
          onClick={() => {
            setTab(MINE);
          }}
        >
          {I18n.t('containers.masterNodes.masterNodesPage.mine')}
        </NavLink>
      </NavItem>
      <NavItem>
        <NavLink
          className={classnames({
            active: tab === ALL,
          })}
          onClick={() => {
            setTab(ALL);
          }}
        >
          {I18n.t('containers.masterNodes.masterNodesPage.all')}
        </NavLink>
      </NavItem>
    </Nav>
  );
};

export default MasterNodeTabsHeader;
