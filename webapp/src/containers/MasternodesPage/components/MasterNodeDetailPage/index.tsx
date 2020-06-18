import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { isEmpty } from 'lodash';
import { Helmet } from 'react-helmet';
import classnames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { Button, ButtonGroup, Row, Col } from 'reactstrap';
import { MdArrowBack, MdDelete } from 'react-icons/md';
import { NavLink, RouteComponentProps, Redirect } from 'react-router-dom';
import KeyValueLi from '../../../../components/KeyValueLi';
import { MASTER_NODES_PATH } from '../../../../constants';
import { MasterNodeObject } from '../../masterNodeInterface';
import { resignMasterNode } from '../../reducer';

interface RouteProps {
  hash: string;
}

interface MasterNodeDetailPageProps extends RouteComponentProps<RouteProps> {
  masternodes: MasterNodeObject[];
  resignMasterNode: (masterNodeHash: string) => void;
}

const MasterNodeDetailPage: React.FunctionComponent<MasterNodeDetailPageProps> = (
  props: MasterNodeDetailPageProps
) => {
  const { match, masternodes = [], resignMasterNode } = props;
  const hash = match.params.hash;
  const masternode: any = masternodes.find((ele: any) => {
    return ele.hash && ele.hash.toString() === hash;
  });

  if (isEmpty(masternode)) {
    return <Redirect to={MASTER_NODES_PATH} />;
  }
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<
    boolean
  >(false);
  const [wait, setWait] = useState<number>(5);
  const [allowCalls, setAllowCalls] = useState(false);

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

  useEffect(() => {
    let waitToSendInterval;
    if (isConfirmationModalOpen) {
      let counter = 5;
      waitToSendInterval = setInterval(() => {
        counter -= 1;
        setWait(counter);
        if (counter === 0) {
          clearInterval(waitToSendInterval);
        }
      }, 1000);
    }
    return () => {
      clearInterval(waitToSendInterval);
    };
  }, [isConfirmationModalOpen]);

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
        <ButtonGroup>
          <Button color='link' onClick={() => setIsConfirmationModalOpen(true)}>
            <MdDelete />
            <span>
              {I18n.t(
                'containers.masterNodes.masternodeDetailPage.resignMasterNode'
              )}
            </span>
          </Button>
        </ButtonGroup>
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
      <footer className='footer-bar'>
        <div
          className={classnames({
            'd-none': !isConfirmationModalOpen,
          })}
        >
          <div className='footer-sheet'>
            <dl className='row'>
              <dd className='col-12'>
                <span className='h2 mb-0'>
                  {I18n.t(
                    'containers.masterNodes.masternodeDetailPage.confirmation'
                  )}
                </span>
              </dd>
            </dl>
          </div>
          <Row className='justify-content-between align-items-center'>
            <Col className='d-flex justify-content-end'>
              <Button
                color='link'
                className='mr-3'
                onClick={() => setIsConfirmationModalOpen(false)}
              >
                {I18n.t(
                  'containers.masterNodes.masternodeDetailPage.noButtonText'
                )}
              </Button>
              <Button
                color='primary'
                onClick={() => {
                  setAllowCalls(true);
                  resignMasterNode(hash);
                }}
                disabled={wait > 0 ? true : false}
              >
                {I18n.t(
                  'containers.masterNodes.masternodeDetailPage.yesButtonText'
                )}
                &nbsp;
                <span className='timer'>{wait > 0 ? wait : ''}</span>
              </Button>
            </Col>
          </Row>
        </div>
      </footer>
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

const mapDisptachToProps = {
  resignMasterNode: (masterNodeHash: string) =>
    resignMasterNode({ masterNodeHash }),
};

export default connect(
  mapStateToProps,
  mapDisptachToProps
)(MasterNodeDetailPage);
