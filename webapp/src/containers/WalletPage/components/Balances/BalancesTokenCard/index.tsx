import React, { useState } from 'react';
import { Badge, Button, Card, CardBody, Col, Row, Tooltip } from 'reactstrap';
import { I18n } from 'react-redux-i18n';

import styles from '../Balances.module.scss';

import TokenAvatar from '../../../../../components/TokenAvatar';
import NumberMask from '../../../../../components/NumberMask';
import BigNumber from 'bignumber.js';
import {
  MdArrowDownward,
  MdArrowUpward,
  MdInfoOutline,
  MdSwapHoriz,
} from 'react-icons/md';
import { IToken } from '../../../../../utils/interfaces';
import {
  DFI_SYMBOL,
  DST,
  LP,
  SWAP_PATH,
  WALLET_PAGE_PATH,
  WALLET_RECEIVE_PATH,
  WALLET_SEND_PATH,
} from '../../../../../constants';
import { NavLink } from 'react-router-dom';
import { SwapParameters } from '../../../../SwapPage';
import { history } from '../../../../../utils/history';
import { getWalletPathAddress } from '../../../service';

interface BalancesTokenCardProps {
  token: IToken;
  size?: string;
  bgImage?: string;
  hideSwap?: boolean;
  hideMore?: boolean;
  hideBadge?: boolean;
  utxoDfi?: number;
}

const BalancesTokenCard: React.FunctionComponent<BalancesTokenCardProps> = (
  props: BalancesTokenCardProps
) => {
  const { token, size, bgImage, hideSwap, hideMore, hideBadge, utxoDfi } =
    props;

  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen(!tooltipOpen);

  const onCardClick = (event: React.MouseEvent, token: IToken) => {
    const eventTarget = event?.target as any;
    const parentTarget = eventTarget.parentElement;
    const containsClick = (eventTarget) => {
      return eventTarget?.classList?.contains('clickable');
    };
    if (containsClick(eventTarget) || containsClick(parentTarget)) {
      event.stopPropagation();
      event.preventDefault();
      return;
    }
    history.push(
      getWalletPathAddress(
        WALLET_PAGE_PATH,
        token.symbol,
        token.hash,
        (token.amount ?? 0)?.toString(),
        '',
        token.isLPS,
        token.isSPV,
        token.displayName,
        token.isDAT
      )
    );
  };

  const utxos = new BigNumber(utxoDfi || 0);
  const symbolKey =
    token.symbolKey === 'DFI' || token.isSPV
      ? `n_${token.symbolKey}`
      : token.symbolKey;
  return (
    <Row className='align-items-center balanceTokenCard'>
      <Col md='12'>
        <Card
          onClick={(event) => onCardClick(event, token)}
          style={{ cursor: 'pointer' }}
        >
          {bgImage && (
            <div
              className={styles.bgImage}
              style={{ backgroundImage: `url(${bgImage})` }}
            ></div>
          )}
          <CardBody className={styles.cardBody}>
            <Row className='align-items-center'>
              <Col md='3'>
                <div className='d-flex align-items-center justify-content-start'>
                  <div>
                    <TokenAvatar
                      symbol={symbolKey}
                      textSizeRatio={2}
                      size={size ?? '24px'}
                    />
                  </div>
                  <div className='ml-3'>
                    <div className='d-flex align-items-center'>
                      <b className='d-flex flex-row align-items-center'>
                        <span>{token.displayName} </span>
                        <span>
                          {token.isSPV && (
                            <span className='d-flex flex-row align-items-center ml-1'>
                              (Beta)
                              <MdInfoOutline
                                className='ml-1'
                                id='masternode__item'
                                size={20}
                              />
                              <Tooltip
                                placement='auto'
                                target='masternode__item'
                                isOpen={tooltipOpen}
                                toggle={toggle}
                              >
                                This feature is still in Beta. Please use at your own
                                risk.
                              </Tooltip>
                            </span>
                          )}
                        </span>
                      </b>
                      {!hideBadge && (
                        <Badge className='ml-2' color='disabled'>
                          {token.isLPS ? LP : DST}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
              <Col md='4'>
                <div className='d-flex justify-content-end'>
                  <b className='text-dark'>
                    <NumberMask
                      value={new BigNumber(token.amount || 0).toFixed(8)}
                    />
                  </b>
                </div>
              </Col>
              <Col md='5' className='p-0'>
                <div className={`d-flex justify-content-end`}>
                  <Button
                    title={I18n.t('containers.swap.swapPage.swap')}
                    className={`${styles.icons} ${
                      hideSwap ? styles.visibilityHidden : ''
                    } clickable`}
                    color='link'
                    tag={NavLink}
                    to={`${SWAP_PATH}?${SwapParameters.symbol1}=${token.symbolKey}&${SwapParameters.hash1}=${token.hash}&${SwapParameters.balance1}=${token.amount}`}
                  >
                    <MdSwapHoriz className='clickable'></MdSwapHoriz>
                  </Button>
                  <Button
                    title={I18n.t('containers.wallet.sendPage.send')}
                    tag={NavLink}
                    to={
                      token.symbolKey
                        ? getWalletPathAddress(
                            WALLET_SEND_PATH,
                            token.symbolKey,
                            token.hash || '',
                            (token.amount ?? 0).toString(),
                            '',
                            token.isLPS,
                            token.isSPV,
                            token.displayName,
                            token.isDAT
                          )
                        : WALLET_SEND_PATH
                    }
                    className={`${styles.icons} clickable`}
                    color='link'
                  >
                    <MdArrowUpward className='clickable'></MdArrowUpward>
                  </Button>
                  <Button
                    title={I18n.t('containers.wallet.receivePage.receive')}
                    tag={NavLink}
                    to={
                      token.symbolKey
                        ? getWalletPathAddress(
                            WALLET_RECEIVE_PATH,
                            token.symbolKey,
                            token.hash || '',
                            (token.amount ?? 0).toString(),
                            '',
                            token.isLPS,
                            token.isSPV,
                            token.displayName,
                            token.isDAT
                          )
                        : WALLET_RECEIVE_PATH
                    }
                    className={`${styles.icons} clickable`}
                    color='link'
                  >
                    <MdArrowDownward className='clickable'></MdArrowDownward>
                  </Button>
                  {/* <Button
                    className={`${styles.icons} ${
                      hideMore ? styles.visibilityHidden : ''
                    }`}
                    color='link'
                  >
                    <MdMoreHoriz className='clickable'></MdMoreHoriz>
                  </Button> */}
                </div>
              </Col>
            </Row>
            {token.hash === DFI_SYMBOL && (
              <>
                <Row className={`align-items-center ${styles.utxos} mb-2`}>
                  <Col md='3'>
                    <div className='ml-6'>
                      {I18n.t('containers.wallet.walletPage.utxo')}
                    </div>
                    <div className='ml-6'>
                      {I18n.t('containers.wallet.walletPage.token')}
                    </div>
                  </Col>
                  <Col md='4'>
                    <div className='d-flex justify-content-end'>
                      <NumberMask value={utxos.toFixed(8)} />
                    </div>
                    <div className='d-flex justify-content-end'>
                      <NumberMask
                        value={BigNumber.max(
                          0,
                          new BigNumber(token.amount || 0).minus(utxos)
                        ).toFixed(8)}
                      />
                    </div>
                  </Col>
                </Row>
              </>
            )}
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default BalancesTokenCard;
