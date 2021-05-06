import React, { Component } from 'react';
import { Helmet } from 'react-helmet';
import ChaplinGif from '../../assets/gif/chaplin.gif';
import { Row, Col, Button } from 'reactstrap';
import styles from './ErrorPage.module.scss';
import { I18n } from 'react-redux-i18n';
import Header from '../HeaderComponent';
import { getPageTitle } from '../../utils/utility';
import { history } from '../../utils/history';

const Error404Page: React.FunctionComponent = (props: any) => {
  const chaplinStyle = {
    backgroundImage: `url(${ChaplinGif})`,
    backgroundSize: 'cover',
  };

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{getPageTitle(I18n.t('containers.errors.title'))}</title>
      </Helmet>
      <Header>
        <h1>{I18n.t('containers.errors.header')}</h1>
      </Header>
      <div className='content' style={chaplinStyle}></div>
      <footer className={`footer-bar ${styles.dark}`}>
        <Row className='justify-content-between align-items-center'>
          <Col>
            <p>{I18n.t('containers.errors.detail')}</p>
          </Col>
          <Col className='col-auto'>
            <Button color='primary' onClick={history.goBack}>
              {I18n.t('containers.errors.goBack')}
            </Button>
          </Col>
        </Row>
      </footer>
    </div>
  );
};

export default Error404Page;
