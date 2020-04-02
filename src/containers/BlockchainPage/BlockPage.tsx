import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import {
  Button,
  Row,
  Col
} from 'reactstrap';
import {
  MdArrowBack,
  MdChevronLeft,
  MdChevronRight
} from "react-icons/md";
import { NavLink } from 'react-router-dom';
import KeyValueLi from '../../components/KeyValueLi/KeyValueLi';
import BlockTxn from './BlockTxn';

class BlockPage extends Component<any,any> {
  state = {
    txns: [
      {
        hash: '70d75e773250f89fc8167b2f32721eec18ccad1a5c05e42ab125bd94a3', time: 'Jan 10, 2020 11:12:25 AM', froms: [
          { address: '1AEgdWjJrEbroURgWmPrXkFdzxGxdF7c4G', amount: 12.58383704 }
        ], tos: [
          { address: '1Hi5j26jwQhT55eFbzepcyabVX1fmF4uRT', amount: 12.58383704 },
          { address: '', amount: 12.58383704 }
        ]
      },
      {
        hash: '05addda8e12b59cf5d2038e5353388405c889a89bdbcd6e99449a33', time: 'Jan 10, 2020 11:12:25 AM', froms: [
          { address: '3DWHAR3zqKmbLdNNUnhuSVhWcBtaAWu65K', amount: 12.58383704 },
          { address: '32wL2qQzrci5fBPcMoBHFQDgJ8wR9f6jb3', amount: 12.58383704 },
        ], tos: [
          { address: 'bc1qfhglnk45c7hyfqc5rf9x02zge37zyjxa9pksn5', amount: 12.58383704 },
          { address: 'bc1qmdzlupyqd5ceh5yucdqglx3pn6jjluy8860llh', amount: 12.58383704 }
        ]
      },
      {
        hash: '99ca03cf717513ca6ff52baabf29dfe1628a785ad396df80208d47dfce', time: 'Jan 10, 2020 11:12:25 AM', froms: [
          { address: '3EKD7BBU6XFzRa95MHzoziK2BaRQ1t4Lcb', amount: 12.58383704 }
        ], tos: [
          { address: '3MzZGbux4SpGsu42H5epfhVzceibZLD3hX', amount: 12.58383704 },
          { address: '32XmnAW5fc5tuh5A8DQh2ArPHUHQzdjwsK', amount: 12.58383704 }
        ]
      },
    ]
  };

  render() {
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>Block {this.props.match.params.height} – DeFi Blockchain Client</title>
        </Helmet>
        <header className="header-bar">
          <Button to="/blockchain" tag={NavLink} color="link" className="header-bar-back">
            <MdArrowBack />
            <span className="d-lg-inline">Blockchain</span>
          </Button>
          <h1>Block {this.props.match.params.height}</h1>
        </header>
        <div className="content">
          <section className="mb-5">
            <Row className="mb-4">
              <Col md="6">
                <KeyValueLi label="Number of transactions" value="2851" />
              </Col>
              <Col md="6">
                <KeyValueLi label="Difficulty" value="13798783827516.416" />
              </Col>
              <Col md="6">
                <KeyValueLi label="Height" value={this.props.match.params.height} />
              </Col>
              <Col md="6">
                <KeyValueLi label="Bits" value="171465f2" />
              </Col>
              <Col md="6">
                <KeyValueLi label="Block reward" value="12.5 DFI" />
              </Col>
              <Col md="6">
                <KeyValueLi label="Version" value="21073676288" />
              </Col>
              <Col md="6">
                <KeyValueLi label="Mined by" value="Miner A" />
              </Col>
              <Col md="6">
                <KeyValueLi label="Nonce" value="353942907" />
              </Col>
              <Col>
                <KeyValueLi label="Block hash" value="00000000000000000003e1bee7555dd5ecfb2d54eaca0650d426e10f640b7f89" copyable="true" />
              </Col>
              <Col>
                <KeyValueLi label="Merkle root" value="2c5030ae78f6201d76f20baf77a3e3" copyable="true" />
              </Col>
            </Row>
            <div className="d-flex justify-content-between">
              <Button
                to={`/blockchain/block/${Number.parseInt(this.props.match.params.height) - 1}`}
                tag={NavLink}
                color="outline-primary" className="header-bar-back"
              >
                <MdChevronLeft />
                <span className="d-lg-inline">
                  {Number.parseInt(this.props.match.params.height) - 1}
                </span>
              </Button>
              <Button
                to={`/blockchain/block/${Number.parseInt(this.props.match.params.height) + 1}`}
                tag={NavLink}
                color="outline-primary" className="header-bar-back"
              >
                <span className="d-lg-inline">
                  {Number.parseInt(this.props.match.params.height) + 1}
                </span>
                <MdChevronRight />
              </Button>
            </div>
          </section>
          <section>
            <h2>Transactions</h2>
            <div>
              {this.state.txns.map((txn) => (
                <BlockTxn txn={txn} />
              ))}
            </div>
          </section>
        </div>
      </div>
    );
  }
}

export default BlockPage;