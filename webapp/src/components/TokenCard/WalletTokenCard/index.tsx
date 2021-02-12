import React from 'react';
import {
  Card,
  CardBody,
  Col,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Row,
  UncontrolledDropdown,
} from 'reactstrap';
import { I18n } from 'react-redux-i18n';

import styles from '../TokenCard.module.scss';
import { IWalletTokenCard } from '../../../utils/interfaces';

import TokenAvatar from '../../TokenAvatar';
import NumberMask from '../../NumberMask';
import BigNumber from 'bignumber.js';
import { MdMoreHoriz, MdRemove } from 'react-icons/md';
import {
  handleCheckToken,
  handleRemoveToken,
} from '../../../containers/WalletPage/service';

interface WalletTokenCardProps {
  token: IWalletTokenCard;
  handleCardClick: (
    symbol: string | null,
    hash: string,
    amount: any,
    address: string,
    isLPS: boolean
  ) => void;
  setwalletTableData?: any;
}

const WalletTokenCard: React.FunctionComponent<WalletTokenCardProps> = (
  props: WalletTokenCardProps
) => {
  const { handleCardClick, token, setwalletTableData } = props;

  return (
    <Row className='align-items-center'>
      <Col md='12'>
        <Card className={styles.tokenBalanceCard}>
          <CardBody className={styles.cardBody}>
            <Row className='align-items-center'>
              <Col
                md='4'
                className={styles.cursor}
                onClick={() =>
                  handleCardClick(
                    token.symbol,
                    token.hash,
                    token.amount,
                    token.address,
                    token.isLPS ?? false
                  )
                }
              >
                <div className='d-flex align-items-center justify-content-start'>
                  <div>
                    <TokenAvatar symbol={token.symbolKey} textSizeRatio={2} />
                  </div>
                  <div className='ml-4'>
                    <div>
                      <b>{token.symbolKey}</b>
                    </div>
                    <div className={styles.cardValue}>
                      {token.isLPS
                        ? `${I18n.t(
                            'containers.tokens.tokensPage.dctLabels.liquidityTokenFor'
                          )} ${token.symbolKey}`
                        : token.name}
                    </div>
                  </div>
                </div>
              </Col>
              <Col
                md='7'
                className={styles.cursor}
                onClick={() =>
                  handleCardClick(
                    token.symbol,
                    token.hash,
                    token.amount,
                    token.address,
                    token.isLPS ?? false
                  )
                }
              >
                <div className={`${styles.cardValue} justify-content-end`}>
                  <b className='text-dark'>
                    <NumberMask
                      value={new BigNumber(token.amount || 0).toFixed(8)}
                    />
                  </b>
                  <span className='ml-2'>{token.symbolKey}</span>
                </div>
              </Col>
              <Col md='1'>
                <UncontrolledDropdown
                  className={`${styles.cardValue} justify-content-end`}
                >
                  <DropdownToggle
                    className='padless'
                    color='link'
                    disabled={handleCheckToken(token)}
                  >
                    <MdMoreHoriz />
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem
                      className={styles.cursor}
                      onClick={() => {
                        const list = handleRemoveToken(token);
                        setwalletTableData(list);
                      }}
                    >
                      <MdRemove />
                      <span>
                        {I18n.t('containers.tokens.tokensPage.remove')}
                      </span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default WalletTokenCard;
