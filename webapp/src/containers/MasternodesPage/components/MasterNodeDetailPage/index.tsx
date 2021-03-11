import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import classnames from 'classnames';
import { I18n } from 'react-redux-i18n';
import {
  Button,
  ButtonGroup,
  Row,
  Col,
  FormGroup,
  Input,
  Label,
} from 'reactstrap';
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
import Header from '../../../HeaderComponent';
import { getPageTitle } from '../../../../utils/utility';
import { MasterNodesPageStates } from '../..';
import ViewOnChain from '../../../../components/ViewOnChain';
import { openMasternodeUpdateRestartModal } from '../../../PopOver/reducer';
interface RouteProps {
  hash: string;
}

interface MasterNodeDetailPageProps extends RouteComponentProps<RouteProps> {
  masternodes: MasterNodeObject[];
  isMasterNodeResigning: boolean;
  resignedMasterNodeData: string;
  isErrorResigningMasterNode: string;
  resignMasterNode: (masterNodeHash: string) => void;
  openMasternodeUpdateRestartModal: ({
    isOpen: boolean,
    masternode: MasterNodeObject,
  }) => void;
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
    openMasternodeUpdateRestartModal,
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
  const [
    isConfirmationModalOpen,
    setIsConfirmationModalOpen,
  ] = useState<string>(MasterNodesPageStates.default);
  const [wait, setWait] = useState<number>(5);
  const [allowCalls, setAllowCalls] = useState(false);

  useEffect(() => {
    if (allowCalls) {
      if (
        resignedMasterNodeData &&
        !isMasterNodeResigning &&
        !isErrorResigningMasterNode
      ) {
        setIsConfirmationModalOpen(MasterNodesPageStates.success);
      }
      if (
        !resignedMasterNodeData &&
        !isMasterNodeResigning &&
        isErrorResigningMasterNode
      ) {
        setIsConfirmationModalOpen(MasterNodesPageStates.failure);
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
    if (isConfirmationModalOpen === MasterNodesPageStates.confirm) {
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

  const remapMasternodeState = (state: string) => {
    const masternodesLabel = 'containers.masterNodes.masterNodesPage';
    switch (state) {
      case 'ENABLED':
        return I18n.t(`${masternodesLabel}.created`);
      case 'RESIGNED':
        return I18n.t(`${masternodesLabel}.resigned`);
      case 'PRE_RESIGNED':
        return I18n.t(`${masternodesLabel}.preresigned`);
      case 'PRE_ENABLED':
        return I18n.t(`${masternodesLabel}.preenabled`);
      case 'PRE_BANNED':
        return I18n.t(`${masternodesLabel}.prebanned`);
      case 'BANNED':
        return I18n.t(`${masternodesLabel}.banned`);
      default:
        return state;
    }
  };

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {getPageTitle(
            I18n.t(
              'containers.masterNodes.masternodeDetailPage.masternodeDetailTitle',
              {
                hash,
              }
            )
          )}
        </title>
      </Helmet>
      <Header>
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
          <div className='d-flex align-items-center'>
            <FormGroup check>
              <Label check className='switch'>
                <Input
                  type='checkbox'
                  checked={masternode.isEnabled}
                  onChange={() => {
                    openMasternodeUpdateRestartModal({
                      isOpen: true,
                      masternode: {
                        ...masternode,
                        isEnabled: !masternode.isEnabled,
                      },
                    });
                  }}
                />
                &nbsp;
                {I18n.t(`containers.masterNodes.masterNodesPage.enable`)}
              </Label>
            </FormGroup>
            <ButtonGroup className='ml-1'>
              <Button
                color='link'
                onClick={() =>
                  setIsConfirmationModalOpen(MasterNodesPageStates.confirm)
                }
              >
                <MdDelete />
                <span>
                  {I18n.t(
                    'containers.masterNodes.masternodeDetailPage.resignMasterNode'
                  )}
                </span>
              </Button>
            </ButtonGroup>
          </div>
        )}
      </Header>
      <div className='content'>
        <section className='mb-5'>
          <KeyValueLi
            label={I18n.t('containers.masterNodes.masternodeDetailPage.state')}
            value={remapMasternodeState(state)}
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
            copyable={false}
            uid='address'
          />
          <KeyValueLi
            label={I18n.t(
              'containers.masterNodes.masternodeDetailPage.operatorAddress'
            )}
            value={operatorAuthAddress}
            copyable={false}
            uid='address'
          />
          <KeyValueLi
            label={I18n.t(
              'containers.masterNodes.masternodeDetailPage.resignTx'
            )}
            copyable={false}
            value={resignTx}
          />

          <KeyValueLi
            label={I18n.t('containers.masterNodes.masternodeDetailPage.banTx')}
            copyable={false}
            value={banTx}
          />
          <KeyValueLi
            label={I18n.t('containers.masterNodes.masternodeDetailPage.hash')}
            copyable={false}
            value={hash}
          />
        </section>
      </div>
      <footer
        className={classnames({
          'footer-bar': true,
          'd-none': isConfirmationModalOpen === MasterNodesPageStates.default,
        })}
      >
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== MasterNodesPageStates.confirm,
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
                onClick={() =>
                  setIsConfirmationModalOpen(MasterNodesPageStates.default)
                }
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
            'd-none': isConfirmationModalOpen !== MasterNodesPageStates.success,
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
            <ViewOnChain txid={resignedMasterNodeData} />
            <Button color='primary' to={MASTER_NODES_PATH} tag={NavLink}>
              {I18n.t(
                'containers.masterNodes.masternodeDetailPage.backToMasternodePage'
              )}
            </Button>
          </div>
        </div>
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== MasterNodesPageStates.failure,
          })}
        >
          <div className='footer-sheet'>
            <div className='text-center'>
              <MdErrorOutline
                className={classnames({
                  'footer-sheet-icon': true,
                  [styles[`error-dialog`]]: true,
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
  openMasternodeUpdateRestartModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MasterNodeDetailPage);
