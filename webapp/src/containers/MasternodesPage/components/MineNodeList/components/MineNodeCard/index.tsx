import React from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import { Card, CardBody, Row, Col, CardTitle, CardText } from 'reactstrap';
import {
  MASTER_NODES_PATH,
  MINIMUM_DFI_AMOUNT_FOR_MASTERNODE,
  SAME_AS_OWNER_ADDRESS,
} from '../../../../../../constants';
import styles from '../../MineNodeList.module.scss';
import EllipsisText from 'react-ellipsis-text';
import { history } from '../../../../../../utils/history';
import NumberMask from '../../../../../../components/NumberMask';

interface MineNodeCardProps {
  hash: string;
  owner: string;
  operator: string;
  isEnabled?: boolean;
}

const MineNodeCard: React.FunctionComponent<MineNodeCardProps> = (
  props: MineNodeCardProps
) => {
  const { owner, operator, hash, isEnabled } = props;

  return (
    <Card
      className={styles.cursor}
      onClick={() => history.push(`${MASTER_NODES_PATH}/${hash}`)}
    >
      <CardBody>
        <Row>
          <Col xs='1' className={styles.status}>
            <span
              className={`txn-status-${isEnabled ? `enabled` : `disable`} mt-1`}
            ></span>
          </Col>
          <Col xs='8' className='pl-0'>
            <CardTitle tag='h5'>
              {operator.substring(operator.length - 4)}
            </CardTitle>
          </Col>
          <Col xs='1'>
            <div className={styles.arrow}>
              <MdKeyboardArrowRight size={25} />
            </div>
          </Col>
        </Row>
        <Row>
          <Col>
            <CardText>
              {I18n.t('containers.masterNodes.masterNodesPage.owner')}
            </CardText>
          </Col>
          <Col>
            <CardText>
              <small className='text-muted'>
                <EllipsisText text={owner} length={25} />
              </small>
            </CardText>
          </Col>
        </Row>
        <Row>
          <Col>
            <CardText>
              {I18n.t('containers.masterNodes.masterNodesPage.operator')}
            </CardText>
          </Col>
          <Col>
            <CardText>
              <small className='text-muted'>
                <EllipsisText
                  text={operator === owner ? SAME_AS_OWNER_ADDRESS : operator}
                  length={25}
                />
              </small>
            </CardText>
          </Col>
        </Row>
        <Row className='mt-3'>
          <Col>
            <CardText>
              {I18n.t('containers.masterNodes.masterNodesPage.type')}
            </CardText>
          </Col>
          <Col>
            <CardText>
              <small className='text-muted'>Local</small>
            </CardText>
          </Col>
        </Row>
        <Row>
          <Col>
            <CardText>
              {I18n.t('containers.masterNodes.masterNodesPage.collateral')}
            </CardText>
          </Col>
          <Col>
            <CardText>
              <small className='text-muted'>
                <NumberMask
                  value={MINIMUM_DFI_AMOUNT_FOR_MASTERNODE.toString()}
                />
                <span> DFI</span>
              </small>
            </CardText>
          </Col>
        </Row>
      </CardBody>
    </Card>
  );
};

export default MineNodeCard;
