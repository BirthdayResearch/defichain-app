import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  Button,
  ButtonGroup,
} from 'reactstrap';
import { MdSearch } from 'react-icons/md';
import KeyValueLi from '../../components/KeyValueLi';
import classnames from 'classnames';
import StatCard from '../../components/StatCard';
import SearchBar from '../../components/SearchBar';
import MasternodesList from './components/MasterNodesList';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { getAmountInSelectedUnit } from '../../utils/utility';

interface MasternodesPageProps {
  unit: string;
}

interface MasternodesPageState {
  activeTab: string;
  searching: boolean;
}

class MasternodesPage extends Component<
  MasternodesPageProps,
  MasternodesPageState
> {
  state = {
    activeTab: 'statistics',
    searching: false,
  };

  setActiveTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
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
          <Nav pills className={classnames({ 'd-none': this.state.searching })}>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === 'statistics',
                })}
                onClick={() => {
                  this.setActiveTab('statistics');
                }}
              >
                {I18n.t('containers.masterNodes.masterNodesPage.statistics')}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === 'list',
                })}
                onClick={() => {
                  this.setActiveTab('list');
                }}
              >
                {I18n.t('containers.masterNodes.masterNodesPage.list')}
              </NavLink>
            </NavItem>
          </Nav>
          <ButtonGroup
            className={classnames({ 'd-none': this.state.searching })}
          >
            <Button
              color='link'
              size='sm'
              className={classnames({
                invisible: this.state.activeTab === 'statistics',
              })}
              onClick={this.toggleSearch}
            >
              <MdSearch />
            </Button>
          </ButtonGroup>
          <SearchBar
            searching={this.state.searching}
            toggleSearch={this.toggleSearch}
          />
        </header>
        <div className='content'>
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId='statistics'>
              <section>
                <Row>
                  <Col>
                    <StatCard
                      label={I18n.t(
                        'containers.masterNodes.masterNodesPage.weeklyIncome'
                      )}
                      value={getAmountInSelectedUnit('100', this.props.unit)}
                      unit={this.props.unit}
                    />
                  </Col>
                  <Col>
                    <StatCard
                      label={I18n.t(
                        'containers.masterNodes.masterNodesPage.volume'
                      )}
                      value={getAmountInSelectedUnit(
                        '10000000',
                        this.props.unit
                      )}
                      unit={this.props.unit}
                    />
                  </Col>
                  <Col>
                    <StatCard
                      label={I18n.t(
                        'containers.masterNodes.masterNodesPage.marketCap'
                      )}
                      value={getAmountInSelectedUnit(
                        '100000000',
                        this.props.unit
                      )}
                      unit={this.props.unit}
                    />
                  </Col>
                </Row>
                <Row className='mb-5'>
                  <Col md='6'>
                    <KeyValueLi
                      label={I18n.t(
                        'containers.masterNodes.masterNodesPage.returnPerAnnum'
                      )}
                      value='6.69%'
                    />
                  </Col>
                  <Col md='6'>
                    <KeyValueLi
                      label={I18n.t(
                        'containers.masterNodes.masterNodesPage.paidRewards'
                      )}
                      value={`${getAmountInSelectedUnit(
                        '8651.0125',
                        this.props.unit
                      )} ${this.props.unit}`}
                    />
                  </Col>
                  <Col md='6'>
                    <KeyValueLi
                      label={I18n.t(
                        'containers.masterNodes.masterNodesPage.rewardFrequency'
                      )}
                      value='8d 11h 27m 20s'
                    />
                  </Col>
                  <Col md='6'>
                    <KeyValueLi
                      label={I18n.t(
                        'containers.masterNodes.masterNodesPage.activeMasterNodes'
                      )}
                      value='4,671'
                    />
                  </Col>
                  <Col md='6'>
                    <KeyValueLi
                      label={I18n.t(
                        'containers.masterNodes.masterNodesPage.supply'
                      )}
                      value={`${getAmountInSelectedUnit(
                        '9281315',
                        this.props.unit
                      )} ${this.props.unit}`}
                    />
                  </Col>
                  <Col md='6'>
                    <KeyValueLi
                      label={I18n.t(
                        'containers.masterNodes.masterNodesPage.lockedInCollateral'
                      )}
                      value={`${getAmountInSelectedUnit(
                        '4671000',
                        this.props.unit
                      )} ${this.props.unit}`}
                    />
                  </Col>
                  <Col md='6'>
                    <KeyValueLi
                      label={I18n.t(
                        'containers.masterNodes.masterNodesPage.costPerMasterNode'
                      )}
                      value={`${getAmountInSelectedUnit(
                        '1000',
                        this.props.unit
                      )} ${this.props.unit}`}
                    />
                  </Col>
                  <Col md='6'>
                    <KeyValueLi
                      label={I18n.t(
                        'containers.masterNodes.masterNodesPage.masternodeWorth'
                      )}
                      value='65,733.63 USD'
                    />
                  </Col>
                </Row>
              </section>
              {/* <section>
                <h2>Masternodes map</h2>
                <Card>
                  <MapChart />
                </Card>
              </section> */}
            </TabPane>
            <TabPane tabId='list'>
              <section>
                <MasternodesList />
              </section>
            </TabPane>
          </TabContent>
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
