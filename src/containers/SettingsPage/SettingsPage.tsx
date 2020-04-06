import React, { Component } from "react";
import { Helmet } from "react-helmet";
import {
  Button,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane,
  Row,
  Col,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap";
import { I18n } from "react-redux-i18n";
import { MdCheck } from "react-icons/md";
import classnames from "classnames";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import RangeSlider from "react-bootstrap-range-slider";
import { SettingsPageProps, SettingsPageState } from "./SettingsPage.interface";

class SettingsPage extends Component<SettingsPageProps, SettingsPageState> {
  state = {
    activeTab: "general",
    settingsPruneBlockStorage: false,
    settingsScriptVerificationThreads: 0,
    languages: [
      { label: I18n.t("containers.settings.english"), value: "en" },
      { label: I18n.t("containers.settings.german"), value: "de" },
    ],
    amountUnits: [
      { label: I18n.t("containers.settings.dFI"), value: "DFI" },
      { label: I18n.t("containers.settings.µDFI"), value: "µDFI" },
    ],
    displayModes: [
      {
        label: I18n.t("containers.settings.sameAsSystem"),
        value: "same_as_system",
      },
      { label: I18n.t("containers.settings.light"), value: "light" },
      { label: I18n.t("containers.settings.dark"), value: "dark" },
    ],
    settingsLanguage: {
      label: I18n.t("containers.settings.english"),
      value: "en",
    },
    settingsAmountsUnit: {
      label: I18n.t("containers.settings.dFI"),
      value: "DFI",
    },
    settingDisplayMode: {
      label: I18n.t("containers.settings.sameAsSystem"),
      value: "same_as_system",
    },
  };

  setActiveTab = (tab) => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  toggleSettingsPruneBlockStorage = () => {
    this.setState({
      settingsPruneBlockStorage: !this.state.settingsPruneBlockStorage,
    });
  };

  adjustScriptVerificationThreads = (e) => {
    this.setState({
      settingsScriptVerificationThreads: parseInt(e.target.value),
    });
  };

  adjustLanguage = (langObj) => {
    this.setState({
      settingsLanguage: langObj,
    });
  };

  changeDisplayMode = (displayObj) => {
    this.setState({
      settingDisplayMode: displayObj,
    });
  };

  adjustAmountsUnit = (unitObj) => {
    this.setState({
      settingsAmountsUnit: unitObj,
    });
  };

  render() {
    const {
      languages,
      settingsLanguage,
      amountUnits,
      settingsAmountsUnit,
      displayModes,
      settingDisplayMode,
    } = this.state;
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>{I18n.t("containers.settings.title")}</title>
        </Helmet>
        <header className="header-bar">
          <h1>{I18n.t("containers.settings.settings")}</h1>
          <Nav pills>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "general",
                })}
                onClick={() => {
                  this.setActiveTab("general");
                }}
              >
                {I18n.t("containers.settings.general")}
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({
                  active: this.state.activeTab === "display",
                })}
                onClick={() => {
                  this.setActiveTab("display");
                }}
              >
                {I18n.t("containers.settings.display")}
              </NavLink>
            </NavItem>
          </Nav>
          <div></div>
        </header>
        <div className="content">
          <TabContent activeTab={this.state.activeTab}>
            <TabPane tabId="general">
              <section>
                <Form>
                  <Row className="mb-5">
                    <Col md="4">
                      {I18n.t("containers.settings.launchOptions")}
                    </Col>
                    <Col md="8">
                      <FormGroup>
                        <FormGroup check>
                          <Label check className="switch">
                            <Input type="checkbox" />{" "}
                            {I18n.t("containers.settings.launchAtLogin")}
                          </Label>
                        </FormGroup>
                      </FormGroup>
                      <FormGroup>
                        <FormGroup check>
                          <Label check className="switch">
                            <Input type="checkbox" />{" "}
                            {I18n.t("containers.settings.minimizedAtLaunch")}
                          </Label>
                        </FormGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mb-5">
                    <Col md="4">{I18n.t("containers.settings.storage")}</Col>
                    <Col md="8">
                      <FormGroup>
                        <FormGroup check>
                          <Label check className="switch">
                            <Input
                              type="checkbox"
                              checked={this.state.settingsPruneBlockStorage}
                              onChange={this.toggleSettingsPruneBlockStorage}
                            />
                            {I18n.t("containers.settings.pruneBlockStorage")}
                          </Label>
                        </FormGroup>
                      </FormGroup>
                      <FormGroup
                        className={`form-label-group ${classnames({
                          "d-none": !this.state.settingsPruneBlockStorage,
                        })}`}
                      >
                        <InputGroup>
                          <Input
                            type="text"
                            name="pruneTo"
                            id="pruneTo"
                            placeholder="Number"
                          />
                          <Label for="pruneTo">
                            {I18n.t("containers.settings.blockPruneStorage")}
                          </Label>
                          <InputGroupAddon addonType="append">
                            <InputGroupText>GB</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup className="form-label-group mb-5">
                        <InputGroup>
                          <Input
                            type="text"
                            name="dbCacheSize"
                            id="dbCacheSize"
                            placeholder="Number"
                          />
                          <Label for="dbCacheSize">
                            {I18n.t("containers.settings.databaseSize")}
                          </Label>
                          <InputGroupAddon addonType="append">
                            <InputGroupText>
                              {I18n.t("containers.settings.mib")}
                            </InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4">
                      {I18n.t("containers.settings.scriptVerification")}
                    </Col>
                    <Col md="8">
                      <FormGroup className="form-row">
                        <Col md="8">
                          <Label for="scriptVerificationThreads">
                            {I18n.t("containers.settings.noOfThreads")}
                          </Label>
                          <Row className="align-items-center">
                            <Col className="col-auto">
                              <RangeSlider
                                value={
                                  this.state.settingsScriptVerificationThreads
                                }
                                onChange={this.adjustScriptVerificationThreads}
                                min={-2}
                                max={16}
                                step={1}
                                tooltip="off"
                                id="scriptVerificationThreads"
                              />
                            </Col>
                            {this.state.settingsScriptVerificationThreads === 0
                              ? "Auto"
                              : this.state.settingsScriptVerificationThreads}
                          </Row>
                        </Col>
                      </FormGroup>
                    </Col>
                  </Row>
                </Form>
              </section>
            </TabPane>
            <TabPane tabId="display">
              <section>
                <Form>
                  <FormGroup className="form-row align-items-center">
                    <Col md="4">
                      {I18n.t("containers.settings.appLanguage")}
                    </Col>
                    <Col md="8">
                      <UncontrolledDropdown>
                        <DropdownToggle caret color="outline-secondary">
                          {settingsLanguage.label}
                        </DropdownToggle>
                        <DropdownMenu>
                          {languages.map((language) => {
                            return (
                              <DropdownItem
                                className="d-flex justify-content-between"
                                key={language.value}
                                onClick={() => this.adjustLanguage(language)}
                                value={language.value}
                              >
                                <span>{language.label}</span>{" "}
                                {settingsLanguage.value === language.value && (
                                  <MdCheck />
                                )}
                              </DropdownItem>
                            );
                          })}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Col>
                  </FormGroup>
                  <FormGroup className="form-row align-items-center">
                    <Col md="4">
                      {I18n.t("containers.settings.displayAmount")}
                    </Col>
                    <Col md="8">
                      <UncontrolledDropdown>
                        <DropdownToggle caret color="outline-secondary">
                          {settingsAmountsUnit.label}
                        </DropdownToggle>
                        <DropdownMenu>
                          {amountUnits.map((eachUnit) => {
                            return (
                              <DropdownItem
                                className="d-flex justify-content-between"
                                onClick={() => this.adjustAmountsUnit(eachUnit)}
                                key={eachUnit.value}
                                value={eachUnit.value}
                              >
                                <span>{eachUnit.label}</span>{" "}
                                {settingsAmountsUnit.value ===
                                  eachUnit.value && <MdCheck />}
                              </DropdownItem>
                            );
                          })}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Col>
                  </FormGroup>
                  <FormGroup className="form-row align-items-center">
                    <Col md="4">
                      {I18n.t("containers.settings.displayMode")}
                    </Col>
                    <Col md="8">
                      <UncontrolledDropdown>
                        <DropdownToggle caret color="outline-secondary">
                          {settingDisplayMode.label}
                        </DropdownToggle>
                        <DropdownMenu>
                          {displayModes.map((displayMode) => {
                            return (
                              <DropdownItem
                                className="d-flex justify-content-between"
                                key={displayMode.value}
                                onClick={() =>
                                  this.changeDisplayMode(displayMode)
                                }
                                value={displayMode.value}
                              >
                                <span>{displayMode.label}</span>{" "}
                                {settingDisplayMode.value ===
                                  displayMode.value && <MdCheck />}
                              </DropdownItem>
                            );
                          })}
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Col>
                  </FormGroup>
                </Form>
              </section>
            </TabPane>
          </TabContent>
        </div>
        <footer className="footer-bar">
          <Row className="justify-content-between align-items-center">
            <Col className="col-auto">
              {I18n.t("containers.settings.unsavedChanges")}
            </Col>
            <Col className="d-flex justify-content-end">
              <Button color="primary">
                {I18n.t("containers.settings.saveSettings")}
              </Button>
            </Col>
          </Row>
        </footer>
      </div>
    );
  }
}

export default SettingsPage;
