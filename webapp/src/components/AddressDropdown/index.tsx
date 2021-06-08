import React from 'react';
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
import { PaymentRequestModel } from '@defi_types/rpcConfig';
import styles from './AddressDropdown.module.scss';
import { AddressModel } from '../../model/address.model';

export interface AddressDropdownProps {
  formState: AddressModel;
  paymentRequests: PaymentRequestModel[];
  isDisabled?: boolean;
  additionalClass?: () => string;
  getTransactionLabel: (formState: any) => string;
  onSelectAddress: (data: PaymentRequestModel, amount?: number) => void;
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
  } = props;
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
        {paymentRequests.map((data) => {
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

const mapStateToProps = (state) => {
  const { paymentRequests } = state.wallet;
  return {
    paymentRequests,
  };
};

export default connect(mapStateToProps)(AddressDropdown);
