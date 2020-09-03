import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button, ButtonGroup, Row, Col } from 'reactstrap';
import { MdSearch, MdAdd, MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import classnames from 'classnames';
import SearchBar from '../../components/SearchBar';
import MasternodesList from './components/MasterNodesList';
import { I18n } from 'react-redux-i18n';
import { RouteComponentProps } from 'react-router-dom';
import {
  MINIMUM_DFI_AMOUNT_FOR_MASTERNODE,
  RESIGNED_STATE,
} from '../../constants';
import { connect } from 'react-redux';
import { fetchWalletBalanceRequest } from '../WalletPage/reducer';
import { createMasterNode, startRestartNodeWithMasterNode } from './reducer';
import styles from './masternode.module.scss';
import isEmpty from 'lodash/isEmpty';
import BigNumber from 'bignumber.js';
import { fetchMasternodesRequest } from './reducer';
import { MasterNodeObject } from './masterNodeInterface';
import MasternodeTab from './components/MasternodeTab';
import usePrevious from '../../components/UsePrevious';
interface MasternodesPageProps extends RouteComponentProps {
  createMasterNode: () => void;
  startRestartNodeWithMasterNode: () => void;
  walletBalance: string | number;
  isMasterNodeCreating: boolean;
  createdMasterNodeData: any;
  isErrorCreatingMasterNode: string;
  masternodes: MasterNodeObject[];
  fetchMasternodesRequest: () => void;
  isLoadingMasternodes: boolean;
  fetchWalletBalanceRequest: () => void;
  isOpen: boolean;
  isRestart: boolean;
}

const MasternodesPage: React.FunctionComponent<MasternodesPageProps> = (
  props: MasternodesPageProps
) => {
  const {
    createMasterNode,
    startRestartNodeWithMasterNode,
    isMasterNodeCreating,
    createdMasterNodeData,
    isErrorCreatingMasterNode,
    walletBalance,
    masternodes,
    fetchMasternodesRequest,
    isLoadingMasternodes,
    fetchWalletBalanceRequest,
    isOpen,
    isRestart,
  } = props;

  const prevIsOpen = usePrevious(isOpen);
  const prevIsRestart = usePrevious(isRestart);
  const [searching, setSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<
    string
  >('default');
  const [wait, setWait] = useState<number>(5);
  const [allowCalls, setAllowCalls] = useState<boolean>(false);
  const [restartNodeConfirm, setRestartNodeConfirm] = useState(false);
  const [isRestartButtonDisable, setIsRestartButtonDisable] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('otherMasterNodes');
  const [disableTab, setDisableTab] = useState<boolean>(true);
  const [enabledMasternodes, setEnabledMasternodes] = useState<
    MasterNodeObject[]
  >([]);
  const resetConfirmationModal = (event: any) => {
    fetchWalletBalanceRequest();
    setIsConfirmationModalOpen('');
  };

  const toggleSearch = () => {
    if (searching) {
      setSearchQuery('');
    }
    setSearching(!searching);
  };

  useEffect(() => {
    if (!isOpen && prevIsOpen) {
      resetConfirmationModal({});
    }
  }, [prevIsOpen, prevIsRestart, isOpen, isRestart]);

  useEffect(() => {
    fetchMasternodesRequest();
  }, []);

  useEffect(() => {
    if (!isLoadingMasternodes) {
      const myMasternodes = masternodes.filter(
        (masternode) =>
          masternode.state !== RESIGNED_STATE && masternode.isMyMasternode
      );
      if (myMasternodes.length > 0) {
        setDisableTab(false);
        setActiveTab('myMasternodes');
      }
    }
  }, [isLoadingMasternodes]);

  useEffect(() => {
    const isMyMasternodes = activeTab === 'myMasternodes';
    const enabledMasternodes = masternodes.filter((masternode) => {
      if (isMyMasternodes) {
        return masternode.state !== RESIGNED_STATE && masternode.isMyMasternode;
      }
      return masternode.state !== RESIGNED_STATE && !masternode.isMyMasternode;
    });
    setEnabledMasternodes(enabledMasternodes);
  }, [activeTab]);

  useEffect(() => {
    if (allowCalls && !isMasterNodeCreating) {
      if (!isErrorCreatingMasterNode && !isEmpty(createdMasterNodeData)) {
        setIsConfirmationModalOpen('success');
      }
      if (isErrorCreatingMasterNode && isEmpty(createdMasterNodeData)) {
        setErrorMessage(isErrorCreatingMasterNode);
        setIsConfirmationModalOpen('failure');
      }
    }
  }, [
    isMasterNodeCreating,
    createdMasterNodeData,
    isErrorCreatingMasterNode,
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

  const cancelConfirmation = () => {
    setWait(5);
    if (restartNodeConfirm) {
      setIsConfirmationModalOpen('success');
      setRestartNodeConfirm(false);
    } else {
      setIsConfirmationModalOpen('');
    }
  };

  const confirmation = () => {
    if (restartNodeConfirm) {
      startRestartNodeWithMasterNode();
      setIsRestartButtonDisable(true);
    } else {
      setAllowCalls(true);
      createMasterNode();
    }
  };

  const createMasterNodeFunc = () => {
    const showForm = new BigNumber(walletBalance).gte(
      MINIMUM_DFI_AMOUNT_FOR_MASTERNODE
    );
    if (showForm) {
      setIsConfirmationModalOpen('confirm');
    } else {
      setErrorMessage(
        I18n.t('containers.masterNodes.createMasterNode.lackOfBalanceMsg')
      );
      setIsConfirmationModalOpen('failure');
    }
  };

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.masterNodes.masterNodesPage.title')}</title>
      </Helmet>
      <header className='header-bar'>
        <h1 className={classnames({ 'd-none': searching })}>
          {I18n.t('containers.masterNodes.masterNodesPage.masterNodes')}
        </h1>
        {!disableTab && (
          <MasternodeTab setActiveTab={setActiveTab} activeTab={activeTab} />
        )}
        <ButtonGroup className={classnames({ 'd-none': searching })}>
          <Button color='link' size='sm' onClick={toggleSearch}>
            <MdSearch />
          </Button>
          <Button onClick={createMasterNodeFunc} color='link'>
            <MdAdd />
            <span className='d-lg-inline'>
              {I18n.t(
                'containers.masterNodes.masterNodesPage.createMasterNode'
              )}
            </span>
          </Button>
        </ButtonGroup>
        <SearchBar
          onChange={(e) => setSearchQuery(e.target.value)}
          searching={searching}
          toggleSearch={toggleSearch}
        />
      </header>
      <div className='content'>
        <section>
          <MasternodesList
            searchQuery={searchQuery}
            enabledMasternodes={enabledMasternodes}
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
                  {restartNodeConfirm
                    ? I18n.t(
                        'containers.masterNodes.createMasterNode.restartNodeConfirmationText'
                      )
                    : I18n.t(
                        'containers.masterNodes.createMasterNode.confirmationText'
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
                onClick={() => cancelConfirmation()}
              >
                {I18n.t('containers.masterNodes.createMasterNode.noButtonText')}
              </Button>
              <Button
                color='primary'
                onClick={() => confirmation()}
                disabled={isRestartButtonDisable || (wait > 0 ? true : false)}
              >
                {I18n.t(
                  'containers.masterNodes.createMasterNode.yesButtonText'
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
              <p>
                {I18n.t(
                  'containers.masterNodes.createMasterNode.masterNodeSuccess'
                )}
              </p>
              <MdCheckCircle className='footer-sheet-icon' />
              <p>
                {`${I18n.t(
                  'containers.masterNodes.createMasterNode.masternodeOperator'
                )}: ${createdMasterNodeData.masternodeOperator}`}
              </p>
              <p>
                {`${I18n.t(
                  'containers.masterNodes.createMasterNode.masternodeOwner'
                )}: ${createdMasterNodeData.masternodeOwner}`}
              </p>
            </div>
          </div>
          <Row className='justify-content-between align-items-center'>
            <Col className='d-flex justify-content-end'>
              <Button color='primary' onClick={resetConfirmationModal}>
                {I18n.t(
                  'containers.masterNodes.createMasterNode.backToMasternodePage'
                )}
              </Button>
              <Button
                className='ml-4'
                color='primary'
                onClick={() => {
                  setWait(5);
                  setRestartNodeConfirm(true);
                  setIsConfirmationModalOpen('confirm');
                }}
              >
                {I18n.t(
                  'containers.masterNodes.createMasterNode.restartNodeButton'
                )}
              </Button>
            </Col>
          </Row>
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
              <p>{errorMessage}</p>
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center'>
            <Button color='primary' onClick={resetConfirmationModal}>
              {I18n.t(
                'containers.masterNodes.createMasterNode.backToMasternodePage'
              )}
            </Button>
          </div>
        </div>
      </footer>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { wallet, masterNodes, errorModal } = state;
  return {
    walletBalance: wallet.walletBalance,
    isMasterNodeCreating: masterNodes.isMasterNodeCreating,
    masternodes: masterNodes.masternodes,
    isLoadingMasternodes: masterNodes.isLoadingMasternodes,
    createdMasterNodeData: masterNodes.createdMasterNodeData,
    isErrorCreatingMasterNode: masterNodes.isErrorCreatingMasterNode,
    isOpen: errorModal.isOpen,
    isRestart: errorModal.isRestart,
  };
};

const mapDispatchToProps = {
  fetchMasternodesRequest,
  fetchWalletBalanceRequest,
  createMasterNode,
  startRestartNodeWithMasterNode,
};

export default connect(mapStateToProps, mapDispatchToProps)(MasternodesPage);
