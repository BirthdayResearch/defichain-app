import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import classnames from 'classnames';
import { I18n } from 'react-redux-i18n';
import { Button, ButtonGroup, Row, Col } from 'reactstrap';
import {
  MdArrowBack,
  MdDelete,
  MdCheckCircle,
  MdErrorOutline,
} from 'react-icons/md';
import { NavLink, RouteComponentProps, Redirect } from 'react-router-dom';
import KeyValueLi from '../../../../components/KeyValueLi';
import { MASTER_NODES_PATH } from '../../../../constants';
import { MasterNodeObject } from '../../masterNodeInterface';
import { resignMasterNode } from '../../reducer';
import styles from '../../masternode.module.scss';

interface RouteProps {
  hash: string;
}

interface MasterNodeDetailPageProps extends RouteComponentProps<RouteProps> {
  masternodes: MasterNodeObject[];
  isMasterNodeResigning: boolean;
  resignedMasterNodeData: string;
  isErrorResigningMasterNode: string;
  resignMasterNode: (masterNodeHash: string) => void;
}

const MasterNodeDetailPage: React.FunctionComponent<MasterNodeDetailPageProps> = (
  props: MasterNodeDetailPageProps
) => {
  const {
    match,
    masternodes = [],
    resignMasterNode,
    isMasterNodeResigning,
    resignedMasterNodeData,
    isErrorResigningMasterNode,
  } = props;
  const hashValue = match.params.hash;
  const masternode: any = masternodes.find((ele: any) => {
    return ele.hash && ele.hash.toString() === hashValue;
  });
  const {
    ownerAuthAddress,
    operatorAuthAddress,
    creationHeight,
    state,
    resignHeight,
    resignTx,
    banHeight,
    banTx,
    hash,
    mintedBlocks,
    isMyMasternode,
  } = masternode || {};

  if (isEmpty(masternode)) {
    return <Redirect to={MASTER_NODES_PATH} />;
  }
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<
    string
  >('default');
  const [wait, setWait] = useState<number>(5);
  const [allowCalls, setAllowCalls] = useState(false);

  useEffect(() => {
    if (allowCalls) {
      if (
        resignedMasterNodeData &&
        !isMasterNodeResigning &&
        !isErrorResigningMasterNode
      ) {
        setIsConfirmationModalOpen('success');
      }
      if (
        !resignedMasterNodeData &&
        !isMasterNodeResigning &&
        isErrorResigningMasterNode
      ) {
        setIsConfirmationModalOpen('failure');
      }
    }
  }, [
    isMasterNodeResigning,
    resignedMasterNodeData,
    isErrorResigningMasterNode,
    allowCalls,
  ]);

  useEffect(() => {
    let waitToSendInterval;
    if (isConfirmationModalOpen === 'confirm') {
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
        {isMyMasternode && (
          <ButtonGroup>
            <Button
              color='link'
              onClick={() => setIsConfirmationModalOpen('confirm')}
            >
              <MdDelete />
              <span>
                {I18n.t(
                  'containers.masterNodes.masternodeDetailPage.resignMasterNode'
                )}
              </span>
            </Button>
          </ButtonGroup>
        )}
      </header>
      <div className='content'>
        <section className='mb-5'>
          <KeyValueLi
            label={I18n.t('containers.masterNodes.masternodeDetailPage.state')}
            value={state}
          />
          <KeyValueLi
            label={I18n.t(
              'containers.masterNodes.masternodeDetailPage.registered'
            )}
            value={`${creationHeight}`}
          />
          <KeyValueLi
            label={I18n.t(
              'containers.masterNodes.masternodeDetailPage.mintedBlocks'
            )}
            value={`${mintedBlocks}`}
          />
          <KeyValueLi
            label={I18n.t(
              'containers.masterNodes.masternodeDetailPage.resignHeight'
            )}
            value={`${resignHeight}`}
          />
          <KeyValueLi
            label={I18n.t(
              'containers.masterNodes.masternodeDetailPage.banHeight'
            )}
            value={`${banHeight}`}
          />
          <KeyValueLi
            label={I18n.t(
              'containers.masterNodes.masternodeDetailPage.ownerAddress'
            )}
            value={ownerAuthAddress}
            copyable={true!}
            uid='address'
          />
          <KeyValueLi
            label={I18n.t(
              'containers.masterNodes.masternodeDetailPage.operatorAddress'
            )}
            value={operatorAuthAddress}
            copyable={true!}
            uid='address'
          />
          <KeyValueLi
            label={I18n.t(
              'containers.masterNodes.masternodeDetailPage.resignTx'
            )}
            copyable={true!}
            value={resignTx}
          />

          <KeyValueLi
            label={I18n.t('containers.masterNodes.masternodeDetailPage.banTx')}
            copyable={true!}
            value={banTx}
          />
          <KeyValueLi
            label={I18n.t('containers.masterNodes.masternodeDetailPage.hash')}
            copyable={true!}
            value={hash}
          />
        </section>
      </div>
      <footer className='footer-bar'>
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== 'confirm',
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
                onClick={() => setIsConfirmationModalOpen('default')}
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
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== 'success',
          })}
        >
          <div className='footer-sheet'>
            <div className='text-center'>
              <MdCheckCircle className='footer-sheet-icon' />
              <p>
                {`${I18n.t(
                  'containers.masterNodes.masternodeDetailPage.successText'
                )}`}
              </p>
              <p>{resignedMasterNodeData}</p>
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center'>
            <Button color='primary' to={MASTER_NODES_PATH} tag={NavLink}>
              {I18n.t(
                'containers.masterNodes.masternodeDetailPage.backToMasternodePage'
              )}
            </Button>
          </div>
        </div>
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== 'failure',
          })}
        >
          <div className='footer-sheet'>
            <div className='text-center'>
              <MdErrorOutline
                className={classnames({
                  'footer-sheet-icon': true,
                  [styles[`error-dailog`]]: true,
                })}
              />
              <p>{isErrorResigningMasterNode}</p>
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center'>
            <Button color='primary' to={MASTER_NODES_PATH} tag={NavLink}>
              {I18n.t(
                'containers.masterNodes.masternodeDetailPage.backToMasternodePage'
              )}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => {
  const {
    masterNodes: {
      masternodes,
      isMasterNodeResigning,
      resignedMasterNodeData,
      isErrorResigningMasterNode,
    },
  } = state;
  return {
    masternodes,
    isMasterNodeResigning,
    resignedMasterNodeData,
    isErrorResigningMasterNode,
  };
};

const mapDispatchToProps = {
  resignMasterNode: (masterNodeHash: string) =>
    resignMasterNode({ masterNodeHash }),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MasterNodeDetailPage);
