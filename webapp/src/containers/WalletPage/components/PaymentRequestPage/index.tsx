import React from 'react';
import moment from 'moment';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { I18n } from 'react-redux-i18n';
import { Button, ButtonGroup } from 'reactstrap';
import { MdArrowBack, MdDelete } from 'react-icons/md';
import { NavLink, RouteComponentProps, Redirect } from 'react-router-dom';
import KeyValueLi from '../../../../components/KeyValueLi';
import {
  WALLET_PAGE_PATH,
  PAYMENT_REQUEST_DETAIL_DATE_FORMAT,
} from '../../../../constants';
import { removeReceiveTxnsRequest } from '../../reducer';
import { getPageTitle, getTransactionURI } from '../../../../utils/utility';
import Header from '../../../HeaderComponent';

interface RouteProps {
  id: string;
}

interface PaymentRequestPageProps extends RouteComponentProps<RouteProps> {
  unit: string;
  paymentRequests: [];
  removeReceiveTxns: (id: string | number) => void;
}

const PaymentRequestPage: React.FunctionComponent<PaymentRequestPageProps> = (
  props: PaymentRequestPageProps
) => {
  const { match, paymentRequests = [] } = props;
  const id = match.params.id;
  const txns: any = paymentRequests.find((ele: any) => {
    return ele.id && ele.id.toString() === id;
  });

  const removeReceiveTrans = (transId: string | number) => {
    if (id) {
      props.removeReceiveTxns(transId);
      props.history.push(WALLET_PAGE_PATH);
    }
  };

  const { label, amount, time, message, address, unit } = txns || {};

  if (!address) {
    return <Redirect to={WALLET_PAGE_PATH} />;
  }

  return (
    <div className='main-wrapper'>
      <Helmet>
        <title>
          {getPageTitle(
            I18n.t('containers.wallet.paymentRequestPage.paymentRequestTitle', {
              id: label || address,
            })
          )}
        </title>
      </Helmet>
      <Header>
        <Button
          to={WALLET_PAGE_PATH}
          tag={NavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline'>
            {I18n.t('containers.wallet.paymentRequestPage.wallet')}
          </span>
        </Button>
        <h1>
          {I18n.t('containers.wallet.paymentRequestPage.paymentRequest')}
          &nbsp;
        </h1>
        <ButtonGroup>
          <Button color='link' onClick={() => removeReceiveTrans(id)}>
            <MdDelete />
            <span>{I18n.t('containers.wallet.paymentRequestPage.delete')}</span>
          </Button>
        </ButtonGroup>
      </Header>
      <div className='content'>
        <section className='mb-5'>
          <KeyValueLi
            label={I18n.t('containers.wallet.paymentRequestPage.label')}
            value={label}
          />
          <KeyValueLi
            label={I18n.t('containers.wallet.paymentRequestPage.amount')}
            value={amount ? `${amount} ${props.unit}` : ''}
          />
          <KeyValueLi
            label={I18n.t('containers.wallet.paymentRequestPage.time')}
            value={moment(time).format(PAYMENT_REQUEST_DETAIL_DATE_FORMAT)}
          />
          <KeyValueLi
            label={I18n.t('containers.wallet.paymentRequestPage.message')}
            value={message}
          />
          <KeyValueLi
            label={I18n.t('containers.wallet.paymentRequestPage.address')}
            value={address}
            popsQR={true}
            copyable={true!}
            uid='address'
          />
          <KeyValueLi
            label={I18n.t('containers.wallet.paymentRequestPage.uRI')}
            value={getTransactionURI(unit, address, {
              label,
              amount,
              message,
            })}
            popsQR={true}
            copyable={true}
            uid='uri'
          />
        </section>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => {
  const { wallet, settings } = state;
  return {
    unit: settings.appConfig.unit,
    paymentRequests: wallet.paymentRequests,
  };
};

const mapDispatchToProps = {
  removeReceiveTxns: (id: string | number) => removeReceiveTxnsRequest(id),
};

export default connect(mapStateToProps, mapDispatchToProps)(PaymentRequestPage);
