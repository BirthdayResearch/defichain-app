import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Helmet } from 'react-helmet';
import { Row, Col } from 'reactstrap';
import Console from './ConsoleComponent';
import Header from '../HeaderComponent';

const ConsolePage: React.FunctionComponent = () => {
  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {I18n.t('containers.console.consolePage.consoleDefiClient')}
        </title>
      </Helmet>
      <Header>
        <h1>{I18n.t('containers.console.consolePage.console')}</h1>
      </Header>
      <div className='content'>
        <section>
          <Row>
            <Col xs={12}>
              <Console />
            </Col>
          </Row>
        </section>
      </div>
    </div>
  );
};

export default ConsolePage;
