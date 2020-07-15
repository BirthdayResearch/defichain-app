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
import { NavLink } from 'react-router-dom';
import { fetchWalletBalanceRequest } from '../../../WalletPage/reducer';
import { createMasterNode } from '../../reducer';
import {
  MASTER_NODES_PATH,
  MINIMUM_DFI_AMOUNT_FOR_MASTERNODE,
} from '../../../../constants';
import BigNumber from 'bignumber.js';
import { MdArrowBack, MdCheckCircle, MdErrorOutline } from 'react-icons/md';
import styles from '../../masternode.module.scss';

interface CreateMasterNodeProps {
  unit: string;
  walletBalance: string | number;
  fetchWalletBalanceRequest: () => void;
  isBalanceFetching: boolean;
  isBalanceError: any;
  createMasterNode: (masterNodeName: string) => void;
  isMasterNodeCreating: boolean;
  createdMasterNodeData: any;
  isErrorCreatingMasterNode: string;
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
  } = props;
  const [masterNodeName, setMasterNodeName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPage, setIsPage] = useState<boolean>(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<
    string
  >('default');
  const [wait, setWait] = useState<number>(5);
  const [allowCalls, setAllowCalls] = useState<boolean>(false);

  useEffect(() => {
    fetchWalletBalanceRequest();
    setIsPage(true);
  }, []);

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
    setIsConfirmationModalOpen('default');
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
                  {I18n.t(
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
                onClick={() => {
                  setAllowCalls(true);
                  createMasterNode(masterNodeName);
                }}
                disabled={wait > 0 ? true : false}
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
          <div className='d-flex align-items-center justify-content-center'>
            <Button color='primary' to={MASTER_NODES_PATH} tag={NavLink}>
              {I18n.t(
                'containers.masterNodes.createMasterNode.backToMasternodePage'
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
  const { wallet, settings, masterNodes } = state;
  return {
    unit: settings.appConfig.unit,
    walletBalance: wallet.walletBalance,
    isBalanceFetching: wallet.isBalanceFetching,
    isBalanceError: wallet.isBalanceFetching,
    isMasterNodeCreating: masterNodes.isMasterNodeCreating,
    createdMasterNodeData: masterNodes.createdMasterNodeData,
    isErrorCreatingMasterNode: masterNodes.isErrorCreatingMasterNode,
  };
};

const mapDispatchToProps = {
  fetchWalletBalanceRequest,
  createMasterNode: (masterNodeName: string) =>
    createMasterNode({ masterNodeName }),
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateMasterNode);
