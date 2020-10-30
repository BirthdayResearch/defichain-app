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
} from '../../../../constants';
import {
  openBackupWalletWarningModal,
  openWalletRestartModal,
} from '../../../PopOver/reducer';

interface CreateOrRestoreWalletPageProps {
  history: any;
  isWalletReplace: boolean;
  openBackupWalletWarningModal: () => void;
  openWalletRestartModal: () => void;
}

const CreateOrRestoreWalletPage: React.FunctionComponent<CreateOrRestoreWalletPageProps> = (
  props: CreateOrRestoreWalletPageProps
) => {
  const { history, isWalletReplace, openBackupWalletWarningModal } = props;

  return (
    <div>
      <Helmet>
        <title>
          {I18n.t('containers.wallet.createOrRestoreWalletPage.title')}
        </title>
      </Helmet>
      <header className='header-bar'>
        <h1>
          {I18n.t(
            'containers.wallet.createOrRestoreWalletPage.createOrRestoreWallet'
          )}
        </h1>
      </header>
      <div className='content'>
        <section>
          <Row>
            <Col lg='6' sm='12' md='12'>
              <div
                onClick={() => {
                  !isWalletReplace
                    ? openBackupWalletWarningModal()
                    : history.push(WALLET_BASE_PATH);
                }}
              >
                <WalletStatCard
                  label={I18n.t(
                    'containers.wallet.createOrRestoreWalletPage.createANewWallet'
                  )}
                  icon={<MdAccountBalanceWallet size={60} color='#ff00af' />}
                />
              </div>
            </Col>
            <Col lg='6' sm='12' md='12'>
              <div
                onClick={() => {
                  !isWalletReplace
                    ? openBackupWalletWarningModal()
                    : history.push(WALLET_RESTORE_PAGE_PATH);
                }}
              >
                <WalletStatCard
                  label={I18n.t(
                    'containers.wallet.createOrRestoreWalletPage.restoreWalletFromMnemonicSeed'
                  )}
                  icon={<MdFormatListBulleted size={60} color='#ff00af' />}
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

  return {
    isWalletReplace,
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
