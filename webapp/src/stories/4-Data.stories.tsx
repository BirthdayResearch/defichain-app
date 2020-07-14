import React from 'react';
import '../app/App.scss';
import { Row, Col, Card, Table } from 'reactstrap';
import StatCard from '../components/StatCard';
import KeyValueLi from '../components/KeyValueLi';

export default {
  title: 'Data display',
};

export const StatCards = () => (
  <div className='container mt-5'>
    <h2>2 per row</h2>
    <Row>
      <Col>
        <StatCard label='Available balance' value='1,000' unit='DFI' />
      </Col>
      <Col>
        <StatCard label='Pending' value='1,000' unit='DFI' />
      </Col>
    </Row>

    <h2>3 per row</h2>
    <Row>
      <Col>
        <StatCard label='Weekly income' value='100' unit='DFI' />
      </Col>
      <Col>
        <StatCard label='Volume' value='10m' unit='DFI' />
      </Col>
      <Col>
        <StatCard label='Market cap' value='100m' unit='DFI' />
      </Col>
    </Row>
  </div>
);

export const Tables = () => (
  <div className='container mt-5'>
    <Card className='table-responsive-md'>
      <Table>
        <thead>
          <tr>
            <th>TH A</th>
            <th>TH B</th>
            <th>TH C</th>
            <th>TH D</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>TD A1</td>
            <td>TD B1</td>
            <td>TD C1</td>
            <td>TD D1</td>
          </tr>
          <tr>
            <td>TD A2</td>
            <td>TD B2</td>
            <td>TD C2</td>
            <td>TD D2</td>
          </tr>
          <tr>
            <td>TD A3</td>
            <td>TD B3</td>
            <td>TD C3</td>
            <td>TD D3</td>
          </tr>
        </tbody>
      </Table>
    </Card>
  </div>
);

export const KeyValueList = () => (
  <div className='container mt-5'>
    <h2>1 column</h2>
    <div className='mb-5'>
      <KeyValueLi label='Key' value='value' />
      <KeyValueLi label='Key' value='value' />
      <KeyValueLi label='Key' value='value' />
    </div>

    <h2>2 columns</h2>
    <Row className='mb-5'>
      <Col md='6'>
        <KeyValueLi label='Return per annum' value='6.69%' />
      </Col>
      <Col md='6'>
        <KeyValueLi label='Paid rewards' value='8651.0125 DFI' />
      </Col>
      <Col md='6'>
        <KeyValueLi label='Reward frequency' value='8d 11h 27m 20s' />
      </Col>
      <Col md='6'>
        <KeyValueLi label='Active masternodes' value='4,671' />
      </Col>
      <Col md='6'>
        <KeyValueLi label='Supply' value='9,281,315 DFI' />
      </Col>
      <Col md='6'>
        <KeyValueLi label='Locked in collateral' value='4,671,000 DFI' />
      </Col>
      <Col md='6'>
        <KeyValueLi label='Cost per masternode' value='1,000 DFI' />
      </Col>
      <Col md='6'>
        <KeyValueLi label='Masternode worth' value='65,733.63 USD' />
      </Col>
    </Row>

    <h2>Mixed</h2>
    <Row className='mb-5'>
      <Col md='6'>
        <KeyValueLi label='Number of transactions' value='2851' />
      </Col>
      <Col md='6'>
        <KeyValueLi label='Difficulty' value='13798783827516.416' />
      </Col>
      <Col md='6'>
        <KeyValueLi label='Height' value='123456' />
      </Col>
      <Col md='6'>
        <KeyValueLi label='Bits' value='171465f2' />
      </Col>
      <Col md='6'>
        <KeyValueLi label='Block reward' value='12.5 DFI' />
      </Col>
      <Col md='6'>
        <KeyValueLi label='Version' value='21073676288' />
      </Col>
      <Col md='6'>
        <KeyValueLi label='Mined by' value='Miner A' />
      </Col>
      <Col md='6'>
        <KeyValueLi label='Nonce' value='353942907' />
      </Col>
      <Col>
        <KeyValueLi
          label='Block hash'
          value='00000000000000000003e1bee7555dd5ecfb2d54eaca0650d426e10f640b7f89'
          copyable='true'
        />
      </Col>
      <Col>
        <KeyValueLi
          label='Merkle root'
          value='2c5030ae78f6201d76f20baf77a3e3'
          copyable='true'
        />
      </Col>
    </Row>
  </div>
);
