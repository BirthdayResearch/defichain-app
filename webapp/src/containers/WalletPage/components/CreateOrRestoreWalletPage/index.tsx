import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { Button, Col, Row } from 'reactstrap';
import {
  MdAccountBalanceWallet,
  MdErrorOutline,
  MdFormatListBulleted,
  MdRestorePage,
} from 'react-icons/md';
import { connect } from 'react-redux';

import WalletStatCard from '../../../../components/WalletStatCard';
import {
  WALLET_CREATE_PATH,
  WALLET_RESTORE_PAGE_PATH,
  WALLET_SYNC_PAGE_PATH,
} from '../../../../constants';
import {
  openBackupWalletWarningModal,
  openWalletRestartModal,
} from '../../../PopOver/reducer';
import Header from '../../../HeaderComponent';
import {
  checkRestartCriteriaRequestLoading,
  resetRestoreWalletError,
} from '../../reducer';
import { getPageTitle } from '../../../../utils/utility';
import CustomIcon from '../../../../components/CustomIcon';
import LedgerNano from '../../../../assets/svg/icon-ledger.svg';
import RecentWalletsList from './RecentWalletsList';
import { WalletMap } from '@defi_types/walletMap';
import { startRestoreWalletViaBackup } from '../../reducer';
import WalletLoadingFooter from '../../../../components/WalletLoadingFooter';
import classnames from 'classnames';
import styles from '../RestoreWallet/RestoreWallet.module.scss';
import { restoreWalletViaRecent } from '../../../PopOver/reducer';

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
  walletMap: WalletMap;
  startRestoreWalletViaBackup: () => void;
  isWalletRestoring: boolean;
  isErrorRestoringWallet: string;
  resetRestoreWalletError: () => void;
  restoreWalletViaRecent: (p: string) => void;
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
    walletMap,
    startRestoreWalletViaBackup,
    isWalletRestoring,
    isErrorRestoringWallet,
    resetRestoreWalletError,
    restoreWalletViaRecent,
  } = props;

  useEffect(() => {
    checkRestartCriteriaRequestLoading();
  }, []);

  const isBlocksLoaded = (): boolean => {
    return latestSyncedBlock > 0 && latestSyncedBlock >= latestBlock;
  };

  const createWallet = () => {
    isBlocksLoaded()
      ? restartCriteriaFlag && !isWalletReplace
        ? openBackupWalletWarningModal()
        : history.push(WALLET_CREATE_PATH)
      : history.push(WALLET_SYNC_PAGE_PATH);
  };

  const restoreWallet = () => {
    isBlocksLoaded()
      ? restartCriteriaFlag && !isWalletReplace
        ? openBackupWalletWarningModal()
        : history.push(WALLET_RESTORE_PAGE_PATH)
      : history.push(WALLET_SYNC_PAGE_PATH);
  };

  const restoreWalletViaBackup = () => {
    isBlocksLoaded()
      ? startRestoreWalletViaBackup()
      : history.push(WALLET_SYNC_PAGE_PATH);
  };

  const onRestoreRecentBackup = (p: string) => {
    isBlocksLoaded()
      ? restoreWalletViaRecent(p)
      : history.push(WALLET_SYNC_PAGE_PATH);
  };

  return (
    <>
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
                  <div onClick={restoreWalletViaBackup}>
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
              {walletMap?.paths && (
                <>
                  <h3>
                    {I18n.t(
                      'containers.wallet.createOrRestoreWalletPage.chooseRecentBackup'
                    )}
                  </h3>
                  <RecentWalletsList
                    paths={walletMap.paths}
                    onRestore={onRestoreRecentBackup}
                  />
                </>
              )}
            </>
          )}
        </section>
      </div>
      {isWalletRestoring ? (
        <>
          <div className={`footer-backdrop show-backdrop`} />
          <footer className='footer-bar'>
            <WalletLoadingFooter
              message={I18n.t(
                'containers.wallet.restoreWalletPage.importingWallet'
              )}
            />
          </footer>
        </>
      ) : (
        isErrorRestoringWallet.length !== 0 && (
          <>
            <div className={`footer-sheet`}>
              <div className='text-center'>
                <MdErrorOutline
                  className={classnames({
                    'footer-sheet-icon': true,
                    [styles[`error-dialog`]]: true,
                  })}
                />
                <p>{isErrorRestoringWallet}</p>
              </div>
            </div>
            <div className='d-flex align-items-center justify-content-center mb-5'>
              <Button
                color='primary'
                onClick={() => {
                  resetRestoreWalletError();
                }}
              >
                {I18n.t('containers.wallet.restoreWalletPage.backToWalletPage')}
              </Button>
            </div>
          </>
        )
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const { isWalletReplace } = state.popover;
  const { latestSyncedBlock, latestBlock } = state.syncstatus;
  const {
    restartCriteria: { isLoading, data: restartCriteriaFlag },
    walletMap,
    isWalletRestoring,
    isErrorRestoringWallet,
  } = state.wallet;

  return {
    isWalletReplace,
    latestSyncedBlock,
    latestBlock,
    isLoading,
    restartCriteriaFlag,
    walletMap,
    isWalletRestoring,
    isErrorRestoringWallet,
  };
};

const mapDispatchToProps = {
  openBackupWalletWarningModal,
  openWalletRestartModal,
  checkRestartCriteriaRequestLoading,
  startRestoreWalletViaBackup,
  resetRestoreWalletError: () => resetRestoreWalletError({}),
  restoreWalletViaRecent,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateOrRestoreWalletPage);
