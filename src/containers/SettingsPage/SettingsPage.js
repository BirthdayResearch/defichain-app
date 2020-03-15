import React, { Component } from 'react';
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
  DropdownItem
} from 'reactstrap';
import {
  MdCheck
} from 'react-icons/md';
import classnames from 'classnames';
import 'react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css';
import RangeSlider from 'react-bootstrap-range-slider';

class SettingsPage extends Component {
  state = {
    activeTab: 'general',
    settingsPruneBlockStorage: false,
    settingsScriptVerificationThreads: 0,
    settingsLanguage: 'English',
    settingsAmountsUnit: 'DFI',
    languages: [
      { english: 'English' },
      { german: 'German' }
    ]
  }

  setActiveTab = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  toggleSettingsPruneBlockStorage = () => {
    this.setState({
      settingsPruneBlockStorage: !this.state.settingsPruneBlockStorage
    });
  }

  adjustScriptVerificationThreads = (e) => {
    this.setState({
      settingsScriptVerificationThreads: e.target.value
    });
  }

  adjustLanguage = (e) => {
    this.setState({
      settingsLanguage: e.target.value
    });
  }

  adjustAmountsUnit = (e) => {
    this.setState({
      settingsAmountsUnit: e.target.value
    });
  }

  render() {
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>Settings – DeFi Blockchain Client</title>
        </Helmet>
        <header className="header-bar">
          <h1>Settings</h1>
          <Nav pills>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === 'general' })}
                onClick={() => { this.setActiveTab('general') }}
              >
                General
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={classnames({ active: this.state.activeTab === 'display' })}
                onClick={() => { this.setActiveTab('display') }}
              >
                Display
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
                      Launch options
                    </Col>
                    <Col md="8">
                      <FormGroup>
                        <FormGroup check>
                          <Label check>
                            <Input type="checkbox" /> Launch at login
                          </Label>
                        </FormGroup>
                      </FormGroup>
                      <FormGroup>
                        <FormGroup check>
                          <Label check>
                            <Input type="checkbox" /> Minimized at launch
                          </Label>
                        </FormGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row className="mb-5">
                    <Col md="4">
                      Storage
                    </Col>
                    <Col md="8">
                      <FormGroup>
                        <FormGroup check>
                          <Label check>
                            <Input
                              type="checkbox"
                              checked={this.state.settingsPruneBlockStorage}
                              onChange={this.toggleSettingsPruneBlockStorage}
                            />
                            Prune block storage
                          </Label>
                        </FormGroup>
                      </FormGroup>
                      <FormGroup className={`form-label-group ${classnames({ 'd-none': !this.state.settingsPruneBlockStorage })}`}>
                        <InputGroup>
                          <Input type="text" name="pruneTo" id="pruneTo" placeholder="Number" />
                          <Label for="pruneTo">Block storage to prune</Label>
                          <InputGroupAddon addonType="append">
                            <InputGroupText>GB</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormGroup>
                      <FormGroup className="form-label-group mb-5">
                        <InputGroup>
                          <Input type="text" name="dbCacheSize" id="dbCacheSize" placeholder="Number" />
                          <Label for="dbCacheSize">Size of database cache</Label>
                          <InputGroupAddon addonType="append">
                            <InputGroupText>MiB</InputGroupText>
                          </InputGroupAddon>
                        </InputGroup>
                      </FormGroup>
                    </Col>
                  </Row>
                  <Row>
                    <Col md="4">
                      Script verification
                    </Col>
                    <Col md="8">
                      <FormGroup className="form-row">
                        <Col md="8">
                          <Label for="scriptVerificationThreads">Number of threads</Label>
                          <Row className="align-items-center">
                            <Col className="col-auto">
                              <RangeSlider
                                value={this.state.settingsScriptVerificationThreads}
                                onChange={this.adjustScriptVerificationThreads}
                                min={-2}
                                max={16}
                                step={1}
                                tooltip="off"
                                id="scriptVerificationThreads"
                              />
                            </Col>
                            {this.state.settingsScriptVerificationThreads == 0 ? 'Auto' : this.state.settingsScriptVerificationThreads}
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
                      App language
                    </Col>
                    <Col md="8">
                      <UncontrolledDropdown>
                        <DropdownToggle caret color="outline-secondary">
                          {this.state.settingsLanguage}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem className="d-flex justify-content-between" onClick={this.adjustLanguage} value="English">
                            English {this.state.settingsLanguage === "English" ? <MdCheck /> : ''}
                          </DropdownItem>
                          <DropdownItem className="d-flex justify-content-between" onClick={this.adjustLanguage} value="German">
                            German {this.state.settingsLanguage === "German" ? <MdCheck /> : ''}
                          </DropdownItem>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </Col>
                  </FormGroup>
                  <FormGroup className="form-row align-items-center">
                    <Col md="4">
                      Display amounts in unit
                    </Col>
                    <Col md="8">
                      <UncontrolledDropdown>
                        <DropdownToggle caret color="outline-secondary">
                          {this.state.settingsAmountsUnit}
                        </DropdownToggle>
                        <DropdownMenu>
                          <DropdownItem className="d-flex justify-content-between" onClick={this.adjustAmountsUnit} value="DFI">
                            DFI {this.state.settingsAmountsUnit === "DFI" ? <MdCheck /> : ''}
                          </DropdownItem>
                          <DropdownItem className="d-flex justify-content-between" onClick={this.adjustAmountsUnit} value="µDFI">
                            µDFI {this.state.settingsAmountsUnit === "µDFI" ? <MdCheck /> : ''}
                          </DropdownItem>
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
              You have unsaved changes
            </Col>
            <Col className="d-flex justify-content-end">
              <Button
                color="primary"
              >
                Save setttings
              </Button>
            </Col>
          </Row>
        </footer>
      </div>
    );
  }
}

export default SettingsPage;