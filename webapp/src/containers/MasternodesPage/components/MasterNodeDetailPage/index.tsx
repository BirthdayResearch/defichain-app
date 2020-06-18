import React from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { Button } from 'reactstrap';
import { MdArrowBack } from 'react-icons/md';
import { NavLink, RouteComponentProps, Redirect } from 'react-router-dom';
import KeyValueLi from '../../../../components/KeyValueLi';
import { MASTER_NODES_PATH } from '../../../../constants';
import { MasterNodeObject } from '../../masterNodeInterface';

interface RouteProps {
  hash: string;
}

interface MasterNodeDetailPageProps extends RouteComponentProps<RouteProps> {
  masternodes: MasterNodeObject[];
}

const MasterNodeDetailPage: React.FunctionComponent<MasterNodeDetailPageProps> = (
  props: MasterNodeDetailPageProps
) => {
  const { match, masternodes = [] } = props;
  const hash = match.params.hash;
  const masternode: any = masternodes.find((ele: any) => {
    return ele.hash && ele.hash.toString() === hash;
  });

  if (isEmpty(masternode)) {
    return <Redirect to={MASTER_NODES_PATH} />;
  }

  const {
    ownerAuthAddress,
    operatorAuthAddress,
    creationHeight,
    resignHeight,
    resignTx,
    banHeight,
    banTx,
    mintedBlocks,
  } = masternode || {};

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {I18n.t(
            'containers.masterNodes.masternodeDetailPage.masternodeDetailTitle',
            {
              hash,
            }
          )}
        </title>
      </Helmet>
      <header className='header-bar'>
        <Button
          to={MASTER_NODES_PATH}
          tag={NavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.masterNodes.masternodeDetailPage.masternode')}
          </span>
        </Button>
        <h1>
          {I18n.t(
            'containers.masterNodes.masternodeDetailPage.masternodeDetail'
          )}
          &nbsp;
        </h1>
      </header>
      <div className='content'>
        <section className='mb-5'>
          <KeyValueLi
            label={I18n.t(
              'containers.masterNodes.masternodeDetailPage.ownerAddress'
            )}
            value={ownerAuthAddress}
            popsQR={true}
            copyable={true!}
            uid='address'
          />
          <KeyValueLi
            label={I18n.t(
              'containers.masterNodes.masternodeDetailPage.operatorAddress'
            )}
            value={operatorAuthAddress}
            popsQR={true}
            copyable={true!}
            uid='address'
          />
          <KeyValueLi
            label={I18n.t(
              'containers.masterNodes.masternodeDetailPage.registered'
            )}
            value={creationHeight}
          />
          <KeyValueLi
            label={I18n.t(
              'containers.masterNodes.masternodeDetailPage.mintedBlocks'
            )}
            value={mintedBlocks}
          />
          <KeyValueLi
            label={I18n.t(
              'containers.masterNodes.masternodeDetailPage.resignHeight'
            )}
            value={resignHeight}
          />
          <KeyValueLi
            label={I18n.t(
              'containers.masterNodes.masternodeDetailPage.resignTx'
            )}
            value={resignTx}
          />
          <KeyValueLi
            label={I18n.t(
              'containers.masterNodes.masternodeDetailPage.banHeight'
            )}
            value={banHeight}
          />
          <KeyValueLi
            label={I18n.t('containers.masterNodes.masternodeDetailPage.banTx')}
            value={banTx}
          />
        </section>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const {
    masterNodes: { masternodes },
  } = state;
  return {
    masternodes,
  };
};

export default connect(mapStateToProps)(MasterNodeDetailPage);
