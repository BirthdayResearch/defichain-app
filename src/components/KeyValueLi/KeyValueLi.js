import React, { Component } from 'react';
import {
  Button,
  Popover,
  PopoverBody
} from 'reactstrap';
import {
  MdContentCopy
} from "react-icons/md";
import {
  AiOutlineQrcode
} from "react-icons/ai";
import styles from './KeyValueLi.module.scss';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classnames from 'classnames';

const QRCode = require('qrcode.react');

class KeyValueLi extends Component {
  state = {
    copied: false,
    qrOpen: false
  }

  handleCopy = () => {
    this.setState({
      copied: true
    });
    setTimeout(() => {
      this.setState({
        copied: false
      });
    }, 600);
  }

  toggleQR = () => {
    this.setState({
      qrOpen: !this.state.qrOpen
    })
  }

  render() {
    let copyButton, qrButton;
    if (this.props.copyable) {
      copyButton = (
        <CopyToClipboard text={this.props.value}>
          <Button
            color="link" size="sm"
            className="padless ml-2"
            onClick={this.handleCopy}
          >
            <MdContentCopy />
          </Button>
        </CopyToClipboard>
      );
    }

    if (this.props.popsQR) {
      qrButton = (
        <>
          <Button
            color="link" size="sm"
            className="padless ml-2"
            onClick={this.toggleQR}
            id={this.props.uid}
          >
            <AiOutlineQrcode />
          </Button>
          <Popover placement="auto" isOpen={this.state.qrOpen} target={this.props.uid} toggle={this.toggleQR}>
            <PopoverBody>
              <QRCode
                value={this.props.value}
                size={240}
                className={styles.qr}
              />
            </PopoverBody>
          </Popover>
        </>
      );
    }

    return (
      <div className={styles.keyValueLi}>
        <div className={styles.label}>
          {this.props.label}
        </div>
        <div className={styles.value}>
          <div className={classnames({ 'd-flex': this.state.copied }, styles.copiedIndicator)}>Copied!</div>
          <div>
            {this.props.value}
          </div>
          {qrButton}
          {copyButton}
        </div>
      </div>
    );
  }
}

export default KeyValueLi;