import React from 'react';
import { MdFileDownload } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import {
  Modal,
  ModalBody,
  ModalFooter,
  Button,
  Col,
  FormGroup,
  Row,
  Alert,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from 'reactstrap';
import CsvRowInput from '../../CsvRowInput';
import { CSVLink } from 'react-csv';
import { TXN_CSV_HEADERS } from '../../../../../../constants';
import Spinner from '../../../../../../components/Svg/Spinner';
import CsvRowToggle from '../csvRowToggle';
import styles from '../../WalletTxns.module.scss';

interface Reqdata {
  blockHeight: number;
  limit: number;
  token: string;
  no_rewards: boolean;
}

interface TransactionData {
  amounts: string[];
  blockHash: string;
  blockHeight: number;
  blockTime: number;
  owner: string;
  poolID: string;
  type: string;
  txId?: string;
  txn?: number;
}

interface DownloadCsvModalProps {
  reqData: Reqdata;
  error: string;
  CsvModalOpen: boolean;
  handleCsvButtonClick: () => void;
  tokenSymbol: string;
  toggle: () => void;
  handleRegularNumInputs: (e: any, field: string) => void;
  handleCheckBox: () => void;
  filename: string;
  handleDownloadWindow: () => void;
  transactionData: TransactionData;
  downloadDisable: boolean;
  maxBlock: () => void;
}

const DownloadCsvModal: React.FunctionComponent<DownloadCsvModalProps> = (
  props: DownloadCsvModalProps
) => {
  const {
    CsvModalOpen,
    toggle,
    handleRegularNumInputs,
    handleCheckBox,
    error,
    filename,
    handleDownloadWindow,
    transactionData,
    reqData,
    downloadDisable,
    maxBlock,
  } = props;

  return (
    <Modal isOpen={CsvModalOpen} centered fade={false} toggle={toggle}>
      <ModalBody className='ml-3'>
        <Row className='mb-4 mt-2'>
          <Col>{I18n.t('containers.wallet.walletPage.exportWalletData')}</Col>
        </Row>
        <Row className='mr-1'>
          <Col md='10'>
            <FormGroup className='form-label-group'>
              <InputGroup className={styles.setWidth}>
                <CsvRowInput
                  fieldName={'blockHeight'}
                  label={I18n.t('containers.wallet.walletPage.maxBlockHeight')}
                  value={reqData.blockHeight}
                  name={'blockHeight'}
                  id={'maximumAmount'}
                  placeholder={'Number'}
                  handleInputs={handleRegularNumInputs}
                />
              </InputGroup>
            </FormGroup>
          </Col>
          <Col md='2'>
            <Button color='outline-primary' onClick={maxBlock}>
              {I18n.t('containers.wallet.walletPage.max')}
            </Button>
          </Col>
        </Row>
        <Row>
          <Col md='12'>
            <FormGroup className='form-label-group'>
              <InputGroup>
                <CsvRowInput
                  fieldName={'limit'}
                  label={I18n.t('containers.wallet.walletPage.limit')}
                  name={'limit'}
                  value={reqData.limit}
                  id={'limit'}
                  placeholder={'Number'}
                  handleInputs={handleRegularNumInputs}
                />
                <InputGroupAddon addonType='append'>
                  <InputGroupText>
                    {I18n.t('containers.wallet.walletPage.transaction')}
                  </InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </FormGroup>
          </Col>
          <Col>
            <CsvRowToggle
              type='checkbox'
              id='no_rewards'
              label={I18n.t('containers.wallet.walletPage.includeRewards')}
              handleCheckBox={handleCheckBox}
            />
          </Col>
        </Row>
        <Row className='mt-2'>
          <Col md='12'>{error && <Alert color='danger'>{error}</Alert>}</Col>
        </Row>
      </ModalBody>
      <ModalFooter>
        <div className='ml-3'>
          <span className='text-muted'>
            <small>{I18n.t('containers.wallet.walletPage.format')}</small>
          </span>
          <div className='clearfix'></div>
          <span>{I18n.t('containers.wallet.walletPage.csv')}</span>
        </div>
        <Button
          size='sm'
          color='link'
          className='ml-auto'
          onClick={() => toggle()}
        >
          {I18n.t('alerts.cancel')}
        </Button>
        <CSVLink
          filename={filename}
          onClick={handleDownloadWindow}
          data={transactionData}
          headers={TXN_CSV_HEADERS}
        >
          <Button color='primary' disabled={downloadDisable}>
            {downloadDisable ? <Spinner /> : <MdFileDownload />}
            <span className='d-lg-inline'>
              {I18n.t('containers.wallet.walletPage.export')}
            </span>
          </Button>
        </CSVLink>
      </ModalFooter>
    </Modal>
  );
};

export default DownloadCsvModal;
