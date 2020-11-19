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
import { Row, Col, Card, CardBody, Button } from 'reactstrap';
import openNewTab from '../../utils/openNewTab';
import styles from './HelpPage.module.scss';
import {
  TELEGRAM_GERMAN_HELP_LINK,
  TELEGRAM_ENGLISH_HELP_LINK,
  GITHUB_ISSUE_HELP_LINK,
  DEFICHAIN_FAQ_HELP_LINK,
  DEFICHAIN_OFFICIAL_HELP_LINK,
  REDDIT_HELP_LINK,
} from '../../constants';
import Logo from '../../components/Svg/DefiLogo';

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
          <h5>{I18n.t('containers.helpPage.helpPageHeader')}</h5>
          <Row>
            <Col xs='12' md='6'>
              <Button
                className={styles.buttonLink}
                color='link'
                onClick={() => openNewTab(TELEGRAM_ENGLISH_HELP_LINK)}
              >
                <Card>
                  <CardBody>
                    <Row>
                      <Col xs='2'>
                        <FaTelegramPlane />
                      </Col>
                      <Col xs='10'>
                        <h4 className='m-0'>
                          {I18n.t('containers.helpPage.telegramEn')}
                        </h4>
                        <span>
                          {I18n.t('containers.helpPage.telegramEnLink')}
                        </span>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Button>
            </Col>
            <Col xs='12' md='6'>
              <Button
                className={styles.buttonLink}
                color='link'
                onClick={() => openNewTab(TELEGRAM_GERMAN_HELP_LINK)}
              >
                <Card>
                  <CardBody>
                    <Row>
                      <Col xs='2'>
                        <FaTelegramPlane />
                      </Col>
                      <Col xs='10'>
                        <h4 className='m-0'>
                          {I18n.t('containers.helpPage.telegramDe')}
                        </h4>
                        <span>
                          {I18n.t('containers.helpPage.telegramDeLink')}
                        </span>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Button>
            </Col>
            <Col xs='12' md='6'>
              <Button
                className={styles.buttonLink}
                color='link'
                onClick={() => openNewTab(GITHUB_ISSUE_HELP_LINK)}
              >
                <Card>
                  <CardBody>
                    <Row>
                      <Col xs='2'>
                        <FaGithub />
                      </Col>
                      <Col xs='10'>
                        <h4 className='m-0'>
                          {I18n.t('containers.helpPage.github')}
                        </h4>
                        <span>{I18n.t('containers.helpPage.githubLink')}</span>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Button>
            </Col>
            <Col xs='12' md='6'>
              <Button
                className={styles.buttonLink}
                color='link'
                onClick={() => openNewTab(DEFICHAIN_FAQ_HELP_LINK)}
              >
                <Card>
                  <CardBody>
                    <Row>
                      <Col xs='2'>
                        <FaQuestionCircle />
                      </Col>
                      <Col xs='10'>
                        <h4 className='m-0'>
                          {I18n.t('containers.helpPage.faq')}
                        </h4>
                        <span>{I18n.t('containers.helpPage.faqLink')}</span>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Button>
            </Col>
            <Col xs='12' md='6'>
              <Button
                className={styles.buttonLink}
                color='link'
                onClick={() => openNewTab(DEFICHAIN_OFFICIAL_HELP_LINK)}
              >
                <Card>
                  <CardBody>
                    <Row>
                      <Col xs='2'>
                        <Logo />
                      </Col>
                      <Col xs='10'>
                        <h4 className='m-0'>
                          {I18n.t('containers.helpPage.defichainsite')}
                        </h4>
                        <span>
                          {I18n.t('containers.helpPage.defichainsiteLink')}
                        </span>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Button>
            </Col>
            <Col xs='12' md='6'>
              <Button
                className={styles.buttonLink}
                color='link'
                onClick={() => openNewTab(REDDIT_HELP_LINK)}
              >
                <Card>
                  <CardBody>
                    <Row>
                      <Col xs='2'>
                        <FaReddit />
                      </Col>
                      <Col xs='10'>
                        <h4 className='m-0'>
                          {I18n.t('containers.helpPage.reddit')}
                        </h4>
                        <span>{I18n.t('containers.helpPage.redditLink')}</span>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Button>
            </Col>
            <Col xs='12' className='mt-2'>
              <div className={styles.footerNote}>
                <span>{I18n.t('containers.helpPage.helpTextFooterLine1')}</span>
              </div>
              <div className={styles.footerNote}>
                <span>{I18n.t('containers.helpPage.helpTextFooterLine2')}</span>
              </div>
            </Col>
          </Row>
        </section>
      </div>
    </div>
  );
};

export default HelpPage;
