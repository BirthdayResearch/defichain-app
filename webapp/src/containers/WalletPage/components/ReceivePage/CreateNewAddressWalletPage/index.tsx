import React from 'react';
import uid from 'uid';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { WALLET_RECEIVE_PATH } from '../../../../../constants';
import { addReceiveTxnsRequest } from '../../../reducer';
import { getNewAddress } from '../../../service';
import CreateNewAddress from '../../../../../components/CreateNewAddress';

interface CreateNewAddressPageProps {
  addReceiveTxns: (data: any) => void;
  history: {
    push(url: string): void;
  };
}

const CreateNewAddressWalletPage: React.FunctionComponent<CreateNewAddressPageProps> = (
  props: CreateNewAddressPageProps
) => {
  const onSubmit = async (label: string, addressTypeChecked: boolean) => {
    const newAddress = await getNewAddress(label, addressTypeChecked);
    if (!newAddress) {
      throw new Error(
        I18n.t('containers.wallet.receivePage.addressNotAvailable')
      );
    }
    const data = {
      label,
      id: uid(),
      time: new Date().toString(),
      address: newAddress,
    };
    props.addReceiveTxns(data);
    props.history.push(WALLET_RECEIVE_PATH);
  };

  return (
    <CreateNewAddress
      history={props.history}
      receivePath={WALLET_RECEIVE_PATH}
      handleSubmit={onSubmit}
    />
  );
};

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = {
  addReceiveTxns: (data: any) => addReceiveTxnsRequest(data),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateNewAddressWalletPage);
