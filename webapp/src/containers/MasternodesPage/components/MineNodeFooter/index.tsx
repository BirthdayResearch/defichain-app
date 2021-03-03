import React from 'react';
import { I18n } from 'react-redux-i18n';
import { Row, Col } from 'reactstrap';
import { MasterNodeObject } from '../../masterNodeInterface';

interface MineNodeFooterProps {
  enabledMasternodes: MasterNodeObject[];
}

const MineNodeFooter: React.FunctionComponent<MineNodeFooterProps> = (
  props: MineNodeFooterProps
) => {
  const { enabledMasternodes } = props;

  return (
    <Row>
      <Col>
        <span>
          <small className='text-muted'>
            {I18n.t('containers.masterNodes.masterNodesPage.collateralsActive')}
          </small>
        </span>
        <div className='d-flex align-items-center'>
          <span className={`txn-status-enabled`}></span>
          <span className='ml-2'>{enabledMasternodes.length}</span>
        </div>
      </Col>
      {/* <Col md='2'>
        <span>
          <small className='text-muted'>
            {I18n.t(
              'containers.masterNodes.masterNodesPage.collateralsInactive'
            )}
          </small>
        </span>
        <div className='d-flex align-items-center'>
          <span className={`txn-status-disable`}></span>
          <span className='ml-2'>{enabledMasternodes.length - activeNode}</span>
        </div>
      </Col>
      <Col md='4'>
        <span>
          <small className='text-muted'>
            {I18n.t('containers.masterNodes.masterNodesPage.dFIMinted')}
          </small>
        </span>
        <div>1234,567.89012345</div>
      </Col> */}
    </Row>
  );
};

export default MineNodeFooter;
