import React from 'react';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { I18n } from 'react-redux-i18n';
import {
  Card,
  CardBody,
  CardTitle,
  CardText,
  Row,
  Col,
  TabPane,
} from 'reactstrap';
import styles from './MineNodeList.module.scss';
import { MINE } from 'src/constants';

interface MineNodeProps {
  MineNodeData: any[];
}

const MineNodeList: React.FunctionComponent<MineNodeProps> = (
  props: MineNodeProps
) => {
  const { MineNodeData } = props;

  return (
    <TabPane tabId={MINE}>
      <Row>
        {MineNodeData.map((mineData, i) => (
          <Col md='6' className='mt-5'>
            <Card>
              <CardBody>
                <Row>
                  <Col md='1' className={styles.status}>
                    <span
                      className={`txn-status-${mineData.active} mt-1`}
                    ></span>
                  </Col>
                  <Col md='9' className='pl-0'>
                    <CardTitle tag='h5'>{mineData.mineName} </CardTitle>
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
                      <small className='text-muted'>{mineData.owner}</small>
                    </CardText>
                  </Col>
                </Row>
                <Row>
                  <Col md='4'>
                    <CardText>
                      {I18n.t(
                        'containers.masterNodes.masterNodesPage.operator'
                      )}
                    </CardText>
                  </Col>
                  <Col md='8'>
                    <CardText>
                      <small className='text-muted'>{mineData.operator}</small>
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
                      <small className='text-muted'>{mineData.type}</small>
                    </CardText>
                  </Col>
                  <Col md='4'>
                    <CardText>
                      {I18n.t(
                        'containers.masterNodes.masterNodesPage.collaterals'
                      )}
                    </CardText>
                  </Col>
                  <Col md='8'>
                    <CardText>
                      <small className='text-muted'>
                        {mineData.collaterals}
                      </small>
                    </CardText>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </TabPane>
  );
};

export default MineNodeList;
