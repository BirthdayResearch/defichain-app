import React from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import { Card, CardBody, Row, Col, CardTitle, CardText } from 'reactstrap';
import { SAME_AS_OWNER_ADDRESS } from 'src/constants';
import styles from '../../MineNodeList.module.scss';
import EllipsisText from 'react-ellipsis-text';

interface MineNodCardeProps {
  owner: string;
  operator: string;
}

const MineNodeCard: React.FunctionComponent<MineNodCardeProps> = (
  props: MineNodCardeProps
) => {
  const { owner, operator } = props;

  return (
    <Col md='6' className='mt-5'>
      <Card>
        <CardBody>
          <Row>
            <Col md='1' className={styles.status}>
              <span className={`txn-status-enabled mt-1`}></span>
            </Col>
            <Col md='9' className='pl-0'>
              <CardTitle tag='h5'>Holden </CardTitle>
            </Col>
            <Col md='2'>
              <div className={styles.arrow}>
                <MdKeyboardArrowRight size={25} />
              </div>
            </Col>
          </Row>
          <Row>
            <Col md='4'>
              <CardText>
                {I18n.t('containers.masterNodes.masterNodesPage.owner')}
              </CardText>
            </Col>
            <Col md='8'>
              <CardText>
                <small className='text-muted'>
                  <EllipsisText text={owner} length={25} />
                </small>
              </CardText>
            </Col>
          </Row>
          <Row>
            <Col md='4'>
              <CardText>
                {I18n.t('containers.masterNodes.masterNodesPage.operator')}
              </CardText>
            </Col>
            <Col md='8'>
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
            <Col md='4'>
              <CardText>
                {I18n.t('containers.masterNodes.masterNodesPage.type')}
              </CardText>
            </Col>
            <Col md='8'>
              <CardText>
                <small className='text-muted'>local</small>
              </CardText>
            </Col>
            <Col md='4'>
              <CardText>
                {I18n.t('containers.masterNodes.masterNodesPage.collaterals')}
              </CardText>
            </Col>
            <Col md='8'>
              <CardText>
                <small className='text-muted'>2</small>
              </CardText>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default MineNodeCard;
