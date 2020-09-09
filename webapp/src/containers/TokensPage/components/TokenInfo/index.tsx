import React, { useEffect, useState } from 'react';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MdArrowBack, MdMoreHoriz } from 'react-icons/md';
import {
  Button,
  Row,
  Col,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import KeyValueLi from '../../../../components/KeyValueLi';
// import DeefIcon from '../../../../assets/svg/icon-coin-deef-lapis.svg';
import { fetchTokenInfo } from '../../reducer';
import { TOKENS_PATH, TOKEN_TRANSFERS } from '../../../../constants';

interface RouteParams {
  id?: string;
}

interface TokenInfoProps extends RouteComponentProps<RouteParams> {
  tokenInfo: any;
  fetchToken: (id: string | undefined) => void;
}

const TokenInfo: React.FunctionComponent<TokenInfoProps> = (
  props: TokenInfoProps
) => {
  const { id } = props.match.params;
  // const [activeTab, setActiveTab] = useState<string>(TOKEN_TRANSFERS);

  const { tokenInfo } = props;

  const tokenInfoMenu = [{ label: 'Delete token', value: 'delete' }];

  useEffect(() => {
    props.fetchToken(id);
  }, []);

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.tokens.tokensPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
        <Button
          to={TOKENS_PATH}
          tag={RRNavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.tokens.tokenInfo.back')}
          </span>
        </Button>
        <h1>{tokenInfo.name}</h1>
        <UncontrolledDropdown>
          <DropdownToggle color='link' size='sm'>
            <MdMoreHoriz />
          </DropdownToggle>
          <DropdownMenu>
            {tokenInfoMenu.map((data) => {
              return (
                <DropdownItem
                  className='d-flex justify-content-between'
                  key={data.value}
                  name='collateralAddress'
                  value={data.value}
                >
                  <span>{I18n.t(data.label)}</span>
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </UncontrolledDropdown>
      </header>
      <div className='content'>
        <section className='mb-5'>
          <Row className='mb-4'>
            {/* <Col md='6'> */}
            {/* <img src={DeefIcon} height={'64px'} width={'64px'} /> */}
            {/* </Col> */}
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.name')}
                value={(tokenInfo.name || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.symbol')}
                value={(tokenInfo.symbol || '').toString()}
              />
            </Col>
            {/* <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.id')}
                value={(tokenInfo.id || '').toString()}
              />
            </Col> */}
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.decimals')}
                value={(tokenInfo.decimal || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.type')}
                value={(tokenInfo.isDAT ? 'DAT' : 'DCT' || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                // label={I18n.t('containers.tokens.tokenInfo.holders')}
                // value={(tokenInfo.holders || '').toString()}
                label={I18n.t('containers.tokens.tokenInfo.limit')}
                value={(tokenInfo.limit || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                // label={I18n.t('containers.tokens.tokenInfo.price')}
                // value={(tokenInfo.price || '').toString()}
                label={I18n.t('containers.tokens.tokenInfo.minitingSupport')}
                value={(tokenInfo.mintable || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                // label={I18n.t('containers.tokens.tokenInfo.volume')}
                // value={(tokenInfo.volume || '').toString()}
                label={I18n.t('containers.tokens.tokenInfo.tradeable')}
                value={(tokenInfo.tradeable || '').toString()}
              />
            </Col>
            {/* <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.marketCap')}
                value={(tokenInfo.marketCap || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.officialSite')}
                value={(tokenInfo.officialSite || '').toString()}
              />
            </Col> */}
          </Row>
        </section>
        {/* <Tabs
          activeTab={activeTab} i
          d={id}
          history={history}
          setActiveTab={setActiveTab}
        /> */}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { tokens } = state;
  const { tokenInfo } = tokens;
  return {
    tokenInfo,
  };
};

const mapDispatchToProps = {
  fetchToken: (id) => fetchTokenInfo({ id }),
};

export default connect(mapStateToProps, mapDispatchToProps)(TokenInfo);
