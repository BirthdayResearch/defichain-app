import React from 'react';
import uid from 'uid';
import { I18n } from 'react-redux-i18n';
import { LEDGER_RECEIVE_PATH } from '../../../../../constants';
import { getNewAddress } from '../../../service';
import * as log from '../../../../../utils/electronLogger';
import CreateNewAddress from '../../../../../components/CreateNewAddress';

interface CreateNewAddressPageLedgerProps {
  history: {
    push(url: string): void;
  };
}

const CreateNewAddressLedgerPage: React.FunctionComponent<CreateNewAddressPageLedgerProps> = (
  props: CreateNewAddressPageLedgerProps
) => {
  const onSubmit = async (label: string, addressTypeChecked: boolean) => {
    try {
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
      props.history.push(LEDGER_RECEIVE_PATH);
    } catch (err) {
      log.error(err);
    }
  };

  return (
    <CreateNewAddress
      history={props.history}
      receivePath={LEDGER_RECEIVE_PATH}
      handleSubmit={onSubmit}
    />
  );
};

export default CreateNewAddressLedgerPage;
