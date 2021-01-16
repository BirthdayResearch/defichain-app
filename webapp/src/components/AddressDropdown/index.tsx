import React, { useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { connect } from 'react-redux';
import { MdCheck } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import {
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Row,
  Col,
  UncontrolledDropdown,
} from 'reactstrap';
import { PaymentRequestModel } from '../../containers/WalletPage/components/ReceivePage/PaymentRequestList';
import styles from './AddressDropdown.module.scss';
import { AddressModel } from '../../model/address.model';
import { RootState } from '@/app/rootReducer';

export interface AddressDropdownProps extends RouteComponentProps {
  formState: AddressModel;
  paymentRequests: PaymentRequestModel[];
  isDisabled?: boolean;
  additionalClass?: () => string;
  getTransactionLabel: (formState: any) => string;
  onSelectAddress: (data: PaymentRequestModel, amount?: number) => void;
  paymentRequestsLedger: PaymentRequestModel[];
  typeWallet: string | null;
}

const AddressDropdown: React.FunctionComponent<AddressDropdownProps> = (
  props: AddressDropdownProps
) => {
  const {
    getTransactionLabel,
    onSelectAddress,
    formState,
    paymentRequests,
    additionalClass,
    isDisabled,
    paymentRequestsLedger,
    typeWallet,
  } = props;
  const [addresses, setAddresses] = useState<PaymentRequestModel[]>([]);
  useEffect(() => {
    if (typeWallet === 'ledger') {
      setAddresses(paymentRequestsLedger)
    } else {
      setAddresses(paymentRequests)
    }
  }, [typeWallet])
  return (
    <UncontrolledDropdown className='w-100'>
      <DropdownToggle
        caret
        color='outline-secondary'
        className={`${styles.divisibilityDropdown} ${
          additionalClass ? additionalClass() : ''
        }`}
        disabled={isDisabled ?? false}
      >
        <div className={`${styles.ellipsisValue} ${styles.dropdownContent}`}>
          {getTransactionLabel(formState)}
        </div>
      </DropdownToggle>
      <DropdownMenu className={`${styles.scrollAuto} w-100`}>
        <DropdownItem className='w-100'>
          <Row className='w-100'>
            <Col md='6'>{I18n.t('containers.swap.addLiquidity.address')}</Col>
            <Col md='3'>{I18n.t('containers.swap.addLiquidity.label')}</Col>
            <Col md='3'>{I18n.t('containers.swap.addLiquidity.selected')}</Col>
          </Row>
        </DropdownItem>
        {addresses.map((data) => {
          return (
            <DropdownItem
              className='justify-content-between ml-0 w-100'
              key={data.address}
              name='receiveAddress'
              onClick={() => onSelectAddress(data, data.amount)}
              value={data.address}
            >
              <Row className='w-100'>
                <Col md='6'>
                  <div className={styles.ellipsisValue}>{data.address}</div>
                </Col>
                <Col md='3'>
                  <div className={styles.ellipsisValue}>
                    {data.label ? data.label : '---'}
                  </div>
                </Col>
                <Col md='3'>
                  {formState.receiveAddress === data.address && <MdCheck />}
                </Col>
              </Row>
            </DropdownItem>
          );
        })}
      </DropdownMenu>
    </UncontrolledDropdown>
  );
};

const mapStateToProps = (state: RootState) => {
  const { paymentRequests } = state.wallet;
  const { paymentRequests: paymentRequestsLedger} = state.ledgerWallet
  return {
    paymentRequests,
    paymentRequestsLedger,
  };
};

export default connect(mapStateToProps)(AddressDropdown);
