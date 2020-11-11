import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { MdArrowBack, MdCheck } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import {
  Button,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  UncontrolledDropdown,
} from 'reactstrap';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import classnames from 'classnames';
import { connect } from 'react-redux';

import { SWAP_PATH } from '../../../../constants';
import { fetchPoolpair } from '../../reducer';
import styles from './removeLiquidity.module.scss';
import { getIcon, getRatio } from '../../../../utils/utility';
import { getReceivingAddressAndAmountList } from '../../../TokensPage/service';

interface RouteParams {
  id?: string;
}

interface RemoveLiquidityProps extends RouteComponentProps<RouteParams> {
  fetchPoolpair: (id) => void;
  poolpair: any;
}

const RemoveLiquidity: React.FunctionComponent<RemoveLiquidityProps> = (
  props: RemoveLiquidityProps
) => {
  const [formState, setFormState] = useState<any>({
    amountPercentage: '0',
    receiveAddress: '',
  });

  const [receiveAddresses, setReceiveAddresses] = useState<any>([]);

  const { id } = props.match.params;

  const { fetchPoolpair, poolpair } = props;

  useEffect(() => {
    fetchPoolpair({
      id,
    });
  }, []);

  useEffect(() => {
    async function addressAndAmount() {
      const data = await getReceivingAddressAndAmountList();
      setReceiveAddresses(data.addressAndAmountList);
    }
    addressAndAmount();
  }, []);

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.swap.swapPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
        <Button
          to={`${SWAP_PATH}?tab=pool`}
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
                    id='amountPercentage'
                    value={formState.amountPercentage}
                    className='border-right-0'
                    onChange={(e) => {
                      if (Number(e.target.value) <= 100) {
                        setFormState({
                          ...formState,
                          amountPercentage: e.target.value,
                        });
                      }
                    }}
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
                <span className={styles.rangeText}>
                  {I18n.t('containers.swap.removeLiquidity.none')}
                </span>
                <input
                  type='range'
                  name='removeLiquidityRange'
                  id='removeLiquidityRange'
                  value={formState.amountPercentage}
                  className='custom-range ml-5 mr-5'
                  onChange={(e) => {
                    setFormState({
                      ...formState,
                      amountPercentage: e.target.value,
                    });
                  }}
                />
                <span className={styles.rangeText}>
                  {I18n.t('containers.swap.removeLiquidity.all')}
                </span>
              </Col>
            </Row>
          </FormGroup>
          <Row>
            <Col md='12'>
              <Row className='align-items-center'>
                <Col>
                  <img
                    src={getIcon(poolpair.tokenA)}
                    height={'26px'}
                    width={'26px'}
                  />
                  <span className={styles.logoText}>{poolpair.tokenA}</span>
                </Col>
                <Col className={styles.colText}>{`49,999.5 of 99,999 DFI`}</Col>
              </Row>
              <hr />
              <Row className='align-items-center'>
                <Col>
                  <img
                    src={getIcon(poolpair.tokenB)}
                    height={'26px'}
                    width={'26px'}
                  />
                  <span className={styles.logoText}>{poolpair.tokenB}</span>
                </Col>
                <Col
                  className={styles.colText}
                >{`499,999.5 of 999,999 DOO`}</Col>
              </Row>
              <hr />
              <Row>
                <Col>{I18n.t('containers.swap.removeLiquidity.price')}</Col>
                <Col className={styles.colText}>
                  {`${getRatio(poolpair)} ${poolpair.tokenA} per ${
                    poolpair.tokenB
                  }`}
                  <br />
                  {`${1 / getRatio(poolpair)} ${poolpair.tokenB} per ${
                    poolpair.tokenA
                  }`}
                </Col>
              </Row>
              <hr />
            </Col>
          </Row>
          <UncontrolledDropdown className='w-100'>
            <DropdownToggle
              caret
              color='outline-secondary'
              className={`${styles.divisibilityDropdown}`}
              // disabled={isUpdate}
            >
              {formState.receiveAddress
                ? formState.receiveAddress
                : I18n.t('containers.swap.removeLiquidity.receiveAddress')}
            </DropdownToggle>
            <DropdownMenu className='overflow-auto'>
              {receiveAddresses.map((data) => {
                return (
                  <DropdownItem
                    className='d-flex justify-content-between ml-0'
                    key={data.address}
                    name='receiveAddress'
                    onClick={() =>
                      setFormState({
                        ...formState,
                        receiveAddress: data.address,
                      })
                    }
                    value={data.address}
                  >
                    <span>{I18n.t(data.address)}</span>
                    &nbsp;
                    {formState.receiveAddress === data.address && <MdCheck />}
                  </DropdownItem>
                );
              })}
            </DropdownMenu>
          </UncontrolledDropdown>
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
            <Button color='link' className='mr-3' disabled={true}>
              {I18n.t('containers.swap.removeLiquidity.continue')}
            </Button>
          </Col>
        </Row>
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { poolpair } = state.swap;
  return {
    poolpair,
  };
};

const mapDispatchToProps = {
  fetchPoolpair,
};

export default connect(mapStateToProps, mapDispatchToProps)(RemoveLiquidity);
