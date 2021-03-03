import React from 'react';
import { Col, Row, TabPane } from 'reactstrap';
import { MINE } from 'src/constants';
import MineNodeCard from './components/MineNodeCard';

interface MineNodeProps {
  enabledMasternodes: any[];
}

const MineNodeList: React.FunctionComponent<MineNodeProps> = (
  props: MineNodeProps
) => {
  const { enabledMasternodes } = props;

  return (
    <TabPane tabId={MINE}>
      <Row className='align-items-center'>
        {enabledMasternodes.map((data) => (
          <Col md='6' className='mt-5'>
            <MineNodeCard
              hash={data.hash}
              owner={data.ownerAuthAddress}
              operator={data.operatorAuthAddress}
            />
          </Col>
        ))}
      </Row>
    </TabPane>
  );
};

export default MineNodeList;
