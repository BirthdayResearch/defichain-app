import React from 'react';
import { Col, Row, TabPane } from 'reactstrap';
import { MINE } from '../../../../constants';
import { MasterNodeObject } from '../../masterNodeInterface';
import MineNodeCard from './components/MineNodeCard';

interface MineNodeProps {
  enabledMasternodes: MasterNodeObject[];
}

const MineNodeList: React.FunctionComponent<MineNodeProps> = (
  props: MineNodeProps
) => {
  const { enabledMasternodes } = props;

  return (
    <TabPane tabId={MINE}>
      <Row className='align-items-center'>
        {enabledMasternodes.map((data) => (
          <Col key={data.hash} md='6' className='mt-5'>
            <MineNodeCard
              hash={data.hash}
              owner={data.ownerAuthAddress}
              operator={data.operatorAuthAddress}
              isEnabled={data.isEnabled}
            />
          </Col>
        ))}
      </Row>
    </TabPane>
  );
};

export default MineNodeList;
