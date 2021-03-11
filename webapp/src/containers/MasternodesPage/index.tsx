import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { Button, ButtonGroup, Row, Col, TabContent, Tooltip } from 'reactstrap';
import {
  MdSearch,
  MdAdd,
  MdCheckCircle,
  MdErrorOutline,
  MdInfo,
  MdInfoOutline,
} from 'react-icons/md';
import classnames from 'classnames';
import SearchBar from '../../components/SearchBar';
import MasternodesList from './components/MasterNodesList';
import { I18n } from 'react-redux-i18n';
import {
  MINIMUM_DFI_AMOUNT_FOR_MASTERNODE,
  CONFIRM_BUTTON_TIMEOUT,
  CONFIRM_BUTTON_COUNTER,
  ALL,
  MINE,
} from '../../constants';
import { useDispatch, useSelector } from 'react-redux';
import { fetchInstantBalanceRequest } from '../WalletPage/reducer';
import { createMasterNode, startRestartNodeWithMasterNode } from './reducer';
import styles from './masternode.module.scss';
import isEmpty from 'lodash/isEmpty';
import BigNumber from 'bignumber.js';
import { fetchMasternodesRequest } from './reducer';
import { MasterNodeObject } from './masterNodeInterface';
import usePrevious from '../../components/UsePrevious';
import Header from '../HeaderComponent';
import { getPageTitle } from '../../utils/utility';
import MasterNodeTabsHeader from './components/MasterNodeTabHeader';
import MineNodeList from './components/MineNodeList';
import MineNodeFooter from './components/MineNodeFooter';
import { RootState } from '../../app/rootTypes';

export enum MasterNodesPageStates {
  default = 'default',
  success = 'success',
  failure = 'failure',
  confirm = 'confirm',
}

