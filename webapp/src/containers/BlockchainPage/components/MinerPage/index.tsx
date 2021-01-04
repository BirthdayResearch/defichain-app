import React from 'react';
import { Helmet } from 'react-helmet';
import { Button } from 'reactstrap';
import { MdArrowBack } from 'react-icons/md';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { I18n } from 'react-redux-i18n';
import { BLOCKCHAIN_BASE_PATH } from '../../../../constants';
import Header from '../../../HeaderComponent';
import { getPageTitle } from '../../../../utils/utility';

interface RouteParams {
  id?: string;
  height?: string;
}

const MinerPage: React.FunctionComponent<RouteComponentProps<RouteParams>> = (
  props: RouteComponentProps<RouteParams>
) => {
  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {getPageTitle(
            `${I18n.t('containers.blockChainPage.minerPage.miner')} ${
              props.match.params.id
            }`
          )}
        </title>
      </Helmet>
      <Header>
        <Button
          to={BLOCKCHAIN_BASE_PATH}
          tag={NavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.blockChainPage.minerPage.blockchain')}
          </span>
        </Button>
        <h1>
          {I18n.t('containers.blockChainPage.minerPage.miner')}&nbsp;
          {props.match.params.id}
        </h1>
      </Header>
      <div className='content'>
        <section>{I18n.t('containers.blockChainPage.minerPage.miner')}</section>
      </div>
    </div>
  );
};

export default MinerPage;
