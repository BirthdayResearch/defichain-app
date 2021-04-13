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

import styles from '../Balances.module.scss';

import TokenAvatar from '../../../../../components/TokenAvatar';
import NumberMask from '../../../../../components/NumberMask';
import BigNumber from 'bignumber.js';
import { MdMoreHoriz, MdRemove } from 'react-icons/md';
import { IToken } from '../../../../../utils/interfaces';

interface BalancesTokenCardProps {
  token: IToken;
  onCardClick: (token: IToken) => void;
}

const BalancesTokenCard: React.FunctionComponent<BalancesTokenCardProps> = (
  props: BalancesTokenCardProps
) => {
  const { onCardClick, token } = props;

  return (
    <Row className='align-items-center'>
      <Col md='12'>
        <Card>
          <CardBody>
            <Row className='align-items-center'>
              <Col md='4' onClick={() => onCardClick(token)}>
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
              <Col md='7'>
                <div className={`${styles.cardValue} justify-content-end`}>
                  <b className='text-dark'>
                    <NumberMask
                      value={new BigNumber(token.amount || 0).toFixed(8)}
                    />
                  </b>
                  <span className='ml-2'>{token.symbolKey}</span>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default BalancesTokenCard;
