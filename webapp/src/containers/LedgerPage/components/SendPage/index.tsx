import React from 'react';
import { connect } from 'react-redux';
import SendPage from '@/components/SendPage';
import { fetchSendDataRequest } from '../../reducer';
import {
  accountToAccount,
  isValidAddress,
  accountToAccountConversion
} from '../../service';
import { LEDGER_PATH } from '@/constants';
import { getAddressForSymbolLedger } from '@/utils/utility';

const mapStateToProps = (state) => {
  const { ledgerWallet, settings } = state;
  return {
    unit: settings.appConfig.unit,
    sendData:ledgerWallet.sendData,
    paymentRequests: ledgerWallet.paymentRequests,
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
  isValidAddress,
  getAddressForSymbol: getAddressForSymbolLedger,
  accountToAccountConversion,
  cancelPagePath: LEDGER_PATH,
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  mergerProps
)(SendPage);
