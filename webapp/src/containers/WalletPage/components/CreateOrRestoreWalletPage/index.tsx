import React from 'react';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { Col, Row } from 'reactstrap';
import { MdAccountBalanceWallet, MdFormatListBulleted } from 'react-icons/md';
import { connect } from 'react-redux';

import WalletStatCard from '../../../../components/WalletStatCard';
import {
  WALLET_BASE_PATH,
  WALLET_RESTORE_PAGE_PATH,
  WALLET_SYNC_PAGE_PATH,
} from '../../../../constants';
import {
  openBackupWalletWarningModal,
  openWalletRestartModal,
} from '../../../PopOver/reducer';
import Header from '../../../HeaderComponent';

interface CreateOrRestoreWalletPageProps {
  history: any;
  isWalletReplace: boolean;
  latestSyncedBlock: number;
  latestBlock: number;
  openBackupWalletWarningModal: () => void;
  openWalletRestartModal: () => void;
}

const CreateOrRestoreWalletPage: React.FunctionComponent<CreateOrRestoreWalletPageProps> = (
  props: CreateOrRestoreWalletPageProps
) => {
  const {
    history,
    isWalletReplace,
    latestSyncedBlock,
    latestBlock,
    openBackupWalletWarningModal,
  } = props;

  const createWallet = () => {
    latestSyncedBlock > 0 && latestSyncedBlock >= latestBlock
      ? !isWalletReplace
        ? openBackupWalletWarningModal()
        : history.push(WALLET_BASE_PATH)
      : history.push(WALLET_SYNC_PAGE_PATH);
  };

  const restoreWallet = () => {
    latestSyncedBlock > 0 && latestSyncedBlock >= latestBlock
      ? !isWalletReplace
        ? openBackupWalletWarningModal()
        : history.push(WALLET_RESTORE_PAGE_PATH)
      : history.push(WALLET_SYNC_PAGE_PATH);
  };

  return (
    <div>
      <Helmet>
        <title>
          {I18n.t('containers.wallet.createOrRestoreWalletPage.title')}
        </title>
      </Helmet>
      <Header>
        <h1>
          {I18n.t(
            'containers.wallet.createOrRestoreWalletPage.createOrRestoreWallet'
          )}
        </h1>
      </Header>
      <div className='content'>
        <section>
          <Row>
            <Col lg='4' sm='12' md='6'>
              <div onClick={createWallet}>
                <WalletStatCard
                  label={I18n.t(
                    'containers.wallet.createOrRestoreWalletPage.createANewWallet'
                  )}
                  icon={<MdAccountBalanceWallet size={48} color='#ff00af' />}
                />
              </div>
            </Col>
            <Col lg='4' sm='12' md='6'>
              <div onClick={restoreWallet}>
                <WalletStatCard
                  label={I18n.t(
                    'containers.wallet.createOrRestoreWalletPage.restoreWalletFromMnemonicSeed'
                  )}
                  icon={<MdFormatListBulleted size={48} color='#ff00af' />}
                />
              </div>
            </Col>
          </Row>
        </section>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { isWalletReplace } = state.popover;
  const { latestSyncedBlock, latestBlock } = state.syncstatus;

  return {
    isWalletReplace,
    latestSyncedBlock,
    latestBlock,
  };
};

const mapDispatchToProps = {
  openBackupWalletWarningModal,
  openWalletRestartModal,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateOrRestoreWalletPage);
