import React from 'react';
import { Helmet } from 'react-helmet';
import { MdArrowBack } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import {
  Button,
  Col,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
} from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import classnames from 'classnames';

import { SWAP_PATH } from '../../../../constants';
import DefiIcon from '../../../../assets/svg/defi-icon.svg';
import Styles from './removeLiquidity.module.scss';

interface RemoveLiquidityProps {}

const RemoveLiquidity: React.FunctionComponent<RemoveLiquidityProps> = (
  props: RemoveLiquidityProps
) => {
  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.swap.swapPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
        <Button
          to={SWAP_PATH}
          tag={RRNavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span>{I18n.t('containers.swap.removeLiquidity.back')}</span>
        </Button>
        <h1 className={classnames({ 'd-none': false })}>
          {I18n.t('containers.swap.removeLiquidity.removeLiquidity')}
        </h1>
      </header>
      <div className='content'>
        <section>
          <FormGroup>
            <Label for='removeLiquidityRange'>
              {I18n.t('containers.swap.removeLiquidity.removeLiquidityAmount')}
            </Label>
            <Row className='align-items-center'>
              <Col sm={2}>
                <InputGroup className='m-2'>
                  <Input
                    type='number'
                    id='inputAmount'
                    defaultValue='0'
                    className='border-right-0'
                  />
                  <InputGroupAddon addonType='prepend'>
                    <InputGroupText className='border-left-0'>
                      {I18n.t(
                        'containers.swap.removeLiquidity.removeLiquidityPercentage'
                      )}
                    </InputGroupText>
                  </InputGroupAddon>
                </InputGroup>
              </Col>
              <Col
                sm={10}
                className='d-flex align-items-center justify-content-center'
              >
                <span className={Styles.rangeText}>
                  {I18n.t('containers.swap.removeLiquidity.none')}
                </span>
                <Input
                  type='range'
                  name='removeLiquidityRange'
                  id='removeLiquidityRange'
                  defaultValue='0'
                  className={Styles.rangeSlider}
                />
                <span className={Styles.rangeText}>
                  {I18n.t('containers.swap.removeLiquidity.all')}
                </span>
              </Col>
            </Row>
          </FormGroup>
          <Row>
            <Col md='12'>
              <Row className='align-items-center'>
                <Col>
                  <img src={DefiIcon} />
                  <span className={Styles.logoText}>{`DFI`}</span>
                </Col>
                <Col className={Styles.colText}>{`49,999.5 of 99,999 DFI`}</Col>
              </Row>
              <hr />
              <Row className='align-items-center'>
                <Col>
                  <img src={DefiIcon} />
                  <span className={Styles.logoText}>{`DOO`}</span>
                </Col>
                <Col
                  className={Styles.colText}
                >{`499,999.5 of 999,999 DOO`}</Col>
              </Row>
              <hr />
              <Row>
                <Col>{I18n.t('containers.swap.removeLiquidity.price')}</Col>
                <Col className={Styles.colText}>
                  {`10,00000 DOO per DFI
                        0.10000 DFI per DOO`}
                </Col>
              </Row>
            </Col>
          </Row>
        </section>
      </div>
      <footer className='footer-bar'>
        <Row className='justify-content-between align-items-center'>
          <Col className='col-auto'>
            <FormGroup check>
              <Label check>
                {I18n.t(
                  'containers.swap.removeLiquidity.enterRemoveLiquidityAmount'
                )}
              </Label>
            </FormGroup>
          </Col>
          <Col className='d-flex justify-content-end'>
            <Button
              color='link'
              className='mr-3'
              disabled={true}
              // onClick={}
            >
              {I18n.t('containers.swap.removeLiquidity.continue')}
            </Button>
          </Col>
        </Row>
      </footer>
    </div>
  );
};

export default RemoveLiquidity;
