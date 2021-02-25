import { connect } from 'react-redux';
import React from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { createWalletStart, createWalletFailure } from '../../reducer';
import EncryptWalletPage, { EncryptWalletPayload } from '../EncryptWalletPage';

interface CreateWalletProps extends RouteComponentProps {
  createWalletStart: (item: EncryptWalletPayload) => void;
  createWalletFailure: (err: string) => void;
  isWalletCreating: boolean;
  isErrorCreatingWallet: string;
}

const CreateWallet: React.FunctionComponent<CreateWalletProps> = (
  props: CreateWalletProps
) => {
  const {
    createWalletStart,
    createWalletFailure,
    isWalletCreating,
    isErrorCreatingWallet,
  } = props;
  return (
    <EncryptWalletPage
      submitButtonLabel={
        'containers.wallet.createNewWalletPage.createANewWallet'
      }
      onSave={createWalletStart}
      pageLoadingMessage={
        'containers.wallet.verifyMnemonicPage.creatingYourWallet'
      }
      isPageLoading={isWalletCreating}
      pageErrorMessage={isErrorCreatingWallet}
      onCloseFailure={createWalletFailure}
      pageSize={11}
    />
  );
};

const mapStateToProps = (state) => {
  const { isWalletCreating, isErrorCreatingWallet } = state.wallet;
  return {
    isWalletCreating,
    isErrorCreatingWallet,
  };
};

const mapDispatchToProps = {
  createWalletStart,
  createWalletFailure,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateWallet);
