import React, { Component } from "react";
import { Helmet } from "react-helmet";
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
} from "reactstrap";
import { MdSearch } from "react-icons/md";
import KeyValueLi from "../../components/KeyValueLi/KeyValueLi";
import classnames from "classnames";
import StatCard from "../../components/StatCard/StatCard";
import SearchBar from "../../components/SearchBar/SearchBar";
import MasternodesList from "./MasternodesList";
import {
  MasternodesPageProps,
  MasternodesPageState,
} from "./MasternodesPage.interface";
import { I18n } from "react-redux-i18n";

class MasternodesPage extends Component<
  MasternodesPageProps,
  MasternodesPageState
> {
  state = {
    activeTab: "statistics",
    searching: false,
  };

  setActiveTab = (tab) => {
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
      <div className="main-wrapper">
        <Helmet>
          <title>
            {I18n.t("containers.masterNodes.masterNodesPage.title")}
          </title>
        </Helmet>
        <header className="header-bar">
          <h1 className={classnames({ "d-none": this.state.searching })}>
            {I18n.t("containers.masterNodes.masterNodesPage.masterNodes")}
          </h1>
          <Nav pills className={classnames({ "d-none": this.state.searching })}>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "statistics",
                })}
                onClick={() => {
                  this.setActiveTab("statistics");
                }}
              >
                {I18n.t("containers.masterNodes.masterNodesPage.statistics")}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "list",
                })}
                onClick={() => {
                  this.setActiveTab("list");
                }}
              >
                {I18n.t("containers.masterNodes.masterNodesPage.list")}
              </NavLink>
            </NavItem>
          </Nav>
          <ButtonGroup
            className={classnames({ "d-none": this.state.searching })}
          >
            <Button
              color="link"
              size="sm"
              className={classnames({
                invisible: this.state.activeTab === "statistics",
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
        <div className="content">
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="statistics">
              <section>
                <Row>
                  <Col>
                    <StatCard
                      label={I18n.t(
                        "containers.masterNodes.masterNodesPage.weeklyIncome"
                      )}
                      value="100"
                      unit="DFI"
                    />
                  </Col>
                  <Col>
                    <StatCard
                      label={I18n.t(
                        "containers.masterNodes.masterNodesPage.volume"
                      )}
                      value="10m"
                      unit="DFI"
                    />
                  </Col>
                  <Col>
                    <StatCard
                      label={I18n.t(
                        "containers.masterNodes.masterNodesPage.marketCap"
                      )}
                      value="100m"
                      unit="DFI"
                    />
                  </Col>
                </Row>
                <Row className="mb-5">
                  <Col md="6">
                    <KeyValueLi
                      label={I18n.t(
                        "containers.masterNodes.masterNodesPage.returnPerAnnum"
                      )}
                      value="6.69%"
                    />
                  </Col>
                  <Col md="6">
                    <KeyValueLi
                      label={I18n.t(
                        "containers.masterNodes.masterNodesPage.paidRewards"
                      )}
                      value="8651.0125 DFI"
                    />
                  </Col>
                  <Col md="6">
                    <KeyValueLi
                      label={I18n.t(
                        "containers.masterNodes.masterNodesPage.rewardFrequency"
                      )}
                      value="8d 11h 27m 20s"
                    />
                  </Col>
                  <Col md="6">
                    <KeyValueLi
                      label={I18n.t(
                        "containers.masterNodes.masterNodesPage.activeMasterNodes"
                      )}
                      value="4,671"
                    />
                  </Col>
                  <Col md="6">
                    <KeyValueLi
                      label={I18n.t(
                        "containers.masterNodes.masterNodesPage.supply"
                      )}
                      value="9,281,315 DFI"
                    />
                  </Col>
                  <Col md="6">
                    <KeyValueLi
                      label={I18n.t(
                        "containers.masterNodes.masterNodesPage.lockedInCollateral"
                      )}
                      value="4,671,000 DFI"
                    />
                  </Col>
                  <Col md="6">
                    <KeyValueLi
                      label={I18n.t(
                        "containers.masterNodes.masterNodesPage.costPerMasterNode"
                      )}
                      value="1,000 DFI"
                    />
                  </Col>
                  <Col md="6">
                    <KeyValueLi
                      label={I18n.t(
                        "containers.masterNodes.masterNodesPage.masternodeWorth"
                      )}
                      value="65,733.63 USD"
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
