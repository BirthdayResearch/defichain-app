import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import classnames from 'classnames';
import {
  Row,
  Col,
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  InputGroup,
} from 'reactstrap';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { fetchWalletBalanceRequest } from '../../../WalletPage/reducer';
import {
  createMasterNode,
  startRestartNodeWithMasterNode,
} from '../../reducer';
import {
  MASTER_NODES_PATH,
  MINIMUM_DFI_AMOUNT_FOR_MASTERNODE,
  WALLET_PAGE_PATH,
} from '../../../../constants';
import BigNumber from 'bignumber.js';
import { MdArrowBack, MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import styles from '../../masternode.module.scss';
import usePrevious from '../../../../components/UsePrevious';

interface CreateMasterNodeProps extends RouteComponentProps {
  unit: string;
  walletBalance: string | number;
  fetchWalletBalanceRequest: () => void;
  isBalanceFetching: boolean;
  isBalanceError: any;
  createMasterNode: (masterNodeName: string) => void;
  isMasterNodeCreating: boolean;
  createdMasterNodeData: any;
  isErrorCreatingMasterNode: string;
  startRestartNodeWithMasterNode: () => void;
  isRestartNode: boolean;
  isErrorModalRestart: boolean;
}
const CreateMasterNode: React.FunctionComponent<CreateMasterNodeProps> = (
  props: CreateMasterNodeProps
) => {
  const {
    walletBalance,
    fetchWalletBalanceRequest,
    isBalanceFetching,
    isBalanceError,
    createMasterNode,
    isMasterNodeCreating,
    createdMasterNodeData,
    isErrorCreatingMasterNode,
    startRestartNodeWithMasterNode,
    isRestartNode,
    isErrorModalRestart,
    history,
  } = props;
  const prevIsErrorModalRestart = usePrevious(isErrorModalRestart);
  const [masterNodeName, setMasterNodeName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPage, setIsPage] = useState<boolean>(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<
    string
  >('default');
  const [wait, setWait] = useState<number>(5);
  const [allowCalls, setAllowCalls] = useState<boolean>(false);
  const [restartNodeConfirm, setRestartNodeConfirm] = useState(false);
  const [isRestartButtonDisable, setIsRestartButtonDisable] = useState(false);

  useEffect(() => {
    fetchWalletBalanceRequest();
    setIsPage(true);
  }, []);

  useEffect(() => {
    if (!isRestartNode && prevIsErrorModalRestart && !isErrorModalRestart) {
      history.push(WALLET_PAGE_PATH);
    }
  }, [prevIsErrorModalRestart, isErrorModalRestart, isRestartNode]);

  useEffect(() => {
    if (allowCalls && !isMasterNodeCreating) {
      if (!isErrorCreatingMasterNode && !isEmpty(createdMasterNodeData)) {
        setIsConfirmationModalOpen('success');
      }
      if (isErrorCreatingMasterNode && isEmpty(createdMasterNodeData)) {
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

  useEffect(() => {
    if (!isBalanceError && !isBalanceError && isPage) {
      setIsLoading(false);
    }
  }, [isBalanceFetching, isBalanceError, isPage]);

  const cancelConfirmation = () => {
    setWait(5);
    if (restartNodeConfirm) {
      setIsConfirmationModalOpen('success');
      setRestartNodeConfirm(false);
    } else {
      setIsConfirmationModalOpen('default');
    }
  };

  const confirmation = () => {
    if (restartNodeConfirm) {
      startRestartNodeWithMasterNode();
      setIsRestartButtonDisable(true);
    } else {
      setAllowCalls(true);
      createMasterNode(masterNodeName);
    }
  };

  const showForm = new BigNumber(walletBalance).gte(
    MINIMUM_DFI_AMOUNT_FOR_MASTERNODE
  );
  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>{I18n.t('containers.masterNodes.masterNodesPage.title')}</title>
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
            {I18n.t('containers.masterNodes.masterNodesPage.masterNodes')}
          </span>
        </Button>
        <h1 className={classnames({ 'd-none': false })}>
          {I18n.t('containers.masterNodes.createMasterNode.title')}
        </h1>
      </header>
      <div className='content'>
        {!isLoading && (
          <section>
            <Form onSubmit={(e) => e.preventDefault()}>
              <FormGroup className='form-label-group form-row'>
                <Col>
                  {showForm ? (
                    <div>
                      <InputGroup>
                        <Input
                          type='text'
                          placeholder={I18n.t(
                            'containers.masterNodes.createMasterNode.masterNodeName'
                          )}
                          name='masterNodeName'
                          id='masterNodeName'
                          value={masterNodeName}
                          onChange={(e) => setMasterNodeName(e.target.value)}
                          autoFocus
                        />
                        <Label for='masterNodeName'>
                          {I18n.t(
                            'containers.masterNodes.createMasterNode.masterNodeName'
                          )}
                        </Label>
                      </InputGroup>
                    </div>
                  ) : (
                    <div>
                      <Label>
                        {I18n.t(
                          'containers.masterNodes.createMasterNode.lackOfBalanceMsg'
                        )}
                      </Label>
                    </div>
                  )}
                </Col>
              </FormGroup>
            </Form>
          </section>
        )}
      </div>
      <footer className='footer-bar'>
        <div
          className={classnames({
            'd-none': isConfirmationModalOpen !== 'default',
          })}
        >
          <Row className='justify-content-between align-items-center'>
            <Col className='d-flex justify-content-end'>
              <Button
                to={MASTER_NODES_PATH}
                tag={NavLink}
                color='link'
                className='mr-3'
              >
                {I18n.t('containers.wallet.sendPage.cancel')}
              </Button>
              <Button
                color='primary'
                disabled={!masterNodeName}
                onClick={() => setIsConfirmationModalOpen('confirm')}
              >
                {I18n.t(
                  'containers.masterNodes.createMasterNode.createNodeButton'
                )}
              </Button>
            </Col>
          </Row>
        </div>
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
              <Button color='primary' to={MASTER_NODES_PATH} tag={NavLink}>
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
              <p>{isErrorCreatingMasterNode}</p>
            </div>
          </div>
          <div className='d-flex align-items-center justify-content-center'>
            <Button color='primary' to={MASTER_NODES_PATH} tag={NavLink}>
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
  const { wallet, settings, masterNodes, errorModal } = state;
  return {
    unit: settings.appConfig.unit,
    walletBalance: wallet.walletBalance,
    isBalanceFetching: wallet.isBalanceFetching,
    isBalanceError: wallet.isBalanceFetching,
    isMasterNodeCreating: masterNodes.isMasterNodeCreating,
    createdMasterNodeData: masterNodes.createdMasterNodeData,
    isErrorCreatingMasterNode: masterNodes.isErrorCreatingMasterNode,
    isRestartNode: masterNodes.isRestartNode,
    isErrorModalRestart: errorModal.isRestart,
  };
};

const mapDispatchToProps = {
  fetchWalletBalanceRequest,
  createMasterNode: (masterNodeName: string) =>
    createMasterNode({ masterNodeName }),
  startRestartNodeWithMasterNode,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateMasterNode);
