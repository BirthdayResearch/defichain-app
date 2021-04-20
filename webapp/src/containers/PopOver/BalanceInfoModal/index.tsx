import React from 'react';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';
import { I18n } from 'react-redux-i18n';
import { Button, Modal, ModalBody } from 'reactstrap';
import { RootState } from '../../../app/rootTypes';
import openNewTab from '../../../utils/openNewTab';
import { getPageTitle } from '../../../utils/utility';
import styles from '../popOver.module.scss';
import { openBalanceTooltipModal } from '../reducer';

const BalanceInfoModal: React.FunctionComponent = () => {
  const dispatch = useDispatch();
  const { isBalanceTooltipOpen } = useSelector(
    (state: RootState) => state.popover
  );
  const dstLink =
    'https://defichain.com/white-paper/#tokenization-as-a-defi-standard-token-dst';
  const wikiGraphic = 'https://defichain-wiki.com/wiki/DeFiChain_ecosystem';

  const closeModal = () => {
    dispatch(openBalanceTooltipModal(false));
  };

  return (
    <Modal
      isOpen={isBalanceTooltipOpen}
      contentClassName={styles.modalContent}
      backdropClassName={styles.modalBackdrop}
      style={{ width: '100%', maxWidth: '100vw', height: '100vh', margin: '0' }}
      centered
    >
      <Button
        color='link'
        onClick={closeModal}
        className={styles.floatingCancel}
      >
        {I18n.t('alerts.closeBtnLabel')}
      </Button>
      <ModalBody style={{ padding: '4.5rem 6rem' }}>
        <div className='main-wrapper'>
          <>
            <Helmet>
              <title>
                {getPageTitle(
                  I18n.t('containers.wallet.walletPage.whatAreTokens')
                )}
              </title>
            </Helmet>
          </>
        </div>
        <div className='content'>
          <section>
            <h2>{I18n.t('containers.wallet.walletPage.whatAreTokens')}</h2>
          </section>
          <section>
            <p className='mb-5'>
              {I18n.t('containers.wallet.walletPage.tokenDescription')}
            </p>
            <p className='mb-5'>
              {I18n.t('containers.wallet.walletPage.tokenSub')}
            </p>
          </section>
          <section>
            <div>{I18n.t('containers.wallet.walletPage.moreInformation')}</div>
            <div>
              <a
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openNewTab(dstLink);
                }}
              >
                {dstLink}
              </a>
            </div>
            <div>
              <a
                href='#'
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openNewTab(wikiGraphic);
                }}
              >
                {wikiGraphic}
              </a>
            </div>
          </section>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default BalanceInfoModal;
