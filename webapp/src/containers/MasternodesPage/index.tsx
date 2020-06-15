import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Button, ButtonGroup } from 'reactstrap';
import { MdSearch, MdAdd } from 'react-icons/md';
import classnames from 'classnames';
import SearchBar from '../../components/SearchBar';
import MasternodesList from './components/MasterNodesList';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { NavLink as RRNavLink } from 'react-router-dom';
import { CREATE_MASTER_NODES_PATH } from '../../constants';

interface MasternodesPageProps {
  unit: string;
}

interface MasternodesPageState {
  searching: boolean;
}

class MasternodesPage extends Component<
  MasternodesPageProps,
  MasternodesPageState
> {
  state = {
    searching: false,
  };

  toggleSearch = () => {
    this.setState({
      searching: !this.state.searching,
    });
  };

  render() {
    return (
      <div className='main-wrapper'>
        <Helmet>
          <title>
            {I18n.t('containers.masterNodes.masterNodesPage.title')}
          </title>
        </Helmet>
        <header className='header-bar'>
          <h1 className={classnames({ 'd-none': this.state.searching })}>
            {I18n.t('containers.masterNodes.masterNodesPage.masterNodes')}
          </h1>
          <ButtonGroup
            className={classnames({ 'd-none': this.state.searching })}
          >
            <Button color='link' size='sm' onClick={this.toggleSearch}>
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
            searching={this.state.searching}
            toggleSearch={this.toggleSearch}
          />
        </header>
        <div className='content'>
          <section>
            <MasternodesList />
          </section>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { appConfig } = state.settings;
  return {
    unit: appConfig.unit,
  };
};

export default connect(mapStateToProps)(MasternodesPage);
