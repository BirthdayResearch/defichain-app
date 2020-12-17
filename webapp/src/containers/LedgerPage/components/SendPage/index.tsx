import React from 'react';
import { connect } from 'react-redux';
import SendPage from '@/components/SendPage';
import { fetchSendDataRequest } from '../../reducer';
import {
  accountToAccount,
  handleFetchRegularDFI,
  sendToAddress,
  isValidAddress,
} from '../../service';
import { LEDGER_PATH } from '@/constants';

const mapStateToProps = (state) => {
  const { ledgerWallet, settings } = state;
  return {
    unit: settings.appConfig.unit,
    sendData: ledgerWallet.sendData,
  };
};

const mapDispatchToProps = {
  fetchSendData: fetchSendDataRequest,
};

const mergerProps = (stateProps, dispatchProps, ownProps) => ({
  ...ownProps,
  ...stateProps,
  ...dispatchProps,
  accountToAccount,
  handleFetchRegularDFI,
  isValidAddress,
  sendToAddress,
  cancelPagePath: LEDGER_PATH,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergerProps
)(SendPage);
