import React, { Component } from 'react';
import { Helmet } from "react-helmet";
import ChaplinGif from '../../assets/gif/chaplin.gif';
import {
  Row,
  Col,
  Button
} from 'reactstrap';
import styles from './ErrorPage.module.scss';

class Error404Page extends Component<any,any> {
  render() {
    const chaplinStyle = {
      backgroundImage: 'url(' + ChaplinGif + ')',
      backgroundSize: 'cover'
    }
    return (
      <div className="main-wrapper">
        <Helmet>
          <title>DFI Block Processing Center – DeFi Blockchain Client</title>
        </Helmet>
        <header className="header-bar">
          <h1>DFI Block Processing Center</h1>
        </header>
        <div className="content" style={chaplinStyle}>
          
        </div>
        <footer className={`footer-bar ${styles.dark}`}>
          <Row className="justify-content-between align-items-center">
            <Col>
              <p>It seems you have stumbled here by accident. This is where our workers make sure every DFI block is properly fastened to the chain. As this is a restricted area, we kindly ask that you turn around.</p>
            </Col>
            <Col className="col-auto">
              <Button
                color="primary"
                onClick={this.props.history.goBack}
              >
                Go back
              </Button>
            </Col>
          </Row>
        </footer>
      </div>
    );
  }
}

export default Error404Page;