const MasternodesPage: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const {
    wallet: { walletBalance },
    masterNodes: {
      isMasterNodeCreating,
      masternodes,
      createdMasterNodeData,
      isErrorCreatingMasterNode,
      isLoadingMasternodes,
      myMasternodes,
    },
    popover: { isOpen, isRestart },
  } = useSelector((state: RootState) => state);

  const prevIsOpen = usePrevious(isOpen);
  const prevIsRestart = usePrevious(isRestart);
  const [searching, setSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [
    isConfirmationModalOpen,
    setIsConfirmationModalOpen,
  ] = useState<string>(MasterNodesPageStates.default);
  const [wait, setWait] = useState<number>(CONFIRM_BUTTON_COUNTER);
  const [allowCalls, setAllowCalls] = useState<boolean>(false);
  const [restartNodeConfirm, setRestartNodeConfirm] = useState(false);
  const [isRestartButtonDisable, setIsRestartButtonDisable] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>(MINE);
  const [enabledMasternodes, setEnabledMasternodes] = useState<
    MasterNodeObject[]
  >([]);

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  const resetConfirmationModal = (event: any) => {
    dispatch(fetchInstantBalanceRequest());
    setIsConfirmationModalOpen(MasterNodesPageStates.default);
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
    if (isRestart) {
      setIsConfirmationModalOpen(MasterNodesPageStates.default);
      setRestartNodeConfirm(false);
      setIsRestartButtonDisable(false);
    }
  }, [isRestart]);

  useEffect(() => {
    dispatch(fetchMasternodesRequest());
  }, []);

  useEffect(() => {
    if (!isLoadingMasternodes) {
      if (myMasternodes.length > 0) {
        setActiveTab(MINE);
      }
    }
  }, [isLoadingMasternodes]);

  useEffect(() => {
    const isMyMasternodes = activeTab === MINE;
    const enabledMasternodes = masternodes.filter((masternode) => {
      if (isMyMasternodes) {
        return masternode.isMyMasternode;
      }
      return !masternode.isMyMasternode;
    });
    setEnabledMasternodes(enabledMasternodes);
  }, [activeTab, masternodes]);

  useEffect(() => {
    if (allowCalls && !isMasterNodeCreating) {
      if (!isErrorCreatingMasterNode && !isEmpty(createdMasterNodeData)) {
        setIsConfirmationModalOpen(MasterNodesPageStates.success);
      }
      if (isErrorCreatingMasterNode && isEmpty(createdMasterNodeData)) {
        setErrorMessage(isErrorCreatingMasterNode);
        setIsConfirmationModalOpen(MasterNodesPageStates.failure);
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
    if (isConfirmationModalOpen === MasterNodesPageStates.confirm) {
      let counter = CONFIRM_BUTTON_COUNTER;
      waitToSendInterval = setInterval(() => {
        counter -= 1;
        setWait(counter);
        if (counter === 0) {
          clearInterval(waitToSendInterval);
        }
      }, CONFIRM_BUTTON_TIMEOUT);
    }
    return () => {
      clearInterval(waitToSendInterval);
    };
  }, [isConfirmationModalOpen]);

  const cancelConfirmation = () => {
    setWait(CONFIRM_BUTTON_COUNTER);
    if (restartNodeConfirm) {
      setIsConfirmationModalOpen(MasterNodesPageStates.success);
      setRestartNodeConfirm(false);
    } else {
      setIsConfirmationModalOpen(MasterNodesPageStates.default);
    }
  };

  const confirmation = () => {
    if (restartNodeConfirm) {
      dispatch(startRestartNodeWithMasterNode());
      setIsRestartButtonDisable(true);
    } else {
      setAllowCalls(true);
      dispatch(createMasterNode());
    }
  };

  const createMasterNodeFunc = () => {
    const showForm = new BigNumber(walletBalance).gte(
      MINIMUM_DFI_AMOUNT_FOR_MASTERNODE
    );
    if (showForm) {
      setIsConfirmationModalOpen(MasterNodesPageStates.confirm);
    } else {
      setErrorMessage(
        I18n.t('containers.masterNodes.createMasterNode.lackOfBalanceMsg')
      );
      setIsConfirmationModalOpen(MasterNodesPageStates.failure);
    }
  };

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {getPageTitle(I18n.t('containers.masterNodes.masterNodesPage.title'))}
        </title>
      </Helmet>
      <Header>
        <h1 className={classnames({ 'd-none': searching })}>
          {I18n.t('containers.masterNodes.masterNodesPage.masterNodes')}

          <MdInfoOutline className='ml-1' id='masternode__item' size={20} />
          <Tooltip
            placement='auto'
            target='masternode__item'
            isOpen={tooltipOpen}
            toggle={toggle}
          >
            {I18n.t('containers.masterNodes.masterNodesPage.tooltipMasternode')}
          </Tooltip>
        </h1>
        <MasterNodeTabsHeader tab={activeTab} setTab={setActiveTab} />
        <div></div>
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
          placeholder={I18n.t(
            'containers.masterNodes.masterNodesPage.searchBar'
          )}
        />
      </Header>
      <div className='content'>
        <TabContent activeTab={activeTab}>
          <MineNodeList enabledMasternodes={enabledMasternodes} />
          <MasternodesList
            searchQuery={searchQuery}
            enabledMasternodes={enabledMasternodes}
          />
        </TabContent>
      </div>
      <footer
        className={classnames({
          'footer-bar': true,
          'd-none': activeTab === ALL,
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
            'd-none': isConfirmationModalOpen !== MasterNodesPageStates.success,
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
              <Button color='link' onClick={resetConfirmationModal}>
                {I18n.t(
                  'containers.masterNodes.createMasterNode.backToMasternodePage'
                )}
              </Button>
              <Button
                className='ml-4'
                color='primary'
                onClick={() => {
                  setWait(CONFIRM_BUTTON_COUNTER);
                  setRestartNodeConfirm(true);
                  setIsConfirmationModalOpen(MasterNodesPageStates.confirm);
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
        <div
          className={classnames({
            'd-none':
              activeTab === ALL ||
              isConfirmationModalOpen !== MasterNodesPageStates.default,
          })}
        >
          <MineNodeFooter enabledMasternodes={enabledMasternodes} />
        </div>
      </footer>
    </div>
  );
};

export default MasternodesPage;
