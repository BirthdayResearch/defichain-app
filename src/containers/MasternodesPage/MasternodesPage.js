import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import {
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col
} from 'reactstrap';
import KeyValueLi from '../../components/KeyValueLi/KeyValueLi';
import classnames from 'classnames';
import StatCard from '../../components/StatCard/StatCard';
import MasternodesList from './MasternodesList';

class MasternodesPage extends Component {
  state = {
    activeTab: 'statistics'
  }

  setActiveTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>Masternodes – DeFi Blockchain Client</title>
        </Helmet>
        <header className="header-bar">
          <h1>Masternodes</h1>
          <Nav pills>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === 'statistics' })}
                onClick={() => {this.setActiveTab('statistics') }}
              >
                Statistics
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === 'list' })}
                onClick={() => {this.setActiveTab('list')}}
              >
                List
              </NavLink>
            </NavItem>
          </Nav>
          <div className="spacer"></div>
        </header>
        <div className="content">
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="statistics">
              <section>
                <Row>
                  <Col>
                    <StatCard label="Weekly income" value="100" unit="DFI" />
                  </Col>
                  <Col>
                    <StatCard label="Volume" value="10m" unit="DFI" />
                  </Col>
                  <Col>
                    <StatCard label="Market cap" value="100m" unit="DFI" />
                  </Col>
                </Row>
                <Row className="mb-5">
                  <Col md="6">
                    <KeyValueLi label="Return per annum" value="6.69%" />
                  </Col>
                  <Col md="6">
                    <KeyValueLi label="Paid rewards" value="8651.0125 DFI" />
                  </Col>
                  <Col md="6">
                    <KeyValueLi label="Reward frequency" value="8d 11h 27m 20s" />
                  </Col>
                  <Col md="6">
                    <KeyValueLi label="Active masternodes" value="4,671" />
                  </Col>
                  <Col md="6">
                    <KeyValueLi label="Supply" value="9,281,315 DFI" />
                  </Col>
                  <Col md="6">
                    <KeyValueLi label="Locked in collateral" value="4,671,000 DFI" />
                  </Col>
                  <Col md="6">
                    <KeyValueLi label="Cost per masternode" value="1,000 DFI" />
                  </Col>
                  <Col md="6">
                    <KeyValueLi label="Masternode worth" value="65,733.63 USD" />
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
            <TabPane tabId="list">
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

export default MasternodesPage;