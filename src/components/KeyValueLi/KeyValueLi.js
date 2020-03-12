import React, { Component } from 'react';
import {
  Button
} from 'reactstrap';
import {
  MdContentCopy
} from "react-icons/md";
import styles from './KeyValueLi.module.scss';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classnames from 'classnames';

class KeyValueLi extends Component {
  state = {
    copied: false
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

  render() {
    let copyButton;
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

    return (
      <div className={styles.keyValueLi}>
        <span className={styles.label}>
          {this.props.label}
        </span>
        <span className={styles.value}>
          <div className={classnames({ 'd-block': this.state.copied }, styles.copiedIndicator)}>Copied!</div>
          {this.props.value}
          {copyButton}
        </span>
      </div>
    );
  }
}

export default KeyValueLi;