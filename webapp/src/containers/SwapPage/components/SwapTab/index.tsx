import React from 'react';
import { Row, Col } from 'reactstrap';
import { MdCompareArrows } from 'react-icons/md';

import ToCard from '../../../../components/SwapCard/ToCard';
import FromCard from '../../../../components/SwapCard/FromCard';

interface SwapTabProps {}

const SwapTab: React.FunctionComponent<SwapTabProps> = (
  props: SwapTabProps
) => {
  return (
    <>
      <section>
        <Row>
          <Col md='5'>
            <ToCard />
          </Col>
          <Col md='2' className='text-center vertical-center'>
            <MdCompareArrows />
          </Col>
          <Col md='5'>
            <FromCard />
          </Col>
        </Row>
      </section>
    </>
  );
};

export default SwapTab;
