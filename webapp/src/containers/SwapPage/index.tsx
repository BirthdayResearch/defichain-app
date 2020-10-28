import React, { useState, useEffect } from 'react';
import { NavLink as RRNavLink } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MdAdd } from 'react-icons/md';
import {
  Button,
  ButtonGroup,
  Col,
  FormGroup,
  Label,
  Nav,
  NavItem,
  NavLink,
  Row,
  TabContent,
  TabPane,
} from 'reactstrap';

import classnames from 'classnames';

import { SWAP, POOL, CREATE_POOL_PAIR_PATH } from '../../constants';
import SwapTab from './components/SwapTab';
import PoolTab from './components/PoolTab';

interface SwapPageProps {}

const SwapPage: React.FunctionComponent<SwapPageProps> = (
  props: SwapPageProps
) => {
  const [activeTab, setActiveTab] = useState<string>(SWAP);

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.swap.swapPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
        <h1>{I18n.t('containers.swap.swapPage.swap')}</h1>
        <Nav pills className='justify-content-center'>
          <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === SWAP,
              })}
              onClick={() => {
                setActiveTab(SWAP);
              }}
            >
              {I18n.t('containers.swap.swapPage.swap')}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === POOL,
              })}
              onClick={() => {
                setActiveTab(POOL);
              }}
            >
              {I18n.t('containers.swap.swapPage.pool')}
            </NavLink>
          </NavItem>
        </Nav>
        <ButtonGroup
          style={{
            visibility: activeTab !== POOL ? 'hidden' : 'visible',
          }}
        >
          <Button to={CREATE_POOL_PAIR_PATH} tag={RRNavLink} color='link'>
            <MdAdd />
            <span className='d-lg-inline'>
              {I18n.t('containers.swap.swapPage.liquidity')}
            </span>
          </Button>
        </ButtonGroup>
      </header>
      <div className='content'>
        <TabContent activeTab={activeTab}>
          <TabPane tabId={SWAP}>
            <SwapTab />
          </TabPane>
          <TabPane tabId={POOL}>
            <PoolTab />
          </TabPane>
        </TabContent>
      </div>
      <footer className='footer-bar'>
        <div>
          <Row className='justify-content-between align-items-center'>
            <Col className='col-auto'>
              <FormGroup check>
                <Label check>
                  {I18n.t('containers.swap.swapPage.enterAnAmount')}
                </Label>
              </FormGroup>
            </Col>
            <Col className='d-flex justify-content-end'>
              <Button color='link' className='mr-3' disabled={true}>
                {I18n.t('containers.swap.swapPage.continue')}
              </Button>
            </Col>
          </Row>
        </div>
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => {};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(SwapPage);
