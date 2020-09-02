import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button, ButtonGroup } from 'reactstrap';
import { MdSearch, MdAdd } from 'react-icons/md';
import classnames from 'classnames';
import SearchBar from '../../components/SearchBar';
import MasternodesList from './components/MasterNodesList';
import { I18n } from 'react-redux-i18n';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import { CREATE_MASTER_NODES_PATH } from '../../constants';
import MasternodeTab from './components/MasternodeTab';

const MasternodesPage: React.FunctionComponent<RouteComponentProps> = (
  props: RouteComponentProps
) => {
  const [searching, setSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('myMasternodes');
  const toggleSearch = () => {
    if (searching) {
      setSearchQuery('');
    }
    setSearching(!searching);
  };
  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.masterNodes.masterNodesPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
        <h1 className={classnames({ 'd-none': searching })}>
          {I18n.t('containers.masterNodes.masterNodesPage.masterNodes')}
        </h1>
        <MasternodeTab setActiveTab={setActiveTab} activeTab={activeTab} />
        <ButtonGroup className={classnames({ 'd-none': searching })}>
          <Button color='link' size='sm' onClick={toggleSearch}>
            <MdSearch />
          </Button>
          <Button to={CREATE_MASTER_NODES_PATH} tag={RRNavLink} color='link'>
            <MdAdd />
            <span className='d-lg-inline'>
              {I18n.t(
                'containers.masterNodes.masterNodesPage.createMasterNode'
              )}
            </span>
          </Button>
        </ButtonGroup>
        <SearchBar
          onChange={(e) => setSearchQuery(e.target.value)}
          searching={searching}
          toggleSearch={toggleSearch}
        />
      </header>
      <div className='content'>
        <section>
          <MasternodesList
            activeTab={activeTab}
            searchQuery={searchQuery}
            history={props.history}
          />
        </section>
      </div>
    </div>
  );
};

export default MasternodesPage;
