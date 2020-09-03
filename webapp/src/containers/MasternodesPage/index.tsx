import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button, ButtonGroup } from 'reactstrap';
import { MdSearch, MdAdd } from 'react-icons/md';
import classnames from 'classnames';
import SearchBar from '../../components/SearchBar';
import MasternodesList from './components/MasterNodesList';
import { I18n } from 'react-redux-i18n';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import { CREATE_MASTER_NODES_PATH, RESIGNED_STATE } from '../../constants';
import MasternodeTab from './components/MasternodeTab';
import { connect } from 'react-redux';
import { fetchMasternodesRequest } from './reducer';
import { MasterNodeObject } from './masterNodeInterface';

interface MasternodesPageProps extends RouteComponentProps {
  masternodes: MasterNodeObject[];
  fetchMasternodesRequest: () => void;
  isLoadingMasternodes: boolean;
}

const MasternodesPage: React.FunctionComponent<MasternodesPageProps> = (
  props: MasternodesPageProps
) => {
  const { masternodes, fetchMasternodesRequest, isLoadingMasternodes } = props;
  const [searching, setSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('otherMasterNodes');
  const [disableTab, setDisableTab] = useState<boolean>(true);
  const [enabledMasternodes, setEnabledMasternodes] = useState<
    MasterNodeObject[]
  >([]);

  const toggleSearch = () => {
    if (searching) {
      setSearchQuery('');
    }
    setSearching(!searching);
  };

  useEffect(() => {
    fetchMasternodesRequest();
  }, []);

  useEffect(() => {
    if (!isLoadingMasternodes) {
      const myMasternodes = masternodes.filter(
        (masternode) =>
          masternode.state !== RESIGNED_STATE && masternode.isMyMasternode
      );
      if (myMasternodes.length > 0) {
        setDisableTab(false);
        setActiveTab('myMasternodes');
      }
    }
  }, [isLoadingMasternodes]);

  useEffect(() => {
    const isMyMasternodes = activeTab === 'myMasternodes';
    const enabledMasternodes = masternodes.filter((masternode) => {
      if (isMyMasternodes) {
        return masternode.state !== RESIGNED_STATE && masternode.isMyMasternode;
      }
      return masternode.state !== RESIGNED_STATE && !masternode.isMyMasternode;
    });
    setEnabledMasternodes(enabledMasternodes);
  }, [activeTab]);

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.masterNodes.masterNodesPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
        <h1 className={classnames({ 'd-none': searching })}>
          {I18n.t('containers.masterNodes.masterNodesPage.masterNodes')}
        </h1>
        {!disableTab && (
          <MasternodeTab setActiveTab={setActiveTab} activeTab={activeTab} />
        )}
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
            enabledMasternodes={enabledMasternodes}
          />
        </section>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { masternodes, isLoadingMasternodes } = state.masterNodes;
  return {
    masternodes,
    isLoadingMasternodes,
  };
};

const mapDispatchToProps = {
  fetchMasternodesRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(MasternodesPage);
