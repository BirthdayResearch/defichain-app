import React, { useState, useEffect } from 'react';
import { I18n } from 'react-redux-i18n';
import { Row, Col } from 'reactstrap';
import cloneDeep from 'lodash/cloneDeep';

import LiquidityAccordion from '../../../../components/LiquidityAccordion';
import { TOKEN_LIST_PAGE_SIZE } from '../../../../constants';

interface LiquidityListProps {
  poolshares: any;
  history: History;
}

const LiquidityList: React.FunctionComponent<LiquidityListProps> = (
  props: LiquidityListProps
) => {
  const defaultPage = 1;
  const [tableData, settableData] = useState<any>([]);
  const [currentPage, setCurrentPage] = useState<number>(defaultPage);
  const { poolshares } = props;
  const pageSize = TOKEN_LIST_PAGE_SIZE;

  function paginate(pageNumber, poolsharesList?: any[]) {
    const clone = cloneDeep(poolsharesList || poolshares);
    const tableData = clone.slice(
      (pageNumber - 1) * pageSize,
      pageNumber * pageSize
    );
    setCurrentPage(pageNumber);
    settableData(tableData);
  }

  useEffect(() => {
    paginate(currentPage);
  }, [poolshares]);

  return (
    <>
      <section>
        <h2>{I18n.t('containers.liquidity.liquidityPage.yourLiquidity')}</h2>
        <Row>
          {tableData.map((poolpair, i) => (
            <Col md='6' key={i}>
              <LiquidityAccordion poolpair={poolpair} history={props.history} />
            </Col>
          ))}
        </Row>
      </section>
    </>
  );
};

export default LiquidityList;
