import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { Col, Row } from 'reactstrap';
import {
  MdAccountBalanceWallet,
  MdFormatListBulleted,
  MdRestorePage,
} from 'react-icons/md';
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
import { checkRestartCriteriaRequestLoading } from '../../reducer';
import { getPageTitle } from '../../../../utils/utility';
import CustomIcon from '../../../../components/CustomIcon';
import LedgerNano from '../../../../assets/svg/icon-ledger.svg';

interface CreateOrRestoreWalletPageProps {
  history: any;
  isWalletReplace: boolean;
  latestSyncedBlock: number;
  latestBlock: number;
  openBackupWalletWarningModal: () => void;
  openWalletRestartModal: () => void;
  checkRestartCriteriaRequestLoading: () => void;
  isLoading: boolean;
  restartCriteriaFlag: boolean;
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
    checkRestartCriteriaRequestLoading,
    isLoading,
    restartCriteriaFlag,
  } = props;

  useEffect(() => {
    checkRestartCriteriaRequestLoading();
  }, []);

  const createWallet = () => {
    latestSyncedBlock > 0 && latestSyncedBlock >= latestBlock
      ? restartCriteriaFlag && !isWalletReplace
        ? openBackupWalletWarningModal()
        : history.push(WALLET_BASE_PATH)
      : history.push(WALLET_SYNC_PAGE_PATH);
  };

  const restoreWallet = () => {
    latestSyncedBlock > 0 && latestSyncedBlock >= latestBlock
      ? restartCriteriaFlag && !isWalletReplace
        ? openBackupWalletWarningModal()
        : history.push(WALLET_RESTORE_PAGE_PATH)
      : history.push(WALLET_SYNC_PAGE_PATH);
  };

  return (
    <div>
      <Helmet>
        <title>
          {getPageTitle(
            I18n.t('containers.wallet.createOrRestoreWalletPage.title')
          )}
        </title>
      </Helmet>
      <Header>
        <h1>{I18n.t('containers.wallet.walletPage.walletDeFiApp')}</h1>
      </Header>
      <div className='content'>
        <section>
          {isLoading ? (
            <div>
              {I18n.t('containers.wallet.createOrRestoreWalletPage.loading')}
            </div>
          ) : (
            <>
              <h3>
                {I18n.t(
                  'containers.wallet.createOrRestoreWalletPage.createOrRestoreWallet'
                )}
              </h3>
              <Row>
                <Col sm='12' md='6' className={'cursor-pointer'}>
                  <div onClick={createWallet}>
                    <WalletStatCard
                      label={I18n.t(
                        'containers.wallet.createOrRestoreWalletPage.createANewWallet'
                      )}
                      subtitle={I18n.t(
                        'containers.wallet.createOrRestoreWalletPage.hdWallet'
                      )}
                      icon={
                        <MdAccountBalanceWallet size={48} color='#ff00af' />
                      }
                    />
                  </div>
                </Col>
                <Col sm='12' md='6' className={'cursor-disabled'}>
                  <div>
                    <WalletStatCard
                      label={I18n.t(
                        'containers.wallet.createOrRestoreWalletPage.connectToALedger'
                      )}
                      subtitle={I18n.t(
                        'containers.wallet.createOrRestoreWalletPage.comingSoon'
                      )}
                      icon={
                        <CustomIcon
                          src={LedgerNano}
                          size={48}
                          color='rgba(0, 0, 0, 0.4)'
                        />
                      }
                    />
                  </div>
                </Col>
              </Row>
              <Row>
                <Col sm='12' md='6' className={'cursor-pointer'}>
                  <div onClick={restoreWallet}>
                    <WalletStatCard
                      label={I18n.t(
                        'containers.wallet.createOrRestoreWalletPage.restoreWalletFromMnemonicSeed'
                      )}
                      subtitle={I18n.t(
                        'containers.wallet.createOrRestoreWalletPage.mnemonicSeed'
                      )}
                      icon={<MdFormatListBulleted size={48} color='#ff00af' />}
                    />
                  </div>
                </Col>
                <Col sm='12' md='6' className={'cursor-pointer'}>
                  <div>
                    <WalletStatCard
                      label={I18n.t(
                        'containers.wallet.createOrRestoreWalletPage.restoreFromBackup'
                      )}
                      subtitle={I18n.t(
                        'containers.wallet.createOrRestoreWalletPage.walletDat'
                      )}
                      icon={<MdRestorePage size={48} color='#ff00af' />}
                    />
                  </div>
                </Col>
              </Row>
              <h3>
                {I18n.t(
                  'containers.wallet.createOrRestoreWalletPage.chooseRecentBackup'
                )}
              </h3>
            </>
          )}
        </section>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { isWalletReplace } = state.popover;
  const { latestSyncedBlock, latestBlock } = state.syncstatus;
  const {
    restartCriteria: { isLoading, data: restartCriteriaFlag },
  } = state.wallet;

  return {
    isWalletReplace,
    latestSyncedBlock,
    latestBlock,
    isLoading,
    restartCriteriaFlag,
  };
};

const mapDispatchToProps = {
  openBackupWalletWarningModal,
  openWalletRestartModal,
  checkRestartCriteriaRequestLoading,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateOrRestoreWalletPage);
