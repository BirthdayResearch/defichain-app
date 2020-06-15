import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
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
  Modal,
  ModalHeader,
  ModalBody,
} from 'reactstrap';
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { fetchWalletBalanceRequest } from '../../../WalletPage/reducer';
import { MdArrowBack } from 'react-icons/md';
import { MASTER_NODES_PATH } from '../../../../constants';
import styles from '../../masternode.module.scss';

interface CreateMasterNodeProps extends RouteComponentProps {
  unit: string;
  walletBalance: string | number;
  fetchWalletBalanceRequest: () => void;
  isBalanceFetching: boolean;
  isBalanceError: any;
}
const CreateMasterNode: React.FunctionComponent<CreateMasterNodeProps> = (
  props: CreateMasterNodeProps
) => {
  const {
    unit,
    walletBalance,
    fetchWalletBalanceRequest,
    isBalanceFetching,
    isBalanceError,
  } = props;
  const [masterNodeName, setMasterNodeName] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isPage, setIsPage] = useState<boolean>(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState<
    boolean
  >(false);

  useEffect(() => {
    fetchWalletBalanceRequest();
    setIsPage(true);
  }, []);

  useEffect(() => {
    if (!isBalanceError && !isBalanceError && isPage) {
      setIsLoading(false);
    }
  }, [isBalanceFetching, isBalanceError, isPage]);
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
          <Form>
            <FormGroup className='form-label-group form-row'>
              <Col>
                {walletBalance >= 1000000 ? (
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
                        onChange={e => setMasterNodeName(e.target.value)}
                        autoFocus
                      />
                      <Label for='masterNodeName'>
                        {I18n.t(
                          'containers.masterNodes.createMasterNode.masterNodeName'
                        )}
                      </Label>
                    </InputGroup>
                    <div className='text-center mt-5'>
                      <Button
                        color='primary'
                        disabled={!masterNodeName}
                        onClick={() => setIsConfirmationModalOpen(true)}
                      >
                        {I18n.t(
                          'containers.masterNodes.createMasterNode.createNodeButton'
                        )}
                      </Button>
                    </div>
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
        )}
        <Modal
          isOpen={isConfirmationModalOpen}
          toggle={() => setIsConfirmationModalOpen(!isConfirmationModalOpen)}
          centered
        >
          <ModalHeader>Confirmation</ModalHeader>
          <ModalBody className={styles.modalBody}>
            <Row>
              <Col md={12} className={styles.confirmationalModal}>
                <Label>
                  {I18n.t(
                    'containers.masterNodes.createMasterNode.confirmationText'
                  )}
                </Label>
              </Col>
              <Col md={{ offset: 8, size: 2 }}>
                <Button
                  color='primary'
                  disabled={!masterNodeName}
                  // onClick={() => setIsConfirmationModalOpen(true)}
                >
                  {I18n.t(
                    'containers.masterNodes.createMasterNode.yesButtonText'
                  )}
                </Button>
              </Col>
              <Col md={2}>
                <Button
                  color='danger'
                  disabled={!masterNodeName}
                  onClick={() => setIsConfirmationModalOpen(false)}
                >
                  {I18n.t(
                    'containers.masterNodes.createMasterNode.noButtonText'
                  )}
                </Button>
              </Col>
            </Row>
          </ModalBody>
        </Modal>
      </div>
    </div>
  );
};

const mapStateToProps = state => {
  const { wallet, settings } = state;
  return {
    unit: settings.appConfig.unit,
    walletBalance: 1000000, // wallet.walletBalance,
    isBalanceFetching: wallet.isBalanceFetching,
    isBalanceError: wallet.isBalanceFetching,
  };
};

const mapDispatchToProps = {
  fetchWalletBalanceRequest,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateMasterNode);
