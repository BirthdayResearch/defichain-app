import React from 'react';
import { connect } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { CustomInput, FormGroup } from 'reactstrap';
import styles from '../../../WalletPage.module.scss';

interface SendLPProps {
  isSendLPConfirmed: boolean;
  handleChange: (e) => void;
}

const SendLPWarning: React.FunctionComponent<SendLPProps> = (
  props: SendLPProps
) => {
  const { isSendLPConfirmed, handleChange } = props;
  return (
    <>
      <h5>{I18n.t('containers.wallet.sendPage.sendLPWarning')}</h5>
      <FormGroup>
        <CustomInput
          className={styles.lp_checkbox__bold}
          type='checkbox'
          name='sendLPConfirm'
          id='sendLPConfirm'
          label={I18n.t('containers.wallet.sendPage.sendLPConfirm')}
          checked={isSendLPConfirmed}
          onChange={handleChange}
        />
      </FormGroup>
    </>
  );
};

export default connect()(SendLPWarning);
