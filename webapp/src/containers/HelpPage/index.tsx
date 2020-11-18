import React from 'react';
import { Helmet } from 'react-helmet';
import {
  FaGithub,
  FaQuestionCircle,
  FaReddit,
  FaTelegramPlane,
} from 'react-icons/fa';
import { I18n } from 'react-redux-i18n';
import Header from '../HeaderComponent';
import { RouteComponentProps } from 'react-router-dom';
import { Row, Col, Card, CardBody } from 'reactstrap';
import styles from './HelpPage.module.scss';

const HelpPage: React.FunctionComponent<RouteComponentProps> = (
  props: RouteComponentProps
) => {
  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.helpPage.title')}</title>
      </Helmet>
      <Header>
        <h1>{I18n.t('containers.helpPage.help')}</h1>
      </Header>
      <div className='content'>
        <section>
          <Row>
            <Col xs='12' md='6' className='my-2'>
              <Card>
                <CardBody>
                  <Row>
                    <Col xs='3'>
                      <FaTelegramPlane size='60px' />
                    </Col>
                    <Col xs='9'>
                      <h4>{I18n.t('containers.helpPage.telegramEn')}</h4>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col xs='12' md='6' className='my-2'>
              <Card>
                <CardBody>
                  <Row>
                    <Col xs='3'>
                      <FaTelegramPlane size='60px' />
                    </Col>
                    <Col xs='9'>
                      <h4>{I18n.t('containers.helpPage.telegramDe')}</h4>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col xs='12' md='6' className='my-2'>
              <Card>
                <CardBody>
                  <Row>
                    <Col xs='3'>
                      <FaGithub size='60px' />
                    </Col>
                    <Col xs='9'>
                      <h4>{I18n.t('containers.helpPage.github')}</h4>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col xs='12' md='6' className='my-2'>
              <Card>
                <CardBody>
                  <Row>
                    <Col xs='3'>
                      <FaQuestionCircle size='60px' />
                    </Col>
                    <Col xs='9'>
                      <h4>{I18n.t('containers.helpPage.faq')}</h4>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col xs='12' md='6' className='my-2'>
              <Card>
                <CardBody>
                  <Row>
                    <Col xs='3'>
                      <FaQuestionCircle size='60px' />
                    </Col>
                    <Col xs='9'>
                      <h4>{I18n.t('containers.helpPage.defichainsite')}</h4>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
            <Col xs='12' md='6' className='my-2'>
              <Card>
                <CardBody>
                  <Row>
                    <Col xs='3'>
                      <FaReddit size='60px' />
                    </Col>
                    <Col xs='9'>
                      <h4>{I18n.t('containers.helpPage.reddit')}</h4>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </section>
      </div>
    </div>
  );
};

export default HelpPage;
