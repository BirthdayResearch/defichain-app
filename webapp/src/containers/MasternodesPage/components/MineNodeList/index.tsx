import React from 'react';
import { Row, TabPane } from 'reactstrap';
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
      <Row>
        {enabledMasternodes.map((data) => (
          <MineNodeCard
            hash={data.hash}
            owner={data.ownerAuthAddress}
            operator={data.operatorAuthAddress}
          />
        ))}
      </Row>
    </TabPane>
  );
};

export default MineNodeList;
