import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { Button, ButtonGroup } from 'reactstrap';
import { MdArrowBack, MdAdd } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import { NavLink as RRNavLink, RouteComponentProps } from 'react-router-dom';
import { LEDGER_CREATE_RECEIVE_REQUEST, LEDGER_PATH } from '@/constants';
import { RootState } from '@/app/rootReducer';
import Loader from '@/components/Loader';
import { getBackupIndexesLedger } from '../../reducer';
import PaymentRequestList from './PaymentRequestList';
import styles from './LedgerReceovePage.module.scss';

interface LedgerReceivePageProps extends RouteComponentProps {
  isLoading: boolean;
  error: null | Error;
  data: any;
  getBackupIndexesLedger: () => void
}

const LedgerReceivePage: React.FunctionComponent<LedgerReceivePageProps> = (
  props: LedgerReceivePageProps
) => {
  const urlParams = new URLSearchParams(props.location.search);
  const tokenSymbol = urlParams.get('symbol');
  const tokenHash = urlParams.get('hash');
  const tokenAmount = urlParams.get('amount');
  const tokenAddress = urlParams.get('address');

  useEffect(() => {
    props.getBackupIndexesLedger();
  }, [])

  return (
    <div className='main-wrapper'>
      { props.isLoading &&
        <div className={styles['loader-container']}>
          <Loader className={styles.loader} />
        </div>
      }
      <Helmet>
        <title>{I18n.t('containers.ledger.receivePage.receivePage')}</title>
      </Helmet>
      <header className='header-bar'>
        <Button
          to={LEDGER_PATH}
          tag={RRNavLink}
          color='link'
          className='header-bar-back'
        >
          <MdArrowBack />
          <span className='d-lg-inline text-uppercase'>
            {I18n.t('containers.ledger.receivePage.backButton')}
          </span>
        </Button>
        <h1>{I18n.t('containers.ledger.receivePage.receive')}</h1>
        <ButtonGroup>
          <Button
            to={LEDGER_CREATE_RECEIVE_REQUEST}
            tag={RRNavLink}
            color='link'
          >
            <MdAdd />
            <span className='d-lg-inline'>
              {I18n.t('containers.ledger.receivePage.newAddressButton')}
            </span>
          </Button>
        </ButtonGroup>
      </header>
      <div className='content'>
        <section>
          <PaymentRequestList />
        </section>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState) => {
  const { ledgerWallet } = state;
  return {
    ...ledgerWallet.indexesKeyLedger,
  };
};

const mapDispatchToProps = {
  getBackupIndexesLedger,
};

export default connect(mapStateToProps, mapDispatchToProps)(LedgerReceivePage);
