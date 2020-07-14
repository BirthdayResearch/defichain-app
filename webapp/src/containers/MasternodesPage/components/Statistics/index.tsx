import React from 'react';
import { TabPane, Row, Col } from 'reactstrap';
import KeyValueLi from '../../../../components/KeyValueLi';
import StatCard from '../../../../components/StatCard';
import { I18n } from 'react-redux-i18n';
import { getAmountInSelectedUnit } from '../../../../utils/utility';

interface StatisticsTabProps {
  unit: string;
}

const StatisticsTab: React.FunctionComponent<StatisticsTabProps> = (
  props: StatisticsTabProps
) => {
  const { unit } = props;
  return (
    <TabPane tabId='statistics'>
      <section>
        <Row>
          <Col>
            <StatCard
              label={I18n.t(
                'containers.masterNodes.masterNodesPage.weeklyIncome'
              )}
              value={getAmountInSelectedUnit('100', unit)}
              unit={unit}
            />
          </Col>
          <Col>
            <StatCard
              label={I18n.t('containers.masterNodes.masterNodesPage.volume')}
              value={getAmountInSelectedUnit('10000000', unit)}
              unit={unit}
            />
          </Col>
          <Col>
            <StatCard
              label={I18n.t('containers.masterNodes.masterNodesPage.marketCap')}
              value={getAmountInSelectedUnit('100000000', unit)}
              unit={unit}
            />
          </Col>
        </Row>
        <Row className='mb-5'>
          <Col md='6'>
            <KeyValueLi
              label={I18n.t(
                'containers.masterNodes.masterNodesPage.returnPerAnnum'
              )}
              value='6.69%'
            />
          </Col>
          <Col md='6'>
            <KeyValueLi
              label={I18n.t(
                'containers.masterNodes.masterNodesPage.paidRewards'
              )}
              value={`${getAmountInSelectedUnit('8651.0125', unit)} ${unit}`}
            />
          </Col>
          <Col md='6'>
            <KeyValueLi
              label={I18n.t(
                'containers.masterNodes.masterNodesPage.rewardFrequency'
              )}
              value='8d 11h 27m 20s'
            />
          </Col>
          <Col md='6'>
            <KeyValueLi
              label={I18n.t(
                'containers.masterNodes.masterNodesPage.activeMasterNodes'
              )}
              value='4,671'
            />
          </Col>
          <Col md='6'>
            <KeyValueLi
              label={I18n.t('containers.masterNodes.masterNodesPage.supply')}
              value={`${getAmountInSelectedUnit('9281315', unit)} ${unit}`}
            />
          </Col>
          <Col md='6'>
            <KeyValueLi
              label={I18n.t(
                'containers.masterNodes.masterNodesPage.lockedInCollateral'
              )}
              value={`${getAmountInSelectedUnit('4671000', unit)} ${unit}`}
            />
          </Col>
          <Col md='6'>
            <KeyValueLi
              label={I18n.t(
                'containers.masterNodes.masterNodesPage.costPerMasterNode'
              )}
              value={`${getAmountInSelectedUnit('1000', unit)} ${unit}`}
            />
          </Col>
          <Col md='6'>
            <KeyValueLi
              label={I18n.t(
                'containers.masterNodes.masterNodesPage.masternodeWorth'
              )}
              value='65,733.63 USD'
            />
          </Col>
        </Row>
      </section>
      {/* <section>
                <h2>Masternodes map</h2>
                <Card>
                  <MapChart />
                </Card>
              </section> */}
    </TabPane>
  );
};

export default StatisticsTab;
