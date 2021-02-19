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
import { MINE } from 'src/constants';
import MineNodeCard from './componets/MineNodeCard';

interface MineNodeProps {
  enabledMasternodes: any[];
}

const MineNodeList: React.FunctionComponent<MineNodeProps> = (
  props: MineNodeProps
) => {
  const { enabledMasternodes } = props;
  const mineData = enabledMasternodes.filter((data) => !data.isMyMasternode);

  return (
    <TabPane tabId={MINE}>
      <Row>
        {mineData.map((data) => (
          <MineNodeCard
            owner={data.ownerAuthAddress}
            operator={data.operatorAuthAddress}
          />
        ))}
      </Row>
    </TabPane>
  );
};

export default MineNodeList;
