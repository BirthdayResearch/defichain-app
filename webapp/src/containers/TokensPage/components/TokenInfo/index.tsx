import React, { useEffect, useState } from 'react';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { MdArrowBack } from 'react-icons/md';
import { Button, Row, Col } from 'reactstrap';

import KeyValueLi from '../../../../components/KeyValueLi';
import DeefIcon from '../../../../assets/svg/icon-coin-deef-lapis.svg';
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
      </header>
      <div className='content'>
        <section className='mb-5'>
          <Row className='mb-4'>
            <Col md='6'>
              <img src={DeefIcon} height={'64px'} width={'64px'} />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.name')}
                value={(tokenInfo.name || '').toString()}
              />
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.symbol')}
                value={(tokenInfo.symbol || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.id')}
                value={(tokenInfo.id || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.decimals')}
                value={(tokenInfo.decimals || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.type')}
                value={(tokenInfo.type || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.holders')}
                value={(tokenInfo.holders || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.price')}
                value={(tokenInfo.price || '').toString()}
              />
            </Col>
            <Col md='6'>
              <KeyValueLi
                label={I18n.t('containers.tokens.tokenInfo.volume')}
                value={(tokenInfo.volume || '').toString()}
              />
            </Col>
            <Col md='6'>
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
            </Col>
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
