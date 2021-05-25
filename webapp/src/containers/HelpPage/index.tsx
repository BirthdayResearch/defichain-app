import React from 'react';
import { Helmet } from 'react-helmet';
import { FaTelegram } from 'react-icons/fa';
import { GoMarkGithub } from 'react-icons/go';
import { FaReddit } from 'react-icons/fa';
import { MdBook, MdHelp } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import Header from '../HeaderComponent';
import { RouteComponentProps } from 'react-router-dom';
import { Row, Col, Card, CardBody } from 'reactstrap';
import openNewTab from '../../utils/openNewTab';
import styles from './HelpPage.module.scss';
import {
  TELEGRAM_GERMAN_HELP_LINK,
  TELEGRAM_ENGLISH_HELP_LINK,
  GITHUB_ISSUE_HELP_LINK,
  DEFICHAIN_FAQ_HELP_LINK,
  getSiteURL,
  REDDIT_HELP_LINK,
  COMMUNITY_WIKI_LINK,
  CHINESE_TRADITIONAL,
  CHINESE_SIMPLIFIED,
  TELEGRAM_ZH_HELP_LINK,
  WECHAT_ZH_LINK,
} from '../../constants';
import Logo from '../../components/Svg/DefiLogo';
import { getPageTitle } from '../../utils/utility';
import { useSelector } from 'react-redux';
import { RiWechatFill } from 'react-icons/ri';

const HelpPage: React.FunctionComponent<RouteComponentProps> = () => {
  const { locale } = useSelector((state: any) => state.i18n);
  const isChinese = [CHINESE_SIMPLIFIED, CHINESE_TRADITIONAL].includes(locale);

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{getPageTitle(I18n.t('containers.helpPage.title'))}</title>
      </Helmet>
      <Header>
        <h1>{I18n.t('containers.helpPage.help')}</h1>
      </Header>
      <div className='content'>
        <section>
          <p>{I18n.t('containers.helpPage.helpPageHeader')}</p>
          <Row className={styles.helpOptions}>
            <Col md='6'>
              <Card
                onClick={() => openNewTab(TELEGRAM_ENGLISH_HELP_LINK)}
                className={styles.helpOption}
              >
                <CardBody className={styles.helpOptionRow}>
                  <div className={styles.helpOptionIcon}>
                    <FaTelegram />
                  </div>
                  <div className={styles.helpOptionDescription}>
                    <h3>{I18n.t('containers.helpPage.telegramEn')}</h3>
                    <p>
                      {new URL(TELEGRAM_ENGLISH_HELP_LINK).hostname.replace(
                        'www.',
                        ''
                      )}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md='6'>
              <Card
                onClick={() =>
                  openNewTab(
                    isChinese
                      ? TELEGRAM_ZH_HELP_LINK
                      : TELEGRAM_GERMAN_HELP_LINK
                  )
                }
                className={styles.helpOption}
              >
                <CardBody className={styles.helpOptionRow}>
                  <div className={styles.helpOptionIcon}>
                    <FaTelegram />
                  </div>
                  <div className={styles.helpOptionDescription}>
                    <h3>
                      {I18n.t(
                        isChinese
                          ? 'containers.helpPage.telegramZh'
                          : 'containers.helpPage.telegramDe'
                      )}
                    </h3>
                    <p>
                      {new URL(
                        isChinese
                          ? TELEGRAM_ZH_HELP_LINK
                          : TELEGRAM_GERMAN_HELP_LINK
                      ).hostname.replace('www.', '')}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            {isChinese && (
              <Col md='6'>
                <Card
                  onClick={() => openNewTab(WECHAT_ZH_LINK)}
                  className={styles.helpOption}
                >
                  <CardBody className={styles.helpOptionRow}>
                    <div className={styles.helpOptionIcon}>
                      <RiWechatFill />
                    </div>
                    <div className={styles.helpOptionDescription}>
                      <h3>{I18n.t('containers.helpPage.wechat')}</h3>
                      <p>
                        {new URL(WECHAT_ZH_LINK).hostname.replace('www.', '')}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            )}
            <Col md='6'>
              <Card
                onClick={() => openNewTab(GITHUB_ISSUE_HELP_LINK)}
                className={styles.helpOption}
              >
                <CardBody className={styles.helpOptionRow}>
                  <div className={styles.helpOptionIcon}>
                    <GoMarkGithub />
                  </div>
                  <div className={styles.helpOptionDescription}>
                    <h3>{I18n.t('containers.helpPage.github')}</h3>
                    <p>
                      {new URL(GITHUB_ISSUE_HELP_LINK).hostname.replace(
                        'www.',
                        ''
                      )}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md='6'>
              <Card
                onClick={() =>
                  openNewTab(`${getSiteURL()}${DEFICHAIN_FAQ_HELP_LINK}`)
                }
                className={styles.helpOption}
              >
                <CardBody className={styles.helpOptionRow}>
                  <div className={styles.helpOptionIcon}>
                    <MdHelp />
                  </div>
                  <div className={styles.helpOptionDescription}>
                    <h3>{I18n.t('containers.helpPage.faq')}</h3>
                    <p>
                      {new URL(
                        `${getSiteURL()}${DEFICHAIN_FAQ_HELP_LINK}`
                      ).hostname.replace('www.', '')}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md='6'>
              <Card
                onClick={() => openNewTab(getSiteURL())}
                className={styles.helpOption}
              >
                <CardBody className={styles.helpOptionRow}>
                  <div className={styles.helpOptionIcon}>
                    <Logo />
                  </div>
                  <div className={styles.helpOptionDescription}>
                    <h3>{I18n.t('containers.helpPage.defichainsite')}</h3>
                    <p>{new URL(getSiteURL()).hostname.replace('www.', '')}</p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md='6'>
              <Card
                onClick={() => openNewTab(REDDIT_HELP_LINK)}
                className={styles.helpOption}
              >
                <CardBody className={styles.helpOptionRow}>
                  <div className={styles.helpOptionIcon}>
                    <FaReddit />
                  </div>
                  <div className={styles.helpOptionDescription}>
                    <h3>{I18n.t('containers.helpPage.reddit')}</h3>
                    <p>
                      {new URL(REDDIT_HELP_LINK).hostname.replace('www.', '')}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Col>
            <Col md='6'>
              <Card
                onClick={() => openNewTab(COMMUNITY_WIKI_LINK)}
                className={styles.helpOption}
              >
                <CardBody className={styles.helpOptionRow}>
                  <div className={styles.helpOptionIcon}>
                    <MdBook />
                  </div>
                  <div className={styles.helpOptionDescription}>
                    <h3>{I18n.t('containers.helpPage.wiki')}</h3>
                    <p>
                      {new URL(COMMUNITY_WIKI_LINK).hostname.replace(
                        'www.',
                        ''
                      )}
                    </p>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <p className={styles.footerNote}>
            {I18n.t('containers.helpPage.helpTextFooterLine1')}
            <br />
            {I18n.t('containers.helpPage.helpTextFooterLine2')}
          </p>
        </section>
      </div>
    </div>
  );
};

export default HelpPage;
