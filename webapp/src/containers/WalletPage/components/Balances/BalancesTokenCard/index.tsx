import React from 'react';
import {
  Button,
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
import {
  MdArrowDownward,
  MdArrowUpward,
  MdMoreHoriz,
  MdRemove,
  MdSwapHoriz,
} from 'react-icons/md';
import { IToken } from '../../../../../utils/interfaces';

interface BalancesTokenCardProps {
  token: IToken;
  size?: string;
  onCardClick?: (token: IToken) => void;
}

const BalancesTokenCard: React.FunctionComponent<BalancesTokenCardProps> = (
  props: BalancesTokenCardProps
) => {
  const { onCardClick, token, size } = props;

  return (
    <Row className='align-items-center balanceTokenCard'>
      <Col md='12'>
        <Card>
          <CardBody className={styles.cardBody}>
            <Row className='align-items-center'>
              <Col md='3'>
                <div className='d-flex align-items-center justify-content-start'>
                  <div>
                    <TokenAvatar
                      symbol={token.symbolKey}
                      textSizeRatio={2}
                      size={size ?? '24px'}
                    />
                  </div>
                  <div className='ml-3'>
                    <div>
                      <b>{token.symbolKey}</b>
                    </div>
                  </div>
                </div>
              </Col>
              <Col md='5'>
                <div>
                  <b className='text-dark'>
                    <NumberMask
                      value={new BigNumber(token.amount || 0).toFixed(8)}
                    />
                  </b>
                </div>
              </Col>
              <Col md='4' className='p-0'>
                <div className={`d-flex justify-content-end`}>
                  <Button className={styles.icons} color='link'>
                    <MdSwapHoriz></MdSwapHoriz>
                  </Button>
                  <Button className={styles.icons} color='link'>
                    <MdArrowUpward></MdArrowUpward>
                  </Button>
                  <Button className={styles.icons} color='link'>
                    <MdArrowDownward></MdArrowDownward>
                  </Button>
                  <Button className={styles.icons} color='link'>
                    <MdMoreHoriz></MdMoreHoriz>
                  </Button>
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
